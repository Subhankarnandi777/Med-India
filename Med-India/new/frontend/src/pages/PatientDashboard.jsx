import React, { useState, useEffect } from 'react';
import { fetchMedicines, fetchOrders, createOrder } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { 
  ShoppingCart, LogOut, Package, Pill, Search, ListFilter, Menu, 
  Bell, MapPin, ChevronDown, Heart, Leaf, Tag, FileText, User, 
  Home, ArrowRight, Plus, Minus, Check, X, Shield, Clock, 
  HelpCircle, PhoneCall, UploadCloud, AlertCircle
} from 'lucide-react';

export default function PatientDashboard() {
  const { user, logout } = useAuth();
  const [medicines, setMedicines] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);
  const [tab, setTab] = useState('home'); // 'home', 'medicines', 'orders', 'cart', 'account'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [deliveryAddress, setDeliveryAddress] = useState('Home - 123, MG Road');
  
  // Modals
  const [showRxModal, setShowRxModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Hero Banner Rotation State
  const bannerImages = ['/banner1.png', '/banner2.png'];
  const [currentBannerIdx, setCurrentBannerIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBannerIdx((prevIdx) => (prevIdx + 1) % bannerImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [bannerImages.length]);
  
  // Prescription form inside modal
  const [rxNotes, setRxNotes] = useState('');
  const [rxFile, setRxFile] = useState(null);
  const [rxSuccess, setRxSuccess] = useState(false);

  useEffect(() => {
    fetchMedicines().then(data => {
      setMedicines(data);
    }).catch(console.error);

    fetchOrders().then(data => {
      setOrders(data);
    }).catch(console.error);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const addToCart = (med) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === med.id);
      if (existing) {
        return prev.map(item => item.id === med.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...med, quantity: 1 }];
    });
    showToast(`Added ${med.name} to cart`);
  };

  const updateCartQty = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleCheckout = async () => {
    if (!cart.length) return;
    try {
      const orderData = {
        patientName: user?.full_name || user?.name || 'Patient User',
        patient_id: user?.id,
        items: cart.map(i => ({ name: i.name, quantity: i.quantity, price: i.price })),
      };
      const newOrder = await createOrder(orderData);
      setOrders(prev => [newOrder, ...prev]);
      setCart([]);
      showToast('Order placed successfully!');
      setTab('orders');
    } catch (e) {
      showToast('Failed to place order. Try again.');
    }
  };

  const handleRxSubmit = (e) => {
    e.preventDefault();
    setRxSuccess(true);
    setTimeout(() => {
      setRxSuccess(false);
      setShowRxModal(false);
      setRxNotes('');
      setRxFile(null);
      showToast('Prescription uploaded successfully!');
    }, 1500);
  };

  const categories = [
    { name: 'Search Medicines', icon: <Search size={28} color="#10B981" />, action: () => setTab('medicines') },
    { name: 'Health Conditions', icon: <Heart size={28} color="#3B82F6" />, action: () => setTab('medicines') },
    { name: 'All Medicines', icon: <Pill size={28} color="#F27C08" />, action: () => setTab('medicines') },
    { name: 'Wellness Products', icon: <Leaf size={28} color="#10B981" />, action: () => setTab('medicines') },
    { name: 'Offers Zone', icon: <Tag size={28} color="#8B5CF6" />, action: () => setTab('medicines') }
  ];

  const filteredMedicines = medicines.filter(med => {
    const matchesSearch = med.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          med.generic_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || med.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#F8FAFC', fontFamily: "'Inter', sans-serif", paddingBottom: '70px' }}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{ position: 'fixed', top: '80px', right: '20px', background: '#111827', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '12px', zIndex: 100, boxShadow: '0 10px 25px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '14px', fontWeight: '600' }}>
          <Check size={18} color="#10B981" /> {toastMessage}
        </div>
      )}

      {/* Top Header */}
      <header className="patient-header" style={{ background: 'white', padding: '0.875rem 4%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 30, boxShadow: '0 2px 10px rgba(0,0,0,0.05)', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'nowrap' }}>
          {/* Logo */}
          <div style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer', flexShrink: 0 }} onClick={() => setTab('home')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span style={{ color: '#F27C08', fontWeight: '900', fontSize: '24px', letterSpacing: '-0.5px' }}>Med</span>
              <span style={{ color: '#1B8A43', fontWeight: '900', fontSize: '24px', letterSpacing: '-0.5px' }}>India</span>
            </div>
            <span style={{ fontSize: '9px', color: '#6B7280', fontWeight: '600' }} className="hide-on-mobile">Medicine Delivered, Care Delivered</span>
          </div>

          {/* Deliver To Selector */}
          <div 
            onClick={() => setShowAddressModal(true)}
            className="header-deliver-pill"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#ECFDF5', padding: '0.4rem 0.8rem', borderRadius: '25px', border: '1px solid #D1FAE5', cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0 }}
          >
            <MapPin size={16} color="#1B8A43" />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '9px', color: '#6B7280', lineHeight: 1 }}>Deliver to</span>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#111827', display: 'flex', alignItems: 'center', gap: '2px' }}>
                {deliveryAddress.length > 18 ? deliveryAddress.substring(0, 18) + '...' : deliveryAddress} <ChevronDown size={14} color="#6B7280" />
              </span>
            </div>
          </div>
        </div>

        {/* Search Bar - Web Centered */}
        <div className="header-search" style={{ flex: 1, maxWidth: '550px', display: 'flex', gap: '0.5rem' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '0.875rem', color: '#9CA3AF' }}>
              <Search size={18} />
            </div>
            <input 
              type="text" 
              placeholder="Search medicines, brands..." 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (tab !== 'medicines' && e.target.value.length > 0) setTab('medicines');
              }}
              style={{ width: '100%', padding: '0.65rem 0.875rem 0.65rem 2.5rem', borderRadius: '12px', border: '1.5px solid #E5E7EB', fontSize: '13px', background: '#F9FAFB', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <button 
            onClick={() => setTab('medicines')}
            style={{ padding: '0 0.75rem', borderRadius: '12px', border: '1.5px solid #E5E7EB', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <ListFilter size={18} color="#111827" />
          </button>
        </div>

        {/* Header Right Actions */}
        <div className="header-right-actions" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: tab === 'home' ? '#1B8A43' : '#4B5563' }} onClick={() => setTab('home')}>
            <Home size={22} />
            <span style={{ fontSize: '11px', fontWeight: '600', marginTop: '2px' }}>Home</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: tab === 'medicines' ? '#1B8A43' : '#4B5563' }} onClick={() => setTab('medicines')}>
            <Pill size={22} />
            <span style={{ fontSize: '11px', fontWeight: '600', marginTop: '2px' }}>Medicines</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: tab === 'orders' ? '#1B8A43' : '#4B5563' }} onClick={() => setTab('orders')}>
            <Package size={22} />
            <span style={{ fontSize: '11px', fontWeight: '600', marginTop: '2px' }}>Orders</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: tab === 'cart' ? '#1B8A43' : '#111827', position: 'relative' }} onClick={() => setTab('cart')}>
            <ShoppingCart size={22} />
            {cartItemCount > 0 && (
              <div style={{ position: 'absolute', top: -4, right: -4, background: '#F27C08', color: 'white', fontSize: '10px', fontWeight: '800', width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {cartItemCount}
              </div>
            )}
            <span style={{ fontSize: '11px', fontWeight: '600', marginTop: '2px' }}>Cart</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: '#111827', position: 'relative' }}>
            <Bell size={22} />
            <div style={{ position: 'absolute', top: -1, right: 2, width: '8px', height: '8px', backgroundColor: '#EF4444', borderRadius: '50%', border: '1.5px solid white' }}></div>
            <span style={{ fontSize: '11px', fontWeight: '600', marginTop: '2px' }}>Alerts</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: tab === 'account' ? '#1B8A43' : '#4B5563' }} onClick={() => setTab('account')}>
            <User size={22} />
            <span style={{ fontSize: '11px', fontWeight: '600', marginTop: '2px' }}>Account</span>
          </div>
        </div>
      </header>

      {/* Main Content View */}
      <main style={{ flex: 1, padding: '1.5rem 4%', maxWidth: '1440px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        
        {/* TAB 1: HOME */}
        {tab === 'home' && (
          <div>
            {/* 1. India's Most Trusted App Hero Banner */}
            <div style={{ marginBottom: '2.5rem' }}>
              <div 
                className="patient-hero-banner"
                style={{ 
                background: 'linear-gradient(135deg, #FFF7ED 0%, #FFFFFF 50%, #ECFDF5 100%)', 
                backgroundImage: `url("${bannerImages[currentBannerIdx]}")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '24px', 
                padding: '3rem 3.5rem', 
                position: 'relative', 
                overflow: 'hidden', 
                minHeight: '260px', 
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.06)', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center',
                border: '1px solid #FED7AA',
                transition: 'background-image 0.8s ease-in-out'
              }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(90deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 55%, rgba(255,255,255,0.25) 100%)', zIndex: 1 }}></div>
                
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <span style={{ background: '#F27C08', color: 'white', fontSize: '11px', fontWeight: '800', padding: '4px 12px', borderRadius: '12px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                    100% GENUINE MEDICINES
                  </span>
                  
                  <h2 className="patient-hero-title" style={{ margin: '0.875rem 0 0.5rem 0', fontSize: '38px', fontWeight: '900', color: '#1c355e', lineHeight: 1.1 }}>
                    India's Most<br/>
                    <span style={{ color: '#1B8A43' }}>Trusted App</span>
                  </h2>
                  
                  <p style={{ margin: '0', fontSize: '15px', color: '#4B5563', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={16} color="#F27C08" /> Delivered in 30–60 mins
                  </p>
                </div>

                {/* Interactive Dot Slider Indicators */}
                <div style={{ position: 'absolute', bottom: '1rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px', zIndex: 2 }}>
                  {bannerImages.map((_, idx) => (
                    <div 
                      key={idx}
                      onClick={() => setCurrentBannerIdx(idx)}
                      style={{ 
                        width: currentBannerIdx === idx ? '24px' : '8px', 
                        height: '8px', 
                        background: currentBannerIdx === idx ? '#1B8A43' : '#CBD5E1', 
                        borderRadius: '4px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* 2. Quick Actions & Categories */}
            <div style={{ marginBottom: '3rem' }}>
              <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '22px', fontWeight: '800', color: '#111827' }}>Quick Actions & Categories</h3>
              <div className="quick-actions-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1.5rem' }}>
                {categories.map((cat, idx) => (
                  <div 
                    key={idx} 
                    onClick={cat.action}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.875rem', cursor: 'pointer', transition: 'transform 0.2s' }}
                    onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                    onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <div className="category-circle" style={{ 
                      width: '76px', 
                      height: '76px', 
                      borderRadius: '50%', 
                      background: 'white', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      border: '2px solid #E2E8F0',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
                    }}>
                      {cat.icon}
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: '700', color: '#374151', textAlign: 'center', lineHeight: '1.2' }}>{cat.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Upload Prescription Section */}
            <div style={{ marginBottom: '3.5rem' }}>
              <div className="rx-banner" style={{ 
                background: 'linear-gradient(135deg, #ECFDF5 0%, #FFFFFF 60%, #F0FDF4 100%)', 
                backgroundImage: 'url("/upload.jpeg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '24px', 
                padding: '2.5rem 3.5rem', 
                position: 'relative', 
                overflow: 'hidden', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center', 
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.04)',
                border: '1px solid #A7F3D0'
              }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(90deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 60%, rgba(255,255,255,0.3) 100%)', zIndex: 1 }}></div>
                
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '28px', fontWeight: '900', color: '#111827', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    Upload Prescription <span style={{ background: '#1B8A43', color: 'white', borderRadius: '50%', width: '24px', height: '24px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>✓</span>
                  </h3>
                  
                  <p style={{ margin: '0 0 1.5rem 0', fontSize: '15px', color: '#4B5563', lineHeight: '1.4' }}>
                    Get medicines delivered with exciting offers and up to 25% off.
                  </p>

                  <button 
                    onClick={() => setShowRxModal(true)}
                    style={{ background: '#1B8A43', border: 'none', color: 'white', padding: '0.875rem 2rem', borderRadius: '12px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(27, 138, 67, 0.3)', transition: 'transform 0.1s', width: 'fit-content' }}
                    onMouseDown={e => e.currentTarget.style.transform = 'scale(0.96)'}
                    onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    Upload Now <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Best Selling Products */}
            <div style={{ marginBottom: '3rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#111827' }}>Best Selling Products</h3>
                <span style={{ color: '#1B8A43', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }} onClick={() => setTab('medicines')}>View All →</span>
              </div>
              
              <div className="products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
                {medicines.slice(0, 8).map((med) => (
                  <div key={med.id} style={{ background: 'white', borderRadius: '20px', padding: '1.25rem', border: '1px solid #E2E8F0', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'box-shadow 0.2s' }}>
                    
                    <div>
                      <div style={{ position: 'absolute', top: '12px', right: '12px', background: '#FEE2E2', color: '#EF4444', fontSize: '11px', fontWeight: '800', padding: '4px 8px', borderRadius: '8px' }}>
                        15% OFF
                      </div>
                      
                      <div style={{ height: '140px', background: '#F8FAFC', borderRadius: '14px', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Pill size={54} color="#10B981" />
                      </div>

                      <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '16px', fontWeight: '800', color: '#111827' }}>{med.name}</h4>
                      <p style={{ margin: '0 0 0.75rem 0', fontSize: '13px', color: '#6B7280' }}>{med.generic_name} • {med.category}</p>
                      
                      {med.requires_prescription && (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#D97706', background: '#FEF3C7', padding: '2px 8px', borderRadius: '6px', fontWeight: '600', marginBottom: '0.75rem' }}>
                          <AlertCircle size={12} /> Prescription Required
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '12px', color: '#9CA3AF', textDecoration: 'line-through' }}>₹{(med.price * 1.15).toFixed(0)}</span>
                        <span style={{ fontSize: '18px', fontWeight: '900', color: '#111827' }}>₹{med.price}</span>
                      </div>

                      <button 
                        onClick={() => addToCart(med)}
                        style={{ background: 'white', border: '2px solid #1B8A43', color: '#1B8A43', padding: '0.4rem 1.25rem', borderRadius: '10px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s' }}
                        onMouseOver={e => { e.currentTarget.style.background = '#1B8A43'; e.currentTarget.style.color = 'white'; }}
                        onMouseOut={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#1B8A43'; }}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MEDICINES EXPLORER */}
        {tab === 'medicines' && (
          <div>
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '28px', fontWeight: '900', color: '#111827' }}>Medicine Catalog</h2>
              <p style={{ margin: 0, color: '#6B7280' }}>Browse 100% genuine healthcare products</p>
            </div>

            {/* Category Pills Filter */}
            <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '1rem', marginBottom: '2rem' }}>
              {['All', 'Analgesic', 'Antibiotic', 'Cardiovascular', 'Antidiabetic', 'Antihistamine', 'Wellness', 'Ayurveda'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '0.5rem 1.25rem',
                    borderRadius: '25px',
                    border: selectedCategory === cat ? '2px solid #1B8A43' : '1px solid #E2E8F0',
                    background: selectedCategory === cat ? '#1B8A43' : 'white',
                    color: selectedCategory === cat ? 'white' : '#4B5563',
                    fontWeight: '700',
                    fontSize: '14px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Medicines Grid */}
            <div className="products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
              {filteredMedicines.map(med => (
                <div key={med.id} style={{ background: 'white', borderRadius: '20px', padding: '1.5rem', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ height: '140px', background: '#F8FAFC', borderRadius: '14px', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Pill size={54} color="#10B981" />
                    </div>
                    <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '18px', fontWeight: '800', color: '#111827' }}>{med.name}</h4>
                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '13px', color: '#6B7280' }}>{med.generic_name} • {med.category}</p>
                    {med.requires_prescription && (
                      <span style={{ display: 'inline-block', fontSize: '11px', color: '#D97706', background: '#FEF3C7', padding: '2px 8px', borderRadius: '6px', fontWeight: '600', marginBottom: '0.5rem' }}>
                        Rx Required
                      </span>
                    )}
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                    <span style={{ fontSize: '20px', fontWeight: '900', color: '#111827' }}>₹{med.price}</span>
                    <button 
                      onClick={() => addToCart(med)}
                      style={{ background: '#1B8A43', border: 'none', color: 'white', padding: '0.5rem 1.25rem', borderRadius: '10px', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ORDERS */}
        {tab === 'orders' && (
          <div>
            <h2 style={{ margin: '0 0 1.5rem 0', fontSize: '28px', fontWeight: '900', color: '#111827' }}>My Orders</h2>
            
            {orders.length === 0 ? (
              <div style={{ background: 'white', padding: '3rem', borderRadius: '20px', textAlign: 'center', border: '1px solid #E2E8F0' }}>
                <Package size={48} color="#9CA3AF" style={{ marginBottom: '1rem' }} />
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#374151' }}>No orders yet</h3>
                <p style={{ color: '#6B7280', marginBottom: '1.5rem' }}>Explore medicines and place your first order!</p>
                <button onClick={() => setTab('medicines')} style={{ background: '#1B8A43', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }}>
                  Browse Medicines
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {orders.map((ord, idx) => (
                  <div key={ord.id || idx} style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: '800', fontSize: '16px', color: '#111827' }}>{ord.id}</span>
                        <span style={{ 
                          background: ord.status === 'Delivered' ? '#D1FAE5' : '#FEF3C7', 
                          color: ord.status === 'Delivered' ? '#065F46' : '#92400E',
                          padding: '2px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '700' 
                        }}>
                          {ord.status || 'Pending'}
                        </span>
                      </div>
                      <p style={{ margin: 0, fontSize: '14px', color: '#4B5563' }}>
                        Patient: <strong>{ord.patientName}</strong> • {ord.items ? ord.items.length : 0} items
                      </p>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '18px', fontWeight: '900', color: '#111827' }}>
                        ₹{ord.items ? ord.items.reduce((acc, i) => acc + (i.price * i.quantity), 0) : 0}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: CART */}
        {tab === 'cart' && (
          <div>
            <h2 style={{ margin: '0 0 1.5rem 0', fontSize: '28px', fontWeight: '900', color: '#111827' }}>Shopping Cart</h2>

            {cart.length === 0 ? (
              <div style={{ background: 'white', padding: '3rem', borderRadius: '20px', textAlign: 'center', border: '1px solid #E2E8F0' }}>
                <ShoppingCart size={48} color="#9CA3AF" style={{ marginBottom: '1rem' }} />
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#374151' }}>Your cart is empty</h3>
                <p style={{ color: '#6B7280', marginBottom: '1.5rem' }}>Add medicines to your cart to proceed.</p>
                <button onClick={() => setTab('medicines')} style={{ background: '#1B8A43', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }}>
                  Explore Medicines
                </button>
              </div>
            ) : (
              <div className="cart-layout-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                
                {/* Cart Items List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {cart.map(item => (
                    <div key={item.id} style={{ background: 'white', padding: '1.25rem', borderRadius: '16px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '16px', fontWeight: '800', color: '#111827' }}>{item.name}</h4>
                        <p style={{ margin: 0, fontSize: '13px', color: '#6B7280' }}>₹{item.price} each</p>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #E2E8F0', borderRadius: '10px', overflow: 'hidden' }}>
                          <button onClick={() => updateCartQty(item.id, -1)} style={{ padding: '0.4rem 0.6rem', background: '#F8FAFC', border: 'none', cursor: 'pointer' }}><Minus size={14} /></button>
                          <span style={{ padding: '0 0.75rem', fontWeight: '700', fontSize: '14px' }}>{item.quantity}</span>
                          <button onClick={() => updateCartQty(item.id, 1)} style={{ padding: '0.4rem 0.6rem', background: '#F8FAFC', border: 'none', cursor: 'pointer' }}><Plus size={14} /></button>
                        </div>

                        <span style={{ fontWeight: '900', fontSize: '16px', width: '70px', textAlign: 'right' }}>
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary Box */}
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '20px', border: '1px solid #E2E8F0', height: 'fit-content' }}>
                  <h3 style={{ margin: '0 0 1rem 0', fontSize: '18px', fontWeight: '800', color: '#111827' }}>Order Summary</h3>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '14px', color: '#4B5563' }}>
                    <span>Subtotal</span>
                    <span>₹{cartTotal}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '14px', color: '#4B5563' }}>
                    <span>Delivery Fee</span>
                    <span style={{ color: '#10B981', fontWeight: '700' }}>FREE</span>
                  </div>

                  <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '18px', fontWeight: '900', color: '#111827' }}>
                    <span>Total</span>
                    <span>₹{cartTotal}</span>
                  </div>

                  <button 
                    onClick={handleCheckout}
                    style={{ width: '100%', background: '#1B8A43', color: 'white', border: 'none', padding: '0.875rem', borderRadius: '12px', fontWeight: '700', fontSize: '16px', cursor: 'pointer' }}
                  >
                    Place Order (₹{cartTotal})
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: ACCOUNT */}
        {tab === 'account' && (
          <div style={{ maxWidth: '600px', margin: '0 auto', background: 'white', padding: '2rem', borderRadius: '24px', border: '1px solid #E2E8F0' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#ECFDF5', color: '#1B8A43', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: '900', marginBottom: '1rem' }}>
                {(user?.full_name || user?.name || 'P')[0].toUpperCase()}
              </div>
              <h2 style={{ margin: '0 0 0.25rem 0', fontSize: '24px', fontWeight: '900', color: '#111827' }}>{user?.full_name || user?.name || 'Patient'}</h2>
              <p style={{ margin: 0, color: '#6B7280', fontSize: '14px' }}>{user?.email}</p>
              <span style={{ display: 'inline-block', marginTop: '0.5rem', background: '#ECFDF5', color: '#1B8A43', padding: '2px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '700' }}>
                Patient Account
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ padding: '1rem', borderRadius: '12px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <span style={{ fontSize: '12px', color: '#6B7280', display: 'block' }}>Delivery Address</span>
                <span style={{ fontSize: '14px', fontWeight: '700', color: '#111827' }}>{deliveryAddress}</span>
              </div>
            </div>

            <button 
              onClick={logout}
              style={{ width: '100%', background: '#FEE2E2', color: '#EF4444', border: 'none', padding: '0.875rem', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        )}

      </main>

      {/* Floating Support Button (Bottom Right) */}
      <div 
        onClick={() => setShowSupportModal(true)}
        className="floating-support-btn"
        style={{ position: 'fixed', bottom: '80px', right: '2rem', width: '56px', height: '56px', background: '#F27C08', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 25px -5px rgba(242, 124, 8, 0.4)', zIndex: 40, cursor: 'pointer', transition: 'transform 0.2s' }}
        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.08)'}
        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        <PhoneCall size={24} color="white" />
      </div>

      {/* Bottom Mobile Navigation Bar */}
      <nav className="patient-bottom-nav" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'rgba(255, 255, 255, 0.96)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderTop: '1px solid #E2E8F0', padding: '0.4rem 0.5rem', display: 'flex', justifyContent: 'space-around', alignItems: 'center', zIndex: 50, boxShadow: '0 -4px 20px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: tab === 'home' ? '#1B8A43' : '#6B7280', padding: '4px 12px', borderRadius: '12px', background: tab === 'home' ? '#ECFDF5' : 'transparent', transition: 'all 0.2s' }} onClick={() => setTab('home')}>
          <Home size={20} />
          <span style={{ fontSize: '10px', fontWeight: tab === 'home' ? '700' : '500', marginTop: '2px' }}>Home</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: tab === 'medicines' ? '#1B8A43' : '#6B7280', padding: '4px 12px', borderRadius: '12px', background: tab === 'medicines' ? '#ECFDF5' : 'transparent', transition: 'all 0.2s' }} onClick={() => setTab('medicines')}>
          <Search size={20} />
          <span style={{ fontSize: '10px', fontWeight: tab === 'medicines' ? '700' : '500', marginTop: '2px' }}>Medicines</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: tab === 'orders' ? '#1B8A43' : '#6B7280', padding: '4px 12px', borderRadius: '12px', background: tab === 'orders' ? '#ECFDF5' : 'transparent', transition: 'all 0.2s' }} onClick={() => setTab('orders')}>
          <ListFilter size={20} />
          <span style={{ fontSize: '10px', fontWeight: tab === 'orders' ? '700' : '500', marginTop: '2px' }}>Orders</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: tab === 'cart' ? '#1B8A43' : '#6B7280', padding: '4px 12px', borderRadius: '12px', background: tab === 'cart' ? '#ECFDF5' : 'transparent', position: 'relative', transition: 'all 0.2s' }} onClick={() => setTab('cart')}>
          <ShoppingCart size={20} />
          {cartItemCount > 0 && (
            <div style={{ position: 'absolute', top: -2, right: 6, background: '#F27C08', color: 'white', fontSize: '9px', fontWeight: '800', width: '15px', height: '15px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {cartItemCount}
            </div>
          )}
          <span style={{ fontSize: '10px', fontWeight: tab === 'cart' ? '700' : '500', marginTop: '2px' }}>Cart</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: tab === 'account' ? '#1B8A43' : '#6B7280', padding: '4px 12px', borderRadius: '12px', background: tab === 'account' ? '#ECFDF5' : 'transparent', transition: 'all 0.2s' }} onClick={() => setTab('account')}>
          <User size={20} />
          <span style={{ fontSize: '10px', fontWeight: tab === 'account' ? '700' : '500', marginTop: '2px' }}>Account</span>
        </div>
      </nav>

      <style>{`
        /* Hide all scrollbars on mobile & web elements strictly */
        * {
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }
        *::-webkit-scrollbar, *::-webkit-scrollbar-thumb, *::-webkit-scrollbar-track {
          display: none !important;
          width: 0px !important;
          height: 0px !important;
          background: transparent !important;
        }

        @media (max-width: 768px) {
          main {
            padding: 1rem 0.75rem 95px 0.75rem !important;
          }
          .patient-header {
            padding: 0.75rem 0.875rem !important;
            flex-wrap: wrap !important;
            gap: 0.5rem !important;
          }
          .header-search {
            order: 3 !important;
            min-width: 100% !important;
            max-width: 100% !important;
          }
          .header-search button {
            width: 42px !important;
            height: 42px !important;
            flex-shrink: 0 !important;
          }
          .header-right-actions {
            display: none !important;
          }
          .patient-hero-banner {
            padding: 1.25rem 1rem !important;
            min-height: 170px !important;
            border-radius: 18px !important;
          }
          .patient-hero-title {
            font-size: 20px !important;
          }
          .rx-banner {
            padding: 1.25rem 1rem !important;
            border-radius: 18px !important;
          }
          .quick-actions-grid {
            display: flex !important;
            gap: 0.875rem !important;
            overflow-x: auto !important;
            padding-bottom: 0.5rem !important;
            -webkit-overflow-scrolling: touch !important;
          }
          .quick-actions-grid > div {
            flex: 0 0 auto !important;
            width: 70px !important;
          }
          .category-circle {
            width: 58px !important;
            height: 58px !important;
          }
          .products-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 0.75rem !important;
          }
          .cart-layout-grid {
            grid-template-columns: 1fr !important;
          }
          .floating-support-btn {
            bottom: 72px !important;
            right: 0.875rem !important;
            width: 46px !important;
            height: 46px !important;
          }
          .modal-content {
            padding: 1.25rem !important;
            max-width: 92vw !important;
            border-radius: 20px !important;
          }
        }
        @media (min-width: 769px) {
          .patient-bottom-nav {
            display: none !important;
          }
        }
      `}</style>

      {/* MODAL 1: Upload Prescription */}
      {showRxModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: 'white', width: '100%', maxWidth: '480px', borderRadius: '24px', padding: '2rem', position: 'relative' }}>
            <button onClick={() => setShowRxModal(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '22px', fontWeight: '900', color: '#111827' }}>Upload Prescription</h3>
            <p style={{ margin: '0 0 1.5rem 0', color: '#6B7280', fontSize: '14px' }}>Upload your doctor's prescription for quick validation</p>

            {rxSuccess ? (
              <div style={{ textAlignment: 'center', padding: '2rem 0', color: '#10B981', fontWeight: '700' }}>
                <Check size={48} style={{ display: 'block', margin: '0 auto 1rem auto' }} />
                Prescription Uploaded Successfully!
              </div>
            ) : (
              <form onSubmit={handleRxSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ border: '2px dashed #34D399', borderRadius: '16px', padding: '2rem', textAlign: 'center', background: '#ECFDF5', cursor: 'pointer' }}>
                  <UploadCloud size={40} color="#10B981" style={{ marginBottom: '0.5rem' }} />
                  <p style={{ margin: '0 0 0.25rem 0', fontWeight: '700', color: '#065F46' }}>Click or Drag File to Upload</p>
                  <span style={{ fontSize: '12px', color: '#6B7280' }}>Supports JPG, PNG, PDF (Max 10MB)</span>
                  <input type="file" onChange={e => setRxFile(e.target.files[0])} style={{ display: 'none' }} id="rxFileInput" />
                </div>
                {rxFile && <div style={{ fontSize: '13px', fontWeight: '600', color: '#10B981' }}>Selected: {rxFile.name}</div>}

                <div>
                  <label style={{ fontSize: '13px', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '0.25rem' }}>Additional Instructions / Notes</label>
                  <textarea 
                    placeholder="e.g. Please deliver 1 month supply" 
                    value={rxNotes} 
                    onChange={e => setRxNotes(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '14px', boxSizing: 'border-box' }} 
                  />
                </div>

                <button type="submit" style={{ background: '#1B8A43', color: 'white', border: 'none', padding: '0.875rem', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer', marginTop: '0.5rem' }}>
                  Submit Prescription
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: Change Delivery Address */}
      {showAddressModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: 'white', width: '100%', maxWidth: '420px', borderRadius: '24px', padding: '2rem', position: 'relative' }}>
            <button onClick={() => setShowAddressModal(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '20px', fontWeight: '900', color: '#111827' }}>Select Delivery Address</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {['Home - 123, MG Road', 'Office - Tech Park, Sector 5', 'Parents - 45, Park Street'].map((addr, i) => (
                <div 
                  key={i} 
                  onClick={() => { setDeliveryAddress(addr); setShowAddressModal(false); showToast(`Delivering to ${addr}`); }}
                  style={{ padding: '1rem', borderRadius: '12px', border: deliveryAddress === addr ? '2px solid #1B8A43' : '1px solid #E2E8F0', background: deliveryAddress === addr ? '#ECFDF5' : 'white', cursor: 'pointer', fontWeight: '600', fontSize: '14px', color: '#111827' }}
                >
                  {addr}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Support Help */}
      {showSupportModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: 'white', width: '100%', maxWidth: '420px', borderRadius: '24px', padding: '2rem', position: 'relative' }}>
            <button onClick={() => setShowSupportModal(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            <div style={{ textAlignment: 'center', marginBottom: '1.5rem' }}>
              <HelpCircle size={48} color="#F27C08" style={{ marginBottom: '0.5rem' }} />
              <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '22px', fontWeight: '900', color: '#111827' }}>Med India Support</h3>
              <p style={{ margin: 0, color: '#6B7280', fontSize: '14px' }}>We are here 24/7 to help you with medicines & orders</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <a href="tel:1800123456" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#ECFDF5', color: '#1B8A43', textDecoration: 'none', borderRadius: '12px', fontWeight: '700' }}>
                <PhoneCall size={20} /> Toll Free: 1800-123-456
              </a>
              <div style={{ padding: '1rem', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '13px', color: '#4B5563' }}>
                💬 Live Chat Support available 9 AM - 9 PM daily
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}