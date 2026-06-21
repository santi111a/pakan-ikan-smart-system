import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient'; // Import supabase


function App() {
  const [halaman, setHalaman] = useState('beranda');

  // 1. STATE SISTEM UTAMA (FIREBASE ROOT)
  const [data, setData] = useState({
    Jadwal: 0, end_date: 0, jam_pagi: 0, menit_pagi: 0,
    jam_sore: 0, menit_sore: 0, durasi_detik: 0, kipas_on: false,
    wifi_ssid: '', wifi_pass: '' // State baru untuk membaca data wifi dari DB
  });

  // 2. STATE INPUT & LIST DATA
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

  // STATE KHUSUS PENGATURAN WIFI
  const [wifiInput, setWifiInput] = useState({ ssid: '', pass: '' });

  /// --- AMBIL DATA DARI SUPABASE ---
  useEffect(() => {
    const fetchData = async () => {
      // 1. Ambil data Pengaturan (asumsi tabelnya bernama 'pengaturan')
      const { data: config } = await supabase.from('pengaturan').select('*').single();
      if (config) setData(prev => ({ ...prev, ...config }));

      // 2. Ambil data Jurnal Harian
      const { data: jurnal } = await supabase.from('jurnal_harian').select('*').order('id', { ascending: false });
      if (jurnal) setListJurnal(jurnal);

      // 3. Ambil data Log Pengurasan
      const { data: air } = await supabase.from('log_pengurasan').select('*').order('id', { ascending: false });
      if (air) setListAir(air);

      // 4. Ambil data Jurnal Hidroponik
      const { data: hidro } = await supabase.from('jurnal_hidroponik').select('*').order('id', { ascending: false });
      if (hidro) setListHidro(hidro);

      // 5. Ambil data Jurnal Pakan
      const { data: pakan } = await supabase.from('jurnal_pakan').select('*').order('id', { ascending: false });
      if (pakan) setListPakan(pakan);
    };
    fetchData();
  }, []);

  // Fungsi untuk memperbarui Jadwal Pakan di Supabase
  const handleUpdatePakan = async () => {
    try {
      const { data, error } = await supabase
        .from('pengaturan')
        .update({
          jadwal_pagi: jamPagi,
          jadwal_sore: jamSore,
          durasi: durasiPakan
        })
        .eq('id', 1);

      if (error) throw error;

      alert("✅ Pengaturan Pakan Diperbarui!");
      window.location.reload();

    } catch (err) {
      console.error("Error Detail:", err);
      alert("❌ Gagal memperbarui: " + err.message);
    }
  };

  const handleUpdateWifi = async () => {
    if (!wifiInput.ssid || !wifiInput.pass) return alert("Isi SSID dan Password WiFi!");

    const { error } = await supabase
      .from('pengaturan')
      .update({
        wifi_ssid: wifiInput.ssid,
        wifi_pass: wifiInput.pass
      })
      .eq('id', 1);

    alert("✅ Kredensial WiFi Terkirim! ESP32 akan mencoba menyambung ulang.");

    if (error) {
      alert("Gagal: " + error.message);
    } else {
      alert("✅ Kredensial WiFi Terkirim! ESP32 akan mencoba menyambung ulang.");
      setWifiInput({ ssid: '', pass: '' });
      // Opsional: panggil fetchData() lagi untuk memperbarui tampilan
    }
  };

  // 1. Simpan Jurnal Ikan
  const handleSimpanJurnalIkan = async () => {
    if (!jurnalInput.tglBibit) return alert("Pilih tanggal!");

    const { error } = await supabase.from('jurnal_harian').insert([jurnalInput]);

    if (error) {
      alert("Gagal: " + error.message);
    } else {
      alert("✅ Jurnal Ikan Tersimpan!");
      setJurnalInput({ tglBibit: '', jumlahIkan: '', ukuranBibit: '', tglSortir: '' });
      fetchData(); // Memperbarui daftar data di layar
    }
  };

  // 2. Simpan Log Air
  const handleSimpanAir = async () => {
    if (!airInput.tglKuras) return alert("Pilih tanggal!");

    const { error } = await supabase.from('log_pengurasan').insert([airInput]);

    if (error) {
      alert("Gagal: " + error.message);
    } else {
      alert("✅ Log Air Tersimpan!");
      setAirInput({ tglKuras: '', kondisiAir: '', keterangan: '' });
      fetchData();
    }
  };

  // 3. Simpan Hidroponik
  const handleSimpanHidro = async () => {
    if (!hidroInput.tglTanam || !hidroInput.namaTanaman) return alert("Isi tanggal dan nama tanaman!");

    const { error } = await supabase.from('jurnal_hidroponik').insert([hidroInput]);

    if (error) {
      alert("Gagal: " + error.message);
    } else {
      alert("✅ Data Hidroponik Tersimpan!");
      setHidroInput({ tglTanam: '', namaTanaman: '', jumlahPanen: '', hargaJual: '' });
      fetchData();
    }
  };

  // 4. Simpan Takaran Pakan
  const handleSimpanTakaranPakan = async () => {
    if (!pakanInput.namaIkan || !pakanInput.takaranPakan) return alert("Lengkapi data pakan!");

    const { error } = await supabase.from('jurnal_pakan').insert([pakanInput]);

    if (error) {
      alert("Gagal: " + error.message);
    } else {
      alert("✅ Jurnal Takaran Pakan Tersimpan!");
      setPakanInput({ namaIkan: '', usiaIkan: '', ukuranIkan: '', takaranPakan: '', durasiKipas: '', durasiGanti: '' });
      fetchData();
    }
  };

  // Tambahkan fungsi ini
  const handleToggleKipas = async () => {
    // 1. Ambil status saat ini
    const statusBaru = data.kipas_status === 1 ? 0 : 1;

    // 2. Update state lokal SEGERA agar tampilan berubah instan di web
    setData(prev => ({ ...prev, kipas_status: statusBaru }));

    // 3. Update ke Database Supabase
    const { error } = await supabase
      .from('pengaturan')
      .update({ kipas_status: statusBaru })
      .eq('id', 1); // Memastikan baris data yang diupdate adalah baris pertama

    if (error) {
      console.error("Gagal update:", error);
      alert("❌ Gagal mengubah status kipas: " + error.message);

      // Jika gagal, kembalikan state lokal ke status lama
      setData(prev => ({ ...prev, kipas_status: data.kipas_status }));
  
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: 'white', fontFamily: 'sans-serif' }}>

      {/* --- HEADER --- */}
      <div style={headerStyle}>
        <h2 style={{ color: '#38bdf8', margin: 0, fontSize: '20px', letterSpacing: '1px', textTransform: 'uppercase' }}>
          Smart Farming KSTM AL IHYA
        </h2>
      </div>

      <div style={{ padding: '15px' }}>

        {/* --- DASHBOARD UTAMA --- */}
        {halaman === 'beranda' && (
          <div style={dashboardContainer}>
            <div style={menuGrid}>
              <div onClick={() => setHalaman('pakan')} style={menuCard}>
                <div style={iconCircle}>🐟</div>
                <span style={menuLabel}>Jadwal Pakan</span>
                <span style={subLabel}>Pagi {data.jam_pagi}:{data.menit_pagi}</span>
              </div>
              <div onClick={() => setHalaman('takaran')} style={menuCard}>
                <div style={iconCircle}>⚖️</div>
                <span style={menuLabel}>Takaran Pakan</span>
                <span style={subLabel}>{listPakan.length} Log</span>
              </div>
              <div onClick={() => setHalaman('wifi')} style={menuCard}>
                <div style={iconCircle}>📶</div>
                <span style={menuLabel}>Set WiFi</span>
                <span style={subLabel}>{data.wifi_ssid || 'Belum Set'}</span>
              </div>
              <div onClick={() => setHalaman('log')} style={menuCard}>
                <div style={iconCircle}>📓</div>
                <span style={menuLabel}>Jurnal Ikan</span>
                <span style={subLabel}>{listJurnal.length} Catatan</span>
              </div>
              <div onClick={() => setHalaman('air')} style={menuCard}>
                <div style={iconCircle}>💧</div>
                <span style={menuLabel}>Log Air</span>
                <span style={subLabel}>{listAir[0]?.kondisiAir || 'N/A'}</span>
              </div>
              <div onClick={() => setHalaman('hidroponik')} style={menuCard}>
                <div style={iconCircle}>🌱</div>
                <span style={menuLabel}>Hidroponik</span>
                <span style={subLabel}>{listHidro.length} Data</span>
              </div>
              <div style={{ marginTop: '25px', padding: '20px', background: '#1e293b', borderRadius: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #334155' }}>
                <div>
                  <div style={{ fontWeight: 'bold' }}>Kontrol Pakan Manual</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>Klik untuk beri pakan sekarang</div>
                  Status: {data.kipas_status === 1 ? <span style={{ color: '#10b981' }}>AKTIF</span> : <span style={{ color: '#ef4444' }}>OFF</span>}
                </div>
              </div>
              <button
                onClick={handleToggleKipas}
                style={{
                  border: 'none',
                  color: 'white',
                  padding: '10px 15px',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  background: data.kipas_status === 1 ? '#ef4444' : '#f59e0b'
                }}>
                {data.kipas_status === 1 ? 'MATIKAN' : 'HIDUPKAN'}
              </button>
            </div>
          </div>
        )}

        {/* --- AREA HALAMAN DETAIL --- */}
        {halaman !== 'beranda' && (
          <div style={{ animation: 'fadeIn 0.3s', maxWidth: '900px', margin: '0 auto' }}>
            <button onClick={() => setHalaman('beranda')} style={backBtnStyle}>⬅ Kembali ke Dashboard</button>

            {/* HALAMAN PENGATURAN WIFI */}
            {halaman === 'wifi' && (
              <div style={formContainer}>
                <h2 style={{ color: '#38bdf8', textAlign: 'center' }}>📶 Pengaturan WiFi Alat</h2>
                <p style={{ fontSize: '12px', color: '#94a3b8', textAlign: 'center', marginBottom: '20px' }}>
                  Update SSID dan Password agar alat (ESP32) dapat terhubung ke internet.
                </p>
                <div style={{ marginBottom: '15px' }}>
                  <label style={labelStyle}>NAMA WIFI (SSID)</label>
                  <input type="text" placeholder="Masukkan SSID" value={wifiInput.ssid} onChange={(e) => setWifiInput({ ...wifiInput, ssid: e.target.value })} style={inputStyle} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <label style={labelStyle}>PASSWORD WIFI</label>
                  <input type="password" placeholder="Masukkan Password" value={wifiInput.pass} onChange={(e) => setWifiInput({ ...wifiInput, pass: e.target.value })} style={inputStyle} />
                </div>
                <button onClick={handleUpdateWifi} style={{ ...updateBtnStyle, background: '#10b981' }}>KIRIM KE ALAT</button>
                <div style={{ marginTop: '20px', padding: '10px', background: '#0f172a', borderRadius: '8px', textAlign: 'center' }}>
                  <small style={{ color: '#64748b' }}>SSID Saat Ini: </small>
                  <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>{data.wifi_ssid || '-'}</span>
                </div>
              </div>
            )}

            {/* HALAMAN TAKARAN PAKAN */}
            {halaman === 'takaran' && (
              <>
                <h2 style={{ color: '#38bdf8', marginBottom: '20px' }}>⚖️ Jurnal Takaran Pakan</h2>
                <div style={jurnalBox}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                    <div><label style={labelStyle}>NAMA IKAN</label><input type="text" placeholder="Lele/Nila" value={pakanInput.namaIkan} onChange={(e) => setPakanInput({ ...pakanInput, namaIkan: e.target.value })} style={inputStyle} /></div>
                    <div><label style={labelStyle}>USIA IKAN</label><input type="text" placeholder="Contoh: 2 Minggu" value={pakanInput.usiaIkan} onChange={(e) => setPakanInput({ ...pakanInput, usiaIkan: e.target.value })} style={inputStyle} /></div>
                    <div><label style={labelStyle}>UKURAN IKAN (CM)</label><input type="text" placeholder="Contoh: 5-7 cm" value={pakanInput.ukuranIkan} onChange={(e) => setPakanInput({ ...pakanInput, ukuranIkan: e.target.value })} style={inputStyle} /></div>
                    <div><label style={labelStyle}>TAKARAN PAKAN (GR/KG)</label><input type="text" placeholder="Contoh: 500 gr" value={pakanInput.takaranPakan} onChange={(e) => setPakanInput({ ...pakanInput, takaranPakan: e.target.value })} style={inputStyle} /></div>
                    <div><label style={labelStyle}>DURASI KIPAS (DETIK)</label><input type="number" placeholder="Contoh: 30" value={pakanInput.durasiKipas} onChange={(e) => setPakanInput({ ...pakanInput, durasiKipas: e.target.value })} style={inputStyle} /></div>
                    <div><label style={labelStyle}>DURASI GANTI TAKARAN</label><input type="text" placeholder="Contoh: 10 Hari Sekali" value={pakanInput.durasiGanti} onChange={(e) => setPakanInput({ ...pakanInput, durasiGanti: e.target.value })} style={inputStyle} /></div>
                  </div>
                  <button onClick={handleSimpanTakaranPakan} style={{ ...updateBtnStyle, background: '#10b981' }}>SIMPAN DATA TAKARAN</button>
                </div>
                <div style={historyBox}>
                  <table style={tableStyle}>
                    <thead><tr style={trHead}>
                      <th style={thStyle}>Ikan</th>
                      <th style={thStyle}>Usia/Size</th>
                      <th style={thStyle}>Takaran</th>
                      <th style={thStyle}>Kipas (Dtk)</th>
                      <th style={thStyle}>Ganti Tiap</th>
                    </tr></thead>
                    <tbody>
                      {listPakan.map((item) => (
                        <tr key={item.id} style={trBody}>
                          <td style={tdStyle}>{item.namaIkan}</td>
                          <td style={tdStyle}>{item.usiaIkan} / {item.ukuranIkan}</td>
                          <td style={tdStyle}>{item.takaranPakan}</td>
                          <td style={tdStyle}>{item.durasiKipas}s</td>
                          <td style={tdStyle}>{item.durasiGanti}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {halaman === 'hidroponik' && (
              <>
                <h2 style={{ color: '#38bdf8', marginBottom: '20px' }}>🌱 Jurnal Hidroponik</h2>
                <div style={jurnalBox}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px' }}>
                    <div><label style={labelStyle}>TGL TANAM</label><input type="date" value={hidroInput.tglTanam} onChange={(e) => setHidroInput({ ...hidroInput, tglTanam: e.target.value })} style={inputStyle} /></div>
                    <div><label style={labelStyle}>NAMA TANAMAN</label><input type="text" value={hidroInput.namaTanaman} onChange={(e) => setHidroInput({ ...hidroInput, namaTanaman: e.target.value })} style={inputStyle} /></div>
                    <div><label style={labelStyle}>PANEN (KG)</label><input type="text" value={hidroInput.jumlahPanen} onChange={(e) => setHidroInput({ ...hidroInput, jumlahPanen: e.target.value })} style={inputStyle} /></div>
                    <div><label style={labelStyle}>HARGA JUAL</label><input type="number" value={hidroInput.hargaJual} onChange={(e) => setHidroInput({ ...hidroInput, hargaJual: e.target.value })} style={inputStyle} /></div>
                  </div>
                  <button onClick={handleSimpanHidro} style={{ ...updateBtnStyle, background: '#10b981' }}>SIMPAN DATA HIDROPONIK</button>
                </div>
                <div style={historyBox}>
                  <table style={tableStyle}>
                    <thead><tr style={trHead}><th style={thStyle}>Tanggal</th><th style={thStyle}>Tanaman</th><th style={thStyle}>Panen</th><th style={thStyle}>Harga</th></tr></thead>
                    <tbody>
                      {listHidro.map((item) => (
                        <tr key={item.id} style={trBody}>
                          <td style={tdStyle}>{item.tglTanam}</td>
                          <td style={tdStyle}>{item.namaTanaman}</td>
                          <td style={tdStyle}>{item.jumlahPanen || '-'}</td>
                          <td style={tdStyle}>{item.hargaJual ? `Rp ${Number(item.hargaJual).toLocaleString('id-ID')}` : '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {halaman === 'air' && (
              <>
                <h2 style={{ color: '#38bdf8', marginBottom: '20px' }}>💧 Log Pengurasan Air</h2>
                <div style={jurnalBox}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div><label style={labelStyle}>TGL KURAS</label><input type="date" value={airInput.tglKuras} onChange={(e) => setAirInput({ ...airInput, tglKuras: e.target.value })} style={inputStyle} /></div>
                    <div><label style={labelStyle}>KONDISI</label><input type="text" placeholder="Hijau/Keruh" value={airInput.kondisiAir} onChange={(e) => setAirInput({ ...airInput, kondisiAir: e.target.value })} style={inputStyle} /></div>
                  </div>
                  <div style={{ marginTop: '15px' }}><label style={labelStyle}>KETERANGAN</label><input type="text" value={airInput.keterangan} onChange={(e) => setAirInput({ ...airInput, keterangan: e.target.value })} style={inputStyle} /></div>
                  <button onClick={handleSimpanAir} style={updateBtnStyle}>SIMPAN DATA AIR</button>
                </div>
                <div style={historyBox}>
                  <table style={tableStyle}>
                    <thead><tr style={trHead}><th style={thStyle}>Tanggal</th><th style={thStyle}>Kondisi</th><th style={thStyle}>Keterangan</th></tr></thead>
                    <tbody>
                      {listAir.map((item) => (
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

            {halaman === 'log' && (
              <>
                <h2 style={{ color: '#38bdf8', marginBottom: '20px' }}>📝 Jurnal Budidaya Ikan</h2>
                <div style={jurnalBox}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div><label style={labelStyle}>TGL BIBIT</label><input type="date" value={jurnalInput.tglBibit} onChange={(e) => setJurnalInput({ ...jurnalInput, tglBibit: e.target.value })} style={inputStyle} /></div>
                    <div><label style={labelStyle}>JUMLAH</label><input type="number" value={jurnalInput.jumlahIkan} onChange={(e) => setJurnalInput({ ...jurnalInput, jumlahIkan: e.target.value })} style={inputStyle} /></div>
                    <div><label style={labelStyle}>UKURAN (CM)</label><input type="text" value={jurnalInput.ukuranBibit} onChange={(e) => setJurnalInput({ ...jurnalInput, ukuranBibit: e.target.value })} style={inputStyle} /></div>
                    <div><label style={labelStyle}>TGL SORTIR</label><input type="date" value={jurnalInput.tglSortir} onChange={(e) => setJurnalInput({ ...jurnalInput, tglSortir: e.target.value })} style={inputStyle} /></div>
                  </div>
                  <button onClick={handleSimpanJurnalIkan} style={updateBtnStyle}>SIMPAN DATA IKAN</button>
                </div>
                <div style={historyBox}>
                  <table style={tableStyle}>
                    <thead><tr style={trHead}><th style={thStyle}>Tgl Bibit</th><th style={thStyle}>Jumlah</th><th style={thStyle}>Ukuran</th><th style={thStyle}>Tgl Sortir</th></tr></thead>
                    <tbody>
                      {listJurnal.map((item) => (
                        <tr key={item.id} style={trBody}>
                          <td style={tdStyle}>{item.tglBibit}</td>
                          <td style={tdStyle}>{item.jumlahIkan}</td>
                          <td style={tdStyle}>{item.ukuranBibit}</td>
                          <td style={tdStyle}>{item.tglSortir}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {halaman === 'pakan' && (
              <div style={formContainer}>
                <h2 style={{ color: '#38bdf8', textAlign: 'center', marginBottom: '25px' }}>⚙️ Pengaturan Pakan</h2>

                {/* RENTANG TANGGAL */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={labelStyle}>RENTANG TANGGAL (MULAI - SELESAI)</label>
                  <div style={{ display: 'flex', gap: '15px' }}>
                    <input type="number" placeholder="Mulai" value={data.Jadwal} onChange={(e) => setData({ ...data, Jadwal: e.target.value })} style={inputStyle} />
                    <input type="number" placeholder="Selesai" value={data.end_date} onChange={(e) => setData({ ...data, end_date: e.target.value })} style={inputStyle} />
                  </div>
                </div>

                {/* JADWAL PAGI */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={labelStyle}>JADWAL PAGI (JAM : MENIT)</label>
                  <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <input type="number" placeholder="Jam" value={data.jam_pagi} onChange={(e) => setData({ ...data, jam_pagi: parseInt(e.target.value) || 0 })} style={inputStyle} />
                    <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>:</span>
                    <input type="number" placeholder="Menit" value={data.menit_pagi} onChange={(e) => setData({ ...data, menit_pagi: parseInt(e.target.value) || 0 })} style={inputStyle} />
                  </div>
                </div>

                {/* JADWAL SORE */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={labelStyle}>JADWAL SORE (JAM : MENIT)</label>
                  <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <input type="number" placeholder="Jam" value={data.jam_sore} onChange={(e) => setData({ ...data, jam_sore: parseInt(e.target.value) || 0 })} style={inputStyle} />
                    <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>:</span>
                    {/* PERBAIKAN: menit_soref diganti menjadi menit_sore */}
                    <input type="number" placeholder="Menit" value={data.menit_sore} onChange={(e) => setData({ ...data, menit_sore: parseInt(e.target.value) || 0 })} style={inputStyle} />
                  </div>
                </div>

                {/* DURASI */}
                <div style={{ marginBottom: '25px' }}>
                  <label style={labelStyle}>DURASI (DETIK)</label>
                  <input type="number" value={data.durasi_detik} onChange={(e) => setData({ ...data, durasi_detik: parseInt(e.target.value) || 0 })} style={{ ...inputStyle, width: '100%' }} />
                </div>

                <button onClick={handleUpdatePakan} style={updateBtnStyle}>UPDATE JADWAL</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
  };

  // --- CSS-IN-JS STYLES ---
  const headerStyle = { padding: '20px', borderBottom: '1px solid #1e293b', textAlign: 'center', background: '#0f172a', position: 'sticky', top: 0, zIndex: 10 };
  const dashboardContainer = { maxWidth: '500px', margin: '0 auto' };
  const menuGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' };
  const menuCard = { background: '#1e293b', padding: '20px', borderRadius: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', border: '1px solid #334155', transition: '0.2s' };
  const iconCircle = { fontSize: '32px', marginBottom: '10px' };
  const menuLabel = { fontSize: '14px', fontWeight: 'bold' };
  const subLabel = { fontSize: '11px', color: '#94a3b8', marginTop: '5px' };
  const kipasBox = { marginTop: '25px', padding: '20px', background: '#1e293b', borderRadius: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #334155' };
  const toggleBtn = { border: 'none', color: 'white', padding: '10px 15px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' };
  const formContainer = { background: '#1e293b', padding: '25px', borderRadius: '20px', maxWidth: '400px', margin: '0 auto' };
  const inputStyle = { background: '#0f172a', border: '1px solid #334155', padding: '12px', borderRadius: '8px', color: '#38bdf8', width: '100%', boxSizing: 'border-box' };
  const labelStyle = { fontSize: '11px', color: '#64748b', fontWeight: 'bold', display: 'block', marginBottom: '5px' };
  const updateBtnStyle = { width: '100%', background: '#0ea5e9', color: 'white', border: 'none', padding: '14px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' };
  const backBtnStyle = { background: '#1e293b', border: '1px solid #334155', color: '#38bdf8', padding: '12px', borderRadius: '10px', marginBottom: '20px', cursor: 'pointer', width: '100%' };
  const jurnalBox = { background: '#1e293b', padding: '25px', borderRadius: '20px', marginBottom: '20px' };
  const historyBox = { background: '#1e293b', padding: '15px', borderRadius: '20px', overflowX: 'auto' };
  const tableStyle = { width: '100%', borderCollapse: 'collapse' };
  const trHead = { borderBottom: '2px solid #334155', textAlign: 'left' };
  const thStyle = { padding: '12px', color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase' };
  const trBody = { borderBottom: '1px solid #334155' };
  const tdStyle = { padding: '12px', fontSize: '14px', color: '#e2e8f0' };
  const pakanManualBox = { marginTop: '25px', padding: '20px', background: '#1e293b', borderRadius: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #334155' };
  export default App;
}