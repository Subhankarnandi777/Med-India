from pydantic import BaseModel
from typing import List, Optional

class Medicine(BaseModel):
    id: str
    name: str
    genericName: str
    price: float
    stock: int
    category: str
    requiresPrescription: bool

class Profile(BaseModel):
    id: str
    email: str
    name: str
    role: str
    mobile: str

class OrderItem(BaseModel):
    name: str
    quantity: int
    price: float

class Order(BaseModel):
    id: str
    patientName: str
    items: List[OrderItem]
    status: str
    createdAt: str
    prescriptionUrl: Optional[str] = None

class OrderCreate(BaseModel):
    patientName: str
    items: List[OrderItem]

class Payout(BaseModel):
    id: str
    amount: float
    status: str
    createdAt: str

class Prescription(BaseModel):
    id: str
    patientName: str
    doctorName: str
    medicines: List[OrderItem]
    createdAt: str
    instructions: str

class PrescriptionCreate(BaseModel):
    patientName: str
    doctorName: str
    medicines: List[OrderItem]
    instructions: str

class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    email: str
    password: str
    name: str
    role: str
    mobile: str

class VerifyOtpRequest(BaseModel):
    email: str
    otp: str
