import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Pastikan file index.css ada, atau hapus baris ini jika tidak menggunakan CSS global

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);