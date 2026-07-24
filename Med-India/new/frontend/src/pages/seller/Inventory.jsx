import React, { useState, useEffect } from 'react';
import { fetchMedicines } from '../../services/api';
import { Filter, Plus, Search, Package, AlertTriangle, AlertCircle, Banknote, Pill, Thermometer, Shield, LayoutGrid } from 'lucide-react';

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMedicines().then(setInventory).catch(console.error);
  }, []);

  const outOfStockCount = inventory.filter(i => i.stock === 0).length;
  const lowStockCount = inventory.filter(i => (i.stock || 0) > 0 && (i.stock || 0) < 10).length;
  const totalValue = inventory.reduce((acc, curr) => acc + ((curr.price || 0) * (curr.stock || 0)), 0);

  const filteredInventory = inventory.filter(i => 
    (i.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (i.category || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getIconForCategory = (category) => {
    const cat = (category || '').toLowerCase();
    if (cat.includes('device') || cat.includes('thermometer')) return <Thermometer size={20} color="#3B82F6" />;
    if (cat.includes('protective') || cat.includes('mask')) return <Shield size={20} color="#F59E0B" />;
    return <Pill size={20} color="#F27C08" />;
  };

  return (
    <div className="animate-fade-in" style={{ position: 'relative', minHeight: '100%' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ margin: '0 0 0.25rem 0', fontSize: '24px', fontWeight: '800' }}>Inventory Management</h1>
        <p style={{ margin: '0', color: '#6B7280', fontSize: '14px' }}>Manage your medical supplies and track stock levels.</p>
      </div>

      {/* Top Actions */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
          <Filter size={16} /> All Filters
        </button>
        <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
          <Plus size={16} /> Quick Add
        </button>
      </div>

      {/* Search Bar */}
      <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
        <Search size={20} color="#9CA3AF" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
        <input 
          type="text" 
          placeholder="Search medicines, salts, or brands..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '1rem 1rem 1rem 3rem',
            borderRadius: '16px',
            border: '1px solid #E5E7EB',
            backgroundColor: '#F9FAFB',
            fontSize: '15px',
            outline: 'none',
            boxSizing: 'border-box'
          }}
        />
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="card" style={{ padding: '1.25rem', border: '1px solid #E5E7EB', boxShadow: 'none', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '4px', backgroundColor: '#F27C08' }}></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#6B7280', fontWeight: '600', marginBottom: '0.5rem' }}>Total Items</div>
              <div style={{ fontSize: '24px', fontWeight: '800', marginBottom: '0.25rem' }}>{inventory.length}</div>
              <div style={{ fontSize: '11px', color: '#10B981', fontWeight: '600' }}>↗ +12 new</div>
            </div>
            <Package size={20} color="#F27C08" />
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', border: '1px solid #E5E7EB', boxShadow: 'none', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '4px', backgroundColor: '#EF4444' }}></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#6B7280', fontWeight: '600', marginBottom: '0.5rem' }}>Out of Stock</div>
              <div style={{ fontSize: '24px', fontWeight: '800', marginBottom: '0.25rem' }}>{outOfStockCount}</div>
              <div style={{ fontSize: '11px', color: '#EF4444', fontWeight: '600' }}>Requires Action</div>
            </div>
            <AlertTriangle size={20} color="#EF4444" />
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', border: '1px solid #E5E7EB', boxShadow: 'none', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '4px', backgroundColor: '#F59E0B' }}></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#6B7280', fontWeight: '600', marginBottom: '0.5rem' }}>Low Stock</div>
              <div style={{ fontSize: '24px', fontWeight: '800', marginBottom: '0.25rem' }}>{lowStockCount}</div>
              <div style={{ fontSize: '11px', color: '#111827', fontWeight: '600' }}>Reorder soon</div>
            </div>
            <AlertCircle size={20} color="#F59E0B" />
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', border: '1px solid #E5E7EB', boxShadow: 'none', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '4px', backgroundColor: '#10B981' }}></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#6B7280', fontWeight: '600', marginBottom: '0.5rem' }}>Value</div>
              <div style={{ fontSize: '24px', fontWeight: '800', marginBottom: '0.25rem' }}>₹{(totalValue/100000).toFixed(1)}L</div>
              <div style={{ fontSize: '11px', color: '#6B7280', fontWeight: '600' }}>Valuation</div>
            </div>
            <Banknote size={20} color="#10B981" />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>Product Catalog</h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <div style={{ padding: '6px', borderRadius: '8px', backgroundColor: '#F3F4F6', cursor: 'pointer' }}>
            <LayoutGrid size={18} color="#4B5563" />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredInventory.map(item => (
          <div key={item.id} className="card" style={{ 
            padding: '1.25rem', 
            borderRadius: '16px', 
            border: '1px solid #E5E7EB', 
            boxShadow: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '12px',
              backgroundColor: item.stock === 0 ? '#FEF2F2' : '#FFF7ED',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0
            }}>
              {getIconForCategory(item.category)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700' }}>{item.name}</h3>
                {item.stock > 10 ? (
                  <span style={{ backgroundColor: '#D1FAE5', color: '#065F46', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600' }}>In Stock</span>
                ) : item.stock > 0 ? (
                  <span style={{ backgroundColor: '#FEF3C7', color: '#B45309', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600' }}>Low Stock</span>
                ) : (
                  <span style={{ backgroundColor: '#FEE2E2', color: '#B91C1C', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600' }}>Out of Stock</span>
                )}
              </div>
              <div style={{ color: '#6B7280', fontSize: '13px', marginBottom: '0.75rem' }}>
                {item.category} • {item.generic_name || 'Brand'}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '15px', fontWeight: '700' }}>₹{item.price} <span style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: 'normal' }}>/unit</span></div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: item.stock === 0 ? '#EF4444' : '#111827' }}>
                  {item.stock === 0 ? '0 units' : `Stock: ${item.stock}`}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Add Button */}
      <button className="btn btn-secondary" style={{
        position: 'fixed',
        bottom: '80px', // above bottom nav on mobile
        right: '1.5rem',
        borderRadius: '30px',
        padding: '0.75rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        boxShadow: '0 10px 15px -3px rgba(242, 124, 8, 0.3)',
        zIndex: 20
      }}>
        <Plus size={20} /> Add Medicine
      </button>
    </div>
  );
}
