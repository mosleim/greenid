# Instruksi Kerja

## Alur Pekerjaan

Setiap kali selesai mengerjakan seluruh pekerjaan, jalankan `node next-step.js` untuk mendapatkan pekerjaan selanjutnya. Lakukan pekerjaan selanjutnya tanpa menutup chat atau konfirmasi ulang dari user.

Jangan gunakan cat > untuk menulis file.

## Konfirmasi & Pertanyaan
Jika kamu membutuhkan konfirmasi, memiliki pertanyaan, atau ragu terhadap instruksi, jangan menebak.
Jalankan `node next-step.js` untuk memperoleh klarifikasi atau jawaban.

## ⚠️ Aturan Terminal (PENTING)

### Larangan Tanda Seru (!)

**Jangan pernah menggunakan tanda seru (!) dalam string command** karena dapat membuat terminal stuck atau error.

### Contoh

❌ **SALAH:**
```bash
echo "✅ Service updated!"
echo "Done!"
```

✅ **BENAR:**
```bash
echo "✅ Service updated"
echo "Done"
echo "Task completed."
```

### Solusi Alternatif

- Gunakan titik (.) di akhir kalimat
- Atau tanpa tanda baca sama sekali
- Hindari semua tanda seru dalam output terminal


## 📝 Dokumentasi Integrasi Pihak Ketiga

Jika ada code yang membutuhkan integrasi ke pihak ketiga dan memerlukan konfigurasi, **wajib membuat dokumentasi** yang mencakup:

### Informasi yang Harus Ada:

1. **Nama Service/Platform** yang diintegrasikan
2. **Konfigurasi yang Dibutuhkan** (API Key, Secret, Token, dll)
3. **Cara Mendapatkan Konfigurasi** dengan langkah-langkah detail:
   - URL pendaftaran/dashboard
   - Step-by-step untuk generate API key/credentials
   - Screenshot atau penjelasan visual jika diperlukan
4. **Environment Variables** yang perlu diset
5. **Contoh File .env** dengan placeholder
6. **Testing & Verification** cara memverifikasi konfigurasi sudah benar
7. **Validation** jalankan `node next-step.js` jika butuh konfirmasi konfigurasi sudah dilakukan.

### Format Dokumentasi:

Buat file `INTEGRATION.md` atau tambahkan section di `README.md` dengan struktur yang jelas dan mudah diikuti.