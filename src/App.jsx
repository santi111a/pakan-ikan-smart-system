import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://tqfspwtaexpxlmflaskd.supabase.co', 'sb_publishable_QTf6sd3BIoxhRf7u67-1JA_lPiLm_EB');

function App() {
  const [data, setData] = useState({ 
    Jadwal: '', 
    end_date: '', 
    jam_pagi: 0, 
    menit_pagi: 0, 
    jam_sore: 0, 
    menit_sore: 0, 
    durasi_detik: 0 
  });

  // Tambahkan state loading agar tidak error
  const [loading, setLoading] = useState(false);

 const [halaman, setHalaman] = useState('pakan'); // Contoh state halaman

  // 2. Fungsi handle
  const handleUpdatePakan = async () => { /* ... */ };
  };


return (
  <div style={styles.container}>
    {/* --- HEADER --- */}
    <header style={styles.header}>
      <h2 style={styles.headerTitle}>
        Smart Farming KSTM AL IHYA
      </h2>
    </header>

    <main style={styles.mainContent}>
      {/* Konten dashboard Anda (tabel/form) akan diletakkan di sini */}
    </main>
  </div>
);

// 1. Definisikan konfigurasi menu di luar komponen atau di bagian atas
const menuItems = [
  { id: 'pakan', label: 'Jadwal Pakan', icon: '🐟', sub: `Pagi ${data.jam_pagi}:${data.menit_pagi}` },
  { id: 'takaran', label: 'Takaran Pakan', icon: '⚖️', sub: `${listPakan.length} Log` },
  { id: 'wifi', label: 'Set WiFi', icon: '📶', sub: data.wifi_ssid || 'Belum Set' },
  { id: 'log', label: 'Jurnal Ikan', icon: '📓', sub: `${listJurnal.length} Catatan` },
  { id: 'air', label: 'Log Air', icon: '💧', sub: listAir[0]?.kondisiAir || 'N/A' },
  { id: 'hidroponik', label: 'Hidroponik', icon: '🌱', sub: `${listHidro.length} Data` },
];
        {/* --- DASHBOARD UTAMA --- */}
        {halaman === 'beranda' && (
          <div style={dashboardContainer}>
    <div style={menuGrid}>
      {menuItems.map((item) => (
        <div 
          key={item.id} 
          onClick={() => setHalaman(item.id)} 
          style={menuCard}
        >
          <div style={iconCircle}>{item.icon}</div>
          <span style={menuLabel}>{item.label}</span>
          <span style={subLabel}>{item.sub}</span>
        </div>
      ))}
    </div>
  </div>
)}

        {/* --- AREA HALAMAN DETAIL --- */}
{halaman !== 'beranda' && (
  <div style={styles.detailContainer}>
    <button 
      onClick={() => setHalaman('beranda')} 
      style={styles.backBtn}
    >
      ⬅ Kembali ke Dashboard
    </button>

    <div style={styles.contentArea}>
      {/* Di sini Anda bisa memanggil komponen berdasarkan 'halaman', 
        contoh: halaman === 'pakan' && <FormPakan /> 
      */}
      <h2>Halaman {halaman.charAt(0).toUpperCase() + halaman.slice(1)}</h2>
    </div>
  </div>
)}


            {/* HALAMAN PENGATURAN WIFI */}
 {halaman === 'wifi' && (
  <div style={styles.formContainer}>
    <h2 style={{ color: '#38bdf8', textAlign: 'center', marginBottom: '10px' }}>
      📶 Pengaturan WiFi Alat
    </h2>
    <p style={{ fontSize: '14px', color: '#94a3b8', textAlign: 'center', marginBottom: '25px' }}>
      Update SSID dan Password agar alat (ESP32) dapat terhubung ke internet.
    </p>
    
    {/* Menggunakan fungsi helper untuk input agar kode lebih bersih */}
    <div style={styles.inputGroup}>
      <label style={styles.labelStyle}>NAMA WIFI (SSID)</label>
      <input 
        type="text" 
        name="ssid" 
        placeholder="Masukkan SSID" 
        value={wifiInput.ssid} 
        onChange={(e) => setWifiInput(prev => ({ ...prev, ssid: e.target.value }))} 
        style={styles.inputStyle} 
      />
    </div>

    <div style={styles.inputGroup}>
      <label style={styles.labelStyle}>PASSWORD WIFI</label>
      <input 
        type="password" 
        placeholder="Masukkan Password" 
        value={wifiInput.pass} 
        onChange={(e) => setWifiInput(prev => ({ ...prev, pass: e.target.value }))} 
        style={styles.inputStyle} 
      />
    </div>

    <button 
      onClick={handleUpdateWifi} 
      style={{ ...styles.updateBtnStyle, background: '#10b981', width: '100%', marginTop: '10px' }}
    >
      {loading ? "Menyimpan..." : "KIRIM KE ALAT"}
    </button>

    <div style={styles.infoBox}>
      <small style={{ color: '#64748b' }}>SSID Saat Ini: </small>
      <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>{data.wifi_ssid || 'Belum diatur'}</span>
    </div>
  </div>
)}
          {halaman === 'takaran' && (
  <div style={styles.detailContainer}>
    <h2 style={{ color: '#38bdf8', marginBottom: '20px', textAlign: 'center' }}>
      ⚖️ Jurnal Takaran Pakan
    </h2>

    {/* --- FORM INPUT --- */}
    <div style={styles.jurnalBox}>
      <div style={styles.inputGrid}>
        {[
          { label: 'NAMA IKAN', name: 'namaIkan', type: 'text', placeholder: 'Lele/Nila' },
          { label: 'USIA IKAN', name: 'usiaIkan', type: 'text', placeholder: '2 Minggu' },
          { label: 'UKURAN IKAN (CM)', name: 'ukuranIkan', type: 'text', placeholder: '5-7' },
          { label: 'TAKARAN PAKAN (GR)', name: 'takaranPakan', type: 'number', placeholder: '500' },
          { label: 'DURASI KIPAS (DETIK)', name: 'durasiKipas', type: 'number', placeholder: '30' },
          { label: 'DURASI GANTI', name: 'durasiGanti', type: 'text', placeholder: '10 Hari' },
        ].map((field) => (
          <div key={field.name}>
            <label style={styles.labelStyle}>{field.label}</label>
            <input 
              type={field.type} 
              placeholder={field.placeholder} 
              value={pakanInput[field.name]} 
              onChange={(e) => setPakanInput(prev => ({ ...prev, [field.name]: e.target.value }))} 
              style={styles.inputStyle} 
            />
          </div>
        ))}
      </div>
      
      <button 
        onClick={handleSimpanTakaranPakan} 
        style={{...styles.updateBtnStyle, background: '#10b981', marginTop: '20px', width: '100%'}}
      >
        {loading ? "Menyimpan..." : "SIMPAN DATA TAKARAN"}
      </button>
    </div>

    {/* --- HISTORY TABLE --- */}
    <div style={styles.historyBox}>
      <div style={{ overflowX: 'auto' }}>
        <table style={styles.tableStyle}>
          <thead>
            <tr>
              <th style={styles.thStyle}>Ikan</th>
              <th style={styles.thStyle}>Usia/Size</th>
              <th style={styles.thStyle}>Takaran</th>
              <th style={styles.thStyle}>Kipas</th>
              <th style={styles.thStyle}>Ganti</th>
            </tr>
          </thead>
          <tbody>
            {listPakan.map((item) => (
              <tr key={item.id} style={styles.trBody}>
                <td style={styles.tdStyle}>{item.nama_ikan}</td>
                <td style={styles.tdStyle}>{item.usia_ikan} / {item.ukuran_ikan}cm</td>
                <td style={styles.tdStyle}>{item.takaran_pakan}g</td>
                <td style={styles.tdStyle}>{item.durasi_kipas}s</td>
                <td style={styles.tdStyle}>{item.durasi_ganti}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)}

     {halaman === 'hidroponik' && (
  <div style={styles.detailContainer}>
    <h2 style={{ color: '#38bdf8', marginBottom: '20px', textAlign: 'center' }}>
      🌱 Jurnal Hidroponik
    </h2>

    {/* --- FORM INPUT --- */}
    <div style={styles.jurnalBox}>
      <div style={styles.inputGrid}>
        {[
          { label: 'TGL TANAM', name: 'tglTanam', type: 'date' },
          { label: 'NAMA TANAMAN', name: 'namaTanaman', type: 'text', placeholder: 'Contoh: Selada' },
          { label: 'PANEN (KG)', name: 'jumlahPanen', type: 'number', placeholder: '0' },
          { label: 'HARGA JUAL', name: 'hargaJual', type: 'number', placeholder: '0' },
        ].map((field) => (
          <div key={field.name}>
            <label style={styles.labelStyle}>{field.label}</label>
            <input 
              type={field.type} 
              placeholder={field.placeholder}
              value={hidroInput[field.name]} 
              onChange={(e) => setHidroInput(prev => ({ ...prev, [field.name]: e.target.value }))} 
              style={styles.inputStyle} 
            />
          </div>
        ))}
      </div>
      
      <button 
        onClick={handleSimpanHidro} 
        style={{...styles.updateBtnStyle, background: '#10b981', marginTop: '20px', width: '100%'}}
      >
        {loading ? "Menyimpan..." : "SIMPAN DATA HIDROPONIK"}
      </button>
    </div>

    {/* --- HISTORY TABLE --- */}
    <div style={styles.historyBox}>
      <div style={{ overflowX: 'auto' }}>
        <table style={styles.tableStyle}>
          <thead>
            <tr>
              <th style={styles.thStyle}>Tanggal</th>
              <th style={styles.thStyle}>Tanaman</th>
              <th style={styles.thStyle}>Panen</th>
              <th style={styles.thStyle}>Harga</th>
            </tr>
          </thead>
          <tbody>
            {listHidro.map((item) => (
              <tr key={item.id} style={styles.trBody}>
                <td style={styles.tdStyle}>{item.tgl_tanam}</td>
                <td style={styles.tdStyle}>{item.nama_tanaman}</td>
                <td style={styles.tdStyle}>{item.jumlah_panen || '-'} kg</td>
                <td style={styles.tdStyle}>
                  {item.harga_jual ? `Rp ${Number(item.harga_jual).toLocaleString('id-ID')}` : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)}

          {halaman === 'air' && (
  <div style={styles.detailContainer}>
    <h2 style={{ color: '#38bdf8', marginBottom: '20px', textAlign: 'center' }}>
      💧 Log Pengurasan Air
    </h2>

    {/* --- FORM INPUT --- */}
    <div style={styles.jurnalBox}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
        <div>
          <label style={styles.labelStyle}>TGL KURAS</label>
          <input 
            type="date" 
            value={airInput.tglKuras} 
            onChange={(e) => setAirInput(prev => ({ ...prev, tglKuras: e.target.value }))} 
            style={styles.inputStyle} 
          />
        </div>
        <div>
          <label style={styles.labelStyle}>KONDISI</label>
          <input 
            type="text" 
            placeholder="Hijau/Keruh" 
            value={airInput.kondisiAir} 
            onChange={(e) => setAirInput(prev => ({ ...prev, kondisiAir: e.target.value }))} 
            style={styles.inputStyle} 
          />
        </div>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={styles.labelStyle}>KETERANGAN</label>
        <input 
          type="text" 
          placeholder="Catatan tambahan..."
          value={airInput.keterangan} 
          onChange={(e) => setAirInput(prev => ({ ...prev, keterangan: e.target.value }))} 
          style={styles.inputStyle} 
        />
      </div>

      <button 
        onClick={handleSimpanAir} 
        style={{ ...styles.updateBtnStyle, background: '#10b981', width: '100%' }}
      >
        {loading ? "Menyimpan..." : "SIMPAN DATA AIR"}
      </button>
    </div>

    {/* --- HISTORY TABLE --- */}
    <div style={styles.historyBox}>
      <div style={{ overflowX: 'auto' }}>
        <table style={styles.tableStyle}>
          <thead>
            <tr>
              <th style={styles.thStyle}>Tanggal</th>
              <th style={styles.thStyle}>Kondisi</th>
              <th style={styles.thStyle}>Keterangan</th>
            </tr>
          </thead>
          <tbody>
            {listAir.map((item) => (
              <tr key={item.id} style={styles.trBody}>
                {/* Pastikan nama field di bawah sesuai dengan kolom di Supabase */}
                <td style={styles.tdStyle}>{item.tgl_kuras}</td>
                <td style={styles.tdStyle}>{item.kondisi_air}</td>
                <td style={styles.tdStyle}>{item.keterangan || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)}
           {halaman === 'log' && (
  <div style={styles.detailContainer}>
    <h2 style={{ color: '#38bdf8', marginBottom: '20px', textAlign: 'center' }}>
      📝 Jurnal Budidaya Ikan
    </h2>

    {/* --- FORM INPUT --- */}
    <div style={styles.jurnalBox}>
      <div style={styles.inputGrid}>
        {[
          { label: 'TGL BIBIT', name: 'tglBibit', type: 'date' },
          { label: 'JUMLAH', name: 'jumlahIkan', type: 'number', placeholder: 'Ekor' },
          { label: 'UKURAN (CM)', name: 'ukuranBibit', type: 'text', placeholder: 'Contoh: 5-7' },
          { label: 'TGL SORTIR', name: 'tglSortir', type: 'date' },
        ].map((field) => (
          <div key={field.name}>
            <label style={styles.labelStyle}>{field.label}</label>
            <input 
              type={field.type} 
              placeholder={field.placeholder}
              value={jurnalInput[field.name]} 
              onChange={(e) => setJurnalInput(prev => ({ ...prev, [field.name]: e.target.value }))} 
              style={styles.inputStyle} 
            />
          </div>
        ))}
      </div>
      
      <button 
        onClick={handleSimpanJurnalIkan} 
        style={{...styles.updateBtnStyle, background: '#10b981', marginTop: '20px', width: '100%'}}
      >
        {loading ? "Menyimpan..." : "SIMPAN DATA IKAN"}
      </button>
    </div>

    {/* --- HISTORY TABLE --- */}
    <div style={styles.historyBox}>
      <div style={{ overflowX: 'auto' }}>
        <table style={styles.tableStyle}>
          <thead>
            <tr>
              <th style={styles.thStyle}>Tgl Bibit</th>
              <th style={styles.thStyle}>Jumlah</th>
              <th style={styles.thStyle}>Ukuran</th>
              <th style={styles.thStyle}>Tgl Sortir</th>
            </tr>
          </thead>
          <tbody>
            {listJurnal.map((item) => (
              <tr key={item.id} style={styles.trBody}>
                {/* Pastikan nama field sesuai dengan kolom di tabel Supabase */}
                <td style={styles.tdStyle}>{item.tgl_bibit}</td>
                <td style={styles.tdStyle}>{item.jumlah_ikan}</td>
                <td style={styles.tdStyle}>{item.ukuran_bibit} cm</td>
                <td style={styles.tdStyle}>{item.tgl_sortir || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)}

{halaman === 'pakan' && (
  <div style={styles.formContainer}>
    <h2 style={{ color: '#38bdf8', textAlign: 'center', marginBottom: '25px' }}>
      ⚙️ Pengaturan Pakan
    </h2>

    {/* RENTANG TANGGAL */}
    <div style={styles.inputGroup}>
      <label style={styles.labelStyle}>RENTANG TANGGAL (MULAI - SELESAI)</label>
      <div style={{ display: 'flex', gap: '15px' }}>
        <input type="number" placeholder="Mulai" value={data.Jadwal} onChange={(e) => setData(p => ({ ...p, Jadwal: e.target.value }))} style={styles.inputStyle} />
        <input type="number" placeholder="Selesai" value={data.end_date} onChange={(e) => setData(p => ({ ...p, end_date: e.target.value }))} style={styles.inputStyle} />
      </div>
    </div>

    {/* JADWAL PAGI & SORE (Dibuat lebih ringkas) */}
    {[
      { label: 'JADWAL PAGI', jam: 'jam_pagi', menit: 'menit_pagi' },
      { label: 'JADWAL SORE', jam: 'jam_sore', menit: 'menit_sore' }
    ].map((item) => (
      <div key={item.jam} style={styles.inputGroup}>
        <label style={styles.labelStyle}>{item.label} (JAM : MENIT)</label>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <input type="number" placeholder="Jam" value={data[item.jam]} onChange={(e) => setData(p => ({ ...p, [item.jam]: parseInt(e.target.value) || 0 }))} style={styles.inputStyle} />
          <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>:</span>
          <input type="number" placeholder="Menit" value={data[item.menit]} onChange={(e) => setData(p => ({ ...p, [item.menit]: parseInt(e.target.value) || 0 }))} style={styles.inputStyle} />
        </div>
      </div>
    ))}

    {/* DURASI */}
    <div style={{ marginBottom: '25px' }}>
      <label style={styles.labelStyle}>DURASI (DETIK)</label>
      <input type="number" value={data.durasi_detik} onChange={(e) => setData(p => ({ ...p, durasi_detik: parseInt(e.target.value) || 0 }))} style={{ ...styles.inputStyle, width: '100%' }} />
    </div>

    <button onClick={handleUpdatePakan} style={{ ...styles.updateBtnStyle, width: '100%' }}>
      {loading ? "Menyimpan..." : "UPDATE JADWAL"}
    </button>
  </div>
)}

const styles = {
  header: { 
    padding: '20px', 
    borderBottom: '1px solid #1e293b', 
    textAlign: 'center', 
    background: '#0f172a', 
    position: 'sticky', 
    top: 0, 
    zIndex: 10 
  },
  dashboardContainer: { maxWidth: '500px', margin: '0 auto', padding: '15px' },
  menuGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
  menuCard: { 
    background: '#1e293b', 
    padding: '20px', 
    borderRadius: '20px', 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    cursor: 'pointer', 
    border: '1px solid #334155', 
    transition: '0.2s' 
  },
  iconCircle: { fontSize: '32px', marginBottom: '10px' },
  menuLabel: { fontSize: '14px', fontWeight: 'bold' },
  subLabel: { fontSize: '11px', color: '#94a3b8', marginTop: '5px' },
  
  // Form & Inputs
  formContainer: { background: '#1e293b', padding: '25px', borderRadius: '20px', maxWidth: '400px', margin: '0 auto' },
  inputStyle: { 
    background: '#0f172a', 
    border: '1px solid #334155', 
    padding: '12px', 
    borderRadius: '8px', 
    color: '#38bdf8', 
    width: '100%', 
    boxSizing: 'border-box' // Penting untuk layout
  },
  labelStyle: { fontSize: '11px', color: '#64748b', fontWeight: 'bold', display: 'block', marginBottom: '5px' },
  updateBtnStyle: { width: '100%', background: '#0ea5e9', color: 'white', border: 'none', padding: '14px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' },
  backBtnStyle: { background: '#1e293b', border: '1px solid #334155', color: '#38bdf8', padding: '12px', borderRadius: '10px', marginBottom: '20px', cursor: 'pointer', width: '100%' },
  
  // Data Presentation
  jurnalBox: { background: '#1e293b', padding: '25px', borderRadius: '20px', marginBottom: '20px' },
  historyBox: { background: '#1e293b', padding: '15px', borderRadius: '20px', overflowX: 'auto' },
  tableStyle: { width: '100%', borderCollapse: 'collapse' },
  thStyle: { padding: '12px', color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase', textAlign: 'left' },
  tdStyle: { padding: '12px', fontSize: '14px', color: '#e2e8f0', borderBottom: '1px solid #334155' }
};

export default styles;