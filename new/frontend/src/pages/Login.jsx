import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { login, verifyOtp, resendOtp } from '../services/api';
import { Mail, Lock, Info, ArrowRight, Apple, CheckSquare, Square, KeyRound } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Patient');
  const [rememberMe, setRememberMe] = useState(true);
  const [requiresOtp, setRequiresOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const { login: authenticate } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await login(email, password, role);

      if (data && (data.token || data.success)) {
        const userRole = data.user?.role;
        
        // Strict Role Match Check: Reject login if user role does not match selected tab
        if (userRole && userRole !== role) {
          setError(`Access Denied: This account is registered as a ${userRole}. Please select the '${userRole}' tab to log in.`);
          return;
        }

        authenticate(
          {
            id: data.user?.id || 'user-' + Date.now(),
            email: data.user?.email || email,
            role: userRole || role,
            name: data.user?.full_name || data.user?.name || email.split('@')[0],
          },
          data.token || ''
        );

        navigate("/");
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      if (err.code === 'EMAIL_NOT_VERIFIED') {
        setRequiresOtp(true);
        try {
          await resendOtp(email);
        } catch {}
        setError('Your email is not verified yet. A 6-digit OTP code has been sent to your email. Please enter it below:');
      } else {
        const msg = err.message === 'Failed to fetch' ? 'Unable to connect to authentication server. Please try again.' : (err.message || 'Invalid credentials');
        setError(msg);
      }
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const result = await verifyOtp(email, otp);
      if (result && result.success) {
        const userRole = result.user?.role;

        // Strict Role Match Check
        if (userRole && userRole !== role) {
          setError(`Access Denied: This account is registered as a ${userRole}. Please select the '${userRole}' tab to log in.`);
          return;
        }

        authenticate(
          {
            id: result.user?.id || 'user-' + Date.now(),
            email: result.user?.email || email,
            role: userRole || role,
            name: result.user?.full_name || email.split('@')[0],
          },
          result.token || ''
        );
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'OTP verification failed');
    }
  };

  const roles = ['Patient', 'Seller', 'Doctor'];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      fontFamily: "'Inter', sans-serif",
      backgroundImage: "url('/bg-login.png')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem'
    }}>
      {/* Logo outside the card at the top */}
      <div style={{ marginBottom: '-2rem', marginTop: '-3.5rem' }}>
    <img
        src="/logoo.png"
        alt="Med India Logo"
        className="login-logo"
        style={{
            width: '240px',
            mixBlendMode: 'multiply',
            display: 'block'
        }}
    />
</div>

      {/* Glassmorphism Card */}
      <div
  className="login-card"
  style={{
    width: "100%",
    maxWidth: "450px",

    border: "1.5px solid #4F5FA8",
    borderRadius: "34px",

    padding: "30px",

    background: "rgba(255,255,255,0.18)",
    backdropFilter: "blur(2px)",
    WebkitBackdropFilter: "blur(5px)",

    boxSizing: "border-box",
  }}
>
        {error && <div style={{ background: '#FEE2E2', color: '#B91C1C', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

        {requiresOtp ? (
          <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1B8A43', fontWeight: '700', fontSize: '14px', marginBottom: '0.5rem' }}>
                <KeyRound size={16} strokeWidth={2.5} /> Verification OTP
              </div>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '1rem', color: '#9CA3AF' }}><KeyRound size={18} /></div>
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  style={{ ...inputStyle, fontSize: '18px', letterSpacing: '3px', textAlign: 'center' }}
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
                  padding: "0.75rem",
                  background: "#111827",
                  color: "#fff",
                  border: "none",
                  borderRadius: "16px",
                  fontWeight: "700",
                  fontSize: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "1rem",
                  cursor: "pointer",
                }}
              >
                Verify OTP & Sign In
                <ArrowRight size={20} color="white" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setRequiresOtp(false)}
              style={{ background: 'none', border: 'none', color: '#6B7280', fontWeight: '600', cursor: 'pointer', textAlign: 'center' }}
            >
              Back to Login
            </button>
          </form>
        ) : (
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Segmented Role Selector */}
          <div style={{ display: 'flex', border: '2.5px solid #F27C08', borderRadius: '12px', overflow: 'hidden', background: '#fff', padding: '4px' }}>
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
 <div
  style={{
    marginTop: "0.5rem",
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
      padding: "0.5rem",

      background: "#111827",
      color: "#fff",

      border: "none",
      borderRadius: "16px",

      fontWeight: "700",
      fontSize: "16px",

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
    Sign In

    <div
      style={{
        width: "40px",
        height: "40px",
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
        @media (max-width: 480px) {
          .login-card {
            padding: 20px 16px !important;
            border-radius: 24px !important;
          }
          .login-logo {
            width: 180px !important;
          }
        }
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
