import React, { useState, useEffect } from 'react';
import { db } from './firebase'; // Mengambil koneksi dari firebase.js yang baru Anda simpan
import { ref, onValue } from "firebase/database";

function Aplikasi() {
  const [pakan, setPakan] = useState({});
  const [logAir, setLogAir] = useState({});

  useEffect(() => {
    // Membaca data pakan_pintar secara real-time
    const pakanRef = ref(db, 'pakan_pintar');
    onValue(pakanRef, (snapshot) => {
      if (snapshot.exists()) {
        setPakan(snapshot.val());
      }
    });

    // Membaca data log_udara (kuras air) secara real-time
    const airRef = ref(db, 'log_udara');
    onValue(airRef, (snapshot) => {
      if (snapshot.exists()) {
        setLogAir(snapshot.val());
      }
    });
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Dashboard Beranda Pintar</h1>
      
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {/* Kartu Jadwal Pakan */}
        <div style={cardStyle}>
          <h3>Jadwal Pakan</h3>
          <p>🌅 Pagi: <strong>{pakan['jam pagi']}:{pakan['menit pagi']}</strong></p>
          <p>🌇 Sore: <strong>{pakan['jam sore']}:{pakan['menit sore']}</strong></p>
          <p>⏱️ Durasi: {pakan['durasi detik']} detik</p>
        </div>

        {/* Kartu Status Kolam */}
        <div style={cardStyle}>
          <h3>Status Kolam</h3>
          <p>📅 Terakhir Kuras: <br/><strong>{logAir['tanggal kuras']}</strong></p>
          <p>💧 Kondisi: {logAir['kondisi udara'] || 'Normal'}</p>
        </div>
      </div>

      {/* Fitur Analisis AI */}
      <div style={{ marginTop: '20px', backgroundColor: '#e1f5fe', padding: '15px', borderRadius: '10px' }}>
        <h4>💡 Saran Pintar:</h4>
        <p>Ikan Anda akan diberi pakan selama {pakan['durasi detik']} detik pada pukul {pakan['jam sore']}:{pakan['menit sore']}. 
        Mengingat air terakhir dikuras pada {logAir['tanggal kuras']}, pastikan kondisi air tetap jernih!</p>
      </div>
    </div>
  );
}

const cardStyle = {
  border: '1px solid #ddd',
  borderRadius: '15px',
  padding: '20px',
  minWidth: '250px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
};

export default Aplikasi;
