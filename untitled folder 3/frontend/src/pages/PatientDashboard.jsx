import React, { useState, useEffect } from 'react';
import { fetchMedicines, createOrder } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { ShoppingCart, LogOut, Package, Pill, Search, ListFilter, Menu, Bell, MapPin, ChevronDown, Heart, Leaf, Tag, FileText, User, Home, ArrowRight } from 'lucide-react';

export default function PatientDashboard() {
  const { user, logout } = useAuth();
  const [medicines, setMedicines] = useState([]);
  const [tab, setTab] = useState('home'); 
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchMedicines().then(data => {
      setMedicines(data);
    }).catch(console.error);
  }, []);

  const categories = [
    { name: 'Search Medicines', icon: <Search size={28} color="#1B8A43" /> },
    { name: 'Health Conditions', icon: <Heart size={28} color="#3B82F6" /> },
    { name: 'All Medicines', icon: <Pill size={28} color="#F27C08" /> },
    { name: 'Wellness Products', icon: <Leaf size={28} color="#10B981" /> },
    { name: 'Offers Zone', icon: <Tag size={28} color="#8B5CF6" /> }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#F8FAFC', fontFamily: "'Inter', sans-serif" }}>
      
      {/* Top Header */}
      <header style={{ background: 'white', padding: '1rem 4%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10, boxShadow: '0 2px 10px rgba(0,0,0,0.05)', gap: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          {/* Logo */}
          <div style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span style={{ color: '#F27C08', fontWeight: '900', fontSize: '26px', letterSpacing: '-0.5px' }}>Med</span>
              <span style={{ color: '#1B8A43', fontWeight: '900', fontSize: '26px', letterSpacing: '-0.5px' }}>India</span>
            </div>
            <span style={{ fontSize: '11px', color: '#6B7280', fontWeight: '600' }}>Medicine Delivered, Care Delivered</span>
          </div>

          {/* Deliver To */}
          <div style={{ display: 'none', '@media (min-width: 1024px)': { display: 'inline-flex' }, alignItems: 'center', gap: '0.75rem', background: '#ECFDF5', padding: '0.5rem 1.25rem', borderRadius: '12px', border: '1px solid #D1FAE5', cursor: 'pointer' }}>
            <MapPin size={20} color="#1B8A43" />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '12px', color: '#6B7280', lineHeight: 1 }}>Deliver to</span>
              <span style={{ fontSize: '14px', fontWeight: '700', color: '#111827' }}>Home - 123, MG Road <ChevronDown size={14} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: '4px' }}/></span>
            </div>
          </div>
        </div>

        {/* Search Bar - Web Centered */}
        <div style={{ flex: 1, maxWidth: '600px', display: 'flex', gap: '0.5rem' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '1rem', color: '#9CA3AF' }}><Search size={20} /></div>
            <input 
              type="text" 
              placeholder="Search medicines, brands, or health conditions..." 
              style={{ width: '100%', padding: '0.875rem 1rem 0.875rem 3rem', borderRadius: '12px', border: '1px solid #E5E7EB', fontSize: '15px', background: '#F9FAFB', outline: 'none', transition: 'border 0.2s', boxSizing: 'border-box' }}
              onFocus={(e) => e.target.style.borderColor = '#1B8A43'}
              onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
            />
          </div>
          <button style={{ padding: '0 1rem', borderRadius: '12px', border: '1px solid #E5E7EB', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#F3F4F6'} onMouseOut={e => e.currentTarget.style.background = 'white'}>
            <ListFilter size={20} color="#111827" />
          </button>
        </div>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: '#4B5563' }} onClick={() => setTab('orders')}>
            <Package size={22} />
            <span style={{ fontSize: '12px', fontWeight: '600', marginTop: '4px' }}>Orders</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: '#111827' }} onClick={() => setTab('cart')}>
            <ShoppingCart size={22} />
            <span style={{ fontSize: '12px', fontWeight: '600', marginTop: '4px' }}>Cart</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: '#111827', position: 'relative' }}>
            <Bell size={22} />
            <div style={{ position: 'absolute', top: -2, right: 2, width: '8px', height: '8px', backgroundColor: '#EF4444', borderRadius: '50%', border: '2px solid white' }}></div>
            <span style={{ fontSize: '12px', fontWeight: '600', marginTop: '4px' }}>Alerts</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: '#111827' }} onClick={logout}>
            <LogOut size={22} color="#EF4444" />
            <span style={{ fontSize: '12px', fontWeight: '600', marginTop: '4px', color: '#EF4444' }}>Logout</span>
          </div>
        </div>
      </header>

      <main style={{ flex: 1, padding: '2rem 4%', maxWidth: '1440px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        
        {/* Top Section Layout: Promo Banner & Upload Rx */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          {/* Promo Banner */}
          <div style={{ background: 'linear-gradient(135deg, #FFF7ED 0%, #ECFDF5 100%)', borderRadius: '24px', padding: '2rem 3rem', position: 'relative', overflow: 'hidden', minHeight: '220px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ position: 'relative', zIndex: 2 }}>
              <span style={{ background: '#F27C08', color: 'white', padding: '6px 14px', borderRadius: '16px', fontSize: '12px', fontWeight: '800', letterSpacing: '0.5px' }}>100% GENUINE MEDICINES</span>
              <h2 style={{ margin: '1.5rem 0 0.75rem 0', fontSize: '32px', fontWeight: '900', color: '#111827', maxWidth: '70%', lineHeight: 1.2 }}>India's Most Trusted Healthcare App</h2>
              <p style={{ margin: 0, fontSize: '16px', color: '#4B5563', fontWeight: '500' }}>Delivered securely in 30-60 mins</p>
            </div>
            {/* Decorative background elements for banner */}
            <div style={{ position: 'absolute', right: '-40px', bottom: '-40px', width: '250px', height: '250px', background: '#1B8A43', borderRadius: '50%', opacity: 0.08, zIndex: 1 }}></div>
            <div style={{ position: 'absolute', right: '40px', top: '30px', zIndex: 2 }}>
              <Heart size={140} color="#1B8A43" strokeWidth={1} style={{ opacity: 0.15 }} />
            </div>
          </div>

          {/* Upload Prescription Banner */}
          <div style={{ background: 'linear-gradient(90deg, #F0FDF4 0%, #FFFFFF 100%)', borderRadius: '24px', padding: '2.5rem', border: '1px solid #DCFCE7', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.02)' }}>
            <div style={{ flex: 1, maxWidth: '60%' }}>
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '28px', fontWeight: '900', color: '#111827', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                Upload Prescription <span style={{ background: '#1B8A43', color: 'white', borderRadius: '50%', width: '24px', height: '24px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>✓</span>
              </h3>
              <p style={{ margin: '0 0 2rem 0', fontSize: '16px', color: '#4B5563', lineHeight: '1.5' }}>Upload your prescription to get medicines delivered with exciting offers and up to 25% off.</p>
              <button style={{ background: '#1B8A43', border: 'none', color: 'white', padding: '0.875rem 1.5rem', borderRadius: '12px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 6px -1px rgba(27, 138, 67, 0.2)', transition: 'transform 0.1s' }} onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'} onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}>
                Upload Now <ArrowRight size={18} />
              </button>
            </div>
            <div style={{ width: '140px', height: '180px', background: 'white', border: '2px dashed #34D399', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
               <FileText size={64} color="#10B981" />
               <span style={{ fontSize: '13px', fontWeight: '600', color: '#10B981' }}>Drag & Drop</span>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div style={{ marginBottom: '4rem' }}>
          <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '22px', fontWeight: '800', color: '#111827' }}>Explore Categories</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem' }}>
            {categories.map((cat, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', background: 'white', padding: '2rem 1rem', borderRadius: '20px', border: '1px solid #E5E7EB', cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }} onMouseOver={e => { e.currentTarget.style.borderColor = '#1B8A43'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)'; }} onMouseOut={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.02)'; }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {cat.icon}
                </div>
                <span style={{ fontSize: '16px', fontWeight: '700', color: '#374151', textAlign: 'center' }}>{cat.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Best Selling Products */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#111827' }}>Best Selling Products</h3>
            <span style={{ color: '#1B8A43', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>View All →</span>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {[1,2,3,4,5].map((i) => (
              <div key={i} style={{ background: 'white', borderRadius: '20px', padding: '1.5rem', border: '1px solid #E5E7EB', position: 'relative', transition: 'box-shadow 0.2s' }} onMouseOver={e => e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.05)'} onMouseOut={e => e.currentTarget.style.boxShadow = 'none'}>
                <div style={{ position: 'absolute', top: '16px', right: '16px', background: '#FEE2E2', color: '#EF4444', fontSize: '12px', fontWeight: '800', padding: '4px 8px', borderRadius: '8px' }}>15% OFF</div>
                <div style={{ height: '160px', background: '#F3F4F6', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Pill size={60} color="#9CA3AF" />
                </div>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '18px', fontWeight: '800', color: '#111827' }}>Product Name {i}</h4>
                <p style={{ margin: '0 0 1rem 0', fontSize: '14px', color: '#6B7280' }}>Category Type • 500mg</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '13px', color: '#9CA3AF', textDecoration: 'line-through' }}>₹120</span>
                    <span style={{ fontSize: '20px', fontWeight: '900', color: '#111827' }}>₹99</span>
                  </div>
                  <button style={{ background: 'white', border: '2px solid #1B8A43', color: '#1B8A43', padding: '0.5rem 1rem', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => { e.currentTarget.style.background = '#1B8A43'; e.currentTarget.style.color = 'white'; }} onMouseOut={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#1B8A43'; }}>
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Floating Support Button (Bottom Right) */}
      <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', width: '64px', height: '64px', background: '#F27C08', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 25px -5px rgba(242, 124, 8, 0.5)', zIndex: 20, cursor: 'pointer', transition: 'transform 0.2s' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
         <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10H12V2Z"/><path d="M12 12 2.1 7.1"/></svg>
      </div>

    </div>
  );
}

