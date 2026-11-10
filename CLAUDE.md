@AGENTS.md

# Wraped: Spotify Wrapped versi sendiri

Next.js (App Router, `cacheComponents: true`) + Tailwind v4. Teks UI berbahasa Indonesia.

## Dua lapisan design, jangan dicampur

1. **NEXTEC (Warm Cream) = design utama app.** Halaman depan, halaman pilih design, kontrol di sekitar slide (Share, Design, Keluar), loading, dan error.
   Lokasinya: `src/app/**` dan `src/components/**`. Token-nya ada di `src/app/globals.css` (`pri: #fff5ef`, `sec: #030303`, `red: #fb2c36`, `card-*`, `font-display`, `font-body`, `font-mono`), dan font-nya di `src/app/layout.tsx`.
2. **Design wrapped = opsi yang dipilih user.** Ini hanya isi slide 9:16. Setiap design punya satu folder: `src/designs/<id>/`.
   Saat ini: 7 design (`neo`, `sketch`, `retro`, `playful`, `cyberpunk`, `luxury`, `nota`).

## Alur user

`/` (login) → Spotify OAuth → `/mulai` (pilih mode) → `/wrapped` (pilih design, ada preview) → `/wrapped/<id>` (slide memakai design itu).

## Struktur

```
src/
├── app/                      halaman + shell NEXTEC (design utama)
│   ├── page.tsx              halaman depan
│   ├── mulai/page.tsx        pilih mode (Cepat vs Lengkap)
│   ├── wrapped/page.tsx      pilih design (preview pakai PREVIEW_SAMPLE)
│   ├── wrapped/[design]/     validasi id → <WrappedViewer design={id} />
│   └── api/                  auth, data Spotify, proxy gambar
├── components/               komponen shell NEXTEC (Masthead, LoginError, ModePicker, HistoryUpload, WrappedViewer)
├── designs/
│   ├── types.ts              kontrak: SlideProps, Design
│   ├── index.ts              DESIGNS (daftar & urutan design)
│   ├── preview-sample.ts     data fiktif untuk preview
│   └── <id>/
│       ├── index.ts          export const <id>Design: Design
│       ├── Slides.tsx        export const SLIDES = [...]
│       ├── fonts.ts          export const fontClassName (next/font)
│       └── theme.css         token Tailwind berawalan <id>-
└── lib/                      Spotify API (server-only) + computeStats + history.ts + mode.ts, tidak terikat design
```

## Menambah design baru (contoh: `sketch`)

1. Buat `src/designs/sketch/` dengan `index.ts`, `Slides.tsx`, `fonts.ts`, `theme.css`. Salin pola dari `neo/`.
2. Daftarkan di `src/designs/index.ts`: `sketch: sketchDesign`. Urutan key menentukan nomor kartu.
3. Tambahkan `@import "../designs/sketch/theme.css";` di `src/app/globals.css`.
4. Selesai. Kartu pilih design (dengan preview) dan route `/wrapped/sketch` otomatis muncul.

## Aturan agar perubahan tidak melebar

- **Mengubah satu design = hanya menyentuh `src/designs/<id>/`.** Jangan ubah design lain, shell app, `lib/`, atau `types.ts` kecuali memang diminta.
- **Mengubah shell app (NEXTEC) = jangan menyentuh `src/designs/**`.**
- **Token dan font design wajib berawalan id-nya:** `bg-sketch-paper`, `font-sketch-display`, variabel next/font `--font-sketch-*-face`. Semua `theme.css` dimuat global, jadi nama tanpa awalan akan bentrok. Jangan pakai token shell (`pri`, `sec`, `red`, ...) di dalam slide.
- **Font design dimuat di `fonts.ts` milik design itu,** bukan di `layout.tsx`. Class-nya dipasang otomatis di pembungkus slide lewat `fontClassName`.
- **Slide hanya membaca `SlideProps`.** Jangan fetch data, jangan pakai hook state, dan **jangan panggil `new Date()`**: pakai `props.year`. Slide ikut di-prerender untuk preview, dan `new Date()` akan menggagalkan build.
- **Ukuran di slide pakai unit `cqw`** (pembungkusnya `@container`), supaya preview kecil dan export 1080px tampil identik.
- **Gambar Spotify wajib lewat `proxiedImageUrl()`** + `<img crossOrigin="anonymous">`, bukan `next/image`. Ini supaya export html-to-image tidak kena CORS.
- **Data atau statistik baru** ditambahkan di `src/lib/stats.ts` (`computeStats`) dan tersedia untuk semua design. Lengkapi juga `preview-sample.ts` kalau datanya perlu tampil di preview.
- **Penamaan:** komponen slide `XxxSlide`, helper deskriptif (`fitFontSize`, bukan `fit`), konstanta `UPPER_SNAKE`, props slide bernama `props` (bukan `p`).

