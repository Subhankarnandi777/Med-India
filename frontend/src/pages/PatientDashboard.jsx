import React, { useState, useEffect, useRef } from 'react';
import { fetchMedicines, createOrder } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { ShoppingCart, LogOut, Package, Pill, Search, ListFilter, Menu, Bell, MapPin, ChevronDown, Heart, Leaf, Tag, FileText, User, Home, ArrowRight, Camera, Image, Upload, CheckCircle, Truck, ShieldCheck, MessageCircle, Edit3, Star, Ticket, Activity, Headset, ChevronRight, Phone, Mail, FileUp, ClipboardList, CreditCard, HelpCircle, FlaskConical, Percent, ExternalLink, ChevronUp, ArrowLeft, MessageSquare } from 'lucide-react';

const OffersTab = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
    {/* Search */}
    <div style={{ display: 'flex', background: 'white', padding: '1rem', borderRadius: '16px', alignItems: 'center', gap: '1rem', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
      <Search color="#6B7280" />
      <input type="text" placeholder="Search for offers..." style={{ border: 'none', outline: 'none', flex: 1, fontSize: '16px' }} />
      <ListFilter color="#1B8A43" />
    </div>

    {/* Hero Banner */}
    <div className="offers-hero">
      <span style={{ fontSize: '14px', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase', color: '#F27C08' }}>LIMITED TIME</span>
      <h2 className="offers-hero-title">Flat 25% Off<br/>On Lab Tests</h2>
      <button style={{ background: '#F27C08', border: 'none', color: 'white', padding: '1rem 2.5rem', borderRadius: '12px', fontSize: '16px', fontWeight: '800', cursor: 'pointer', transition: 'transform 0.1s' }} onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'} onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}>Claim Now</button>
    </div>

    {/* Side-by-Side Desktop Layout */}
    <div className="offers-layout">
      
      {/* Main Content: Hot Deals */}
      <div className="offers-main" style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: 0, fontSize: '24px', fontWeight: '800' }}>Hot Deals</h3>
          <span style={{ color: '#1B8A43', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>View All →</span>
        </div>
        <div className="hot-deals-grid">
          <div style={{ background: 'white', borderRadius: '20px', padding: '1.5rem', border: '1px solid #E5E7EB', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 24, background: '#F27C08', color: 'white', fontSize: '12px', fontWeight: '800', padding: '6px 12px', borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px' }}>30% OFF</div>
            <div style={{ height: '160px', background: '#F3F4F6', borderRadius: '12px', marginBottom: '1.5rem', marginTop: '1rem' }}></div>
            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '18px', fontWeight: '700' }}>Vim-Health Multi</h4>
            <p style={{ margin: '0 0 1.5rem 0', fontSize: '14px', color: '#6B7280' }}>60 Tablets</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '24px', fontWeight: '800' }}>₹450</span>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #1B8A43', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#1B8A43', transition: 'background 0.2s' }} onMouseOver={e => { e.currentTarget.style.background = '#1B8A43'; e.currentTarget.style.color = 'white'; }} onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#1B8A43'; }}><span style={{ fontSize: '24px', fontWeight: '600', lineHeight: 1 }}>+</span></div>
            </div>
          </div>
          <div style={{ background: 'white', borderRadius: '20px', padding: '1.5rem', border: '1px solid #E5E7EB', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 24, background: '#F27C08', color: 'white', fontSize: '12px', fontWeight: '800', padding: '6px 12px', borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px' }}>15% OFF</div>
            <div style={{ height: '160px', background: '#F3F4F6', borderRadius: '12px', marginBottom: '1.5rem', marginTop: '1rem' }}></div>
            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '18px', fontWeight: '700' }}>Quick-Heal Spray</h4>
            <p style={{ margin: '0 0 1.5rem 0', fontSize: '14px', color: '#6B7280' }}>100ml</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '24px', fontWeight: '800' }}>₹185</span>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #1B8A43', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#1B8A43', transition: 'background 0.2s' }} onMouseOver={e => { e.currentTarget.style.background = '#1B8A43'; e.currentTarget.style.color = 'white'; }} onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#1B8A43'; }}><span style={{ fontSize: '24px', fontWeight: '600', lineHeight: 1 }}>+</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar: Category Specials */}
      <div className="offers-sidebar" style={{ display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '24px', fontWeight: '800' }}>Category Specials</h3>
        <div className="category-specials-grid">
          <div style={{ background: '#86efac', borderRadius: '24px', padding: '2rem', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minHeight: '220px', justifyContent: 'center' }}>
            <Leaf size={160} color="rgba(0,0,0,0.05)" style={{ position: 'absolute', bottom: -30, right: -30 }} />
            <span style={{ background: '#166534', color: 'white', fontSize: '13px', fontWeight: '800', padding: '6px 16px', borderRadius: '20px', marginBottom: '1.5rem' }}>20% OFF</span>
            <h4 style={{ margin: '0 0 2rem 0', fontSize: '28px', fontWeight: '800', color: '#14532d' }}>Wellness<br/>Products</h4>
            <button style={{ background: '#166534', border: 'none', color: 'white', padding: '0.875rem 2rem', borderRadius: '12px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', zIndex: 2 }}>Browse</button>
          </div>
          
          <div style={{ background: '#60a5fa', borderRadius: '24px', padding: '2rem', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <User size={80} color="rgba(255,255,255,0.2)" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', right: '1.5rem' }} />
            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '24px', fontWeight: '800', color: 'white' }}>Baby Care</h4>
            <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px', fontWeight: '600' }}>Flat 15% Off</span>
          </div>

          <div style={{ background: '#f97316', borderRadius: '24px', padding: '2rem', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Heart size={80} color="rgba(255,255,255,0.2)" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', right: '1.5rem' }} />
            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '24px', fontWeight: '800', color: 'white' }}>Diabetes</h4>
            <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px', fontWeight: '600' }}>Up to 40% Off</span>
          </div>
        </div>
      </div>
    </div>

    {/* Refer & Earn */}
    <div className="refer-banner">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ width: '64px', height: '64px', background: '#f97316', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
           <span style={{ color: 'white', fontSize: '32px', fontWeight: '800', lineHeight: 1 }}>★</span>
        </div>
        <div>
          <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '20px', fontWeight: '800', color: '#111827' }}>Refer & Earn</h4>
          <p style={{ margin: 0, fontSize: '15px', color: '#6B7280', fontWeight: '600' }}>Get ₹100 for each friend you invite</p>
        </div>
      </div>
      <button style={{ background: 'white', border: 'none', color: '#f97316', padding: '1rem 2.5rem', borderRadius: '12px', fontSize: '16px', fontWeight: '800', cursor: 'pointer', width: '100%', maxWidth: '200px' }}>Invite Now</button>
    </div>
  </div>
);

