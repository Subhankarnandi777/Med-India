from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Form,
    Depends,
    HTTPException,
)
import uuid
from pathlib import Path
from app.core.security import get_current_user
from typing import List
import datetime
import random
from sqlalchemy.orm import Session
from sqlalchemy import Column, String, Integer, Boolean, JSON, DateTime
from app.schemas import Prescription, PrescriptionCreate, OrderItem
from app.db import models
from app.db.database import get_db

UPLOAD_DIR = Path("uploads/prescriptions")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

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

@router.post("/upload")
async def upload_prescription(
    file: UploadFile = File(...),
    notes: str = Form(""),
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        # 1. Save the file to disk
        extension = Path(file.filename).suffix
        filename = f"{uuid.uuid4()}{extension}"
        filepath = UPLOAD_DIR / filename

        with open(filepath, "wb") as buffer:
            buffer.write(await file.read())

        now = datetime.datetime.utcnow()
        patient_name = current_user.get("full_name") or current_user.get("email") or "Patient"
        user_id = current_user["id"]

        # 2. Check if the patient already uploaded a prescription using their Neon UUID
        existing_rx = db.query(models.Prescription).filter(models.Prescription.user_id == user_id).first()

        if existing_rx:
            # 👉 PATIENT IS CHANGING THEIR PRESCRIPTION: Update their existing file!
            existing_rx.file_name = filename
            existing_rx.instructions = notes
            existing_rx.created_at = now
            existing_rx.doctor_name = "Pending Review"  # Reset for new doctor review
            existing_rx.medicines = []                  # Clear old medicines
            db_rx = existing_rx
        else:
            # 👉 FIRST TIME UPLOAD: Generate a unique RX-XXXX code!
            new_id = f"RX-{random.randint(1000, 9999)}"
            while db.query(models.Prescription).filter(models.Prescription.id == new_id).first():
                new_id = f"RX-{random.randint(1000, 9999)}"

            db_rx = models.Prescription(
                id=new_id,          # Normal Prescription ID (e.g., RX-4921)
                user_id=user_id,    # Patient's Neon Auth UUID
                patient_name=patient_name,
                doctor_name="Pending Review",
                medicines=[],
                instructions=notes,
                created_at=now,
                file_name=filename
            )
            db.add(db_rx)

        # 3. Save to PostgreSQL!
        db.commit()
        db.refresh(db_rx)

        return {
            "success": True,
            "id": db_rx.id,
            "user_id": str(db_rx.user_id),
            "filename": filename,
            "notes": notes,
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))