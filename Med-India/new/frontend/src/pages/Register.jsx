import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { register, verifyOtp, resendOtp } from '../services/api';
import { User, Phone, Mail, Star, MapPin, Lock, Info, ArrowRight, ShoppingCart, KeyRound } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '', role: 'Patient', mobile: '',
    address: '', // for patient, seller, doctor
    shopName: '', drugLicense: '', // for seller
    specialization: '', medicalRegNo: '' // for doctor
  });
  const [step, setStep] = useState('register'); // 'register' or 'otp'
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { login: authenticate } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const result = await register({
        email: formData.email,
        password: formData.password,
        fullName: formData.name,
        role: formData.role,
        mobile: formData.mobile,
        address: formData.address,
        shopName: formData.shopName,
        licenseNumber: formData.drugLicense,
        specialty: formData.specialization,
        docLicenseId: formData.medicalRegNo,
      });

      setStep('otp');
      setMessage('A 6-digit verification code has been sent to your email. Please enter it below to complete registration.');
    } catch (err) {
      setError(err.message || 'Registration failed');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const result = await verifyOtp(formData.email, otp);
      if (result && result.success) {
        authenticate(
          {
            id: result.user?.id || 'user-' + Date.now(),
            email: result.user?.email || formData.email,
            role: result.user?.role || formData.role,
            name: result.user?.full_name || formData.name,
          },
          result.token || ''
        );
        setMessage('Registration & verification successful! Redirecting...');
        setTimeout(() => navigate('/'), 1500);
      }
    } catch (err) {
      setError(err.message || 'OTP verification failed. Please check the code.');
    }
  };

  const handleResendOtp = async () => {
    setError('');
    try {
      await resendOtp(formData.email);
      setMessage('OTP resent successfully. Check your inbox.');
    } catch (err) {
      setError(err.message || 'Failed to resend OTP.');
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
      justifyContent: 'center',
    }}>



      {/* Form Panel */}
      <div style={{
        width: "100%",
        maxWidth: "450px",

        border: "1.5px solid #4F5FA8",
        borderRadius: "34px",

        padding: "30px",

        background: "rgba(255,255,255,0.18)",
        backdropFilter: "blur(2px)",
        WebkitBackdropFilter: "blur(2px)",

        boxSizing: "border-box",

      }}>

        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h1 style={{ margin: '0 0 0.25rem 0', fontSize: '32px', color: '#1c355e', fontWeight: '800' }}>Create Account</h1>
          <p style={{ margin: 0, color: '#6b7280', fontSize: '16px' }}>Join the Med India Healthcare Ecosystem</p>
        </div>

        {error && <div style={{ background: '#FEE2E2', color: '#B91C1C', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '15px' }}>{error}</div>}
        {message && <div style={{ background: '#D1FAE5', color: '#065F46', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '15px' }}>{message}</div>}

        {step === 'otp' ? (
          <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1B8A43', fontWeight: '700', fontSize: '14px', marginBottom: '0.5rem' }}>
                <KeyRound size={16} strokeWidth={2.5} /> Enter 6-Digit Verification Code
              </div>
              <div style={{ position: 'relative' }}>
                <div style={iconWrapperStyle}><KeyRound size={20} /></div>
                <input
                  type="text"
                  placeholder="e.g. 123456"
                  style={{ ...inputStyle, fontSize: '20px', letterSpacing: '4px', textAlign: 'center' }}
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  maxLength={6}
                  required
                />
              </div>
            </div>

            <div style={{ padding: "2px", borderRadius: "22px", background: "linear-gradient(135deg, #F27C08 0%, #F2A700 30%, #38B64A 70%, #1B8A43 100%)" }}>
              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "1rem",
                  background: "#1B8A43",
                  color: "#fff",
                  border: "none",
                  borderRadius: "20px",
                  fontWeight: "700",
                  fontSize: "18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "1rem",
                  cursor: "pointer",
                }}
              >
                Verify OTP & Complete Setup
                <ArrowRight size={20} color="white" />
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
              <button type="button" onClick={handleResendOtp} style={{ background: 'none', border: 'none', color: '#F27C08', fontWeight: '700', cursor: 'pointer' }}>
                Resend OTP
              </button>
              <button type="button" onClick={() => setStep('register')} style={{ background: 'none', border: 'none', color: '#6B7280', fontWeight: '600', cursor: 'pointer' }}>
                Back to Registration
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>





{/* Role selecter */}

<div
  style={{
    display: "flex",
    border: "2.5px solid #F27C08",
    borderRadius: "18px",
    padding: "4px",
    background: "#fff",
  }}
>
  {roles.map((r, index) => {
    const active = formData.role === r;

    return (
      <div
        key={r}
        onClick={() => setFormData({ ...formData, role: r })}
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",

          height: "48px",
          

          background: active ? "#1B8A43" : "#fff",
          color: active ? "#fff" : "#4B5563",

          borderRadius: active ? "12px" : "0",

          fontWeight: 700,
          fontSize: "16px",
          cursor: "pointer",

          transition: "all .2s ease",

          borderRight:"none",
        }}
      >
        {r}
      </div>
    );
  })}
</div>








          {/* Personal Details Section */}
          <div>
            <div style={sectionHeaderStyle(false)}>
              <User size={18} strokeWidth={3} /> Personal Details
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }}>
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
                <div style={iconWrapperStyle}><MapPin size={18} /></div>
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
                  <div style={iconWrapperStyle}><Star size={20} fill="#125f2eff" /></div>
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

<div
  style={{
    marginTop: "1rem",
    padding: "2px",
    borderRadius: "22px",
    background:
      "linear-gradient(135deg, #F27C08 0%, #F2A700 30%, #38B64A 70%, #1B8A43 100%)",
  }}
>
  <button
    type="submit"
    style={{
      width: "100%",
      padding: "1.25rem",

      background: "#8A8A8A",
      color: "#fff",

      border: "4px",
      borderRadius: "20px",

      fontWeight: "700",
      fontSize: "18px",

      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "1rem",

      cursor: "pointer",
      transition: "transform .1s ease",
    }}
    onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
    onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
  >
    Register as {formData.role}

    <div
      style={{
        width: "46px",
        height: "46px",
        borderRadius: "50%",
        background: "#3E3E3E",

        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        flexShrink: 0,
      }}
    >
      <ArrowRight size={20} color="white" />
    </div>
  </button>
</div>
        </form>
        )}

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
           max-width: 300px;
            margin-bottom: 1rem;
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
