import React, { useState, useEffect } from 'react';
import { db } from './firebase'; 
import { ref, onValue } from "firebase/database";

function App() {
  const [pakan, setPakan] = useState({});
  const [logAir, setLogAir] = useState({});

  useEffect(() => {
    const pakanRef = ref(db, 'pakan_pintar');
    onValue(pakanRef, (snapshot) => {
      if (snapshot.exists()) setPakan(snapshot.val());
    });

    const airRef = ref(db, 'log_udara');
    onValue(airRef, (snapshot) => {
      if (snapshot.exists()) setLogAir(snapshot.val());
    });
  }, []);

  return (
    <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#000', color: '#00ff00', minHeight: '100vh', fontFamily: 'monospace' }}>
      <h1>=== VERSI TERBARU ===</h1>
      <div style={{ border: '2px solid #00ff00', padding: '20px', borderRadius: '10px', display: 'inline-block' }}>
        <h2>Monitoring Pakan Ikan</h2>
        <p>Jadwal Sore: {pakan['jam sore'] || '0'}:{pakan['menit sore'] || '0'}</p>
        <p>Durasi: {pakan['durasi detik'] || '0'} Detik</p>
        <hr style={{ borderColor: '#00ff00' }} />
        <p>Status Air: {logAir['tanggal kuras'] || 'Memuat data...'}</p>
      </div>
    </div>
  );
}

export default App;
