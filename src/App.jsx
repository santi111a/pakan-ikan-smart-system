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
    kipas_on: false,
    suhu: 0,
    kelembapan: 0
  });

  // State untuk Jurnal Ikan
  const [jurnalInput, setJurnalInput] = useState({ tglBibit: '', jumlahIkan: '', ukuranBibit: '', tglSortir: '' });
  const [listJurnal, setListJurnal] = useState([]);

  // State BARU untuk Jurnal Pengurasan Air
  const [kurasInput, setKurasInput] = useState({ tglKuras: '', kondisiAir: '', keterangan: '' });
  const [listKuras, setListKuras] = useState([]);

  useEffect(() => {
    const dbRef = ref(db, '/'); 
    onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        const result = snapshot.val();
        setData(result);
        
        // Ambil list jurnal ikan
        if (result.jurnal_harian) {
          setListJurnal(Object.keys(result.jurnal_harian).map(key => ({ id: key, ...result.jurnal_harian[key] })).reverse());
        }
        // Ambil list jurnal pengurasan air
        if (result.jurnal_kuras) {
          setListKuras(Object.keys(result.jurnal_kuras).map(key => ({ id: key, ...result.jurnal_kuras[key] })).reverse());
        }
      }
    });
  }, []);

  const handleUpdate = () => {
    const dbRef = ref(db, '/');
    update(dbRef, { ...data, Jadwal: Number(data.Jadwal), end_date: Number(data.end_date) }).then(() => alert("✅ Update Berhasil!"));
  };

  const handleSimpanJurnal = () => {
    push(ref(db, 'jurnal_harian'), jurnalInput).then(() => {
      alert("✅ Jurnal Ikan Tersimpan!");
      setJurnalInput({ tglBibit: '', jumlahIkan: '', ukuranBibit: '', tglSortir: '' });
    });
  };

  // Fungsi Simpan Jurnal Pengurasan Air
  const handleSimpanKuras = () => {
    if (!kurasInput.tglKuras) return alert("Isi tanggal pengurasan!");
    push(ref(db, 'jurnal_kuras'), kurasInput).then(() => {
      alert("✅ Jadwal Kuras Tersimpan!");
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
        <button onClick={() => setHalaman('air')} style={btnStyle(halaman === 'air')}>💧 Log Air (Kuras)</button>
        <button onClick={() => setHalaman('kipas')} style={btnStyle(halaman === 'kipas')}>🌀 Log Kipas</button>
        <button onClick={() => setHalaman('hidroponik')} style={btnStyle(halaman === 'hidroponik')}>🌱 Hidroponik</button>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', backgroundColor: '#0b1120', color: '#f8fafc', minHeight: '100vh', fontFamily: 'Arial' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '40px' }}>
        
        {/* BERANDA & PAKAN PINTAR tetap sama seperti kodingan sebelumnya */}
        {halaman === 'beranda' && (
           <div style={{ maxWidth: '900px', margin: '0 auto' }}>
           <h1 style={{ color: '#38bdf8', fontSize: '36px' }}>Selamat Datang</h1>
           <p style={{ color: '#94a3b8', fontSize: '18px' }}>Dashboard monitoring ekosistem kolam cerdas Anda.</p>
         </div>
        )}

        {/* LOG JURNAL IKAN */}
        {halaman === 'log' && (
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h2 style={{ color: '#38bdf8' }}>📝 Jurnal Ikan</h2>
            <div style={formBox}>
              <input type="date" value={jurnalInput.tglBibit} onChange={(e)=>setJurnalInput({...jurnalInput, tglBibit: e.target.value})} style={inputStyle} />
              <input type="number" placeholder="Jumlah Bibit" value={jurnalInput.jumlahIkan} onChange={(e)=>setJurnalInput({...jurnalInput, jumlahIkan: e.target.value})} style={inputStyle} />
              <button onClick={handleSimpanJurnal} style={updateBtnStyle}>SIMPAN</button>
            </div>
          </div>
        )}

        {/* HALAMAN LOG AIR (Sekarang Jadi Jurnal Pengurasan) */}
        {halaman === 'air' && (
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h2 style={{ color: '#38bdf8', marginBottom: '20px' }}>💧 Jurnal Pengurasan Air</h2>
            <div style={formBox}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={labelMini}>TANGGAL PENGURASAN</label>
                  <input type="date" value={kurasInput.tglKuras} onChange={(e)=>setKurasInput({...kurasInput, tglKuras: e.target.value})} style={inputStyle} />
                </div>
                <div>
                  <label style={labelMini}>KONDISI AIR (SEBELUM)</label>
                  <input type="text" placeholder="Misal: Keruh / Hijau" value={kurasInput.kondisiAir} onChange={(e)=>setKurasInput({...kurasInput, kondisiAir: e.target.value})} style={inputStyle} />
                </div>
              </div>
              <label style={labelMini}>KETERANGAN / CATATAN TAMBAHAN</label>
              <input type="text" placeholder="Misal: Ganti air 50%, pembersihan filter" value={kurasInput.keterangan} onChange={(e)=>setKurasInput({...kurasInput, keterangan: e.target.value})} style={inputStyle} />
              <button onClick={handleSimpanKuras} style={updateBtnStyle}>SIMPAN JADWAL KURAS</button>
            </div>

            <div style={tableBox}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ color: '#38bdf8', borderBottom: '1px solid #334155', textAlign: 'left' }}>
                    <th style={{padding:'10px'}}>Tanggal</th>
                    <th style={{padding:'10px'}}>Kondisi</th>
                    <th style={{padding:'10px'}}>Keterangan</th>
                  </tr>
                </thead>
                <tbody>
                  {listKuras.map(k => (
                    <tr key={k.id} style={{ borderBottom: '1px solid #1e293b' }}>
                      <td style={{padding:'10px'}}>{k.tglKuras}</td>
                      <td style={{padding:'10px'}}>{k.kondisiAir}</td>
                      <td style={{padding:'10px'}}>{k.keterangan}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* HALAMAN LOG KIPAS (Monitoring Sensor Udara) */}
        {halaman === 'kipas' && (
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h2 style={{ color: '#38bdf8' }}>🌀 Monitoring Kipas & Suhu</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
              <div style={cardSmall}><h4 style={labelMini}>SUHU</h4><h2 style={cardVal}>{data.suhu}°C</h2></div>
              <div style={cardSmall}><h4 style={labelMini}>KELEMBAPAN</h4><h2 style={cardVal}>{data.kelembapan}%</h2></div>
            </div>
            <div style={{...formBox, textAlign:'center', marginTop:'20px'}}>
               <h3 style={{color: data.kipas_on ? '#22c55e' : '#ef4444'}}>STATUS: {data.kipas_on ? 'KIPAS BERPUTAR' : 'KIPAS MATI'}</h3>
               <p style={{fontSize:'12px', color:'#64748b'}}>Kipas otomatis menyala jika suhu > 30°C</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// STYLES
const btnStyle = (aktif) => ({ background: aktif ? '#38bdf8' : '#1e293b', color: aktif ? '#0f172a' : '#94a3b8', border: 'none', padding: '12px 15px', borderRadius: '10px', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold', width: '100%' });
const formBox = { background: '#1e293b', padding: '25px', borderRadius: '20px', border: '1px solid #334155', marginBottom: '20px' };
const tableBox = { background: '#1e293b', padding: '20px', borderRadius: '20px', border: '1px solid #334155' };
const inputStyle = { background: '#0f172a', border: '1px solid #334155', padding: '12px', borderRadius: '10px', color: '#38bdf8', width: '100%', marginBottom: '10px', outline: 'none' };
const updateBtnStyle = { width: '100%', background: '#22c55e', color: 'white', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' };
const labelMini = { display: 'block', fontSize: '10px', color: '#64748b', marginBottom: '5px', fontWeight: 'bold' };
const cardSmall = { background: '#1e293b', padding: '20px', borderRadius: '15px', textAlign: 'center', border: '1px solid #334155' };
const cardVal = { color: '#38bdf8', fontSize: '30px', margin: '0' };

export default App;
