import React, { useState, useEffect } from 'react';
import { db } from './firebase'; // Memanggil koneksi yang baru Anda simpan
import { ref, onValue } from "firebase/database";

function App() {
  const [pakan, setPakan] = useState({});
  const [logAir, setLogAir] = useState({});

  useEffect(() => {
    // 1. Ambil data pakan_pintar secara real-time
    const pakanRef = ref(db, 'pakan_pintar');
    onValue(pakanRef, (snapshot) => {
      if (snapshot.exists()) {
        setPakan(snapshot.val());
      }
    });

    // 2. Ambil data log_udara (kuras air) secara real-time
    const airRef = ref(db, 'log_udara');
    onValue(airRef, (snapshot) => {
      if (snapshot.exists()) {
        setLogAir(snapshot.val());
      }
    });
  }, []);

  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f4f8', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', color: '#1e293b' }}>Dasbor Pintar</h1>
      
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '30px' }}>
        {/* Kartu Jadwal Pakan */}
        <div style={cardStyle}>
          <h3 style={{ color: '#38bdf8' }}>🍲 Jadwal Pakan</h3>
          <hr />
          <p>Pagi: <strong>{pakan['jam pagi']}:{pakan['menit pagi']}</strong></p>
          <p>Sore: <strong>{pakan['jam sore']}:{pakan['menit sore']}</strong></p>
          <p>Durasi Mesin: <strong>{pakan['durasi detik']} detik</strong></p>
        </div>

        {/* Kartu Status Kolam */}
        <div style={cardStyle}>
          <h3 style={{ color: '#38bdf8' }}>💧 Status Kolam</h3>
          <hr />
          <p>Terakhir Kuras:</p>
          <p><strong>{logAir['tanggal kuras']}</strong></p>
          <p>Kondisi: <strong>{logAir['kondisi udara'] || 'Normal'}</strong></p>
        </div>
      </div>

      {/* Bagian Saran AI - Sesuai rencana Anda untuk alat pintar */}
      <div style={{ maxWidth: '620px', margin: '30px auto', backgroundColor: '#fff', padding: '20px', borderRadius: '15px', borderLeft: '5px solid #38bdf8' }}>
        <h4>💡 Analisis Asisten Pintar:</h4>
        <p>
          Berdasarkan data terakhir, pakan akan keluar selama <strong>{pakan['durasi detik']} detik</strong>. 
          Karena Anda terakhir menguras kolam pada <strong>{logAir['tanggal kuras']}</strong>, 
          pastikan untuk memantau kejernihan air agar pertumbuhan ikan tetap optimal!
        </p>
      </div>
    </div>
  );
}

const cardStyle = {
  backgroundColor: '#1e293b',
  color: 'white',
  padding: '20px',
  borderRadius: '20px',
  width: '280px',
  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
};

export default App;
