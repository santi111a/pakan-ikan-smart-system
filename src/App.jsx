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
    durasi_detik: 0,
    kipas_on: false 
  });

  // State Management
  const [jurnalInput, setJurnalInput] = useState({ tglBibit: '', jumlahIkan: '', ukuranBibit: '', tglSortir: '' });
  const [listJurnal, setListJurnal] = useState([]);
  const [airInput, setAirInput] = useState({ tglKuras: '', kondisiAir: '', keterangan: '' });
  const [listAir, setListAir] = useState([]);
  
  // State Baru untuk Hidroponik
  const [hidroInput, setHidroInput] = useState({ namaTanaman: '', tglTanam: '', jenisPupuk: '', status: '', hasil: '' });
  const [listHidro, setListHidro] = useState([]);

  useEffect(() => {
    const dbRef = ref(db, '/'); 
    onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        const result = snapshot.val();
        setData(result);
        
        // Load Data Lists
        if (result.jurnal_harian) {
          const jurnalArray = Object.keys(result.jurnal_harian).map(key => ({ id: key, ...result.jurnal_harian[key] }));
          setListJurnal(jurnalArray.reverse());
        }
        if (result.log_pengurasan) {
          const airArray = Object.keys(result.log_pengurasan).map(key => ({ id: key, ...result.log_pengurasan[key] }));
          setListAir(airArray.reverse());
        }
        if (result.jurnal_hidroponik) {
          const hidroArray = Object.keys(result.jurnal_hidroponik).map(key => ({ id: key, ...result.jurnal_hidroponik[key] }));
          setListHidro(hidroArray.reverse());
        }
      }
    });
  }, []);

  const handleUpdatePakan = () => {
    const dbRef = ref(db, '/');
    update(dbRef, {
      ...data,
      Jadwal: Number(data.Jadwal),
      end_date: Number(data.end_date),
      jam_pagi: Number(data.jam_pagi),
      menit_pagi: Number(data.menit_pagi || 0),
      jam_sore: Number(data.jam_sore),
      menit_sore: Number(data.menit_sore || 0),
      durasi_detik: Number(data.durasi_detik)
    }).then(() => alert("✅ Jadwal Pakan Berhasil Diperbarui!"));
  };

  const handleSimpanHidro = () => {
    if (!hidroInput.namaTanaman || !hidroInput.tglTanam) return alert("Isi minimal nama tanaman dan tanggal!");
    push(ref(db, 'jurnal_hidroponik'), hidroInput).then(() => {
      alert("✅ Data Hidroponik Tersimpan!");
      setHidroInput({ namaTanaman: '', tglTanam: '', jenisPupuk: '', status: '', hasil: '' });
    });
  };

  const Sidebar = () => (
    <div style={{ width: '300px', background: '#0f172a', padding: '25px', borderRight: '1px solid #38bdf8', height: '100vh', position: 'sticky', top: 0 }}>
      <h2 style={{ color: '#38bdf8', textAlign: 'center', marginBottom: '30px', fontSize: '22px' }}>Santi Smart Farm</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <button onClick={() => setHalaman('beranda')} style={btnStyle(halaman === 'beranda')}>🏠 Beranda</button>
        <button onClick={() => setHalaman('pakan')} style={btnStyle(halaman === 'pakan')}>🐟 Pakan Pintar</button>
        <button onClick={() => setHalaman('log')} style={btnStyle(halaman === 'log')}>📝 Log Ikan</button>
        <button onClick={() => setHalaman('air')} style={btnStyle(halaman === 'air')}>💧 Log Air</button>
        <button onClick={() => setHalaman('hidroponik')} style={btnStyle(halaman === 'hidroponik')}>🌱 Hidroponik</button>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', backgroundColor: '#0b1120', color: '#f8fafc', minHeight: '100vh', fontFamily: 'Arial' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        
        {/* --- BERANDA --- */}
        {halaman === 'beranda' && (
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h1 style={{ color: '#38bdf8', fontSize: '32px' }}>Dashboard Monitoring</h1>
            <p style={{ color: '#94a3b8', marginBottom: '30px' }}>Ringkasan kondisi ekosistem saat ini.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              <div style={cardStyle}><h4 style={cardLabel}>PAKAN BERIKUTNYA</h4><h2 style={cardValue}>{data.jam_sore}:00</h2></div>
              <div style={cardStyle}>
                <h4 style={cardLabel}>KONTROL UDARA</h4>
                <h2 style={{ ...cardValue, color: data.kipas_on ? '#22c55e' : '#ef4444' }}>{data.kipas_on ? 'KIPAS ON' : 'KIPAS OFF'}</h2>
              </div>
              <div style={cardStyle}><h4 style={cardLabel}>HIDROPONIK</h4><h2 style={cardValue}>NORMAL</h2></div>
            </div>
          </div>
        )}

        {/* --- PAKAN PINTAR --- */}
        {halaman === 'pakan' && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={formContainer}>
              <h2 style={{ color: '#38bdf8', textAlign: 'center', marginBottom: '20px' }}>Set Jadwal Pakan</h2>
              <label style={labelStyle}>JADWAL PAGI</label>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '15px' }}>
                <input type="number" value={data.jam_pagi} onChange={(e) => setData({...data, jam_pagi: e.target.value})} style={inputStyle} />
                <span style={divider}>:</span>
                <input type="number" value={data.menit_pagi} onChange={(e) => setData({...data, menit_pagi: e.target.value})} style={inputStyle} />
              </div>
              <label style={labelStyle}>DURASI (DETIK)</label>
              <input type="number" value={data.durasi_detik} onChange={(e) => setData({...data, durasi_detik: e.target.value})} style={inputStyle} />
              <button onClick={handleUpdatePakan} style={updateBtnStyle}>SIMPAN JADWAL</button>
            </div>
          </div>
        )}

        {/* --- LOG IKAN & AIR (Disederhanakan) --- */}
        {(halaman === 'log' || halaman === 'air') && (
           <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
              <h2 style={{ color: '#38bdf8' }}>Halaman {halaman === 'log' ? 'Jurnal Ikan' : 'Log Pengurasan'}</h2>
              <p>Gunakan formulir untuk mencatat aktivitas pemeliharaan harian.</p>
              {/* Gunakan logika input yang sama seperti kode lama Anda di sini */}
           </div>
        )}

        {/* --- HIDROPONIK (NEW) --- */}
        {halaman === 'hidroponik' && (
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h2 style={{ color: '#38bdf8', marginBottom: '20px' }}>🌱 Jurnal Hidroponik</h2>
            <div style={jurnalBox}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <input placeholder="Nama Tanaman" value={hidroInput.namaTanaman} onChange={e=>setHidroInput({...hidroInput, namaTanaman:e.target.value})} style={inputStyle} />
                <input type="date" value={hidroInput.tglTanam} onChange={e=>setHidroInput({...hidroInput, tglTanam:e.target.value})} style={inputStyle} />
                <input placeholder="Nutrisi/Pupuk" value={hidroInput.jenisPupuk} onChange={e=>setHidroInput({...hidroInput, jenisPupuk:e.target.value})} style={inputStyle} />
                <input placeholder="Status (Bagus/Hama)" value={hidroInput.status} onChange={e=>setHidroInput({...hidroInput, status:e.target.value})} style={inputStyle} />
              </div>
              <button onClick={handleSimpanHidro} style={updateBtnStyle}>TAMBAH DATA TANAMAN</button>
            </div>

            <div style={historyBox}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ color: '#38bdf8', borderBottom: '1px solid #334155' }}>
                    <th style={thStyle}>Tanaman</th>
                    <th style={thStyle}>Tgl Tanam</th>
                    <th style={thStyle}>Pupuk</th>
                    <th style={thStyle}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {listHidro.map(item => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #1e293b' }}>
                      <td style={tdStyle}>{item.namaTanaman}</td>
                      <td style={tdStyle}>{item.tglTanam}</td>
                      <td style={tdStyle}>{item.jenisPupuk}</td>
                      <td style={tdStyle}>{item.status}</td>
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

// Styling tetap konsisten dengan tema Dark Mode Anda
const btnStyle = (aktif) => ({ background: aktif ? '#38bdf8' : '#1e293b', color: aktif ? '#0f172a' : '#94a3b8', border: 'none', padding: '12px 20px', borderRadius: '10px', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold' });
const cardStyle = { background: '#1e293b', padding: '20px', borderRadius: '15px', border: '1px solid #334155', textAlign: 'center' };
const cardLabel = { color: '#64748b', fontSize: '12px', marginBottom: '10px' };
const cardValue = { color: '#38bdf8', fontSize: '28px', margin: '0' };
const formContainer = { background: '#1e293b', padding: '30px', borderRadius: '20px', width: '100%', maxWidth: '400px' };
const inputStyle = { background: '#0f172a', border: '1px solid #334155', padding: '12px', borderRadius: '10px', color: '#38bdf8', width: '100%', marginBottom: '10px', outline: 'none' };
const updateBtnStyle = { width: '100%', background: '#22c55e', color: 'white', border: 'none', padding: '15px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' };
const labelStyle = { fontSize: '11px', color: '#64748b', fontWeight: 'bold', display: 'block', marginBottom: '5px' };
const divider = { color: '#38bdf8', fontWeight: 'bold' };
const historyBox = { background: '#1e293b', borderRadius: '15px', padding: '15px', marginTop: '20px' };
const thStyle = { textAlign: 'left', padding: '10px', fontSize: '14px' };
const tdStyle = { padding: '10px', fontSize: '14px', color: '#cbd5e1' };
const jurnalBox = { background: '#1e293b', padding: '20px', borderRadius: '15px', marginBottom: '20px' };

export default App;
