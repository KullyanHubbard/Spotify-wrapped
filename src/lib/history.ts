import type { Artist, HistoryStats, HistorySummary, Track } from "./types";
import { unzipSync, strFromU8 } from "fflate";

interface RawHistoryRow {
  ts?: unknown;
  ms_played?: unknown;
  master_metadata_track_name?: unknown;
  master_metadata_album_artist_name?: unknown;
  master_metadata_album_album_name?: unknown;
  spotify_track_uri?: unknown;
}

function toLocalDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function isValidRow(row: unknown): row is RawHistoryRow {
  if (!row || typeof row !== "object") return false;
  const r = row as RawHistoryRow;
  if (typeof r.ts !== "string") return false;
  if (typeof r.ms_played !== "number" || !Number.isFinite(r.ms_played) || r.ms_played < 0) return false;
  const d = new Date(r.ts);
  if (Number.isNaN(d.getTime())) return false;
  return true;
}

const isRecord = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object";
const isNum = (v: unknown) => typeof v === "number" && Number.isFinite(v);

function isValidHistorySummaryObj(s: unknown): s is HistorySummary {
  if (!isRecord(s)) return false;
  const { topTrack: t, busiestDay: b } = s;
  const topOk = t === null || (isRecord(t) && typeof t.name === "string" && typeof t.artist === "string" && isNum(t.plays));
  const dayOk = b === null || (isRecord(b) && typeof b.date === "string" && isNum(b.minutes));
  const ownerOk = s.ownerId === undefined || typeof s.ownerId === "string";
  return isNum(s.year) && isNum(s.totalMinutes) && isNum(s.playCount) && typeof s.lastDate === "string" && topOk && dayOk && ownerOk;
}

function isValidAlbumObj(v: unknown): v is Track["album"] {
  return isRecord(v) && typeof v.id === "string" && typeof v.name === "string" && (v.image === null || typeof v.image === "string");
}

function isValidArtistObj(v: unknown): v is Artist {
  return (
    isRecord(v) &&
    typeof v.id === "string" &&
    typeof v.name === "string" &&
    (v.image === null || typeof v.image === "string") &&
    Array.isArray(v.genres) &&
    v.genres.every((g) => typeof g === "string")
  );
}

function isValidTrackObj(v: unknown): v is Track {
  return (
    isRecord(v) &&
    typeof v.id === "string" &&
    typeof v.name === "string" &&
    Array.isArray(v.artists) &&
    v.artists.every((a) => typeof a === "string") &&
    isValidAlbumObj(v.album) &&
    isNum(v.durationMs)
  );
}

/** Validasi ringkasan dari localStorage (bisa versi lama atau diedit manual); null kalau bentuknya salah. */
export function parseHistorySummary(raw: string | null): HistorySummary | null {
  if (!raw) return null;
  try {
    const s: unknown = JSON.parse(raw);
    return isValidHistorySummaryObj(s) ? s : null;
  } catch {
    return null;
  }
}

/** Validasi HistoryStats (v2) dari localStorage; null kalau bentuknya salah. */
export function parseHistoryStats(raw: string | null): HistoryStats | null {
  if (!raw) return null;
  try {
    const s: unknown = JSON.parse(raw);
    if (!isRecord(s)) return null;
    const ownerOk = s.ownerId === undefined || typeof s.ownerId === "string";
    const artistsOk = Array.isArray(s.topArtists) && s.topArtists.every(isValidArtistObj);
    const tracksOk = Array.isArray(s.topTracks) && s.topTracks.every(isValidTrackObj);
    const albumOk =
      s.topAlbum === null ||
      (isRecord(s.topAlbum) &&
        isValidAlbumObj(s.topAlbum.album) &&
        typeof s.topAlbum.artist === "string" &&
        isNum(s.topAlbum.count));
    const genresOk = Array.isArray(s.topGenres) && s.topGenres.every((g) => typeof g === "string");
    const hoursOk = Array.isArray(s.hours) && s.hours.length === 24 && s.hours.every(isNum);
    const peakOk = s.peakHour === null || isNum(s.peakHour);
    if (
      !isNum(s.year) ||
      !ownerOk ||
      !artistsOk ||
      !tracksOk ||
      !albumOk ||
      !genresOk ||
      !hoursOk ||
      !peakOk ||
      !isNum(s.recentCount) ||
      !isNum(s.recentMinutes) ||
      !isNum(s.loyalCount) ||
      !isNum(s.loyalTotal) ||
      !isNum(s.uniqueArtistsInTop) ||
      !isNum(s.trackCount) ||
      !isValidHistorySummaryObj(s.history)
    ) {
      return null;
    }
    return s as HistoryStats;
  } catch {
    return null;
  }
}

