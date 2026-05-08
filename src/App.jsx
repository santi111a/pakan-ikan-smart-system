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

  // State khusus untuk Log Jurnal Ikan
  const [jurnalInput, setJurnalInput] = useState({
    tglBibit: '',
    jumlahIkan: '',
    ukuranBibit: '',
    tglSortir: ''
  });
  const [listJurnal, setListJurnal] = useState([]);

  // Sinkronisasi Data Real-time
  useEffect(() => {
    const dbRef = ref(db, '/'); 
    onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        const result = snapshot.val();
        setData(result);
        
        // Ambil data jurnal dari Firebase folder 'jurnal_harian'
        if (result.jurnal_harian) {
          const jurnalArray = Object.keys(result.jurnal_harian).map(key => ({
            id: key,
            ...result.jurnal_harian[key]
          }));
          setListJurnal(jurnalArray.reverse()); // Data terbaru muncul di atas
        }
      }
    });
  }, []);

  // Fungsi Simpan Jurnal Baru
  const handleSimpanJurnal = () => {
    if (!jurnalInput.tglBibit || !jurnalInput.jumlahIkan) {
      alert("Mohon isi minimal Tanggal Bibit dan Jumlah Ikan!");
      return;
    }
    const jurnalRef = ref(db, 'jurnal_harian');
    push(jurnalRef, jurnalInput).then(() => {
      alert("✅ Catatan Jurnal Berhasil Disimpan!");
      setJurnalInput({ tglBibit: '', jumlahIkan: '', ukuranBibit: '', tglSortir: '' });
    });
  };

  // Fungsi Update Pengaturan Pakan
  const handleUpdatePakan = () => {
    const dbRef = ref(db, '/');
    update(dbRef, {
      ...data,
      Jadwal: Number(data.Jadwal),
      end_date: Number(data.end_date),
      jam_pagi: Number(data.jam_pagi),
      jam_sore: Number(data.jam_sore),
      durasi_detik: Number(data.durasi_detik)
    }).then(() => alert("✅ Pengaturan Pakan Diperbarui!"));
  };

  const Sidebar = () => (
    <div style={{ width: '300px', background: '#0f172a', padding: '25px', borderRight: '1px solid #38bdf8', height: '100vh', position: 'sticky', top: 0 }}>
      <h2 style={{ color: '#38bdf8', textAlign: 'center', marginBottom: '30px', fontSize: '22px' }}>Sistem Cerdas Santi</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <button onClick={() => setHalaman('beranda')} style={btnStyle(halaman === 'beranda')}>🏠 Beranda</button>
        <button onClick={() => setHalaman('pakan')} style={btnStyle(halaman === 'pakan')}>🐟 Pakan Pintar</button>
        <button onClick={() => setHalaman('log')} style={btnStyle(halaman === 'log')}>📝 Log Jurnal Ikan</button>
        <button onClick={() => setHalaman('air')} style={btnStyle(halaman === 'air')}>💧 Log Udara</button>
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
            <h1 style={{ color: '#38bdf8', fontSize: '36px' }}>Selamat Datang</h1>
            <p style={{ color: '#94a3b8', fontSize: '18px', marginBottom: '40px' }}>Dashboard monitoring ekosistem kolam cerdas Anda.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              <div style={cardStyle}><h4 style={cardLabel}>JADWAL PAKAN</h4><h2 style={cardValue}>{data.jam_sore}:00</h2></div>
              <div style={cardStyle}><h4 style={cardLabel}>STATUS KIPAS</h4><h2 style={{...cardValue, color: data.kipas_on ? '#22c55e':'#ef4444'}}>{data.kipas_on ? 'ON':'OFF'}</h2></div>
              <div style={cardStyle}><h4 style={cardLabel}>TOTAL LOG</h4><h2 style={cardValue}>{listJurnal.length} Catatan</h2></div>
            </div>
          </div>
        )}

        {/* --- HALAMAN LOG JURNAL IKAN --- */}
        {halaman === 'log' && (
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h2 style={{ color: '#38bdf8', marginBottom: '25px' }}>📝 Jurnal Budidaya Ikan</h2>
            
            {/* Form Input untuk Konsumen */}
            <div style={{ background: '#1e293b', padding: '30px', borderRadius: '25px', marginBottom: '30px', border: '1px solid #334155' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={labelStyle}>TANGGAL MASUK BIBIT</label>
                  <input type="date" value={jurnalInput.tglBibit} onChange={(e)=>setJurnalInput({...jurnalInput, tglBibit: e.target.value})} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>JUMLAH BIBIT (EKOR)</label>
                  <input type="number" placeholder="Misal: 500" value={jurnalInput.jumlahIkan} onChange={(e)=>setJurnalInput({...jurnalInput, jumlahIkan: e.target.value})} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>UKURAN BIBIT (CM)</label>
                  <input type="text" placeholder="Misal: 5-7 cm" value={jurnalInput.ukuranBibit} onChange={(e)=>setJurnalInput({...jurnalInput, ukuranBibit: e.target.value})} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>TANGGAL SORTIR</label>
                  <input type="date" value={jurnalInput.tglSortir} onChange={(e)=>setJurnalInput({...jurnalInput, tglSortir: e.target.value})} style={inputStyle} />
                </div>
              </div>
              <button onClick={handleSimpanJurnal} style={updateBtnStyle}>SIMPAN KE JURNAL HARIAN</button>
            </div>

            {/* Tabel Tampilan Data */}
            <div style={{ background: '#1e293b', borderRadius: '20px', padding: '20px', border: '1px solid #334155' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #334155', color: '#38bdf8', textAlign: 'left' }}>
                    <th style={padingTabel}>Tgl Bibit</th>
                    <th style={padingTabel}>Jumlah</th>
                    <th style={padingTabel}>Ukuran</th>
                    <th style={padingTabel}>Tgl Sortir</th>
                  </tr>
                </thead>
                <tbody>
                  {listJurnal.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #0f172a' }}>
                      <td style={padingTabel}>{item.tglBibit}</td>
                      <td style={padingTabel}>{item.jumlahIkan} Ekor</td>
                      <td style={padingTabel}>{item.ukuranBibit}</td>
                      <td style={padingTabel}>{item.tglSortir}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- HALAMAN PAKAN PINTAR --- */}
        {halaman === 'pakan' && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={formContainer}>
              <h2 style={{ color: '#38bdf8', textAlign: 'center' }}>Pakan Pintar</h2>
              <label style={labelStyle}>RENTANG TANGGAL</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input type="number" value={data.Jadwal} onChange={(e)=>setData({...data, Jadwal: e.target.value})} style={inputStyle} />
                <input type="number" value={data.end_date} onChange={(e)=>setData({...data, end_date: e.target.value})} style={inputStyle} />
              </div>
              <label style={labelStyle}>JAM SORE</label>
              <input type="number" value={data.jam_sore} onChange={(e)=>setData({...data, jam_sore: e.target.value})} style={inputStyle} />
              <button onClick={handleUpdatePakan} style={updateBtnStyle}>UPDATE SISTEM</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// --- STYLES ---
const btnStyle = (aktif) => ({ background: aktif ? '#38bdf8' : '#1e293b', color: aktif ? '#0f172a' : '#94a3b8', border: 'none', padding: '14px 20px', borderRadius: '12px', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold', width: '100%' });
const cardStyle = { background: '#1e293b', padding: '25px', borderRadius: '20px', border: '1px solid #334155', textAlign: 'center' };
const cardLabel = { color: '#64748b', fontSize: '11px', fontWeight: '800', marginBottom: '10px' };
const cardValue = { color: '#38bdf8', fontSize: '32px', margin: '0' };
const formContainer = { background: '#1e293b', padding: '40px', borderRadius: '30px', width: '100%', maxWidth: '450px', border: '1px solid #334155' };
const labelStyle = { display: 'block', fontSize: '11px', color: '#64748b', marginBottom: '8px', marginTop: '15px', fontWeight: '800' };
const inputStyle = { background: '#0f172a', border: '1px solid #334155', padding: '12px', borderRadius: '10px', color: '#38bdf8', width: '100%', outline: 'none', boxSizing: 'border-box' };
const updateBtnStyle = { width: '100%', background: '#22c55e', color: 'white', border: 'none', padding: '15px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', marginTop: '20px' };
const padingTabel = { padding: '15px', fontSize: '14px' };

export default App;
