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
        setData(prev => ({ ...prev, ...result }));
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

  // --- FUNGSI UPDATE ---
  const handleToggleKipas = () => {
    update(ref(db, '/'), { kipas_on: !data.kipas_on });
  };

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
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: 'white', fontFamily: 'sans-serif' }}>
      
      {/* HEADER */}
      <div style={{ padding: '20px', borderBottom: '1px solid #1e293b', textAlign: 'center', background: '#0f172a' }}>
        <h2 style={{ color: '#38bdf8', margin: 0, fontSize: '20px' }}>Santi Smart System</h2>
      </div>

      <div style={{ padding: '15px' }}>
        
        {/* --- DASHBOARD (Sesuai Gambar Referensi) --- */}
        {halaman === 'beranda' && (
          <div style={dashboardContainer}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <p style={{ color: '#94a3b8', fontSize: '14px' }}>Halo! Pilih menu monitor:</p>
            </div>

            <div style={menuGrid}>
              <div onClick={() => setHalaman('pakan')} style={menuCard}>
                <div style={iconCircle}>🐟</div>
                <span style={menuLabel}>Pakan Pintar</span>
                <span style={subLabel}>Pagi: {data.jam_pagi}:{data.menit_pagi}</span>
              </div>

              <div onClick={() => setHalaman('log')} style={menuCard}>
                <div style={iconCircle}>📓</div>
                <span style={menuLabel}>Jurnal Ikan</span>
                <span style={subLabel}>Sore: {data.jam_sore}:{data.menit_sore}</span>
              </div>

              <div onClick={() => setHalaman('air')} style={menuCard}>
                <div style={iconCircle}>💧</div>
                <span style={menuLabel}>Log Air</span>
                <span style={subLabel}>Status: {listAir[0]?.kondisiAir || 'Normal'}</span>
              </div>

              <div onClick={() => setHalaman('hidroponik')} style={menuCard}>
                <div style={iconCircle}>🌱</div>
                <span style={menuLabel}>Hidroponik</span>
                <span style={subLabel}>Hama: {hidroInput.hama}</span>
              </div>
            </div>

            {/* KONTROL KIPAS (MENU TAMBAHAN) */}
            <div style={{ marginTop: '25px', padding: '20px', background: '#1e293b', borderRadius: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 'bold' }}>Kontrol Kipas</div>
                <div style={{ fontSize: '12px', color: data.kipas_on ? '#10b981' : '#ef4444' }}>
                  {data.kipas_on ? '● Sedang Berputar' : '● Mati'}
                </div>
              </div>
              <button 
                onClick={handleToggleKipas}
                style={{ background: data.kipas_on ? '#ef4444' : '#10b981', border: 'none', color: 'white', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                {data.kipas_on ? 'OFF' : 'ON'}
              </button>
            </div>
          </div>
        )}

        {/* --- AREA ISI FORMULIR --- */}
        {halaman !== 'beranda' && (
          <div style={{ animation: 'fadeIn 0.3s' }}>
            <button 
              onClick={() => setHalaman('beranda')} 
              style={backBtnStyle}
            >
              ⬅ Kembali ke Dashboard
            </button>

            {/* FORM PAKAN */}
            {halaman === 'pakan' && (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={formContainer}>
                  <h2 style={{ color: '#38bdf8', textAlign: 'center', marginBottom: '20px' }}>⚙️ Pengaturan Pakan</h2>
                  <label style={labelStyle}>RENTANG TANGGAL</label>
                  <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                    <input type="number" value={data.Jadwal} onChange={(e) => setData({...data, Jadwal: e.target.value})} style={inputStyle} placeholder="Mulai" />
                    <input type="number" value={data.end_date} onChange={(e) => setData({...data, end_date: e.target.value})} style={inputStyle} placeholder="Selesai" />
                  </div>
                  <label style={labelStyle}>JADWAL PAGI</label>
                  <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '15px' }}>
                    <input type="number" value={data.jam_pagi} onChange={(e) => setData({...data, jam_pagi: e.target.value})} style={inputStyle} />
                    <span style={colonStyle}>:</span>
                    <input type="number" value={data.menit_pagi} onChange={(e) => setData({...data, menit_pagi: e.target.value})} style={inputStyle} />
                  </div>
                  <label style={labelStyle}>DURASI (DETIK)</label>
                  <input type="number" value={data.durasi_detik} onChange={(e) => setData({...data, durasi_detik: e.target.value})} style={inputStyle} />
                  <button onClick={handleUpdatePakan} style={updateBtnStyle}>UPDATE & AKTIFKAN</button>
                </div>
              </div>
            )}

            {/* JURNAL IKAN */}
            {halaman === 'log' && (
              <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                <div style={jurnalBox}>
                  <h3>📝 Jurnal Budidaya</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <input type="date" value={jurnalInput.tglBibit} onChange={(e)=>setJurnalInput({...jurnalInput, tglBibit: e.target.value})} style={inputStyle} />
                    <input type="number" placeholder="Jumlah" value={jurnalInput.jumlahIkan} onChange={(e)=>setJurnalInput({...jurnalInput, jumlahIkan: e.target.value})} style={inputStyle} />
                  </div>
                  <button onClick={handleSimpanJurnalIkan} style={updateBtnStyle}>SIMPAN DATA</button>
                </div>
                {/* Tabel History */}
                <div style={historyBox}>
                  <table style={tableStyle}>
                    <thead><tr><th>Tgl Bibit</th><th>Jumlah</th></tr></thead>
                    <tbody>{listJurnal.map(item => <tr key={item.id}><td>{item.tglBibit}</td><td>{item.jumlahIkan}</td></tr>)}</tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tambahkan bagian 'air' dan 'hidroponik' di sini dengan pola yang sama */}
          </div>
        )}
      </div>
    </div>
  );
}

// --- STYLES ---
const dashboardContainer = { maxWidth: '500px', margin: '0 auto' };
const menuGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' };
const menuCard = { 
  background: '#1e293b', padding: '20px', borderRadius: '20px', 
  display: 'flex', flexDirection: 'column', alignItems: 'center', 
  cursor: 'pointer', border: '1px solid #334155' 
};
const iconCircle = { fontSize: '32px', marginBottom: '10px' };
const menuLabel = { fontSize: '14px', fontWeight: 'bold' };
const subLabel = { fontSize: '11px', color: '#94a3b8', marginTop: '5px' };
const formContainer = { background: '#1e293b', padding: '25px', borderRadius: '20px', width: '100%', maxWidth: '400px' };
const inputStyle = { background: '#0f172a', border: '1px solid #334155', padding: '12px', borderRadius: '8px', color: '#38bdf8', width: '100%', marginBottom: '10px' };
const labelStyle = { fontSize: '10px', color: '#64748b', fontWeight: 'bold' };
const updateBtnStyle = { width: '100%', background: '#0ea5e9', color: 'white', border: 'none', padding: '14px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' };
const backBtnStyle = { background: '#1e293b', border: '1px solid #334155', color: '#38bdf8', padding: '12px', borderRadius: '10px', marginBottom: '20px', cursor: 'pointer', width: '100%' };
const colonStyle = { color: '#38bdf8', fontWeight: 'bold', fontSize: '20px' };
const jurnalBox = { background: '#1e293b', padding: '20px', borderRadius: '15px' };
const historyBox = { marginTop: '20px', background: '#1e293b', padding: '15px', borderRadius: '15px' };
const tableStyle = { width: '100%', textAlign: 'left', borderCollapse: 'collapse' };

export default App;