import React, { useState, useEffect } from 'react';

function App() {
  const [dataPakan, setDataPakan] = useState([
    { id: 1, waktu: '08:00', status: 'Selesai', jumlah: '200g' },
    { id: 2, waktu: '16:00', status: 'Menunggu', jumlah: '200g' },
  ]);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', backgroundColor: '#1a1a1a', color: 'white', minHeight: '100vh' }}>
      <h1>Dashboard Pakan Ikan Pintar</h1>
      <div style={{ border: '1px solid #444', padding: '15px', borderRadius: '8px' }}>
        <h2>Jadwal Pemberian Pakan</h2>
        <table border="1" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr>
              <th style={{ padding: '10px' }}>Waktu</th>
              <th style={{ padding: '10px' }}>Jumlah</th>
              <th style={{ padding: '10px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {dataPakan.map((item) => (
              <tr key={item.id}>
                <td style={{ padding: '10px' }}>{item.waktu}</td>
                <td style={{ padding: '10px' }}>{item.jumlah}</td>
                <td style={{ padding: '10px' }}>{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;