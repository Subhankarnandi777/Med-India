from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, Dict, Any
import datetime
from app.db.database import get_db
from app.core.security import get_current_user
from app.db.models import User

router = APIRouter()

class ProfileSaveRequest(BaseModel):
    id: str
    email: str
    full_name: Optional[str] = None
    role: str
    mobile: Optional[str] = None
    extra_details: Optional[Dict[str, Any]] = None

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

@router.get("/profile")
def get_profile(user_id: Optional[str] = None, email: Optional[str] = None, db: Session = Depends(get_db)):
    """
    Get user profile by user_id or email
    """
    if not user_id and not email:
        raise HTTPException(status_code=400, detail="Must provide user_id or email")
    
    query = db.query(User)
    if user_id:
        query = query.filter(User.id == user_id)
    elif email:
        query = query.filter(User.email == email)
    
    user = query.first()
    if not user:
        raise HTTPException(status_code=404, detail="Profile not found")
        
    return {
        "id": str(user.id),
        "email": user.email,
        "full_name": user.full_name,
        "role": user.role,
        "mobile": user.mobile,
        "extra_details": user.extra_details,
        "created_at": user.created_at.isoformat() if user.created_at else None
    }

@router.post("/profile")
def save_profile(req: ProfileSaveRequest, db: Session = Depends(get_db)):
    """
    Save or update user profile directly in PostgreSQL database.
    """
    try:
        user = db.query(User).filter((User.id == req.id) | (User.email == req.email)).first()
        if not user:
            user = User(
                id=req.id,
                email=req.email,
                full_name=req.full_name,
                role=req.role,
                mobile=req.mobile,
                extra_details=req.extra_details,
                created_at=datetime.datetime.utcnow()
            )
            db.add(user)
        else:
            if req.full_name:
                user.full_name = req.full_name
            if req.role:
                user.role = req.role
            if req.mobile:
                user.mobile = req.mobile
            if req.extra_details:
                user.extra_details = req.extra_details
        db.commit()
        db.refresh(user)
        return {
            "id": str(user.id),
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
            "mobile": user.mobile,
            "extra_details": user.extra_details,
            "created_at": user.created_at.isoformat() if user.created_at else None
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save profile: {str(e)}"
        )

