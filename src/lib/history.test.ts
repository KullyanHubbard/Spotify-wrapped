import test from "node:test";
import assert from "node:assert/strict";
import { parseHistoryStats, parseHistorySummary, summarizeHistory, summarizeHistoryStats } from "./history.ts";
import { statsFromHistory } from "./stats.ts";

test("data normal", () => {
  const rows = [
    {
      ts: "2026-03-01T10:00:00.000Z",
      ms_played: 60000,
      master_metadata_track_name: "Song A",
      master_metadata_album_artist_name: "Artist A",
      spotify_track_uri: "spotify:track:1",
    },
    {
      ts: "2026-03-01T11:00:00.000Z",
      ms_played: 120000,
      master_metadata_track_name: "Song A",
      master_metadata_album_artist_name: "Artist A",
      spotify_track_uri: "spotify:track:1",
    },
    {
      ts: "2026-03-02T10:00:00.000Z",
      ms_played: 60000,
      master_metadata_track_name: "Song B",
      master_metadata_album_artist_name: "Artist B",
      spotify_track_uri: "spotify:track:2",
    },
  ];

  const summary = summarizeHistory(rows, 2026);
  assert.equal(summary.year, 2026);
  assert.equal(summary.totalMinutes, 4); // (60k + 120k + 60k) / 60k = 4
  assert.equal(summary.playCount, 3);
  assert.deepEqual(summary.topTrack, {
    name: "Song A",
    artist: "Artist A",
    plays: 2,
  });
  assert.ok(summary.busiestDay !== null);
  assert.equal(summary.busiestDay?.minutes, 3);
  assert.equal(typeof summary.lastDate, "string");
  assert.ok(summary.lastDate.startsWith("2026-"));
});

test("podcast dibuang", () => {
  const rows = [
    {
      ts: "2026-04-01T10:00:00.000Z",
      ms_played: 60000,
      master_metadata_track_name: "Song 1",
      master_metadata_album_artist_name: "Artist 1",
      spotify_track_uri: "spotify:track:song1",
    },
    {
      ts: "2026-04-01T11:00:00.000Z",
      ms_played: 1800000, // 30 minutes podcast
      master_metadata_track_name: null,
      master_metadata_album_artist_name: null,
      spotify_track_uri: null,
    },
  ];

  const summary = summarizeHistory(rows, 2026);
  assert.equal(summary.totalMinutes, 1);
  assert.equal(summary.playCount, 1);
  assert.deepEqual(summary.topTrack, {
    name: "Song 1",
    artist: "Artist 1",
    plays: 1,
  });
});

test("tahun lain dibuang", () => {
  const rows = [
    {
      ts: "2025-06-01T10:00:00.000Z",
      ms_played: 120000,
      master_metadata_track_name: "Old Song",
      master_metadata_album_artist_name: "Old Artist",
      spotify_track_uri: "spotify:track:old",
    },
    {
      ts: "2026-06-01T10:00:00.000Z",
      ms_played: 60000,
      master_metadata_track_name: "Current Song",
      master_metadata_album_artist_name: "Current Artist",
      spotify_track_uri: "spotify:track:current",
    },
    {
      ts: "2027-01-01T10:00:00.000Z",
      ms_played: 120000,
      master_metadata_track_name: "Future Song",
      master_metadata_album_artist_name: "Future Artist",
      spotify_track_uri: "spotify:track:future",
    },
  ];

  const summary = summarizeHistory(rows, 2026);
  assert.equal(summary.totalMinutes, 1);
  assert.equal(summary.playCount, 1);
  assert.deepEqual(summary.topTrack, {
    name: "Current Song",
    artist: "Current Artist",
    plays: 1,
  });
});

test("tidak ada data tahun ini (error)", () => {
  const rows = [
    {
      ts: "2025-06-01T10:00:00.000Z",
      ms_played: 120000,
      master_metadata_track_name: "Old Song",
      master_metadata_album_artist_name: "Old Artist",
      spotify_track_uri: "spotify:track:old",
    },
  ];

  assert.throws(
    () => summarizeHistory(rows, 2026),
    (err: unknown) => {
      assert(err instanceof Error);
      assert.equal(err.message, "File tidak berisi data lagu tahun 2026");
      return true;
    }
  );
});

