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

  // State Log Ikan
  const [jurnalInput, setJurnalInput] = useState({ tglBibit: '', jumlahIkan: '', ukuranBibit: '', tglSortir: '' });
  const [listJurnal, setListJurnal] = useState([]);

  // State Log Air
  const [airInput, setAirInput] = useState({ tglKuras: '', kondisiAir: '', keterangan: '' });
  const [listAir, setListAir] = useState([]);

  // State Hidroponik
  const [hidroInput, setHidroInput] = useState({ namaTanaman: '', tglTanam: '', pupuk: '', hama: 'Aman', hasilPanen: '', hargaJual: '' });
  const [listHidro, setListHidro] = useState([]);

  useEffect(() => {
    const dbRef = ref(db, '/'); 
    onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        const result = snapshot.val();
        setData(result);
        
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

  const handleUpdate = () => {
    update(ref(db, '/'), {
      ...data,
      Jadwal: Number(data.Jadwal),
      end_date: Number(data.end_date),
      jam_pagi: Number(data.jam_pagi),
      menit_pagi: Number(data.menit_pagi),
      jam_sore: Number(data.jam_sore),
      menit_sore: Number(data.menit_sore),
      durasi_detik: Number(data.durasi_detik)
    }).then(() => alert("✅ Pengaturan Berhasil Diperbarui!"));
  };

  const handleSimpanJurnal = () => {
    push(ref(db, 'jurnal_harian'), jurnalInput).then(() => {
      alert("✅ Jurnal Ikan Tersimpan!");
      setJurnalInput({ tglBibit: '', jumlahIkan: '', ukuranBibit: '', tglSortir: '' });
    });
  };

  const handleSimpanAir = () => {
    push(ref(db, 'log_pengurasan'), airInput).then(() => {
      alert("✅ Log Air Tersimpan!");
      setAirInput({ tglKuras: '', kondisiAir: '', keterangan: '' });
    });
  };

  const handleSimpanHidro = () => {
    push(ref(db, 'jurnal_hidroponik'), hidroInput).then(() => {
      alert("✅ Jurnal Hidroponik Tersimpan!");
      setHidroInput({ namaTanaman: '', tglTanam: '', pupuk: '', hama: 'Aman', hasilPanen: '', hargaJual: '' });
    });
  };

  const Sidebar = () => (
    <div style={{ width: '280px', background: '#0f172a', padding: '25px', borderRight: '1px solid #334155', height: '100vh', position: 'sticky', top: 0 }}>
      <h2 style={{ color: '#38bdf8', textAlign: 'center', marginBottom: '30px', fontSize: '20px' }}>Sistem Cerdas Santi</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button onClick={() => setHalaman('beranda')} style={btnStyle(halaman === 'beranda')}>🏠 Beranda</button>
        <button onClick={() => setHalaman('pakan')} style={btnStyle(halaman === 'pakan')}>🐟 Pakan Pintar</button>
        <button onClick={() => setHalaman('log')} style={btnStyle(halaman === 'log')}>📝 Log Ikan</button>
        <button onClick={() => setHalaman('air')} style={btnStyle(halaman === 'air')}>💧 Log Air</button>
        <button onClick={() => setHalaman('hidroponik')} style={btnStyle(halaman === 'hidroponik')}>🌱 Hidroponik</button>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', backgroundColor: '#0b1120', color: '#f8fafc', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '40px' }}>
        
        {/* BERANDA */}
        {halaman === 'beranda' && (
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', padding: '40px', borderRadius: '25px', border: '1px solid #334155', marginBottom: '30px', textAlign: 'center' }}>
              <h1 style={{ color: '#38bdf8', fontSize: '36px', marginBottom: '10px' }}>Halo, Selamat Datang! 👋</h1>
              <p style={{ color: '#94a3b8' }}>Sistem Cerdas Santi siap membantu pantau ekosistem ikan & hidroponik Anda.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              <div style={cardStyle}>
                <div style={{ fontSize: '30px' }}>🐟</div>
                <h4 style={cardLabel}>TOTAL IKAN</h4>
                <h2 style={cardValue}>{listJurnal[0]?.jumlahIkan || '0'} Ekor</h2>
              </div>
              <div style={cardStyle}>
                <div style={{ fontSize: '30px' }}>⏲️</div>
                <h4 style={cardLabel}>JADWAL SORE</h4>
                <h2 style={cardValue}>{data.jam_sore}:{data.menit_sore}</h2>
              </div>
              <div style={cardStyle}>
                <div style={{ fontSize: '30px' }}>🌱</div>
                <h4 style={cardLabel}>TANAMAN</h4>
                <h2 style={cardValue}>{listHidro[0]?.namaTanaman || 'Kosong'}</h2>
              </div>
            </div>
          </div>
        )}

        {/* PAKAN PINTAR */}
        {halaman === 'pakan' && (
          <div style={formContainer}>
            <h2 style={{ color: '#38bdf8', textAlign: 'center' }}>Pengaturan Pakan</h2>
            <label style={labelStyle}>JADWAL PAGI</label>
            <div style={{ display: 'flex', gap: '10px' }}>
                <input type="number" value={data.jam_pagi} onChange={(e) => setData({...data, jam_pagi: e.target.value})} style={inputStyle} />
                <input type="number" value={data.menit_pagi} onChange={(e) => setData({...data, menit_pagi: e.target.value})} style={inputStyle} />
            </div>
            <label style={labelStyle}>DURASI (DETIK)</label>
            <input type="number" value={data.durasi_detik} onChange={(e) => setData({...data, durasi_detik: e.target.value})} style={inputStyle} />
            <button onClick={handleUpdate} style={updateBtnStyle}>UPDATE PAKAN</button>
          </div>
        )}

        {/* LOG IKAN */}
        {halaman === 'log' && (
          <div>
            <div style={jurnalBox}>
              <h3 style={{ color: '#38bdf8' }}>Input Jurnal Ikan</h3>
              <input type="date" value={jurnalInput.tglBibit} onChange={(e)=>setJurnalInput({...jurnalInput, tglBibit:e.target.value})} style={inputStyle} />
              <input type="number" placeholder="Jumlah" value={jurnalInput.jumlahIkan} onChange={(e)=>setJurnalInput({...jurnalInput, jumlahIkan:e.target.value})} style={inputStyle} />
              <button onClick={handleSimpanJurnal} style={updateBtnStyle}>SIMPAN</button>
            </div>
          </div>
        )}

        {/* LOG AIR */}
        {halaman === 'air' && (
           <div style={jurnalBox}>
             <h3 style={{ color: '#38bdf8' }}>Log Pengurasan</h3>
             <input type="date" value={airInput.tglKuras} onChange={(e)=>setAirInput({...airInput, tglKuras:e.target.value})} style={inputStyle} />
             <input type="text" placeholder="Kondisi Air" value={airInput.kondisiAir} onChange={(e)=>setAirInput({...airInput, kondisiAir:e.target.value})} style={inputStyle} />
             <button onClick={handleSimpanAir} style={updateBtnStyle}>SIMPAN LOG</button>
           </div>
        )}

        {/* HIDROPONIK */}
        {halaman === 'hidroponik' && (
          <div style={jurnalBox}>
            <h3 style={{ color: '#38bdf8' }}>Input Hidroponik</h3>
            <input type="text" placeholder="Nama Tanaman" value={hidroInput.namaTanaman} onChange={(e)=>setHidroInput({...hidroInput, namaTanaman:e.target.value})} style={inputStyle} />
            <input type="number" placeholder="Harga Jual" value={hidroInput.hargaJual} onChange={(e)=>setHidroInput({...hidroInput, hargaJual:e.target.value})} style={inputStyle} />
            <button onClick={handleSimpanHidro} style={updateBtnStyle}>SIMPAN DATA</button>
          </div>
        )}

      </div>
    </div>
  );
}

// Styles
const btnStyle = (aktif) => ({ background: aktif ? '#38bdf8' : '#1e293b', color: aktif ? '#0f172a' : '#94a3b8', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold' });
const cardStyle = { background: '#1e293b', padding: '20px', borderRadius: '15px', border: '1px solid #334155', textAlign: 'center' };
const cardLabel = { color: '#64748b', fontSize: '12px', margin: '10px 0' };
const cardValue = { color: '#38bdf8', margin: 0 };
const formContainer = { background: '#1e293b', padding: '30px', borderRadius: '20px', maxWidth: '400px', margin: '0 auto' };
const jurnalBox = { background: '#1e293b', padding: '20px', borderRadius: '15px', maxWidth: '600px', margin: '0 auto' };
const labelStyle = { display: 'block', fontSize: '12px', color: '#94a3b8', margin: '10px 0' };
const inputStyle = { background: '#0f172a', border: '1px solid #334155', padding: '12px', borderRadius: '10px', color: '#fff', width: '100%', marginBottom: '10px' };
const updateBtnStyle = { width: '100%', background: '#22c55e', color: '#fff', border: 'none', padding: '15px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' };

export default App;
