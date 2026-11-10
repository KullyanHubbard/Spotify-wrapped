# Prompt: Transformasi Platform ke KILASARA STUDIO (Snap Studio + Wrapped Studio + Katalog Template)

Salin seluruh isi file ini ke sesi AI coding di repo ini.

---

## Peran dan aturan dasar

Kamu mengerjakan pengembangan platform **KILASARA STUDIO** di repo ini. Baca `CLAUDE.md` dan `AGENTS.md` terlebih dahulu, lalu patuhi seluruh aturannya. Next.js di repo ini versi 16.4.5 (`cacheComponents: true`, `partialPrefetching: true`). Baca panduan yang relevan di `node_modules/next/dist/docs/` sebelum menulis kode yang memakai API Next.js.

Aturan ketat:

1. **Identitas Startup**: Nama resmi platform adalah **KILASARA STUDIO** (gabungan *Kilas* = cahaya kamera & kilas balik memori, dan *Aksara* = teks, lirik lagu, dan data cerita).
2. **Jangan sentuh `src/designs/**`**: Ke-7 design wrapped (`neo`, `sketch`, `retro`, `playful`, `cyberpunk`, `luxury`, `nota`) di `src/designs/**` tidak boleh diubah agar fitur Spotify Wrapped yang sudah ada tetap utuh 100%.
3. **Gunakan desain shell NEXTEC (Warm Cream)** untuk seluruh halaman aplikasi (`bg-pri`, `text-sec`, `text-red`, `nextec-hard-button`, `nextec-hard-card`, `nextec-hard-card-hero`).
4. **Privasi Client-Side 100%**: Semua pengambilan foto kamera, upload foto galeri, maupun pembacaan file riwayat dilakukan sepenuhnya di browser pengguna tanpa dikirim ke server.
5. **Teks UI berbahasa Indonesia** dan tanpa karakter em dash.
6. **Aturan Next.js 16 (`cacheComponents: true`)**: Jangan memanggil `new Date()` saat render Server Component atau di luar `useEffect` client, dan bungkus komponen yang memakai `useSearchParams()` dengan `<Suspense>`.

## Arsitektur 3 Pilar KILASARA STUDIO

| Pilar | Nama Produk | Route Utama | Fungsi |
|---|---|---|---|
| Pilar 1 | **Kilasara Snap** | `/photo` | Online Photo Studio: Foto langsung via Webcam/Kamera HP (timer, mirror, burst) DAN upload foto dari galeri ke dalam puluhan template frame siap unduh (`.png` 1080x1920). |
| Pilar 2 | **Kilasara Wrapped** | `/mulai`, `/wrapped`, `/wrapped/[design]` | Data Storytelling Studio: Mengubah data Spotify (OAuth API atau file `.zip`/`.json` riwayat) menjadi slide visual 9:16. |
| Pilar 3 | **Kilasara Galeri** | `/templates` | Katalog Template: Etalase seluruh template Photo Studio dan Wrapped Studio dengan filter kategori dan pratinjau langsung. |

## Langkah Eksekusi

### Langkah 1: Mesin Config-Driven Photo Templates (`src/lib/photo-templates.ts`)
- Buat tipe `PhotoLayoutType` yang mendukung 6 layout dasar:
  - `strip-4` (Photobooth vertikal 4 foto)
  - `strip-3` (Photobooth vertikal 3 foto)
  - `grid-2x2` (Grid 4 foto 2x2)
  - `polaroid-1` (Frame potret tunggal / sampul majalah)
  - `duo-2` (Frame vertikal 2 foto)
  - `receipt-photo` (Struk kasir dengan 2 foto + rincian item memori + barcode)
- Buat 7 kategori gaya yang selaras dengan ekosistem Kilasara:
  - `neo` (Neo-Brutalist)
  - `nota` (Struk & Tiket)
  - `retro` (Retro & Surat Kabar)
  - `editorial` (Luxury & Majalah)
  - `cyberpunk` (Cyber & Neon)
  - `playful` (Playful & Y2K)
  - `sketch` (Sketch & Buku Harian)
