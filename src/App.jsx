import React, { useState, useEffect } from 'react';
import { db } from './firebase'; 
import { ref, onValue, update } from "firebase/database";

function App() {
  const [halaman, setHalaman] = useState('pakan');
  const [data, setData] = useState({
    Jadwal: 0,
    end_date: 0,
    jam_pagi: 0,
    menit_pagi: 0, // Ditambahkan jika ada di database
    jam_sore: 0,
    menit_sore: 0, // Ditambahkan jika ada di database
    durasi_detik: 0
  });

  useEffect(() => {
    const dbRef = ref(db, '/'); 
    onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        setData(snapshot.val());
      }
    });
  }, []);

  const handleUpdate = () => {
    const dbRef = ref(db, '/');
    update(dbRef, data).then(() => {
      alert("Data berhasil diperbarui!");
    });
  };

  const Sidebar = () => (
    <div style={{ width: '280px', background: '#0f172a', padding: '20px', borderRight: '1px solid #38bdf8' }}>
      <h2 style={{ color: '#38bdf8', textAlign: 'center' }}>Sistem Cerdas Santi</h2>
      <hr style={{ borderColor: '#1e293b', margin: '20px 0' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <button onClick={() => setHalaman('beranda')} style={btnStyle(halaman === 'beranda')}>🏠 Beranda</button>
        <button onClick={() => setHalaman('pakan')} style={btnStyle(halaman === 'pakan')}>🐟 Pakan Pintar</button>
        <button onClick={() => setHalaman('log')} style={btnStyle(halaman === 'log')}>📝 Log Jurnal Ikan</button>
        <button onClick={() => setHalaman('air')} style={btnStyle(halaman === 'air')}>💧 Log Udara</button>
        <button onClick={() => setHalaman('hidroponik')} style={btnStyle(halaman === 'hidroponik')}>🌱 Hidroponik</button>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', backgroundColor: '#0b1120', color: '#f8fafc', minHeight: '100vh', fontFamily: 'Arial' }}>
      <Sidebar />
      
      <div style={{ flex: 1, padding: '40px', display: 'flex', justifyContent: 'center' }}>
        {halaman === 'pakan' && (
          <div style={{ background: '#1e293b', padding: '30px', borderRadius: '30px', width: '100%', maxWidth: '450px', border: '2px solid #38bdf8', textAlign: 'center' }}>
            <h2 style={{ color: '#38bdf8' }}>Pakan Ikan Pintar</h2>
            <p style={{ color: '#94a3b8' }}>Santi Smart System v3.0</p>

            <div style={{ marginTop: '25px', textAlign: 'left' }}>
              <label style={labelStyle}>RENTANG TANGGAL (MULAI - SELESAI)</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input type="number" value={data.Jadwal} onChange={(e) => setData({...data, Jadwal: e.target.value})} style={inputStyle} />
                <input type="number" value={data.end_date} onChange={(e) => setData({...data, end_date: e.target.value})} style={inputStyle} />
              </div>

              <label style={labelStyle}>JADWAL PAGI (JAM : MENIT)</label>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input type="number" value={data.jam_pagi} onChange={(e) => setData({...data, jam_pagi: e.target.value})} style={inputStyle} />
                <span style={{color: '#38bdf8', fontWeight: 'bold'}}>:</span>
                <input type="number" value={data.menit_pagi || 0} onChange={(e) => setData({...data, menit_pagi: e.target.value})} style={inputStyle} />
              </div>

              <label style={labelStyle}>JADWAL SORE (JAM : MENIT)</label>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input type="number" value={data.jam_sore} onChange={(e) => setData({...data, jam_sore: e.target.value})} style={inputStyle} />
                <span style={{color: '#38bdf8', fontWeight: 'bold'}}>:</span>
                <input type="number" value={data.menit_sore || 0} onChange={(e) => setData({...data, menit_sore: e.target.value})} style={inputStyle} />
              </div>

              <label style={labelStyle}>DURASI PAKAN (DETIK)</label>
              <input type="number" value={data.durasi_detik} onChange={(e) => setData({...data, durasi_detik: e.target.value})} style={{...inputStyle, width: '100%'}} />

              <button onClick={handleUpdate} style={updateBtnStyle}>UPDATE DATA & AKTIFKAN</button>
            </div>
          </div>
        )}
        {halaman !== 'pakan' && <h1>Halaman {halaman} sedang dalam pengembangan...</h1>}
      </div>
    </div>
  );
}

// STYLING
const btnStyle = (aktif) => ({
  background: aktif ? '#38bdf8' : 'transparent',
  color: aktif ? '#0f172a' : '#38bdf8',
  border: '1px solid #38bdf8',
  padding: '12px 15px',
  borderRadius: '12px',
  cursor: 'pointer',
  textAlign: 'left',
  fontWeight: 'bold',
  transition: '0.3s'
});

const labelStyle = { display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '8px', marginTop: '15px', fontWeight: 'bold' };

const inputStyle = {
  background: '#0f172a',
  border: 'none',
  padding: '15px',
  borderRadius: '12px',
  color: '#38bdf8',
  textAlign: 'center',
  fontSize: '18px',
  fontWeight: 'bold',
  width: '100%'
};

const updateBtnStyle = {
  width: '100%',
  background: '#22c55e',
  color: '#ffffff',
  border: 'none',
  padding: '18px',
  borderRadius: '15px',
  marginTop: '30px',
  fontWeight: 'bold',
  fontSize: '16px',
  cursor: 'pointer',
  boxShadow: '0 4px 14px 0 rgba(34, 197, 94, 0.39)'
};

export default App;
