from fastapi import APIRouter
from typing import List
import datetime
from app.schemas import Prescription, PrescriptionCreate
from app.db.mock_db import mock_prescriptions

router = APIRouter()

@router.get("/", response_model=List[Prescription])
def get_prescriptions():
    return mock_prescriptions

@router.post("/", response_model=Prescription)
def create_prescription(req: PrescriptionCreate):
    prescription = {
        "id": f"RX-{len(mock_prescriptions)+1000}",
        "patientName": req.patientName,
        "doctorName": req.doctorName,
        "medicines": [item.dict() for item in req.medicines],
        "createdAt": datetime.datetime.utcnow().isoformat() + "Z",
        "instructions": req.instructions
    }
    mock_prescriptions.append(prescription)
    return prescription
