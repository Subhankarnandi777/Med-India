export const API_URL = "http://localhost:8000/api";

export async function login(email, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json();
}

export async function register(userData) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  if (!res.ok) throw new Error("Registration failed");
  return res.json();
}

export async function verifyOtp(email, otp) {
  const res = await fetch(`${API_URL}/auth/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });
  if (!res.ok) throw new Error("OTP Verification failed");
  return res.json();
}

export async function fetchMedicines() {
  const res = await fetch(`${API_URL}/medicines`);
  if (!res.ok) throw new Error("Failed to fetch medicines");
  return res.json();
}

export async function fetchOrders() {
  const res = await fetch(`${API_URL}/orders`);
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
}

export async function createOrder(orderData) {
  const res = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  });
  if (!res.ok) throw new Error("Failed to create order");
  return res.json();
}

export async function fetchPayouts() {
  const res = await fetch(`${API_URL}/payouts`);
  if (!res.ok) throw new Error("Failed to fetch payouts");
  return res.json();
}

export async function fetchPrescriptions() {
  const res = await fetch(`${API_URL}/prescriptions`);
  if (!res.ok) throw new Error("Failed to fetch prescriptions");
  return res.json();
}

export async function createPrescription(rxData) {
  const res = await fetch(`${API_URL}/prescriptions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(rxData),
  });
  if (!res.ok) throw new Error("Failed to create prescription");
  return res.json();
}