test("baris rusak dilewati", () => {
  const rows = [
    null,
    "invalid string row",
    12345,
    { foo: "bar" },
    { ts: "invalid-date", ms_played: 60000, master_metadata_track_name: "Broken Date" },
    { ts: "2026-05-01T10:00:00.000Z", ms_played: -500, master_metadata_track_name: "Negative Ms" },
    { ts: "2026-05-01T10:00:00.000Z", ms_played: "60000", master_metadata_track_name: "String Ms" },
    {
      ts: "2026-05-01T10:00:00.000Z",
      ms_played: 60000,
      master_metadata_track_name: "Valid Song",
      master_metadata_album_artist_name: "Valid Artist",
      spotify_track_uri: "spotify:track:valid",
    },
  ];

  const summary = summarizeHistory(rows, 2026);
  assert.equal(summary.totalMinutes, 1);
  assert.equal(summary.playCount, 1);
  assert.deepEqual(summary.topTrack, {
    name: "Valid Song",
    artist: "Valid Artist",
    plays: 1,
  });
});

test("tahun otomatis dari data terbaru di file", () => {
  const row = (ts: string) => ({ ts, ms_played: 60000, master_metadata_track_name: "A", master_metadata_album_artist_name: "X", spotify_track_uri: "u" });
  assert.equal(summarizeHistory([row("2025-12-30T10:00:00Z"), row("2024-01-02T10:00:00Z")]).year, 2025);
});

test("parseHistorySummary menolak bentuk salah", () => {
  assert.equal(parseHistorySummary('{"year":2026}'), null);
  assert.equal(parseHistorySummary("bukan json"), null);
  const ok = { year: 2026, totalMinutes: 1, playCount: 1, topTrack: null, busiestDay: null, lastDate: "2026-01-01" };
  assert.deepEqual(parseHistorySummary(JSON.stringify(ok)), ok);
});

test("parseHistorySummary: ownerId opsional, tipe salah ditolak", () => {
  const base = { year: 2026, totalMinutes: 10, playCount: 2, topTrack: null, busiestDay: null, lastDate: "2026-03-02" };
  assert.equal(parseHistorySummary(JSON.stringify(base))?.ownerId, undefined);
  assert.equal(parseHistorySummary(JSON.stringify({ ...base, ownerId: "abc" }))?.ownerId, "abc");
  assert.equal(parseHistorySummary(JSON.stringify({ ...base, ownerId: 42 })), null);
});

