from typing import Dict, List

mock_medicines = [
    {"id": "1", "name": "Paracetamol 500mg", "genericName": "Acetaminophen", "price": 45.0, "stock": 150, "category": "Analgesic", "requiresPrescription": False},
    {"id": "2", "name": "Amoxicillin 250mg", "genericName": "Amoxicillin", "price": 120.0, "stock": 80, "category": "Antibiotic", "requiresPrescription": True},
    {"id": "3", "name": "Atorvastatin 10mg", "genericName": "Atorvastatin", "price": 240.0, "stock": 4, "category": "Cardiovascular", "requiresPrescription": True},
    {"id": "4", "name": "Metformin 500mg", "genericName": "Metformin", "price": 85.0, "stock": 120, "category": "Antidiabetic", "requiresPrescription": True},
    {"id": "5", "name": "Cetirizine 10mg", "genericName": "Cetirizine", "price": 30.0, "stock": 200, "category": "Antihistamine", "requiresPrescription": False},
    {"id": "6", "name": "Ibuprofen 400mg", "genericName": "Ibuprofen", "price": 55.0, "stock": 0, "category": "Analgesic", "requiresPrescription": False},
    {"id": "7", "name": "Daily Multivitamins", "genericName": "Multivitamins & Minerals", "price": 499.0, "stock": 50, "category": "Wellness", "requiresPrescription": False},
    {"id": "8", "name": "Ashwagandha Forte", "genericName": "Ashwagandha Extract", "price": 320.0, "stock": 35, "category": "Ayurveda", "requiresPrescription": False}
]

mock_profiles: Dict[str, dict] = {
    "default_user": {"id": "default_user", "email": "test@medindia.com", "name": "Demo User", "role": "Patient", "mobile": "9876543210"}
}

mock_orders: List[dict] = []

mock_payouts: List[dict] = [
    {"id": "TXN-3912", "amount": 2450.0, "status": "Settled", "createdAt": "2026-06-10T12:00:00Z"},
    {"id": "TXN-3881", "amount": 1890.0, "status": "Settled", "createdAt": "2026-06-08T12:00:00Z"}
]

mock_prescriptions: List[dict] = []
