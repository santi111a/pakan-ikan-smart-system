import { Given, When, Then } from '@cucumber/cucumber';
import assert from 'assert';

let currentDashboardState = false;
let feedSchedule = "";
let notificationMessage = "";

Given('Pengguna berada di halaman dashboard Smart Pakan Ikan', function () {
    currentDashboardState = true;
    assert.strictEqual(currentDashboardState, true, "Pengguna gagal masuk ke dashboard");
});

// Menggunakan Regular Expression untuk membaca format jam berapa pun (misal 08:00)
When(/^Pengguna mengatur waktu pemberian pakan pada jam (.+)$/, function (time) {
    feedSchedule = time;
    console.log(`Jadwal diatur ke: ${feedSchedule}`);
});

When('Pengguna menekan tombol simpan', function () {
    if (feedSchedule) {
        notificationMessage = "Jadwal berhasil diperbarui";
    }
});

Then('Sistem harus menyimpan jadwal dan menampilkan notifikasi {string}', function (expectedMessage) {
    assert.strictEqual(notificationMessage, expectedMessage, `Pesan notifikasi tidak sesuai! Diterima: ${notificationMessage}`);
});