test("summarizeHistoryStats & statsFromHistory: urutan top 5, podcast dibuang, <30s diabaikan, loyal tanpa tahun lalu = 0", () => {
  const rows: unknown[] = [];
  // Buat 6 artis dan 6 lagu dengan jumlah putar menurun (6, 5, 4, 3, 2, 1)
  for (let i = 1; i <= 6; i++) {
    const plays = 7 - i;
    for (let p = 0; p < plays; p++) {
      rows.push({
        ts: `2026-03-0${i}T10:00:00.000Z`,
        ms_played: 60000,
        master_metadata_track_name: `Track ${i}`,
        master_metadata_album_artist_name: `Artist ${i}`,
        master_metadata_album_album_name: `Album ${i}`,
        spotify_track_uri: `spotify:track:${i}`,
      });
    }
  }
  // Podcast (harus dibuang)
  rows.push({
    ts: "2026-03-10T10:00:00.000Z",
    ms_played: 3600000,
    master_metadata_track_name: null,
    master_metadata_album_artist_name: null,
    spotify_track_uri: null,
  });
  // Putar di bawah 30 detik (tidak dihitung sebagai putar, tapi menit tetap dihitung di totalMinutes)
  for (let s = 0; s < 10; s++) {
    rows.push({
      ts: "2026-03-11T10:00:00.000Z",
      ms_played: 15000,
      master_metadata_track_name: "Short Track",
      master_metadata_album_artist_name: "Short Artist",
      master_metadata_album_album_name: "Short Album",
      spotify_track_uri: "spotify:track:short",
    });
  }

  const hStats = summarizeHistoryStats(rows, 2026);
  assert.equal(hStats.year, 2026);
  assert.equal(hStats.topArtists.length, 5);
  assert.deepEqual(
    hStats.topArtists.map((a) => a.name),
    ["Artist 1", "Artist 2", "Artist 3", "Artist 4", "Artist 5"]
  );
  assert.equal(hStats.topArtists[0].image, null);
  assert.deepEqual(hStats.topArtists[0].genres, []);

  assert.equal(hStats.topTracks.length, 5);
  assert.deepEqual(
    hStats.topTracks.map((t) => t.name),
    ["Track 1", "Track 2", "Track 3", "Track 4", "Track 5"]
  );
  assert.equal(hStats.topTracks[0].album.name, "Album 1");
  assert.equal(hStats.topTracks[0].album.image, null);
  assert.equal(hStats.topTracks[0].durationMs, 0);

  assert.deepEqual(hStats.topAlbum, {
    album: { id: "Album 1", name: "Album 1", image: null },
    artist: "Artist 1",
    count: 6,
  });
  assert.deepEqual(hStats.topGenres, []);
  assert.equal(hStats.recentCount, 21); // 6+5+4+3+2+1 = 21 putar >= 30s
  assert.equal(hStats.uniqueArtistsInTop, 6); // Short Artist (<30s) tidak dihitung
  assert.equal(hStats.trackCount, 6); // Short Track (<30s) tidak dihitung
  assert.equal(hStats.loyalCount, 0);
  assert.equal(hStats.loyalTotal, 0);

  const fullStats = statsFromHistory(hStats);
  assert.equal(fullStats.source, "file");
  assert.equal(fullStats.recentCount, hStats.recentCount);
  assert.equal(fullStats.recentMinutes, hStats.recentMinutes);
  assert.deepEqual(fullStats.topArtists, hStats.topArtists);
});

test("summarizeHistoryStats: loyal dihitung jika ada data tahun sebelumnya", () => {
  const rows = [
    {
      ts: "2025-05-01T10:00:00.000Z",
      ms_played: 60000,
      master_metadata_track_name: "Loyal Song",
      master_metadata_album_artist_name: "Artist A",
      spotify_track_uri: "spotify:track:loyal",
    },
    {
      ts: "2026-05-01T10:00:00.000Z",
      ms_played: 60000,
      master_metadata_track_name: "Loyal Song",
      master_metadata_album_artist_name: "Artist A",
      spotify_track_uri: "spotify:track:loyal",
    },
    {
      ts: "2026-05-02T10:00:00.000Z",
      ms_played: 60000,
      master_metadata_track_name: "New Song",
      master_metadata_album_artist_name: "Artist B",
      spotify_track_uri: "spotify:track:new",
    },
  ];
  const hStats = summarizeHistoryStats(rows, 2026);
  assert.equal(hStats.loyalCount, 1);
  assert.equal(hStats.loyalTotal, 2);
});

test("parseHistoryStats menerima data valid dan menolak data rusak", () => {
  const hStats = summarizeHistoryStats(
    [
      {
        ts: "2026-03-01T10:00:00.000Z",
        ms_played: 60000,
        master_metadata_track_name: "Song A",
        master_metadata_album_artist_name: "Artist A",
        master_metadata_album_album_name: "Album A",
        spotify_track_uri: "spotify:track:1",
      },
    ],
    2026
  );

  const raw = JSON.stringify(hStats);
  assert.deepEqual(parseHistoryStats(raw), hStats);
  assert.equal(parseHistoryStats(null), null);
  assert.equal(parseHistoryStats("rusak"), null);
  assert.equal(parseHistoryStats(JSON.stringify({ ...hStats, hours: [1, 2] })), null);
  assert.equal(parseHistoryStats(JSON.stringify({ ...hStats, topArtists: "bukan array" })), null);
  assert.equal(parseHistoryStats(JSON.stringify({ ...hStats, history: null })), null);
});
