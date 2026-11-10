import { NextResponse, type NextRequest } from "next/server";
import { getAccessToken, spotifyGet, SpotifyError } from "@/lib/spotify";
import type { Artist, Play, TimeRange, Track, WrappedData } from "@/lib/types";

type SpImage = { url: string; width: number | null };
type SpArtist = { id: string; name: string; images?: SpImage[]; genres?: string[] };
type SpTrack = {
  id: string;
  name: string;
  duration_ms: number;
  artists: { name: string }[];
  album: { id: string; name: string; images?: SpImage[] };
};
type Paging<T> = { items: T[] };

const RANGES: TimeRange[] = ["short_term", "medium_term", "long_term"];

// Ambil gambar terbesar; field genres sudah tidak dijamin ada sejak perubahan API Februari 2026.
const bestImage = (images?: SpImage[]) => images?.[0]?.url ?? null;

const toTrack = (t: SpTrack): Track => ({
  id: t.id,
  name: t.name,
  artists: t.artists.map((a) => a.name),
  album: { id: t.album.id, name: t.album.name, image: bestImage(t.album.images) },
  durationMs: t.duration_ms,
});

// Kuota dev mode dihitung per akun developer, jadi ganti-ganti range tidak boleh selalu memanggil Spotify.
// shortcut: cache per proses server, pindah ke KV kalau jalan multi-instance.
const CACHE_TTL_MS = 5 * 60_000;
const responseCache = new Map<string, { expiresAt: number; data: WrappedData }>();

export async function GET(request: NextRequest) {
  const param = request.nextUrl.searchParams.get("range") as TimeRange | null;
  const range: TimeRange = param && RANGES.includes(param) ? param : "medium_term";

  try {
    const token = await getAccessToken();
    if (!token) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

    const cacheKey = `${token}:${range}`;
    const cached = responseCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return NextResponse.json(cached.data, { headers: { "Cache-Control": "private, no-store" } });
    }

    const [me, artists, tracks, longTerm, recent] = await Promise.all([
      spotifyGet<{ display_name: string | null; id: string; images?: SpImage[] }>("/me", token),
      spotifyGet<Paging<SpArtist>>(`/me/top/artists?limit=50&time_range=${range}`, token),
      spotifyGet<Paging<SpTrack>>(`/me/top/tracks?limit=50&time_range=${range}`, token),
      range === "long_term"
        ? Promise.resolve(null)
        : spotifyGet<Paging<SpTrack>>("/me/top/tracks?limit=50&time_range=long_term", token),
      spotifyGet<Paging<{ played_at: string; track: SpTrack }>>("/me/player/recently-played?limit=50", token),
    ]);

    const topTracks = tracks.items.map(toTrack);
    const data: WrappedData = {
      user: { id: me.id, name: me.display_name || me.id, image: bestImage(me.images) },
      range,
      topArtists: artists.items.map(
        (a): Artist => ({ id: a.id, name: a.name, image: bestImage(a.images), genres: a.genres ?? [] }),
      ),
      topTracks,
      longTermTrackIds: (longTerm?.items.map(toTrack) ?? topTracks).map((t) => t.id),
      recent: recent.items.map(
        (p): Play => ({ trackId: p.track.id, playedAt: p.played_at, durationMs: p.track.duration_ms }),
      ),
    };
    const now = Date.now();
    for (const [key, entry] of responseCache) if (entry.expiresAt <= now) responseCache.delete(key);
    responseCache.set(cacheKey, { expiresAt: now + CACHE_TTL_MS, data });
    return NextResponse.json(data, { headers: { "Cache-Control": "private, no-store" } });
  } catch (e) {
    // Detail error hanya di log server. Selalu balas JSON (bukan throw), supaya cookie hasil refresh tetap terkirim.
    console.error(e);
    if (e instanceof SpotifyError) {
      // 403 di Development Mode biasanya berarti akun belum ada di allowlist (User Management).
      const error = e.status === 403 ? "not_allowlisted" : e.status === 429 ? "rate_limited" : "spotify_error";
      const headers = e.status === 429 && e.retryAfter ? { "Retry-After": e.retryAfter } : undefined;
      return NextResponse.json({ error }, { status: e.status, headers });
    }
    return NextResponse.json({ error: "spotify_error" }, { status: 502 });
  }
}
