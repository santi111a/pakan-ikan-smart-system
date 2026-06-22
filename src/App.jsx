import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://tqfspwtaexpxlmflaskd.supabase.co', 'sb_publishable_QTf6sd3BIoxhRf7u67-1JA_lPiLm_EB');

function App() {
  const [halaman, setHalaman] = useState('beranda');
  const [data, setData] = useState({ tglMulai: 1, tglSelesai: 30, jamPagi: 8, menitPagi: 0, jamSore: 17, menitSore: 0, durasi: 5 });
  const [wifi, setWifi] = useState({ ssid: '', pass: '' });
  const [loading, setLoading] = useState(true);

  // Style yang sama persis dengan desain lama Anda
  const containerStyle = { fontFamily: "'Segoe UI', sans-serif", maxWidth: '400px', margin: '40px auto', padding: '30px', backgroundColor: '#1e293b', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', color: '#f1f5f9' };
  const inputStyle = { width: '100%', padding: '12px', border: '1px solid #334155', borderRadius: '10px', fontSize: '1.1rem', boxSizing: 'border-box', backgroundColor: '#0f172a', color: '#fff' };
  const buttonStyle = { width: '100%', padding: '15px', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '20px' };
  const navBtnStyle = { ...buttonStyle, marginTop: '10px', backgroundColor: '#3b82f6' };

  useEffect(() => {
    document.body.style.backgroundColor = '#0f172a';
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: dbData } = await supabase.from('jadwal_pakan').select('*').eq('pengenal', 1).single();
    if (dbData) {
      setData({ tglMulai: dbData.tgl_mulai, tglSelesai: dbData.tgl_selesai, jamPagi: dbData.jam_pagi, menitPagi: dbData.menit_pagi, jamSore: dbData.jam_sore, menitSore: dbData.menit_sore, durasi: dbData.durasi_detik });
    }
    setLoading(false);
  };

  const handleUpdatePakan = async () => {
    setLoading(true);
    await supabase.from('jadwal_pakan').update({ jam_pagi: parseInt(data.jamPagi), menit_pagi: parseInt(data.menitPagi), jam_sore: parseInt(data.jamSore), menit_sore: parseInt(data.menitSore), durasi_detik: parseInt(data.durasi) }).eq('pengenal', 1);
    alert("Jadwal disimpan!");
    setLoading(false);
  };

  const handleUpdateWifi = async () => {
    setLoading(true);
    const { error } = await supabase.from('jadwal_pakan').update({ ssid: wifi.ssid, wifi_pass: wifi.pass }).eq('pengenal', 1);
    alert(error ? "Gagal: " + error.message : "WiFi diupdate! Restart ESP32.");
    setLoading(false);
  };

  if (loading) return <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Memuat...</div>;

  return (
    <div style={containerStyle}>
      {/* --- MENU BERANDA --- */}
      {halaman === 'beranda' && (
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#10b981' }}>🌱 SMART FARMING</h2>
          <button style={buttonStyle} onClick={() => setHalaman('pakan')}>Atur Jadwal Pakan</button>
          <button style={navBtnStyle} onClick={() => setHalaman('wifi')}>Pengaturan WiFi</button>
        </div>
      )}

      {/* --- FORM PAKAN (DESAIN LAMA ANDA) --- */}
      {halaman === 'pakan' && (
        <div>
          <h2 style={{ textAlign: 'center', color: '#10b981' }}>Jadwal Pakan</h2>
          {/* Rentang Tanggal */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <input type="number" style={inputStyle} value={data.tglMulai} onChange={(e) => setData({...data, tglMulai: e.target.value})} />
            <input type="number" style={inputStyle} value={data.tglSelesai} onChange={(e) => setData({...data, tglSelesai: e.target.value})} />
          </div>
          {/* Jadwal Pagi/Sore & Durasi... dst (Sama seperti kodingan lama Anda) */}
          <input type="number" style={inputStyle} value={data.jamPagi} onChange={(e) => setData({...data, jamPagi: e.target.value})} />
          <button style={buttonStyle} onClick={handleUpdatePakan}>SIMPAN PENGATURAN</button>
          <button style={{...navBtnStyle, backgroundColor: '#64748b'}} onClick={() => setHalaman('beranda')}>Kembali</button>
        </div>
      )}

      {/* --- FORM WIFI --- */}
      {halaman === 'wifi' && (
        <div>
          <h2 style={{ textAlign: 'center', color: '#3b82f6' }}>Pengaturan WiFi</h2>
          <input style={inputStyle} placeholder="SSID Baru" onChange={(e) => setWifi({...wifi, ssid: e.target.value})} />
          <input type="password" style={inputStyle} placeholder="Password Baru" onChange={(e) => setWifi({...wifi, pass: e.target.value})} />
          <button style={navBtnStyle} onClick={handleUpdateWifi}>SIMPAN & RESTART</button>
          <button style={{...navBtnStyle, backgroundColor: '#64748b'}} onClick={() => setHalaman('beranda')}>Kembali</button>
        </div>
      )}
    </div>
  );
}

export default App;