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

  // State Log Udara (Untuk Beranda)
  const [listUdara, setListUdara] = useState([]);

  // State Hidroponik (DIPERBAIKI: Ditambahkan state yang sebelumnya hilang)
  const [hidroInput, setHidroInput] = useState({ namaTanaman: '', tglTanam: '', pupuk: '', hama: 'Aman', hasilPanen: '', hargaJual: '' });
  const [listHidro, setListHidro] = useState([]);

  useEffect(() => {
    const dbRef = ref(db, '/'); 
    onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        const result = snapshot.val();
        setData(result);
        
        // Load Jurnal Ikan
        if (result.jurnal_harian) {
          const jurnalArray = Object.keys(result.jurnal_harian).map(key => ({ id: key, ...result.jurnal_harian[key] }));
          setListJurnal(jurnalArray.reverse());
        }

        // Load Jurnal Air
        if (result.log_pengurasan) {
          const airArray = Object.keys(result.log_pengurasan).map(key => ({ id: key, ...result.log_pengurasan[key] }));
          setListAir(airArray.reverse());
        }

        // Load Log Udara (Data suhu dari sensor biasanya ada di sini)
        if (result.log_udara) {
          const udaraArray = Object.keys(result.log_udara).map(key => ({ id: key, ...result.log_udara[key] }));
          setListUdara(udaraArray.reverse());
        }

        // Load Hidroponik
        if (result.jurnal_hidroponik) {
          const hidroArray = Object.keys(result.jurnal_hidroponik).map(key => ({ id: key, ...result.jurnal_hidroponik[key] }));
          setListHidro(hidroArray.reverse());
        }
      }
    });
  }, []);

  const handleUpdate = () => {
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
    }).then(() => alert("✅ Pengaturan Pakan Diperbarui!"));
  };

  const handleSimpanJurnal = () => {
    if (!jurnalInput.tglBibit || !jurnalInput.jumlahIkan) return alert("Isi tanggal dan jumlah!");
    push(ref(db, 'jurnal_harian'), jurnalInput).then(() => {
      alert("✅ Jurnal Ikan Disimpan!");
      setJurnalInput({ tglBibit: '', jumlahIkan: '', ukuranBibit: '', tglSortir: '' });
    });
  };

  const handleSimpanAir = () => {
    if (!airInput.tglKuras || !airInput.kondisiAir) return alert("Isi tanggal dan kondisi!");
    push(ref(db, 'log_pengurasan'), airInput).then(() => {
      alert("✅ Log Air Disimpan!");
      setAirInput({ tglKuras: '', kondisiAir: '', keterangan: '' });
    });
  };

  const handleSimpanHidro = () => {
    if (!hidroInput.namaTanaman) return alert("Isi nama tanaman!");
    push(ref(db, 'jurnal_hidroponik'), hidroInput).then(() => {
      alert("✅ Data Hidroponik Disimpan!");
      setHidroInput({ namaTanaman: '', tglTanam: '', pupuk: '', hama: 'Aman', hasilPanen: '', hargaJual: '' });
    });
  };

  const Sidebar = () => (
    <div style={{ width: '300px', background: '#0f172a', padding: '25px', borderRight: '1px solid #38bdf8', height: '100vh', position: 'sticky', top: 0 }}>
      <h2 style={{ color: '#38bdf8', textAlign: 'center', marginBottom: '30px', fontSize: '22px' }}>Sistem Cerdas Santi</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
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
        
        {/* HALAMAN BERANDA */}
        {halaman === 'beranda' && (
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ marginBottom: '40px' }}>
              <h1 style={{ color: '#38bdf8', fontSize: '36px' }}>Selamat Datang, Pengelola!</h1>
              <p style={{ color: '#94a3b8' }}>Ringkasan kondisi ekosistem hari ini.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '30px' }}>
              <div style={cardStyle}>
                <h4 style={cardLabel}>TOTAL IKAN</h4>
                <h2 style={cardValue}>{listJurnal[0]?.jumlahIkan || '0'} <span style={{fontSize: '16px'}}>Ekor</span></h2>
              </div>
              <div style={cardStyle}>
                <h4 style={cardLabel}>JADWAL PAKAN</h4>
                <h2 style={cardValue}>{String(data.jam_sore).padStart(2, '0')}:{String(data.menit_sore || 0).padStart(2, '0')}</h2>
              </div>
              <div style={cardStyle}>
                <h4 style={cardLabel}>SUHU</h4>
                <h2 style={{ ...cardValue, color: data.kipas_on ? '#f59e0b' : '#38bdf8' }}>{listUdara[0]?.suhu || '--'}°C</h2>
              </div>
              <div style={cardStyle}>
                <h4 style={cardLabel}>HIDROPONIK</h4>
                <h2 style={cardValue}>{listHidro[0]?.namaTanaman || '-'}</h2>
              </div>
            </div>
          </div>
        )}

        {/* HALAMAN PAKAN PINTAR */}
        {halaman === 'pakan' && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={formContainer}>
              <h2 style={{ color: '#38bdf8', textAlign: 'center', marginBottom: '20px' }}>Pengaturan Pakan</h2>
              <label style={labelStyle}>JADWAL PAGI (JAM : MENIT)</label>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '15px' }}>
                <input type="number" value={data.jam_pagi} onChange={(e) => setData({...data, jam_pagi: e.target.value})} style={inputStyle} />
                <span style={{color: '#38bdf8'}}>:</span>
                <input type="number" value={data.menit_pagi} onChange={(e) => setData({...data, menit_pagi: e.target.value})} style={inputStyle} />
              </div>
              <label style={labelStyle}>DURASI (DETIK)</label>
              <input type="number" value={data.durasi_detik} onChange={(e) => setData({...data, durasi_detik: e.target.value})} style={inputStyle} />
              <button onClick={handleUpdate} style={updateBtnStyle}>UPDATE PAKAN</button>
            </div>
          </div>
        )}

        {/* HALAMAN LOG JURNAL IKAN */}
        {halaman === 'log' && (
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h2 style={{ color: '#38bdf8', marginBottom: '20px' }}>📝 Jurnal Ikan</h2>
            <div style={jurnalBox}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <input type="date" value={jurnalInput.tglBibit} onChange={(e)=>setJurnalInput({...jurnalInput, tglBibit: e.target.value})} style={inputStyle} />
                <input type="number" placeholder="Jumlah" value={jurnalInput.jumlahIkan} onChange={(e)=>setJurnalInput({...jurnalInput, jumlahIkan: e.target.value})} style={inputStyle} />
              </div>
              <button onClick={handleSimpanJurnal} style={updateBtnStyle}>SIMPAN JURNAL</button>
            </div>
            <div style={historyBox}>
               <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ color: '#38bdf8' }}><th style={thStyle}>Tgl</th><th style={thStyle}>Jumlah</th><th style={thStyle}>Ukuran</th></tr></thead>
                <tbody>{listJurnal.map((item) => (<tr key={item.id}><td style={tdStyle}>{item.tglBibit}</td><td style={tdStyle}>{item.jumlahIkan}</td><td style={tdStyle}>{item.ukuranBibit}</td></tr>))}</tbody>
              </table>
            </div>
          </div>
        )}

        {/* HALAMAN LOG AIR */}
        {halaman === 'air' && (
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h2 style={{ color: '#38bdf8', marginBottom: '20px' }}>💧 Log Pengurasan</h2>
            <div style={jurnalBox}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <input type="date" value={airInput.tglKuras} onChange={(e)=>setAirInput({...airInput, tglKuras: e.target.value})} style={inputStyle} />
                <input type="text" placeholder="Kondisi Air" value={airInput.kondisiAir} onChange={(e)=>setAirInput({...airInput, kondisiAir: e.target.value})} style={inputStyle} />
              </div>
              <button onClick={handleSimpanAir} style={updateBtnStyle}>SIMPAN LOG AIR</button>
            </div>
          </div>
        )}

        {/* HALAMAN HIDROPONIK */}
        {halaman === 'hidroponik' && (
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h2 style={{ color: '#38bdf8', marginBottom: '20px' }}>🌱 Jurnal Hidroponik</h2>
            <div style={jurnalBox}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <input type="text" placeholder="Nama Tanaman" value={hidroInput.namaTanaman} onChange={(e)=>setHidroInput({...hidroInput, namaTanaman: e.target.value})} style={inputStyle} />
                <input type="number" placeholder="Harga Jual" value={hidroInput.hargaJual} onChange={(e)=>setHidroInput({...hidroInput, hargaJual: e.target.value})} style={inputStyle} />
              </div>
              <button onClick={handleSimpanHidro} style={updateBtnStyle}>SIMPAN DATA HIDROPONIK</button>
            </div>
            <div style={historyBox}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ color: '#38bdf8' }}><th style={thStyle}>Tanaman</th><th style={thStyle}>Pupuk</th><th style={thStyle}>Hasil</th><th style={thStyle}>Harga</th></tr></thead>
                <tbody>{listHidro.map((item) => (
                  <tr key={item.id}>
                    <td style={tdStyle}>{item.namaTanaman}</td>
                    <td style={tdStyle}>{item.pupuk}</td>
                    <td style={tdStyle}>{item.hasilPanen}</td>
                    <td style={tdStyle}>Rp {Number(item.hargaJual).toLocaleString()}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// Styles
const btnStyle = (aktif) => ({ background: aktif ? 'linear-gradient(90deg, #38bdf8, #0ea5e9)' : '#1e293b', color: aktif ? '#0f172a' : '#94a3b8', border: 'none', padding: '14px 20px', borderRadius: '12px', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold', fontSize: '15px', width: '100%' });
const cardStyle = { background: '#1e293b', padding: '25px', borderRadius: '20px', border: '1px solid #334155', textAlign: 'center' };
const cardLabel = { color: '#64748b', fontSize: '11px', fontWeight: '800', marginBottom: '10px' };
const cardValue = { color: '#38bdf8', fontSize: '28px', margin: '0' };
const formContainer = { background: '#1e293b', padding: '40px', borderRadius: '35px', width: '100%', maxWidth: '500px', border: '1px solid #334155' };
const jurnalBox = { background: '#1e293b', padding: '30px', borderRadius: '20px', marginBottom: '30px', border: '1px solid #334155' };
const historyBox = { background: '#1e293b', borderRadius: '20px', padding: '20px', border: '1px solid #334155' };
const labelStyle = { display: 'block', fontSize: '11px', color: '#64748b', marginBottom: '8px', fontWeight: '800' };
const inputStyle = { background: '#0f172a', border: '1px solid #334155', padding: '12px', borderRadius: '10px', color: '#38bdf8', fontSize: '15px', width: '100%', outline: 'none', marginBottom: '10px' };
const updateBtnStyle = { width: '100%', background: '#22c55e', color: '#ffffff', border: 'none', padding: '15px', borderRadius: '12px', marginTop: '10px', fontWeight: 'bold', cursor: 'pointer' };
const thStyle = { textAlign: 'left', padding: '12px', color: '#64748b', fontSize: '13px' };
const tdStyle = { padding: '12px', color: '#cbd5e1', fontSize: '14px' };

export default App;
