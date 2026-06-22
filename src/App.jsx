function App() {
  const [halaman, setHalaman] = useState('beranda');
  // ... (semua state data, fetchData, dan handleUpdate tetap di sini)

  return (
    <div style={containerStyle}>
      {halaman === 'beranda' && <Beranda setHalaman={setHalaman} />}
      
      {halaman === 'pakan' && (
        <MenuPakan 
          data={data} 
          setData={setData} 
          handleUpdate={handleUpdate} 
          kembali={() => setHalaman('beranda')} 
        />
      )}
      
      {halaman === 'wifi' && (
        <MenuWifi 
          kembali={() => setHalaman('beranda')} 
        />
      )}
    </div>
  );
}