from fastapi import APIRouter, Depends, HTTPException
from typing import List
import datetime
import random
from sqlalchemy.orm import Session
from app.schemas import Order, OrderCreate, OrderItem
from app.db import models
from app.db.database import get_db
from app.core.security import get_current_user

router = APIRouter()

@router.get("/", response_model=List[Order])
def get_orders(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    user_role = current_user.get("role")
    user_id = current_user.get("id")
    
    if user_role == "Patient":
        db_orders = db.query(models.Order).filter(models.Order.patient_id == user_id).all()
    else:
        db_orders = db.query(models.Order).all()
        
    result = []
    for order in db_orders:
        items = [
            OrderItem(name=item["name"], quantity=item["quantity"], price=item["price"])
            for item in (order.items or [])
        ]
        result.append(Order(
            id=order.id,
            patientName=order.patient_name,
            items=items,
            status=order.status,
            createdAt=order.created_at.isoformat().replace("+00:00", "Z") if order.created_at else "",
            prescriptionUrl=order.prescription_url
        ))
    return result

@router.post("/", response_model=Order)
def create_order(
    req: OrderCreate, 
    db: Session = Depends(get_db), 
    current_user: dict = Depends(get_current_user)
):
    new_id = f"ORD-{random.randint(1000, 9999)}"
    while db.query(models.Order).filter(models.Order.id == new_id).first():
        new_id = f"ORD-{random.randint(1000, 9999)}"

    now = datetime.datetime.utcnow()
    items_json = [item.dict() for item in req.items]

    db_order = models.Order(
        id=new_id,
        patient_id=current_user.get("id"),
        patient_name=req.patientName,
        items=items_json,
        status="Pending",
        prescription_url=None,
        created_at=now
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)

    items = [
        OrderItem(name=item["name"], quantity=item["quantity"], price=item["price"])
        for item in (db_order.items or [])
    ]
    return Order(
        id=db_order.id,
        patientName=db_order.patient_name,
        items=items,
        status=db_order.status,
        createdAt=db_order.created_at.isoformat().replace("+00:00", "Z") if db_order.created_at else "",
        prescriptionUrl=db_order.prescription_url
    )


@router.patch("/{order_id}/cancel", response_model=Order)
def cancel_order(
    order_id: str, 
    db: Session = Depends(get_db), 
    current_user: dict = Depends(get_current_user)
):
    db_order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")
        
    if current_user.get("role") == "Patient" and db_order.patient_id != current_user.get("id"):
        raise HTTPException(status_code=403, detail="Not authorized to cancel this order")
    
    if db_order.status != "Pending":
        raise HTTPException(status_code=400, detail="Only Pending orders can be cancelled")
        
    db_order.status = "Cancelled"
    db.commit()
    db.refresh(db_order)
    
    items = [
        OrderItem(name=item["name"], quantity=item["quantity"], price=item["price"])
        for item in (db_order.items or [])
    ]
    return Order(
        id=db_order.id,
        patientName=db_order.patient_name,
        items=items,
        status=db_order.status,
        createdAt=db_order.created_at.isoformat().replace("+00:00", "Z") if db_order.created_at else "",
        prescriptionUrl=db_order.prescription_url
    )


