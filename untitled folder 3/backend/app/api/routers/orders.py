from fastapi import APIRouter
from typing import List
import datetime
from app.schemas import Order, OrderCreate
from app.db.mock_db import mock_orders

router = APIRouter()

@router.get("/", response_model=List[Order])
def get_orders():
    return mock_orders

@router.post("/", response_model=Order)
def create_order(req: OrderCreate):
    order = {
        "id": f"ORD-{len(mock_orders)+1000}",
        "patientName": req.patientName,
        "items": [item.dict() for item in req.items],
        "status": "Pending",
        "createdAt": datetime.datetime.utcnow().isoformat() + "Z",
        "prescriptionUrl": None
    }
    mock_orders.append(order)
    return order
