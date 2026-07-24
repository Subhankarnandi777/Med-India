import React, { useState, useEffect } from 'react';
import { fetchPayouts } from '../../services/api';
import { Calendar, Download, Tag, Percent, CheckCircle2, Clock, Banknote, PlusCircle } from 'lucide-react';

export default function Earnings() {
  const [payouts, setPayouts] = useState([]);

  useEffect(() => {
    fetchPayouts().then(setPayouts).catch(console.error);
  }, []);

  return (
    <div className="animate-fade-in" style={{ position: 'relative', minHeight: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: '0 0 0.25rem 0', fontSize: '24px', fontWeight: '800' }}>Earnings</h1>
          <p style={{ margin: '0', color: '#6B7280', fontSize: '14px' }}>Performance reports</p>
        </div>
        <button style={{ 
          display: 'flex', alignItems: 'center', gap: '0.5rem', 
          padding: '0.5rem 1rem', borderRadius: '8px', 
          border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB',
          fontSize: '13px', fontWeight: '600'
        }}>
          <Calendar size={16} color="#F27C08" /> Last 7 Days <span style={{ fontSize: '10px' }}>▼</span>
        </button>
      </div>

      {/* Main Revenue Card */}
      <div className="card" style={{ padding: '1.5rem', border: '1px solid #E5E7EB', boxShadow: 'none', borderRadius: '16px', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#6B7280', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Weekly Revenue</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
              <span style={{ fontSize: '32px', fontWeight: '800' }}>₹24,850</span>
              <span style={{ color: '#16A34A', fontSize: '14px', fontWeight: '700' }}>↗18.7%</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '4px' }}>
             <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#F27C08' }}></div>
             <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#E5E7EB' }}></div>
          </div>
        </div>

        {/* Mock Chart Area */}
        <div style={{ height: '120px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 1rem', borderBottom: '1px solid #E5E7EB', marginBottom: '1rem', paddingBottom: '1rem' }}>
          {/* Mock bars */}
          {['M','T','W','T','F','S','S'].map((day, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ display: 'flex', gap: '2px', alignItems: 'flex-end', height: '80px' }}>
                <div style={{ width: '8px', backgroundColor: '#E5E7EB', borderRadius: '4px', height: `${20 + Math.random() * 40}px` }}></div>
                <div style={{ width: '8px', backgroundColor: i === 3 ? '#F27C08' : '#FDBA74', borderRadius: '4px', height: `${40 + Math.random() * 40}px` }}></div>
              </div>
              <span style={{ fontSize: '12px', fontWeight: '600', color: i === 3 ? '#F27C08' : '#9CA3AF' }}>{day}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button style={{ background: 'none', border: 'none', color: '#F27C08', fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: 0 }}>
            <Download size={16} /> Export PDF
          </button>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '12px', fontWeight: '600', color: '#9CA3AF' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#F27C08' }}></div> Rev</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#E5E7EB' }}></div> Prev</div>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {/* Total Sales */}
        <div className="card" style={{ padding: '1.25rem', border: '1px solid #E5E7EB', boxShadow: 'none', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', backgroundColor: '#EF4444' }}></div>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <Tag size={16} color="#EF4444" />
          </div>
          <div style={{ fontSize: '13px', fontWeight: '600', color: '#111827', marginBottom: '0.25rem' }}>Total Sales</div>
          <div style={{ fontSize: '20px', fontWeight: '800', marginBottom: '0.25rem' }}>₹32,450</div>
          <div style={{ fontSize: '11px', color: '#6B7280', fontStyle: 'italic' }}>Gross order value</div>
        </div>

        {/* Commission */}
        <div className="card" style={{ padding: '1.25rem', border: '1px solid #E5E7EB', boxShadow: 'none', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', backgroundColor: '#8B5CF6' }}></div>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <Percent size={16} color="#8B5CF6" />
          </div>
          <div style={{ fontSize: '13px', fontWeight: '600', color: '#111827', marginBottom: '0.25rem' }}>Commission</div>
          <div style={{ fontSize: '20px', fontWeight: '800', marginBottom: '0.25rem' }}>₹4,860</div>
          <div style={{ fontSize: '11px', color: '#6B7280', fontStyle: 'italic' }}>Platform fees (15%)</div>
        </div>

        {/* Settled */}
        <div className="card" style={{ padding: '1.25rem', border: '1px solid #E5E7EB', boxShadow: 'none', position: 'relative', overflow: 'hidden', backgroundColor: '#F0FDF4' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', backgroundColor: '#10B981' }}></div>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <CheckCircle2 size={16} color="#10B981" />
          </div>
          <div style={{ fontSize: '13px', fontWeight: '600', color: '#111827', marginBottom: '0.25rem' }}>Settled</div>
          <div style={{ fontSize: '20px', fontWeight: '800', color: '#065F46', marginBottom: '0.25rem' }}>₹21,240</div>
          <div style={{ fontSize: '11px', color: '#6B7280', fontStyle: 'italic' }}>Bank a/c ..4521</div>
        </div>

        {/* Pending */}
        <div className="card" style={{ padding: '1.25rem', border: '1px solid #E5E7EB', boxShadow: 'none', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', backgroundColor: '#F27C08' }}></div>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <Clock size={16} color="#F27C08" />
          </div>
          <div style={{ fontSize: '13px', fontWeight: '600', color: '#111827', marginBottom: '0.25rem' }}>Pending</div>
          <div style={{ fontSize: '20px', fontWeight: '800', color: '#F27C08', marginBottom: '0.25rem' }}>₹6,350</div>
          <div style={{ fontSize: '11px', color: '#F27C08', fontStyle: 'italic' }}>For Wed</div>
        </div>
      </div>

      {/* Recent Settlements */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>Recent Settlements</h2>
        <a href="#" style={{ color: '#F27C08', fontSize: '13px', fontWeight: '700' }}>View All</a>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
        <div className="card" style={{ padding: '1.25rem', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
             <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <Banknote size={20} color="#10B981" />
             </div>
             <div>
               <div style={{ fontWeight: '700', fontSize: '15px' }}>Payment Settled</div>
               <div style={{ color: '#6B7280', fontSize: '12px', marginTop: '2px' }}>20 May • Ref: #TXN0984</div>
             </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: '800', color: '#10B981', fontSize: '16px' }}>+₹8,420</div>
            <div style={{ backgroundColor: '#D1FAE5', color: '#065F46', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: '700', display: 'inline-block', marginTop: '4px' }}>COMPLETED</div>
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
             <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <Clock size={20} color="#F27C08" />
             </div>
             <div>
               <div style={{ fontWeight: '700', fontSize: '15px' }}>Upcoming Payout</div>
               <div style={{ color: '#6B7280', fontSize: '12px', marginTop: '2px' }}>Expected 24 May</div>
             </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: '800', color: '#F27C08', fontSize: '16px' }}>₹6,350</div>
            <div style={{ backgroundColor: '#FFEDD5', color: '#9A3412', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: '700', display: 'inline-block', marginTop: '4px' }}>PROCESSING</div>
          </div>
        </div>
      </div>

      {/* Boost Banner */}
      <div style={{ 
        background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
        borderRadius: '16px',
        padding: '1.5rem',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background graphic */}
        <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.2 }}>
           <svg width="150" height="150" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
        </div>

        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '18px', fontWeight: '800' }}>Boost Your Sales!</h3>
        <p style={{ margin: '0 0 1.25rem 0', fontSize: '14px', opacity: 0.9, maxWidth: '70%' }}>
          Unlock special discounts for your repeat customers.
        </p>
        <button style={{ 
          backgroundColor: 'white', 
          color: '#EA580C', 
          border: 'none', 
          padding: '0.6rem 1.25rem', 
          borderRadius: '8px',
          fontWeight: '700',
          fontSize: '14px',
          cursor: 'pointer'
        }}>
          Setup Offers
        </button>
      </div>

    </div>
  );
}
