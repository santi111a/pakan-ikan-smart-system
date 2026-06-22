import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://tqfspwtaexpxlmflaskd.supabase.co', 'sb_publishable_QTf6sd3BIoxhRf7u67-1JA_lPiLm_EB');

function App() {
  const [halaman, setHalaman] = useState('beranda');
  const [data, setData] = useState({ jamPagi: 8, menitPagi: 0, jamSore: 17, menitSore: 0, durasi: 5 });
  const [wifi, setWifi] = useState({ ssid: '', pass: '' });
  const [loading, setLoading] = useState(false);

  // KUMPULAN STYLE (Pastikan ini dipakai di div utama)
  const containerStyle = { 
    fontFamily: "'Segoe UI', sans-serif", 
    maxWidth: '400px', 
    margin: '40px auto', 
    padding: '30px', 
    backgroundColor: '#1e293b', 
    borderRadius: '20px', 
    boxShadow: '0 20px 40px rgba(0,0,0,0.3)', 
    color: '#f1f5f9' 
  };

  const inputStyle = { width: '100%', padding: '12px', margin: '10px 0', borderRadius: '10px', border: '1px solid #334155', backgroundColor: '#0f172a', color: 'white', boxSizing: 'border-box' };
  const btnStyle = { width: '100%', padding: '15px', marginTop: '10px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' };
  
useEffect(() => {
    document.body.style.backgroundColor = '#0f172a';
  }, []);

const handleUpdatePakan = async () => {
    setLoading(true);
    await supabase.from('jadwal_pakan').update({
      jam_pagi: parseInt(data.jamPagi), menit_pagi: parseInt(data.menitPagi),
      jam_sore: parseInt(data.jamSore), menit_sore: parseInt(data.menitSore),
      durasi_detik: parseInt(data.durasi)
    }).eq('pengenal', 1);
    alert("Jadwal Pakan Tersimpan!");
    setLoading(false);
    };

const handleUpdateWifi = async () => {
    setLoading(true);
    // Mengirim SSID dan Password baru ke database
    const { error } = await supabase.from('jadwal_pakan').update({ 
        ssid: wifi.ssid, 
        wifi_pass: wifi.pass 
    }).eq('pengenal', 1);
    
    if (error) alert("Gagal update WiFi: " + error.message);
    else alert("WiFi diupdate! ESP32 akan restart otomatis.");
    setLoading(false);
  }


  return (
  <div style={containerStyle}>
      
      {halaman === 'beranda' && (
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#10b981' }}>🌱 SMART FARMING</h2>
          <p>KSTM AL IHYA</p>
          <button style={{...btnStyle, backgroundColor: '#10b981'}} onClick={() => setHalaman('pakan')}>Atur Jadwal Pakan</button>
          <button style={{...btnStyle, backgroundColor: '#3b82f6'}} onClick={() => setHalaman('wifi')}>Pengaturan WiFi</button>
        </div>
      )}

      {/* --- HALAMAN PAKAN --- */}
      {halaman === 'pakan' && (
        <div>
          <h2>Jadwal Pakan</h2>
          <input style={inputStyle} type="number" placeholder="Jam Pagi" onChange={(e) => setData({...data, jamPagi: e.target.value})} />
          <input style={inputStyle} type="number" placeholder="Menit Pagi" onChange={(e) => setData({...data, menitPagi: e.target.value})} />
          <button style={{...btnStyle, backgroundColor: '#10b981'}} onClick={handleUpdatePakan}>Simpan Jadwal</button>
          <button style={{...btnStyle, backgroundColor: '#64748b'}} onClick={() => setHalaman('beranda')}>Kembali</button>
        <button onClick={() => setHalaman('beranda')}>Kembali</button>
        </div>
      )}

      {/* --- HALAMAN WIFI --- */}
      {halaman === 'wifi' && (
        <div>
          <h2>Pengaturan WiFi</h2>
          <input style={inputStyle} placeholder="SSID Baru" onChange={(e) => setWifi({...wifi, ssid: e.target.value})} />
          <input style={inputStyle} type="password" placeholder="Password Baru" onChange={(e) => setWifi({...wifi, pass: e.target.value})} />
          <button style={{...btnStyle, backgroundColor: '#3b82f6'}} onClick={handleUpdateWifi}>Simpan & Restart</button>
          <button style={{...btnStyle, backgroundColor: '#64748b'}} onClick={() => setHalaman('beranda')}>Kembali</button>
        <button onClick={() => setHalaman('beranda')}>Kembali</button>
        </div>
      )}
    </div>
);
}

export default App;