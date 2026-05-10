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
  const [jurnalInput, setJurnalInput] = useState({ tglBibit: '', jumlah: '', ukuran: '', tglSortir: '' });
  const [listJurnal, setListJurnal] = useState([]);
  const [airInput, setAirInput] = useState({ tglKuras: '', kondisi: '', ket: '' });
  const [listAir, setListAir] = useState([]);
  const [hidroInput, setHidroInput] = useState({ tglTanam: '', namaTanaman: '', panen: '', harga: '' });
  const [listHidro, setListHidro] = useState([]);

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

  // FUNGSI ACTION
  const handleSimpan = (path, input, setInput) => {
    push(ref(db, path), input).then(() => {
      alert("✅ Data Berhasil Disimpan!");
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
          {['beranda', 'pakan', 'log', 'air', 'hidroponik'].map((menu) => (
            <button key={menu} onClick={() => setHalaman(menu)} style={navBtn(halaman === menu)}>
              {menu === 'beranda' && '🏠 Beranda'}
              {menu === 'pakan' && '🐟 Pakan Pintar'}
              {menu === 'log' && '📝 Log Jurnal Ikan'}
              {menu === 'air' && '💧 Log Air'}
              {menu === 'hidroponik' && '🌱 Hidroponik'}
            </button>
          ))}
        </div>
      </div>

      {/* KONTEN AREA */}
      <div style={{ flex: 1, padding: '40px', marginLeft: '260px' }}>
        {halaman === 'beranda' && (
          <div style={{ textAlign: 'center', marginTop: '100px' }}>
            <h1 style={{ color: '#38bdf8' }}>Selamat Datang! 👋</h1>
            <p style={{ color: '#94a3b8' }}>Kelola kolam dan hidroponikmu dengan satu klik.</p>
          </div>
        )}

        {/* LOG JURNAL IKAN */}
        {halaman === 'log' && (
          <div style={containerRapi}>
            <h2 style={judulStyle}>📝 Jurnal Budidaya Ikan</h2>
            <div style={cardStyle}>
              <div style={gridInput}>
                <div><label style={labelStyle}>TGL BIBIT</label><input type="date" value={jurnalInput.tglBibit} onChange={e=>setJurnalInput({...jurnalInput, tglBibit:e.target.value})} style={inputStyle}/></div>
                <div><label style={labelStyle}>JUMLAH</label><input type="number" value={jurnalInput.jumlah} onChange={e=>setJurnalInput({...jurnalInput, jumlah:e.target.value})} style={inputStyle}/></div>
                <div><label style={labelStyle}>UKURAN</label><input type="text" value={jurnalInput.ukuran} onChange={e=>setJurnalInput({...jurnalInput, ukuran:e.target.value})} style={inputStyle}/></div>
                <div><label style={labelStyle}>TGL SORTIR</label><input type="date" value={jurnalInput.tglSortir} onChange={e=>setJurnalInput({...jurnalInput, tglSortir:e.target.value})} style={inputStyle}/></div>
              </div>
              <button onClick={() => handleSimpan('jurnal_harian', jurnalInput, setJurnalInput)} style={btnSimpan}>SIMPAN DATA IKAN</button>
            </div>
            <div style={cardStyle}>
              <table style={tabelStyle}>
                <thead><tr style={trHead}><th style={thStyle}>Tanggal</th><th style={thStyle}>Jumlah</th><th style={thStyle}>Ukuran</th><th style={thStyle}>Sortir</th></tr></thead>
                <tbody>{listJurnal.map(i=>(<tr key={i.id} style={trBody}><td style={tdStyle}>{i.tglBibit}</td><td style={tdStyle}>{i.jumlah}</td><td style={tdStyle}>{i.ukuran}</td><td style={tdStyle}>{i.tglSortir}</td></tr>))}</tbody>
              </table>
            </div>
          </div>
        )}

        {/* LOG AIR */}
        {halaman === 'air' && (
          <div style={containerRapi}>
            <h2 style={judulStyle}>💧 Log Pengurasan Air</h2>
            <div style={cardStyle}>
              <div style={gridInput}>
                <div><label style={labelStyle}>TGL KURAS</label><input type="date" value={airInput.tglKuras} onChange={e=>setAirInput({...airInput, tglKuras:e.target.value})} style={inputStyle}/></div>
                <div><label style={labelStyle}>KONDISI</label><input type="text" placeholder="Keruh/Hijau" value={airInput.kondisi} onChange={e=>setAirInput({...airInput, kondisi:e.target.value})} style={inputStyle}/></div>
              </div>
              <div style={{marginTop:'10px'}}><label style={labelStyle}>KETERANGAN</label><input type="text" value={airInput.ket} onChange={e=>setAirInput({...airInput, ket:e.target.value})} style={inputStyle}/></div>
              <button onClick={() => handleSimpan('log_pengurasan', airInput, setAirInput)} style={btnSimpan}>SIMPAN DATA AIR</button>
            </div>
            <div style={cardStyle}>
              <table style={tabelStyle}>
                <thead><tr style={trHead}><th style={thStyle}>Tanggal</th><th style={thStyle}>Kondisi</th><th style={thStyle}>Keterangan</th></tr></thead>
                <tbody>{listAir.map(i=>(<tr key={i.id} style={trBody}><td style={tdStyle}>{i.tglKuras}</td><td style={tdStyle}>{i.kondisi}</td><td style={tdStyle}>{i.ket}</td></tr>))}</tbody>
              </table>
            </div>
          </div>
        )}

        {/* PAKAN & HIDROPONIK (Diringkas agar tidak kepanjangan) */}
        {halaman === 'pakan' && <div style={containerRapi}><h2 style={judulStyle}>🐟 Pengaturan Pakan</h2><div style={cardStyle}>... (Gunakan Input Pakanmu) ...</div></div>}
        {halaman === 'hidroponik' && <div style={containerRapi}><h2 style={judulStyle}>🌱 Jurnal Hidroponik</h2><div style={cardStyle}>... (Gunakan Input Hidroponikmu) ...</div></div>}
      </div>
    </div>
  );
}

// STYLES (SAMA DENGAN SEBELUMNYA)
const navBtn = (a) => ({ background: a ? '#0ea5e9' : 'transparent', color: a ? 'white' : '#94a3b8', border: 'none', padding: '12px 15px', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold' });
const containerRapi = { maxWidth: '750px', margin: '0 auto' };
const judulStyle = { color: '#38bdf8', textAlign: 'center', marginBottom: '20px' };
const cardStyle = { background: '#1e293b', padding: '20px', borderRadius: '15px', border: '1px solid #334155', marginBottom: '20px' };
const gridInput = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' };
const labelStyle = { display: 'block', fontSize: '10px', color: '#64748b', marginBottom: '5px', fontWeight: 'bold' };
const inputStyle = { width: '100%', background: '#0f172a', border: '1px solid #334155', padding: '10px', borderRadius: '8px', color: '#38bdf8', outline: 'none' };
const btnSimpan = { width: '100%', background: '#10b981', color: 'white', border: 'none', padding: '12px', borderRadius: '10px', marginTop: '15px', fontWeight: 'bold', cursor: 'pointer' };
const tabelStyle = { width: '100%', borderCollapse: 'collapse' };
const thStyle = { textAlign: 'left', padding: '10px', color: '#38bdf8', fontSize: '12px', borderBottom: '2px solid #334155' };
const tdStyle = { padding: '10px', fontSize: '12px', color: '#cbd5e1' };
const trHead = { background: 'transparent' };
const trBody = { borderBottom: '1px solid #334155' };

export default App;