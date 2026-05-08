import React, { useState, useEffect } from 'react';
import { db } from './firebase'; 
import { ref, onValue } from "firebase/database";

function Aplikasi() {
  const [pakan, setPakan] = useState({});
  const [logAir, setLogAir] = useState({});

  useEffect(() => {
    const pakanRef = ref(db, 'pakan_pintar');
    onValue(pakanRef, (snapshot) => {
      if (snapshot.exists()) {
        setPakan(snapshot.val());
      }
    });

    const airRef = ref(db, 'log_udara');
    onValue(airRef, (snapshot) => {
      if (snapshot.exists()) {
        setLogAir(snapshot.val());
      }
    });
  }, []);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Beranda Pakan Ikan</h1>
      <div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '10px' }}>
        <h3>Jadwal Pakan Sore: {pakan['jam sore']}:{pakan['menit sore']}</h3>
        <h3>Terakhir Kuras: {logAir['tanggal kuras']}</h3>
      </div>
    </div>
  );
}

export default Aplikasi;
