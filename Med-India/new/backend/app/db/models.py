from sqlalchemy import Column, String, DateTime
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = "profiles"   # <-- verify this is your actual table name

    id = Column(UUID(as_uuid=True), primary_key=True)
    email = Column(String)
    full_name = Column(String)
    role = Column(String)
    mobile = Column(String)
    extra_details = Column(JSONB)
    created_at = Column(DateTime)
    password_hash = Column(String)

class PrescriptionUpload(Base):
    __tablename__ = "prescription_uploads"

    id = Column(UUID(as_uuid=True), primary_key=True)
    user_id = Column(UUID(as_uuid=True)) # In a real app, ForeignKey("profiles.id")
    file_path = Column(String)
    status = Column(String, default="PENDING")
    uploaded_at = Column(DateTime)