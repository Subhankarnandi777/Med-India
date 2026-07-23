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