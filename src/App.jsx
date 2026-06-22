import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://tqfspwtaexpxlmflaskd.supabase.co', 'sb_publishable_QTf6sd3BIoxhRf7u67-1JA_lPiLm_EB');

function App() {
  const [halaman, setHalaman] = useState('beranda');
  const [data, setData] = useState({ tglMulai: 1, tglSelesai: 30, jamPagi: 8, menitPagi: 0, jamSore: 17, menitSore: 0, durasi: 5 });
  const [wifi, setWifi] = useState({ ssid: '', pass: '' });

  // --- STYLE ---
  const containerStyle = { maxWidth: '500px', margin: '20px auto', padding: '20px', color: 'white', textAlign: 'center' };
  const gridContainer = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '20px' };
  const cardStyle = { backgroundColor: '#1e293b', padding: '20px', borderRadius: '15px', cursor: 'pointer', border: '1px solid #334155' };
  const inputStyle = { width: '100%', padding: '12px', margin: '8px 0', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: 'white' };
  const btnPrimary = { width: '100%', padding: '15px', backgroundColor: '#0ea5e9', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 'bold', marginTop: '20px', cursor: 'pointer' };

  useEffect(() => { document.body.style.backgroundColor = '#0f172a'; }, []);

  return (
    <div style={containerStyle}>
      {/* --- HALAMAN BERANDA (GRID MENU) --- */}
      {halaman === 'beranda' && (
        <>
          <h1>SMART FARMING KSTM AL IHYA</h1>
          <div style={gridContainer}>
            <div style={cardStyle} onClick={() => setHalaman('pakan')}>
              <h3>Jadwal Pakan</h3>
              <p>Atur waktu pemberian pakan</p>
            </div>
            <div style={cardStyle} onClick={() => setHalaman('wifi')}>
              <h3>Set WiFi</h3>
              <p>Konfigurasi jaringan</p>
            </div>
          </div>
        </>
      )}

      {/* --- HALAMAN FORM PAKAN --- */}
      {halaman === 'pakan' && (
        <div style={{ textAlign: 'left' }}>
          <button onClick={() => setHalaman('beranda')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>← Kembali ke Menu</button>
          <h2 style={{ textAlign: 'center' }}>Pengaturan Pakan</h2>
          <label>RENTANG TANGGAL</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input type="number" style={inputStyle} value={data.tglMulai} onChange={(e) => setData({...data, tglMulai: e.target.value})} />
            <input type="number" style={inputStyle} value={data.tglSelesai} onChange={(e) => setData({...data, tglSelesai: e.target.value})} />
          </div>
          {/* Tambahkan input lain sesuai desain Anda */}
          <button style={btnPrimary} onClick={() => alert("Data diperbarui!")}>PERBARUI DATA & AKTIFKAN</button>
        </div>
      )}

      {/* --- HALAMAN FORM WIFI --- */}
      {halaman === 'wifi' && (
        <div style={{ textAlign: 'left' }}>
          <button onClick={() => setHalaman('beranda')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>← Kembali ke Menu</button>
          <h2>Pengaturan WiFi</h2>
          <input style={inputStyle} placeholder="SSID Baru" onChange={(e) => setWifi({...wifi, ssid: e.target.value})} />
          <input type="password" style={inputStyle} placeholder="Password Baru" onChange={(e) => setWifi({...wifi, pass: e.target.value})} />
          <button style={btnPrimary} onClick={() => alert("WiFi disimpan!")}>SIMPAN & RESTART</button>
        </div>
      )}
    </div>
  );
}

export default App;