import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Store, Wallet, Bell, HelpCircle, LogOut, ChevronRight, CheckCircle2, Edit2, X } from 'lucide-react';
import { fetchBackendProfile, updateBackendProfile } from '../../services/api';

export default function Settings() {
  const { user, login, logout, token } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: user?.full_name || user?.name || '',
    mobile: user?.mobile || '',
    shop_name: user?.extra_details?.shop_name || '',
    address: user?.extra_details?.address || '',
    license_number: user?.extra_details?.license_number || ''
  });

  useEffect(() => {
    if (user?.id) {
      fetchBackendProfile(user.id, user.email).then(data => {
        if (data) {
          setFormData({
            full_name: data.full_name || '',
            mobile: data.mobile || '',
            shop_name: data.extra_details?.shop_name || '',
            address: data.extra_details?.address || '',
            license_number: data.extra_details?.license_number || ''
          });
        }
      }).catch(console.error);
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updatedProfile = {
        id: user.id,
        email: user.email,
        full_name: formData.full_name,
        role: user.role,
        mobile: formData.mobile,
        extra_details: {
          ...user.extra_details,
          shop_name: formData.shop_name,
          address: formData.address,
          license_number: formData.license_number
        }
      };
      const savedUser = await updateBackendProfile(updatedProfile);
      
      // Update local auth context
      login({ ...user, ...savedUser }, token);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert('Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  const settingsOptions = [
    {
      title: 'Store Information',
      subtitle: 'Shop name and locations',
      icon: <Store size={22} color="#F27C08" />,
      bg: '#FFF7ED',
    },
    {
      title: 'Bank Details',
      subtitle: 'Payouts and settlements',
      icon: <Wallet size={22} color="#1B8A43" />,
      bg: '#F0FDF4',
    },
    {
      title: 'Notification Settings',
      subtitle: 'Alerts and order updates',
      icon: <Bell size={22} color="#2563EB" />,
      bg: '#EFF6FF',
    },
    {
      title: 'Support',
      subtitle: 'Help center and assistance',
      icon: <HelpCircle size={22} color="#4B5563" />,
      bg: '#F3F4F6',
    }
  ];

  return (
    <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto', position: 'relative' }}>
      
      {/* Profile Card */}
      <div className="card" style={{ 
        textAlign: 'center', 
        padding: '2rem 1.5rem',
        border: '1px solid #E5E7EB',
        boxShadow: 'none',
        borderRadius: '16px',
        marginBottom: '2rem'
      }}>
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1rem' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: '#F3F4F6',
            border: '3px solid #FFF7ED',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#F27C08',
            margin: '0 auto'
          }}>
            {(user?.full_name || user?.name || 'S').charAt(0).toUpperCase()}
          </div>
          <div style={{
            position: 'absolute',
            bottom: '0',
            right: '0',
            backgroundColor: '#1B8A43',
            borderRadius: '50%',
            padding: '2px',
            display: 'flex',
            border: '2px solid white'
          }}>
            <CheckCircle2 size={16} color="white" />
          </div>
        </div>
        
        <h2 style={{ margin: '0 0 0.25rem 0', fontSize: '20px', fontWeight: '700' }}>
          {user?.full_name || user?.name || 'Seller Partner'}
        </h2>
        <p style={{ margin: '0 0 1rem 0', color: '#6B7280', fontSize: '14px' }}>
          Partner ID: <span style={{ color: '#F27C08', fontWeight: '600' }}>MED{user?.id?.substring(0,5).toUpperCase() || '12345'}</span>
        </p>

        <button 
        onClick={() => setIsEditing(true)}
        style={{
          backgroundColor: '#FFF7ED',
          color: '#F27C08',
          border: '1px solid #FDBA74',
          borderRadius: '20px',
          padding: '0.4rem 1.25rem',
          fontSize: '13px',
          fontWeight: '700',
          marginBottom: '1.5rem',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          transition: 'all 0.2s'
        }}
        onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#F27C08'; e.currentTarget.style.color = 'white'; }}
        onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#FFF7ED'; e.currentTarget.style.color = '#F27C08'; }}
        >
          <Edit2 size={14} /> Edit Profile
        </button>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <div style={{
            flex: 1,
            backgroundColor: '#F9FAFB',
            padding: '1rem',
            borderRadius: '12px',
            borderLeft: '4px solid #F27C08'
          }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#6B7280', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>
              SELLER RATING
            </div>
            <div style={{ fontSize: '20px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
              4.8 <span style={{ color: '#F27C08', fontSize: '16px' }}>★</span>
            </div>
          </div>
          <div style={{
            flex: 1,
            backgroundColor: '#F9FAFB',
            padding: '1rem',
            borderRadius: '12px',
            borderLeft: '4px solid #1B8A43'
          }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#6B7280', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>
              MEMBER SINCE
            </div>
            <div style={{ fontSize: '20px', fontWeight: '800' }}>
              Aug '23
            </div>
          </div>
        </div>
      </div>

      {/* Account & Settings List */}
      <h3 style={{ fontSize: '13px', fontWeight: '700', color: '#4B5563', letterSpacing: '1px', marginBottom: '1rem', textTransform: 'uppercase' }}>
        Account & Settings
      </h3>
      
      <div className="card" style={{ padding: '0', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: 'none', overflow: 'hidden' }}>
        {settingsOptions.map((option, index) => (
          <div key={option.title} style={{
            display: 'flex',
            alignItems: 'center',
            padding: '1.25rem 1.5rem',
            borderBottom: index < settingsOptions.length - 1 ? '1px solid #F3F4F6' : 'none',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <div style={{
              width: '40px', height: '40px', borderRadius: '10px', backgroundColor: option.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '1rem'
            }}>
              {option.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '600', fontSize: '15px', color: '#111827', marginBottom: '0.15rem' }}>{option.title}</div>
              <div style={{ fontSize: '13px', color: '#6B7280' }}>{option.subtitle}</div>
            </div>
            <ChevronRight size={20} color="#9CA3AF" />
          </div>
        ))}
        
        {/* Logout Button */}
        <div 
          onClick={logout}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '1.25rem 1.5rem',
            borderTop: '1px solid #F3F4F6',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#FFF1F2'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <div style={{
            width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#FFF7ED',
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '1rem'
          }}>
            <LogOut size={22} color="#F27C08" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: '700', fontSize: '15px', color: '#F27C08', marginBottom: '0.15rem' }}>Logout</div>
            <div style={{ fontSize: '13px', color: '#FDBA74' }}>Sign out of your session</div>
          </div>
          <ChevronRight size={20} color="#FDBA74" />
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '2rem', color: '#9CA3AF', fontSize: '12px' }}>
        <br/>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflowY: 'auto',
            position: 'relative'
          }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 2, borderRadius: '16px 16px 0 0' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>Edit Profile</h2>
              <button onClick={() => setIsEditing(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                <X size={20} color="#6B7280" />
              </button>
            </div>
            
            <form onSubmit={handleSave} style={{ padding: '1.5rem' }}>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#4B5563', marginBottom: '0.5rem' }}>Partner ID</label>
                <input 
                  type="text" 
                  value={user?.id ? `MED${user.id.substring(0,5).toUpperCase()}` : ''} 
                  disabled 
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E5E7EB', backgroundColor: '#F3F4F6', color: '#9CA3AF', outline: 'none' }} 
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#4B5563', marginBottom: '0.5rem' }}>Email Address</label>
                <input 
                  type="email" 
                  value={user?.email || ''} 
                  disabled 
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E5E7EB', backgroundColor: '#F3F4F6', color: '#9CA3AF', outline: 'none' }} 
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>Full Name</label>
                <input 
                  type="text" 
                  value={formData.full_name} 
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  required
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #D1D5DB', outline: 'none' }} 
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>Mobile Number</label>
                <input 
                  type="tel" 
                  value={formData.mobile} 
                  onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #D1D5DB', outline: 'none' }} 
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>Shop Name</label>
                <input 
                  type="text" 
                  value={formData.shop_name} 
                  onChange={(e) => setFormData({...formData, shop_name: e.target.value})}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #D1D5DB', outline: 'none' }} 
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>License Number</label>
                <input 
                  type="text" 
                  value={formData.license_number} 
                  onChange={(e) => setFormData({...formData, license_number: e.target.value})}
                  disabled
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E5E7EB', backgroundColor: '#F3F4F6', color: '#9CA3AF', outline: 'none' }} 
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>Address</label>
                <textarea 
                  rows="3"
                  value={formData.address} 
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #D1D5DB', outline: 'none', resize: 'vertical' }} 
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid #E5E7EB' }}>
                <button type="button" onClick={() => setIsEditing(false)} style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid #D1D5DB', backgroundColor: 'white', fontWeight: '600', cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" disabled={isSaving} style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: 'none', backgroundColor: '#F27C08', color: 'white', fontWeight: '600', cursor: isSaving ? 'not-allowed' : 'pointer', opacity: isSaving ? 0.7 : 1 }}>
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
