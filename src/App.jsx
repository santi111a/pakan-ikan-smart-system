import React, { useState, useEffect } from 'react';

// --- KOMPONEN KARTU MENU (DASHBOARD) ---
const MenuCard = ({ title, icon, subtitle, onClick, color }) => (
  <div 
    onClick={onClick}
    style={{
      backgroundColor: '#2c3e50',
      borderRadius: '15px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      border: '1px solid #34495e',
      transition: '0.3s'
    }}
  >
    <div style={{ fontSize: '40px', marginBottom: '10px' }}>{icon}</div>
    <div style={{ color: 'white', fontWeight: 'bold', fontSize: '14px' }}>{title}</div>
    <div style={{ color: '#95a5a6', fontSize: '11px', marginTop: '5px' }}>{subtitle}</div>
  </div>
);

export default function App() {
  // 1. STATE UNTUK NAVIGASI (Agar tidak error lagi)
  const [halaman, setHalaman] = useState('beranda');

  // 2. STATE UNTUK DATA PAKAN
  const [data, setData] = useState({
    Jadwal: 0,
    end_date: 0,
    jam_pagi: 7,
    menit_pagi: 30,
    jam_sore: 16,
    menit_sore: 15,
    durasi_detik: 5
  });

  return (
    <div style={{ 
      backgroundColor: '#1a252f', 
      minHeight: '100vh', 
      fontFamily: 'Arial, sans-serif',
      color: 'white',
      padding: '20px'
    }}>
      
      {/* HEADER UTAMA */}
      <div style={{ textAlign: 'center', marginBottom: '30px', marginTop: '20px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '5px' }}>Santi Smart System</h2>
        <p style={{ color: '#bdc3c7', fontSize: '14px' }}>Halo! Pilih menu monitor:</p>
      </div>

      {/* --- LOGIKA HALAMAN: BERANDA --- */}
      {halaman === 'beranda' && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '15px',
          maxWidth: '400px',
          margin: '0 auto'
        }}>
          <MenuCard 
            title="Pakan Pintar" 
            icon="🐟" 
            subtitle={`Pagi: ${data.jam_pagi}:${data.menit_pagi}`} 
            onClick={() => setHalaman('pakan')}
          />
          <MenuCard 
            title="Jurnal Ikan" 
            icon="📓" 
            subtitle={`Sore: ${data.jam_sore}:${data.menit_sore}`} 
            onClick={() => alert('Menu Jurnal Belum Tersedia')}
          />
          <MenuCard 
            title="Log Air" 
            icon="💧" 
            subtitle="Status: Normal" 
            onClick={() => alert('Menu Log Air Belum Tersedia')}
          />
          <MenuCard 
            title="Hidroponik" 
            icon="🌱" 
            subtitle="Status: Aman" 
            onClick={() => alert('Menu Hidroponik Belum Tersedia')}
          />
        </div>
      )}

      {/* --- LOGIKA HALAMAN: FORM PAKAN --- */}
      {halaman === 'pakan' && (
        <div style={{ maxWidth: '400px', margin: '0 auto', backgroundColor: '#2c3e50', padding: '20px', borderRadius: '15px' }}>
          <h3 style={{ textAlign: 'center' }}>⚙️ Pengaturan Pakan</h3>
          <hr border="0.5px solid #34495e" />
          
          <div style={{ marginTop: '20px' }}>
            <label>Jam Pagi:</label>
            <input 
              type="number" 
              value={data.jam_pagi} 
              onChange={(e) => setData({...data, jam_pagi: e.target.value})}
              style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '5px' }}
            />
            {/* Tambahkan input lainnya di sini sesuai kebutuhan */}
          </div>

          <button 
            onClick={() => setHalaman('beranda')}
            style={{ 
              width: '100%', 
              padding: '12px', 
              marginTop: '20px', 
              backgroundColor: '#e74c3c', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            ← Kembali ke Menu Utama
          </button>
        </div>
      )}

      {/* TOMBOL BACK PERMANEN (Opsional, seperti di gambar) */}
      {halaman === 'beranda' && (
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <button style={{ background: 'none', border: 'none', color: '#bdc3c7', cursor: 'pointer' }}>
             ← Kembali ke Menu Utama
          </button>
        </div>
      )}

    </div>
  );
}