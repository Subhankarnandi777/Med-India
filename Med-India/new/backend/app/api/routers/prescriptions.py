from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import datetime
import uuid
import os
import shutil
from app.schemas import Prescription, PrescriptionCreate
from app.db.mock_db import mock_prescriptions
from app.db.database import get_db
from app.db.models import PrescriptionUpload

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

@router.post("/upload")
async def upload_prescription(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    file_ext = file.filename.split(".")[-1]
    file_id = str(uuid.uuid4())
    file_name = f"{file_id}.{file_ext}"
    file_path = os.path.join("uploads", "prescriptions", file_name)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    db_upload = PrescriptionUpload(
        id=uuid.UUID(file_id),
        file_path=f"/uploads/prescriptions/{file_name}",
        status="VERIFIED", # Auto verify for demo purposes
        uploaded_at=datetime.datetime.utcnow()
    )
    
    db.add(db_upload)
    try:
        db.commit()
        db.refresh(db_upload)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
        
    return {
        "id": str(db_upload.id),
        "file_path": db_upload.file_path,
        "status": db_upload.status,
        "message": "Prescription uploaded successfully"
    }
