import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://tqfspwtaexpxlmflaskd.supabase.co', 'sb_publishable_QTf6sd3BIoxhRf7u67-1JA_lPiLm_EB');

function App() {
  const [halaman, setHalaman] = useState('beranda');
  const [data, setData] = useState({ tglMulai: 1, tglSelesai: 30, jamPagi: 8, menitPagi: 0, jamSore: 17, menitSore: 0, durasi: 5 });
  const [loading, setLoading] = useState(false);

  // Styling
  const containerStyle = { maxWidth: '400px', margin: '20px auto', padding: '20px', backgroundColor: '#1e293b', borderRadius: '20px', color: '#f1f5f9' };
  const inputStyle = { width: '100%', padding: '12px', borderRadius: '10px', backgroundColor: '#0f172a', color: '#fff', border: '1px solid #334155' };
  const buttonStyle = { width: '100%', padding: '15px', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '10px', marginTop: '10px', cursor: 'pointer' };

  return (
    <div style={containerStyle}>
      {halaman === 'beranda' ? (
        <div style={{ textAlign: 'center' }}>
          <h2>🌱 SMART FARMING</h2>
          <button style={buttonStyle} onClick={() => setHalaman('pakan')}>PENGATURAN PAKAN</button>
        </div>
      ) : (
        <div>
          <button style={{...buttonStyle, backgroundColor: '#475569'}} onClick={() => setHalaman('beranda')}>← KEMBALI</button>
          <h3 style={{ textAlign: 'center' }}>Pengaturan Pakan</h3>
          
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


     <div style={{ marginBottom: '20px' }}>
        <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 'bold' }}>JADWAL SORE</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input type="number" style={inputStyle} value={data.jamSore} onChange={(e) => setData({...data, jamSore: e.target.value})} />
          <span>:</span>
          <input type="number" style={inputStyle} value={data.menitSore} onChange={(e) => setData({...data, menitSore: e.target.value})} />
        </div>
      </div>

          
          <button style={buttonStyle} onClick={() => alert("Data Tersimpan!")}>SIMPAN DATA</button>
        </div>
      )}
    </div>
  );
}

export default App;