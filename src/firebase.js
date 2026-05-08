import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Konfigurasi Firebase sesuai dengan akun proyek Pakan Ikan Pintar Anda
const firebaseConfig = {
  apiKey: "AIzaSyA4N3uadS5_mQH6sXs-1N4q2JKa0UjPJ5I",
  authDomain: "pakan-ikan-pintar.firebaseapp.com",
  databaseURL: "https://pakan-ikan-pintar-default-rtdb.firebaseio.com",
  projectId: "pakan-ikan-pintar",
  storageBucket: "pakan-ikan-pintar.firebasestorage.app",
  messagingSenderId: "396608989088",
  appId: "1:396608989088:web:0935e5b7999df8a2a926c5",
  measurementId: "G-501P0T3WVF"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Ekspor database agar bisa diimpor oleh Aplikasi.jsx untuk menampilkan data di Beranda
export const db = getDatabase(app);
