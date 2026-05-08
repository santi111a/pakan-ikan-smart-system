import React, { useState, useEffect } from 'react';
import { db } from './firebase'; 
import { ref, onValue, update } from "firebase/database";

function App() {
  const [halaman, setHalaman] = useState('beranda');
  const [data, setData] = useState({
    Jadwal: 0,
    end_date: 0,
    jam_pagi: 0,
    menit_pagi: 0,
    jam_sore: 0,
    menit_sore: 0,
    durasi_detik: 0,
    kipas_on: false 
  });

  // Ambil data real-time dari Firebase
  useEffect(() => {
    const dbRef = ref(db, '/'); 
    onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        setData(snapshot.val());
      }
    });
  }, []);

  // Fungsi untuk mengirim perubahan data ke Firebase
  const handleUpdate = () => {
    const dbRef = ref(db, '/');
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

  // Komponen Sidebar Navigasi
  const Sidebar = () => (
    <div style={{ width: '300px', background: '#0f172a', padding: '25px', borderRight: '1px solid #38bdf8', height: '100vh', position: 'sticky', top: 0 }}>
      <h2 style={{ color: '#38bdf8', textAlign: 'center', marginBottom: '30px', fontSize: '22px' }}>Sistem Cerdas Santi</h2>
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
      
      <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        
        {/* === HALAMAN BERANDA === */}
        {halaman === 'beranda' && (
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h1 style={{ color: '#38bdf8', marginBottom: '10px', fontSize: '36px' }}>Selamat Datang</h1>
            <p style={{ color: '#94a3b8', fontSize: '18px', marginBottom: '40px', lineHeight: '1.6' }}>
              Sistem Cerdas Santi adalah solusi manajemen kolam pintar berbasis IoT untuk pemantauan dan perawatan ekosistem air Anda secara otomatis dan real-time.
            </p>

            {/* Dashboard Status Cepat */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
              <div style={cardStyle}>
                <h4 style={cardLabel}>JADWAL PAKAN SORE</h4>
                <h2 style={cardValue}>{data.jam_sore || '0'}:00</h2>
                <p style={{ color: '#64748b', fontSize: '12px' }}>Durasi: {data.durasi_detik} dtk</p>
              </div>
              <div style={cardStyle}>
                <h4 style={cardLabel}>KONTROL KIPAS</h4>
                <h2 style={{ ...cardValue, color: data.kipas_on ? '#22c55e' : '#ef4444' }}>
                  {data.kipas_on ? 'AKTIF' : 'MATI'}
                </h2>
                <p style={{ color: '#64748b', fontSize: '12px' }}>Otomatisasi Suhu</p>
              </div>
              <div style={cardStyle}>
                <h4 style={cardLabel}>HIDROPONIK</h4>
                <h2 style={cardValue}>STABIL</h2>
                <p style={{ color: '#64748b', fontSize: '12px' }}>Sirkulasi Normal</p>
              </div>
            </div>

            <hr style={{ border: '0.5px solid #1e293b', marginBottom: '40px' }} />

            {/* Panduan Pengguna */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
              <div style={guideBox}>
                <h3 style={{ color: '#38bdf8', marginTop: 0 }}>📖 Pengertian Sistem</h3>
                <p style={guideText}>
                  Aplikasi ini mengintegrasikan perangkat keras kolam Anda dengan database Cloud. 
                  Anda dapat mengatur pemberi pakan otomatis dan memantau sensor dari mana saja secara jarak jauh.
                </p>
              </div>
              <div style={guideBox}>
                <h3 style={{ color: '#38bdf8', marginTop: 0 }}>🚀 Panduan Navigasi</h3>
                <ul style={{ ...guideText, paddingLeft: '20px' }}>
                  <li><b>Pakan Pintar:</b> Pengaturan waktu dan durasi pakan ikan.</li>
                  <li><b>Log Jurnal:</b> Melihat riwayat data sensor harian.</li>
                  <li><b>Otomatisasi:</b> Sistem bekerja otomatis sesuai input yang Anda berikan.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* === HALAMAN PAKAN PINTAR === */}
        {halaman === 'pakan' && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={formContainer}>
              <h2 style={{ color: '#38bdf8', textAlign: 'center', fontSize: '26px', marginBottom: '5px' }}>Pengaturan Pakan</h2>
              <p style={{ color: '#64748b', textAlign: 'center', marginBottom: '30px', fontSize: '14px' }}>Konfigurasi Penjadwalan Alat</p>

              <div style={{ textAlign: 'left' }}>
                <label style={labelStyle}>RENTANG TANGGAL (MULAI - SELESAI)</label>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <input type="number" value={data.Jadwal} onChange={(e) => setData({...data, Jadwal: e.target.value})} style={inputStyle} />
                  <input type="number" value={data.end_date} onChange={(e) => setData({...data, end_date: e.target.value})} style={inputStyle} />
                </div>

                <label style={labelStyle}>JADWAL PAGI (JAM : MENIT)</label>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                  <input type="number" value={data.jam_pagi} onChange={(e) => setData({...data, jam_pagi: e.target.value})} style={inputStyle} />
                  <span style={divider}>:</span>
                  <input type="number" value={data.menit_pagi || 0} onChange={(e) => setData({...data, menit_pagi: e.target.value})} style={inputStyle} />
                </div>

                <label style={labelStyle}>JADWAL SORE (JAM : MENIT)</label>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                  <input type="number" value={data.jam_sore} onChange={(e) => setData({...data, jam_sore: e.target.value})} style={inputStyle} />
                  <span style={divider}>:</span>
                  <input type="number" value={data.menit_sore || 0} onChange={(e) => setData({...data, menit_sore: e.target.value})} style={inputStyle} />
                </div>

                <label style={labelStyle}>DURASI PAKAN (DETIK)</label>
                <input type="number" value={data.durasi_detik} onChange={(e) => setData({...data, durasi_detik: e.target.value})} style={{...inputStyle, width: '100%'}} />

                <button onClick={handleUpdate} style={updateBtnStyle}>UPDATE DATA & AKTIFKAN</button>
              </div>
            </div>
          </div>
        )}

        {/* === HALAMAN LAIN (LOG/AIR/HIDROPONIK) === */}
        {halaman !== 'beranda' && halaman !== 'pakan' && (
          <div style={{ textAlign: 'center', marginTop: '100px' }}>
            <h1 style={{ fontSize: '40px', color: '#38bdf8' }}>Halaman {halaman.toUpperCase()}</h1>
            <p style={{ color: '#64748b' }}>Fitur ini sedang dalam sinkronisasi dengan database sensor.</p>
          </div>
        )}

      </div>
    </div>
  );
}

// --- CSS STYLES ---
const btnStyle = (aktif) => ({
  background: aktif ? 'linear-gradient(90deg, #38bdf8, #0ea5e9)' : '#1e293b',
  color: aktif ? '#0f172a' : '#94a3b8',
  border: 'none',
  padding: '14px 20px',
  borderRadius: '12px',
  cursor: 'pointer',
  textAlign: 'left',
  fontWeight: 'bold',
  fontSize: '15px',
  transition: 'all 0.3s'
});

const cardStyle = { background: '#1e293b', padding: '25px', borderRadius: '20px', border: '1px solid #334155', textAlign: 'center' };
const cardLabel = { color: '#64748b', fontSize: '11px', fontWeight: '800', letterSpacing: '1px', marginBottom: '10px' };
const cardValue = { color: '#38bdf8', fontSize: '32px', margin: '0' };

const guideBox = { background: '#1e293b', padding: '25px', borderRadius: '20px', border: '1px solid #334155' };
const guideText = { color: '#94a3b8', fontSize: '14px', lineHeight: '1.8' };

const formContainer = { background: '#1e293b', padding: '40px', borderRadius: '35px', width: '100%', maxWidth: '500px', border: '1px solid #334155' };
const labelStyle = { display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '10px', marginTop: '20px', fontWeight: '800' };
const inputStyle = { background: '#0f172a', border: '1px solid #334155', padding: '15px', borderRadius: '15px', color: '#38bdf8', textAlign: 'center', fontSize: '20px', fontWeight: 'bold', width: '100%', outline: 'none' };
const divider = { color: '#38bdf8', fontWeight: 'bold', fontSize: '24px' };
const updateBtnStyle = { width: '100%', background: '#22c55e', color: '#ffffff', border: 'none', padding: '20px', borderRadius: '18px', marginTop: '35px', fontWeight: '900', cursor: 'pointer' };

export default App;
