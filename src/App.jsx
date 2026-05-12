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

  // 2. STATE INPUT & LIST DATA
  const [hidroInput, setHidroInput] = useState({ tglTanam: '', namaTanaman: '', pupuk: '', hama: 'Aman', jumlahPanen: '', hargaJual: '' });
  const [listHidro, setListHidro] = useState([]);

  const [jurnalInput, setJurnalInput] = useState({ tglBibit: '', jumlahIkan: '', ukuranBibit: '', tglSortir: '' });
  const [listJurnal, setListJurnal] = useState([]);

  const [airInput, setAirInput] = useState({ tglKuras: '', kondisiAir: '', keterangan: '' });
  const [listAir, setListAir] = useState([]);

  // --- AMBIL DATA REALTIME DARI FIREBASE ---
  useEffect(() => {
    const dbRef = ref(db, '/'); 
    onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        const result = snapshot.val();
        setData(prev => ({ ...prev, ...result }));
        
        // Mapping data dari Firebase ke State
        if (result.jurnal_harian) {
          setListJurnal(Object.keys(result.jurnal_harian).map(key => ({ id: key, ...result.jurnal_harian[key] })).reverse());
        }
        if (result.log_pengurasan) {
          setListAir(Object.keys(result.log_pengurasan).map(key => ({ id: key, ...result.log_pengurasan[key] })).reverse());
        }
        if (result.jurnal_hidroponik) {
          setListHidro(Object.keys(result.jurnal_hidroponik).map(key => ({ id: key, ...result.jurnal_hidroponik[key] })).reverse());
        }
      }
    });
  }, []);

  // --- FUNGSI SIMPAN & UPDATE ---
  const handleToggleKipas = () => update(ref(db, '/'), { kipas_on: !data.kipas_on });

  const handleUpdatePakan = () => {
    update(ref(db, '/'), { ...data }).then(() => alert("✅ Jadwal Pakan Diperbarui!"));
  };

  const handleSimpanJurnalIkan = () => {
    if (!jurnalInput.tglBibit) return alert("Isi tanggal dulu!");
    push(ref(db, 'jurnal_harian'), jurnalInput).then(() => {
      alert("✅ Jurnal Ikan Tersimpan!");
      setJurnalInput({ tglBibit: '', jumlahIkan: '', ukuranBibit: '', tglSortir: '' });
    });
  };

  const handleSimpanAir = () => {
    if (!airInput.tglKuras) return alert("Isi tanggal kuras!");
    push(ref(db, 'log_pengurasan'), airInput).then(() => {
      alert("✅ Log Air Berhasil Dicatat!");
      setAirInput({ tglKuras: '', kondisiAir: '', keterangan: '' });
    });
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: 'white', fontFamily: 'sans-serif' }}>
      
      {/* HEADER UTAMA */}
      <div style={{ padding: '20px', borderBottom: '1px solid #1e293b', textAlign: 'center', background: '#0f172a', position: 'sticky', top: 0, zIndex: 10 }}>
        <h2 style={{ color: '#38bdf8', margin: 0, fontSize: '20px' }}>Santi Smart System</h2>
      </div>

      <div style={{ padding: '15px' }}>
        
        {/* --- MENU UTAMA (DASHBOARD) --- */}
        {halaman === 'beranda' && (
          <div style={dashboardContainer}>
            <div style={menuGrid}>
              <div onClick={() => setHalaman('pakan')} style={menuCard}>
                <div style={iconCircle}>🐟</div>
                <span style={menuLabel}>Pakan Pintar</span>
                <span style={subLabel}>Pagi: {data.jam_pagi}:{data.menit_pagi}</span>
              </div>
              <div onClick={() => setHalaman('log')} style={menuCard}>
                <div style={iconCircle}>📓</div>
                <span style={menuLabel}>Jurnal Ikan</span>
                <span style={subLabel}>{listJurnal.length} Entri</span>
              </div>
              <div onClick={() => setHalaman('air')} style={menuCard}>
                <div style={iconCircle}>💧</div>
                <span style={menuLabel}>Log Air</span>
                <span style={subLabel}>{listAir[0]?.kondisiAir || 'N/A'}</span>
              </div>
              <div onClick={() => setHalaman('hidroponik')} style={menuCard}>
                <div style={iconCircle}>🌱</div>
                <span style={menuLabel}>Hidroponik</span>
                <span style={subLabel}>Cek Tanaman</span>
              </div>
            </div>

            {/* QUICK CONTROL KIPAS */}
            <div style={kipasBox}>
              <div>
                <div style={{ fontWeight: 'bold' }}>Sirkulasi Kipas</div>
                <div style={{ fontSize: '12px', color: data.kipas_on ? '#10b981' : '#ef4444' }}>
                  {data.kipas_on ? '● Status: Aktif' : '● Status: Mati'}
                </div>
              </div>
              <button onClick={handleToggleKipas} style={{ ...toggleBtn, background: data.kipas_on ? '#ef4444' : '#10b981' }}>
                {data.kipas_on ? 'MATIKAN' : 'NYALAKAN'}
              </button>
            </div>
          </div>
        )}

        {/* --- AREA HALAMAN DETAIL --- */}
        {halaman !== 'beranda' && (
          <div style={{ animation: 'fadeIn 0.3s' }}>
            <button onClick={() => setHalaman('beranda')} style={backBtnStyle}>⬅ Kembali ke Dashboard</button>

            {/* --- LOG AIR (NEW) --- */}
            {halaman === 'air' && (
              <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                <h2 style={{ color: '#38bdf8', marginBottom: '20px' }}>💧 Log Pengurasan Air</h2>
                <div style={jurnalBox}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div><label style={labelStyle}>TGL KURAS</label><input type="date" value={airInput.tglKuras} onChange={(e)=>setAirInput({...airInput, tglKuras: e.target.value})} style={inputStyle} /></div>
                    <div><label style={labelStyle}>KONDISI</label><input type="text" placeholder="Hijau/Keruh" value={airInput.kondisiAir} onChange={(e)=>setAirInput({...airInput, kondisiAir: e.target.value})} style={inputStyle} /></div>
                  </div>
                  <div style={{marginTop: '15px'}}><label style={labelStyle}>KETERANGAN</label><input type="text" placeholder="Misal: Ganti air 50%" value={airInput.keterangan} onChange={(e)=>setAirInput({...airInput, keterangan: e.target.value})} style={inputStyle} /></div>
                  <button onClick={handleSimpanAir} style={updateBtnStyle}>SIMPAN DATA AIR</button>
                </div>
                <div style={historyBox}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead><tr style={trHead}><th style={thStyle}>Tanggal</th><th style={thStyle}>Kondisi</th><th style={thStyle}>Keterangan</th></tr></thead>
                    <tbody>
                      {listAir.length > 0 ? (
                        listAir.map((item) => (
                          <tr key={item.id} style={trBody}>
                            <td style={tdStyle}>{item.tglKuras}</td>
                            <td style={tdStyle}>{item.kondisiAir}</td>
                            <td style={tdStyle}>{item.keterangan || '-'}</td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan="3" style={{...tdStyle, textAlign: 'center'}}>Belum ada data air</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* --- JURNAL IKAN --- */}
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

            {/* --- HALAMAN LAIN (PLACEHOLDER) --- */}
            {halaman === 'pakan' && <div style={{textAlign: 'center'}}>Halaman Pakan sedang dikembangkan.</div>}
            {halaman === 'hidroponik' && <div style={{textAlign: 'center'}}>Halaman Hidroponik sedang dikembangkan.</div>}
          </div>
        )}
      </div>
    </div>
  );
}

// --- STYLES OBJECT ---
const dashboardContainer = { maxWidth: '500px', margin: '0 auto' };
const menuGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' };
const menuCard = { background: '#1e293b', padding: '20px', borderRadius: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', border: '1px solid #334155', transition: '0.2s' };
const iconCircle = { fontSize: '32px', marginBottom: '10px' };
const menuLabel = { fontSize: '14px', fontWeight: 'bold' };
const subLabel = { fontSize: '11px', color: '#94a3b8', marginTop: '5px' };
const kipasBox = { marginTop: '25px', padding: '20px', background: '#1e293b', borderRadius: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const toggleBtn = { border: 'none', color: 'white', padding: '10px 15px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' };
const inputStyle = { background: '#0f172a', border: '1px solid #334155', padding: '12px', borderRadius: '8px', color: '#38bdf8', width: '100%', boxSizing: 'border-box' };
const labelStyle = { fontSize: '11px', color: '#64748b', fontWeight: 'bold', display: 'block', marginBottom: '5px' };
const updateBtnStyle = { width: '100%', background: '#0ea5e9', color: 'white', border: 'none', padding: '14px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' };
const backBtnStyle = { background: '#1e293b', border: '1px solid #334155', color: '#38bdf8', padding: '12px', borderRadius: '10px', marginBottom: '20px', cursor: 'pointer', width: '100%' };
const jurnalBox = { background: '#1e293b', padding: '25px', borderRadius: '20px', marginBottom: '20px' };
const historyBox = { background: '#1e293b', padding: '15px', borderRadius: '20px', overflowX: 'auto' };
const trHead = { borderBottom: '2px solid #334155', textAlign: 'left' };
const thStyle = { padding: '12px', color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase' };
const trBody = { borderBottom: '1px solid #334155' };
const tdStyle = { padding: '12px', fontSize: '14px', color: '#e2e8f0' };

export default App;