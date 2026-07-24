import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { BarChart2, Box, ClipboardList, Wallet, LayoutGrid, Bell, Menu } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function SellerLayout() {
  const { user } = useAuth();

  const navItems = [
    { name: 'Overview', path: '/seller', icon: <BarChart2 size={24} />, exact: true },
    { name: 'Inventory', path: '/seller/inventory', icon: <Box size={24} /> },
    { name: 'Orders', path: '/seller/orders', icon: <ClipboardList size={24} /> },
    { name: 'Earnings', path: '/seller/earnings', icon: <Wallet size={24} /> },
    { name: 'More', path: '/seller/settings', icon: <LayoutGrid size={24} /> },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#FAFAFA' }}>
      
      {/* Desktop Sidebar (hidden on mobile) */}
      <aside className="seller-sidebar hide-on-mobile" style={{
        width: '240px',
        backgroundColor: '#FFFFFF',
        borderRight: '1px solid #E5E7EB',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        zIndex: 10
      }}>
        <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
           <img src="/logoo.png" alt="Med India" style={{ width: '120px', mixBlendMode: 'multiply' }} />
        </div>
        <div style={{ padding: '0 1.5rem', fontSize: '11px', fontWeight: 'bold', color: '#6B7280', letterSpacing: '1px', marginBottom: '1rem' }}>
          SELLER PARTNER PORTAL
        </div>

        <nav style={{ flex: 1, padding: '0 1rem' }}>
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.exact}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.875rem 1rem',
                borderRadius: '8px',
                marginBottom: '0.5rem',
                color: isActive ? '#F27C08' : '#6B7280',
                backgroundColor: isActive ? '#FFF7ED' : 'transparent',
                fontWeight: isActive ? '700' : '600',
                transition: 'all 0.2s',
                textDecoration: 'none'
              })}
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="seller-main-content" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Top Header */}
        <header style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E5E7EB',
          padding: '1rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 5
        }}>
          {/* Mobile logo/menu area */}
          <div className="hide-on-desktop" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Menu size={24} color="#111827" />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ color: '#F27C08', fontWeight: '800', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                 Med India
              </div>
              <div style={{ fontSize: '10px', fontWeight: '700', color: '#6B7280', letterSpacing: '0.5px' }}>
                SELLER PARTNER PORTAL
              </div>
            </div>
          </div>
          <div className="hide-on-mobile"></div> {/* Spacer for desktop */}

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ position: 'relative', cursor: 'pointer' }}>
              <Bell size={24} color="#111827" />
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                backgroundColor: '#F27C08',
                color: 'white',
                fontSize: '10px',
                fontWeight: 'bold',
                borderRadius: '50%',
                width: '16px',
                height: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid white'
              }}>3</span>
            </div>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#E5E7EB',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #F27C08'
            }}>
              <span style={{ fontWeight: 'bold', color: '#6B7280', fontSize: '14px' }}>
                {user?.name?.charAt(0) || 'S'}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, padding: '1.5rem', paddingBottom: '80px', overflowX: 'hidden' }}>
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation (hidden on desktop) */}
      <nav className="seller-bottom-nav hide-on-desktop" style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid #E5E7EB',
        display: 'flex',
        justifyContent: 'space-around',
        padding: '0.5rem 0',
        zIndex: 10,
        paddingBottom: 'env(safe-area-inset-bottom, 0.5rem)' // For iOS home bar
      }}>
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.exact}
            style={({ isActive }) => ({
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.25rem',
              padding: '0.5rem',
              color: isActive ? '#F27C08' : '#9CA3AF',
              fontWeight: isActive ? '700' : '500',
              fontSize: '11px',
              textDecoration: 'none'
            })}
          >
            {React.cloneElement(item.icon, { size: 24, strokeWidth: 2 })}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <style>{`
        .seller-main-content {
          margin-left: 240px;
        }
        @media (max-width: 768px) {
          .seller-main-content {
            margin-left: 0;
          }
        }
      `}</style>
    </div>
  );
}
