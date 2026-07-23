from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import User

security_scheme = HTTPBearer(auto_error=False)

def decode_token(token: str) -> dict:
    """
    Decodes the Neon Auth JWT token.
    Reads payload claims (sub/user_id, email, etc.)
    """
    if not token or token in ("null", "undefined", ""):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or empty authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    try:
        payload = jwt.decode(token, options={"verify_signature": False})
        return payload
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid or expired authentication token: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )

from fastapi import Request

def get_current_user(
    request: Request,
    credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
    db: Session = Depends(get_db)
):
    token = credentials.credentials if credentials else None
    
    user_id = request.headers.get("x-user-id")
    email = request.headers.get("x-user-email")
    payload = {}
    
    if not user_id and token:
        try:
            payload = decode_token(token)
            user_id = payload.get("sub") or payload.get("id") or payload.get("user_id")
            email = payload.get("email") or payload.get("user", {}).get("email") if isinstance(payload.get("user"), dict) else None
        except Exception:
            pass
            
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing Authorization header or invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
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
