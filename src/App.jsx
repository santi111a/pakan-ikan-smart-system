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
    <div style={{ backgroundColor: '#121212', color: 'white', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif' }}>
      <div style={{ padding: '30px', border: '2px solid #00d4ff', borderRadius: '20px', textAlign: 'center' }}>
        <h1 style={{ color: '#00d4ff' }}>Santi Smart System v3.0</h1>
        <hr />
        <h3>Jadwal Pakan Sore</h3>
        <p style={{ fontSize: '24px' }}>{pakan['jam sore'] || '0'} : {pakan['menit sore'] || '0'}</p>
        <h3>Durasi Pakan</h3>
        <p style={{ fontSize: '24px' }}>{pakan['durasi detik'] || '0'} Detik</p>
      </div>
    </div>
  );
}

export default App;
