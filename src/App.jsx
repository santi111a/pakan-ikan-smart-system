import React, { useState, useEffect } from 'react';
import { db } from './firebase'; 
import { ref, onValue, update, push } from "firebase/database";

function App() {
  const [halaman, setHalaman] = useState('beranda');
  const [data, setData] = useState({
    Jadwal: 0,
    end_date: 0,
    jam_pagi: 0,
    menit_pagi: 0,
    jam_sore: 0,
    menit_sore: 0,
    durasi_detik: 0
  });

  // State Jurnal Ikan
  const [jurnalInput, setJurnalInput] = useState({ tglBibit: '', jumlahIkan: '', ukuranBibit: '', tglSortir: '' });
  const [listJurnal, setListJurnal] = useState([]);
  
  // State Log Air (Riwayat Pengurasan)
  const [kurasInput, setKurasInput] = useState({ tglKuras: '', kondisiAir: '', keterangan: '' });
  const [listKuras, setListKuras] = useState([]);

  useEffect(() => {
    const dbRef = ref(db, '/'); 
    onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        const result = snapshot.val();
        setData(result);
        if (result.jurnal_harian) {
          setListJurnal(Object.keys(result.jurnal_harian).map(key => ({ id: key, ...result.jurnal_harian[key] })).reverse());
        }
        if (result.jurnal_kuras) {
          setListKuras(Object.keys(result.jurnal_kuras).map(key => ({ id: key, ...result.jurnal_kuras[key] })).reverse());
        }
      }
    });
  }, []);

  const handleSimpanJurnal = () => {
    push(ref(db, 'jurnal_harian'), jurnalInput).then(() => {
      alert("✅ Catatan Harian Berhasil Disimpan!");
      setJurnalInput({ tglBibit: '', jumlahIkan: '', ukuranBibit: '', tglSortir: '' });
    });
  };

  const handleSimpanKuras = () => {
    if (!kurasInput.tglKuras) return alert("Pilih tanggal pengurasan!");
    push(ref(db, 'jurnal_kuras'), kurasInput).then(() => {
      alert("✅ Riwayat Log Air Tersimpan!");
      setKurasInput({ tglKuras: '', kondisiAir: '', keterangan: '' });
    });
  };

  const Sidebar = () => (
    <div style={{ width: '300px', background: '#0f172a', padding: '25px', borderRight: '1px solid #38bdf8', height: '100vh', position: 'sticky', top: 0 }}>
      <h2 style={{ color: '#38bdf8', textAlign: 'center', marginBottom: '30px', fontSize: '24px', fontWeight: 'bold' }}>Sistem Cerdas Santi</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <button onClick={() => setHalaman('beranda')} style={btnStyle(halaman === 'beranda')}>🏠 Beranda</button>
        <button onClick={() => setHalaman('pakan')} style={btnStyle(halaman === 'pakan')}>🐟 Pakan Pintar</button>
        <button onClick={() => setHalaman('log')} style={btnStyle(halaman === 'log')}>📝 Log Jurnal Ikan</button>
        <button onClick={() => setHalaman('air')} style={btnStyle(halaman === 'air')}>💧 Log Air</button>
        <button onClick={() => setHalaman('hidroponik')} style={btnStyle(halaman === 'hidroponik')}>🌱 Hidroponik</button>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', backgroundColor: '#0b1120', color: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        
        {/* --- BERANDA & PAKAN PINTAR (KEMBALI KE AWAL) --- */}
        {(halaman === 'beranda' || halaman === 'pakan') && (
          <div style={{ textAlign: 'center', marginTop: '120px' }}>
            <h1 style={{ color: '#38bdf8', fontSize: '42px', fontWeight: 'bold' }}>
              {halaman === 'beranda' ? 'Sistem Cerdas Santi' : 'Pakan Pintar'}
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '18px', marginTop: '10px' }}>Fitur ini sedang dalam sinkronisasi dengan sensor database.</p>
          </div>
        )}

        {/* --- LOG JURNAL IKAN (SESUAI image_1adede.png) --- */}
        {halaman === 'log' && (
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h2 style={{ color: '#38bdf8', textAlign: 'center', fontSize: '28px', marginBottom: '30px' }}>Catatan Harian Budidaya Ikan</h2>
            <div style={formBoxStyle}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={labelStyle}>TANGGAL MASUK BIBIT</label>
                  <input type="date" value={jurnalInput.tglBibit} onChange={(e)=>setJurnalInput({...jurnalInput, tglBibit: e.target.value})} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>JUMLAH BIBIT (EKOR)</label>
                  <input type="text" placeholder="Contoh: 500" value={jurnalInput.jumlahIkan} onChange={(e)=>setJurnalInput({...jurnalInput, jumlahIkan: e.target.value})} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>UKURAN BIBIT (CM)</label>
                  <input type="text" placeholder="Contoh: 5-7 cm" value={jurnalInput.ukuranBibit} onChange={(e)=>setJurnalInput({...jurnalInput, ukuranBibit: e.target.value})} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>RENCANA TANGGAL SORTIR</label>
                  <input type="date" value={jurnalInput.tglSortir} onChange={(e)=>setJurnalInput({...jurnalInput, tglSortir: e.target.value})} style={inputStyle} />
                </div>
              </div>
              <button onClick={handleSimpanJurnal} style={btnSimpanStyle}>SIMPAN CATATAN HARIAN</button>
            </div>
          </div>
        )}

        {/* --- LOG AIR (SESUAI PERMINTAAN TERBARU) --- */}
        {halaman === 'air' && (
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h2 style={{ color: '#38bdf8', textAlign: 'center', fontSize: '28px', marginBottom: '30px' }}>💧 Log Air (Riwayat Pengurasan)</h2>
            <div style={formBoxStyle}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={labelStyle}>TANGGAL KURAS</label>
                  <input type="date" value={kurasInput.tglKuras} onChange={(e)=>setKurasInput({...kurasInput, tglKuras: e.target.value})} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>KONDISI AIR SEBELUM</label>
                  <input type="text" placeholder="Contoh: Sangat Keruh" value={kurasInput.kondisiAir} onChange={(e)=>setKurasInput({...kurasInput, kondisiAir: e.target.value})} style={inputStyle} />
                </div>
              </div>
              <label style={labelStyle}>KETERANGAN</label>
              <input type="text" placeholder="Catatan tambahan..." value={kurasInput.keterangan} onChange={(e)=>setKurasInput({...kurasInput, keterangan: e.target.value})} style={{...inputStyle, marginBottom: '20px'}} />
              <button onClick={handleSimpanKuras} style={btnSimpanStyle}>SIMPAN DATA KURAS</button>
            </div>

            {/* TABEL RIWAYAT LOG AIR */}
            <div style={historyBoxStyle}>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', textAlign: 'center', fontWeight: 'bold', color: '#38bdf8', borderBottom: '1px solid #334155', paddingBottom: '15px' }}>
                  <span>Tanggal</span><span>Kondisi</span><span>Keterangan</span>
               </div>
               {listKuras.map((item) => (
                 <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', textAlign: 'center', padding: '15px 0', borderBottom: '1px solid #1e293b', color: '#94a3b8' }}>
                   <span>{item.tglKuras}</span><span>{item.kondisiAir}</span><span>{item.keterangan}</span>
                 </div>
               ))}
            </div>
          </div>
        )}

        {halaman === 'hidroponik' && (
          <div style={{ textAlign: 'center', marginTop: '120px' }}><h1 style={{ color: '#38bdf8' }}>Hidroponik</h1></div>
        )}

      </div>
    </div>
  );
}

// --- STYLES ---
const btnStyle = (aktif) => ({
  background: aktif ? '#38bdf8' : '#1e293b',
  color: aktif ? '#0f172a' : '#94a3b8',
  border: 'none', padding: '14px 20px', borderRadius: '12px', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold', fontSize: '15px'
});
const formBoxStyle = { background: '#1e293b', padding: '35px', borderRadius: '24px', border: '1px solid #334155', marginBottom: '30px' };
const historyBoxStyle = { background: '#1e293b', padding: '25px', borderRadius: '24px', border: '1px solid #334155' };
const labelStyle = { display: 'block', fontSize: '11px', color: '#64748b', marginBottom: '8px', fontWeight: 'bold', textAlign: 'center' };
const inputStyle = { background: '#0f172a', border: '1px solid #334155', padding: '14px', borderRadius: '10px', color: '#38bdf8', width: '100%', outline: 'none', textAlign: 'center' };
const btnSimpanStyle = { width: '100%', background: '#22c55e', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' };

export default App;
