import React, { useState, useEffect } from 'react';
import { db } from './firebase'; 
import { ref, onValue } from "firebase/database";

function App() {
  const [pakan, setPakan] = useState({});

  useEffect(() => {
    const pakanRef = ref(db, 'pakan_pintar');
    onValue(pakanRef, (snapshot) => {
      if (snapshot.exists()) {
        setPakan(snapshot.val());
      }
    });
  }, []);

  return (
    <div style={{ backgroundColor: '#0f172a', color: '#38bdf8', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif' }}>
      <div style={{ padding: '40px', border: '2px solid #38bdf8', borderRadius: '24px', textAlign: 'center', background: '#1e293b', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
        <h1 style={{ margin: '0 0 10px 0' }}>Santi Smart System v3.0</h1>
        <p style={{ color: '#94a3b8' }}>Koneksi Vercel & Firebase Berhasil</p>
        <hr style={{ borderColor: '#334155', margin: '20px 0' }} />
        
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: '#f8fafc' }}>Jadwal Pakan Sore</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{pakan['jam sore'] || '0'} : {pakan['menit sore'] || '0'}</p>
        </div>

        <div>
          <h3 style={{ color: '#f8fafc' }}>Durasi Pakan</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{pakan['durasi detik'] || '0'} Detik</p>
        </div>
      </div>
    </div>
  );
}

export default App;
