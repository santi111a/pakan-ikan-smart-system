import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

function App() {
  const [halaman, setHalaman] = useState('beranda');
  const [data, setData] = useState({ 
    jam_pagi: 0, menit_pagi: 0, jam_sore: 0, menit_sore: 0, durasi_detik: 0, kipas_status: 0 
  });
  
  // State untuk input
  const [jamPagi, setJamPagi] = useState(0);
  const [durasiPakan, setDurasiPakan] = useState(0);

  // Ambil data
  useEffect(() => {
    const fetchData = async () => {
      const { data: config } = await supabase.from('jadwal_pakan').select('*').eq('id', 1).single();
      if (config) setData(config);
    };
    fetchData();
  }, []);

  // Fungsi Update Pakan
  const handleUpdatePakan = async () => {
    try {
      const { error } = await supabase
        .from('jadwal_pakan')
        .update({
          jam_pagi: jamPagi,
          durasi_detik: durasiPakan
        })
        .eq('id', 1);

      if (error) throw error;
      alert("✅ Pengaturan Pakan Diperbarui!");
      window.location.reload();
    } catch (err) {
      console.error("Error Detail:", err);
      alert("❌ Gagal memperbarui: " + err.message);
    }
  };

  return (
    <div className="App">
      <header style={headerStyle}>
        <h1>Smart Farming</h1>
      </header>
      
      <div style={dashboardContainer}>
        {/* Contoh elemen UI */}
        <div style={formContainer}>
          <label style={labelStyle}>DURASI PAKAN (DETIK)</label>
          <input 
            style={inputStyle} 
            type="number" 
            value={durasiPakan} 
            onChange={(e) => setDurasiPakan(e.target.value)} 
          />
          <button style={updateBtnStyle} onClick={handleUpdatePakan}>
            PEMBARUAN JADWAL
          </button>
        </div>
      </div>
    </div>
  );
}

// --- CSS-IN-JS STYLES (Di luar fungsi App) ---
const headerStyle = { padding: '20px', background: '#0f172a', textAlign: 'center' };
const dashboardContainer = { maxWidth: '500px', margin: '0 auto' };
const formContainer = { background: '#1e293b', padding: '25px', borderRadius: '20px' };
const inputStyle = { background: '#0f172a', border: '1px solid #334155', padding: '12px', width: '100%', color: 'white' };
const labelStyle = { fontSize: '11px', color: '#64748b' };
const updateBtnStyle = { width: '100%', background: '#0ea5e9', padding: '14px', border: 'none', borderRadius: '10px', color: 'white', cursor: 'pointer' };

export default App;