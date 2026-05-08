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
    <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#1a1a1a', color: 'white', minHeight: '100vh' }}>
      <h1>Dashboard Pakan Ikan Pintar</h1>
      <div style={{ border: '1px solid #444', padding: '20px', borderRadius: '15px', display: 'inline-block' }}>
        <p>Jadwal Sore: {pakan['jam sore'] || '0'}:{pakan['menit sore'] || '0'}</p>
        <p>Durasi Pakan: {pakan['durasi detik'] || '0'} Detik</p>
        <hr />
        <p>Terakhir Kuras: {logAir['tanggal kuras'] || '-'}</p>
      </div>
    </div>
  );
}

export default App;
