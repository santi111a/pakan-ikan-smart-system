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

  // 3. STATE JURNAL IKAN
  const [jurnalInput, setJurnalInput] = useState({ 
    tglBibit: '', jumlahIkan: '', ukuranBibit: '', tglSortir: '' 
  });
  const [listJurnal, setListJurnal] = useState([]);

  // 4. STATE LOG AIR
  const [airInput, setAirInput] = useState({ 
    tglKuras: '', kondisiAir: '', keterangan: '' 
  });
  const [listAir, setListAir] = useState([]);

  // --- AMBIL DATA REALTIME ---
  useEffect(() => {
    const dbRef = ref(db, '/'); 
    onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        const result = snapshot.val();
        setData(result);
        // Load Jurnal Ikan
        if (result.jurnal_harian) {
          setListJurnal(Object.keys(result.jurnal_harian).map(key => ({ id: key, ...result.jurnal_harian[key] })).reverse());
        }
        // Load Log Air
        if (result.log_pengurasan) {
          setListAir(Object.keys(result.log_pengurasan).map(key => ({ id: key, ...result.log_pengurasan[key] })).reverse());
        }
        // Load Hidroponik
        if (result.jurnal_hidroponik) {
          setListHidro(Object.keys(result.jurnal_hidroponik).map(key => ({ id: key, ...result.jurnal_hidroponik[key] })).reverse());
        }
      }
    });
  }, []);

  // --- FUNGSI SIMPAN ---
  const handleUpdatePakan = () => {
    update(ref(db, '/'), { 
      ...data, 
      Jadwal: Number(data.Jadwal), 
      end_date: Number(data.end_date), 
      jam_pagi: Number(data.jam_pagi), 
      menit_pagi: Number(data.menit_pagi || 0),
      jam_sore: Number(data.jam_sore), 
      menit_sore: Number(data.menit_sore || 0),
      durasi_detik: Number(data.durasi_detik) 
    }).then(() => alert("✅ Pengaturan Pakan Diperbarui!"));
  };

  const handleSimpanHidro = () => {
    if (!hidroInput.tglTanam || !hidroInput.namaTanaman) return alert("Isi minimal Tanggal dan Nama!");
    push(ref(db, 'jurnal_hidroponik'), { ...hidroInput, hargaJual: Number(hidroInput.hargaJual || 0) })
      .then(() => {
        alert("✅ Data Hidroponik Tersimpan!");
        setHidroInput({ tglTanam: '', namaTanaman: '', pupuk: '', hama: 'Aman', jumlahPanen: '', hargaJual: '' });
      });
  };

  const handleSimpanJurnalIkan = () => {
    if (!jurnalInput.tglBibit || !jurnalInput.jumlahIkan) return alert("Isi Tanggal dan Jumlah Ikan!");
    push(ref(db, 'jurnal_harian'), jurnalInput).then(() => {
      alert("✅ Jurnal Ikan Tersimpan!");
      setJurnalInput({ tglBibit: '', jumlahIkan: '', ukuranBibit: '', tglSortir: '' });
    });
  };

  const handleSimpanAir = () => {
    if (!airInput.tglKuras || !airInput.kondisiAir) return alert("Isi Tanggal dan Kondisi Air!");
    push(ref(db, 'log_pengurasan'), airInput).then(() => {
      alert("✅ Log Air Tersimpan!");
      setAirInput({ tglKuras: '', kondisiAir: '', keterangan: '' });
    });
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0f172a', color: 'white', fontFamily: 'sans-serif' }}>
      {/* SIDEBAR */}
      <div style={{ width: '280px', padding: '30px', borderRight: '1px solid #1e293b', background: '#0f172a' }}>
        <h2 style={{ color: '#38bdf8', marginBottom: '40px', textAlign: 'center' }}>Sistem Cerdas Santi</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button onClick={() => setHalaman('beranda')} style={btnStyle(halaman === 'beranda')}>🏠 Beranda</button>
          <button onClick={() => setHalaman('pakan')} style={btnStyle(halaman === 'pakan')}>🐟 Pakan Pintar</button>
          <button onClick={() => setHalaman('log')} style={btnStyle(halaman === 'log')}>📝 Log Jurnal Ikan</button>
          <button onClick={() => setHalaman('air')} style={btnStyle(halaman === 'air')}>💧 Log Air</button>
          <button onClick={() => setHalaman('hidroponik')} style={btnStyle(halaman === 'hidroponik')}>🌱 Hidroponik</button>
        </div>
      </div>

      {/* AREA KONTEN UTAMA */}
      <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        
        {halaman === 'beranda' && (
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ color: '#38bdf8' }}>Halo, Selamat Datang! 👋</h1>
            <p style={{ color: '#94a3b8' }}>Monitoring Sistem Kolam Pintar Real-time.</p>
          </div>
        )}

        {halaman === 'pakan' && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={formContainer}>
              <h2 style={{ color: '#38bdf8', textAlign: 'center', marginBottom: '20px' }}>Pengaturan Pakan</h2>
              <label style={labelStyle}>RENTANG TANGGAL (MULAI - SELESAI)</label>
              <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                <input type="number" value={data.Jadwal} onChange={(e) => setData({...data, Jadwal: e.target.value})} style={inputStyle} />
                <input type="number" value={data.end_date} onChange={(e) => setData({...data, end_date: e.target.value})} style={inputStyle} />
              </div>
              <label style={labelStyle}>JADWAL PAGI (JAM : MENIT)</label>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '15px' }}>
                <input type="number" value={data.jam_pagi} onChange={(e) => setData({...data, jam_pagi: e.target.value})} style={inputStyle} />
                <span style={{color: '#38bdf8', fontWeight: 'bold', fontSize: '20px'}}>:</span>
                <input type="number" value={data.menit_pagi || 0} onChange={(e) => setData({...data, menit_pagi: e.target.value})} style={inputStyle} />
              </div>
              <label style={labelStyle}>JADWAL SORE (JAM : MENIT)</label>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '15px' }}>
                <input type="number" value={data.jam_sore} onChange={(e) => setData({...data, jam_sore: e.target.value})} style={inputStyle} />
                <span style={{color: '#38bdf8', fontWeight: 'bold', fontSize: '20px'}}>:</span>
                <input type="number" value={data.menit_sore || 0} onChange={(e) => setData({...data, menit_sore: e.target.value})} style={inputStyle} />
              </div>
              <label style={labelStyle}>DURASI PAKAN (DETIK)</label>
              <input type="number" value={data.durasi_detik} onChange={(e) => setData({...data, durasi_detik: e.target.value})} style={{...inputStyle, width: '100%'}} />
              <button onClick={handleUpdatePakan} style={updateBtnStyle}>UPDATE DATA & AKTIFKAN</button>
            </div>
          </div>
        )}

        {/* --- LOG JURNAL IKAN (YANG TADI HILANG) --- */}
        {halaman === 'log' && (
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h2 style={{ color: '#38bdf8', marginBottom: '20px' }}>📝 Jurnal Budidaya Ikan</h2>
            <div style={jurnalBox}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div><label style={labelStyle}>TGL BIBIT</label><input type="date" value={jurnalInput.tglBibit} onChange={(e)=>setJurnalInput({...jurnalInput, tglBibit: e.target.value})} style={inputStyle} /></div>
                <div><label style={labelStyle}>JUMLAH (EKOR)</label><input type="number" value={jurnalInput.jumlahIkan} onChange={(e)=>setJurnalInput({...jurnalInput, jumlahIkan: e.target.value})} style={inputStyle} /></div>
                <div><label style={labelStyle}>UKURAN (CM)</label><input type="text" value={jurnalInput.ukuranBibit} onChange={(e)=>setJurnalInput({...jurnalInput, ukuranBibit: e.target.value})} style={inputStyle} /></div>
                <div><label style={labelStyle}>TGL SORTIR</label><input type="date" value={jurnalInput.tglSortir} onChange={(e)=>setJurnalInput({...jurnalInput, tglSortir: e.target.value})} style={inputStyle} /></div>
              </div>
              <button onClick={handleSimpanJurnalIkan} style={updateBtnStyle}>SIMPAN DATA IKAN</button>
            </div>
            <div style={historyBox}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={trHead}><th style={thStyle}>Tgl Bibit</th><th style={thStyle}>Jumlah</th><th style={thStyle}>Ukuran</th><th style={thStyle}>Tgl Sortir</th></tr></thead>
                <tbody>{listJurnal.map((item) => (<tr key={item.id} style={trBody}><td style={tdStyle}>{item.tglBibit}</td><td style={tdStyle}>{item.jumlahIkan}</td><td style={tdStyle}>{item.ukuranBibit}</td><td style={tdStyle}>{item.tglSortir}</td></tr>))}</tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- LOG AIR (YANG TADI HILANG) --- */}
        {halaman === 'air' && (
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h2 style={{ color: '#38bdf8', marginBottom: '20px' }}>💧 Log Pengurasan Air</h2>
            <div style={jurnalBox}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div><label style={labelStyle}>TGL KURAS</label><input type="date" value={airInput.tglKuras} onChange={(e)=>setAirInput({...airInput, tglKuras: e.target.value})} style={inputStyle} /></div>
                <div><label style={labelStyle}>KONDISI</label><input type="text" placeholder="Hijau/Keruh" value={airInput.kondisiAir} onChange={(e)=>setAirInput({...airInput, kondisiAir: e.target.value})} style={inputStyle} /></div>
              </div>
              <div style={{marginTop: '15px'}}><label style={labelStyle}>KETERANGAN</label><input type="text" value={airInput.keterangan} onChange={(e)=>setAirInput({...airInput, keterangan: e.target.value})} style={inputStyle} /></div>
              <button onClick={handleSimpanAir} style={updateBtnStyle}>SIMPAN DATA AIR</button>
            </div>
            <div style={historyBox}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={trHead}><th style={thStyle}>Tanggal</th><th style={thStyle}>Kondisi</th><th style={thStyle}>Keterangan</th></tr></thead>
                <tbody>{listAir.map((item) => (<tr key={item.id} style={trBody}><td style={tdStyle}>{item.tglKuras}</td><td style={tdStyle}>{item.kondisiAir}</td><td style={tdStyle}>{item.keterangan || '-'}</td></tr>))}</tbody>
              </table>
            </div>
          </div>
        )}

        {halaman === 'hidroponik' && (
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h2 style={{ color: '#38bdf8', marginBottom: '20px' }}>🌱 Jurnal Hidroponik</h2>
            <div style={jurnalBox}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px' }}>
                <div><label style={labelStyle}>TGL TANAM</label><input type="date" value={hidroInput.tglTanam} onChange={(e) => setHidroInput({...hidroInput, tglTanam: e.target.value})} style={inputStyle} /></div>
                <div><label style={labelStyle}>NAMA TANAMAN</label><input type="text" value={hidroInput.namaTanaman} onChange={(e) => setHidroInput({...hidroInput, namaTanaman: e.target.value})} style={inputStyle} /></div>
                <div><label style={labelStyle}>PANEN (KG)</label><input type="text" value={hidroInput.jumlahPanen} onChange={(e) => setHidroInput({...hidroInput, jumlahPanen: e.target.value})} style={inputStyle} /></div>
                <div><label style={labelStyle}>HARGA JUAL</label><input type="number" value={hidroInput.hargaJual} onChange={(e) => setHidroInput({...hidroInput, hargaJual: e.target.value})} style={inputStyle} /></div>
              </div>
              <button onClick={handleSimpanHidro} style={{...updateBtnStyle, background: '#10b981'}}>SIMPAN DATA HIDROPONIK</button>
            </div>
            <div style={historyBox}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={trHead}><th style={thStyle}>Tanggal</th><th style={thStyle}>Tanaman</th><th style={thStyle}>Panen</th><th style={thStyle}>Harga</th></tr></thead>
                <tbody>{listHidro.map((item) => (<tr key={item.id} style={trBody}><td style={tdStyle}>{item.tglTanam}</td><td style={tdStyle}>{item.namaTanaman}</td><td style={tdStyle}>{item.jumlahPanen}</td><td style={tdStyle}>{item.hargaJual ? `Rp ${Number(item.hargaJual).toLocaleString('id-ID')}` : '-'}</td></tr>))}</tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// --- STYLES ---
const btnStyle = (aktif) => ({ background: aktif ? 'linear-gradient(90deg, #38bdf8, #0ea5e9)' : '#1e293b', color: aktif ? '#0f172a' : '#94a3b8', border: 'none', padding: '14px', borderRadius: '10px', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold' });
const formContainer = { background: '#1e293b', padding: '30px', borderRadius: '25px', width: '100%', maxWidth: '450px', border: '1px solid #334155' };
const labelStyle = { display: 'block', fontSize: '10px', color: '#64748b', marginBottom: '5px', fontWeight: '800' };
const inputStyle = { background: '#0f172a', border: '1px solid #334155', padding: '12px', borderRadius: '10px', color: '#38bdf8', textAlign: 'center', fontSize: '16px', fontWeight: 'bold', width: '100%', outline: 'none' };
const updateBtnStyle = { width: '100%', background: '#22c55e', color: 'white', border: 'none', padding: '15px', borderRadius: '12px', marginTop: '20px', fontWeight: 'bold', cursor: 'pointer' };
const jurnalBox = { background: '#1e293b', padding: '25px', borderRadius: '15px', marginBottom: '20px', border: '1px solid #334155' };
const historyBox = { background: '#1e293b', borderRadius: '15px', padding: '15px', border: '1px solid #334155' };
const trHead = { color: '#38bdf8', borderBottom: '2px solid #334155' };
const trBody = { borderBottom: '1px solid #1e293b' };
const thStyle = { textAlign: 'left', padding: '10px', fontSize: '12px' };
const tdStyle = { padding: '10px', fontSize: '13px', color: '#cbd5e1' };

export default App;