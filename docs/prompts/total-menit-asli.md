# Prompt: fitur "Total menit asli" (opsional, dari file riwayat Spotify)

Salin seluruh isi file ini ke sesi Claude Code baru di repo ini.

---

## Peran dan aturan dasar

Kamu mengerjakan fitur di repo `spotify-wrapped`. Baca `CLAUDE.md` dan `AGENTS.md` dulu, lalu ikuti semuanya. Next.js di repo ini versi 16.4.5. Baca panduan yang relevan di `node_modules/next/dist/docs/` sebelum menulis kode yang memakai API Next.js.

Aturan ketat:

1. Kerjakan **hanya** yang ada di prompt ini. Jangan menambah fitur, opsi, atau refactor lain.
2. Kerjakan langkah **berurutan**. Jangan lanjut ke langkah berikutnya sebelum "Cek selesai" di langkah itu lolos.
3. Jangan pernah mengarang angka. Kalau data tidak ada, tampilkan apa adanya atau sembunyikan.
4. File riwayat user **tidak boleh dikirim ke server**. Tidak ada `fetch`, tidak ada API route baru, dan tidak ada log isi file.
5. Teks UI berbahasa Indonesia. Tanpa em dash (`—`).
6. Kalau ada yang ambigu atau bertentangan dengan kode yang ada, berhenti dan tanya. Jangan menebak.

## Tujuan

User bisa upload file "Extended streaming history" dari Spotify (opsional). App menghitung total menit dengar asli untuk tahun berjalan, lalu menampilkannya di satu slide baru di semua design. User yang tidak upload tetap mendapat Wrapped seperti sekarang, tanpa perubahan apa pun.

## Keputusan yang sudah final

| # | Keputusan | Nilai |
|---|---|---|
| K1 | Tempat di slide | Slide baru `TotalMinutesSlide`, disisipkan **setelah `IntroSlide`** (posisi ke-2) |
| K2 | Format file | `.zip` dari Spotify **dan** `.json` hasil ekstrak. Untuk zip pakai `fflate` (satu-satunya dependency baru yang diizinkan) |
| K3 | Penyimpanan | Hanya ringkasan (`HistorySummary`) di `localStorage`, key `wrapped.history.v1`. Riwayat mentah tidak disimpan |
| K4 | Tanpa file | Slide tidak muncul. `total` dan nomor slide mengikuti jumlah slide yang tampil |

## Format file Spotify (asumsi, wajib dicek di langkah 1)

File bernama `Streaming_History_Audio_*.json`, isinya array objek. Field yang dipakai:

| Field | Tipe | Arti |
|---|---|---|
| `ts` | string ISO UTC, contoh `"2026-08-14T21:03:11Z"` | Waktu lagu selesai diputar |
| `ms_played` | number | Lama diputar (ms) |
| `master_metadata_track_name` | string atau `null` | Judul lagu. `null` berarti bukan lagu (podcast atau lainnya) |
| `master_metadata_album_artist_name` | string atau `null` | Nama artis |
| `spotify_track_uri` | string atau `null` | ID lagu |

Di dalam zip, abaikan file selain `Streaming_History_Audio_*.json` (misalnya `Streaming_History_Video_*.json` dan PDF).

## Tipe data

Tambahkan di `src/lib/types.ts`:

```ts
export type HistorySummary = {
  year: number;
  totalMinutes: number;
  playCount: number;
  topTrack: { name: string; artist: string; plays: number } | null;
  busiestDay: { date: string; minutes: number } | null; // date: "YYYY-MM-DD", zona waktu lokal browser
  lastDate: string; // "YYYY-MM-DD", tanggal ts paling akhir di tahun itu
};
```

Aturan hitung (hanya baris dengan `master_metadata_track_name` tidak `null` **dan** tahun lokal dari `ts` sama dengan `year`):

