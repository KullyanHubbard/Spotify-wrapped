@AGENTS.md

# Wraped: Spotify Wrapped versi sendiri

Next.js (App Router, `cacheComponents: true`) + Tailwind v4. Teks UI berbahasa Indonesia.

## Dua lapisan design, jangan dicampur

1. **NEXTEC (Warm Cream) = design utama app.** Halaman depan, halaman pilih design, kontrol di sekitar slide (Share, Design, Keluar), loading, dan error.
   Lokasinya: `src/app/**` dan `src/components/**`. Token-nya ada di `src/app/globals.css` (`pri: #fff5ef`, `sec: #030303`, `red: #fb2c36`, `card-*`, `font-display`, `font-body`, `font-mono`), dan font-nya di `src/app/layout.tsx`.
2. **Design wrapped = opsi yang dipilih user.** Ini hanya isi slide 9:16. Setiap design punya satu folder: `src/designs/<id>/`.
   Saat ini: 7 design (`neo`, `sketch`, `retro`, `playful`, `cyberpunk`, `luxury`, `nota`).

## Alur user

`/` (login) → Spotify OAuth → `/wrapped` (pilih design, ada preview) → `/wrapped/<id>` (slide memakai design itu).

## Struktur

```
src/
├── app/                      halaman + shell NEXTEC (design utama)
│   ├── page.tsx              halaman depan
│   ├── wrapped/page.tsx      pilih design (preview pakai PREVIEW_SAMPLE)
│   ├── wrapped/[design]/     validasi id → <WrappedViewer design={id} />
│   └── api/                  auth, data Spotify, proxy gambar
├── components/               komponen shell NEXTEC (Masthead, LoginError, WrappedViewer)
├── designs/
│   ├── types.ts              kontrak: SlideProps, Design
│   ├── index.ts              DESIGNS (daftar & urutan design)
│   ├── preview-sample.ts     data fiktif untuk preview
│   └── <id>/
│       ├── index.ts          export const <id>Design: Design
│       ├── Slides.tsx        export const SLIDES = [...]
│       ├── fonts.ts          export const fontClassName (next/font)
│       └── theme.css         token Tailwind berawalan <id>-
└── lib/                      Spotify API (server-only) + computeStats, tidak terikat design
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

## Cek sebelum selesai

```bash
npx tsc --noEmit && npm run lint && npm run build
```

Lalu buka di `npm run dev` → http://127.0.0.1:3000. Pakai `127.0.0.1`, bukan `localhost`, karena redirect URI Spotify memakai `127.0.0.1`.
Untuk perubahan tampilan, cek `/wrapped` (preview) di lebar desktop dan mobile (390px).
