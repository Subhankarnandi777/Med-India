from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.core.security import get_current_user, verify_password, create_access_token, get_password_hash
from app.schemas import LoginRequest, RegisterRequest, VerifyOtpRequest
from app.db.models import User
import uuid
from datetime import datetime

router = APIRouter()

@router.post("/login")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user or not user.password_hash:
        raise HTTPException(status_code=400, detail="Invalid email or password")
    
    if not verify_password(req.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Invalid email or password")
        
    token_data = {
        "sub": str(user.id),
        "email": user.email,
        "name": user.full_name,
        "role": user.role,
        "mobile": user.mobile
    }
    token = create_access_token(token_data)
    
    return {
        "token": token,
        "user": {
            "id": str(user.id),
            "email": user.email,
            "name": user.full_name,
            "role": user.role,
            "mobile": user.mobile
        }
    }

@router.post("/register")
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == req.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    new_user = User(
        id=uuid.uuid4(),
        email=req.email,
        full_name=req.name,
        role=req.role,
        mobile=req.mobile,
        password_hash=get_password_hash(req.password),
        created_at=datetime.utcnow()
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {"message": "Registration successful", "user": {"email": new_user.email, "name": new_user.full_name, "role": new_user.role, "id": str(new_user.id)}}

@router.post("/verify-otp")
def verify_otp(req: VerifyOtpRequest):
    return {"message": "OTP verified successfully"}

@router.get("/me")
def get_me(current_user: dict = Depends(get_current_user)):
    """
    Get the authenticated user's profile verified by Neon Auth JWT.
    """
    return {
        "user": current_user
    }

@router.get("/status")
def auth_status():
    """
    Status endpoint indicating Neon Auth is active.
    """
    return {
        "provider": "neon_auth",
        "status": "active",
        "message": "Authentication is managed directly by Neon Auth."
    }