- `totalMinutes` = `Math.round(sum(ms_played) / 60000)`.
- `playCount` = jumlah baris dengan `ms_played >= 30000`. Batas 30 detik adalah definisi "stream" versi Spotify.
- `topTrack` = lagu dengan `playCount` terbanyak. Kunci pengelompokannya `spotify_track_uri`, atau `nama + artis` kalau URI `null`. Kalau seri, pilih yang lebih dulu tercapai.
- `busiestDay` = tanggal lokal dengan menit terbanyak.
- Kalau tidak ada baris yang lolos filter, hasilnya **error** "File tidak berisi data lagu tahun {year}", bukan summary kosong.

## Langkah

| # | Langkah | File | Cek selesai |
|---|---|---|---|
| 1 | Minta user mengirim 2-3 baris contoh dari file aslinya. Cocokkan dengan tabel "Format file". Kalau berbeda, berhenti dan laporkan | (tidak ada) | User konfirmasi field cocok |
| 2 | Tambah `HistorySummary` | `src/lib/types.ts` | `npx tsc --noEmit` lolos |
| 3 | Buat `summarizeHistory(rows: unknown[], year: number): HistorySummary` dan `readHistoryFile(file: File, year: number): Promise<HistorySummary>`. File ini hanya boleh memakai `import type` dan `fflate`, tanpa alias `@/`, supaya bisa dites dengan Node. Validasi setiap baris: baris yang bentuknya salah dilewati, dan kalau tidak ada baris valid sama sekali, lempar error yang jelas | `src/lib/history.ts` | `npx tsc --noEmit` lolos |
| 4 | Tes `summarizeHistory` dengan `node:test` + `node:assert`. Minimal 5 kasus: data normal, podcast dibuang, tahun lain dibuang, tidak ada data tahun ini (error), dan baris rusak dilewati | `src/lib/history.test.ts` | `node --test src/lib/history.test.ts` lolos (Node 26, type stripping bawaan) |
| 5 | Ubah `computeStats(data, history?: HistorySummary \| null)`. Hasilnya menambah `history: HistorySummary \| null`. Field lain tidak berubah | `src/lib/stats.ts` | Semua pemanggil lama tetap jalan tanpa argumen kedua |
| 6 | Tambah `totalMinutesSlide: ComponentType<SlideProps>` ke tipe `Design` | `src/designs/types.ts` | `tsc` gagal di 7 design (memang diharapkan, lanjut ke langkah 7) |
| 7 | Buat `TotalMinutesSlide` di **setiap** design. Ikuti gaya, token, dan font design itu. Gunakan `SlideFrame` milik design tersebut dan unit `cqw`. Isi: angka `totalMinutes` (format `toLocaleString("id-ID")`), lalu `topTrack` dan `busiestDay` kalau ada, lalu catatan kecil "data sampai {lastDate}". Kalau `props.stats.history` `null`, render `EmptySlide`. Export lewat `index.ts` design sebagai `totalMinutesSlide`. **Jangan** masukkan ke array `SLIDES` | `src/designs/<id>/Slides.tsx`, `src/designs/<id>/index.ts` (7 design) | `tsc` lolos |
| 8 | Tambah contoh `history` fiktif di preview, dan kirim ke `computeStats` | `src/designs/preview-sample.ts` | Build lolos |
| 9 | Komponen upload. Isinya: judul "Total menit asli (opsional)", tombol yang membuka/menutup panduan 5 langkah (tabel panduan di bawah), `<input type="file" accept=".zip,.json">` dengan `<label>` yang terlihat, status membaca/berhasil/gagal, dan tombol "Hapus data". Simpan dan baca `localStorage` di dalam `try/catch`. Pakai token NEXTEC saja. `year` = `new Date().getFullYear()` (boleh di shell, tidak boleh di slide) | `src/components/HistoryUpload.tsx` | Upload, refresh, status masih "berhasil". Hapus, status kosong |
| 10 | Pasang `<HistoryUpload />` di halaman pilih design, di antara section judul dan daftar design | `src/app/wrapped/page.tsx` | Tampil di desktop dan 390px tanpa overflow |
| 11 | Viewer membaca `localStorage` (`try/catch`), lalu memakai summary hanya kalau `summary.year` sama dengan tahun yang dikirim ke slide. Kirim ke `computeStats`. Susun daftar slide: kalau `stats.history` ada, `[slides[0], totalMinutesSlide, ...slides.slice(1)]`, kalau tidak ada, `slides`. Pakai daftar itu untuk navigasi, `n`, `total`, dan export | `src/components/WrappedViewer.tsx` | Tanpa data: 9 slide, sama seperti sebelumnya. Dengan data: 10 slide, slide ke-2 total menit |
| 12 | Verifikasi akhir | (semua) | Lihat bagian "Verifikasi" |

