import React, { useState } from 'react';
import { db } from './firebase'; 
import { ref, set } from "firebase/database";

function App() {
  const [totalIkan, setTotalIkan] = useState(0);

  // Jadwal yang sudah disesuaikan dengan hari ini (3 Mei 2026)
  const jadwalPakan = [
    { hari: 'H+0', tanggal: '3 Mei 2026', umur: '15 hari', durasi: 8 },
    { hari: 'H+10', tanggal: '11 Mei 2026', umur: '25 hari', durasi: 17 },
    { hari: 'H+20', tanggal: '21 Mei 2026', umur: '35 hari', durasi: 25 },
    { hari: 'H+30', tanggal: '31 Mei 2026', umur: '45 hari', durasi: 40 },
    { hari: 'H+40', tanggal: '10 Juni 2026', umur: '55 hari', durasi: 55 },
    { hari: 'H+50', tanggal: '20 Juni 2026', umur: '65 hari', durasi: 54 },
    { hari: 'H+60', tanggal: '30 Juni 2026', umur: '75 hari', durasi: 63 },
  ];

  const jalankanPerintahIoT = () => {
    // Ambil tanggal hari ini format Indonesia
    const hariIni = new Date().toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });

    const jadwalAktif = jadwalPakan.find(item => item.tanggal === hariIni);

    if (jadwalAktif) {
      // Kirim data ke Realtime Database
      set(ref(db, 'kontrol_pakan/'), {
        status: "ON",
        durasi: jadwalAktif.durasi,
        total_ikan: totalIkan,
        keterangan: `Pakan otomatis umur ${jadwalAktif.umur}`,
        timestamp: new Date().getTime()
      })
      .then(() => {
        alert(`BERHASIL! Alat diperintahkan ON selama ${jadwalAktif.durasi} detik.`);
      })
      .catch((error) => {
        alert("Gagal konek ke database: " + error.message);
      });
    } else {
      alert(`Tidak ada jadwal pakan otomatis untuk tanggal ${hariIni}.`);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#121212', color: 'white', minHeight: '100vh' }}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: '#00d4ff' }}>🐟 Smart Fish Feeder</h1>
        <p>Kontrol Panel IoT - Firebase Realtime</p>
      </header>

      <div style={{ backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '12px', marginBottom: '30px', border: '1px solid #333' }}>
        <h3>Kirim Instruksi ke Arduino</h3>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Total Ikan:</label>
            <input 
              type="number" 
              value={totalIkan}
              onChange={(e) => setTotalIkan(e.target.value)}
              style={{ padding: '10px', borderRadius: '6px', border: 'none', width: '120px' }}
            />
          </div>
          <button 
            onClick={jalankanPerintahIoT}
            style={{ 
              padding: '12px 25px', 
              backgroundColor: '#00d4ff', 
              color: '#000', 
              fontWeight: 'bold', 
              border: 'none', 
              borderRadius: '6px', 
              cursor: 'pointer',
              marginTop: '22px'
            }}
          >
            🚀 JALANKAN PERINTAH IOT
          </button>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#1e1e1e' }}>
          <thead>
            <tr style={{ backgroundColor: '#333', color: '#00d4ff' }}>
              <th style={{ padding: '15px', border: '1px solid #444' }}>Hari</th>
              <th style={{ padding: '15px', border: '1px solid #444' }}>Tanggal</th>
              <th style={{ padding: '15px', border: '1px solid #444' }}>Umur</th>
              <th style={{ padding: '15px', border: '1px solid #444' }}>Durasi</th>
            </tr>
          </thead>
          <tbody>
            {jadwalPakan.map((item, index) => (
              <tr key={index} style={{ textAlign: 'center' }}>
                <td style={{ padding: '12px', border: '1px solid #444' }}>{item.hari}</td>
                <td style={{ padding: '12px', border: '1px solid #444' }}>{item.tanggal}</td>
                <td style={{ padding: '12px', border: '1px solid #444' }}>{item.umur}</td>
                <td style={{ padding: '12px', border: '1px solid #444', fontWeight: 'bold', color: '#00ff88' }}>{item.durasi} Detik</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;