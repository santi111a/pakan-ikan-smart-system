import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

function App() {
  const [jamPagi, setJamPagi] = useState(0);
  const [jamSore, setJamSore] = useState(0);
  const [durasiPakan, setDurasiPakan] = useState(0);

  // Ambil data
  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase.from('jadwal_pakan').select('*').eq('id', 1).single();
      if (data) {
        setJamPagi(data.jam_pagi);
        setJamSore(data.jam_sore);
        setDurasiPakan(data.durasi_detik);
      }
    }
    fetchData();
  }, []);

  // Update data
  const handleUpdate = async () => {
    const { error } = await supabase
      .from('jadwal_pakan')
      .update({ jam_pagi: jamPagi, jam_sore: jamSore, durasi_detik: durasiPakan })
      .eq('id', 1);
    
    if (error) alert("Gagal: " + error.message);
    else alert("Berhasil diperbarui!");
  };

  return (
    <div style={{ padding: '20px', color: 'white', background: '#0f172a', minHeight: '100vh' }}>
      <h1>Pengaturan Pakan</h1>
      <input type="number" value={jamPagi} onChange={(e) => setJamPagi(e.target.value)} />
      <input type="number" value={jamSore} onChange={(e) => setJamSore(e.target.value)} />
      <input type="number" value={durasiPakan} onChange={(e) => setDurasiPakan(e.target.value)} />
      <button onClick={handleUpdate}>SIMPAN</button>
    </div>
  );
}

export default App; // <--- HANYA BOLEH ADA DI SINI, DI PALING BAWAH