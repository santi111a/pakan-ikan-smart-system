import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Ganti dengan kredensial Supabase Anda
const supabase = createClient('URL_SUPABASE_ANDA', 'KEY_ANON_SUPABASE_ANDA');

function App() {
  const [halaman, setHalaman] = useState('beranda');
  
  // 1. STATE SISTEM UTAMA
  const [data, setData] = useState({
    Jadwal: 0, end_date: 0, jam_pagi: 0, menit_pagi: 0,
    jam_sore: 0, menit_sore: 0, durasi_detik: 0,
    wifi_ssid: '', wifi_pass: ''
  });

  // 1. STATE INPUT (Sama)
const [hidroInput, setHidroInput] = useState({ tglTanam: '', namaTanaman: '', jumlahPanen: '', hargaJual: '' });
const [listHidro, setListHidro] = useState([]);

const [jurnalInput, setJurnalInput] = useState({ tglBibit: '', jumlahIkan: '', ukuranBibit: '', tglSortir: '' });
const [listJurnal, setListJurnal] = useState([]);

const [airInput, setAirInput] = useState({ tglKuras: '', kondisiAir: '', keterangan: '' });
const [listAir, setListAir] = useState([]);

const [pakanInput, setPakanInput] = useState({ 
  namaIkan: '', usiaIkan: '', ukuranIkan: '', takaranPakan: '', durasiKipas: '', durasiGanti: '' 
});
const [listPakan, setListPakan] = useState([]);

  // --- STATE PENGATURAN WIFI ---
const [wifiInput, setWifiInput] = useState({ ssid: '', pass: '' });

  // --- AMBIL DATA DARI SUPABASE ---
  const fetchData = async () => {
    // 1. Ambil data setting utama (Jadwal Pakan)
    const { data: mainData } = await supabase
      .from('jadwal_pakan')
      .select('*')
      .eq('pengenal', 1)
      .single();

    if (mainData) setData(prev => ({ ...prev, ...mainData }));

    // 2. Ambil List Data Jurnal (Gunakan .order untuk urutan terbaru)
    const tables = [
      { name: 'jurnal_harian', setter: setListJurnal },
      { name: 'log_pengurasan', setter: setListAir },
      { name: 'jurnal_hidroponik', setter: setListHidro },
      { name: 'jurnal_pakan', setter: setListPakan }
    ];

    tables.forEach(async (table) => {
      const { data } = await supabase
        .from(table.name)
        .select('*')
        .order('created_at', { ascending: false }); // Memastikan data terbaru ada di atas
      
      if (data) table.setter(data);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

 // Fungsi untuk Update Jadwal Pakan ke Supabase
const handleUpdatePakan = async () => {
  // Pastikan Anda memvalidasi data sebelum dikirim
  const { data: updatedData, error } = await supabase
    .from('jadwal_pakan') // Nama tabel di Supabase
    .update({
      Jadwal: Number(data.Jadwal),
      end_date: Number(data.end_date),
      jam_pagi: Number(data.jam_pagi),
      menit_pagi: Number(data.menit_pagi),
      jam_sore: Number(data.jam_sore),
      menit_sore: Number(data.menit_sore),
      durasi_detik: Number(data.durasi_detik)
    })
    .eq('pengenal', 1); // <--- KUNCI: Menargetkan baris spesifik (baris ke-1)

  if (error) {
    alert("❌ Gagal memperbarui jadwal: " + error.message);
  } else {
    alert("✅ Jadwal Pakan berhasil diperbarui di Supabase!");
    // Opsional: panggil fetchData() jika ingin tampilan langsung refresh
    fetchData(); 
  
     // Memastikan data yang dikirim adalah angka (Number)
// Gunakan || 0 untuk mencegah data null/undefined menjadi NaN (Not a Number)

Jadwal: Number(data.Jadwal) || 1; 
end_date: Number(data.end_date) || 30;

// 2. JADWAL PAGI
jam_pagi: parseInt(data.jam_pagi) || 0;
menit_pagi: parseInt(data.menit_pagi) || 0;

    // 3. JADWAL SORE
jam_sore: parseInt(data.jam_sore) || 0;
menit_sore: parseInt(data.menit_sore) || 0;

    // 4. DURASI
    durasi_detik: Number(data.durasi_detik);
    }
    then(() => alert("✅ Pengaturan Pakan Diperbarui!"));
  
}
  };

 const handleUpdatePakan = async () => {
  try {
    const payload = {
      Jadwal: parseInt(data.Jadwal) || 1,
      end_date: parseInt(data.end_date) || 30,
      jam_pagi: parseInt(data.jam_pagi) || 0,
      menit_pagi: parseInt(data.menit_pagi) || 0,
      jam_sore: parseInt(data.jam_sore) || 0,
      menit_sore: parseInt(data.menit_sore) || 0,
      durasi_detik: parseInt(data.durasi_detik) || 5 // Default 5 detik
    };

    const { error } = await supabase
      .from('jadwal_pakan')
      .update(payload)
      .eq('pengenal', 1);

    if (error) throw error;

    alert("✅ Pengaturan Pakan Berhasil Diperbarui!");
  } catch (error) {
    alert("❌ Gagal memperbarui: " + error.message);
  }
};

  const handleSimpanJurnalIkan = async () => {
  // 1. Validasi input
  if (!jurnalInput.tglBibit) return alert("⚠️ Pilih tanggal terlebih dahulu!");

  try {
    // 2. Menggunakan insert ke Supabase
    const { error } = await supabase
      .from('jurnal_harian') // Pastikan nama tabel di Supabase sama
      .insert([
        {
          tglBibit: jurnalInput.tglBibit,
          jumlahIkan: parseInt(jurnalInput.jumlahIkan) || 0,
          ukuranBibit: jurnalInput.ukuranBibit,
          tglSortir: jurnalInput.tglSortir
        }
      ]);

    if (error) throw error; // Jika ada error di database

    // 3. Jika berhasil
    alert("✅ Jurnal Ikan Tersimpan!");
    
    // Reset form
    setJurnalInput({ tglBibit: '', jumlahIkan: '', ukuranBibit: '', tglSortir: '' });
    
    // Refresh data agar list di tabel langsung terupdate
    fetchData(); 
    
  } catch (err) {
    alert("❌ Gagal menyimpan data: " + err.message);
  }
};



  const handleSimpanAir = async () => {
  // 1. Validasi Input
  if (!airInput.tglKuras) return alert("⚠️ Pilih tanggal pengurasan!");

  try {
    // 2. Insert data ke Supabase
    const { error } = await supabase
      .from('log_pengurasan') // Pastikan nama tabel sama dengan di Supabase
      .insert([
        {
          tglKuras: airInput.tglKuras,
          kondisiAir: airInput.kondisiAir,
          keterangan: airInput.keterangan
        }
      ]);

    if (error) throw error; // Melempar error ke block catch jika terjadi kesalahan

    // 3. Jika berhasil
    alert("✅ Log Air Tersimpan!");
    
    // Reset form ke nilai awal
    setAirInput({ tglKuras: '', kondisiAir: '', keterangan: '' });
    
    // Refresh data agar tabel di UI langsung terupdate
    fetchData(); 
    
  } catch (err) {
    alert("❌ Gagal menyimpan log air: " + err.message);
  }
};

  const handleSimpanHidro = async () => {
  // 1. Validasi Input
  if (!hidroInput.tglTanam || !hidroInput.namaTanaman) {
    return alert("⚠️ Harap isi tanggal dan nama tanaman!");
  }

  try {
    // 2. Insert data ke Supabase
    const { error } = await supabase
      .from('jurnal_hidroponik') // Pastikan nama tabel di Supabase sesuai
      .insert([
        {
          tglTanam: hidroInput.tglTanam,
          namaTanaman: hidroInput.namaTanaman,
          jumlahPanen: parseInt(hidroInput.jumlahPanen) || 0,
          hargaJual: parseInt(hidroInput.hargaJual) || 0
        }
      ]);

    if (error) throw error; // Menangani error jika insert gagal

    // 3. Jika sukses
    alert("✅ Data Hidroponik Tersimpan!");
    
    // Reset form
    setHidroInput({ tglTanam: '', namaTanaman: '', jumlahPanen: '', hargaJual: '' });
    
    // Refresh data UI
    fetchData(); 
    
  } catch (err) {
    alert("❌ Gagal menyimpan data: " + err.message);
  }
};


const handleSimpanTakaranPakan = async () => {
  // 1. Validasi Input
  if (!pakanInput.namaIkan || !pakanInput.takaranPakan) {
    return alert("⚠️ Lengkapi Nama Ikan dan Takaran Pakan!");
  }

  try {
    // 2. Insert data ke Supabase
    const { error } = await supabase
      .from('jurnal_pakan') // Pastikan nama tabel di Supabase adalah 'jurnal_pakan'
      .insert([
        {
          namaIkan: pakanInput.namaIkan,
          usiaIkan: pakanInput.usiaIkan,
          ukuranIkan: pakanInput.ukuranIkan,
          takaranPakan: pakanInput.takaranPakan,
          durasiKipas: parseInt(pakanInput.durasiKipas) || 0,
          durasiGanti: pakanInput.durasiGanti
        }
      ]);

    if (error) throw error;

    // 3. Jika berhasil
    alert("✅ Jurnal Takaran Pakan Tersimpan!");

    // Reset Form
    setPakanInput({ 
      namaIkan: '', usiaIkan: '', ukuranIkan: '', 
      takaranPakan: '', durasiKipas: '', durasiGanti: '' 
    });

    // Refresh data UI
    fetchData(); 
    
  } catch (err) {
    alert("❌ Gagal menyimpan data: " + err.message);
  }
};


 const handleManualPakan = async () => {
  try {
    // Mengupdate status menjadi 'ON' di tabel 'manual_control'
    const { error } = await supabase
      .from('manual_control') // Pastikan nama tabel di Supabase sesuai
      .update({ status: 'ON' })
      .eq('id', 1); // Menargetkan baris kontrol manual

    if (error) throw error;

    alert("✅ Perintah Manual Dikirim ke ESP32!");

    // Opsi: Reset status kembali ke 'OFF' setelah beberapa detik
    // agar tombol bisa diklik lagi kapan saja
    setTimeout(async () => {
      await supabase
        .from('manual_control')
        .update({ status: 'OFF' })
        .eq('id', 1);
    }, 3000); // Reset otomatis setelah 3 detik

  } catch (err) {
    alert("❌ Gagal mengirim perintah: " + err.message);
  }
};


  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0f172a', 
      color: 'white', 
      fontFamily: 'sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center' // Memastikan konten selalu di tengah
    }}>
      
      {/* --- HEADER --- */}
      <div style={headerStyle}>
        <h2 style={{ color: '#38bdf8', margin: 0, fontSize: '18px', letterSpacing: '1px', textTransform: 'uppercase' }}>
          Smart Farming KSTM AL IHYA
        </h2>
      </div>
        
       {/* --- DASHBOARD UTAMA --- */}
{halaman === 'beranda' && (
  <div style={dashboardContainer}>
    <div style={menuGrid}>
      
      <div onClick={() => setHalaman('pakan')} style={menuCard}>
        <div style={iconCircle}>🐟</div>
        <span style={menuLabel}>Jadwal Pakan</span>
        <span style={subLabel}>Pagi {data?.jam_pagi || '0'}:{data?.menit_pagi || '00'}</span>
      </div>

      <div onClick={() => setHalaman('takaran')} style={menuCard}>
        <div style={iconCircle}>⚖️</div>
        <span style={menuLabel}>Takaran Pakan</span>
        <span style={subLabel}>{listPakan?.length || 0} Log</span>
      </div>

      <div onClick={() => setHalaman('wifi')} style={menuCard}>
        <div style={iconCircle}>📶</div>
        <span style={menuLabel}>Set WiFi</span>
        <span style={subLabel}>{data?.wifi_ssid || 'Belum Set'}</span>
      </div>

      <div onClick={() => setHalaman('log')} style={menuCard}>
        <div style={iconCircle}>📓</div>
        <span style={menuLabel}>Jurnal Ikan</span>
        <span style={subLabel}>{listJurnal?.length || 0} Catatan</span>
      </div>

      <div onClick={() => setHalaman('air')} style={menuCard}>
        <div style={iconCircle}>💧</div>
        <span style={menuLabel}>Log Air</span>
        <span style={subLabel}>{listAir[0]?.kondisiAir || 'N/A'}</span>
      </div>

      <div onClick={() => setHalaman('hidroponik')} style={menuCard}>
        <div style={iconCircle}>🌱</div>
        <span style={menuLabel}>Hidroponik</span>
        <span style={subLabel}>{listHidro?.length || 0} Data</span>
      </div>

    </div>
  </div>
)};

{/* HALAMAN PENGATURAN WIFI */}
{halaman === 'wifi' && (
  <div style={formContainer}>
    <h2 style={{ color: '#38bdf8', textAlign: 'center', marginBottom: '10px' }}>📶 Pengaturan WiFi Alat</h2>
    <p style={{ fontSize: '12px', color: '#94a3b8', textAlign: 'center', marginBottom: '20px' }}>
      Update SSID dan Password agar alat (ESP32) terhubung ke internet.
    </p>

    <div style={{ marginBottom: '15px' }}>
      <label style={labelStyle}>NAMA WIFI (SSID)</label>
      <input 
        type="text" 
        placeholder="Masukkan SSID" 
        value={wifiInput.ssid} 
        onChange={(e) => setWifiInput(prev => ({ ...prev, ssid: e.target.value }))} 
        style={inputStyle} 
      />
    </div>

    <div style={{ marginBottom: '15px' }}>
      <label style={labelStyle}>PASSWORD WIFI</label>
      <input 
        type="password" 
        placeholder="Masukkan Password" 
        value={wifiInput.pass} 
        onChange={(e) => setWifiInput(prev => ({ ...prev, pass: e.target.value }))} 
        style={inputStyle} 
      />
    </div>

    <button 
      onClick={handleUpdateWifi} 
      style={{ ...updateBtnStyle, background: '#10b981', width: '100%', marginTop: '10px' }}
    >
      SIMPAN & TANAM KE ALAT
    </button>

    <div style={{ marginTop: '20px', padding: '15px', background: '#1e293b', borderRadius: '8px', textAlign: 'center' }}>
      <div style={{ color: '#64748b', fontSize: '12px', marginBottom: '5px' }}>SSID Saat Ini (Database):</div>
      <div style={{ color: '#38bdf8', fontWeight: 'bold', fontSize: '16px' }}>
        {data?.wifi_ssid || 'Belum Terkonfigurasi'}
      </div>
    </div>
    
    <p style={{ fontSize: '10px', color: '#64748b', textAlign: 'center', marginTop: '15px' }}>
      * ESP32 akan restart otomatis setelah data berhasil ditanam.
    </p>
  </div>
)}


  {/* HALAMAN TAKARAN PAKAN */}
{halaman === 'takaran' && (
  <>
    <h2 style={{ color: '#38bdf8', textAlign: 'center', marginBottom: '20px' }}>⚖️ Jurnal Takaran Pakan</h2>
    
    <div style={{ ...jurnalBox, display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div><label style={labelStyle}>NAMA IKAN</label><input type="text" placeholder="Lele/Nila" value={pakanInput.namaIkan} onChange={(e) => setPakanInput(prev => ({...prev, namaIkan: e.target.value}))} style={inputStyle} /></div>
        <div><label style={labelStyle}>USIA & UKURAN</label>
           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
             <input type="text" placeholder="Usia (Misal: 2 Minggu)" value={pakanInput.usiaIkan} onChange={(e) => setPakanInput(prev => ({...prev, usiaIkan: e.target.value}))} style={inputStyle} />
             <input type="text" placeholder="Ukuran (Misal: 5-7 cm)" value={pakanInput.ukuranIkan} onChange={(e) => setPakanInput(prev => ({...prev, ukuranIkan: e.target.value}))} style={inputStyle} />
           </div>
        </div>
        <div><label style={labelStyle}>TAKARAN PAKAN (GR/KG)</label><input type="text" placeholder="Contoh: 500 gr" value={pakanInput.takaranPakan} onChange={(e) => setPakanInput(prev => ({...prev, takaranPakan: e.target.value}))} style={inputStyle} /></div>
        <div><label style={labelStyle}>DURASI KIPAS (DETIK)</label><input type="number" placeholder="Contoh: 30" value={pakanInput.durasiKipas} onChange={(e) => setPakanInput(prev => ({...prev, durasiKipas: e.target.value}))} style={inputStyle} /></div>
        <div><label style={labelStyle}>GANTI TAKARAN TIAP</label><input type="text" placeholder="Contoh: 10 Hari" value={pakanInput.durasiGanti} onChange={(e) => setPakanInput(prev => ({...prev, durasiGanti: e.target.value}))} style={inputStyle} /></div>
      </div>
      
      <button onClick={handleSimpanTakaranPakan} style={{...updateBtnStyle, background: '#10b981', marginTop: '10px'}}>SIMPAN DATA TAKARAN</button>
    </div>

    <div style={{ ...historyBox, overflowX: 'auto', marginTop: '20px' }}>
       <table style={{...tableStyle, width: '100%', minWidth: '400px'}}>
         <thead>
           <tr style={trHead}>
             <th style={thStyle}>Ikan</th>
             <th style={thStyle}>Takaran</th>
             <th style={thStyle}>Kipas</th>
           </tr>
         </thead>
         <tbody>
           {listPakan?.map((item) => (
             <tr key={item.id} style={trBody}>
               <td style={tdStyle}>{item.namaIkan}</td>
               <td style={tdStyle}>{item.takaranPakan}</td>
               <td style={tdStyle}>{item.durasiKipas}s</td>
             </tr>
           ))}
         </tbody>
       </table>
    </div>
  </>
)}

           {/* HALAMAN HIDROPONIK */}
{halaman === 'hidroponik' && (
  <>
    <h2 style={{ color: '#38bdf8', textAlign: 'center', marginBottom: '20px' }}>🌱 Jurnal Hidroponik</h2>
    
    <div style={{ ...jurnalBox, display: 'flex', flexDirection: 'column', gap: '15px' }}>
      {/* Input Group */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div><label style={labelStyle}>TGL TANAM</label><input type="date" value={hidroInput.tglTanam} onChange={(e) => setHidroInput(prev => ({...prev, tglTanam: e.target.value}))} style={inputStyle} /></div>
        <div><label style={labelStyle}>TANAMAN</label><input type="text" placeholder="Nama Tanaman" value={hidroInput.namaTanaman} onChange={(e) => setHidroInput(prev => ({...prev, namaTanaman: e.target.value}))} style={inputStyle} /></div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div><label style={labelStyle}>PANEN (KG)</label><input type="number" placeholder="0" value={hidroInput.jumlahPanen} onChange={(e) => setHidroInput(prev => ({...prev, jumlahPanen: e.target.value}))} style={inputStyle} /></div>
        <div><label style={labelStyle}>HARGA (Rp)</label><input type="number" placeholder="0" value={hidroInput.hargaJual} onChange={(e) => setHidroInput(prev => ({...prev, hargaJual: e.target.value}))} style={inputStyle} /></div>
      </div>

      <button onClick={handleSimpanHidro} style={{...updateBtnStyle, background: '#10b981', marginTop: '5px'}}>
        SIMPAN DATA HIDROPONIK
      </button>
    </div>

    {/* Table History */}
    <div style={{ ...historyBox, overflowX: 'auto', marginTop: '20px' }}>
      <table style={{ ...tableStyle, width: '100%', minWidth: '450px' }}>
        <thead>
          <tr style={trHead}>
            <th style={thStyle}>Tanggal</th>
            <th style={thStyle}>Tanaman</th>
            <th style={thStyle}>Panen</th>
            <th style={thStyle}>Harga</th>
          </tr>
        </thead>
        <tbody>
          {listHidro?.map((item) => (
            <tr key={item.id} style={trBody}>
              <td style={tdStyle}>{item.tglTanam}</td>
              <td style={tdStyle}>{item.namaTanaman}</td>
              <td style={tdStyle}>{item.jumlahPanen || 0} Kg</td>
              <td style={tdStyle}>
                {item.hargaJual ? `Rp ${Number(item.hargaJual).toLocaleString('id-ID')}` : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
)}
           {/* HALAMAN LOG AIR */}
{halaman === 'air' && (
  <>
    <h2 style={{ color: '#38bdf8', textAlign: 'center', marginBottom: '20px' }}>💧 Log Pengurasan Air</h2>
    
    <div style={{ ...jurnalBox, display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div>
          <label style={labelStyle}>TGL KURAS</label>
          <input type="date" value={airInput.tglKuras} onChange={(e) => setAirInput(prev => ({...prev, tglKuras: e.target.value}))} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>KONDISI</label>
          <input type="text" placeholder="Contoh: Jernih" value={airInput.kondisiAir} onChange={(e) => setAirInput(prev => ({...prev, kondisiAir: e.target.value}))} style={inputStyle} />
        </div>
      </div>
      
      <div>
        <label style={labelStyle}>KETERANGAN</label>
        <input type="text" placeholder="Detail pengurasan..." value={airInput.keterangan} onChange={(e) => setAirInput(prev => ({...prev, keterangan: e.target.value}))} style={inputStyle} />
      </div>
      
      <button onClick={handleSimpanAir} style={{...updateBtnStyle, background: '#10b981'}}>
        SIMPAN LOG AIR
      </button>
    </div>

    {/* Tabel History */}
    <div style={{ ...historyBox, overflowX: 'auto', marginTop: '20px' }}>
      <table style={{ ...tableStyle, width: '100%', minWidth: '400px' }}>
        <thead>
          <tr style={trHead}>
            <th style={thStyle}>Tanggal</th>
            <th style={thStyle}>Kondisi</th>
            <th style={thStyle}>Keterangan</th>
          </tr>
        </thead>
        <tbody>
          {listAir?.map((item) => (
            <tr key={item.id} style={trBody}>
              <td style={tdStyle}>{item.tglKuras}</td>
              <td style={tdStyle}>{item.kondisiAir}</td>
              <td style={tdStyle}>{item.keterangan || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
)}
           {/* HALAMAN JURNAL IKAN */}
{halaman === 'log' && (
  <>
    <h2 style={{ color: '#38bdf8', textAlign: 'center', marginBottom: '20px' }}>📝 Jurnal Budidaya Ikan</h2>
    
    <div style={{ ...jurnalBox, display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div>
          <label style={labelStyle}>TGL BIBIT</label>
          <input type="date" value={jurnalInput.tglBibit} onChange={(e) => setJurnalInput(prev => ({...prev, tglBibit: e.target.value}))} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>JUMLAH</label>
          <input type="number" placeholder="0" value={jurnalInput.jumlahIkan} onChange={(e) => setJurnalInput(prev => ({...prev, jumlahIkan: e.target.value}))} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>UKURAN (CM)</label>
          <input type="text" placeholder="Contoh: 5" value={jurnalInput.ukuranBibit} onChange={(e) => setJurnalInput(prev => ({...prev, ukuranBibit: e.target.value}))} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>TGL SORTIR</label>
          <input type="date" value={jurnalInput.tglSortir} onChange={(e) => setJurnalInput(prev => ({...prev, tglSortir: e.target.value}))} style={inputStyle} />
        </div>
      </div>
      
      <button onClick={handleSimpanJurnalIkan} style={{...updateBtnStyle, background: '#10b981'}}>
        SIMPAN DATA IKAN
      </button>
    </div>

    {/* Tabel History */}
    <div style={{ ...historyBox, overflowX: 'auto', marginTop: '20px' }}>
      <table style={{ ...tableStyle, width: '100%', minWidth: '450px' }}>
        <thead>
          <tr style={trHead}>
            <th style={thStyle}>Tgl Bibit</th>
            <th style={thStyle}>Jumlah</th>
            <th style={thStyle}>Ukuran</th>
            <th style={thStyle}>Tgl Sortir</th>
          </tr>
        </thead>
        <tbody>
          {listJurnal?.map((item) => (
            <tr key={item.id} style={trBody}>
              <td style={tdStyle}>{item.tglBibit}</td>
              <td style={tdStyle}>{item.jumlahIkan || 0}</td>
              <td style={tdStyle}>{item.ukuranBibit || '-'}</td>
              <td style={tdStyle}>{item.tglSortir || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
)}

{/* HALAMAN PENGATURAN PAKAN */}
{halaman === 'pakan' && (
  <div style={formContainer}>
    <h2 style={{ color: '#38bdf8', textAlign: 'center', marginBottom: '25px' }}>⚙️ Pengaturan Pakan</h2>

    {/* RENTANG TANGGAL */}
    <div style={{ marginBottom: '20px' }}>
      <label style={labelStyle}>RENTANG TANGGAL (HARI KE-)</label>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        <div>
          <input 
            type="number" 
            placeholder="Mulai (ex: 1)" 
            value={data?.Jadwal || ''} 
            onChange={(e) => setData(prev => ({ ...prev, Jadwal: e.target.value }))} 
            style={inputStyle} 
          />
        </div>
        <div>
          <input 
            type="number" 
            placeholder="Selesai (ex: 30)" 
            value={data?.end_date || ''} 
            onChange={(e) => setData(prev => ({ ...prev, end_date: e.target.value }))} 
            style={inputStyle} 
          />
        </div>
      </div>
    </div>

    {/* JADWAL PAGI & SORE (Opsional: Tambahkan di bawah sini untuk melengkapi form) */}
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
        <div>
           <label style={labelStyle}>JAM PAGI</label>
           <input type="number" value={data?.jam_pagi || ''} onChange={(e) => setData(prev => ({ ...prev, jam_pagi: e.target.value }))} style={inputStyle} />
        </div>
        <div>
           <label style={labelStyle}>JAM SORE</label>
           <input type="number" value={data?.jam_sore || ''} onChange={(e) => setData(prev => ({ ...prev, jam_sore: e.target.value }))} style={inputStyle} />
        </div>
    </div>

    <button onClick={handleUpdatePakan} style={{...updateBtnStyle, background: '#10b981', width: '100%'}}>
      UPDATE JADWAL PAKAN
    </button>
  </div>
)}

  {/* JADWAL PAGI */}
<div style={{ marginBottom: '20px' }}>
  <label style={labelStyle}>JADWAL PAGI (JAM : MENIT)</label>
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 20px 1fr', alignItems: 'center', gap: '5px' }}>
    <input 
      type="number" 
      placeholder="00" 
      min="0" max="23"
      value={data?.jam_pagi ?? ''} 
      onChange={(e) => {
        const val = parseInt(e.target.value) || 0;
        setData(prev => ({ ...prev, jam_pagi: Math.min(Math.max(val, 0), 23) }));
      }} 
      style={inputStyle} 
    />
    <span style={{ color: '#38bdf8', fontWeight: 'bold', textAlign: 'center' }}>:</span>
    <input 
      type="number" 
      placeholder="00" 
      min="0" max="59"
      value={data?.menit_pagi ?? ''} 
      onChange={(e) => {
        const val = parseInt(e.target.value) || 0;
        setData(prev => ({ ...prev, menit_pagi: Math.min(Math.max(val, 0), 59) }));
      }} 
      style={inputStyle} 
    />
  </div>
</div>


   {/* JADWAL SORE */}
<div style={{ marginBottom: '20px' }}>
  <label style={labelStyle}>JADWAL SORE (JAM : MENIT)</label>
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 20px 1fr', alignItems: 'center', gap: '5px' }}>
    <input 
      type="number" 
      placeholder="00" 
      min="0" max="23"
      value={data?.jam_sore ?? ''} 
      onChange={(e) => {
        const val = parseInt(e.target.value) || 0;
        setData(prev => ({ ...prev, jam_sore: Math.min(Math.max(val, 0), 23) }));
      }} 
      style={inputStyle} 
    />
    <span style={{ color: '#38bdf8', fontWeight: 'bold', textAlign: 'center' }}>:</span>
    <input 
      type="number" 
      placeholder="00" 
      min="0" max="59"
      value={data?.menit_sore ?? ''} 
      onChange={(e) => {
        const val = parseInt(e.target.value) || 0;
        setData(prev => ({ ...prev, menit_sore: Math.min(Math.max(val, 0), 59) }));
      }} 
      style={inputStyle} 
    />
  </div>
</div>


    {/* DURASI */}
<div style={{ marginBottom: '25px' }}>
  <label style={labelStyle}>DURASI (DETIK)</label>
  <input 
    type="number" 
    placeholder="Contoh: 5"
    min="1" 
    max="60"
    value={data?.durasi_detik ?? ''} 
    onChange={(e) => {
      const val = parseInt(e.target.value) || 0;
      // Membatasi durasi antara 1 sampai 60 detik
      setData(prev => ({ ...prev, durasi_detik: Math.min(Math.max(val, 1), 60) }));
    }} 
    style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }} 
  />
</div>

<button 
  onClick={handleUpdatePakan} 
  style={{ ...updateBtnStyle, width: '100%', background: '#10b981' }}
>
  UPDATE JADWAL & DURASI
</button>
</div>
  )

// --- CSS-IN-JS STYLES (OPTIMIZED) ---
const headerStyle = { 
  padding: '20px', 
  borderBottom: '1px solid #1e293b', 
  textAlign: 'center', 
  background: '#0f172a', 
  position: 'sticky', 
  top: 0, 
  zIndex: 10 
};

const dashboardContainer = { maxWidth: '500px', margin: '0 auto', padding: '15px' };

const menuGrid = { 
  display: 'grid', 
  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
  gap: '15px' 
};

const menuCard = { 
  background: '#1e293b', 
  padding: '20px', 
  borderRadius: '20px', 
  display: 'flex', 
  flexDirection: 'column', 
  alignItems: 'center', 
  cursor: 'pointer', 
  border: '1px solid #334155', 
  transition: 'all 0.3s ease' // Menambahkan efek transisi halus
};

const iconCircle = { fontSize: '32px', marginBottom: '10px' };
const menuLabel = { fontSize: '14px', fontWeight: 'bold', color: '#f1f5f9' };
const subLabel = { fontSize: '11px', color: '#64748b', marginTop: '5px' };

const formContainer = { 
  background: '#1e293b', 
  padding: '20px', 
  borderRadius: '20px', 
  margin: '0 auto' 
};

const inputStyle = { 
  background: '#0f172a', 
  border: '1px solid #334155', 
  padding: '14px', 
  borderRadius: '10px', 
  color: '#38bdf8', 
  width: '100%', 
  boxSizing: 'border-box',
  fontSize: '16px' // Mencegah auto-zoom pada iPhone saat input
};

const labelStyle = { 
  fontSize: '12px', 
  color: '#94a3b8', 
  fontWeight: '600', 
  display: 'block', 
  marginBottom: '6px',
  letterSpacing: '0.5px'
};

const updateBtnStyle = { 
  width: '100%', 
  background: '#0ea5e9', 
  color: 'white', 
  border: 'none', 
  padding: '16px', 
  borderRadius: '12px', 
  fontWeight: 'bold', 
  cursor: 'pointer', 
  marginTop: '15px',
  fontSize: '14px'
};

const backBtnStyle = { 
  background: 'transparent', 
  border: '1px solid #334155', 
  color: '#38bdf8', 
  padding: '12px', 
  borderRadius: '10px', 
  marginBottom: '20px', 
  cursor: 'pointer', 
  width: '100%' 
};

const jurnalBox = { background: '#1e293b', padding: '20px', borderRadius: '20px', marginBottom: '20px' };
const historyBox = { background: '#1e293b', padding: '15px', borderRadius: '20px', overflowX: 'auto' };

const tableStyle = { width: '100%', borderCollapse: 'collapse', textAlign: 'left' };
const trHead = { borderBottom: '2px solid #334155' };
const thStyle = { padding: '12px', color: '#64748b', fontSize: '11px', textTransform: 'uppercase' };
const trBody = { borderBottom: '1px solid #334155' };
const tdStyle = { padding: '12px', fontSize: '13px', color: '#e2e8f0' };
export default App;