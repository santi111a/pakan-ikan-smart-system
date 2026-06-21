import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Ganti dengan URL dan KEY Supabase Anda
const supabase = createClient('https://tqfspwtaexpxlmflaskd.supabase.coL', 'sb_publishable_QTf6sd3BIoxhRf7u67-1JA_lPiLm_EB');

function App() {
  const [loading, setLoading] = useState(true);
  const [tglMulai, setTglMulai] = useState(0);
  const [tglSelesai, setTglSelesai] = useState(0);
  const [jamPagi, setJamPagi] = useState(0);
  const [menitPagi, setMenitPagi] = useState(0);
  const [jamSore, setJamSore] = useState(0);
  const [menitSore, setMenitSore] = useState(0);
  const [durasi, setDurasi] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data, error } = await supabase
      .from('jadwal_pakan')
      .select('*')
      .eq('pengenal', 1)
      .single();

    if (data) {
      setTglMulai(data.tgl_mulai);
      setTglSelesai(data.tgl_selesai);
      setJamPagi(data.jam_pagi);
      setMenitPagi(data.menit_pagi);
      setJamSore(data.jam_sore);
      setMenitSore(data.menit_sore);
      setDurasi(data.durasi_detik);
    }
    setLoading(false);
  };

  const handleUpdate = async () => {
    setLoading(true);
    const { error } = await supabase
      .from('jadwal_pakan')
      .update({
        tgl_mulai: parseInt(tglMulai),
        tgl_selesai: parseInt(tglSelesai),
        jam_pagi: parseInt(jamPagi),
        menit_pagi: parseInt(menitPagi),
        jam_sore: parseInt(jamSore),
        menit_sore: parseInt(menitSore),
        durasi_detik: parseInt(durasi)
      })
      .eq('pengenal', 1);

    if (error) alert("Gagal: " + error.message);
    else alert("Data berhasil diperbarui!");
    setLoading(false);
  };

  if (loading) return <div>Memuat data...</div>;

  return (
    <div style={{ padding: '20px', backgroundColor: '#0f172a', color: 'white', minHeight: '100vh' }}>
      <h1>Pengaturan Pakan</h1>
      
      <label>RENTANG TANGGAL (MULAI - SELESAI)</label>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <input type="number" value={tglMulai} onChange={(e) => setTglMulai(e.target.value)} />
        <input type="number" value={tglSelesai} onChange={(e) => setTglSelesai(e.target.value)} />
      </div>

      <label>JADWAL PAGI (JAM : MENIT)</label>
      <div style={{ display: 'flex', gap: '5px', marginBottom: '15px' }}>
        <input type="number" value={jamPagi} onChange={(e) => setJamPagi(e.target.value)} />
        <span>:</span>
        <input type="number" value={menitPagi} onChange={(e) => setMenitPagi(e.target.value)} />
      </div>

      <label>JADWAL SORE (JAM : MENIT)</label>
      <div style={{ display: 'flex', gap: '5px', marginBottom: '15px' }}>
        <input type="number" value={jamSore} onChange={(e) => setJamSore(e.target.value)} />
        <span>:</span>
        <input type="number" value={menitSore} onChange={(e) => setMenitSore(e.target.value)} />
      </div>

      <label>DURASI PAKAN (DETIK)</label>
      <input type="number" value={durasi} onChange={(e) => setDurasi(e.target.value)} style={{ display: 'block', marginBottom: '20px' }} />

      <button onClick={handleUpdate} style={{ padding: '10px 20px', backgroundColor: '#0ea5e9', border: 'none', color: 'white', cursor: 'pointer' }}>
        PERBARUI DATA & AKTIFKAN
      </button>
    </div>
  );
}

export default App;