## Batasan data Spotify

- Web API tidak menyediakan total menit dengar. `recentMinutes` hanya dihitung dari 50 lagu terakhir, dan label di slide wajib menyebut itu.
- App ini berjalan di Development Mode. Sejak 2026 ada field yang dihapus dan kuota dihitung per akun developer. Audio features (energy, mood) tidak tersedia.
- Jangan tampilkan angka yang tidak berasal dari data asli (tidak boleh ada estimasi).

## Total menit asli (opsional)

Implementasi fitur dari `docs/prompts/total-menit-asli.md`:

- User dapat upload file "Extended streaming history" Spotify (`.zip` atau `Streaming_History_Audio_*.json`). Fitur ini opsional.
- File dibaca **di browser saja** (`src/lib/history.ts`). Isi file tidak dikirim ke server atau di-log.
- Yang disimpan hanya objek `HistoryStats` di `localStorage` (`wrapped.history.v2`), bukan riwayat mentah. Saat upload berhasil, key lama `wrapped.history.v1` dihapus. Aturan kepemilikan (`ownerId`) memastikan data hanya tampil untuk akun Spotify pemiliknya.
- Sumber `stats` per mode di `WrappedViewer`:
  - Mode `"cepat"`: dihitung dari Spotify Web API via `computeStats(data)` (`source: "api"`).
  - Mode `"lengkap"` dengan file riwayat milik akun ini: dihitung penuh dari file via `statsFromHistory(historyStats)` (`source: "file"`), pilihan rentang waktu disembunyikan.
  - Mode `"lengkap"` belum ada file untuk akun ini: memakai `PREVIEW_SAMPLE.stats` (`source: "api"`) disertai banner contoh di shell NEXTEC.
- Properti `stats.source` (`"api" | "file"`) dipakai oleh ke-7 design untuk memilih label rentang (`"{year}"` saat `"file"`) dan label sampel (`"dari N putar sepanjang {year}"` saat `"file"`), serta menyembunyikan atau memberi fallback jujur untuk field yang tidak ada di file (`topGenres` kosong, `loyalTotal` 0, gambar `null`).
- Setiap design punya `totalMinutesSlide` di luar array `SLIDES`. `WrappedViewer` menyisipkannya di posisi ke-2 hanya kalau `stats.history` ada. Tanpa file (di mode cepat), Wrapped tetap 9 slide.
- M1 (Penyimpanan mode): `localStorage`, key `wrapped.mode.v1`, nilai `"cepat"` atau `"lengkap"`. Selalu dibaca dalam `try/catch`.
- M2 (Mode belum dipilih): Dianggap `"cepat"`. Tidak ada redirect paksa.
- M4 (Pindah ke Cepat): Ringkasan riwayat tidak dihapus, hanya diabaikan oleh viewer.
- M6 (Strip Lengkap): Satu baris ringkas di `/wrapped`, bukan blok besar. Panduan disembunyikan di `<details>` yang tertutup secara default.

## Cek sebelum selesai

```bash
npx tsc --noEmit && npm run lint && npm run build
```

Lalu buka di `npm run dev` → http://127.0.0.1:3000. Pakai `127.0.0.1`, bukan `localhost`, karena redirect URI Spotify memakai `127.0.0.1`.
Untuk perubahan tampilan, cek `/wrapped` (preview) di lebar desktop dan mobile (390px).
