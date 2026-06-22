import React, { useState } from 'react';
import { supabase } from '../supabaseClient'; // Pastikan path benar

function MenuWifi({ kembali }) {
  const [ssid, setSsid] = useState('');
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);

  const simpanWifi = async () => {
    setLoading(true);
    // Mengupdate tabel jadwal_pakan kolom ssid & wifi_pass
    const { error } = await supabase
      .from('jadwal_pakan')
      .update({ 
        ssid: ssid, 
        wifi_pass: pass 
      })
      .eq('pengenal', 1);

    if (error) {
      alert("Gagal update WiFi: " + error.message);
    } else {
      alert("WiFi berhasil diupdate! ESP32 akan restart otomatis dalam beberapa detik.");
    }
    setLoading(false);
  };

  const styleInput = { width: '100%', padding: '10px', margin: '10px 0', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: 'white' };

  return (
    <div style={{ color: 'white' }}>
      <button onClick={kembali} style={{ background: 'transparent', color: '#94a3b8', border: 'none', cursor: 'pointer' }}>
        ← Kembali
      </button>
      <h2>Pengaturan WiFi</h2>
      <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Masukkan WiFi baru untuk ESP32</p>
      
      <input 
        placeholder="SSID WiFi Baru" 
        style={styleInput} 
        onChange={(e) => setSsid(e.target.value)} 
      />
      <input 
        type="password" 
        placeholder="Password WiFi Baru" 
        style={styleInput} 
        onChange={(e) => setPass(e.target.value)} 
      />
      
      <button 
        onClick={simpanWifi} 
        disabled={loading}
        style={{ width: '100%', padding: '15px', marginTop: '20px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}
      >
        {loading ? "Menyimpan..." : "SIMPAN & RESTART"}
      </button>
    </div>
  );
}

export default MenuWifi;