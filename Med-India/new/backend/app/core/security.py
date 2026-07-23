from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
import bcrypt
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import User
from datetime import datetime, timedelta
import os

security_scheme = HTTPBearer(auto_error=False)

SECRET_KEY = os.getenv("JWT_SECRET", "medindia-super-secret-key-change-in-prod")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
    except ValueError:
        return False

def get_password_hash(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_token(token: str) -> dict:
    """
    Decodes the Neon Auth JWT token.
    Reads payload claims (sub/user_id, email, etc.)
    """
    try:
        # Decode without signature verification or verify using algorithm RS256/HS256
        payload = jwt.decode(token, options={"verify_signature": False})
        return payload
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid or expired authentication token: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
    db: Session = Depends(get_db)
):
    if not credentials or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing Authorization header",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token = credentials.credentials
    payload = decode_token(token)
    
    user_id = payload.get("sub") or payload.get("id") or payload.get("user_id")
    email = payload.get("email")
    
    user = None
    if user_id:
        try:
            user = db.query(User).filter(User.id == user_id).first()
        except Exception:
            pass
            
    if not user and email:
        try:
            user = db.query(User).filter(User.email == email).first()
        except Exception:
            pass

    return {
        "id": user_id or (str(user.id) if user else None),
        "email": email or (user.email if user else None),
        "full_name": user.full_name if user else payload.get("name"),
        "role": user.role if user else payload.get("role"),
        "mobile": user.mobile if user else payload.get("mobile"),
        "extra_details": user.extra_details if user else None,
        "token_payload": payload
    }