/** Tanpa `year`, dipakai tahun terbaru yang ada di file (file bisa tiba di Januari untuk data tahun lalu). */
export function summarizeHistory(rows: unknown[], year?: number): HistorySummary {
  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error("Tidak ada data riwayat yang valid");
  }

  if (year === undefined) {
    let latest = -Infinity;
    for (const row of rows) {
      if (isValidRow(row) && row.master_metadata_track_name != null) {
        latest = Math.max(latest, new Date(row.ts as string).getFullYear());
      }
    }
    year = Number.isFinite(latest) ? latest : new Date().getFullYear();
  }

  let hasAnyValidRow = false;
  const validYearRows: {
    ts: string;
    date: Date;
    msPlayed: number;
    trackName: string;
    artistName: string;
    trackUri: string | null;
  }[] = [];

  for (const row of rows) {
    if (!isValidRow(row)) {
      continue;
    }
    hasAnyValidRow = true;

    if (row.master_metadata_track_name === null || row.master_metadata_track_name === undefined) {
      continue;
    }
    const trackName = String(row.master_metadata_track_name);
    if (!trackName) continue;

    const d = new Date(row.ts as string);
    if (d.getFullYear() !== year) {
      continue;
    }

    const artistName =
      row.master_metadata_album_artist_name != null
        ? String(row.master_metadata_album_artist_name)
        : "";
    const trackUri =
      typeof row.spotify_track_uri === "string" && row.spotify_track_uri.length > 0
        ? row.spotify_track_uri
        : null;

    validYearRows.push({
      ts: row.ts as string,
      date: d,
      msPlayed: row.ms_played as number,
      trackName,
      artistName,
      trackUri,
    });
  }

  if (!hasAnyValidRow) {
    throw new Error("Tidak ada data riwayat yang valid");
  }

  if (validYearRows.length === 0) {
    throw new Error(`File tidak berisi data lagu tahun ${year}`);
  }

  validYearRows.sort((a, b) => a.date.getTime() - b.date.getTime());

  let totalMs = 0;
  let playCount = 0;

  const trackStatsMap = new Map<string, { name: string; artist: string; plays: number }>();
  let bestTrack: { name: string; artist: string; plays: number } | null = null;
  let maxPlays = 0;

  const dayMsMap = new Map<string, number>();

  for (const row of validYearRows) {
    totalMs += row.msPlayed;

    if (row.msPlayed >= 30000) {
      playCount += 1;

      const groupKey = row.trackUri ?? `${row.trackName}:::${row.artistName}`;
      let stat = trackStatsMap.get(groupKey);
      if (!stat) {
        stat = { name: row.trackName, artist: row.artistName, plays: 0 };
        trackStatsMap.set(groupKey, stat);
      }
      stat.plays += 1;

      if (stat.plays > maxPlays) {
        maxPlays = stat.plays;
        bestTrack = { name: stat.name, artist: stat.artist, plays: stat.plays };
      }
    }

    const dayKey = toLocalDateString(row.date);
    dayMsMap.set(dayKey, (dayMsMap.get(dayKey) ?? 0) + row.msPlayed);
  }

  let busiestDay: { date: string; minutes: number } | null = null;
  let maxDayMs = -1;
  for (const [date, ms] of dayMsMap.entries()) {
    if (ms > maxDayMs) {
      maxDayMs = ms;
      busiestDay = { date, minutes: Math.round(ms / 60000) };
    }
  }

  const lastRow = validYearRows[validYearRows.length - 1];
  const lastDate = toLocalDateString(lastRow.date);

  return {
    year,
    totalMinutes: Math.round(totalMs / 60000),
    playCount,
    topTrack: bestTrack,
    busiestDay,
    lastDate,
  };
}

