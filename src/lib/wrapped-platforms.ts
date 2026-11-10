export type WrappedPlatformId = "spotify" | "youtube" | "github" | "steam" | "media";

export type WrappedPlatformStatus = "ready" | "coming_soon";

export type WrappedPlatformConfig = {
  id: WrappedPlatformId;
  name: string;
  shortName: string;
  category: string;
  status: WrappedPlatformStatus;
  description: string;
  dataMethod: string;
  highlights: string[];
  privacy: string;
  /** Path SVG 24x24, dirender dengan fillRule="evenodd". */
  iconPath: string;
};

export const PLATFORM_STATUS_LABEL: Record<WrappedPlatformStatus, string> = {
  ready: "Tersedia",
  coming_soon: "Segera hadir",
};

export const WRAPPED_PLATFORMS: WrappedPlatformConfig[] = [
  {
    id: "spotify",
    name: "Spotify Wrapped",
    shortName: "Spotify",
    category: "Musik & Audio",
    status: "ready",
    description: "Rangkuman artis, lagu, dan album yang paling sering kamu putar.",
    dataMethod: "Login OAuth Spotify, atau upload Extended Streaming History (.zip atau .json).",
    highlights: ["Top artis", "Top lagu", "Album favorit", "Jam puncak", "Total menit"],
    privacy: "File riwayat dibaca di browser kamu. Yang disimpan hanya ringkasan statistik.",
    iconPath: "M4 10h3v4H4z M9 6h3v12H9z M14 8h3v8h-3z M19 11h3v2h-3z",
  },
  {
    id: "youtube",
    name: "YouTube / YT Music Wrapped",
    shortName: "YouTube",
    category: "Video & Musik",
    status: "coming_soon",
    description: "Channel dan video yang paling sering kamu tonton.",
    dataMethod: "Upload file Google Takeout watch-history.json, dibaca di browser.",
    highlights: ["Top channel dan kreator", "Video terpopuler", "Total tayangan", "Jam aktif menonton"],
    privacy: "File Takeout dibaca di browser kamu dan tidak dikirim ke server.",
    iconPath: "M3 5h18v14H3z M5 7v10h14V7z M10 9v6l5-3z",
  },
  {
    id: "github",
    name: "GitHub / Coder Wrapped",
    shortName: "GitHub",
    category: "Coding & Open Source",
    status: "coming_soon",
    description: "Jejak commit, pull request, dan bahasa yang paling sering kamu tulis.",
    dataMethod: "Input username GitHub publik, data dibaca lewat GitHub API.",
    highlights: ["Total commit dan PR", "Bahasa pemrograman utama", "Repo teraktif", "Jam puncak ngoding"],
    privacy: "Hanya membaca data publik akun GitHub. Tidak perlu login atau token.",
    iconPath:
      "M8 7h2v2H8z M6 9h2v2H6z M4 11h2v2H4z M6 13h2v2H6z M8 15h2v2H8z M14 7h2v2h-2z M16 9h2v2h-2z M18 11h2v2h-2z M16 13h2v2h-2z M14 15h2v2h-2z",
  },
  {
    id: "steam",
    name: "Steam / Gamer Wrapped",
    shortName: "Steam",
    category: "Gaming & Playtime",
    status: "coming_soon",
    description: "Game yang paling lama kamu mainkan dan tumpukan backlog-mu.",
    dataMethod: "Input Steam ID dengan profil dan detail game yang disetel publik.",
    highlights: ["Total jam bermain", "Top 5 game", "Rasio backlog game", "Persona gamer"],
    privacy: "Hanya membaca profil publik Steam. Tidak perlu password akun.",
    iconPath: "M3 7h18v10H3z M5 9v6h14V9z M7 11h4v2H7z M8 10h2v1H8z M8 13h2v1H8z M14 10h2v2h-2z M16 12h2v2h-2z",
  },
  {
    id: "media",
    name: "Letterboxd / MyAnimeList Wrapped",
    shortName: "Letterboxd/MAL",
    category: "Film & Anime",
    status: "coming_soon",
    description: "Film dan anime yang kamu selesaikan beserta skor yang kamu beri.",
    dataMethod: "Upload CSV ekspor Letterboxd, atau input username MyAnimeList.",
    highlights: ["Total film dan anime selesai", "Daftar rating tertinggi", "Genre favorit", "Rata-rata skor"],
    privacy: "CSV Letterboxd dibaca di browser kamu. Username MyAnimeList hanya dipakai untuk membaca daftar publik.",
    iconPath:
      "M4 4h16v16H4z M7 6v12h10V6z M5 6h1v2H5z M5 11h1v2H5z M5 16h1v2H5z M18 6h1v2h-1z M18 11h1v2h-1z M18 16h1v2h-1z",
  },
];
