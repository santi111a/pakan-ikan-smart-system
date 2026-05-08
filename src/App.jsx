import React, { useState, useEffect } from 'react';
import { db } from './firebase'; 
import { ref, onValue } from "firebase/database";

function App() {
  const [halaman, setHalaman] = useState('beranda');
  const [data, setData] = useState({});

  useEffect(() => {
    // Mengambil seluruh data dari root Firebase agar semua menu terisi
    const dbRef = ref(db, '/'); 
    onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        setData(snapshot.val());
      }
    });
  }, []);

  // Komponen Sidebar/Menu
  const Sidebar = () => (
    <div style={{ width: '250px', background: '#1e293b', padding: '20px', borderRight: '2px solid #38bdf8' }}>
      <h2 style={{ color: '#38bdf8', fontSize: '1.2rem' }}>Santi Smart System</h2>
      <hr style={{ borderColor: '#334155', margin: '20px 0' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button onClick={() => setHalaman('beranda')} style={btnStyle(halaman === 'beranda')}>🏠 Beranda</button>
        <button onClick={() => setHalaman('pakan')} style={btnStyle(halaman === 'pakan')}>🐟 Pakan Pintar</button>
        <button onClick={() => setHalaman('log')} style={btnStyle(halaman === 'log')}>📝 Log Jurnal Ikan</button>
        <button onClick={() => setHalaman('air')} style={btnStyle(halaman === 'air')}>💧 Log Air</button>
        <button onClick={() => setHalaman('hidroponik')} style={btnStyle(halaman === 'hidroponik')}>🌱 Hidroponik</button>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', backgroundColor: '#0f172a', color: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <Sidebar />
      
      <div style={{ flex: 1, padding: '40px' }}>
        {/* KONTEN BERANDA */}
        {halaman === 'beranda' && (
          <div>
            <h1>Selamat Datang</h1>
            <p>Pilih menu di samping untuk memonitor sistem Anda.</p>
          </div>
        )}

        {/* KONTEN PAKAN PINTAR */}
        {halaman === 'pakan' && (
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ color: '#38bdf8' }}>Pakan Pintar</h1>
            <div style={{ background: '#1e293b', padding: '30px', borderRadius: '20px', border: '1px solid #334155', display: 'inline-block' }}>
              <h3>Jadwal Pakan Sore</h3>
              <p style={{ fontSize: '40px', fontWeight: 'bold' }}>{data.jam_sore || '0'} : 00</p>
              <hr style={{ borderColor: '#334155' }} />
              <h3>Durasi Detik</h3>
              <p style={{ fontSize: '40px', fontWeight: 'bold' }}>{data.durasi_detik || '0'}</p>
            </div>
          </div>
        )}

        {/* KONTEN LOG AIR */}
        {halaman === 'air' && (
          <div>
            <h1>Log Air</h1>
            <div style={{ background: '#1e293b', padding: '20px', borderRadius: '15px' }}>
              <p>Status Kipas: {data.kipas_on ? 'NYALA' : 'MATI'}</p>
              <p>Jadwal Pagi: {data.jam_pagi || '0'}:00</p>
            </div>
          </div>
        )}

        {/* KONTEN LAIN (Placeholder) */}
        {(halaman === 'log' || halaman === 'hidroponik') && (
          <div>
            <h1>Halaman {halaman.toUpperCase()}</h1>
            <p>Data sedang disiapkan dari sensor...</p>
          </div>
        )}
      </div>
    </div>
  );
}

const btnStyle = (aktif) => ({
  background: aktif ? '#38bdf8' : 'transparent',
  color: aktif ? '#0f172a' : '#38bdf8',
  border: '1px solid #38bdf8',
  padding: '12px 15px',
  borderRadius: '8px',
  cursor: 'pointer',
  textAlign: 'left',
  fontWeight: 'bold',
  transition: '0.3s'
});

export default App;
