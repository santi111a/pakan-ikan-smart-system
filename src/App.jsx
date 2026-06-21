import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Pastikan URL dan KEY benar
const supabase = createClient('https://tqfspwtaexpxlmflaskd.supabase.co', 'sb_publishable_key_anda');

function App() {
  const [data, setData] = useState({
    tglMulai: 1, tglSelesai: 30, 
    jamPagi: 8, menitPagi: 0, 
    jamSore: 17, menitSore: 0, 
    durasi: 5
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: dbData, error } = await supabase
      .from('jadwal_pakan')
      .select('*')
      .eq('pengenal', 1)
      .single();

    if (dbData) {
      setData({
        tglMulai: dbData.tgl_mulai,
        tglSelesai: dbData.tgl_selesai,
        jamPagi: dbData.jam_pagi,
        menitPagi: dbData.menit_pagi,
        jamSore: dbData.jam_sore,
        menitSore: dbData.menit_sore,
        durasi: dbData.durasi_detik
      });
    }
    setLoading(false);
  };

  const handleUpdate = async () => {
    setLoading(true);
    const { error } = await supabase
      .from('jadwal_pakan')
      .update({
        tgl_mulai: parseInt(data.tglMulai),
        tgl_selesai: parseInt(data.tglSelesai),
        jam_pagi: parseInt(data.jamPagi),
        menit_pagi: parseInt(data.menitPagi),
        jam_sore: parseInt(data.jamSore),
        menit_sore: parseInt(data.menitSore),
        durasi_detik: parseInt(data.durasi)
      })
      .eq('pengenal', 1);

    if (error) alert("Gagal: " + error.message);
    else alert("Data berhasil diperbarui!");
    setLoading(false);
  };

  // Styling (tetap sama)
  const containerStyle = { fontFamily: 'sans-serif', maxWidth: '400px', margin: '40px auto', padding: '30px', backgroundColor: '#ffffff', borderRadius: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' };
  const inputGroupStyle = { marginBottom: '20px' };
  const labelStyle = { display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: '#64748b', fontWeight: 'bold' };
  const inputStyle = { width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem', boxSizing: 'border-box' };
  const buttonStyle = { width: '100%', padding: '15px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Memuat data...</div>;

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: 'center', marginBottom: '25px', color: '#1e293b' }}>⚙️ Pengaturan Pakan</h2>
      
      <div style={inputGroupStyle}>
        <label style={labelStyle}>RENTANG TANGGAL (MULAI - SELESAI)</label>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input type="number" style={inputStyle} value={data.tglMulai} onChange={(e) => setData({...data, tglMulai: e.target.value})} />
          <input type="number" style={inputStyle} value={data.tglSelesai} onChange={(e) => setData({...data, tglSelesai: e.target.value})} />
        </div>
      </div>

      <div style={inputGroupStyle}>
        <label style={labelStyle}>JADWAL PAGI (HH : MM)</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input type="number" style={inputStyle} value={data.jamPagi} onChange={(e) => setData({...data, jamPagi: e.target.value})} />
          <span style={{ fontWeight: 'bold' }}>:</span>
          <input type="number" style={inputStyle} value={data.menitPagi} onChange={(e) => setData({...data, menitPagi: e.target.value})} />
        </div>
      </div>

      <div style={inputGroupStyle}>
        <label style={labelStyle}>JADWAL SORE (HH : MM)</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input type="number" style={inputStyle} value={data.jamSore} onChange={(e) => setData({...data, jamSore: e.target.value})} />
          <span style={{ fontWeight: 'bold' }}>:</span>
          <input type="number" style={inputStyle} value={data.menitSore} onChange={(e) => setData({...data, menitSore: e.target.value})} />
        </div>
      </div>

      <div style={inputGroupStyle}>
        <label style={labelStyle}>DURASI PAKAN (DETIK)</label>
        <input type="number" style={inputStyle} value={data.durasi} onChange={(e) => setData({...data, durasi: e.target.value})} />
      </div>

      <button style={buttonStyle} onClick={handleUpdate} disabled={loading}>
        {loading ? 'Menyimpan...' : 'SIMPAN PENGATURAN'}
      </button>
    </div>
  );
}
export default App;