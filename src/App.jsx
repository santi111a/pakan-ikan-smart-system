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

  // State untuk Jurnal Ikan
  const [jurnalInput, setJurnalInput] = useState({ tglBibit: '', jumlahIkan: '', ukuranBibit: '', tglSortir: '' });
  const [listJurnal, setListJurnal] = useState([]);

  // State untuk Log Air (Jurnal Pengurasan)
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

  const handleUpdatePakan = () => {
    const dbRef = ref(db, '/');
    update(dbRef, { 
      ...data, 
      Jadwal: Number(data.Jadwal), 
      end_date: Number(data.end_date),
      jam_sore: Number(data.jam_sore),
      menit_sore: Number(data.menit_sore)
    }).then(() => alert("✅ Pengaturan Pakan Berhasil Diperbarui!"));
  };

  const handleSimpanJurnalIkan = () => {
    push(ref(db, 'jurnal_harian'), jurnalInput).then(() => {
      alert("✅ Jurnal Ikan Tersimpan!");
      setJurnalInput({ tglBibit: '', jumlahIkan: '', ukuranBibit: '', tglSortir: '' });
    });
  };

  const handleSimpanKuras = () => {
    if (!kurasInput.tglKuras) return alert("Isi tanggal pengurasan!");
    push(ref(db, 'jurnal_kuras'), kurasInput).then(() => {
      alert("✅ Catatan Log Air Tersimpan!");
      setKurasInput({ tglKuras: '', kondisiAir: '', keterangan: '' });
    });
  };

  const Sidebar = () => (
    <div style={{ width: '300px', background: '#0f172a', padding: '25px', borderRight: '1px solid #38bdf8', height: '100vh', position: 'sticky', top: 0 }}>
      <h2 style={{ color: '#38bdf8', textAlign: 'center', marginBottom: '30px', fontSize: '22px' }}>Sistem Cerdas Santi</h2>
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
    <div style={{ display: 'flex', backgroundColor: '#0b1120', color: '#f8fafc', minHeight: '100vh', fontFamily: 'Arial' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        
        {/* --- HALAMAN BERANDA --- */}
        {halaman === 'beranda' && (
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h1 style={{ color: '#38bdf8', fontSize: '36px', marginBottom: '10px' }}>Selamat Datang</h1>
            <p style={{ color: '#94a3b8', fontSize: '18px', marginBottom: '40px' }}>Dashboard monitoring ekosistem kolam cerdas Anda.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
               <div style={cardStyle}><h4>JADWAL SORE</h4><h2>{data.jam_sore}:{data.menit_sore}</h2></div>
               <div style={cardStyle}><h4>STATUS KIPAS</h4><h2 style={{color: data.kipas_on ? '#22c55e' : '#ef4444'}}>{data.kipas_on ? 'ON' : 'OFF'}</h2></div>
               <div style={cardStyle}><h4>HIDROPONIK</h4><h2>AKTIF</h2></div>
            </div>
          </div>
        )}

        {/* --- HALAMAN PAKAN PINTAR --- */}
        {halaman === 'pakan' && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={formBox}>
              <h2 style={{ color: '#38bdf8', textAlign: 'center', marginBottom: '25px' }}>Pengaturan Pakan</h2>
              <label style={labelMini}>RENTANG TANGGAL (MULAI - SELESAI)</label>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <input type="number" value={data.Jadwal} onChange={(e)=>setData({...data, Jadwal: e.target.value})} style={inputStyle} />
                <input type="number" value={data.end_date} onChange={(e)=>setData({...data, end_date: e.target.value})} style={inputStyle} />
              </div>
              <label style={labelMini}>WAKTU SORE (JAM : MENIT)</label>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input type="number" value={data.jam_sore} onChange={(e)=>setData({...data, jam_sore: e.target.value})} style={inputStyle} />
                <span style={{color:'#38bdf8', fontWeight:'bold'}}>:</span>
                <input type="number" value={data.menit_sore} onChange={(e)=>setData({...data, menit_sore: e.target.value})} style={inputStyle} />
              </div>
              <button onClick={handleUpdatePakan} style={updateBtnStyle}>UPDATE JADWAL</button>
            </div>
          </div>
        )}

        {/* --- HALAMAN LOG JURNAL IKAN --- */}
        {halaman === 'log' && (
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h2 style={{ color: '#38bdf8', marginBottom: '20px' }}>📝 Log Jurnal Ikan</h2>
            <div style={formBox}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <input type="date" value={jurnalInput.tglBibit} onChange={(e)=>setJurnalInput({...jurnalInput, tglBibit: e.target.value})} style={inputStyle} />
                <input type="number" placeholder="Jumlah Bibit" value={jurnalInput.jumlahIkan} onChange={(e)=>setJurnalInput({...jurnalInput, jumlahIkan: e.target.value})} style={inputStyle} />
              </div>
              <button onClick={handleSimpanJurnalIkan} style={updateBtnStyle}>SIMPAN JURNAL</button>
            </div>
          </div>
        )}

        {/* --- HALAMAN LOG AIR (JURNAL KURAS) --- */}
        {halaman === 'air' && (
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h2 style={{ color: '#38bdf8', marginBottom: '20px' }}>💧 Log Air (Riwayat Pengurasan)</h2>
            <div style={formBox}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={labelMini}>TANGGAL KURAS</label>
                  <input type="date" value={kurasInput.tglKuras} onChange={(e)=>setKurasInput({...kurasInput, tglKuras: e.target.value})} style={inputStyle} />
                </div>
                <div>
                  <label style={labelMini}>KONDISI AIR SEBELUM</label>
                  <input type="text" placeholder="Contoh: Sangat Keruh" value={kurasInput.kondisiAir} onChange={(e)=>setKurasInput({...kurasInput, kondisiAir: e.target.value})} style={inputStyle} />
                </div>
              </div>
              <label style={labelMini}>KETERANGAN</label>
              <input type="text" placeholder="Catatan tambahan..." value={kurasInput.keterangan} onChange={(e)=>setKurasInput({...kurasInput, keterangan: e.target.value})} style={inputStyle} />
              <button onClick={handleSimpanKuras} style={updateBtnStyle}>SIMPAN DATA KURAS</button>
            </div>

            <div style={tableBox}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ color: '#38bdf8', borderBottom: '1px solid #334155' }}>
                    <th style={{padding:'10px'}}>Tanggal</th><th style={{padding:'10px'}}>Kondisi</th><th style={{padding:'10px'}}>Keterangan</th>
                  </tr>
                </thead>
                <tbody>
                  {listKuras.map(k => (
                    <tr key={k.id} style={{ borderBottom: '1px solid #1e293b' }}>
                      <td style={{padding:'10px'}}>{k.tglKuras}</td><td style={{padding:'10px'}}>{k.kondisiAir}</td><td style={{padding:'10px'}}>{k.keterangan}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {halaman === 'hidroponik' && (
          <div style={{ textAlign: 'center', marginTop: '100px' }}>
            <h1 style={{ color: '#38bdf8' }}>HALAMAN HIDROPONIK</h1>
            <p style={{ color: '#64748b' }}>Data sedang dalam sinkronisasi.</p>
          </div>
        )}

      </div>
    </div>
  );
}

// --- STYLES (KONSISTEN) ---
const btnStyle = (aktif) => ({ background: aktif ? '#38bdf8' : '#1e293b', color: aktif ? '#0f172a' : '#94a3b8', border: 'none', padding: '12px 15px', borderRadius: '10px', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold', width: '100%' });
const cardStyle = { background: '#1e293b', padding: '20px', borderRadius: '15px', textAlign: 'center', border: '1px solid #334155' };
const formBox = { background: '#1e293b', padding: '25px', borderRadius: '20px', border: '1px solid #334155', marginBottom: '20px', width: '100%', maxWidth: '600px' };
const tableBox = { background: '#1e293b', padding: '20px', borderRadius: '20px', border: '1px solid #334155' };
const inputStyle = { background: '#0f172a', border: '1px solid #334155', padding: '12px', borderRadius: '10px', color: '#38bdf8', width: '100%', marginBottom: '10px', outline: 'none' };
const updateBtnStyle = { width: '100%', background: '#22c55e', color: 'white', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' };
const labelMini = { display: 'block', fontSize: '10px', color: '#64748b', marginBottom: '5px', fontWeight: 'bold' };

export default App;