## Panduan untuk user (teks di komponen upload)

Cek ulang nama menu di halaman Spotify yang asli sebelum dipakai. Kalau berbeda, ikuti halaman asli.

1. Buka spotify.com, login, lalu buka **Account** dan pilih **Privacy settings**.
2. Di bagian download data, centang **Extended streaming history**, lalu klik **Request data**.
3. Buka email dari Spotify dan klik link konfirmasi.
4. Tunggu email "data siap". Biasanya beberapa hari, paling lama 30 hari.
5. Download file `.zip`, lalu upload di sini. File dibaca di browser kamu dan tidak dikirim ke server.

## Batasan yang tidak boleh dilanggar

| Batasan | Sumber |
|---|---|
| Slide hanya membaca `SlideProps`, tanpa hook, tanpa `new Date()` | `CLAUDE.md` |
| Token dan font design berawalan id design | `CLAUDE.md` |
| Shell (`src/components`, `src/app`) memakai token NEXTEC, bukan token design | `CLAUDE.md` |
| Tidak ada request jaringan dengan isi file | Prompt ini, aturan 4 |
| Dependency baru hanya `fflate` | K2 |
| Kontrol bisa dipakai dengan keyboard, fokus terlihat, input punya label, dan `cursor: pointer` | antislop R-32, R-39 |
| Ada status kosong, membaca, berhasil, dan gagal | antislop R-27 |

## Verifikasi

Jalankan dan laporkan hasilnya satu per satu:

```bash
node --test src/lib/history.test.ts
```

```bash
npx tsc --noEmit && npm run lint && npm run build
```

Lalu `npm run dev`, buka http://127.0.0.1:3000/wrapped, dan cek:

| Kasus | Hasil yang diharapkan |
|---|---|
| Tanpa upload | 9 slide di setiap design, tidak ada yang berubah |
| Upload `.json` valid | Status berhasil, tampil angka menit. Viewer 10 slide, slide ke-2 total menit |
| Upload `.zip` valid | Sama dengan `.json` |
| Upload file lain (gambar, JSON acak) | Pesan gagal yang jelas, tanpa crash |
| File tanpa data tahun ini | Pesan "File tidak berisi data lagu tahun {year}" |
| Refresh setelah upload | Data masih ada |
| Hapus data | Kembali ke 9 slide |
| Network tab saat upload | Tidak ada request yang membawa isi file |
| Lebar 390px | Komponen upload tidak overflow |
| Keyboard saja | Semua kontrol bisa dijangkau dengan Tab dan dipakai dengan Enter/Space |
| Export PNG slide total menit | Hasil 1080px sama dengan tampilan |

## Setelah selesai

1. Di `CLAUDE.md`, ubah judul bagian "Rencana: total menit asli (belum dibangun)" menjadi "Total menit asli (opsional)", lalu sesuaikan isinya dengan kode yang benar-benar dibuat.
2. Laporkan dalam tabel: langkah, file yang diubah, dan hasil cek. Sebutkan juga yang tidak sempat dicek.
3. Jangan commit kecuali user meminta.
