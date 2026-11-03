Feature: Kontrol Jadwal Pakan Ikan Otomatis
  Sebagai pengguna, saya ingin mengatur jadwal pemberian pakan ikan 
  agar ikan diberi makan secara otomatis tepat waktu.

  Scenario: Pengguna mengubah jadwal pemberian pakan ikan
    Given Pengguna berada di halaman dashboard Smart Pakan Ikan
    When Pengguna mengatur waktu pemberian pakan pada jam 08:00
    And Pengguna menekan tombol simpan
    Then Sistem harus menyimpan jadwal dan menampilkan notifikasi "Jadwal berhasil diperbarui"
    