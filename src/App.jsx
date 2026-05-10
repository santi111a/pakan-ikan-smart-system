import React, { useState, useEffect } from 'react';
import { db } from './firebase'; 
import { ref, onValue, update, push } from "firebase/database";

function App() {
  const [halaman, setHalaman] = useState('beranda');
  
  // STATE DATA
  const [data, setData] = useState({
    Jadwal: 0, end_date: 0, jam_pagi: 0, menit_pagi: 0,
    jam_sore: 0, menit_sore: 0, durasi_detik: 0
  });

  const [hidroInput, setHidroInput] = useState({ tglTanam: '', namaTanaman: '', panen: '', harga: '' });
  const [listHidro, setListHidro] = useState([]);
  const [jurnalInput, setJurnalInput] = useState({ tglBibit: '', jumlah: '', ukuran: '', tglSortir: '' });
  const [listJurnal, setListJurnal] = useState([]);
  const [airInput, setAirInput] = useState({ tglKuras: '', kondisi: '', ket: '' });
  const [listAir, setListAir] = useState([]);

  useEffect(() => {
    onValue(ref(db, '/'), (snapshot) => {
      if (snapshot.exists()) {
        const res = snapshot.val();
        setData(res);
        if (res.jurnal_harian) setListJurnal(Object.keys(res.jurnal_harian).map(k => ({ id: k, ...res.jurnal_harian[k] })).reverse());
        if (res.log_pengurasan) setListAir(Object.keys(res.log_pengurasan).map(k => ({ id: k, ...res.log_pengurasan[k] })).reverse());
        if (res.jurnal_hidroponik) setListHidro(Object.keys(res.jurnal_hidroponik).map(k => ({ id: k, ...res.jurnal_hidroponik[k] })).reverse());
      }
    });
  }, []);

  // FUNGSI SIMPAN GLOBAL
  const handleSimpan = (path, input, setInput, msg) => {
    push(ref(db, path), input).then(() => {
      alert(`✅ ${msg} Berhasil Disimpan!`);
      const reset = Object.keys(input).reduce((acc, curr) => ({ ...acc, [curr]: '' }), {});
      setInput(reset);
    });
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0b1120', color: 'white', fontFamily: 'sans-serif' }}>
      
      {/* SIDEBAR FIXED */}
      <div style={{ width: '260px', padding: '25px', background: '#0f172a', borderRight: '1px solid #1e293b', position: 'fixed', height: '100vh' }}>
        <h2 style={{ color: '#38bdf8', textAlign: 'center', marginBottom: '30px', fontSize: '20px' }}>Sistem Cerdas Santi</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button onClick={() => setHalaman('beranda')} style={navBtn(halaman === 'beranda')}>🏠 Beranda</button>
          <button onClick={() => setHalaman('pakan')} style={navBtn(halaman === 'pakan')}>🐟 Pakan Pintar</button>
          <button onClick={() => setHalaman('log')} style={navBtn(halaman === 'log')}>📝 Log Jurnal Ikan</button>
          <button onClick={() => setHalaman('air')} style={navBtn(halaman === 'air')}>💧 Log Air</button>
          <button onClick={() => setHalaman('hidroponik')} style={navBtn(halaman === 'hidroponik')}>🌱 Hidroponik</button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div style={{ flex: 1, padding: '40px', marginLeft: '260px' }}>
        
        {/* BERANDA */}
        {halaman === 'beranda' && (
          <div style={{ textAlign: 'center', marginTop: '100px' }}>
            <h1 style={{ color: '#38bdf8', fontSize: '32px' }}>Selamat Datang! 👋</h1>
            <p style={{ color: '#94a3b8' }}>Monitoring Sistem Kolam & Hidroponik Real-time.</p>
          </div>
        )}

        {/* JURNAL IKAN */}
        {halaman === 'log' && (
          <div style={containerStyle}>
            <h2 style={judulStyle}>📝 Jurnal Budidaya Ikan</h2>
            <div style={cardStyle}>
              <div style={gridStyle}>
                <div><label style={labelStyle}>TANGGAL BIBIT</label><input type="date" value={jurnalInput.tglBibit} onChange={e=>setJurnalInput({...jurnalInput, tglBibit:e.target.value})} style={inputStyle}/></div>
                <div><label style={labelStyle}>JUMLAH (EKOR)</label><input type="number" placeholder="500" value={jurnalInput.jumlah} onChange={e=>setJurnalInput({...jurnalInput, jumlah:e.target.value})} style={inputStyle}/></div>
                <div><label style={labelStyle}>UKURAN (CM)</label><input type="text" placeholder="5-7" value={jurnalInput.ukuran} onChange={e=>setJurnalInput({...jurnalInput, ukuran:e.target.value})} style={inputStyle}/></div>
                <div><label style={labelStyle}>TGL SORTIR</label><input type="date" value={jurnalInput.tglSortir} onChange={e=>setJurnalInput({...jurnalInput, tglSortir:e.target.value})} style={inputStyle}/></div>
              </div>
              <button onClick={() => handleSimpan('jurnal_harian', jurnalInput, setJurnalInput, 'Data Ikan')} style={btnSimpan}>SIMPAN DATA IKAN</button>
            </div>

            <div style={cardStyle}>
              <h3 style={subJudul}>Riwayat Budidaya</h3>
              <table style={tabelStyle}>
                <thead><tr style={trHead}><th style={thStyle}>Tanggal</th><th style={thStyle}>Jumlah</th><th style={thStyle}>Ukuran</th><th style={thStyle}>Sortir</th></tr></thead>
                <tbody>{listJurnal.map(i=>(<tr key={i.id} style={trBody}><td style={tdStyle}>{i.tglBibit}</td><td style={tdStyle}>{i.jumlah}</td><td style={tdStyle}>{i.ukuran} cm</td><td style={tdStyle}>{i.tglSortir}</td></tr>))}</tbody>
              </table>
            </div>
          </div>
        )}

        {/* LOG AIR */}
        {halaman === 'air' && (
          <div style={containerStyle}>
            <h2 style={judulStyle}>💧 Log Pengurasan Air</h2>
            <div style={cardStyle}>
              <div style={gridStyle}>
                <div><label style={labelStyle}>TANGGAL KURAS</label><input type="date" value={airInput.tglKuras} onChange={e=>setAirInput({...airInput, tglKuras:e.target.value})} style={inputStyle}/></div>
                <div><label style={labelStyle}>KONDISI AIR</label><input type="text" placeholder="Keruh / Hijau" value={airInput.kondisi} onChange={e=>setAirInput({...airInput, kondisi:e.target.value})} style={inputStyle}/></div>
              </div>
              <div style={{marginTop: '15px'}}><label style={labelStyle}>KETERANGAN</label><input type="text" placeholder="Ganti 50% air" value={airInput.ket} onChange={e=>setAirInput({...airInput, ket:e.target.value})} style={inputStyle}/></div>
              <button onClick={() => handleSimpan('log_pengurasan', airInput, setAirInput, 'Data Air')} style={btnSimpan}>SIMPAN DATA AIR</button>
            </div>

            <div style={cardStyle}>
              <h3 style={subJudul}>Riwayat Pengurasan</h3>
              <table style={tabelStyle}>
                <thead><tr style={trHead}><th style={thStyle}>Tanggal</th><th style={thStyle}>Kondisi</th><th style={thStyle}>Keterangan</th></tr></thead>
                <tbody>{listAir.map(i=>(<tr key={i.id} style={trBody}><td style={tdStyle}>{i.tglKuras}</td><td style={tdStyle}>{i.kondisi}</td><td style={tdStyle}>{i.ket || '-'}</td></tr>))}</tbody>
              </table>
            </div>
          </div>
        )}

        {/* HIDROPONIK */}
        {halaman === 'hidroponik' && (
          <div style={containerStyle}>
            <h2 style={judulStyle}>🌱 Jurnal Hidroponik</h2>
            <div style={cardStyle}>
              <div style={gridStyle}>
                <div><label style={labelStyle}>TGL TANAM</label><input type="date" value={hidroInput.tglTanam} onChange={e=>setHidroInput({...hidroInput, tglTanam:e.target.value})} style={inputStyle}/></div>
                <div><label style={labelStyle}>NAMA TANAMAN</label><input type="text" value={hidroInput.namaTanaman} onChange={e=>setHidroInput({...hidroInput, namaTanaman:e.target.value})} style={inputStyle}/></div>
                <div><label style={labelStyle}>PANEN (KG)</label><input type="text" value={hidroInput.panen} onChange={e=>setHidroInput({...hidroInput, panen:e.target.value})} style={inputStyle}/></div>
                <div><label style={labelStyle}>HARGA JUAL</label><input type="number" value={hidroInput.harga} onChange={e=>setHidroInput({...hidroInput, harga:e.target.value})} style={inputStyle}/></div>
              </div>
              <button onClick={() => handleSimpan('jurnal_hidroponik', hidroInput, setHidroInput, 'Data Hidroponik')} style={{...btnSimpan, background: '#10b981'}}>SIMPAN DATA HIDROPONIK</button>
            </div>

            <div style={cardStyle}>
              <table style={tabelStyle}>
                <thead><tr style={trHead}><th style={thStyle}>Tanggal</th><th style={thStyle}>Tanaman</th><th style={thStyle}>Hasil</th><th style={thStyle}>Harga</th></tr></thead>
                <tbody>{listHidro.map(i=>(<tr key={i.id} style={trBody}><td style={tdStyle}>{i.tglTanam}</td><td style={tdStyle}>{i.namaTanaman}</td><td style={tdStyle}>{i.panen}</td><td style={tdStyle}>{i.harga}</td></tr>))}</tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// --- CSS-IN-JS STYLING YANG RAPI ---
const navBtn = (aktif) => ({
  width: '100%',
  background: aktif ? '#38bdf8' : 'transparent',
  color: aktif ? '#0f172a' : '#94a3b8',
  border: 'none',
  padding: '12px 15px',
  borderRadius: '8px',
  cursor: 'pointer',
  textAlign: 'left',
  fontWeight: 'bold',
  transition: '0.3s'
});

const containerStyle = { maxWidth: '800px', margin: '0 auto' };
const judulStyle = { color: '#38bdf8', marginBottom: '25px', textAlign: 'center', fontSize: '24px' };
const subJudul = { fontSize: '16px', color: '#94a3b8', marginBottom: '15px', textAlign: 'center' };
const cardStyle = { background: '#1e293b', padding: '25px', borderRadius: '15px', border: '1px solid #334155', marginBottom: '25px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' };
const gridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' };
const labelStyle = { display: 'block', fontSize: '11px', color: '#64748b', marginBottom: '8px', fontWeight: '800', letterSpacing: '0.5px' };
const inputStyle = { width: '100%', background: '#0f172a', border: '1px solid #334155', padding: '12px', borderRadius: '10px', color: '#38bdf8', fontSize: '14px', outline: 'none' };
const btnSimpan = { width: '100%', background: '#0284c7', color: 'white', border: 'none', padding: '14px', borderRadius: '10px', marginTop: '20px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' };

const tabelStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '10px' };
const thStyle = { textAlign: 'left', padding: '12px', color: '#38bdf8', fontSize: '12px', borderBottom: '2px solid #334155', textTransform: 'uppercase' };
const tdStyle = { padding: '12px', fontSize: '14px', color: '#cbd5e1', borderBottom: '1px solid #1e293b' };
const trHead = { background: 'transparent' };
const trBody = { transition: '0.2s' };

export default App;