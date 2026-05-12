import React, { useState, useEffect } from 'react';
import { db } from './firebase'; 
import { ref, onValue, push } from "firebase/database";

function App() {
  const [halaman, setHalaman] = useState('beranda');
  
  // 1. State untuk Form dan List Hidroponik
  const [hidroInput, setHidroInput] = useState({ 
    tglTanam: '', 
    namaTanaman: '', 
    jumlahPanen: '', 
    hargaJual: '' 
  });
  const [listHidro, setListHidro] = useState([]);

  // 2. Mengambil data dari Firebase secara Realtime
  useEffect(() => {
    const hidroRef = ref(db, 'jurnal_hidroponik');
    onValue(hidroRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Mengubah objek Firebase menjadi Array dan diurutkan dari yang terbaru
        const list = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        })).reverse();
        setListHidro(list);
      }
    });
  }, []);

  // 3. Fungsi Simpan Data
  const handleSimpanHidro = () => {
    if (!hidroInput.tglTanam || !hidroInput.namaTanaman) {
      return alert("Mohon isi Tanggal dan Nama Tanaman!");
    }

    push(ref(db, 'jurnal_hidroponik'), hidroInput)
      .then(() => {
        alert("✅ Data Hidroponik Berhasil Disimpan!");
        setHidroInput({ tglTanam: '', namaTanaman: '', jumlahPanen: '', hargaJual: '' });
      })
      .catch((error) => alert("Gagal menyimpan: " + error.message));
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: 'white', fontFamily: 'sans-serif' }}>
      
      {/* Header Utama */}
      <div style={headerStyle}>
        <h2 style={{ color: '#38bdf8', margin: 0 }}>Santi Smart System</h2>
      </div>

      <div style={{ padding: '20px' }}>
        
        {/* Tombol Navigasi Sederhana */}
        {halaman !== 'beranda' && (
          <button onClick={() => setHalaman('beranda')} style={backBtnStyle}>⬅ Kembali ke Dashboard</button>
        )}

        {/* Dashboard Menu */}
        {halaman === 'beranda' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', maxWidth: '400px', margin: '0 auto' }}>
            <div onClick={() => setHalaman('hidroponik')} style={menuCard}>
              <span style={{ fontSize: '40px' }}>🌱</span>
              <span style={{ fontWeight: 'bold', marginTop: '10px' }}>Jurnal Hidroponik</span>
              <small style={{ color: '#94a3b8' }}>{listHidro.length} Data Tercatat</small>
            </div>
            {/* Menu lainnya bisa ditambahkan di sini */}
          </div>
        )}

        {/* --- HALAMAN HIDROPONIK --- */}
        {halaman === 'hidroponik' && (
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h2 style={{ color: '#38bdf8', marginBottom: '20px' }}>🌱 Jurnal Hidroponik</h2>
            
            {/* Box Input */}
            <div style={jurnalBox}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px' }}>
                <div>
                  <label style={labelStyle}>TGL TANAM</label>
                  <input type="date" value={hidroInput.tglTanam} onChange={(e) => setHidroInput({...hidroInput, tglTanam: e.target.value})} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>NAMA TANAMAN</label>
                  <input type="text" placeholder="Misal: Selada" value={hidroInput.namaTanaman} onChange={(e) => setHidroInput({...hidroInput, namaTanaman: e.target.value})} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>PANEN (KG)</label>
                  <input type="text" placeholder="0" value={hidroInput.jumlahPanen} onChange={(e) => setHidroInput({...hidroInput, jumlahPanen: e.target.value})} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>HARGA JUAL</label>
                  <input type="number" placeholder="Rp" value={hidroInput.hargaJual} onChange={(e) => setHidroInput({...hidroInput, hargaJual: e.target.value})} style={inputStyle} />
                </div>
              </div>
              <button onClick={handleSimpanHidro} style={{...updateBtnStyle, background: '#10b981'}}>SIMPAN DATA HIDROPONIK</button>
            </div>

            {/* Tabel Riwayat */}
            <div style={historyBox}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={trHead}>
                    <th style={thStyle}>Tanggal</th>
                    <th style={thStyle}>Tanaman</th>
                    <th style={thStyle}>Panen</th>
                    <th style={thStyle}>Harga</th>
                  </tr>
                </thead>
                <tbody>
                  {listHidro.map((item) => (
                    <tr key={item.id} style={trBody}>
                      <td style={tdStyle}>{item.tglTanam}</td>
                      <td style={tdStyle}>{item.namaTanaman}</td>
                      <td style={tdStyle}>{item.jumlahPanen || '-'} Kg</td>
                      <td style={tdStyle}>
                        {item.hargaJual ? `Rp ${Number(item.hargaJual).toLocaleString('id-ID')}` : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// --- CSS IN JS STYLES ---
const headerStyle = { padding: '20px', borderBottom: '1px solid #1e293b', textAlign: 'center' };
const menuCard = { background: '#1e293b', padding: '30px', borderRadius: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', border: '1px solid #334155' };
const inputStyle = { background: '#0f172a', border: '1px solid #334155', padding: '12px', borderRadius: '8px', color: '#38bdf8', width: '100%', boxSizing: 'border-box' };
const labelStyle = { fontSize: '11px', color: '#64748b', fontWeight: 'bold', display: 'block', marginBottom: '5px' };
const updateBtnStyle = { width: '100%', color: 'white', border: 'none', padding: '14px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', marginTop: '20px' };
const backBtnStyle = { background: '#1e293b', border: 'none', color: '#38bdf8', padding: '10px 20px', borderRadius: '8px', marginBottom: '20px', cursor: 'pointer' };
const jurnalBox = { background: '#1e293b', padding: '20px', borderRadius: '15px', marginBottom: '20px' };
const historyBox = { background: '#1e293b', padding: '10px', borderRadius: '15px', overflowX: 'auto' };
const trHead = { borderBottom: '2px solid #334155', textAlign: 'left' };
const thStyle = { padding: '12px', color: '#94a3b8', fontSize: '12px' };
const trBody = { borderBottom: '1px solid #334155' };
const tdStyle = { padding: '12px', fontSize: '14px' };

export default App;