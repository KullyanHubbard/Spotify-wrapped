# Wraped

Web app ala Spotify Wrapped. Login pakai Spotify (Authorization Code + PKCE), tampilkan top artis, top lagu, album favorit, jam dengar, lalu export tiap slide jadi PNG 1080x1920 untuk Instagram Story.

## Setup Spotify Client ID

1. Buka https://developer.spotify.com/dashboard, login, klik **Create app**.
2. Isi nama dan deskripsi bebas. **Redirect URI**: `http://127.0.0.1:3000/api/auth/callback` (Spotify menolak `localhost`, wajib `127.0.0.1`). Centang **Web API**.
3. Simpan, buka **Settings**, copy **Client ID**. Client secret tidak dipakai (PKCE).
4. `cp .env.example .env.local`, isi `SPOTIFY_CLIENT_ID`.
5. `npm install && npm run dev`, buka **http://127.0.0.1:3000** (bukan localhost).

Saat deploy (mis. Vercel), tambahkan redirect URI HTTPS produksi di Dashboard, mis. `https://domainmu.vercel.app/api/auth/callback`, dan set `SPOTIFY_REDIRECT_URI` yang sama di env produksi.

## Batasan Development Mode (dicek November 2026)

- Pemilik app wajib Spotify **Premium**.
- Maksimal **5 user**, dan tiap user harus ditambahkan manual di Dashboard > Settings > **User Management** (nama + email Spotify). User di luar daftar dapat 403, app menampilkan pesan khusus untuk ini.
- Extended Quota hanya untuk organisasi (badan usaha, minimal 250rb MAU), jadi untuk app personal praktis mentok di 5 user.
- Sejak perubahan API Februari 2026: field `popularity`, `followers` artis dan `popularity` track dihapus, `genres` ditandai deprecated (sering kosong), dan endpoint batch `GET /artists?ids=` dihapus. App ini tidak bergantung pada field-field itu; genre hanya muncul kalau Spotify masih mengirimnya.

Sumber: [Quota modes](https://developer.spotify.com/documentation/web-api/concepts/quota-modes), [Redirect URIs](https://developer.spotify.com/documentation/web-api/concepts/redirect_uri), [Changelog Feb 2026](https://developer.spotify.com/documentation/web-api/references/changes/february-2026), [Get User's Top Items](https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks).

## Struktur

- `src/app/api/auth/*` login, callback (tukar code + verifier), logout. Token disimpan di cookie httpOnly, refresh otomatis di `src/lib/spotify.ts`.
- `src/app/api/wrapped` ambil `/me`, top artists/tracks (50), recently played (50).
- `src/app/api/image` proxy gambar `i.scdn.co` supaya export canvas tidak kena CORS.
- `src/components/Slides.tsx` desain slide 9:16 (pakai container query unit `cqw`, jadi skala ikut lebar).
- `src/components/WrappedViewer.tsx` navigasi ala story + export via `html-to-image`. Di HP, tombol Share memakai Web Share API sehingga gambar bisa langsung dikirim ke Instagram; di desktop jatuh ke download.

## Scope OAuth

`user-top-read`, `user-read-recently-played`.
