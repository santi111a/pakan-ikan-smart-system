import React, { useState, useEffect } from 'react';
import { db } from './firebase'; 
import { ref, onValue, update, push } from "firebase/database";

function App() {
  const [halaman, setHalaman] = useState('beranda');
  
  // 1. STATE SISTEM UTAMA
  const [data, setData] = useState({
    Jadwal: 0, end_date: 0, jam_pagi: 0, menit_pagi: 0,
    jam_sore: 0, menit_sore: 0, durasi_detik: 0, kipas_on: false 
  });

  // 2. STATE HIDROPONIK
  const [hidroInput, setHidroInput] = useState({ 
    tglTanam: '', namaTanaman: '', pupuk: '', 
    hama: 'Aman', jumlahPanen: '', hargaJual: '' 
  });
  const [listHidro, setListHidro] = useState([]);

  // 3. STATE JURNAL IKAN & AIR
  const [jurnalInput, setJurnalInput] = useState({ tglBibit: '', jumlahIkan: '', ukuranBibit: '', tglSortir: '' });
  const [listJurnal, setListJurnal] = useState([]);
  const [airInput, setAirInput] = useState({ tglKuras: '', kondisiAir: '', keterangan: '' });
  const [listAir, setListAir] = useState([]);

  // --- LOGIKA PENGAMBILAN DATA (REALTIME) ---
  useEffect(() => {
    const dbRef = ref(db, '/'); 
    onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        const result = snapshot.val();
        setData(result);
        if (result.jurnal_harian) setListJurnal(Object.keys(result.jurnal_harian).map(key => ({ id: key, ...result.jurnal_harian[key] })).reverse());
        if (result.log_pengurasan) setListAir(Object.keys(result.log_pengurasan).map(key => ({ id: key, ...result.log_pengurasan[key] })).reverse());
        if (result.jurnal_hidroponik) setListHidro(Object.keys(result.jurnal_hidroponik).map(key => ({ id: key, ...result.jurnal_hidroponik[key] })).reverse());
      }
    });
  }, []);

  // --- FUNGSI SIMPAN ---
  const handleUpdate = () => {
    update(ref(db, '/'), { 
      ...data, 
      Jadwal: Number(data.Jadwal), 
      end_date: Number(data.end_date), 
      jam_pagi: Number(data.jam_pagi), 
      jam_sore: Number(data.jam_sore), 
      durasi_detik: Number(data.durasi_detik) 
    }).then(() => alert("✅ Data Diperbarui!"));
  };

  const handleSimpanHidro = () => {
    if (!hidroInput.tglTanam || !hidroInput.namaTanaman) return alert("Isi minimal Tanggal dan Nama!");
    const dataSiap = { ...hidroInput, hargaJual: Number(hidroInput.hargaJual || 0) };
    push(ref(db, 'jurnal_hidroponik'), dataSiap).then(() => {
      alert("✅ Data Hidroponik Berhasil!");
      setHidroInput({ tglTanam: '', namaTanaman: '', pupuk: '', hama: 'Aman', jumlahPanen: '', hargaJual: '' });
    });
  };

  const handleSimpanJurnal = () => {
    if (!jurnalInput.tglBibit || !jurnalInput.jumlahIkan) return alert("Isi data bibit!");
    push(ref(db, 'jurnal_harian'), jurnalInput).then(() => {
      alert("✅ Jurnal Berhasil!");
      setJurnalInput({ tglBibit: '', jumlahIkan: '', ukuranBibit: '', tglSortir: '' });
    });
  };

  const handleSimpanAir = () => {
    if (!airInput.tglKuras || !airInput.kondisiAir) return alert("Isi data air!");
    push(ref(db, 'log_pengurasan'), airInput).then(() => {
      alert("✅ Log Air Berhasil!");
      setAirInput({ tglKuras: '', kondisiAir: '', keterangan: '' });
    });
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0f172a', color: 'white' }}>
      {/* SIDEBAR */}
      <div style={{ width: '280px', padding: '30px', borderRight: '1px solid #1e293b' }}>
        <h2 style={{ color: '#38bdf8', marginBottom: '40px' }}>Sistem Cerdas Santi</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button onClick={() => setHalaman('beranda')} style={btnStyle(halaman === 'beranda')}>🏠 Beranda</button>
          <button onClick={() => setHalaman('pakan')} style={btnStyle(halaman === 'pakan')}>🐟 Pakan Pintar</button>
          <button onClick={() => setHalaman('log')} style={btnStyle(halaman === 'log')}>📝 Log Jurnal Ikan</button>
          <button onClick={() => setHalaman('air')} style={btnStyle(halaman === 'air')}>💧 Log Udara</button>
          <button onClick={() => setHalaman('hidroponik')} style={btnStyle(halaman === 'hidroponik')}>🌱 Hidroponik</button>
        </div>
      </div>

      {/* ISI KONTEN */}
      <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        
        {halaman === 'beranda' && (
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ color: '#38bdf8' }}>Halo, Selamat Datang! 👋</h1>
            <p>Manajemen Kolam Pintar Real-time.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '30px' }}>
               <div style={cardStyle}>
                  <h4 style={cardLabel}>JADWAL PAKAN PAGI</h4>
                  <h2 style={cardValue}>{String(data.jam_pagi).padStart(2, '0')}:{String(data.menit_pagi || 0).padStart(2, '0')}</h2>
               </div>
               <div style={cardStyle}>
                  <h4 style={cardLabel}>TANAMAN TERAKHIR</h4>
                  <h2 style={{...cardValue, fontSize: '20px'}}>{listHidro.length > 0 ? listHidro[0].namaTanaman : '-'}</h2>
               </div>
            </div>
          </div>
        )}

        {halaman === 'pakan' && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={formContainer}>
              <h2 style={{ color: '#38bdf8', textAlign: 'center', marginBottom: '20px' }}>Pengaturan Pakan</h2>
              <label style={labelStyle}>JAM PAGI</label>
              <input type="number" value={data.jam_pagi} onChange={(e) => setData({...data, jam_pagi: e.target.value})} style={inputStyle} />
              <label style={labelStyle}>DURASI (DETIK)</label>
              <input type="number" value={data.durasi_detik} onChange={(e) => setData({...data, durasi_detik: e.target.value})} style={inputStyle} />
              <button onClick={handleUpdate} style={updateBtnStyle}>UPDATE DATA</button>
            </div>
          </div>
        )}

        {halaman === 'hidroponik' && (
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h2 style={{ color: '#38bdf8', marginBottom: '25px' }}>🌱 Jurnal Budidaya Hidroponik</h2>
            <div style={jurnalBox}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                <div><label style={labelStyle}>TANGGAL TANAM</label><input type="date" value={hidroInput.tglTanam} onChange={(e) => setHidroInput({...hidroInput, tglTanam: e.target.value})} style={inputStyle} /></div>
                <div><label style={labelStyle}>NAMA TANAMAN</label><input type="text" value={hidroInput.namaTanaman} onChange={(e) => setHidroInput({...hidroInput, namaTanaman: e.target.value})} style={inputStyle} /></div>
                <div><label style={labelStyle}>PANEN (KG/IKAT)</label><input type="text" value={hidroInput.jumlahPanen} onChange={(e) => setHidroInput({...hidroInput, jumlahPanen: e.target.value})} style={inputStyle} /></div>
                <div><label style={labelStyle}>HARGA JUAL (RP)</label><input type="number" value={hidroInput.hargaJual} onChange={(e) => setHidroInput({...hidroInput, hargaJual: e.target.value})} style={inputStyle} /></div>
              </div>
              <button onClick={handleSimpanHidro} style={{...updateBtnStyle, background: '#10b981'}}>SIMPAN DATA TANAMAN</button>
            </div>

            <div style={historyBox}>
              <h4 style={{ textAlign: 'center', color: '#94a3b8', marginBottom: '15px' }}>Riwayat Hidroponik</h4>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #334155', color: '#38bdf8' }}>
                    <th style={thStyle}>Tanggal</th><th style={thStyle}>Tanaman</th><th style={thStyle}>Panen</th><th style={thStyle}>Harga</th><th style={thStyle}>Kondisi</th>
                  </tr>
                </thead>
                <tbody>
                  {listHidro.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #1e293b' }}>
                      <td style={tdStyle}>{item.tglTanam}</td>
                      <td style={tdStyle}>{item.namaTanaman}</td>
                      <td style={tdStyle}>{item.jumlahPanen || '-'}</td>
                      <td style={tdStyle}>{item.hargaJual ? `Rp ${Number(item.hargaJual).toLocaleString('id-ID')}` : '-'}</td>
                      <td style={tdStyle}>{item.hama}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* HALAMAN LAINNYA (Log Ikan & Air) tetap berfungsi seperti biasa */}
        {halaman === 'log' && (
           <div style={{ maxWidth: '900px', margin: '0 auto' }}>
              <h2 style={{ color: '#38bdf8', marginBottom: '25px' }}>📝 Log Ikan</h2>
              <div style={jurnalBox}>
                 <input type="date" value={jurnalInput.tglBibit} onChange={(e)=>setJurnalInput({...jurnalInput, tglBibit:e.target.value})} style={inputStyle} />
                 <button onClick={handleSimpanJurnal} style={updateBtnStyle}>SIMPAN JURNAL</button>
              </div>
           </div>
        )}
      </div>
    </div>
  );
}

