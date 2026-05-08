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

  const [jurnalInput, setJurnalInput] = useState({
    tglBibit: '',
    jumlahIkan: '',
    ukuranBibit: '',
    tglSortir: ''
  });
  const [listJurnal, setListJurnal] = useState([]);

  useEffect(() => {
    const dbRef = ref(db, '/'); 
    onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        const result = snapshot.val();
        setData(result);
        if (result.jurnal_harian) {
          const jurnalArray = Object.keys(result.jurnal_harian).map(key => ({
            id: key,
            ...result.jurnal_harian[key]
          }));
          setListJurnal(jurnalArray.reverse());
        }
      }
    });
  }, []);

  const handleUpdate = () => {
    const dbRef = ref(db, '/');
    const dataToUpdate = {
      ...data,
      Jadwal: Number(data.Jadwal),
      end_date: Number(data.end_date),
      jam_pagi: Number(data.jam_pagi),
      menit_pagi: Number(data.menit_pagi || 0),
      jam_sore: Number(data.jam_sore),
      menit_sore: Number(data.menit_sore || 0),
      durasi_detik: Number(data.durasi_detik)
    };
    update(dbRef, dataToUpdate).then(() => alert("✅ Data Berhasil Diperbarui!"));
  };

  const handleSimpanJurnal = () => {
    if (!jurnalInput.tglBibit || !jurnalInput.jumlahIkan) {
      alert("Mohon isi data tanggal dan jumlah bibit!");
      return;
    }
    const jurnalRef = ref(db, 'jurnal_harian');
    push(jurnalRef, jurnalInput).then(() => {
      alert("✅ Catatan Jurnal Berhasil Disimpan!");
      setJurnalInput({ tglBibit: '', jumlahIkan: '', ukuranBibit: '', tglSortir: '' });
    });
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
        
        {/* HALAMAN BERANDA (Desain Kembali Seperti Awal) */}
        {halaman === 'beranda' && (
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h1 style={{ color: '#38bdf8', marginBottom: '10px', fontSize: '36px' }}>Selamat Datang di Sistem Cerdas Santi</h1>
            <p style={{ color: '#94a3b8', fontSize: '18px', marginBottom: '40px', lineHeight: '1.6' }}>
              Solusi manajemen kolam pintar berbasis IoT untuk memudahkan pemantauan dan perawatan ekosistem air Anda secara otomatis dan real-time.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
              <div style={cardStyle}><h4 style={cardLabel}>STATUS PAKAN</h4><h2 style={cardValue}>{data.jam_sore}:00</h2><p style={{ color: '#64748b', fontSize: '12px' }}>Terjadwal Otomatis</p></div>
              <div style={cardStyle}><h4 style={cardLabel}>KONTROL UDARA</h4><h2 style={{ ...cardValue, color: data.kipas_on ? '#22c55e' : '#ef4444' }}>{data.kipas_on ? 'KIPAS ON' : 'KIPAS OFF'}</h2><p style={{ color: '#64748b', fontSize: '12px' }}>Sensor Suhu Aktif</p></div>
              <div style={cardStyle}><h4 style={cardLabel}>HIDROPONIK</h4><h2 style={cardValue}>STABIL</h2><p style={{ color: '#64748b', fontSize: '12px' }}>Sirkulasi Air Normal</p></div>
            </div>
            <hr style={{ border: '0.5px solid #1e293b', marginBottom: '40px' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
              <div style={guideBox}><h3 style={{ color: '#38bdf8', marginTop: 0 }}>📖 Apa itu Sistem Cerdas Santi?</h3><p style={guideText}>Aplikasi ini dirancang untuk mengintegrasikan perangkat keras (Hardware) dengan database Cloud. Anda dapat mengontrol pemberi pakan otomatis, memantau kualitas udara, hingga mengelola sistem hidroponik dalam satu dashboard.</p></div>
              <div style={guideBox}><h3 style={{ color: '#38bdf8', marginTop: 0 }}>🚀 Panduan Cepat</h3><ul style={{ ...guideText, paddingLeft: '20px' }}><li><b>Atur Pakan:</b> Masuk ke menu Pakan Pintar untuk mengatur jam dan durasi makan.</li><li><b>Monitor Log:</b> Periksa riwayat suhu dan aktivitas di menu Log Jurnal.</li><li><b>Otomatisasi:</b> Sistem bekerja berdasarkan data yang Anda input.</li></ul></div>
            </div>
          </div>
        )}

        {/* HALAMAN PAKAN PINTAR (Desain Kembali Seperti Awal) */}
        {halaman === 'pakan' && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={formContainer}>
              <h2 style={{ color: '#38bdf8', textAlign: 'center', fontSize: '26px', marginBottom: '5px' }}>Pengaturan Pakan</h2>
              <p style={{ color: '#64748b', textAlign: 'center', marginBottom: '30px', fontSize: '14px' }}>Konfigurasi Penjadwalan Alat</p>
              <div style={{ textAlign: 'left' }}>
                <label style={labelStyle}>RENTANG TANGGAL (MULAI - SELESAI)</label>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <input type="number" value={data.Jadwal} onChange={(e) => setData({...data, Jadwal: e.target.value})} style={inputStyle} />
                  <input type="number" value={data.end_date} onChange={(e) => setData({...data, end_date: e.target.value})} style={inputStyle} />
                </div>
                <label style={labelStyle}>JADWAL PAGI (JAM : MENIT)</label>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                  <input type="number" value={data.jam_pagi} onChange={(e) => setData({...data, jam_pagi: e.target.value})} style={inputStyle} />
                  <span style={divider}>:</span>
                  <input type="number" value={data.menit_pagi || 0} onChange={(e) => setData({...data, menit_pagi: e.target.value})} style={inputStyle} />
                </div>
                <label style={labelStyle}>JADWAL SORE (JAM : MENIT)</label>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                  <input type="number" value={data.jam_sore} onChange={(e) => setData({...data, jam_sore: e.target.value})} style={inputStyle} />
                  <span style={divider}>:</span>
                  <input type="number" value={data.menit_sore || 0} onChange={(e) => setData({...data, menit_sore: e.target.value})} style={inputStyle} />
                </div>
                <label style={labelStyle}>DURASI PAKAN (DETIK)</label>
                <input type="number" value={data.durasi_detik} onChange={(e) => setData({...data, durasi_detik: e.target.value})} style={{...inputStyle, width: '100%'}} />
                <button onClick={handleUpdate} style={updateBtnStyle}>UPDATE DATA & AKTIFKAN</button>
              </div>
            </div>
          </div>
        )}

        {/* HALAMAN LOG JURNAL IKAN */}
        {halaman === 'log' && (
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h2 style={{ color: '#38bdf8', marginBottom: '25px' }}>Catatan Harian Budidaya Ikan</h2>
            <div style={{ background: '#1e293b', padding: '30px', borderRadius: '20px', marginBottom: '30px', border: '1px solid #334155' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div><label style={labelStyle}>TANGGAL MASUK BIBIT</label><input type="date" value={jurnalInput.tglBibit} onChange={(e)=>setJurnalInput({...jurnalInput, tglBibit: e.target.value})} style={inputStyle} /></div>
                <div><label style={labelStyle}>JUMLAH BIBIT (EKOR)</label><input type="number" placeholder="Contoh: 500" value={jurnalInput.jumlahIkan} onChange={(e)=>setJurnalInput({...jurnalInput, jumlahIkan: e.target.value})} style={inputStyle} /></div>
                <div><label style={labelStyle}>UKURAN BIBIT (CM)</label><input type="text" placeholder="Contoh: 5-7 cm" value={jurnalInput.ukuranBibit} onChange={(e)=>setJurnalInput({...jurnalInput, ukuranBibit: e.target.value})} style={inputStyle} /></div>
                <div><label style={labelStyle}>RENCANA TANGGAL SORTIR</label><input type="date" value={jurnalInput.tglSortir} onChange={(e)=>setJurnalInput({...jurnalInput, tglSortir: e.target.value})} style={inputStyle} /></div>
              </div>
              <button onClick={handleSimpanJurnal} style={{...updateBtnStyle, marginTop: '25px'}}>SIMPAN CATATAN HARIAN</button>
            </div>
            <div style={{ background: '#1e293b', borderRadius: '20px', padding: '20px', border: '1px solid #334155' }}>
              <h4 style={{ color: '#94a3b8', marginBottom: '15px' }}>Riwayat Log Ikan</h4>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #334155', color: '#38bdf8' }}>
                    <th style={thStyle}>Tgl Bibit</th><th style={thStyle}>Jumlah</th><th style={thStyle}>Ukuran</th><th style={thStyle}>Tgl Sortir</th>
                  </tr>
                </thead>
                <tbody>
                  {listJurnal.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #1e293b' }}>
                      <td style={tdStyle}>{item.tglBibit}</td><td style={tdStyle}>{item.jumlahIkan} Ekor</td><td style={tdStyle}>{item.ukuranBibit}</td><td style={tdStyle}>{item.tglSortir}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {(halaman === 'air' || halaman === 'hidroponik') && (
          <div style={{ textAlign: 'center', marginTop: '100px' }}>
            <h1 style={{ fontSize: '40px', color: '#38bdf8' }}>Halaman {halaman.toUpperCase()}</h1>
            <p style={{ color: '#64748b' }}>Fitur ini sedang dalam sinkronisasi dengan database sensor.</p>
          </div>
        )}
      </div>
    </div>
  );
}

const btnStyle = (aktif) => ({ background: aktif ? 'linear-gradient(90deg, #38bdf8, #0ea5e9)' : '#1e293b', color: aktif ? '#0f172a' : '#94a3b8', border: 'none', padding: '14px 20px', borderRadius: '12px', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold', fontSize: '15px' });
const cardStyle = { background: '#1e293b', padding: '25px', borderRadius: '20px', border: '1px solid #334155', textAlign: 'center' };
const cardLabel = { color: '#64748b', fontSize: '11px', fontWeight: '800', letterSpacing: '1px', marginBottom: '10px' };
const cardValue = { color: '#38bdf8', fontSize: '32px', margin: '0' };
const guideBox = { background: '#1e293b', padding: '25px', borderRadius: '20px', border: '1px solid #334155' };
const guideText = { color: '#94a3b8', fontSize: '14px', lineHeight: '1.8' };
const formContainer = { background: '#1e293b', padding: '40px', borderRadius: '35px', width: '100%', maxWidth: '500px', border: '1px solid #334155' };
const labelStyle = { display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '10px', marginTop: '20px', fontWeight: '800' };
const inputStyle = { background: '#0f172a', border: '1px solid #334155', padding: '15px', borderRadius: '15px', color: '#38bdf8', textAlign: 'center', fontSize: '20px', fontWeight: 'bold', width: '100%', outline: 'none' };
const divider = { color: '#38bdf8', fontWeight: 'bold', fontSize: '24px' };
const updateBtnStyle = { width: '100%', background: '#22c55e', color: '#ffffff', border: 'none', padding: '20px', borderRadius: '18px', marginTop: '35px', fontWeight: '900', cursor: 'pointer' };
const thStyle = { textAlign: 'left', padding: '12px', color: '#64748b' };
const tdStyle = { padding: '12px', color: '#cbd5e1' };

export default App;
