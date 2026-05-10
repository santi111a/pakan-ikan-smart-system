import React, { useState, useEffect } from 'react';
import { db } from './firebase'; 
import { ref, onValue, update, push } from "firebase/database";

function App() {
  const [halaman, setHalaman] = useState('beranda');
  
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

  const handleSimpanJurnal = () => {
    push(ref(db, 'jurnal_harian'), jurnalInput).then(() => {
      alert("✅ Data Ikan Tersimpan!");
      setJurnalInput({ tglBibit: '', jumlah: '', ukuran: '', tglSortir: '' });
    });
  };

  const handleSimpanAir = () => {
    push(ref(db, 'log_pengurasan'), airInput).then(() => {
      alert("✅ Data Air Tersimpan!");
      setAirInput({ tglKuras: '', kondisi: '', ket: '' });
    });
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0b1120', color: 'white', fontFamily: 'sans-serif' }}>
      {/* SIDEBAR */}
      <div style={{ width: '260px', padding: '25px', background: '#0f172a', borderRight: '1px solid #1e293b' }}>
        <h2 style={{ color: '#38bdf8', textAlign: 'center', marginBottom: '30px' }}>Sistem Cerdas Santi</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button onClick={() => setHalaman('beranda')} style={navBtn(halaman === 'beranda')}>🏠 Beranda</button>
          <button onClick={() => setHalaman('pakan')} style={navBtn(halaman === 'pakan')}>🐟 Pakan Pintar</button>
          <button onClick={() => setHalaman('log')} style={navBtn(halaman === 'log')}>📝 Log Jurnal Ikan</button>
          <button onClick={() => setHalaman('air')} style={navBtn(halaman === 'air')}>💧 Log Air</button>
          <button onClick={() => setHalaman('hidroponik')} style={navBtn(halaman === 'hidroponik')}>🌱 Hidroponik</button>
        </div>
      </div>

      {/* KONTEN */}
      <div style={{ flex: 1, padding: '40px' }}>
        
        {halaman === 'log' && (
          <div style={containerRapi}>
            <h2 style={judulStyle}>📝 Jurnal Budidaya Ikan</h2>
            <div style={cardStyle}>
              <div style={gridInput}>
                <div><label style={labelStyle}>TANGGAL BIBIT</label><input type="date" value={jurnalInput.tglBibit} onChange={e=>setJurnalInput({...jurnalInput, tglBibit:e.target.value})} style={inputStyle}/></div>
                <div><label style={labelStyle}>JUMLAH (EKOR)</label><input type="number" placeholder="Contoh: 500" value={jurnalInput.jumlah} onChange={e=>setJurnalInput({...jurnalInput, jumlah:e.target.value})} style={inputStyle}/></div>
                <div><label style={labelStyle}>UKURAN (CM)</label><input type="text" placeholder="Contoh: 5-7" value={jurnalInput.ukuran} onChange={e=>setJurnalInput({...jurnalInput, ukuran:e.target.value})} style={inputStyle}/></div>
                <div><label style={labelStyle}>TGL SORTIR</label><input type="date" value={jurnalInput.tglSortir} onChange={e=>setJurnalInput({...jurnalInput, tglSortir:e.target.value})} style={inputStyle}/></div>
              </div>
              <button onClick={handleSimpanJurnal} style={btnSimpan}>SIMPAN DATA IKAN</button>
            </div>
            <div style={cardStyle}>
              <h3 style={{textAlign:'center', color:'#94a3b8', marginBottom:'15px'}}>Riwayat Jurnal Ikan</h3>
              <table style={tabelStyle}>
                <thead><tr style={trHead}><th style={thStyle}>Tanggal</th><th style={thStyle}>Jumlah</th><th style={thStyle}>Ukuran</th><th style={thStyle}>Sortir</th></tr></thead>
                <tbody>{listJurnal.map(i=>(<tr key={i.id} style={trBody}><td style={tdStyle}>{i.tglBibit}</td><td style={tdStyle}>{i.jumlah}</td><td style={tdStyle}>{i.ukuran} cm</td><td style={tdStyle}>{i.tglSortir}</td></tr>))}</tbody>
              </table>
            </div>
          </div>
        )}

        {halaman === 'air' && (
          <div style={containerRapi}>
            <h2 style={judulStyle}>💧 Log Pengurasan Air</h2>
            <div style={cardStyle}>
              <div style={gridInput}>
                <div><label style={labelStyle}>TANGGAL KURAS</label><input type="date" value={airInput.tglKuras} onChange={e=>setAirInput({...airInput, tglKuras:e.target.value})} style={inputStyle}/></div>
                <div><label style={labelStyle}>KONDISI AIR</label><input type="text" placeholder="Hijau/Keruh" value={airInput.kondisi} onChange={e=>setAirInput({...airInput, kondisi:e.target.value})} style={inputStyle}/></div>
              </div>
              <div style={{marginTop:'15px'}}><label style={labelStyle}>KETERANGAN</label><input type="text" placeholder="Ganti air 50%" value={airInput.ket} onChange={e=>setAirInput({...airInput, ket:e.target.value})} style={inputStyle}/></div>
              <button onClick={handleSimpanAir} style={btnSimpan}>SIMPAN DATA AIR</button>
            </div>
            <div style={cardStyle}>
              <h3 style={{textAlign:'center', color:'#94a3b8', marginBottom:'15px'}}>Riwayat Pengurasan</h3>
              <table style={tabelStyle}>
                <thead><tr style={trHead}><th style={thStyle}>Tanggal</th><th style={thStyle}>Kondisi</th><th style={thStyle}>Keterangan</th></tr></thead>
                <tbody>{listAir.map(i=>(<tr key={i.id} style={trBody}><td style={tdStyle}>{i.tglKuras}</td><td style={tdStyle}>{i.kondisi}</td><td style={tdStyle}>{i.ket}</td></tr>))}</tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tambahkan halaman Pakan & Hidroponik di sini dengan style yang sama */}
      </div>
    </div>
  );
}

// --- CSS IN JS UNTUK MERAPIKAN ---
const navBtn = (a) => ({ background: a ? '#0ea5e9' : 'transparent', color: a ? 'white' : '#94a3b8', border: 'none', padding: '12px 15px', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', fontWeight: '600', transition: '0.3s' });
const containerRapi = { maxWidth: '800px', margin: '0 auto' };
const judulStyle = { color: '#38bdf8', textAlign: 'center', marginBottom: '25px', fontSize: '24px' };
const cardStyle = { background: '#1e293b', padding: '25px', borderRadius: '15px', border: '1px solid #334155', marginBottom: '20px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' };
const gridInput = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' };
const labelStyle = { display: 'block', fontSize: '11px', color: '#64748b', marginBottom: '8px', fontWeight: 'bold', letterSpacing: '1px' };
const inputStyle = { width: '100%', background: '#0f172a', border: '1px solid #334155', padding: '12px', borderRadius: '8px', color: '#38bdf8', outline: 'none', fontSize: '14px' };
const btnSimpan = { width: '100%', background: '#10b981', color: 'white', border: 'none', padding: '14px', borderRadius: '10px', marginTop: '20px', fontWeight: 'bold', cursor: 'pointer' };
const tabelStyle = { width: '100%', borderCollapse: 'collapse' };
const thStyle = { textAlign: 'left', padding: '12px', color: '#38bdf8', fontSize: '12px', borderBottom: '2px solid #334155' };
const tdStyle = { padding: '12px', fontSize: '13px', color: '#cbd5e1' };
const trHead = { background: 'transparent' };
const trBody = { borderBottom: '1px solid #334155' };

export default App;