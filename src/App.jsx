
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://tqfspwtaexpxlmflaskd.supabase.co', 'sb_publishable_QTf6sd3BIoxhRf7u67-1JA_lPiLm_EB');

function App() {
  const [activePage, setActivePage] = useState('beranda');
  const [data, setData] = useState({
    tglMulai: 1, tglSelesai: 30, 
    jamPagi: 8, menitPagi: 0, 
    jamSore: 17, menitSore: 0, 
    durasi: 5
  });
  const [loading, setLoading] = useState(true);

  // Efek untuk mengubah warna latar belakang seluruh halaman
  useEffect(() => {
  document.body.style.backgroundColor = '#0f172a';
  document.body.style.margin = '0';
  document.body.style.padding = '20px';
  document.body.style.minHeight = '100vh';
  fetchData();
}, []);

  const fetchData = async () => {
    const { data: dbData } = await supabase
      .from('jadwal_pakan')
      .select('*')
      .eq('pengenal', 1)
      .single();

    if (dbData) {
      setData({
        tglMulai: dbData.tgl_mulai, tglSelesai: dbData.tgl_selesai,
        jamPagi: dbData.jam_pagi, menitPagi: dbData.menit_pagi,
        jamSore: dbData.jam_sore, menitSore: dbData.menit_sore,
        durasi: dbData.durasi_detik
      });
    }
    setLoading(false);
  };

  const handleUpdate = async () => {
  setLoading(true);
  // Kita update langsung ke baris dengan pengenal: 1
  const { error } = await supabase
    .from('jadwal_pakan')
    .update({
      jam_pagi: parseInt(data.jamPagi),
      menit_pagi: parseInt(data.menitPagi),
      jam_sore: parseInt(data.jamSore),
      menit_sore: parseInt(data.menitSore),
      durasi_detik: parseInt(data.durasi)
    })
    .eq('pengenal', 1); // <--- KUNCI: Harus sama dengan di Arduino

  if (error) {
    alert("Gagal update: " + error.message);
  } else {
    alert("Data berhasil dikirim ke alat!");
  }
  setLoading(false);
};

  const containerStyle = { fontFamily: "'Segoe UI', sans-serif", maxWidth: '400px', margin: '0 auto', padding: '30px', backgroundColor: '#1e293b', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', color: '#f1f5f9' };
  const inputStyle = { width: '100%', padding: '12px', border: '1px solid #334155', borderRadius: '10px', fontSize: '1.1rem', backgroundColor: '#0f172a', color: '#fff', boxSizing: 'border-box' };
  const buttonStyle = { width: '100%', padding: '15px', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' };
  const menuCardStyle = { padding: '20px', backgroundColor: '#334155', borderRadius: '15px', cursor: 'pointer', textAlign: 'center', transition: '0.3s' };
  
  if (loading) return <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Memuat...</div>;

  return (
<div style={containerStyle}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2 style={{ margin: '0', color: '#10b981' }}>🌱 SMART FARMING</h2>
        <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>KSTM AL IHYA</p>
      </div>

 {/* KONDISI HALAMAN */}
{activePage === 'beranda' ? (
  /* HALAMAN BERANDA */
  <div style={{ textAlign: 'center' }}>
    {/* INI MENU YANG MENUJU KE PENGATURAN */}
    <div style={menuCardStyle} onClick={() => setActivePage('pengaturan')}>
      <div style={{ fontSize: '30px' }}>🥣</div>
      <div style={{ fontWeight: 'bold', marginTop: '10px' }}>MENU PAKAN</div>
      <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Atur jadwal & durasi</div>
    </div>
  </div>
) : (
  
  /* HALAMAN PENGATURAN (DI DALAM KOTAK) */
 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
  
  {/* Tombol Kembali di atas kotak */}
  <button 
    style={{ ...buttonStyle, marginBottom: '20px', width: 'auto', padding: '8px 20px' }} 
    onClick={() => setActivePage('beranda')}
  >
    ← Kembali ke Menu
  </button>
          
  {/* KOTAK UTAMA */}
  <div style={{ 
    backgroundColor: '#1E293B', 
    padding: '30px', 
    borderRadius: '16px', 
    width: '90%', 
    maxWidth: '400px',
    textAlign: 'center',
    color: '#38BDF8' // Warna biru muda sesuai gambar
  }}>
    <h2 style={{ marginBottom: '25px' }}>Pengaturan Pakan</h2>
     
      {/* Rentang Tanggal */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 'bold' }}>RENTANG TANGGAL</label>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input type="number" style={inputStyle} value={data.tglMulai} onChange={(e) => setData({...data, tglMulai: e.target.value})} />
          <input type="number" style={inputStyle} value={data.tglSelesai} onChange={(e) => setData({...data, tglSelesai: e.target.value})} />
        </div>
      </div>

    {/* Jadwal Pagi */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 'bold' }}>JADWAL PAGI</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input type="number" style={inputStyle} value={data.jamPagi} onChange={(e) => setData({...data, jamPagi: e.target.value})} />
          <span>:</span>
          <input type="number" style={inputStyle} value={data.menitPagi} onChange={(e) => setData({...data, menitPagi: e.target.value})} />
        </div>
      </div>


      {/* Jadwal Sore */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 'bold' }}>JADWAL SORE</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input type="number" style={inputStyle} value={data.jamSore} onChange={(e) => setData({...data, jamSore: e.target.value})} />
          <span>:</span>
          <input type="number" style={inputStyle} value={data.menitSore} onChange={(e) => setData({...data, menitSore: e.target.value})} />
        </div>
      </div>


      {/* Durasi */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 'bold' }}>DURASI (DETIK)</label>
        <input type="number" style={inputStyle} value={data.durasi} onChange={(e) => setData({...data, durasi: e.target.value})} />
      </div>

      <button style={buttonStyle} onClick={handleUpdate}>PERBARUI DATA & AKTIFKAN</button>
    </div>
      </div>
)};
</div>
  )
};
export default App;
