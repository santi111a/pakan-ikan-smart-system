
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

  const containerStyle = { 
  fontFamily: "'Segoe UI', sans-serif", 
  maxWidth: '400px', 
  margin: '0 auto', 
  padding: '30px', 
  backgroundColor: '#1e293b', // Warna kotak menu
  borderRadius: '20px', 
  boxShadow: '0 20px 40px rgba(0,0,0,0.3)', 
  color: '#f1f5f9' // Warna teks putih/abu terang
};
  
  const inputStyle = { width: '100%', padding: '12px', border: '1px solid #334155', borderRadius: '10px', fontSize: '1.1rem', boxSizing: 'border-box', backgroundColor: '#0f172a', color: '#fff' };
  const buttonStyle = { width: '100%', padding: '15px', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '20px' };
   const navButtonStyle = (page) => ({ 
    flex: 1, 
    padding: '10px', 
    backgroundColor: activePage === page ? '#10b981' : '#334155', 
    color: 'white', 
    border: 'none', 
    borderRadius: '10px', 
    cursor: 'pointer' 
  });
  
  if (loading) return <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Memuat...</div>;

  return (
<div style={containerStyle}>
      {/* HEADER */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2 style={{ margin: '0', color: '#10b981' }}>🌱 SMART FARMING</h2>
        <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>KSTM AL IHYA</p>
      </div>

      {/* MENU NAVIGASI */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
        <button style={navButtonStyle('beranda')} onClick={() => setActivePage('beranda')}>BERANDA</button>
        <button style={navButtonStyle('pengaturan')} onClick={() => setActivePage('pengaturan')}>PENGATURAN</button>
      </div>

      {/* KONTEN BERDASARKAN HALAMAN */}
      {activePage === 'beranda' ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <h3 style={{ color: '#fff' }}>Selamat Datang!</h3>
          <p style={{ color: '#94a3b8' }}>Sistem pemberi pakan otomatis Anda dalam kondisi siap beroperasi.</p>
          <div style={{ fontSize: '50px', marginTop: '20px' }}>✅</div>
        </div>
      ) : (
        /* KODINGAN LAMA ANDA DI BAWAH INI */
    <div>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2 style={{ margin: '0', color: '#10b981' }}>🌱 SMART FARMING</h2>
        <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>KSTM AL IHYA</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 'bold' }}>RENTANG TANGGAL</label>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input type="number" style={inputStyle} value={data.tglMulai} onChange={(e) => setData({...data, tglMulai: e.target.value})} />
          <input type="number" style={inputStyle} value={data.tglSelesai} onChange={(e) => setData({...data, tglSelesai: e.target.value})} />
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 'bold' }}>JADWAL PAGI</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input type="number" style={inputStyle} value={data.jamPagi} onChange={(e) => setData({...data, jamPagi: e.target.value})} />
          <span>:</span>
          <input type="number" style={inputStyle} value={data.menitPagi} onChange={(e) => setData({...data, menitPagi: e.target.value})} />
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 'bold' }}>JADWAL SORE</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input type="number" style={inputStyle} value={data.jamSore} onChange={(e) => setData({...data, jamSore: e.target.value})} />
          <span>:</span>
          <input type="number" style={inputStyle} value={data.menitSore} onChange={(e) => setData({...data, menitSore: e.target.value})} />
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 'bold' }}>DURASI (DETIK)</label>
        <input type="number" style={inputStyle} value={data.durasi} onChange={(e) => setData({...data, durasi: e.target.value})} />
      </div>
      <button style={buttonStyle} onClick={handleUpdate}>SIMPAN PENGATURAN</button>
    </div>
      )}
      </div>
  );
}

export default App;
