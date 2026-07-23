// src/services/api.js

import {
  signIn,
  signUp,
  verifyOtp as verifyOtpNeon,
  resendOtp,
  forgotPassword,
  changePassword,
  logout,
  getProfile,
  updateProfile,
  getToken,
} from "./neonAuth";

export const API_URL = "http://localhost:8000/api";

// ---------- AUTH ----------

export const login = signIn;
export const register = signUp;
export const verifyOtp = verifyOtpNeon;






export { resendOtp };
export { forgotPassword };
export { changePassword };
export { logout };
export { getProfile };
export { updateProfile };
export { getToken };

// ---------- EXISTING BACKEND APIs ----------

export async function fetchMedicines() {
  const res = await fetch(`${API_URL}/medicines/`);
  if (!res.ok) throw new Error("Failed to fetch medicines");
  const data = await res.json();
  return data.map(med => ({
    ...med,
    generic_name: med.genericName !== undefined ? med.genericName : med.generic_name,
    requires_prescription: med.requiresPrescription !== undefined ? med.requiresPrescription : med.requires_prescription
  }));
}

export async function fetchOrders() {
  const token = getToken();
  const headers = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_URL}/orders/`, { headers });
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
}

export async function createOrder(orderData) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_URL}/orders/`, {
    method: "POST",
    headers,
    body: JSON.stringify(orderData),
  });

  if (!res.ok) throw new Error("Failed to create order");

  return res.json();
}

export async function fetchPayouts() {
  const res = await fetch(`${API_URL}/payouts/`);
  if (!res.ok) throw new Error("Failed to fetch payouts");
  return res.json();
}

export async function fetchPrescriptions() {
  const res = await fetch(`${API_URL}/prescriptions/`);
  if (!res.ok) throw new Error("Failed to fetch prescriptions");
  return res.json();
}

export async function createPrescription(rxData) {
  const res = await fetch(`${API_URL}/prescriptions/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(rxData),
  });

  if (!res.ok) throw new Error("Failed to create prescription");

  return res.json();
}

export async function cancelOrder(orderId) {
  const token = getToken();
  const headers = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_URL}/orders/${orderId}/cancel`, {
    method: "PATCH",
    headers,
  });
  if (!res.ok) throw new Error("Failed to cancel order");
  return res.json();
}