from fastapi import APIRouter
from typing import List
from app.schemas import Medicine
from app.db.mock_db import mock_medicines

router = APIRouter()

@router.get("/", response_model=List[Medicine])
def get_medicines():
    return mock_medicines
