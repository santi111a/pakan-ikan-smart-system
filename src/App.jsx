import React, { useState, useEffect } from 'react';
import { db } from './firebase'; 
import { ref, onValue, update } from "firebase/database";

function App() {
  const [halaman, setHalaman] = useState('pakan');
  const [data, setData] = useState({
    Jadwal: 0,
    end_date: 0,
    jam_pagi: 0,
    menit_pagi: 0,
    jam_sore: 0,
    menit_sore: 0,
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
    // Mengubah string input menjadi number sebelum dikirim ke Firebase
    const dataToUpdate = {
      ...data,
      Jadwal: Number(data.Jadwal),
      end_date: Number(data.end_date),
      jam_pagi: Number(data.jam_pagi),
      menit_pagi: Number(data.menit_pagi || 0),
      jam_sore: Number(data.jam_sore),
      menit_sore: Number(data.menit_sore || 0),
      durasi_detik: Number(data.durasi_detik)
    };
    
    update(dbRef, dataToUpdate).then(() => {
      alert("✅ Data Berhasil Diperbarui!");
    }).catch((error) => {
      alert("Gagal update: " + error.message);
    });
  };

  const Sidebar = () => (
    <div style={{ width: '300px', background: '#0f172a', padding: '25px', borderRight: '1px solid #38bdf8', height: '100vh', position: 'sticky', top: 0 }}>
      <h2 style={{ color: '#38bdf8', textAlign: 'center', marginBottom: '30px' }}>Sistem Cerdas Santi</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
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
      
      <div style={{ flex: 1, padding: '40px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
        {halaman === 'pakan' ? (
          <div style={{ background: '#1e293b', padding: '40px', borderRadius: '40px', width: '100%', maxWidth: '500px', border: '1px solid #334155', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
            <h2 style={{ color: '#38bdf8', textAlign: 'center', fontSize: '28px', marginBottom: '5px' }}>Pakan Ikan Pintar</h2>
            <p style={{ color: '#64748b', textAlign: 'center', marginBottom: '30px' }}>Santi Smart System v3.0</p>

            <div style={{ textAlign: 'left' }}>
              <label style={labelStyle}>RENTANG TANGGAL (MULAI - SELESAI)</label>
              <div style={{ display: 'flex', gap: '15px' }}>
                <input type="number" value={data.Jadwal} onChange={(e) => setData({...data, Jadwal: e.target.value})} style={inputStyle} />
                <input type="number" value={data.end_date} onChange={(e) => setData({...data, end_date: e.target.value})} style={inputStyle} />
              </div>

              <label style={labelStyle}>JADWAL PAGI (JAM : MENIT)</label>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <input type="number" value={data.jam_pagi} onChange={(e) => setData({...data, jam_pagi: e.target.value})} style={inputStyle} />
                <span style={{color: '#38bdf8', fontWeight: 'bold', fontSize: '24px'}}>:</span>
                <input type="number" value={data.menit_pagi || 0} onChange={(e) => setData({...data, menit_pagi: e.target.value})} style={inputStyle} />
              </div>

              <label style={labelStyle}>JADWAL SORE (JAM : MENIT)</label>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <input type="number" value={data.jam_sore} onChange={(e) => setData({...data, jam_sore: e.target.value})} style={inputStyle} />
                <span style={{color: '#38bdf8', fontWeight: 'bold', fontSize: '24px'}}>:</span>
                <input type="number" value={data.menit_sore || 0} onChange={(e) => setData({...data, menit_sore: e.target.value})} style={inputStyle} />
              </div>

              <label style={labelStyle}>DURASI PAKAN (DETIK)</label>
              <input type="number" value={data.durasi_detik} onChange={(e) => setData({...data, durasi_detik: e.target.value})} style={{...inputStyle, width: '100%'}} />

              <button onClick={handleUpdate} style={updateBtnStyle}>UPDATE DATA & AKTIFKAN</button>
            </div>
          </div>
        ) : (
          <div style={{textAlign: 'center', marginTop: '100px'}}>
             <h1 style={{fontSize: '40px', color: '#38bdf8'}}>Halaman {halaman.toUpperCase()}</h1>
             <p>Data sedang disinkronkan dari sensor...</p>
          </div>
        )}
      </div>
    </div>
  );
}

// CSS STYLES
const btnStyle = (aktif) => ({
  background: aktif ? '#38bdf8' : '#1e293b',
  color: aktif ? '#0f172a' : '#94a3b8',
  border: aktif ? '1px solid #38bdf8' : '1px solid #334155',
  padding: '14px 20px',
  borderRadius: '12px',
  cursor: 'pointer',
  textAlign: 'left',
  fontWeight: 'bold',
  fontSize: '15px',
  transition: 'all 0.3s'
});

const labelStyle = { display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '10px', marginTop: '20px', fontWeight: '800', letterSpacing: '1px' };

const inputStyle = {
  background: '#0f172a',
  border: '1px solid #334155',
  padding: '15px',
  borderRadius: '15px',
  color: '#38bdf8',
  textAlign: 'center',
  fontSize: '20px',
  fontWeight: 'bold',
  width: '100%',
  outline: 'none'
};

const updateBtnStyle = {
  width: '100%',
  background: '#22c55e',
  color: '#ffffff',
  border: 'none',
  padding: '20px',
  borderRadius: '18px',
  marginTop: '35px',
  fontWeight: '900',
  fontSize: '16px',
  cursor: 'pointer',
  boxShadow: '0 10px 15px -3px rgba(34, 197, 94, 0.4)',
  transition: 'transform 0.2s'
};

export default App;
