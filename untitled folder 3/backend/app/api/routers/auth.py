from fastapi import APIRouter, HTTPException
import uuid
from app.schemas import RegisterRequest, LoginRequest, VerifyOtpRequest
from fastapi import Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import User

router = APIRouter()

@router.post("/register")
def register(req: RegisterRequest):
    user_id = str(uuid.uuid4())
    mock_profiles[user_id] = {
        "id": user_id,
        "email": req.email,
        "name": req.name,
        "role": req.role,
        "mobile": req.mobile
    }
    return {"message": "OTP sent to email", "userId": user_id}

@router.post("/login")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()

    if user is None:
        raise HTTPException(status_code=401, detail="Invalid email")

    return {
        "token": f"mock-token-{user.id}",
        "user": {
            "id": str(user.id),
            "email": user.email,
            "name": user.full_name,
            "role": user.role,
            "mobile": user.mobile
        }
    }

@router.post("/verify-otp")
def verify_otp(req: VerifyOtpRequest):
    user = next((u for u in mock_profiles.values() if u["email"] == req.email), None)
    if user:
        return {"token": f"mock-token-{user['id']}", "user": user}
    return {"token": "mock-token-default", "user": mock_profiles["default_user"]}
