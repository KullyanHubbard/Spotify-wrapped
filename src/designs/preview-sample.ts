import { computeStats } from "@/lib/stats";
import type { Artist, Play, Track } from "@/lib/types";

// Data contoh (fiktif) untuk preview slide di halaman pilih design.
const artistNames = ["Senja Kolektif", "Nadia Ray", "Ombak Biru", "Kota Hujan", "Lintang"];
const artists: Artist[] = artistNames.map((name, i) => ({ id: `a${i}`, name, image: null, genres: [] }));

const trackNames = ["Lampu Kota", "Pulang Pelan", "Hujan Bulan Juni", "Tepi Laut", "Sampai Jumpa"];
const tracks: Track[] = trackNames.map((name, i) => ({
  id: `t${i}`,
  name,
  artists: [artistNames[i % 3]],
  album: { id: `al${i % 2}`, name: i % 2 ? "Malam Panjang" : "Arah Pulang", image: null },
  durationMs: 210_000,
}));

// Jam putar contoh, condong ke malam.
const recent: Play[] = [21, 22, 22, 23, 23, 23, 20, 19, 9, 13, 0, 1].map((h, i) => ({
  trackId: `t${i % 5}`,
  playedAt: `2026-01-0${(i % 9) + 1}T${String(h).padStart(2, "0")}:00:00`,
  durationMs: 210_000,
}));

export const PREVIEW_SAMPLE = {
  name: "Kamu",
  range: "medium_term" as const,
  year: 2026,
  stats: computeStats({
    user: { name: "Kamu", image: null },
    range: "medium_term",
    topArtists: artists,
    topTracks: tracks,
    longTermTrackIds: ["t0", "t2"],
    recent,
  }),
};
