from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routers import auth, medicines, orders, payouts, prescriptions

app = FastAPI(title="Med-India Backend API", redirect_slashes=False)

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
