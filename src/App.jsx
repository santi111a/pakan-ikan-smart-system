import React, { useState } from 'react';
import './App.css'; // Opsional, styling utama sudah di-handle via CSS inline / global di bawah

export default function App() {
  // State Navigasi & Akun
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [user, setUser] = useState({ name: 'Ahmad Fauzi', email: 'ahmad.fauzi@email.com', phone: '' });
  const [registeredUsers, setRegisteredUsers] = useState({});
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [devStatus, setDevStatus] = useState('Terhubung');

  // State Fitur RAB
  const [rabList, setRabList] = useState([
    { d: '3 Okt 2026', s: 'Pakan Normal', f: '1.28' },
    { d: '3 Okt 2026', s: 'Pakan Normal', f: '1.28' },
  ]);
  const [fPakan, setFPakan] = useState(3.5);
  const [fBerat, setFBerat] = useState(450);
  const [fSuhu, setFSuhu] = useState(29);
  const [fPh, setFPh] = useState(7.5);
  const [fMati, setFMati] = useState(15);
  const [fTotal, setFTotal] = useState(150);
  const [fBiaya, setFBiaya] = useState(150000);
  const [fDesk, setFDesk] = useState('Pembelian obat');

  // State Pakan & Wi-Fi & Harian
  const [tglA, setTglA] = useState(1);
  const [tglB, setTglB] = useState(30);
  const [pagiH, setPagiH] = useState(8);
  const [pagiM, setPagiM] = useState(0);
  const [soreH, setSoreH] = useState(17);
  const [soreM, setSoreM] = useState(0);
  const [durasi, setDurasi] = useState(5);
  const [pakanInfo, setPakanInfo] = useState('');

  const [logs, setLogs] = useState([{ d: '3 Oktober 2026', t: 'ada ikan mati' }]);
  const [logText, setLogText] = useState('');

  const [ssid, setSsid] = useState('');
  const [wifiPass, setWifiPass] = useState('');
  const [wifiInfo, setWifiInfo] = useState('');
  const [logoutConfirm, setLogoutConfirm] = useState(false);

  // Form Auth State
  const [rNama, setRNama] = useState('');
  const [rMail, setRMail] = useState('');
  const [rHp, setRHp] = useState('');
  const [rPass, setRPass] = useState('');
  const [rPass2, setRPass2] = useState('');
  const [regErr, setRegErr] = useState('');

  const [lMail, setLMail] = useState('');
  const [lPass, setLPass] = useState('');
  const [loginErr, setLoginErr] = useState('');

  const [showRPass, setShowRPass] = useState(false);
  const [showLPass, setShowLPass] = useState(false);

  // Fungsi Toast Notifikasi
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2200);
  };

  // Kalkulasi FCR & Kondisi Air
  const fcrVal = fBerat > 0 ? (fPakan / (fBerat / 1000 * 2.2)).toFixed(2) : '0.00';
  const isWaterNormal = fPh >= 6.5 && fPh <= 8.5 && fSuhu >= 26 && fSuhu <= 32;

  // Handler Simpan RAB
  const handleSaveRab = () => {
    const todayStr = '7 Okt 2026';
    const newEntry = {
      d: todayStr,
      s: isWaterNormal ? 'Pakan Normal' : 'Kualitas Air Perlu Dicek',
      f: fcrVal,
    };
    setRabList([newEntry, ...rabList]);
    triggerToast('Jurnal RAB tersimpan');
  };

  const deleteRab = (idx) => {
    setRabList(rabList.filter((_, i) => i !== idx));
    triggerToast('Jurnal dihapus');
  };

  // Handler Log Harian
  const handleSaveLog = () => {
    if (!logText.trim()) {
      triggerToast('Tulis catatan dulu');
      return;
    }
    const newLog = { d: '7 Oktober 2026', t: logText.trim() };
    setLogs([newLog, ...logs]);
    setLogText('');
    triggerToast('Catatan disimpan ke riwayat');
  };

  const deleteLog = (idx) => {
    setLogs(logs.filter((_, i) => i !== idx));
    triggerToast('Catatan dihapus');
  };

  // Handler Pakan
  const handleSavePakan = () => {
    if (tglA < 1 || tglB > 31 || tglA > tglB) {
      triggerToast('Rentang tanggal tidak valid');
      return;
    }
    const pad = (n) => (n < 10 ? '0' : '') + n;
    setPakanInfo(`Aktif tanggal ${tglA}–${tglB} · pagi ${pad(pagiH)}:${pad(pagiM)} · sore ${pad(soreH)}:${pad(soreM)} · ${durasi} detik`);
    triggerToast('Jadwal dikirim ke alat');
  };

  // Handler WiFi
  const handleSyncWifi = () => {
    if (!ssid.trim()) {
      triggerToast('Isi nama Wi-Fi dulu');
      return;
    }
    setDevStatus('Menyambungkan…');
    setWifiInfo('Mengirim pengaturan ke alat…');
    setTimeout(() => {
      setDevStatus('Terhubung');
      setWifiInfo(`Alat terhubung ke "${ssid}".`);
      triggerToast('Wi-Fi alat diperbarui');
    }, 1400);
  };

  // Handler Register & Login
  const handleRegister = (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!rNama) { setRegErr('Isi nama lengkap Anda.'); return; }
    if (!emailRegex.test(rMail)) { setRegErr('Alamat email belum benar.'); return; }
    if (rPass.length < 8) { setRegErr('Kata sandi minimal 8 karakter.'); return; }
    if (rPass !== rPass2) { setRegErr('Konfirmasi kata sandi tidak sama.'); return; }

    const userData = { name: rNama, email: rMail.toLowerCase(), phone: rHp, pass: rPass };
    setRegisteredUsers({ ...registeredUsers, [rMail.toLowerCase()]: userData });
    setUser({ name: rNama, email: rMail.toLowerCase(), phone: rHp });
    setCurrentScreen('menu');
    triggerToast(`Pendaftaran berhasil, selamat datang ${rNama.split(' ')[0]}`);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(lMail)) { setLoginErr('Alamat email belum benar.'); return; }
    if (lPass.length < 8) { setLoginErr('Kata sandi minimal 8 karakter.'); return; }

    const found = registeredUsers[lMail.toLowerCase()];
    if (found && found.pass !== lPass) {
      setLoginErr('Kata sandi salah.');
      return;
    }

    if (found) {
      setUser(found);
    } else {
      setUser({ ...user, email: lMail.toLowerCase() });
    }
    setCurrentScreen('menu');
    triggerToast('Berhasil masuk');
  };

  const isAuthScreen = ['welcome', 'daftar', 'masuk'].includes(currentScreen);

  return (
    <div style={styles.body}>
      <main className="stage" style={styles.stage}>
        <div className={`phone ${isAuthScreen ? 'auth' : ''}`} style={{ ...styles.phone, ...(isAuthScreen ? styles.phoneAuth : {}) }}>
          
          {/* Brand & Header */}
          {!isAuthScreen && (
            <>
              <header style={styles.brand}>
                <h1 style={styles.brandH1}>SMART PAKAN IKAN</h1>
                <p style={styles.brandP}>KSTM AL IHYA</p>
              </header>
              <button style={styles.acctBtn} onClick={() => setCurrentScreen('akun')} type="button">
                <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2" style={{width: '34px', height: '34px'}}>
                  <circle cx="20" cy="20" r="17"/><circle cx="20" cy="16" r="5.5"/><path d="M8.5 31c2.5-5 6-7 11.5-7s9 2 11.5 7"/>
                </svg>
                <small style={{color: '#8d9bb8'}}>Account</small>
              </button>
            </>
          )}

          {/* 1. MENU UTAMA */}
          {currentScreen === 'menu' && (
            <section className="screen" style={styles.screen}>
              <button style={styles.menuItemPrimary} onClick={() => setCurrentScreen('rab')} type="button">
                <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" style={styles.menuSvg}>
                  <rect x="6" y="5" width="26" height="36" rx="3"/><rect x="10" y="9" width="18" height="7" rx="1"/>
                  <path d="M11 22h2M17 22h2M23 22h2M11 28h2M17 28h2M23 28h2M11 34h2M17 34h2M23 34h2"/>
                  <path d="M36 38c0-8 3-12 9-13-1 8-4 12-9 13z"/>
                </svg>
                <div style={{minWidth: 0, textAlign: 'left'}}>
                  <b style={{fontSize: '18px', display: 'block'}}>Jurnal RAB Petani</b>
                  <span style={{fontSize: '12.5px', color: '#8d9bb8'}}>Rencana Anggaran Biaya &amp; Jurnal Keuangan</span>
                </div>
              </button>

              <button style={styles.menuItem} onClick={() => setCurrentScreen('pakan')} type="button">
                <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" style={styles.menuSvg}>
                  <path d="M4 22c6-9 18-9 24 0-6 9-18 9-24 0z"/><circle cx="12" cy="21" r="1.3" fill="currentColor"/><path d="M28 22l7-6v12z"/><circle cx="38" cy="36" r="4"/><path d="M38 29v3M38 40v3M31 36h3M42 36h3"/>
                </svg>
                <div style={{minWidth: 0, textAlign: 'left'}}>
                  <b style={{fontSize: '16px', display: 'block'}}>Pengaturan Pakan</b>
                  <span style={{fontSize: '12.5px', color: '#8d9bb8'}}>Sinkronisasi Alat Otomatis</span>
                </div>
              </button>

              <button style={styles.menuItem} onClick={() => setCurrentScreen('harian')} type="button">
                <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" style={styles.menuSvg}>
                  <rect x="8" y="5" width="28" height="36" rx="3"/><path d="M14 14h16M14 21h16M14 28h9"/><path d="M33 36l10-14 3 2-10 14-4 1z"/>
                </svg>
                <div style={{minWidth: 0, textAlign: 'left'}}>
                  <b style={{fontSize: '16px', display: 'block'}}>Jurnal Harian</b>
                  <span style={{fontSize: '12.5px', color: '#8d9bb8'}}>{logs.length} Catatan Tersimpan</span>
                </div>
              </button>

              <button style={styles.menuItem} onClick={() => setCurrentScreen('wifi')} type="button">
                <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.4" style={styles.menuSvg}>
                  <path d="M6 19c10-9 26-9 36 0"/><path d="M12 26c7-6 17-6 24 0"/><path d="M18 33c4-3 8-3 12 0"/><circle cx="24" cy="39" r="1.8" fill="currentColor"/>
                </svg>
                <div style={{minWidth: 0, textAlign: 'left'}}>
                  <b style={{fontSize: '16px', display: 'block'}}>Pengaturan Wi-Fi</b>
                  <span style={{fontSize: '12.5px', color: '#8d9bb8'}}>Ganti Koneksi Internet Alat</span>
                </div>
              </button>

              <div style={styles.statusBox}>Status Alat: <em style={{color: devStatus === 'Terhubung' ? '#3ddc84' : '#ef4444', fontStyle: 'normal'}}>{devStatus}</em></div>
            </section>
          )}

          {/* 2. JURNAL RAB */}
          {currentScreen === 'rab' && (
            <section className="screen" style={styles.screen}>
              <h2 style={styles.title}>Integrasi Data Harian: Jurnal RAB Petani</h2>
              <p style={styles.sub}>Ikan Berumur 3 Bulan</p>
              
              <div style={styles.tblWrap}>
                <table style={styles.tableRab}>
                  <caption>Tabel Integrasi Data Harian</caption>
                  <thead>
                    <tr><th style={styles.thTd}>Aktivitas/Parameter</th><th style={styles.thTd}>Data Harian</th><th style={styles.thTd}>Satuan/Ket.</th></tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row" style={styles.thRow}>Pakan Harian</th>
                      <td style={styles.thTd}>
                        <div style={styles.cell}><label>Input pakan hari ini:</label><input style={styles.inputSm} type="number" step="0.1" value={fPakan} onChange={e=>setFPakan(parseFloat(e.target.value)||0)} /></div>
                      </td>
                      <td style={styles.unit}>kg</td>
                    </tr>
                    <tr>
                      <th scope="row" style={styles.thRow}>Sampling Ikan</th>
                      <td style={styles.thTd}>
                        <div style={styles.cell}><label>Berat Rata-Rata:</label><input style={styles.inputSm} type="number" value={fBerat} onChange={e=>setFBerat(parseFloat(e.target.value)||0)} /></div>
                        <div style={styles.cell}><label>FCR Aktual:</label><b className="num" style={{color:'#3ddc84'}}>{fcrVal}</b></div>
                      </td>
                      <td style={styles.unit}>gram/ekor</td>
                    </tr>
                    <tr>
                      <th scope="row" style={styles.thRow}>Kualitas Air</th>
                      <td style={styles.thTd}>
                        <div style={styles.cell}><label>Suhu:</label><input style={styles.inputSm} type="number" value={fSuhu} onChange={e=>setFSuhu(parseFloat(e.target.value)||0)} /></div>
                        <div style={styles.cell}><label>pH:</label><input style={styles.inputSm} type="number" step="0.1" value={fPh} onChange={e=>setFPh(parseFloat(e.target.value)||0)} /></div>
                        <div style={styles.cell}><label>Kondisi:</label><b style={{color: isWaterNormal ? '#3ddc84' : '#ef4444'}}>{isWaterNormal ? 'Normal' : 'Perlu dicek'}</b></div>
                      </td>
                      <td style={styles.unit}>°C / pH</td>
                    </tr>
                    <tr>
                      <th scope="row" style={styles.thRow}>Mortalitas</th>
                      <td style={styles.thTd}>
                        <div style={styles.cell}><label>Jumlah Hari Ini:</label><input style={styles.inputSm} type="number" value={fMati} onChange={e=>setFMati(e.target.value)} /></div>
                        <div style={styles.cell}><label>Total Siklus:</label><input style={styles.inputSm} type="number" value={fTotal} onChange={e=>setFTotal(e.target.value)} /></div>
                      </td>
                      <td style={styles.unit}>ekor</td>
                    </tr>
                    <tr>
                      <th scope="row" style={styles.thRow}>Biaya Insidental</th>
                      <td style={styles.thTd}>
                        <div style={styles.cell}><label>Rp</label><input style={styles.inputSm} type="number" value={fBiaya} onChange={e=>setFBiaya(e.target.value)} /></div>
                        <div style={styles.cell}><input style={{...styles.inputSm, width:'100%'}} type="text" value={fDesk} onChange={e=>setFDesk(e.target.value)} /></div>
                      </td>
                      <td style={styles.unit}>Rupiah</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div style={styles.actionsGrid}>
                <button style={styles.backBtn} onClick={() => setCurrentScreen('menu')} type="button">← Kembali</button>
                <button style={styles.btnPrimary} onClick={handleSaveRab} type="button">Simpan</button>
              </div>

              <h3 style={{fontSize:'16px', fontWeight:700, margin:'8px 0 0'}}>Jurnal RAB Tersimpan</h3>
              <ul style={styles.list}>
                {rabList.length === 0 ? <div style={styles.empty}>Belum ada jurnal tersimpan.</div> : rabList.map((r, i) => (
                  <li key={i} style={styles.listItem}>
                    <span>{r.d} - {r.s}, FCR {r.f}</span>
                    <button style={styles.delBtn} onClick={() => deleteRab(i)} type="button">Hapus</button>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* 3. PENGATURAN PAKAN */}
          {currentScreen === 'pakan' && (
            <section className="screen" style={styles.screen}>
              <button style={styles.backBtn} onClick={() => setCurrentScreen('menu')} type="button">← Kembali ke Menu</button>
              <h2 style={styles.title}>Pengaturan Jadwal Pakan</h2>
              
              <div>
                <label style={styles.cap}>Rentang Tanggal</label>
                <div style={styles.row2}>
                  <input style={styles.input} type="number" min="1" max="31" value={tglA} onChange={e=>setTglA(parseInt(e.target.value)||1)} />
                  <input style={styles.input} type="number" min="1" max="31" value={tglB} onChange={e=>setTglB(parseInt(e.target.value)||30)} />
                </div>
              </div>

              <div>
                <label style={styles.cap}>Jadwal Pagi</label>
                <div style={styles.rowTime}>
                  <input style={styles.input} type="number" min="0" max="23" value={pagiH} onChange={e=>setPagiH(parseInt(e.target.value)||0)} />
                  <span>:</span>
                  <input style={styles.input} type="number" min="0" max="59" value={pagiM} onChange={e=>setPagiM(parseInt(e.target.value)||0)} />
                </div>
              </div>

              <div>
                <label style={styles.cap}>Jadwal Sore</label>
                <div style={styles.rowTime}>
                  <input style={styles.input} type="number" min="0" max="23" value={soreH} onChange={e=>setSoreH(parseInt(e.target.value)||0)} />
                  <span>:</span>
                  <input style={styles.input} type="number" min="0" max="59" value={soreM} onChange={e=>setSoreM(parseInt(e.target.value)||0)} />
                </div>
              </div>

              <div>
                <label style={styles.cap}>Durasi (Detik)</label>
                <input style={styles.input} type="number" min="1" max="120" value={durasi} onChange={e=>setDurasi(parseInt(e.target.value)||1)} />
              </div>

              <button style={styles.btnPrimary} onClick={handleSavePakan} type="button">PERBARUI DATA &amp; AKTIFKAN</button>
              <p style={styles.hint}>{pakanInfo}</p>
            </section>
          )}

          {/* 4. JURNAL HARIAN */}
          {currentScreen === 'harian' && (
            <section className="screen" style={styles.screen}>
              <button style={styles.backBtn} onClick={() => setCurrentScreen('menu')} type="button">← Kembali ke Menu</button>
              <h2 style={styles.title}>Log Catatan Harian</h2>
              
              <div style={styles.logBox}>
                <label style={styles.cap}>Catatan hari ini</label>
                <textarea style={styles.textarea} placeholder="Contoh: pakan habis lebih cepat, air agak keruh" value={logText} onChange={e=>setLogText(e.target.value)} />
                <button style={styles.btnPrimary} onClick={handleSaveLog} type="button">Simpan Ke Riwayat</button>
              </div>

              <div style={styles.histHead}>
                <h3 style={{fontSize:'12.5px', textTransform:'uppercase', color:'#8d9bb8'}}>Riwayat Aktivitas</h3>
                <span style={styles.pill}>{logs.length} Total</span>
              </div>

              <div style={styles.list}>
                {logs.length === 0 ? <div style={styles.empty}>Belum ada catatan.</div> : logs.map((l, i) => (
                  <div key={i} style={styles.entry}>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                      <time style={{color:'#3ddc84', fontWeight:700, fontSize:'12.5px'}}>{l.d}</time>
                      <button style={styles.delBtn} onClick={() => deleteLog(i)} type="button">Hapus</button>
                    </div>
                    <p style={{margin:0}}>{l.t}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 5. PENGATURAN WI-FI */}
          {currentScreen === 'wifi' && (
            <section className="screen" style={styles.screen}>
              <button style={styles.backBtn} onClick={() => setCurrentScreen('menu')} type="button">← Kembali ke Menu</button>
              <h2 style={styles.title}>Pengaturan Wi-Fi Alat</h2>
              
              <div>
                <label style={styles.cap}>Nama Wi-Fi (SSID)</label>
                <input style={styles.input} type="text" placeholder="Masukkan nama Wi-Fi Anda" value={ssid} onChange={e=>setSsid(e.target.value)} />
              </div>
              <div>
                <label style={styles.cap}>Kata Sandi (Password)</label>
                <input style={styles.input} type="password" placeholder="Masukkan kata sandi Wi-Fi" value={wifiPass} onChange={e=>setWifiPass(e.target.value)} />
                <p style={{...styles.hint, textAlign:'left'}}>* Kosongkan jika jaringan bersifat publik/open.</p>
              </div>

              <button style={styles.btnPrimary} onClick={handleSyncWifi} type="button">SINKRONISASI WI-FI KE ALAT</button>
              <p style={styles.hint}>{wifiInfo}</p>
            </section>
          )}

          {/* 6. AKUN */}
          {currentScreen === 'akun' && (
            <section className="screen" style={styles.screen}>
              <h2 style={styles.title}>Akun Saya</h2>
              <div style={styles.profile}>
                <div style={styles.avatar}>
                  <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.6" width="84" height="84"><circle cx="20" cy="20" r="18"/><circle cx="20" cy="16" r="5.5"/><path d="M8 32c2.5-5 6-7 12-7s9.5 2 12 7"/></svg>
                </div>
                <b style={{fontSize:'17px'}}>{user.name}</b>
                <span style={{color:'#8d9bb8', fontSize:'13px'}}>{user.email}</span>
                <span style={{fontSize:'12.5px', color:'#8d9bb8'}}>Lokasi: KSTM Al Ihya</span>
              </div>
              <button style={styles.backBtn} onClick={() => setCurrentScreen('menu')} type="button">← Kembali ke Menu</button>
              <button style={styles.btnGhost} onClick={() => setLogoutConfirm(true)} type="button">Keluar Akun</button>

              {logoutConfirm && (
                <div style={styles.confirm}>
                  <span>Yakin ingin keluar dari akun ini?</span>
                  <div style={styles.actionsGrid}>
                    <button style={styles.backBtn} onClick={() => setLogoutConfirm(false)} type="button">Batal</button>
                    <button style={{...styles.btnPrimary, background:'#ef4444', color:'#fff'}} onClick={() => { setLogoutConfirm(false); setCurrentScreen('masuk'); triggerToast('Anda sudah keluar'); }} type="button">Keluar</button>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* 7. SELAMAT DATANG (WELCOME) */}
          {currentScreen === 'welcome' && (
            <section className="screen auth-screen center" style={{...styles.screen, textAlign:'center', justifyContent:'center', minHeight:'420px'}}>
              <h1 style={styles.authName}>SMART PAKAN IKAN</h1>
              <p style={styles.tagline}>Kelola Pakan Ikanmu Dengan Cerdas!</p>
              <button style={styles.pillBtn} onClick={() => setCurrentScreen('daftar')} type="button">Daftar</button>
              <p style={styles.alt}>Sudah punya akun? <button style={styles.linkBtn} onClick={() => setCurrentScreen('masuk')} type="button">Masuk di sini</button></p>
            </section>
          )}

          {/* 8. DAFTAR */}
          {currentScreen === 'daftar' && (
            <section className="screen auth-screen" style={styles.screen}>
              <h1 style={styles.authName}>SMART PAKAN IKAN</h1>
              <p style={styles.authLead}>Silakan isi data untuk mendaftar:</p>
              <form onSubmit={handleRegister} style={{display:'flex', flexDirection:'column', gap:'10px'}}>
                <div style={styles.field}><label>Nama Lengkap</label><input style={styles.authInput} type="text" placeholder="Masukkan Nama" value={rNama} onChange={e=>setRNama(e.target.value)} /></div>
                <div style={styles.field}><label>Email</label><input style={styles.authInput} type="email" placeholder="nama@email.com" value={rMail} onChange={e=>setRMail(e.target.value)} /></div>
                <div style={styles.field}><label>Nomor Telepon</label><input style={styles.authInput} type="tel" placeholder="0812..." value={rHp} onChange={e=>setRHp(e.target.value)} /></div>
                <div style={styles.field}><label>Buat Kata Sandi</label>
                  <div style={{position:'relative'}}>
                    <input style={styles.authInput} type={showRPass ? 'text' : 'password'} placeholder="Min. 8 karakter" value={rPass} onChange={e=>setRPass(e.target.value)} />
                    <button type="button" style={styles.eyeBtn} onClick={()=>setShowRPass(!showRPass)}>👁</button>
                  </div>
                </div>
                <div style={styles.field}><label>Konfirmasi Kata Sandi</label><input style={styles.authInput} type="password" placeholder="Ulangi Kata Sandi" value={rPass2} onChange={e=>setRPass2(e.target.value)} /></div>
                {regErr && <p style={styles.err}>{regErr}</p>}
                <button style={{...styles.pillBtn, width:'100%', marginTop:'10px'}} type="submit">Daftar Sekarang</button>
              </form>
              <p style={styles.alt}>Sudah punya akun? <button style={styles.linkBtn} onClick={() => setCurrentScreen('masuk')} type="button">Masuk di sini</button></p>
            </section>
          )}

          {/* 9. MASUK */}
          {currentScreen === 'masuk' && (
            <section className="screen auth-screen" style={styles.screen}>
              <h1 style={styles.authName}>SMART PAKAN IKAN</h1>
              <p style={styles.authLead}>Silakan masuk ke akun Anda:</p>
              <form onSubmit={handleLogin} style={{display:'flex', flexDirection:'column', gap:'10px'}}>
                <div style={styles.field}><label>Email</label><input style={styles.authInput} type="email" placeholder="nama@email.com" value={lMail} onChange={e=>setLMail(e.target.value)} /></div>
                <div style={styles.field}><label>Kata Sandi</label>
                  <div style={{position:'relative'}}>
                    <input style={styles.authInput} type={showLPass ? 'text' : 'password'} placeholder="Min. 8 karakter" value={lPass} onChange={e=>setLPass(e.target.value)} />
                    <button type="button" style={styles.eyeBtn} onClick={()=>setShowLPass(!showLPass)}>👁</button>
                  </div>
                </div>
                {loginErr && <p style={styles.err}>{loginErr}</p>}
                <button style={{...styles.pillBtn, width:'100%', marginTop:'10px'}} type="submit">Masuk</button>
              </form>
              <p style={{...styles.alt, marginTop:'20px'}}>Belum punya akun? <button style={styles.linkBtn} onClick={() => setCurrentScreen('daftar')} type="button">Daftar di sini</button></p>
            </section>
          )}

        </div>

    
      </main>

      {/* Toast Notification */}
      <div style={{...styles.toast, opacity: showToast ? 1 : 0, transform: showToast ? 'translate(-50%, 0)' : 'translate(-50%, 20px)'}}>
        {toastMessage}
      </div>
    </div>
  );
}

// Styling Terstruktur Ala Desain Terbaru
const styles = {
  body: { background: '#0b1220', color: '#e8eefb', fontFamily: '"Plus Jakarta Sans", sans-serif', minHeight: '100vh', padding: '20px 16px' },
  stage: { maxWidth: '420px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '14px' },
  phone: { background: '#131c2e', border: '1px solid #2a3957', borderRadius: '22px', padding: '20px 16px 22px', minHeight: '560px', position: 'relative' },
  phoneAuth: { paddingBlock: '28px' },
  brand: { textAlign: 'center', paddingInline: '56px' },
  brandH1: { margin: 0, fontSize: '21px', fontWeight: 800, color: '#3b9dff' },
  brandP: { margin: '2px 0 0', fontSize: '12px', letterSpacing: '.08em', color: '#8d9bb8' },
  acctBtn: { position: 'absolute', top: '14px', right: '14px', background: 'none', border: 0, color: '#e8eefb', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  screen: { display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '18px' },
  menuItem: { display: 'flex', alignItems: 'center', gap: '14px', width: '100%', textAlign: 'left', background: '#1c2740', border: '1px solid transparent', borderRadius: '14px', padding: '16px 14px', color: '#e8eefb', cursor: 'pointer' },
  menuItemPrimary: { display: 'flex', alignItems: 'center', gap: '14px', width: '100%', textAlign: 'left', background: '#1c2740', border: '1px solid #3b9dff', borderRadius: '14px', padding: '16px 14px', color: '#e8eefb', cursor: 'pointer' },
  menuSvg: { width: '44px', height: '44px', flex: 'none', color: '#3b9dff' },
  statusBox: { textAlign: 'center', fontSize: '12px', color: '#8d9bb8', marginTop: '6px' },
  title: { margin: '4px 0 0', textAlign: 'center', color: '#3b9dff', fontSize: '17px', fontWeight: 700 },
  sub: { textAlign: 'center', color: '#8d9bb8', fontSize: '12.5px', margin: '-6px 0 0' },
  cap: { display: 'block', fontSize: '11.5px', fontWeight: 700, letterSpacing: '.07em', color: '#8d9bb8', textTransform: 'uppercase', marginBottom: '6px' },
  input: { width: '100%', background: '#0a101c', color: '#e8eefb', border: '1px solid #2a3957', borderRadius: '10px', padding: '12px', fontSize: '15px' },
  inputSm: { width: '76px', padding: '6px 8px', fontSize: '13px', borderRadius: '7px', background: '#0a101c', color: '#e8eefb', border: '1px solid #2a3957' },
  row2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
  rowTime: { display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '8px', alignItems: 'center' },
  btnPrimary: { background: '#3b9dff', color: '#04111f', border: 0, borderRadius: '12px', padding: '14px', fontWeight: 800, fontSize: '14px', cursor: 'pointer', width: '100%', textAlign: 'center' },
  backBtn: { background: '#243252', color: '#e8eefb', border: 0, borderRadius: '12px', padding: '13px', fontWeight: 700, fontSize: '14px', cursor: 'pointer', width: '100%' },
  btnGhost: { background: 'transparent', color: '#ef4444', border: '1.5px solid #ef4444', borderRadius: '12px', padding: '14px', fontWeight: 800, width: '100%', cursor: 'pointer' },
  delBtn: { background: '#ef4444', color: '#fff', border: 0, borderRadius: '8px', padding: '6px 10px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' },
  tblWrap: { overflowX: 'auto', borderRadius: '10px', border: '1px solid #2a3957' },
  tableRab: { width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' },
  thTd: { border: '1px solid #2a3957', padding: '7px 8px', verticalAlign: 'middle' },
  thRow: { background: '#1c2740', border: '1px solid #2a3957', textAlign: 'center', width: '27%', padding: '7px' },
  unit: { color: '#8d9bb8', textAlign: 'center', width: '17%', border: '1px solid #2a3957' },
  cell: { display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '4px' },
  actionsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
  list: { display: 'flex', flexDirection: 'column', gap: '8px', margin: 0, padding: 0, listStyle: 'none' },
  listItem: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', background: '#1c2740', borderRadius: '10px', padding: '10px 12px', fontSize: '13px' },
  empty: { color: '#8d9bb8', textAlign: 'center', padding: '14px', background: '#1c2740', borderRadius: '10px', fontSize: '13px' },
  logBox: { background: '#1c2740', borderRadius: '14px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' },
  textarea: { minHeight: '110px', resize: 'vertical', background: '#0a101c', color: '#e8eefb', border: '1px solid #2a3957', borderRadius: '10px', padding: '12px' },
  histHead: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' },
  pill: { background: '#0a101c', color: '#3ddc84', fontWeight: 700, fontSize: '12.5px', padding: '5px 11px', borderRadius: '999px' },
  entry: { background: '#1c2740', borderRadius: '10px', borderLeft: '3px solid #3ddc84', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '6px' },
  profile: { background: '#1c2740', borderRadius: '16px', padding: '22px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', textAlign: 'center' },
  avatar: { width: '84px', height: '84px', color: '#3b9dff', marginBottom: '8px' },
  confirm: { background: '#1c2740', border: '1px solid #ef4444', borderRadius: '12px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'center' },
  authName: { margin: '6px 0 0', textAlign: 'center', fontSize: '21px', fontWeight: 800, color: '#e8eefb' },
  tagline: { margin: '6px 0 4px', color: '#7fb8e6', fontWeight: 600, fontSize: '15px' },
  authLead: { margin: '2px 0 0', textAlign: 'center', color: '#7fb8e6', fontWeight: 600, fontSize: '14.5px' },
  pillBtn: { background: '#eef6ff', color: '#1f3050', border: 0, borderRadius: '999px', padding: '13px 28px', fontWeight: 700, fontSize: '14.5px', cursor: 'pointer', boxShadow: '0 4px 14px rgba(0,0,0,.35)' },
  alt: { margin: '4px 0 0', textAlign: 'center', fontSize: '13.5px', color: '#e8eefb' },
  linkBtn: { background: 'none', border: 0, padding: 0, fontWeight: 600, color: '#7fb8e6', cursor: 'pointer', textDecoration: 'underline' },
  field: { display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'left', fontSize: '12.5px' },
  authInput: { border: '2px solid #4f86b3', borderRadius: '12px', padding: '11px 12px', background: 'transparent', color: '#e8eefb', width: '100%', fontSize: '14px' },
  eyeBtn: { position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 0, cursor: 'pointer', fontSize: '16px' },
  err: { margin: 0, minHeight: '18px', textAlign: 'center', color: '#ff8a8a', fontSize: '12.5px' },
  toast: { position: 'fixed', left: '50%', bottom: '20px', background: '#e8eefb', color: '#0b1220', padding: '10px 16px', borderRadius: '999px', fontWeight: 700, fontSize: '13px', transition: 'opacity .2s, transform .2s', zIndex: 10, pointerEvents: 'none' },
  hint: { textAlign: 'center', color: '#8d9bb8', fontSize: '12px', margin: '4px 0' }
};