const UploadPrescriptionTab = () => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/api/prescriptions/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (!response.ok) throw new Error('Upload failed');
      const data = await response.json();
      alert(`Success! Your prescription has been uploaded and verified.`);
    } catch (error) {
      alert(error.message || "An error occurred while uploading.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
  <div className="up-container">
    <div className="up-column">
      <div>
        <h2 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 0.5rem 0' }}>Upload Prescription</h2>
        <p style={{ fontSize: '14px', color: '#6B7280', margin: 0, lineHeight: 1.5 }}>Quickly upload your doctor's prescription and get medicines delivered.</p>
      </div>

    <div className="up-orange-card">
      <div className="up-secure-badge">
        <ShieldCheck size={14} /> 100% SECURE
      </div>
      <div>
        <div style={{ background: 'rgba(255,255,255,0.2)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
          <FileText size={24} color="white" />
        </div>
        <h3 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 0.5rem 0' }}>Ready to order?</h3>
        <p style={{ fontSize: '14px', margin: 0, opacity: 0.9 }}>Get your medicine order verified in 30 mins.</p>
      </div>
      
      {/* Hidden File Inputs */}
      <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileUpload} />
      <input type="file" accept="image/*" capture="environment" ref={cameraInputRef} style={{ display: 'none' }} onChange={handleFileUpload} />

      <div className="up-action-buttons">
        <button className="up-btn" onClick={() => cameraInputRef.current.click()} disabled={isUploading}>
          <Camera size={18} color="#F97316"/> {isUploading ? 'Uploading...' : 'Take Photo'}
        </button>
        <button className="up-btn-outline" onClick={() => fileInputRef.current.click()} disabled={isUploading}>
          <Image size={18}/> {isUploading ? 'Uploading...' : 'Gallery'}
        </button>
      </div>
    </div>

    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '800', margin: 0 }}>How it works</h3>
        <span style={{ background: '#D1FAE5', color: '#065F46', fontSize: '12px', fontWeight: '700', padding: '4px 12px', borderRadius: '12px' }}>Simple Process</span>
      </div>
      <div className="up-step-grid">
        <div className="up-step-card">
          <div style={{ background: '#FFEDD5', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Upload size={20} color="#EA580C" />
          </div>
          <span style={{ fontSize: '12px', fontWeight: '700' }}>1. Upload Photo</span>
        </div>
        <div className="up-step-card">
          <div style={{ background: '#D1FAE5', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle size={20} color="#059669" />
          </div>
          <span style={{ fontSize: '12px', fontWeight: '700' }}>2. We Verify</span>
        </div>
        <div className="up-step-card">
          <div style={{ background: '#DBEAFE', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Truck size={20} color="#2563EB" />
          </div>
          <span style={{ fontSize: '12px', fontWeight: '700' }}>3. Delivered</span>
        </div>
      </div>
    </div>

      <div className="up-privacy-banner">
        <div style={{ background: '#D1FAE5', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <ShieldCheck size={20} color="#065F46" />
        </div>
        <div>
          <h4 style={{ fontSize: '14px', fontWeight: '800', margin: '0 0 0.25rem 0' }}>Data Privacy Guaranteed</h4>
          <p style={{ fontSize: '12px', color: '#4B5563', margin: 0, lineHeight: 1.4 }}>Your prescriptions are encrypted and accessible only by licensed pharmacists.</p>
        </div>
      </div>
    </div>

    <div className="up-column">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '800', margin: 0 }}>Recent Prescriptions</h3>
        <span style={{ color: '#F97316', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>View All</span>
      </div>
      
      <div className="up-list-card">
        <div style={{ width: '64px', height: '64px', background: '#F3F4F6', borderRadius: '8px', overflow: 'hidden' }}>
          <img src="/upload.jpeg" alt="Prescription" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h4 style={{ fontSize: '15px', fontWeight: '800', margin: '0 0 4px 0' }}>Prescription - Dr. Sharma</h4>
            <span style={{ background: '#86efac', color: '#14532d', fontSize: '10px', fontWeight: '800', padding: '2px 6px', borderRadius: '8px' }}>VERIFIED</span>
          </div>
          <p style={{ fontSize: '12px', color: '#6B7280', margin: '0 0 8px 0' }}>Uploaded: 12 Oct 2023</p>
          <span style={{ color: '#059669', fontSize: '13px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>Reorder Now <ArrowRight size={14}/></span>
        </div>
      </div>

      <div className="up-list-card">
        <div style={{ width: '64px', height: '64px', background: '#F3F4F6', borderRadius: '8px', overflow: 'hidden' }}>
          <img src="/banner.jpeg" alt="Checkup" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h4 style={{ fontSize: '15px', fontWeight: '800', margin: '0 0 4px 0' }}>Annual Checkup - Apollo</h4>
            <span style={{ background: '#E0E7FF', color: '#3730A3', fontSize: '10px', fontWeight: '800', padding: '2px 6px', borderRadius: '8px' }}>DELIVERED</span>
          </div>
          <p style={{ fontSize: '12px', color: '#6B7280', margin: '0 0 8px 0' }}>Uploaded: 28 Sep 2023</p>
          <span style={{ color: '#1E3A8A', fontSize: '13px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>View Details <ArrowRight size={14}/></span>
        </div>
      </div>
      <div className="up-assistance">
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '70%' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '900', margin: '0 0 0.5rem 0', color: '#111827' }}>Need assistance?</h3>
          <p style={{ fontSize: '14px', color: '#4B5563', margin: '0 0 1.5rem 0', lineHeight: 1.4 }}>Talk to our healthcare experts for help with prescriptions.</p>
          <button style={{ background: '#111827', color: 'white', border: 'none', borderRadius: '24px', padding: '0.75rem 1.5rem', fontSize: '14px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <MessageCircle size={18} /> Chat with Us
          </button>
        </div>
        <div style={{ position: 'absolute', right: '-1rem', bottom: '-1rem', opacity: 0.1 }}>
          <span style={{ fontSize: '120px', fontWeight: '900' }}>?</span>
        </div>
      </div>
    </div>
  </div>
  );
};

const PlaceholderTab = ({ title, icon, onBack }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 1rem', textAlign: 'center', background: 'white', borderRadius: '24px', border: '1px solid #E5E7EB', minHeight: '400px' }}>
    <div style={{ width: '80px', height: '80px', background: '#F3F4F6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: '#6B7280' }}>
      {icon}
    </div>
    <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#111827', marginBottom: '0.5rem' }}>{title}</h2>
    <p style={{ fontSize: '15px', color: '#6B7280', maxWidth: '400px', margin: '0 auto 2rem' }}>We are working hard to bring this feature to you. Stay tuned!</p>
    <button onClick={onBack} style={{ background: '#1B8A43', color: 'white', border: 'none', padding: '0.75rem 2rem', borderRadius: '12px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#14532d'} onMouseOut={e => e.currentTarget.style.background = '#1B8A43'}>
      Go Back Home
    </button>
  </div>
);

const AccountTab = ({ setTab }) => (
  <div className="account-container">
    {/* Profile Card */}
    <div className="account-profile-card">
      <div className="account-profile-header">
        <div style={{ position: 'relative' }}>
          <div style={{ width: '72px', height: '72px', background: '#22c55e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '4px solid white', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <User size={40} color="white" />
          </div>
          <div style={{ position: 'absolute', bottom: 0, right: 0, background: '#22c55e', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid white', cursor: 'pointer' }}>
            <Edit3 size={12} color="white" />
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#111827', margin: '0 0 0.5rem 0' }}>User Name</h2>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', background: '#dcfce7', color: '#166534', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '11px', fontWeight: '700', marginBottom: '0.75rem' }}>
            <Star size={12} /> Premium Member
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#374151', fontSize: '13px', fontWeight: '600' }}>
              <Phone size={14} color="#16a34a" /> +91 98765 43210
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#374151', fontSize: '13px', fontWeight: '600' }}>
              <Mail size={14} color="#16a34a" /> user@email.com
            </div>
          </div>
        </div>
        <div>
          <ShieldCheck size={48} color="#22c55e" style={{ opacity: 0.2 }} />
        </div>
      </div>

      <div className="account-stats-row">
        <div className="account-stat-pill">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '32px', height: '32px', background: '#22c55e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Star size={16} color="white" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '11px', color: '#4B5563', fontWeight: '600' }}>MedPoints</span>
              <span style={{ fontSize: '16px', fontWeight: '800', color: '#111827', lineHeight: 1 }}>230</span>
            </div>
          </div>
          <ChevronRight size={18} color="#6B7280" />
        </div>
        <div className="account-stat-pill">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '32px', height: '32px', background: '#22c55e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Ticket size={16} color="white" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '11px', color: '#4B5563', fontWeight: '600' }}>My Coupons</span>
              <span style={{ fontSize: '14px', fontWeight: '800', color: '#111827', lineHeight: 1 }}>5 Available</span>
            </div>
          </div>
          <ChevronRight size={18} color="#6B7280" />
        </div>
      </div>
    </div>

    {/* Quick Actions */}
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#111827', margin: 0 }}>Quick Actions</h3>
        <span style={{ fontSize: '13px', fontWeight: '700', color: '#16a34a', cursor: 'pointer' }}>View All &gt;</span>
      </div>
      <div className="account-quick-actions">
        <div className="account-qa-btn" onClick={() => setTab('orders')}>
          <div style={{ width: '40px', height: '40px', background: '#dcfce7', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.25rem' }}>
            <ClipboardList size={22} color="#16a34a" />
          </div>
          <span style={{ fontSize: '12px', fontWeight: '700', color: '#374151' }}>My Orders</span>
        </div>
        <div className="account-qa-btn" onClick={() => setTab('upload')}>
          <div style={{ width: '40px', height: '40px', background: '#f3e8ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.25rem' }}>
            <FileUp size={22} color="#9333ea" />
          </div>
          <span style={{ fontSize: '12px', fontWeight: '700', color: '#374151' }}>Upload Prescription</span>
        </div>
        <div className="account-qa-btn">
          <div style={{ width: '40px', height: '40px', background: '#ffe4e6', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.25rem' }}>
            <Activity size={22} color="#e11d48" />
          </div>
          <span style={{ fontSize: '12px', fontWeight: '700', color: '#374151' }}>Health Dashboard</span>
        </div>
        <div className="account-qa-btn" onClick={() => setTab('support')}>
          <div style={{ width: '40px', height: '40px', background: '#ffedd5', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.25rem' }}>
            <Headset size={22} color="#ea580c" />
          </div>
          <span style={{ fontSize: '12px', fontWeight: '700', color: '#374151' }}>Support</span>
        </div>
      </div>
    </div>

    {/* Options List */}
    <div className="account-list-card">
      {[
        { icon: <Package size={22} color="#16a34a" />, bg: '#dcfce7', title: 'My Orders', sub: 'Track & manage your orders', tab: 'orders' },
        { icon: <FileText size={22} color="#0ea5e9" />, bg: '#e0f2fe', title: 'Medical Records', sub: 'Prescriptions & reports', tab: 'records' },
        { icon: <FlaskConical size={22} color="#ea580c" />, bg: '#ffedd5', title: 'My Lab Tests', sub: 'Bookings & test results', tab: 'lab_tests' },
        { icon: <MapPin size={22} color="#3b82f6" />, bg: '#dbeafe', title: 'Manage Addresses', sub: 'Saved delivery locations', tab: 'addresses' },
        { icon: <CreditCard size={22} color="#8b5cf6" />, bg: '#ede9fe', title: 'Payments & Refunds', sub: 'Cards, UPI & refund history', tab: 'payments' },
        { icon: <ShieldCheck size={22} color="#22c55e" />, bg: '#dcfce7', title: 'Health Plans', sub: 'Active subscriptions & benefits', tab: 'health_plans' },
        { icon: <HelpCircle size={22} color="#f97316" />, bg: '#ffedd5', title: 'Help & Support', sub: 'FAQs & customer care', tab: 'support' },
      ].map((item, i) => (
        <div key={i} className="account-list-item" onClick={() => setTab(item.tab)}>
          <div style={{ width: '40px', height: '40px', background: item.bg, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {item.icon}
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '15px', fontWeight: '800', color: '#111827' }}>{item.title}</span>
            <span style={{ fontSize: '13px', color: '#6B7280' }}>{item.sub}</span>
          </div>
          <ChevronRight size={20} color="#9CA3AF" />
        </div>
      ))}
    </div>

    {/* Bottom Banner */}
    <div style={{ background: 'linear-gradient(90deg, #dcfce7 0%, #f0fdf4 100%)', borderRadius: '16px', padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem', border: '1px solid #bbf7d0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: '48px', height: '48px', background: '#22c55e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Percent size={24} color="white" />
        </div>
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#111827', margin: '0 0 0.25rem 0' }}>Flat 20% OFF</h3>
          <p style={{ fontSize: '13px', color: '#4B5563', margin: '0 0 0.25rem 0' }}>On all medicines</p>
          <div style={{ fontSize: '12px', color: '#111827', fontWeight: '600' }}>
            Use code <span style={{ color: '#16a34a', border: '1px dashed #16a34a', padding: '0.1rem 0.5rem', borderRadius: '4px', background: 'rgba(22, 163, 74, 0.1)' }}>MED20</span>
          </div>
        </div>
      </div>
      <button style={{ background: '#16a34a', color: 'white', border: 'none', padding: '0.75rem 1.25rem', borderRadius: '12px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
        Order Now <ChevronRight size={16} />
      </button>
    </div>
  </div>
);

const SupportTab = ({ setTab }) => {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    { q: 'How do I upload a prescription?', a: 'You can upload your prescription by clicking the "Upload Prescription" button on the home dashboard or in the quick actions section.' },
    { q: 'When will my order be delivered?', a: 'Standard delivery takes 24-48 hours. You can track your active orders from the "My Orders" tab.' },
    { q: 'How can I cancel my order?', a: 'You can cancel any order within 1 hour of placing it by visiting the "My Orders" section and clicking "Cancel".' },
    { q: 'Is my data secure?', a: 'Yes. All personal and medical data is fully encrypted and stored securely in accordance with national health data privacy regulations.' }
  ];

  return (
    <div className="support-container">
      {/* Header */}
      <div className="support-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }} onClick={() => setTab('account')}>
          <ArrowLeft size={24} color="#111827" />
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#111827', margin: 0 }}>Help & Support</h2>
        </div>
        <Bell size={24} color="#111827" style={{ cursor: 'pointer' }} />
      </div>

      {/* Search */}
      <div className="support-search">
        <Search size={20} color="#9CA3AF" />
        <input type="text" placeholder="Search help topics..." />
      </div>

      {/* Main Content */}
      <div className="support-main">
        {/* Contact Section */}
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#111827', margin: '0 0 1rem 0' }}>Still need help?</h3>
          
          <div className="support-live-chat" style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MessageSquare size={24} color="white" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '18px', fontWeight: '800', lineHeight: 1.2 }}>Live Chat</span>
                <span style={{ fontSize: '13px', opacity: 0.9 }}>Response time: &lt; 2 mins</span>
              </div>
            </div>
            <ChevronRight size={24} color="white" />
          </div>

          <div className="support-contact-grid">
            <div className="support-contact-card">
              <div style={{ width: '48px', height: '48px', background: '#dcfce7', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Phone size={24} color="#16a34a" />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#111827' }}>Call Us</span>
                <span style={{ fontSize: '14px', color: '#ea580c' }}>1800-555-0199</span>
              </div>
              <ExternalLink size={20} color="#4B5563" />
            </div>
            
            <div className="support-contact-card">
              <div style={{ width: '48px', height: '48px', background: '#e0f2fe', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Mail size={24} color="#0284c7" />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#111827' }}>Email Us</span>
                <span style={{ fontSize: '14px', color: '#ea580c' }}>support@medindia.com</span>
              </div>
              <ExternalLink size={20} color="#4B5563" />
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#111827', margin: '0 0 1rem 0' }}>FAQs</h3>
          <div>
            {faqs.map((faq, index) => (
              <div key={index} className="support-faq-item">
                <div className="support-faq-header" onClick={() => setOpenFaq(openFaq === index ? null : index)}>
                  <span>{faq.q}</span>
                  {openFaq === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
                {openFaq === index && (
                  <div className="support-faq-content">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Details */}
      <div style={{ textAlign: 'center', marginTop: '2rem', paddingBottom: '2rem' }}>
        <p style={{ fontSize: '12px', fontWeight: '600', color: '#4B5563', margin: '0 0 0.5rem 0' }}>Version 4.2.1 (Build 9921)</p>
        <p style={{ fontSize: '13px', fontWeight: '700', color: '#9a3412', margin: 0, cursor: 'pointer' }}>Privacy Policy & Terms</p>
      </div>
    </div>
  );
};

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
    { name: 'Search Medicines', icon: <img src="/search-icon.jpeg" alt="Search" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.5)', mixBlendMode: 'multiply' }} />, bg: '#FEE2E2', border: '#FECACA' },
    { name: 'Health Conditions', icon: <img src="/health-icon.jpeg" alt="Health Conditions" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.5)', mixBlendMode: 'multiply' }} />, bg: '#DBEAFE', border: '#BFDBFE' },
    { name: 'All Medicines', icon: <img src="/all-medicines.jpeg" alt="All Medicines" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.5)', mixBlendMode: 'multiply' }} />, bg: '#FFEDD5', border: '#FED7AA' },
    { name: 'Wellness Products', icon: <img src="/wellness-products.jpeg" alt="Wellness Products" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.5)', mixBlendMode: 'multiply' }} />, bg: '#D1FAE5', border: '#A7F3D0' },
    { name: 'Offers Zone', icon: <img src="/offer-zone.jpeg" alt="Offers Zone" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.5)', mixBlendMode: 'multiply' }} />, bg: '#EDE9FE', border: '#DDD6FE' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#F8FAFC', fontFamily: "'Inter', sans-serif" }}>
      
      {/* Top Header */}
      <header className="dashboard-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          {/* Logo */}
          <div style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer' }} onClick={() => setTab('home')}>
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
        <div className="header-search">
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
        <div className="header-actions">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: '#111827' }} onClick={() => setTab('home')}>
            <Home size={22} />
            <span className="header-action-label" style={{ fontSize: '12px', fontWeight: '600', marginTop: '4px' }}>Home</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: '#4B5563' }} onClick={() => setTab('orders')}>
            <Package size={22} />
            <span className="header-action-label" style={{ fontSize: '12px', fontWeight: '600', marginTop: '4px' }}>Orders</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: '#111827' }} onClick={() => setTab('cart')}>
            <ShoppingCart size={22} />
            <span className="header-action-label" style={{ fontSize: '12px', fontWeight: '600', marginTop: '4px' }}>Cart</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: '#111827', position: 'relative' }} onClick={() => setTab('alerts')}>
            <Bell size={22} />
            <div style={{ position: 'absolute', top: -2, right: 2, width: '8px', height: '8px', backgroundColor: '#EF4444', borderRadius: '50%', border: '2px solid white' }}></div>
            <span className="header-action-label" style={{ fontSize: '12px', fontWeight: '600', marginTop: '4px' }}>Alerts</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: '#111827' }} onClick={() => setTab('account')}>
            <User size={22} />
            <span className="header-action-label" style={{ fontSize: '12px', fontWeight: '600', marginTop: '4px' }}>Account</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: '#111827' }} onClick={logout}>
            <LogOut size={22} color="#EF4444" />
            <span className="header-action-label" style={{ fontSize: '12px', fontWeight: '600', marginTop: '4px', color: '#EF4444' }}>Logout</span>
          </div>
        </div>
      </header>

      <main style={{ flex: 1, padding: '2rem 4%', maxWidth: '1440px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        
        {tab === 'home' && (
          <>
            {/* Top Section Layout: Promo Banner & Upload Rx */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '3rem' }}>
          {/* Promo Banner */}
          <div className="promo-banner">
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.85) 45%, rgba(255,255,255,0) 100%)', zIndex: 1 }}></div>
            <div style={{ position: 'relative', zIndex: 2 }}>
              <span style={{ color: '#F27C08', fontSize: '14px', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase' }}>FAST • RELIABLE • SAFE</span>
              <h2 className="promo-title">
                Your Health,<br/>
                <span style={{ color: '#1B8A43' }}>Our Priority</span>
              </h2>
              <p className="promo-desc">Genuine medicines delivered quickly at your doorsteps</p>
              
              <button style={{ background: '#1B8A43', border: 'none', color: 'white', padding: '1rem 2.5rem', borderRadius: '30px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 15px rgba(27, 138, 67, 0.4)', transition: 'transform 0.1s', width: 'fit-content' }} onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'} onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}>
                Order Now <ArrowRight size={20} />
              </button>
            </div>
            
          </div>

          {/* Upload Prescription Banner */}
          <div className="upload-banner">
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(90deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.8) 40%, rgba(255,255,255,0) 100%)', zIndex: 1 }}></div>
            <div className="upload-content">
              <h3 className="upload-title">
                Upload Prescription <span style={{ background: '#1B8A43', color: 'white', borderRadius: '50%', width: '24px', height: '24px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>✓</span>
              </h3>
              <p style={{ margin: '0 0 2rem 0', fontSize: '16px', color: '#4B5563', lineHeight: '1.5' }}>Upload your prescription to get medicines delivered with exciting offers and up to 25% off.</p>
              <button onClick={() => setTab('upload')} style={{ background: '#1B8A43', border: 'none', color: 'white', padding: '0.875rem 1.5rem', borderRadius: '12px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 6px -1px rgba(27, 138, 67, 0.2)', transition: 'transform 0.1s' }} onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'} onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}>
                Upload Now <ArrowRight size={18} />
              </button>
            </div>
            <div style={{ position: 'relative', zIndex: 2, width: '140px', height: '180px', background: 'rgba(255, 255, 255, 0.95)', border: '2px dashed #34D399', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
               <FileText size={64} color="#10B981" />
               <span style={{ fontSize: '13px', fontWeight: '600', color: '#10B981' }}>Drag & Drop</span>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div style={{ marginBottom: '4rem' }}>
          <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '22px', fontWeight: '800', color: '#111827' }}>Explore Categories</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem' }}>
            {categories.map((cat, idx) => {
              const tabId = cat.name === 'Offers Zone' ? 'offers' : cat.name.toLowerCase().replace(' ', '_');
              return (
              <div key={idx} onClick={() => setTab(tabId)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', background: 'white', padding: '2rem 1rem', borderRadius: '20px', border: '1px solid #E5E7EB', cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }} onMouseOver={e => { e.currentTarget.style.borderColor = '#1B8A43'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)'; }} onMouseOut={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.02)'; }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', background: cat.bg, border: `1px solid ${cat.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.6), 0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                  {cat.icon}
                </div>
                <span style={{ fontSize: '16px', fontWeight: '700', color: '#374151', textAlign: 'center' }}>{cat.name}</span>
              </div>
              );
            })}
          </div>
        </div>
          </>
        )}

        {tab === 'offers' && <OffersTab />}
        {tab === 'upload' && <UploadPrescriptionTab />}
        {tab === 'account' && <AccountTab setTab={setTab} />}
        {tab === 'support' && <SupportTab setTab={setTab} />}
        {['orders', 'cart', 'alerts', 'search_medicines', 'health_conditions', 'all_medicines', 'wellness_products', 'records', 'lab_tests', 'addresses', 'payments', 'health_plans'].includes(tab) && (
          <PlaceholderTab 
            title={tab.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} 
            icon={<Package size={32} />} 
            onBack={() => setTab('home')} 
          />
        )}
      </main>

      {/* Floating Support Button (Bottom Right) */}
      {tab !== 'upload' && (
        <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', width: '64px', height: '64px', background: '#F27C08', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 25px -5px rgba(242, 124, 8, 0.5)', zIndex: 20, cursor: 'pointer', transition: 'transform 0.2s' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
           <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10H12V2Z"/><path d="M12 12 2.1 7.1"/></svg>
        </div>
      )}

    </div>
  );
}

