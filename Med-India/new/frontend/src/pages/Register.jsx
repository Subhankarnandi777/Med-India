import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/api';
import { User, Phone, Mail, Star, MapPin, Lock, Info, ArrowRight, ShoppingCart } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '', role: 'Patient', mobile: '',
    address: '', // for patient, seller, doctor
    shopName: '', drugLicense: '', // for seller
    specialization: '', medicalRegNo: '' // for doctor
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const data = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        mobile: formData.mobile
      });
      setMessage(data.message || 'Registration successful. You can now login.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError('Registration failed');
    }
  };

  const roles = ['Patient', 'Seller', 'Doctor'];

  return (
    <div className="register-layout" style={{
      display: 'flex',
      minHeight: '100vh',
      fontFamily: "'Inter', sans-serif",
      backgroundImage: "url('/registerbg.png')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>

      {/* Left Side Logo */}
      <div className="logo-container" style={{ flex: '1 1 300px', display: 'flex', justifyContent: 'center' }}>
        <img src="/logo.jpeg" alt="Med India Logo" className="brand-logo" />
      </div>

      {/* Form Panel */}
      <div style={{
        background: 'transparent',
        boxShadow: 'none',
        border: 'none',
        backdropFilter: 'none',
        padding: '2rem',

      }}>

        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h1 style={{ margin: '0 0 0.25rem 0', fontSize: '32px', color: '#1c355e', fontWeight: '800' }}>Create Account</h1>
          <p style={{ margin: 0, color: '#6b7280', fontSize: '16px' }}>Join the Med India Healthcare Ecosystem</p>
        </div>

        {error && <div style={{ background: '#FEE2E2', color: '#B91C1C', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '15px' }}>{error}</div>}
        {message && <div style={{ background: '#D1FAE5', color: '#065F46', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '15px' }}>{message}</div>}

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Segmented Role Selector */}
          <div style={{ display: 'flex', border: '1.5px solid #F27C08', borderRadius: '12px', overflow: 'hidden', background: 'white' }}>
            {roles.map((r, index) => (
              <div
                key={r}
                onClick={() => setFormData({ ...formData, role: r })}
                style={{
                  flex: 1,
                  textAlign: 'center',
                  padding: '0.875rem 0',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontSize: '15px',
                  background: formData.role === r ? '#1B8A43' : 'transparent',
                  color: formData.role === r ? 'white' : '#4b5563',
                  borderRight: index !== roles.length - 1 ? '1px solid #e5e7eb' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                {r}
              </div>
            ))}
          </div>

          {/* Personal Details Section */}
          <div>
            <div style={sectionHeaderStyle(false)}>
              <User size={18} strokeWidth={3} /> Personal Details
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div style={{ gridColumn: '1 / -1', position: 'relative' }}>
                <div style={iconWrapperStyle}><User size={20} /></div>
                <input type="text" placeholder="Enter your full name *" style={inputStyle} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div style={{ position: 'relative' }}>
                <div style={iconWrapperStyle}><Phone size={20} /></div>
                <input type="tel" placeholder="Enter mobile number *" style={inputStyle} value={formData.mobile} onChange={e => setFormData({ ...formData, mobile: e.target.value })} required />
              </div>
              <div style={{ position: 'relative' }}>
                <div style={iconWrapperStyle}><Mail size={20} /></div>
                <input type="email" placeholder="Enter email address *" style={inputStyle} value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
              </div>
            </div>
          </div>

          {/* Dynamic Section based on Role */}
          {formData.role === 'Patient' && (
            <div>
              <div style={sectionHeaderStyle(true)}>
                <Star size={18} fill="#F27C08" strokeWidth={0} /> Delivery Address
              </div>
              <div style={{ position: 'relative' }}>
                <div style={iconWrapperStyle}><MapPin size={20} /></div>
                <input type="text" placeholder="Enter your full delivery address *" style={inputStyle} value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} required />
              </div>
            </div>
          )}

          {formData.role === 'Seller' && (
            <div>
              <div style={sectionHeaderStyle(true)}>
                <Star size={18} fill="#F27C08" strokeWidth={0} /> Business Details
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div style={{ gridColumn: '1 / -1', position: 'relative' }}>
                  <div style={iconWrapperStyle}><ShoppingCart size={20} /></div>
                  <input type="text" placeholder="Pharmacy / Shop Name" style={inputStyle} value={formData.shopName} onChange={e => setFormData({ ...formData, shopName: e.target.value })} required />
                </div>
                <div style={{ position: 'relative' }}>
                  <div style={iconWrapperStyle}><Info size={20} /></div>
                  <input type="text" placeholder="Drug License / GST Number" style={inputStyle} value={formData.drugLicense} onChange={e => setFormData({ ...formData, drugLicense: e.target.value })} required />
                </div>
                <div style={{ position: 'relative' }}>
                  <div style={iconWrapperStyle}><MapPin size={20} /></div>
                  <input type="text" placeholder="Enter complete shop address *" style={inputStyle} value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} required />
                </div>
              </div>
            </div>
          )}

          {formData.role === 'Doctor' && (
            <div>
              <div style={sectionHeaderStyle(true)}>
                <Star size={18} fill="#F27C08" strokeWidth={0} /> Professional Details
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div style={{ gridColumn: '1 / -1', position: 'relative' }}>
                  <div style={iconWrapperStyle}><Star size={20} fill="#1B8A43" /></div>
                  <input type="text" placeholder="e.g. General Physician, Cardiologist" style={inputStyle} value={formData.specialization} onChange={e => setFormData({ ...formData, specialization: e.target.value })} required />
                </div>
                <div style={{ position: 'relative' }}>
                  <div style={iconWrapperStyle}><Info size={20} /></div>
                  <input type="text" placeholder="Medical Council Registration No." style={inputStyle} value={formData.medicalRegNo} onChange={e => setFormData({ ...formData, medicalRegNo: e.target.value })} required />
                </div>
                <div style={{ position: 'relative' }}>
                  <div style={iconWrapperStyle}><MapPin size={20} /></div>
                  <input type="text" placeholder="Enter clinic / hospital address *" style={inputStyle} value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} required />
                </div>
              </div>
            </div>
          )}

          {/* Security Section */}
          <div>
            <div style={sectionHeaderStyle(false)}>
              <Lock size={18} strokeWidth={3} /> Security
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div style={{ position: 'relative' }}>
                <div style={iconWrapperStyle}><Lock size={20} /></div>
                <input type="password" placeholder="Create a strong password *" style={inputStyle} value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required />
                <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', right: '1rem', color: '#4b5563' }}>
                  <Info size={16} fill="#4b5563" color="white" />
                </div>
              </div>
              <div style={{ position: 'relative' }}>
                <div style={iconWrapperStyle}><Lock size={20} /></div>
                <input type="password" placeholder="Re-enter your password *" style={inputStyle} value={formData.confirmPassword} onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })} required />
                <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', right: '1rem', color: '#4b5563' }}>
                  <Info size={16} fill="#4b5563" color="white" />
                </div>
              </div>
            </div>
          </div>

          {/* Gray Pill Button */}
          <button
            type="submit"
            style={{
              marginTop: '1rem',
              width: '100%',
              padding: '1.25rem',
              background: '#7a7a7a',
              color: 'white',
              border: 'none',
              borderRadius: '16px',
              fontWeight: '700',
              fontSize: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              cursor: 'pointer',
              transition: 'transform 0.1s ease',
              boxShadow: '0 0 0 2px #F27C08, 0 0 0 4px #1B8A43'
            }}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            Register as {formData.role}
            <div style={{ background: '#374151', borderRadius: '50%', padding: '4px', display: 'flex' }}>
              <ArrowRight size={16} color="white" />
            </div>
          </button>
        </form>

        <p style={{ marginTop: '2rem', fontSize: '15px', color: '#6b7280', textAlign: 'center' }}>
          Already have an account? <Link to="/login" style={{ color: '#1B8A43', fontWeight: '800', textDecoration: 'none' }}>Sign In</Link>
        </p>
      </div>

      <style>{`
        input:focus { border-color: #F27C08 !important; outline: none !important; box-shadow: 0 0 0 3px rgba(242, 124, 8, 0.1) !important; }
        
        .register-layout {
          padding: 2rem 8%;
          flex-wrap: nowrap;
          gap: 2rem;
        }
        
        .brand-logo {
          width: 100%;
          max-width: 450px;
          mix-blend-mode: multiply; /* Removes the white background */
        }
        
        @media (max-width: 900px) {
          .register-layout {
            padding: 2rem 5%;
            flex-wrap: wrap;
            justify-content: center;
          }
          .brand-logo {
            max-width: 300px;
            margin-bottom: 1rem;
          }
        }
      `}</style>
    </div>
  );
}

const sectionHeaderStyle = (isOrange) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  color: isOrange ? '#F27C08' : '#1B8A43',
  fontWeight: '700',
  fontSize: '14px',
  marginBottom: '0.75rem'
});

const iconWrapperStyle = {
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  left: '1.25rem',
  color: '#1B8A43'
};

const inputStyle = {
  width: '100%',
  padding: '1rem 1rem 1rem 3.25rem',
  border: '1.5px solid #1B8A43',
  borderRadius: '12px',
  fontSize: '15px',
  color: '#111827',
  background: '#ffffff',
  boxSizing: 'border-box',
  transition: 'all 0.2s ease',
};