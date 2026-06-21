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
    <div style={{ padding: '20px', background: '#0f172a', minHeight: '100vh', color: 'white' }}>
      <h1>Pengaturan Pakan</h1>
      <input type="number" value={jamPagi} onChange={(e) => setJamPagi(e.target.value)} />
      <input type="number" value={jamSore} onChange={(e) => setJamSore(e.target.value)} />
      <input type="number" value={durasiPakan} onChange={(e) => setDurasiPakan(e.target.value)} />
      <button onClick={handleUpdate}>SIMPAN</button>
    </div>
  );
}

// Export diletakkan di paling bawah dan hanya satu kali
export default App;