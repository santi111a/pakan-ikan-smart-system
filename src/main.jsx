import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// Jika Anda tidak menggunakan index.css, Anda bisa menghapus baris di bawah
import './index.css'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then((reg) => console.log('Service Worker berhasil didaftarkan:', reg.scope))
      .catch((err) => console.log('Gagal mendaftarkan Service Worker:', err));
  });
}