- Sediakan minimal **24 preset template** (`PHOTO_TEMPLATES`) dan **6 preset filter foto** (`PHOTO_FILTERS`: Normal, Hitam Putih Kontras, Film Hangat 90an, Photobox Cerah, Neon Dingin, Noir Drama).

### Langkah 2: Komponen Renderer Frame 9:16 (`src/components/PhotoFramePreview.tsx`)
- Buat komponen kanvas frame berasio `9:16` dengan `@container` dan unit `cqw` agar tampilan pratinjau kecil di katalog dan hasil ekspor 1080px identik.
- Dukung mode pratinjau (menampilkan ilustrasi placeholder slot saat belum ada foto) dan mode interaktif studio (klik slot untuk memilih slot aktif, menampilkan foto user dengan filter CSS, judul, subjudul, tanggal, serta watermark `KILASARA STUDIO`).

### Langkah 3: Halaman & Studio Kilasara Snap (`src/components/PhotoBoothStudio.tsx` & `src/app/photo/page.tsx`)
- Dukung **2 Mode Sumber Foto** yang bisa diganti kapan saja tanpa kehilangan foto yang sudah ada di slot:
  1. **Kamera Langsung (Webcam / HP)**:
     - Akses `navigator.mediaDevices.getUserMedia` (mendukung pindah kamera depan/belakang).
     - Pilihan Timer Countdown (`Langsung`, `3 Detik`, `5 Detik`).
     - Mode Jepret: `Otomatis Semua Slot (Burst)` atau `Jepret Slot Aktif` (untuk retake satu slot tertentu).
     - Tombol Mirror (balik horizontal).
  2. **Upload Foto Galeri**:
     - Upload banyak foto sekaligus (`multiple`) untuk mengisi slot otomatis, atau ganti foto pada slot yang sedang dipilih.
     - Fitur tukar posisi foto antar-slot, hapus satu slot, bersihkan semua, dan tombol **"Isi Foto Contoh"** untuk mencoba template secara instan.
- Panel Editor Studio:
  - Pilih template dari 24+ koleksi berdasarkan kategori tanpa menghapus foto.
  - Pilih filter warna foto.
  - Ubah teks **Judul Frame**, **Catatan / Lokasi**, dan **Label Tanggal**.
- Tombol **Download PNG (1080x1920)** dan **Share ke Story** menggunakan `html-to-image` (`toBlob` dua pass).

### Langkah 4: Halaman Katalog Template (`src/components/TemplateCatalog.tsx` & `src/app/templates/page.tsx`)
- Tampilkan seluruh koleksi template dari **Kilasara Snap (24+ template foto)** dan **Kilasara Wrapped (7 tema musik)**.
- Sediakan filter berdasarkan Pilar (`Semua Studio`, `Kilasara Snap`, `Kilasara Wrapped`) dan filter berdasarkan Kategori Gaya.
- Setiap kartu memiliki pratinjau visual `9:16` dan tombol langsung:
  - **"Pakai Frame Foto →"** menuju `/photo?template=<id>`
  - **"Pakai Tema Wrapped →"** menuju `/wrapped/<design>`

### Langkah 5: Rebranding Shell & Navigasi ke KILASARA STUDIO (`src/components/Masthead.tsx`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/mulai/page.tsx`, `src/app/wrapped/page.tsx`, `next.config.ts`)
- Perbarui `Masthead.tsx` dengan brand **KILASARA.** dan navigasi utama: **Beranda (`/`)**, **Snap Studio (`/photo`)**, **Wrapped Studio (`/mulai`)**, dan **Katalog Template (`/templates`)**.
- Perbarui `src/app/page.tsx` menjadi halaman utama **KILASARA STUDIO** yang memperkenalkan 3 pilar produk, pratinjau unggulan, keunggulan privasi 100% di browser, serta tombol cepat ke **Snap Studio**, **Masuk dengan Spotify**, dan **Katalog Template**.
- Pastikan CSP di `next.config.ts` mengizinkan `media-src 'self' blob: mediastream:` untuk pratinjau kamera.

## Verifikasi

Jalankan perintah berikut dan pastikan semuanya lolos tanpa error:

```bash
node --test src/lib/history.test.ts
npx tsc --noEmit && npm run lint && npm run build
```
