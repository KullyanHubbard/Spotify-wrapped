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
  user: { name: string; image: string | null };
  range: TimeRange;
  topArtists: Artist[];
  topTracks: Track[];
  longTermTrackIds: string[];
  recent: Play[];
};
