import React from 'react';

function Beranda({ setHalaman }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Pakan Ikan Pintar</h1>
      <button onClick={() => setHalaman('pakan')} style={{ display: 'block', width: '100%', padding: '15px', marginBottom: '10px' }}>
        Atur Jadwal Pakan
      </button>
      <button onClick={() => setHalaman('wifi')} style={{ display: 'block', width: '100%', padding: '15px' }}>
        Pengaturan WiFi
      </button>
    </div>
  );
}
export default Beranda;