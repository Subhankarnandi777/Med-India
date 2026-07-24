import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';

// Seller Portal Imports
import SellerLayout from './components/SellerLayout';
import SellerOverview from './pages/seller/Overview';
import SellerInventory from './pages/seller/Inventory';
import SellerOrders from './pages/seller/Orders';
import SellerEarnings from './pages/seller/Earnings';
import SellerSettings from './pages/seller/Settings';

function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function RoleRouter() {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" replace />;
  
  switch(user.role) {
    case 'Patient': return <PatientDashboard />;
    case 'Seller': return <Navigate to="/seller" replace />;
    case 'Doctor': return <DoctorDashboard />;
    default: return <Navigate to="/login" replace />;
  }
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<RoleRouter />} />
          
          {/* Seller Portal Routes */}
          <Route path="/seller" element={<ProtectedRoute allowedRoles={['Seller']}><SellerLayout /></ProtectedRoute>}>
            <Route index element={<SellerOverview />} />
            <Route path="inventory" element={<SellerInventory />} />
            <Route path="orders" element={<SellerOrders />} />
            <Route path="earnings" element={<SellerEarnings />} />
            <Route path="settings" element={<SellerSettings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
