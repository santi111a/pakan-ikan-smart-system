import React from 'react';

function MenuPakan({ data, setData, handleUpdate, kembali }) {
  // Gunakan style yang sudah Anda buat di App.jsx tadi
  const inputStyle = { width: '100%', padding: '12px', border: '1px solid #334155', borderRadius: '10px', fontSize: '1.1rem', boxSizing: 'border-box', backgroundColor: '#0f172a', color: '#fff' };
  
  return (
    <div>
      <button onClick={kembali} style={{ marginBottom: '10px' }}>← Kembali</button>
      <h2>Atur Jadwal Pakan</h2>
      {/* Pindahkan semua input dari App.jsx ke sini */}
      <div style={{ marginBottom: '20px' }}>
         <label>JADWAL PAGI</label>
         <div style={{ display: 'flex', gap: '10px' }}>
           <input type="number" style={inputStyle} value={data.jamPagi} onChange={(e) => setData({...data, jamPagi: e.target.value})} />
           <input type="number" style={inputStyle} value={data.menitPagi} onChange={(e) => setData({...data, menitPagi: e.target.value})} />
         </div>
      </div>
      {/* ... tambahkan input lainnya (Sore, Durasi) ... */}
      <button onClick={handleUpdate}>SIMPAN PENGATURAN</button>
    </div>
  );
}
export default MenuPakan;