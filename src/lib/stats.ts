import type { Track, WrappedData } from "./types";

export type Stats = ReturnType<typeof computeStats>;

export function computeStats(data: WrappedData) {
  const { topArtists, topTracks, recent, longTermTrackIds } = data;

  const albumCount = new Map<string, { album: Track["album"]; artist: string; count: number }>();
  for (const t of topTracks) {
    const entry = albumCount.get(t.album.id) ?? { album: t.album, artist: t.artists[0], count: 0 };
    entry.count++;
    albumCount.set(t.album.id, entry);
  }
  const topAlbum = [...albumCount.values()].sort((a, b) => b.count - a.count)[0] ?? null;

  const genreCount = new Map<string, number>();
  topArtists.forEach((a, i) => {
    for (const g of a.genres) genreCount.set(g, (genreCount.get(g) ?? 0) + (50 - i));
  });
  const topGenres = [...genreCount.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([g]) => g);

  // Jam lokal browser, dari 50 lagu terakhir (batas maksimum endpoint recently-played).
  const hours = new Array<number>(24).fill(0);
  for (const p of recent) hours[new Date(p.playedAt).getHours()]++;
  const peakHour = recent.length ? hours.indexOf(Math.max(...hours)) : null;
  const recentMinutes = Math.round(recent.reduce((s, p) => s + p.durationMs, 0) / 60000);

  const longTerm = new Set(longTermTrackIds.slice(0, 50));
  const top10 = topTracks.slice(0, 10);
  const loyalCount = top10.filter((t) => longTerm.has(t.id)).length;

  const uniqueArtistsInTop = new Set(topTracks.flatMap((t) => t.artists)).size;

  return {
    topArtists: topArtists.slice(0, 5),
    topTracks: topTracks.slice(0, 5),
    topAlbum,
    topGenres,
    hours,
    peakHour,
    recentCount: recent.length,
    recentMinutes,
    loyalCount,
    loyalTotal: top10.length,
    uniqueArtistsInTop,
    trackCount: topTracks.length,
  };
}

export function hourLabel(h: number) {
  return `${String(h).padStart(2, "0")}.00`;
}

export function listenerType(peakHour: number | null) {
  if (peakHour === null) return "Pendengar Misterius";
  if (peakHour < 5) return "Burung Hantu Begadang";
  if (peakHour < 11) return "Pendengar Pagi";
  if (peakHour < 15) return "Penikmat Siang";
  if (peakHour < 19) return "Teman Sore";
  return "Pendengar Malam";
}

export const RANGE_LABEL = {
  short_term: "4 minggu terakhir",
  medium_term: "6 bulan terakhir",
  long_term: "setahun terakhir",
} as const;

export const img = (url: string | null) => (url ? `/api/image?u=${encodeURIComponent(url)}` : null);
