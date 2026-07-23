from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import os
from app.api.routers import auth, medicines, orders, payouts, prescriptions
from app.db.database import engine
from app.db import models

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Med-India Backend API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow React app
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(medicines.router, prefix="/api/medicines", tags=["medicines"])
app.include_router(orders.router, prefix="/api/orders", tags=["orders"])
app.include_router(payouts.router, prefix="/api/payouts", tags=["payouts"])
app.include_router(prescriptions.router, prefix="/api/prescriptions", tags=["prescriptions"])

os.makedirs("uploads/prescriptions", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
