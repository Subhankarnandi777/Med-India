import React, { useState, useEffect } from 'react';
import { fetchOrders } from '../../services/api';
import { Search, SlidersHorizontal, Clock, Plus, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrders().then(setOrders).catch(console.error);
  }, []);

  const pendingOrders = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled');
  const completedOrders = orders.filter(o => o.status === 'Delivered' || o.status === 'Cancelled');

  const displayOrders = activeTab === 'pending' ? pendingOrders : completedOrders;
  const filteredOrders = displayOrders.filter(o => 
    (o.id || '').toString().includes(searchTerm) || 
    (o.patientName && o.patientName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusStyle = (status) => {
    switch(status) {
      case 'Pending': return { color: '#D97706', bg: 'transparent', text: 'Awaiting Pickup' };
      case 'Processing': return { color: '#2563EB', bg: '#EFF6FF', text: 'Processing' };
      case 'Out of Stock': return { color: '#DC2626', bg: 'transparent', text: 'Out of Stock' };
      case 'Delivered': return { color: '#16A34A', bg: 'transparent', text: 'Delivered' };
      default: return { color: '#D97706', bg: 'transparent', text: status };
    }
  };

  const getCardBorderStyle = (status) => {
    switch(status) {
      case 'Pending': return '#F27C08';
      case 'Processing': return '#2563EB';
      case 'Out of Stock': return '#DC2626';
      case 'Delivered': return '#16A34A';
      default: return '#F27C08';
    }
  };

  return (
    <div className="animate-fade-in" style={{ position: 'relative', minHeight: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ margin: '0 0 0.25rem 0', fontSize: '24px', fontWeight: '800' }}>Orders</h1>
        <p style={{ margin: '0', color: '#6B7280', fontSize: '14px' }}>Manage and track your customer orders.</p>
      </div>

      {/* Search and Filter */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={20} color="#9CA3AF" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Search Order ID, Name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.875rem 1rem 0.875rem 3rem',
              borderRadius: '24px',
              border: '1px solid #E5E7EB',
              fontSize: '15px',
              outline: 'none'
            }}
          />
        </div>
        <button style={{ 
          width: '48px', 
          height: '48px', 
          borderRadius: '24px', 
          border: '1px solid #E5E7EB',
          backgroundColor: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}>
          <SlidersHorizontal size={20} color="#4B5563" />
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '2px solid #E5E7EB', marginBottom: '1.5rem' }}>
        <div 
          onClick={() => setActiveTab('pending')}
          style={{ 
            flex: 1, 
            textAlign: 'center', 
            padding: '0.75rem', 
            fontWeight: '700',
            fontSize: '14px',
            color: activeTab === 'pending' ? '#F27C08' : '#6B7280',
            borderBottom: activeTab === 'pending' ? '2px solid #F27C08' : 'none',
            marginBottom: '-2px',
            cursor: 'pointer'
          }}
        >
          Pending ({pendingOrders.length})
        </div>
        <div 
          onClick={() => setActiveTab('completed')}
          style={{ 
            flex: 1, 
            textAlign: 'center', 
            padding: '0.75rem', 
            fontWeight: '700',
            fontSize: '14px',
            color: activeTab === 'completed' ? '#111827' : '#6B7280',
            borderBottom: activeTab === 'completed' ? '2px solid #111827' : 'none',
            marginBottom: '-2px',
            cursor: 'pointer'
          }}
        >
          Completed ({completedOrders.length})
        </div>
      </div>

      {/* Order List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredOrders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: '#6B7280' }}>
            No orders found.
          </div>
        ) : (
          filteredOrders.map(order => {
            const statusStyle = getStatusStyle(order.status || 'Pending');
            const borderColor = getCardBorderStyle(order.status || 'Pending');
            
            return (
              <div key={order.id} className="card" style={{ 
                padding: '1.25rem', 
                borderRadius: '16px', 
                border: '1px solid #E5E7EB', 
                boxShadow: 'none',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '6px', backgroundColor: borderColor }}></div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ color: '#6B7280', fontSize: '12px', fontWeight: '600' }}>#{String(order.id || '').substring(0,8).toUpperCase()}</div>
                  <div style={{ 
                    color: statusStyle.color, 
                    backgroundColor: statusStyle.bg,
                    padding: statusStyle.bg !== 'transparent' ? '4px 10px' : '0',
                    borderRadius: '16px',
                    fontSize: '12px', 
                    fontWeight: '700' 
                  }}>
                    {statusStyle.text}
                  </div>
                </div>

                <h3 style={{ margin: '0 0 1rem 0', fontSize: '18px', fontWeight: '800' }}>{order.patientName || 'Unknown Patient'}</h3>

                <div style={{ display: 'flex', borderTop: '1px dashed #E5E7EB', borderBottom: '1px dashed #E5E7EB', padding: '1rem 0', marginBottom: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: '#6B7280', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Amount</div>
                    <div style={{ fontSize: '16px', fontWeight: '800' }}>₹{order.totalAmount || '0.00'}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: '#6B7280', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Items</div>
                    <div style={{ fontSize: '16px', fontWeight: '800' }}>{order.items?.length || 1} Medicines</div>
                  </div>
                </div>

                {order.status === 'Out of Stock' && (
                  <div style={{ backgroundColor: '#FEF2F2', padding: '0.75rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <AlertTriangle size={16} color="#DC2626" />
                    <span style={{ color: '#991B1B', fontSize: '12px', fontWeight: '600' }}>Partial stock available. Immediate action needed.</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6B7280', fontSize: '12px', fontWeight: '600' }}>
                    {order.status === 'Delivered' ? (
                      <><CheckCircle2 size={16} color="#16A34A" /> <span style={{ color: '#16A34A' }}>MI-{String(order.id || '').substring(0,5)}-FEDX</span></>
                    ) : (
                      <><Clock size={16} /> Placed 2h ago</>
                    )}
                  </div>
                  
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {order.status === 'Out of Stock' ? (
                      <>
                        <button className="btn" style={{ padding: '0.5rem 1.5rem', backgroundColor: '#B91C1C', color: 'white' }}>Contact</button>
                        <button className="btn" style={{ padding: '0.5rem 1.5rem', backgroundColor: 'transparent', border: '1px solid #E5E7EB', color: '#111827' }}>Cancel</button>
                      </>
                    ) : order.status === 'Processing' ? (
                      <>
                        <button className="btn btn-secondary" style={{ padding: '0.5rem 1.5rem' }}>Mark as Shipped</button>
                        <button className="btn" style={{ padding: '0.5rem 1rem', backgroundColor: 'transparent', border: '1px solid #F27C08', color: '#F27C08' }}>Details</button>
                      </>
                    ) : order.status === 'Pending' ? (
                      <button className="btn btn-secondary" style={{ padding: '0.5rem 1.5rem' }}>Mark as Shipped</button>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Floating Add Button */}
      <button className="btn btn-secondary" style={{
        position: 'fixed',
        bottom: '80px',
        right: '1.5rem',
        borderRadius: '50%',
        width: '56px',
        height: '56px',
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 10px 15px -3px rgba(242, 124, 8, 0.3)',
        zIndex: 20
      }}>
        <Plus size={28} />
      </button>
    </div>
  );
}
