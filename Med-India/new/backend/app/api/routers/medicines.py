from fastapi import APIRouter, Depends
from typing import List
from sqlalchemy.orm import Session
from app.schemas import Medicine
from app.db import models
from app.db.database import get_db

router = APIRouter()

@router.get("/", response_model=List[Medicine])
def get_medicines(db: Session = Depends(get_db)):
    db_medicines = db.query(models.Medicine).all()
    result = []
    for med in db_medicines:
        result.append(Medicine(
            id=str(med.id),
            name=med.name,
            genericName=med.generic_name,
            price=med.price,
            stock=med.stock,
            category=med.category,
            requiresPrescription=med.requires_prescription
        ))
    return result

