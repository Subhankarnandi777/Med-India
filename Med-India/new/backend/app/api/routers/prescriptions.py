from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Form,
    Depends,
    HTTPException,
)

from sqlalchemy.orm import Session

from typing import List
import datetime
import uuid
from pathlib import Path

from app.schemas import Prescription, PrescriptionCreate
from app.db.mock_db import mock_prescriptions
from app.db.database import get_db
from app.core.security import get_current_user

UPLOAD_DIR = Path("uploads/prescriptions")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

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
async def upload_prescription(
    file: UploadFile = File(...),
    notes: str = Form(""),
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        extension = Path(file.filename).suffix

        filename = f"{uuid.uuid4()}{extension}"

        filepath = UPLOAD_DIR / filename

        with open(filepath, "wb") as buffer:
            buffer.write(await file.read())

        return {
            "success": True,
            "filename": filename,
            "uploaded_by": current_user["id"],
            "notes": notes,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
