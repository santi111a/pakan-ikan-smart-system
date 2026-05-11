import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { ref, onValue, update, push } from "firebase/database";

// --- STYLES (Ditaruh di luar agar kodingan bersih) ---
const styles = {
  dashboardContainer: { padding: '20px', maxWidth: '500px', margin: '0 auto' },
  menuGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', marginTop: '20px' },
  menuCard: { background: '#1e293b', padding: '20px', borderRadius: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '1px solid #334155', transition: '0.3s' },
  iconCircle: { width: '50px', height: '50px', background: '#0f172a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '10px' },
  menuLabel: { fontSize: '14px', fontWeight: 'bold', color: '#cbd5e1' },
  formContainer: { background: '#1e293b', padding: '25px', borderRadius: '20px', width: '100%', maxWidth: '450px', border: '1px solid #334155', margin: '0 auto' },
  labelStyle: { display: 'block', fontSize: '11px', color: '#64748b', marginBottom: '5px', fontWeight: 'bold', textTransform: 'uppercase' },
  inputStyle: { background: '#0f172a', border: '1px solid #334155', padding: '12px', borderRadius: '8px', color: '#38bdf8', fontSize: '14px', width: '100%', boxSizing: 'border-box', outline: 'none', marginTop: '5px' },
  updateBtnStyle: { width: '100%', background: '#0ea5e9', color: 'white', border: 'none', padding: '14px', borderRadius: '10px', marginTop: '20px', fontWeight: 'bold', cursor: 'pointer' },
  jurnalBox: { background: '#1e293b', padding: '30px', borderRadius: '16px', border: '1px solid #334155', marginBottom: '20px' },
  historyBox: { background: '#1e293b', borderRadius: '16px', padding: '20px', border: '1px solid #334155', overflowX: 'auto', marginTop: '20px' },
  thStyle: { textAlign: 'left', padding: '15px 10px', fontSize: '12px', color: '#38bdf8', borderBottom: '2px solid #334155' },
  tdStyle: { padding: '15px 10px', fontSize: '13px', color: '#cbd5e1', borderBottom: '1px solid #1e293b' }
};

const btnStyle = (aktif) => ({
  background: aktif ? '#38bdf8' : '#1e293b',
  color: aktif ? '#0f172a' : '#94a3b8',
  border: 'none',
  padding: '12px 15px',
  borderRadius: '10px',
  cursor: 'pointer',
  fontWeight: 'bold',
  width: '100%',
  marginBottom: '10px'
});

function App() {
  const [halaman, setHalaman] = useState('beranda');

  // STATE
  const [data, setData] = useState({ Jadwal: 0, end_date: 0, jam_pagi: 0, menit_pagi: 0, jam_sore: 0, menit_sore: 0, durasi_detik: 0 });
  const [hidroInput, setHidroInput] = useState({ tglTanam: '', namaTanaman: '', pupuk: '', hama: 'Aman', jumlahPanen: '', hargaJual: '' });
  const [listHidro, setListHidro] = useState([]);
  const [jurnalInput, setJurnalInput] = useState({ tglBibit: '', jumlahIkan: '', ukuranBibit: '', tglSortir: '' });
  const [listJurnal, setListJurnal] = useState([]);
  const [airInput, setAirInput] = useState({ tglKuras: '', kondisiAir: '', keterangan: '' });
  const [listAir, setListAir] = useState([]);

  useEffect(() => {
    onValue(ref(db, '/'), (snapshot) => {
      if (snapshot.exists()) {
        const result = snapshot.val();
        setData(result);
        if (result.jurnal_harian) setListJurnal(Object.keys(result.jurnal_harian).map(k => ({ id: k, ...result.jurnal_harian[k] })).reverse());
        if (result.log_pengurasan) setListAir(Object.keys(result.log_pengurasan).map(k => ({ id: k, ...result.log_pengurasan[k] })).reverse());
        if (result.jurnal_hidroponik) setListHidro(Object.keys(result.jurnal_hidroponik).map(k => ({ id: k, ...result.jurnal_hidroponik[k] })).reverse());
      }
    });
  }, []);

  const handleUpdatePakan = () => {
    update(ref(db, '/'), { ...data, Jadwal: Number(data.Jadwal), end_date: Number(data.end_date), jam_pagi: Number(data.jam_pagi), menit_pagi: Number(data.menit_pagi), jam_sore: Number(data.jam_sore), menit_sore: Number(data.menit_sore), durasi_detik: Number(data.durasi_detik) })
    .then(() => alert("✅ Pengaturan Pakan Diperbarui!"));
  };

  const handleSimpanHidro = () => {
    push(ref(db, 'jurnal_hidroponik'), { ...hidroInput, hargaJual: Number(hidroInput.hargaJual) })
    .then(() => { alert("✅ Data Hidroponik Tersimpan!"); setHidroInput({ tglTanam: '', namaTanaman: '', pupuk: '', hama: 'Aman', jumlahPanen: '', hargaJual: '' }); });
  };

  const handleSimpanJurnalIkan = () => {
    push(ref(db, 'jurnal_harian'), jurnalInput).then(() => { alert("✅ Jurnal Ikan Tersimpan!"); setJurnalInput({ tglBibit: '', jumlahIkan: '', ukuranBibit: '', tglSortir: '' }); });
  };

  const handleSimpanAir = () => {
    push(ref(db, 'log_pengurasan'), airInput).then(() => { alert("✅ Log Air Tersimpan!"); setAirInput({ tglKuras: '', kondisiAir: '', keterangan: '' }); });
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: 'white', fontFamily: 'sans-serif' }}>
      
      {/* HEADER */}
      <div style={{ padding: '20px', borderBottom: '1px solid #1e293b', textAlign: 'center', background: '#0f172a' }}>
        <h2 style={{ color: '#38bdf8', margin: 0, fontSize: '18px', fontWeight: 'bold' }}>Smart Farming KSTM Al-Ihya</h2>
      </div>

      <div style={{ padding: '15px' }}>
        
        {/* MENU DASHBOARD */}
        {halaman === 'beranda' && (
          <div style={styles.dashboardContainer}>
            <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>Pilih Menu Kontrol:</p>
            <div style={styles.menuGrid}>
              <div onClick={() => setHalaman('pakan')} style={styles.menuCard}>
                <div style={styles.iconCircle}>🐟</div>
                <span style={styles.menuLabel}>Pakan Pintar</span>
              </div>
              <div onClick={() => setHalaman('log')} style={styles.menuCard}>
                <div style={styles.iconCircle}>📝</div>
                <span style={styles.menuLabel}>Jurnal Ikan</span>
              </div>
              <div onClick={() => setHalaman('air')} style={styles.menuCard}>
                <div style={styles.iconCircle}>💧</div>
                <span style={styles.menuLabel}>Log Air</span>
              </div>
              <div onClick={() => setHalaman('hidroponik')} style={styles.menuCard}>
                <div style={styles.iconCircle}>🌱</div>
                <span style={styles.menuLabel}>Hidroponik</span>
              </div>
            </div>
          </div>
        )}

        {/* AREA FORMULIR */}
        {halaman !== 'beranda' && (
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <button onClick={() => setHalaman('beranda')} style={btnStyle(false)}>⬅ Kembali ke Dashboard</button>
            
            {halaman === 'pakan' && (
              <div style={styles.formContainer}>
                <h2 style={{ color: '#38bdf8', textAlign: 'center' }}>Pengaturan Pakan</h2>
                <label style={styles.labelStyle}>RENTANG TANGGAL (MULAI - SELESAI)</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input type="number" value={data.Jadwal} onChange={(e) => setData({ ...data, Jadwal: e.target.value })} style={styles.inputStyle} />
                  <input type="number" value={data.end_date} onChange={(e) => setData({ ...data, end_date: e.target.value })} style={styles.inputStyle} />
                </div>
                <label style={styles.labelStyle}>JADWAL PAGI</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input type="number" value={data.jam_pagi} onChange={(e) => setData({ ...data, jam_pagi: e.target.value })} style={styles.inputStyle} />
                  <input type="number" value={data.menit_pagi} onChange={(e) => setData({ ...data, menit_pagi: e.target.value })} style={styles.inputStyle} />
                </div>
                <label style={styles.labelStyle}>DURASI (DETIK)</label>
                <input type="number" value={data.durasi_detik} onChange={(e) => setData({ ...data, durasi_detik: e.target.value })} style={styles.inputStyle} />
                <button onClick={handleUpdatePakan} style={styles.updateBtnStyle}>UPDATE DATA</button>
              </div>
            )}

            {halaman === 'hidroponik' && (
              <div>
                <div style={styles.jurnalBox}>
                  <h2 style={{ color: '#38bdf8' }}>🌱 Input Hidroponik</h2>
                  <input type="date" value={hidroInput.tglTanam} onChange={(e) => setHidroInput({ ...hidroInput, tglTanam: e.target.value })} style={styles.inputStyle} />
                  <input type="text" placeholder="Nama Tanaman" value={hidroInput.namaTanaman} onChange={(e) => setHidroInput({ ...hidroInput, namaTanaman: e.target.value })} style={styles.inputStyle} />
                  <button onClick={handleSimpanHidro} style={styles.updateBtnStyle}>SIMPAN DATA</button>
                </div>
                <div style={styles.historyBox}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead><tr><th style={styles.thStyle}>Tanggal</th><th style={styles.thStyle}>Tanaman</th><th style={styles.thStyle}>Harga</th></tr></thead>
                    <tbody>
                      {listHidro.map((item) => (
                        <tr key={item.id}><td style={styles.tdStyle}>{item.tglTanam}</td><td style={styles.tdStyle}>{item.namaTanaman}</td><td style={styles.tdStyle}>Rp {item.hargaJual}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {halaman === 'log' && (
               <div>
                 <div style={styles.jurnalBox}>
                   <h2 style={{ color: '#38bdf8' }}>📝 Input Jurnal Ikan</h2>
                   <input type="date" value={jurnalInput.tglBibit} onChange={(e) => setJurnalInput({ ...jurnalInput, tglBibit: e.target.value })} style={styles.inputStyle} />
                   <input type="number" placeholder="Jumlah Ekor" value={jurnalInput.jumlahIkan} onChange={(e) => setJurnalInput({ ...jurnalInput, jumlahIkan: e.target.value })} style={styles.inputStyle} />
                   <button onClick={handleSimpanJurnalIkan} style={styles.updateBtnStyle}>SIMPAN JURNAL</button>
                 </div>
                 <div style={styles.historyBox}>
                   <table style={{ width: '100%' }}>
                     <thead><tr><th style={styles.thStyle}>Tgl Bibit</th><th style={styles.thStyle}>Jumlah</th></tr></thead>
                     <tbody>
                       {listJurnal.map((item) => (
                         <tr key={item.id}><td style={styles.tdStyle}>{item.tglBibit}</td><td style={styles.tdStyle}>{item.jumlahIkan} Ekor</td></tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
               </div>
            )}

            {halaman === 'air' && (
               <div>
                 <div style={styles.jurnalBox}>
                   <h2 style={{ color: '#38bdf8' }}>💧 Log Air</h2>
                   <input type="date" value={airInput.tglKuras} onChange={(e) => setAirInput({ ...airInput, tglKuras: e.target.value })} style={styles.inputStyle} />
                   <input type="text" placeholder="Kondisi Air" value={airInput.kondisiAir} onChange={(e) => setAirInput({ ...airInput, kondisiAir: e.target.value })} style={styles.inputStyle} />
                   <button onClick={handleSimpanAir} style={styles.updateBtnStyle}>SIMPAN LOG</button>
                 </div>
                 <div style={styles.historyBox}>
                   <table style={{ width: '100%' }}>
                     <thead><tr><th style={styles.thStyle}>Tanggal</th><th style={styles.thStyle}>Kondisi</th></tr></thead>
                     <tbody>
                       {listAir.map((item) => (
                         <tr key={item.id}><td style={styles.tdStyle}>{item.tglKuras}</td><td style={styles.tdStyle}>{item.kondisiAir}</td></tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
               </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}

export default App;