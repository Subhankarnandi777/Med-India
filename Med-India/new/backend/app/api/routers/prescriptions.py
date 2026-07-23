from fastapi import APIRouter, Depends
from typing import List
import datetime
import random
from sqlalchemy.orm import Session
from app.schemas import Prescription, PrescriptionCreate, OrderItem
from app.db import models
from app.db.database import get_db

router = APIRouter()

@router.get("/", response_model=List[Prescription])
def get_prescriptions(db: Session = Depends(get_db)):
    db_prescriptions = db.query(models.Prescription).all()
    result = []
    for rx in db_prescriptions:
        items = [
            OrderItem(name=item["name"], quantity=item["quantity"], price=item["price"])
            for item in (rx.medicines or [])
        ]
        result.append(Prescription(
            id=rx.id,
            patientName=rx.patient_name,
            doctorName=rx.doctor_name,
            medicines=items,
            createdAt=rx.created_at.isoformat().replace("+00:00", "Z") if rx.created_at else "",
            instructions=rx.instructions or ""
        ))
    return result

@router.post("/", response_model=Prescription)
def create_prescription(req: PrescriptionCreate, db: Session = Depends(get_db)):
    new_id = f"RX-{random.randint(1000, 9999)}"
    while db.query(models.Prescription).filter(models.Prescription.id == new_id).first():
        new_id = f"RX-{random.randint(1000, 9999)}"

    now = datetime.datetime.utcnow()
    items_json = [item.dict() for item in req.medicines]

    db_rx = models.Prescription(
        id=new_id,
        patient_name=req.patientName,
        doctor_name=req.doctorName,
        medicines=items_json,
        instructions=req.instructions,
        created_at=now
    )
    db.add(db_rx)
    db.commit()
    db.refresh(db_rx)

    items = [
        OrderItem(name=item["name"], quantity=item["quantity"], price=item["price"])
        for item in (db_rx.medicines or [])
    ]
    return Prescription(
        id=db_rx.id,
        patientName=db_rx.patient_name,
        doctorName=db_rx.doctor_name,
        medicines=items,
        createdAt=db_rx.created_at.isoformat().replace("+00:00", "Z") if db_rx.created_at else "",
        instructions=db_rx.instructions or ""
    )

