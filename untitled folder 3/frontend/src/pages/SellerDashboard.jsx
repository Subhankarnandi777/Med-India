import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchMedicines, fetchOrders, fetchPayouts } from '../services/api';
import { LogOut, Store, LayoutDashboard, Package, TrendingUp, Archive } from 'lucide-react';

export default function SellerDashboard() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState('dashboard');
  const [inventory, setInventory] = useState([]);
  const [orders, setOrders] = useState([]);
  const [payouts, setPayouts] = useState([]);

  useEffect(() => {
    fetchMedicines().then(setInventory).catch(console.error);
    fetchOrders().then(setOrders).catch(console.error);
    fetchPayouts().then(setPayouts).catch(console.error);
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <header style={{ background: 'var(--navy)', color: 'white', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Store /> Seller Partner Portal
        </h2>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: tab==='dashboard'?'bold':'normal' }} onClick={() => setTab('dashboard')}>
            <LayoutDashboard size={18}/> Dashboard
          </div>
          <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: tab==='inventory'?'bold':'normal' }} onClick={() => setTab('inventory')}>
            <Archive size={18}/> Inventory
          </div>
          <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: tab==='orders'?'bold':'normal' }} onClick={() => setTab('orders')}>
            <Package size={18}/> Orders
          </div>
          <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: tab==='earnings'?'bold':'normal' }} onClick={() => setTab('earnings')}>
            <TrendingUp size={18}/> Earnings
          </div>
          <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#EF4444' }} onClick={logout}>
            <LogOut size={18}/> Logout
          </div>
        </div>
      </header>

      <main className="container" style={{ padding: '2rem', flex: 1 }}>
        <h1>Welcome, {user.name}</h1>
        
        {tab === 'dashboard' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginTop: '2rem' }}>
            <div className="card animate-fade-in">
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#6B7280' }}>Total Orders</h3>
              <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{orders.length}</div>
            </div>
            <div className="card animate-fade-in">
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#6B7280' }}>Total Earnings</h3>
              <div style={{ fontSize: '32px', fontWeight: 'bold' }}>₹{payouts.reduce((a,c) => a + c.amount, 0)}</div>
            </div>
            <div className="card animate-fade-in">
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#6B7280' }}>Low Stock Items</h3>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#EF4444' }}>{inventory.filter(i => i.stock < 10).length}</div>
            </div>
          </div>
        )}

        {tab === 'inventory' && (
          <div className="card animate-fade-in" style={{ marginTop: '2rem' }}>
            <h3>Manage Inventory</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #E5E7EB', textAlign: 'left' }}>
                  <th style={{ padding: '1rem' }}>Name</th>
                  <th style={{ padding: '1rem' }}>Category</th>
                  <th style={{ padding: '1rem' }}>Price</th>
                  <th style={{ padding: '1rem' }}>Stock</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map(item => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                    <td style={{ padding: '1rem' }}>{item.name}</td>
                    <td style={{ padding: '1rem' }}>{item.category}</td>
                    <td style={{ padding: '1rem' }}>₹{item.price}</td>
                    <td style={{ padding: '1rem', color: item.stock < 10 ? '#EF4444' : 'inherit', fontWeight: 'bold' }}>{item.stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'orders' && (
          <div className="card animate-fade-in" style={{ marginTop: '2rem' }}>
            <h3>Recent Orders</h3>
            {orders.length === 0 ? <p>No orders yet.</p> : (
              orders.map(o => (
                <div key={o.id} style={{ padding: '1rem', border: '1px solid #E5E7EB', borderRadius: '8px', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <strong>{o.id}</strong>
                    <span style={{ background: '#FEF3C7', color: '#D97706', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>{o.status}</span>
                  </div>
                  <div>Patient: {o.patientName}</div>
                  <div>Date: {new Date(o.createdAt).toLocaleDateString()}</div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === 'earnings' && (
          <div className="card animate-fade-in" style={{ marginTop: '2rem' }}>
            <h3>Payout History</h3>
            {payouts.map(p => (
              <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid #E5E7EB' }}>
                <div>
                  <div style={{ fontWeight: 'bold' }}>{p.id}</div>
                  <div style={{ fontSize: '14px', color: '#6B7280' }}>{new Date(p.createdAt).toLocaleDateString()}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '18px' }}>₹{p.amount}</span>
                  <span style={{ background: '#D1FAE5', color: '#065F46', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>{p.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
