import React, { useState } from 'react';

function App() {
  // State untuk input jumlah ikan
  const [totalIkan, setTotalIkan] = useState(0);
  
  // Data Tabel Jadwal Pakan sesuai permintaan Anda
  const jadwalPakan = [
    { hari: 'H+0', tanggal: '1 Mei 2026', umur: '15 hari', durasi: '8 detik' },
    { hari: 'H+10', tanggal: '11 Mei 2026', umur: '25 hari', durasi: '17 detik' },
    { hari: 'H+20', tanggal: '21 Mei 2026', umur: '35 hari', durasi: '25 detik' },
    { hari: 'H+30', tanggal: '31 Mei 2026', umur: '45 hari', durasi: '40 detik' },
    { hari: 'H+40', tanggal: '10 Juni 2026', umur: '55 hari', durasi: '55 detik' },
    { hari: 'H+50', tanggal: '20 Juni 2026', umur: '65 hari', durasi: '54 detik' },
    { hari: 'H+60', tanggal: '30 Juni 2026', umur: '75 hari', durasi: '63 detik' },
  ];

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', backgroundColor: '#121212', color: 'white', minHeight: '100vh' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1>🐟 Pakan Ikan Smart System</h1>
        <p>Kontrol & Monitoring Real-time</p>
      </header>

      {/* Bagian Input Data Ikan */}
      <section style={{ backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
        <h3>Update Data Ikan</h3>
        <label>Total Ikan Awal: </label>
        <input 
          type="number" 
          value={totalIkan} 
          onChange={(e) => setTotalIkan(e.target.value)}
          style={{ padding: '8px', borderRadius: '5px', border: 'none', marginLeft: '10px' }}
        />
        <button style={{ marginLeft: '10px', padding: '8px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Simpan ke IoT
        </button>
      </section>

      {/* Tabel Jadwal Pakan */}
      <section style={{ backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '10px' }}>
        <h3>Jadwal & Durasi Pakan Otomatis</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
          <thead>
            <tr style={{ backgroundColor: '#333' }}>
              <th style={{ padding: '12px', border: '1px solid #444' }}>Hari</th>
              <th style={{ padding: '12px', border: '1px solid #444' }}>Tanggal</th>
              <th style={{ padding: '12px', border: '1px solid #444' }}>Umur</th>
              <th style={{ padding: '12px', border: '1px solid #444' }}>Durasi (07:00, 12:00, 17:00)</th>
            </tr>
          </thead>
          <tbody>
            {jadwalPakan.map((data, index) => (
              <tr key={index} style={{ textAlign: 'center' }}>
                <td style={{ padding: '10px', border: '1px solid #444' }}>{data.hari}</td>
                <td style={{ padding: '10px', border: '1px solid #444' }}>{data.tanggal}</td>
                <td style={{ padding: '10px', border: '1px solid #444' }}>{data.umur}</td>
                <td style={{ padding: '10px', border: '1px solid #444', color: '#00ff00', fontWeight: 'bold' }}>{data.durasi}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default App;