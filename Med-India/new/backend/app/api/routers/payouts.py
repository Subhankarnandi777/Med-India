from fastapi import APIRouter
from typing import List
from app.schemas import Payout
from app.db.mock_db import mock_payouts

router = APIRouter()

@router.get("/", response_model=List[Payout])
def get_payouts():
    return mock_payouts
