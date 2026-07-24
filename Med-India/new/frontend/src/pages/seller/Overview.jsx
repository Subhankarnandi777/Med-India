import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { fetchOrders, fetchPayouts, fetchMedicines } from '../../services/api';

export default function Overview() {
  const { user } = useAuth();
  const [inventory, setInventory] = useState([]);
  const [orders, setOrders] = useState([]);
  const [payouts, setPayouts] = useState([]);

  useEffect(() => {
    fetchMedicines().then(setInventory).catch(console.error);
    fetchOrders().then(setOrders).catch(console.error);
    fetchPayouts().then(setPayouts).catch(console.error);
  }, []);

  return (
    <div className="animate-fade-in">
      <h1 style={{ fontSize: '24px', margin: '0 0 1.5rem 0', fontWeight: '700' }}>
        Welcome back, {user?.name}
      </h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
        <div className="card" style={{ borderTop: '4px solid #1B8A43' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#6B7280', fontSize: '14px', fontWeight: '600' }}>Total Orders</h3>
          <div style={{ fontSize: '32px', fontWeight: '800', color: '#111827' }}>{orders.length}</div>
        </div>
        
        <div className="card" style={{ borderTop: '4px solid #F27C08' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#6B7280', fontSize: '14px', fontWeight: '600' }}>Total Earnings</h3>
          <div style={{ fontSize: '32px', fontWeight: '800', color: '#111827' }}>
            ₹{payouts.reduce((a,c) => a + c.amount, 0).toLocaleString()}
          </div>
        </div>
        
        <div className="card" style={{ borderTop: '4px solid #EF4444' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#6B7280', fontSize: '14px', fontWeight: '600' }}>Low Stock Items</h3>
          <div style={{ fontSize: '32px', fontWeight: '800', color: '#EF4444' }}>
            {inventory.filter(i => i.stock < 10).length}
          </div>
        </div>
      </div>
    </div>
  );
}