// --- STYLES ---
const btnStyle = (aktif) => ({ background: aktif ? '#38bdf8' : '#1e293b', color: aktif ? '#0f172a' : '#94a3b8', border: 'none', padding: '14px', borderRadius: '12px', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold' });
const cardStyle = { background: '#1e293b', padding: '20px', borderRadius: '15px', border: '1px solid #334155' };
const cardLabel = { color: '#64748b', fontSize: '10px', marginBottom: '5px' };
const cardValue = { color: '#38bdf8', margin: 0 };
const formContainer = { background: '#1e293b', padding: '30px', borderRadius: '20px', width: '100%', maxWidth: '400px' };
const jurnalBox = { background: '#1e293b', padding: '30px', borderRadius: '20px', marginBottom: '30px' };
const historyBox = { background: '#1e293b', borderRadius: '20px', padding: '20px' };
const labelStyle = { display: 'block', fontSize: '11px', color: '#64748b', marginBottom: '5px', marginTop: '10px', fontWeight: 'bold' };
const inputStyle = { background: '#0f172a', border: '1px solid #334155', padding: '12px', borderRadius: '10px', color: '#38bdf8', width: '100%', outline: 'none' };
const updateBtnStyle = { width: '100%', background: '#22c55e', color: 'white', border: 'none', padding: '15px', borderRadius: '10px', marginTop: '20px', fontWeight: 'bold', cursor: 'pointer' };
const thStyle = { textAlign: 'left', padding: '12px', color: '#64748b' };
const tdStyle = { padding: '12px', color: '#cbd5e1' };

export default App;
