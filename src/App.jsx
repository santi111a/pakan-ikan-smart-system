import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

function App() {
  const [jamPagi, setJamPagi] = useState(0);
  const [jamSore, setJamSore] = useState(0);
  const [durasiPakan, setDurasiPakan] = useState(0);

  // Fungsi untuk mengambil data dari Supabase
  useEffect(() => {
    async function fetchData() {
      // Pastikan nama tabel di sini sama persis dengan di Supabase: 'jadwal_pakan'
      const { data, error } = await supabase
        .from('jadwal_pakan')
        .select('*')
        .eq('id', 1)
        .single();
        
      if (data) {
        setJamPagi(data.jam_pagi);
        setJamSore(data.jam_sore);
        setDurasiPakan(data.durasi_detik);
      }
    }
    fetchData();
  }, []);

  // Fungsi untuk memperbarui data
  const handleUpdate = async () => {
    const { error } = await supabase
      .from('jadwal_pakan')
      .update({ 
        jam_pagi: parseInt(jamPagi), 
        jam_sore: parseInt(jamSore), 
        durasi_detik: parseInt(durasiPakan) 
      })
      .eq('id', 1);
    
    if (error) {
      alert("Gagal memperbarui: " + error.message);
    } else {
      alert("Berhasil diperbarui!");
    }
  };

  return (
    <div style={{ padding: '20px', color: 'white', background: '#0f172a', minHeight: '100vh', fontFamily: 'Arial' }}>
      <h1 style={{ textAlign: 'center' }}>Pengaturan Pakan</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px', margin: '0 auto' }}>
        <label>Jam Pagi:</label>
        <input type="number" value={jamPagi} onChange={(e) => setJamPagi(e.target.value)} style={{ padding: '8px' }} />
        
        <label>Jam Sore:</label>
        <input type="number" value={jamSore} onChange={(e) => setJamSore(e.target.value)} style={{ padding: '8px' }} />
        
        <label>Durasi (Detik):</label>
        <input type="number" value={durasiPakan} onChange={(e) => setDurasiPakan(e.target.value)} style={{ padding: '8px' }} />
        
        <button onClick={handleUpdate} style={{ padding: '10px', background: '#0ea5e9', color: 'white', border: 'none', cursor: 'pointer', marginTop: '10px' }}>
          SIMPAN PERUBAHAN
        </button>
      </div>
    </div>
  );
}

// Export diletakkan di paling bawah dan hanya satu kali
export default App;