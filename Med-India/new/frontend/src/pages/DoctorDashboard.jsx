import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchPrescriptions, createPrescription } from '../services/api';
import { LogOut, Stethoscope, FileText, ClipboardList } from 'lucide-react';

export default function DoctorDashboard() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState('consultations');
  const [prescriptions, setPrescriptions] = useState([]);
  
  // New Prescription Form State
  const [patientName, setPatientName] = useState('');
  const [instructions, setInstructions] = useState('');
  const [medName, setMedName] = useState('');
  const [medList, setMedList] = useState([]);

  useEffect(() => {
    fetchPrescriptions().then(setPrescriptions).catch(console.error);
  }, [tab]);

  const addMed = () => {
    if(medName.trim()) {
      setMedList([...medList, { name: medName, quantity: 1, price: 0 }]);
      setMedName('');
    }
  };

  const issuePrescription = async (e) => {
    e.preventDefault();
    try {
      await createPrescription({
        patientName,
        doctorName: user.name,
        medicines: medList,
        instructions
      });
      alert('Prescription Issued successfully');
      setPatientName('');
      setInstructions('');
      setMedList([]);
      setTab('history');
    } catch (e) {
      alert('Failed to issue prescription');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <header className="doctor-header" style={{ background: '#0284C7', color: 'white', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '20px' }}>
          <Stethoscope /> Doctor Clinical Portal
        </h2>
        <div className="doctor-nav-tabs" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: tab==='consultations'?'bold':'normal' }} onClick={() => setTab('consultations')}>
            <ClipboardList size={18}/> Consultations
          </div>
          <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: tab==='issue'?'bold':'normal' }} onClick={() => setTab('issue')}>
            <FileText size={18}/> Issue Prescription
          </div>
          <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: tab==='history'?'bold':'normal' }} onClick={() => setTab('history')}>
            <ClipboardList size={18}/> History
          </div>
          <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#FCA5A5' }} onClick={logout}>
            <LogOut size={18}/> Logout
          </div>
        </div>
      </header>

      <main className="container" style={{ padding: '1.5rem 1rem', flex: 1 }}>
        <h1 style={{ fontSize: '24px', margin: '0 0 1rem 0' }}>Welcome, Dr. {user.name}</h1>
        
        {tab === 'consultations' && (
          <div className="card animate-fade-in" style={{ marginTop: '1rem' }}>
            <h3>Upcoming Consultations</h3>
            <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#6B7280' }}>
              No consultations scheduled for today.
            </div>
          </div>
        )}

        {tab === 'issue' && (
          <div className="card animate-fade-in" style={{ marginTop: '1rem', maxWidth: '600px', width: '100%' }}>
            <h3>Create New Prescription</h3>
            <form onSubmit={issuePrescription} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '14px', fontWeight: '500' }}>Patient Name</label>
                <input type="text" className="input-field" value={patientName} onChange={e=>setPatientName(e.target.value)} required style={{ width: '100%', padding: '0.65rem 0.875rem', borderRadius: '8px', border: '1px solid #D1D5DB', marginTop: '0.25rem', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '14px', fontWeight: '500' }}>Instructions / Notes</label>
                <textarea className="input-field" rows="3" value={instructions} onChange={e=>setInstructions(e.target.value)} required style={{ width: '100%', padding: '0.65rem 0.875rem', borderRadius: '8px', border: '1px solid #D1D5DB', marginTop: '0.25rem', boxSizing: 'border-box' }} />
              </div>
              
              <div style={{ padding: '1rem', border: '1px solid #E5E7EB', borderRadius: '8px' }}>
                <h4 style={{ margin: '0 0 1rem 0' }}>Medicines</h4>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                  <input type="text" className="input-field" style={{ flex: 1, minWidth: '180px', padding: '0.65rem 0.875rem', borderRadius: '8px', border: '1px solid #D1D5DB', boxSizing: 'border-box' }} placeholder="Medicine name" value={medName} onChange={e=>setMedName(e.target.value)} />
                  <button type="button" className="btn btn-secondary" onClick={addMed}>Add</button>
                </div>
                <ul style={{ paddingLeft: '1.5rem', margin: 0 }}>
                  {medList.map((m, i) => <li key={i}>{m.name}</li>)}
                </ul>
              </div>

              <button type="submit" className="btn btn-primary">Issue Prescription</button>
            </form>
          </div>
        )}

        {tab === 'history' && (
          <div className="card animate-fade-in" style={{ marginTop: '1rem' }}>
            <h3>Prescription History</h3>
            {prescriptions.length === 0 ? <p>No prescriptions issued yet.</p> : (
              prescriptions.map(rx => (
                <div key={rx.id} style={{ padding: '1rem', border: '1px solid #E5E7EB', borderRadius: '8px', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <strong>{rx.id}</strong>
                    <span style={{ fontSize: '12px', color: '#6B7280' }}>{new Date(rx.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div>Patient: {rx.patientName}</div>
                  <div style={{ color: '#4B5563', fontSize: '14px', marginTop: '0.5rem' }}>Notes: {rx.instructions}</div>
                  <div style={{ marginTop: '0.5rem', fontWeight: 'bold', fontSize: '14px' }}>Prescribed:</div>
                  <ul style={{ margin: '0', paddingLeft: '1.5rem', fontSize: '14px' }}>
                    {rx.medicines.map((m,i)=><li key={i}>{m.name}</li>)}
                  </ul>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      <style>{`
        @media (max-width: 768px) {
          .doctor-header {
            padding: 0.875rem 1rem !important;
          }
          .doctor-nav-tabs {
            gap: 1rem !important;
            font-size: 13px !important;
          }
        }
      `}</style>
    </div>
  );
}
