import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { login } from '../services/api';
import { Mail, Lock, Info, ArrowRight, Apple, CheckSquare, Square } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Patient');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const { login: authenticate } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await login(email, password);
      authenticate(data.user, data.token);
      navigate('/');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  const roles = ['Patient', 'Seller', 'Doctor'];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      fontFamily: "'Inter', sans-serif",
      backgroundImage: "url('/bg-login.jpeg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem'
    }}>
      {/* Logo outside the card at the top */}
      <div style={{ marginBottom: '1.5rem', marginTop: '-2rem' }}>
        <img src="/logo.jpeg" alt="Med India Logo" style={{ width: '180px', mixBlendMode: 'multiply' }} />
      </div>

      {/* Glassmorphism Card */}
      <div style={{
        width: '100%',
        maxWidth: '450px',
        background: 'rgba(240, 248, 255, 0.75)', // Light blue glass tint
        backdropFilter: 'blur(16px)',
        borderRadius: '24px',
        border: '1.5px solid rgba(27, 138, 67, 0.4)',
        padding: '2rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)'
      }}>
        {error && <div style={{ background: '#FEE2E2', color: '#B91C1C', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Segmented Role Selector */}
          <div style={{ display: 'flex', border: '1.5px solid #F27C08', borderRadius: '12px', overflow: 'hidden', background: '#fff', padding: '4px' }}>
            {roles.map((r) => (
              <div 
                key={r}
                onClick={() => setRole(r)}
                style={{
                  flex: 1,
                  textAlign: 'center',
                  padding: '0.75rem 0',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontSize: '14px',
                  borderRadius: '8px',
                  background: role === r ? '#1B8A43' : 'transparent',
                  color: role === r ? 'white' : '#4b5563',
                  transition: 'all 0.2s ease'
                }}
              >
                {r}
              </div>
            ))}
          </div>

          {/* Email Address */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1B8A43', fontWeight: '700', fontSize: '14px', marginBottom: '0.5rem' }}>
              <Mail size={16} strokeWidth={2.5} /> Email address
            </div>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '1rem', color: '#9CA3AF' }}><Mail size={18} /></div>
              <input type="email" placeholder="you@medindia.in" style={inputStyle} value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
          </div>

          {/* Password */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1B8A43', fontWeight: '700', fontSize: '14px', marginBottom: '0.5rem' }}>
              <Lock size={16} strokeWidth={2.5} /> Password
            </div>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '1rem', color: '#9CA3AF' }}><Lock size={18} /></div>
              <input type="password" placeholder="Enter your password" style={inputStyle} value={password} onChange={e => setPassword(e.target.value)} required />
              <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', right: '1rem', color: '#9CA3AF' }}><Info size={18} /></div>
            </div>
          </div>

          {/* Remember me & Forgot password */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', fontWeight: '600' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1B8A43', cursor: 'pointer' }} onClick={() => setRememberMe(!rememberMe)}>
              {rememberMe ? <CheckSquare size={18} fill="#1B8A43" color="white" /> : <Square size={18} />}
              Remember me
            </div>
            <div style={{ color: '#F27C08', cursor: 'pointer' }}>
              Forgot password?
            </div>
          </div>

          {/* Sign In Button */}
          <button 
            type="submit" 
            style={{ 
              width: '100%',
              padding: '1rem',
              background: '#111827',
              color: 'white',
              border: 'none',
              borderRadius: '16px',
              fontWeight: '700',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              cursor: 'pointer',
              boxShadow: '0 0 0 2px #F27C08',
              marginTop: '0.5rem'
            }}
          >
            Sign In
            <div style={{ background: '#374151', borderRadius: '50%', padding: '4px', display: 'flex' }}>
              <ArrowRight size={16} color="white" />
            </div>
          </button>
        </form>
        
        {/* Or continue with */}
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ color: '#1B8A43', fontSize: '13px', fontWeight: '600', marginBottom: '1rem' }}>or continue with</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button style={socialBtnStyle}>
              {/* Google SVG */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            </button>
            <button style={{...socialBtnStyle, background: 'black', border: 'none'}}>
              <Apple size={24} color="white" fill="white" />
            </button>
          </div>
        </div>
      </div>

      {/* New to Med India? */}
      <p style={{ marginTop: '2rem', fontSize: '15px', color: '#4B5563', textAlign: 'center' }}>
        New to Med India? <Link to="/register" style={{ color: '#1B8A43', fontWeight: '800', textDecoration: 'none' }}>Create an account</Link>
      </p>

      <style>{`
        input:focus { border-color: #1B8A43 !important; outline: none !important; box-shadow: 0 0 0 3px rgba(27, 138, 67, 0.1) !important; }
        input::placeholder { color: #9CA3AF; }
      `}</style>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '1rem 1rem 1rem 2.75rem',
  border: '1.5px solid #1B8A43',
  borderRadius: '12px',
  fontSize: '15px',
  color: '#111827',
  background: '#ffffff',
  boxSizing: 'border-box',
  transition: 'all 0.2s ease',
};

const socialBtnStyle = {
  width: '56px',
  height: '56px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'white',
  border: '1.5px solid #F27C08',
  cursor: 'pointer',
  transition: 'transform 0.1s'
};
