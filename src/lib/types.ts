export type TimeRange = "short_term" | "medium_term" | "long_term";

export type Artist = { id: string; name: string; image: string | null; genres: string[] };
export type Track = {
  id: string;
  name: string;
  artists: string[];
  album: { id: string; name: string; image: string | null };
  durationMs: number;
};
export type Play = { trackId: string; playedAt: string; durationMs: number };

export type WrappedData = {
  user: { id: string; name: string; image: string | null };
  range: TimeRange;
  topArtists: Artist[];
  topTracks: Track[];
  longTermTrackIds: string[];
  recent: Play[];
};

export type HistorySummary = {
  year: number;
  totalMinutes: number;
  playCount: number;
  topTrack: { name: string; artist: string; plays: number } | null;
  busiestDay: { date: string; minutes: number } | null; // date: "YYYY-MM-DD", zona waktu lokal browser
  lastDate: string; // "YYYY-MM-DD", tanggal ts paling akhir di tahun itu
  ownerId?: string; // id Spotify pemilik; diisi viewer saat pertama kali dipakai
};

export type HistoryStats = {
  year: number;
  ownerId?: string;
  topArtists: Artist[];
  topTracks: Track[];
  topAlbum: { album: Track["album"]; artist: string; count: number } | null;
  topGenres: string[];
  hours: number[];
  peakHour: number | null;
  recentCount: number;
  recentMinutes: number;
  loyalCount: number;
  loyalTotal: number;
  uniqueArtistsInTop: number;
  trackCount: number;
  history: HistorySummary;
};
