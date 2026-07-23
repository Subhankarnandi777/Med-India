from fastapi import APIRouter, Depends
from typing import List
from sqlalchemy.orm import Session
from app.schemas import Payout
from app.db import models
from app.db.database import get_db

router = APIRouter()

@router.get("/", response_model=List[Payout])
def get_payouts(db: Session = Depends(get_db)):
    db_payouts = db.query(models.Payout).all()
    result = []
    for payout in db_payouts:
        result.append(Payout(
            id=payout.id,
            amount=payout.amount,
            status=payout.status,
            createdAt=payout.created_at.isoformat().replace("+00:00", "Z") if payout.created_at else ""
        ))
    return result