/** Hitung seluruh HistoryStats dari baris riwayat untuk tahun yang dipilih (atau tahun terbaru di file). */
export function summarizeHistoryStats(rows: unknown[], year?: number): HistoryStats {
  const history = summarizeHistory(rows, year);
  const targetYear = history.year;

  const artistPlays = new Map<string, number>();
  const trackPlays = new Map<
    string,
    { id: string; name: string; artist: string; albumName: string; plays: number }
  >();
  const albumPlays = new Map<
    string,
    { album: Track["album"]; artist: string; count: number }
  >();
  const prevYearTrackPlays = new Map<string, number>();
  const hours = new Array<number>(24).fill(0);

  for (const row of rows) {
    if (!isValidRow(row)) continue;
    if (row.master_metadata_track_name === null || row.master_metadata_track_name === undefined) continue;
    const trackName = String(row.master_metadata_track_name);
    if (!trackName) continue;

    const msPlayed = row.ms_played as number;
    if (msPlayed < 30000) continue;

    const d = new Date(row.ts as string);
    const rowYear = d.getFullYear();

    const artistName =
      row.master_metadata_album_artist_name != null
        ? String(row.master_metadata_album_artist_name)
        : "";
    const albumName =
      row.master_metadata_album_album_name != null
        ? String(row.master_metadata_album_album_name)
        : "";
    const trackUri =
      typeof row.spotify_track_uri === "string" && row.spotify_track_uri.length > 0
        ? row.spotify_track_uri
        : null;
    const trackKey = trackUri ?? `${trackName}:::${artistName}`;

    if (rowYear === targetYear - 1) {
      prevYearTrackPlays.set(trackKey, (prevYearTrackPlays.get(trackKey) ?? 0) + 1);
    } else if (rowYear === targetYear) {
      if (artistName) {
        artistPlays.set(artistName, (artistPlays.get(artistName) ?? 0) + 1);
      }

      const existingTrack = trackPlays.get(trackKey);
      if (existingTrack) {
        existingTrack.plays += 1;
        if (!existingTrack.albumName && albumName) existingTrack.albumName = albumName;
      } else {
        trackPlays.set(trackKey, {
          id: trackKey,
          name: trackName,
          artist: artistName,
          albumName,
          plays: 1,
        });
      }

      if (albumName) {
        const existingAlbum = albumPlays.get(albumName);
        if (existingAlbum) {
          existingAlbum.count += 1;
        } else {
          albumPlays.set(albumName, {
            album: { id: albumName, name: albumName, image: null },
            artist: artistName,
            count: 1,
          });
        }
      }

      hours[d.getHours()] += 1;
    }
  }

  const sortedArtists = [...artistPlays.entries()].sort((a, b) => b[1] - a[1]);
  const topArtists: Artist[] = sortedArtists.slice(0, 5).map(([name]) => ({
    id: name,
    name,
    image: null,
    genres: [],
  }));

  const sortedTracks = [...trackPlays.values()].sort((a, b) => b.plays - a.plays);
  const topTracks: Track[] = sortedTracks.slice(0, 5).map((t) => ({
    id: t.id,
    name: t.name,
    artists: [t.artist],
    album: { id: t.albumName, name: t.albumName, image: null },
    durationMs: 0,
  }));

  const topAlbum = [...albumPlays.values()].sort((a, b) => b.count - a.count)[0] ?? null;
  const peakHour = history.playCount > 0 ? hours.indexOf(Math.max(...hours)) : null;

  let loyalCount = 0;
  let loyalTotal = 0;
  if (prevYearTrackPlays.size > 0 && sortedTracks.length > 0) {
    const prevTop50 = new Set(
      [...prevYearTrackPlays.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 50)
        .map(([k]) => k)
    );
    const top10 = sortedTracks.slice(0, 10);
    loyalCount = top10.filter((t) => prevTop50.has(t.id)).length;
    loyalTotal = top10.length;
  }

  return {
    year: targetYear,
    topArtists,
    topTracks,
    topAlbum,
    topGenres: [],
    hours,
    peakHour,
    recentCount: history.playCount,
    recentMinutes: history.totalMinutes,
    loyalCount,
    loyalTotal,
    uniqueArtistsInTop: artistPlays.size,
    trackCount: trackPlays.size,
    history,
  };
}

export async function readHistoryFile(file: File, year?: number): Promise<HistoryStats> {
  const fileName = file.name.toLowerCase();

  if (fileName.endsWith(".json")) {
    let rows: unknown;
    try {
      const text = await file.text();
      rows = JSON.parse(text);
    } catch {
      throw new Error("File JSON tidak dapat dibaca atau formatnya rusak");
    }

    if (!Array.isArray(rows)) {
      throw new Error("Format file JSON tidak valid: bukan array");
    }
    return summarizeHistoryStats(rows, year);
  }

  if (fileName.endsWith(".zip")) {
    let unzipped: Record<string, Uint8Array>;
    try {
      const buffer = new Uint8Array(await file.arrayBuffer());
      // Hanya ekstrak file audio history dan batasi ukuran supaya zip bomb tidak membekukan tab.
      unzipped = unzipSync(buffer, {
        filter: (f) => /(^|\/)Streaming_History_Audio_.*\.json$/i.test(f.name) && f.originalSize < 50_000_000,
      });
    } catch {
      throw new Error("File zip tidak dapat diekstrak atau formatnya rusak");
    }

    const allRows: unknown[] = [];
    let audioFileFound = false;

    for (const [path, data] of Object.entries(unzipped)) {
      const baseName = path.split("/").pop() ?? path;
      if (/^Streaming_History_Audio_.*\.json$/i.test(baseName)) {
        audioFileFound = true;
        try {
          const text = strFromU8(data);
          const parsed = JSON.parse(text);
          if (Array.isArray(parsed)) {
            for (const r of parsed) allRows.push(r);
          }
        } catch {
          // Abaikan jika satu file rusak di dalam zip
        }
      }
    }

    if (!audioFileFound) {
      throw new Error("Tidak ditemukan file Streaming_History_Audio_*.json di dalam zip");
    }

    return summarizeHistoryStats(allRows, year);
  }

  throw new Error("Format file tidak didukung: gunakan file .zip atau .json");
}
