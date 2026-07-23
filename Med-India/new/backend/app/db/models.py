from sqlalchemy import Column, String, DateTime, Integer, Float, Boolean, BigInteger
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = "profiles"

    id = Column(String, primary_key=True)
    email = Column(String)
    full_name = Column(String)
    role = Column(String)
    mobile = Column(String)
    extra_details = Column(JSONB)
    created_at = Column(DateTime)

class Medicine(Base):
    __tablename__ = "medicines"

    id = Column(BigInteger, primary_key=True, index=True)
    name = Column(String, nullable=False)
    generic_name = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    stock = Column(Integer, nullable=False)
    category = Column(String, nullable=False)
    requires_prescription = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime)

class Order(Base):
    __tablename__ = "orders"

    id = Column(String, primary_key=True, index=True)
    patient_id = Column(String, nullable=True)
    patient_name = Column(String, nullable=False)
    items = Column(JSONB, nullable=False)  # Array of dict (name, quantity, price)
    status = Column(String, nullable=False)
    prescription_url = Column(String, nullable=True)
    created_at = Column(DateTime)

class Payout(Base):
    __tablename__ = "payouts"

    id = Column(String, primary_key=True, index=True)
    amount = Column(Float, nullable=False)
    status = Column(String, nullable=False)
    created_at = Column(DateTime)

class Prescription(Base):
    __tablename__ = "prescriptions"

    id = Column(String, primary_key=True, index=True)
    patient_name = Column(String, nullable=False)
    doctor_name = Column(String, nullable=False)
    medicines = Column(JSONB, nullable=False)  # Array of dict (name, quantity, price)
    instructions = Column(String, nullable=True)
    created_at = Column(DateTime)
    file_name = Column(String, nullable=True)
    user_id = Column(UUID(as_uuid=True), index=True, nullable=True)
