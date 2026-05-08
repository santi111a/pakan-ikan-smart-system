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
    <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#121212', color: '#00d4ff', minHeight: '100vh', fontFamily: 'Arial' }}>
      <h1>=== KONEKSI BERHASIL ===</h1>
      <div style={{ border: '2px solid #00d4ff', padding: '20px', borderRadius: '20px', display: 'inline-block', marginTop: '20px' }}>
        <h2>Status Pakan Ikan</h2>
        <p>Jadwal Sore: {pakan['jam sore'] || '0'}:{pakan['menit sore'] || '0'}</p>
        <p>Durasi: {pakan['durasi detik'] || '0'} Detik</p>
        <hr style={{ borderColor: '#333' }} />
        <p>Log Terakhir: {logAir['tanggal kuras'] || 'Menunggu data...'}</p>
      </div>
    </div>
  );
}

export default App;
