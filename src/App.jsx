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
    kipas_on: false // Asumsi variabel untuk status kipas
  });

  // Sinkronisasi Data Realtime dari Firebase
  useEffect(() => {
    const dbRef = ref(db, '/'); 
    onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        setData(snapshot.val());
      }
    });
  }, []);

  // Fungsi untuk update data ke Firebase
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

  // Komponen Sidebar
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
    <div style={{ display: 'flex', backgroundColor: '#0b1120', color: '#f8fafc', minHeight: '100vh', fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}>
      <Sidebar />
      
      <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        
        {/* HALAMAN BERANDA */}
        {halaman === 'beranda' && (
          <div>
            <h1 style={{ color: '#38bdf8', marginBottom: '10px', fontSize: '32px' }}>Dashboard Utama</h1>
            <p style={{ color: '#64748b', marginBottom: '40px' }}>Selamat datang di kendali Sistem Cerdas Santi.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' }}>
              <div style={cardStyle}>
                <div style={iconCircle}>🕒</div>
                <h4 style={cardLabel}>JADWAL PAKAN</h4>
                <h2 style={cardValue}>{data.jam_sore}:00</h2>
                <div style={cardFooter}>Durasi: {data.durasi_detik} detik</div>
              </div>

              <div style={cardStyle}>
                <div style={iconCircle}>⚙️</div>
                <h4 style={cardLabel}>STATUS KIPAS</h4>
                <h2 style={{ ...cardValue, color: data.kipas_on ? '#22c55e' : '#ef4444' }}>
                  {data.kipas_on ? 'AKTIF' : 'NONAKTIF'}
                </h2>
                <div style={cardFooter}>Otomatisasi Sistem</div>
              </div>

              <div style={cardStyle}>
                <div style={iconCircle}>💧</div>
                <h4 style={cardLabel}>KONDISI AIR</h4>
                <h2 style={cardValue}>NORMAL</h2>
                <div style={cardFooter}>Update: Real-time</div>
              </div>
            </div>

            <div style={infoBox}>
              <h4 style={{ margin: '0 0 10px 0', color: '#38bdf8' }}>💡 Tips Sistem</h4>
              <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6', color: '#94a3b8' }}>
                Pastikan rentang tanggal pakan diatur dengan benar agar alat bekerja sesuai durasi peliharaan. 
                Anda dapat mengubah pengaturan ini di menu <b>Pakan Pintar</b>.
              </p>
            </div>
          </div>
        )}

        {/* HALAMAN PAKAN PINTAR */}
        {halaman === 'pakan' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={formContainer}>
              <h2 style={{ color: '#38bdf8', textAlign: 'center', fontSize: '26px', marginBottom: '5px' }}>Pakan Ikan Pintar</h2>
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

        {/* HALAMAN LAINNYA */}
        {halaman !== 'beranda' && halaman !== 'pakan' && (
          <div style={{ textAlign: 'center', marginTop: '100px' }}>
            <h1 style={{ fontSize: '40px', color: '#38bdf8' }}>Halaman {halaman.toUpperCase()}</h1>
            <p style={{ color: '#64748b' }}>Data Log sedang disinkronkan dari database...</p>
          </div>
        )}

      </div>
    </div>
  );
}

// --- STYLING OBJECTS ---

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
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  boxShadow: aktif ? '0 4px 12px rgba(56, 189, 248, 0.3)' : 'none'
});

const cardStyle = {
  background: '#1e293b',
  padding: '30px',
  borderRadius: '24px',
  border: '1px solid #334155',
  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
  textAlign: 'center'
};

const iconCircle = {
  fontSize: '32px',
  background: '#0f172a',
  width: '60px',
  height: '60px',
  lineHeight: '60px',
  borderRadius: '50%',
  margin: '0 auto 15px auto',
  border: '1px solid #38bdf8'
};

const cardLabel = { color: '#64748b', fontSize: '12px', margin: '10px 0', letterSpacing: '1.5px', fontWeight: '800' };
const cardValue = { color: '#38bdf8', fontSize: '36px', margin: '0' };
const cardFooter = { color: '#475569', fontSize: '13px', marginTop: '10px' };

const infoBox = {
  marginTop: '40px',
  padding: '25px',
  background: 'rgba(56, 189, 248, 0.05)',
  borderRadius: '20px',
  borderLeft: '4px solid #38bdf8'
};

const formContainer = {
  background: '#1e293b',
  padding: '40px',
  borderRadius: '35px',
  width: '100%',
  maxWidth: '550px',
  border: '1px solid #334155',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
};

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
  outline: 'none',
  transition: 'border 0.3s'
};

const divider = { color: '#38bdf8', fontWeight: 'bold', fontSize: '24px' };

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
