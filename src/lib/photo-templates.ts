export type PhotoLayoutType =
  | "strip-4"
  | "strip-3"
  | "grid-2x2"
  | "polaroid-1"
  | "duo-2"
  | "receipt-photo";

export type PhotoCategoryId =
  | "neo"
  | "nota"
  | "retro"
  | "editorial"
  | "cyberpunk"
  | "playful"
  | "sketch";

export type PhotoFilterId =
  | "normal"
  | "bw-classic"
  | "warm-film"
  | "soft-korea"
  | "cyber-cool"
  | "noir-grain";

export interface PhotoFilterConfig {
  id: PhotoFilterId;
  name: string;
  shortLabel: string;
  cssFilter: string;
}

export interface PhotoTemplateStyle {
  bg: string;
  cardBg: string;
  text: string;
  mutedText: string;
  accent: string;
  accentText: string;
  borderStyle: "hard" | "thin" | "dashed" | "double";
  borderColor: string;
  shadowColor?: string;
  fontStyle: "display" | "mono" | "body";
  headerTag: string;
  footerStamp: string;
  pattern: "dots" | "grid" | "scanlines" | "receipt" | "editorial" | "corners" | "none";
}

export interface PhotoTemplateConfig {
  id: string;
  name: string;
  category: PhotoCategoryId;
  layout: PhotoLayoutType;
  slots: 1 | 2 | 3 | 4;
  badge: string;
  description: string;
  defaultCaption: string;
  defaultSubcaption: string;
  defaultFilter: PhotoFilterId;
  receiptItems?: { label: string; qty: string; price: string }[];
  style: PhotoTemplateStyle;
}

export const PHOTO_CATEGORIES: { id: PhotoCategoryId | "all"; name: string; desc: string }[] = [
  { id: "all", name: "Semua Gaya", desc: "Seluruh koleksi frame Kilasara Studio" },
  { id: "neo", name: "Neo-Brutalist", desc: "Garis tegas, kontras berani, dan bayangan keras khas studio modern" },
  { id: "nota", name: "Struk & Tiket", desc: "Cetakan ala struk kasir, boarding pass, dan tiket konser" },
  { id: "retro", name: "Retro & Pers", desc: "Nuansa kliping surat kabar klasik, kaset analog, dan era 90an" },
  { id: "editorial", name: "Luxury & Majalah", desc: "Tata letak sampul majalah mode dan arsip galeri seni" },
  { id: "cyberpunk", name: "Cyber & Neon", desc: "Futuristik malam hari dengan aksen matriks dan terminal neon" },
  { id: "playful", name: "Playful & Y2K", desc: "Warna cerah, pop-art ceria, dan gaya photobox Korea" },
  { id: "sketch", name: "Sketch & Buku Harian", desc: "Tekstur kertas catatan, buku tahunan, dan tempelan jurnal" },
];

export const PHOTO_FILTERS: PhotoFilterConfig[] = [
  {
    id: "normal",
    name: "Asli Natural",
    shortLabel: "Normal",
    cssFilter: "none",
  },
  {
    id: "bw-classic",
    name: "Hitam Putih Kontras",
    shortLabel: "B&W Klasik",
    cssFilter: "grayscale(100%) contrast(118%) brightness(102%)",
  },
  {
    id: "warm-film",
    name: "Film Hangat 90an",
    shortLabel: "Film 90s",
    cssFilter: "sepia(28%) contrast(106%) brightness(103%) saturate(115%)",
  },
  {
    id: "soft-korea",
    name: "Photobox Cerah",
    shortLabel: "Cerah Soft",
    cssFilter: "brightness(108%) contrast(96%) saturate(108%)",
  },
  {
    id: "cyber-cool",
    name: "Neon Dingin",
    shortLabel: "Cyber Tone",
    cssFilter: "contrast(116%) saturate(135%) hue-rotate(-8deg)",
  },
  {
    id: "noir-grain",
    name: "Noir Sinematik",
    shortLabel: "Noir",
    cssFilter: "grayscale(100%) contrast(142%) brightness(92%)",
  },
];

export const PHOTO_TEMPLATES: PhotoTemplateConfig[] = [
  // === 1. NEO-BRUTALIST ===
  {
    id: "kilas-neo-cream",
    name: "NEXTEC Signature Strip",
    category: "neo",
    layout: "strip-4",
    slots: 4,
    badge: "4-CUTS STRIP",
    description: "Strip 4 foto ikonik Kilasara dengan warna krim hangat dan aksen merah brutalist.",
    defaultCaption: "KILASARA SNAP",
    defaultSubcaption: "EDISI SPESIAL // STUDIO 01",
    defaultFilter: "normal",
    style: {
      bg: "#fff5ef",
      cardBg: "#ffffff",
      text: "#030303",
      mutedText: "#57534e",
      accent: "#fb2c36",
      accentText: "#fff5ef",
      borderStyle: "hard",
      borderColor: "#030303",
      shadowColor: "#030303",
      fontStyle: "display",
      headerTag: "KILASARA // SNAP-01",
      footerStamp: "KILASARA STUDIO · CETAK ASLI",
      pattern: "dots",
    },
  },
  {
    id: "kilas-neo-grid-coral",
    name: "Brutalist Quad Grid",
    category: "neo",
    layout: "grid-2x2",
    slots: 4,
    badge: "GRID 2X2",
    description: "Susunan 4 foto kotak 2x2 dengan blok warna koral dan tipografi poster.",
    defaultCaption: "EMPAT MOMEN",
    defaultSubcaption: "ARSIP VISUAL KILASARA",
    defaultFilter: "normal",
    style: {
      bg: "#d86a60",
      cardBg: "#fff5ef",
      text: "#030303",
      mutedText: "#292524",
      accent: "#030303",
      accentText: "#fff5ef",
      borderStyle: "hard",
      borderColor: "#030303",
      shadowColor: "#030303",
      fontStyle: "display",
      headerTag: "QUAD // GRID-02",
      footerStamp: "KILASARA STUDIO · JAKARTA",
      pattern: "grid",
    },
  },
  {
    id: "kilas-neo-cobalt",
    name: "Cobalt Block Poster",
    category: "neo",
    layout: "polaroid-1",
    slots: 1,
    badge: "POSTER TUNGGAL",
    description: "Frame 1 foto besar bergaya poster pameran modern dengan aksen kuning elektrik.",
    defaultCaption: "SOROTAN UTAMA",
    defaultSubcaption: "KILAS FOTO & AKSARA CERITA",
    defaultFilter: "normal",
    style: {
      bg: "#1d4ed8",
      cardBg: "#fff5ef",
      text: "#030303",
      mutedText: "#334155",
      accent: "#facc15",
      accentText: "#030303",
      borderStyle: "hard",
      borderColor: "#030303",
      shadowColor: "#030303",
      fontStyle: "display",
      headerTag: "EXHIBITION // NO. 03",
      footerStamp: "KILASARA STUDIO · POSTER EDITION",
      pattern: "corners",
    },
  },
  {
    id: "kilas-neo-duo-teal",
    name: "Teal Split Duo",
    category: "neo",
    layout: "duo-2",
    slots: 2,
    badge: "DUO 2-CUTS",
    description: "Frame 2 foto besar atas-bawah untuk potret berdua atau before-after.",
    defaultCaption: "DUA CERITA",
    defaultSubcaption: "SATU TANGKAPAN LAYAR",
    defaultFilter: "soft-korea",
    style: {
      bg: "#3a9fa7",
      cardBg: "#ffffff",
      text: "#030303",
      mutedText: "#1f2937",
      accent: "#fb2c36",
      accentText: "#ffffff",
      borderStyle: "hard",
      borderColor: "#030303",
      shadowColor: "#030303",
      fontStyle: "display",
      headerTag: "DUO SERIES // 04",
      footerStamp: "KILASARA STUDIO · DUO CUT",
      pattern: "dots",
    },
  },

  // === 2. NOTA / STRUK & TIKET ===
  {
    id: "kilas-nota-kasir",
    name: "Struk Memori Kasir",
    category: "nota",
    layout: "receipt-photo",
    slots: 2,
    badge: "STRUK KASIR",
    description: "Cetakan ala struk belanja termal lengkap dengan 2 foto, daftar item kenangan, dan barcode.",
    defaultCaption: "BUKTI TRANSAKSI MEMORI",
    defaultSubcaption: "KASIR #01 · KILASARA MART",
    defaultFilter: "bw-classic",
    receiptItems: [
      { label: "TAWA BERSAMA", qty: "2X", price: "RP 0" },
      { label: "CERITA MALAM", qty: "1X", price: "RP 0" },
      { label: "KENANGAN ABADI", qty: "99X", price: "LUNAS" },
    ],
    style: {
      bg: "#e7e5e4",
      cardBg: "#fafaf9",
      text: "#1c1917",
      mutedText: "#57534e",
      accent: "#1c1917",
      accentText: "#fafaf9",
      borderStyle: "dashed",
      borderColor: "#1c1917",
      fontStyle: "mono",
      headerTag: "STRUK RESMI // KILASARA",
      footerStamp: "TERIMA KASIH · SIMPAN STRUK INI",
      pattern: "receipt",
    },
  },
  {
    id: "kilas-nota-kopi",
    name: "Nota Kedai Kopi Malam",
    category: "nota",
    layout: "receipt-photo",
    slots: 2,
    badge: "STRUK KAFE",
    description: "Struk kertas krem hangat bertema obrolan kedai kopi bersama sahabat.",
    defaultCaption: "PESANAN MEJA NO. 07",
    defaultSubcaption: "BARISTA: KILASARA STUDIO",
    defaultFilter: "warm-film",
    receiptItems: [
      { label: "ES KOPI SUSU", qty: "2X", price: "100%" },
      { label: "OBROLAN RANDOM", qty: "3JAM", price: "PENUH" },
      { label: "ENERGI POSITIF", qty: "MAX", price: "GRATIS" },
    ],
    style: {
      bg: "#d6c7b2",
      cardBg: "#f5efe6",
      text: "#2c1e16",
      mutedText: "#6b5344",
      accent: "#b45309",
      accentText: "#fffbeb",
      borderStyle: "dashed",
      borderColor: "#2c1e16",
      fontStyle: "mono",
      headerTag: "KILASARA ROASTERY // #06",
      footerStamp: "VALID TANPA KEDALUWARSA",
      pattern: "receipt",
    },
  },
  {
    id: "kilas-nota-boarding",
    name: "First Class Boarding Pass",
    category: "nota",
    layout: "strip-3",
    slots: 3,
    badge: "TIKET PERJALANAN",
    description: "Strip 3 foto bergaya tiket pesawat kelas utama untuk menyimpan momen liburan.",
    defaultCaption: "GATE KLS-24 · BOARDING",
    defaultSubcaption: "DESTINASI: MEMORI TERBAIK",
    defaultFilter: "normal",
    style: {
      bg: "#f1f5f9",
      cardBg: "#ffffff",
      text: "#0f172a",
      mutedText: "#475569",
      accent: "#dc2626",
      accentText: "#ffffff",
      borderStyle: "dashed",
      borderColor: "#0f172a",
      fontStyle: "mono",
      headerTag: "FLIGHT PASS // KLS-880",
      footerStamp: "KILASARA AIRWAYS · PRIORITY",
      pattern: "grid",
    },
  },
  {
    id: "kilas-nota-konser",
    name: "VIP Backstage Pass",
    category: "nota",
    layout: "strip-4",
    slots: 4,
    badge: "TIKET KONSER",
    description: "Strip 4 foto bertema tiket festival musik malam dengan kontras kuning-hitam.",
    defaultCaption: "ALL ACCESS VIP PASS",
    defaultSubcaption: "FESTIVAL MUSIK & CERITA",
    defaultFilter: "cyber-cool",
    style: {
      bg: "#18181b",
      cardBg: "#27272a",
      text: "#fafafa",
      mutedText: "#a1a1aa",
      accent: "#facc15",
      accentText: "#18181b",
      borderStyle: "dashed",
      borderColor: "#facc15",
      fontStyle: "mono",
      headerTag: "ADMIT ONE // STAGE-01",
      footerStamp: "KILASARA LIVE · NO REFUNDS",
      pattern: "dots",
    },
  },

  // === 3. RETRO & PERS ===
  {
    id: "kilas-retro-koran",
    name: "Harian Kilasara Pos",
    category: "retro",
    layout: "strip-3",
    slots: 3,
    badge: "SURAT KABAR",
    description: "Tampilan kliping halaman depan koran klasik dengan foto monokrom berkelas.",
    defaultCaption: "BERITA UTAMA HARI INI",
    defaultSubcaption: "EDISI CETAK KHUSUS · TERBIT PAGI",
    defaultFilter: "bw-classic",
    style: {
      bg: "#e6dfd3",
      cardBg: "#f4efe6",
      text: "#1c1917",
      mutedText: "#57534e",
      accent: "#1c1917",
      accentText: "#f4efe6",
      borderStyle: "double",
      borderColor: "#1c1917",
      fontStyle: "body",
      headerTag: "HARIAN KILASARA // VOL. I",
      footerStamp: "ARSIP PERS · KILASARA STUDIO",
      pattern: "editorial",
    },
  },
  {
    id: "kilas-retro-analog",
    name: "35mm Film Contact Sheet",
    category: "retro",
    layout: "strip-4",
    slots: 4,
    badge: "ROL FILM 35MM",
    description: "Strip klise kamera analog 35mm dengan bingkai gelap dan nomor eksposur kuning.",
    defaultCaption: "KODAK MOMENT 400TX",
    defaultSubcaption: "ROLL #24 · LENS 35MM F/1.8",
    defaultFilter: "warm-film",
    style: {
      bg: "#0c0a09",
      cardBg: "#1c1917",
      text: "#fafaf9",
      mutedText: "#a8a29e",
      accent: "#f59e0b",
      accentText: "#0c0a09",
      borderStyle: "thin",
      borderColor: "#44403c",
      fontStyle: "mono",
      headerTag: "FILM STRIP // ISO 400",
      footerStamp: "KILASARA ANALOG LAB · 35MM",
      pattern: "corners",
    },
  },
  {
    id: "kilas-retro-kaset",
    name: "Mixtape Side-A 1998",
    category: "retro",
    layout: "grid-2x2",
    slots: 4,
    badge: "RETRO 90S",
    description: "Grid 4 foto bernuansa sampul kaset pita era 90an dengan warna terakota hangat.",
    defaultCaption: "MIXTAPE SIDE A // 90S",
    defaultSubcaption: "REKAMAN SUARA & GAMBAR",
    defaultFilter: "warm-film",
    style: {
      bg: "#f3e5d0",
      cardBg: "#fffbf5",
      text: "#431407",
      mutedText: "#7c2d12",
      accent: "#ea580c",
      accentText: "#fffbf5",
      borderStyle: "hard",
      borderColor: "#431407",
      shadowColor: "#431407",
      fontStyle: "display",
      headerTag: "HI-FI STEREO // C-90",
      footerStamp: "KILASARA RETRO · RECORDED LIVE",
      pattern: "scanlines",
    },
  },
  {
    id: "kilas-retro-win98",
    name: "Retro OS Window 98",
    category: "retro",
    layout: "polaroid-1",
    slots: 1,
    badge: "RETRO DIALOG",
    description: "Frame tunggal bergaya jendela komputer klasik tahun 98 dengan bar judul biru.",
    defaultCaption: "MEMORY_VIEWER.EXE",
    defaultSubcaption: "STATUS: BERHASIL DISIMPAN",
    defaultFilter: "normal",
    style: {
      bg: "#008080",
      cardBg: "#c0c0c0",
      text: "#000000",
      mutedText: "#333333",
      accent: "#000080",
      accentText: "#ffffff",
      borderStyle: "hard",
      borderColor: "#000000",
      shadowColor: "#000000",
      fontStyle: "mono",
      headerTag: "SYSTEM // KILASARA_OS.EXE",
      footerStamp: "OK [ENTER] · KILASARA STUDIO",
      pattern: "grid",
    },
  },

  // === 4. LUXURY & EDITORIAL ===
  {
    id: "kilas-luxury-noir",
    name: "Noir Atelier Strip",
    category: "editorial",
    layout: "strip-4",
    slots: 4,
    badge: "ATELIER 4-CUTS",
    description: "Strip photobooth hitam legam dengan aksen emas sampanye yang minimalis dan elegan.",
    defaultCaption: "L'ATELIER KILASARA",
    defaultSubcaption: "PRIVATE COLLECTION · NOIR",
    defaultFilter: "bw-classic",
    style: {
      bg: "#09090b",
      cardBg: "#121215",
      text: "#f4f4f5",
      mutedText: "#a1a1aa",
      accent: "#d4af37",
      accentText: "#09090b",
      borderStyle: "thin",
      borderColor: "#d4af37",
      fontStyle: "body",
      headerTag: "ATELIER // COLLECTION",
      footerStamp: "KILASARA STUDIO · HAUTE ARCHIVE",
      pattern: "editorial",
    },
  },
  {
    id: "kilas-luxury-cover",
    name: "Editorial Issue Cover",
    category: "editorial",
    layout: "polaroid-1",
    slots: 1,
    badge: "SAMPUL MAJALAH",
    description: "Satu potret penuh bergaya sampul majalah mode internasional.",
    defaultCaption: "THE ICONIC ISSUE",
    defaultSubcaption: "PERSON OF THE YEAR · KILASARA",
    defaultFilter: "soft-korea",
    style: {
      bg: "#faf8f5",
      cardBg: "#ffffff",
      text: "#111111",
      mutedText: "#52525b",
      accent: "#991b1b",
      accentText: "#ffffff",
      borderStyle: "double",
      borderColor: "#111111",
      fontStyle: "body",
      headerTag: "KILASARA MAGAZINE // ISSUE 01",
      footerStamp: "SPECIAL EDITION · PRINT ARCHIVE",
      pattern: "editorial",
    },
  },
  {
    id: "kilas-luxury-gallery",
    name: "Museum Exhibition Duo",
    category: "editorial",
    layout: "duo-2",
    slots: 2,
    badge: "GALERI SENI",
    description: "Tata letak 2 foto ruang pameran museum dengan ruang kosong yang bersih dan tenang.",
    defaultCaption: "FIG. 01 & FIG. 02",
    defaultSubcaption: "PAMERAN TETAP KILASARA",
    defaultFilter: "warm-film",
    style: {
      bg: "#f5f5f4",
      cardBg: "#ffffff",
      text: "#1c1917",
      mutedText: "#78716c",
      accent: "#44403c",
      accentText: "#fafaf9",
      borderStyle: "thin",
      borderColor: "#d6d3d1",
      fontStyle: "body",
      headerTag: "CURATED ARCHIVE // 015",
      footerStamp: "KILASARA FINE ART STUDIO",
      pattern: "none",
    },
  },

  // === 5. CYBERPUNK & NEON ===
  {
    id: "kilas-cyber-matrix",
    name: "Cyber Telemetry Strip",
    category: "cyberpunk",
    layout: "strip-4",
    slots: 4,
    badge: "NEON 4-CUTS",
    description: "Strip 4 foto bertema terminal malam dengan garis neon hijau-sian.",
    defaultCaption: "NEURAL SNAP // 2099",
    defaultSubcaption: "SYS.SYNC: 100% VERIFIED",
    defaultFilter: "cyber-cool",
    style: {
      bg: "#050811",
      cardBg: "#0b1120",
      text: "#e2e8f0",
      mutedText: "#64748b",
      accent: "#00f5d4",
      accentText: "#050811",
      borderStyle: "hard",
      borderColor: "#00f5d4",
      shadowColor: "#00f5d4",
      fontStyle: "mono",
      headerTag: "CYBER_NODE // KLS-99",
      footerStamp: "KILASARA CYBER LAB · ENCRYPTED",
      pattern: "scanlines",
    },
  },
  {
    id: "kilas-cyber-magenta",
    name: "Synthwave Night Grid",
    category: "cyberpunk",
    layout: "grid-2x2",
    slots: 4,
    badge: "NEON GRID",
    description: "Grid 2x2 dengan pendaran warna magenta elektrik dan ungu gelap.",
    defaultCaption: "MIDNIGHT OVERDRIVE",
    defaultSubcaption: "FREQUENCY // 108.4 MHZ",
    defaultFilter: "cyber-cool",
    style: {
      bg: "#130722",
      cardBg: "#1e0b36",
      text: "#fdf4ff",
      mutedText: "#d8b4fe",
      accent: "#f72585",
      accentText: "#ffffff",
      borderStyle: "hard",
      borderColor: "#f72585",
      shadowColor: "#7209b7",
      fontStyle: "display",
      headerTag: "SYNTH // GRID-2049",
      footerStamp: "KILASARA STUDIO · NIGHT SHIFT",
      pattern: "grid",
    },
  },
  {
    id: "kilas-cyber-hud",
    name: "Tactical HUD Scanner",
    category: "cyberpunk",
    layout: "strip-3",
    slots: 3,
    badge: "HUD 3-CUTS",
    description: "Tiga tangkapan kamera ala radar optik futuristik dengan indikator koordinat.",
    defaultCaption: "TARGET LOCKED // 03",
    defaultSubcaption: "OPTICAL CAPTURE COMPLETE",
    defaultFilter: "noir-grain",
    style: {
      bg: "#090d16",
      cardBg: "#111827",
      text: "#f9fafb",
      mutedText: "#9ca3af",
      accent: "#38bdf8",
      accentText: "#090d16",
      borderStyle: "thin",
      borderColor: "#38bdf8",
      fontStyle: "mono",
      headerTag: "OPTIC_SCAN // KLS-HUD",
      footerStamp: "KILASARA TELEMETRY · ONLINE",
      pattern: "corners",
    },
  },

  // === 6. PLAYFUL & Y2K ===
  {
    id: "kilas-playful-seoul",
    name: "Seoul Life 4-Cuts Pink",
    category: "playful",
    layout: "strip-4",
    slots: 4,
    badge: "K-PHOTOBOX",
    description: "Strip photobox pastel ala studio foto Korea yang manis dan cerah.",
    defaultCaption: "BESTIE FOREVER",
    defaultSubcaption: "SEOUL VIBES · KILASARA",
    defaultFilter: "soft-korea",
    style: {
      bg: "#fce7f3",
      cardBg: "#ffffff",
      text: "#831843",
      mutedText: "#be185d",
      accent: "#ec4899",
      accentText: "#ffffff",
      borderStyle: "hard",
      borderColor: "#831843",
      shadowColor: "#f472b6",
      fontStyle: "display",
      headerTag: "LIFE 4 CUTS // SWEET",
      footerStamp: "KILASARA STUDIO · SWEET SNAP",
      pattern: "dots",
    },
  },
  {
    id: "kilas-playful-matcha",
    name: "Matcha Cream Club",
    category: "playful",
    layout: "strip-4",
    slots: 4,
    badge: "4-CUTS CERIA",
    description: "Perpaduan warna hijau matcha lembut dan krim untuk foto santai bersama teman.",
    defaultCaption: "MATCHA DAY OUT",
    defaultSubcaption: "GOOD MOOD ONLY · 100%",
    defaultFilter: "soft-korea",
    style: {
      bg: "#dcfce7",
      cardBg: "#ffffff",
      text: "#14532d",
      mutedText: "#166534",
      accent: "#16a34a",
      accentText: "#ffffff",
      borderStyle: "hard",
      borderColor: "#14532d",
      shadowColor: "#14532d",
      fontStyle: "display",
      headerTag: "MATCHA CLUB // #20",
      footerStamp: "KILASARA STUDIO · FRESH CUT",
      pattern: "dots",
    },
  },
  {
    id: "kilas-playful-y2k-pop",
    name: "Y2K Cyber Pop Grid",
    category: "playful",
    layout: "grid-2x2",
    slots: 4,
    badge: "Y2K POP GRID",
    description: "Grid 2x2 warna langit cerah dan kuning pop era tahun 2000an awal.",
    defaultCaption: "SUPER POP 2000!",
    defaultSubcaption: " BINTANG UTAMA HARI INI",
    defaultFilter: "normal",
    style: {
      bg: "#e0f2fe",
      cardBg: "#ffffff",
      text: "#0c4a6e",
      mutedText: "#0369a1",
      accent: "#f97316",
      accentText: "#ffffff",
      borderStyle: "hard",
      borderColor: "#0c4a6e",
      shadowColor: "#0284c7",
      fontStyle: "display",
      headerTag: "Y2K EDITION // POP-21",
      footerStamp: "KILASARA STUDIO · POP STAR",
      pattern: "grid",
    },
  },

  // === 7. SKETCH & BUKU HARIAN ===
  {
    id: "kilas-sketch-diary",
    name: "Jurnal Kertas Sketsa",
    category: "sketch",
    layout: "strip-3",
    slots: 3,
    badge: "BUKU HARIAN",
    description: "Tiga foto seperti ditempel di atas buku catatan bergaris dengan tinta pena hitam.",
    defaultCaption: "CATATAN HARI INI",
    defaultSubcaption: "DITULIS & DIABADIKAN SENDIRI",
    defaultFilter: "warm-film",
    style: {
      bg: "#fef9c3",
      cardBg: "#fffef2",
      text: "#1e293b",
      mutedText: "#475569",
      accent: "#2563eb",
      accentText: "#ffffff",
      borderStyle: "dashed",
      borderColor: "#1e293b",
      fontStyle: "mono",
      headerTag: "NOTEBOOK // HALAMAN 22",
      footerStamp: "KILASARA SKETCHBOOK · ARSIP PRIBADI",
      pattern: "grid",
    },
  },
  {
    id: "kilas-sketch-yearbook",
    name: "Buku Tahunan Kelas",
    category: "sketch",
    layout: "grid-2x2",
    slots: 4,
    badge: "YEARBOOK 2X2",
    description: "Grid 4 foto bergaya album kenangan sekolah dan kampus yang penuh nostalgia.",
    defaultCaption: "CLASS OF KILASARA",
    defaultSubcaption: "KENANGAN MASA MUDA",
    defaultFilter: "warm-film",
    style: {
      bg: "#f5f0e6",
      cardBg: "#ffffff",
      text: "#1f2937",
      mutedText: "#4b5563",
      accent: "#b91c1c",
      accentText: "#ffffff",
      borderStyle: "double",
      borderColor: "#1f2937",
      fontStyle: "display",
      headerTag: "YEARBOOK // ARCHIVE-23",
      footerStamp: "KILASARA STUDIO · CLASS MEMORIES",
      pattern: "corners",
    },
  },
  {
    id: "kilas-sketch-polaroid",
    name: "Polaroid Tempel Selotip",
    category: "sketch",
    layout: "polaroid-1",
    slots: 1,
    badge: "POLAROID KLASIK",
    description: "Satu bingkai foto polaroid lebar dengan ruang tulis tangan di bagian bawah.",
    defaultCaption: "SATU SOROTAN KENANGAN",
    defaultSubcaption: "TERSIMPAN DI KILASARA",
    defaultFilter: "normal",
    style: {
      bg: "#e5e0d8",
      cardBg: "#ffffff",
      text: "#18181b",
      mutedText: "#52525b",
      accent: "#18181b",
      accentText: "#ffffff",
      borderStyle: "thin",
      borderColor: "#18181b",
      fontStyle: "mono",
      headerTag: "INSTANT FILM // NO. 24",
      footerStamp: "KILASARA INSTANT LAB",
      pattern: "dots",
    },
  },
];

export function getPhotoFilterById(id: PhotoFilterId): PhotoFilterConfig {
  return PHOTO_FILTERS.find((f) => f.id === id) ?? PHOTO_FILTERS[0];
}

/**
 * Menghasilkan 4 gambar SVG data URL ilustratif untuk tombol "Isi Foto Contoh"
 * supaya user bisa langsung mencoba tampilan template sebelum memotret.
 */
export const DEMO_SLOT_PHOTOS: string[] = [
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450">
      <rect width="600" height="450" fill="#fb2c36"/>
      <circle cx="300" cy="180" r="85" fill="#fff5ef" stroke="#030303" stroke-width="10"/>
      <circle cx="272" cy="165" r="10" fill="#030303"/>
      <circle cx="328" cy="165" r="10" fill="#030303"/>
      <path d="M268 205 Q300 232 332 205" fill="none" stroke="#030303" stroke-width="10" stroke-linecap="round"/>
      <path d="M170 430 C170 310 430 310 430 430" fill="#fff5ef" stroke="#030303" stroke-width="10"/>
      <rect x="30" y="30" width="140" height="44" fill="#030303"/>
      <text x="100" y="58" fill="#fff5ef" font-family="monospace" font-weight="bold" font-size="22" text-anchor="middle">POSE 01</text>
    </svg>`
  )}`,
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450">
      <rect width="600" height="450" fill="#3a9fa7"/>
      <circle cx="230" cy="190" r="70" fill="#fff5ef" stroke="#030303" stroke-width="10"/>
      <circle cx="375" cy="190" r="70" fill="#facc15" stroke="#030303" stroke-width="10"/>
      <circle cx="212" cy="180" r="8" fill="#030303"/>
      <circle cx="248" cy="180" r="8" fill="#030303"/>
      <path d="M210 212 Q230 228 250 212" fill="none" stroke="#030303" stroke-width="8" stroke-linecap="round"/>
      <circle cx="357" cy="180" r="8" fill="#030303"/>
      <circle cx="393" cy="180" r="8" fill="#030303"/>
      <path d="M355 212 Q375 228 395 212" fill="none" stroke="#030303" stroke-width="8" stroke-linecap="round"/>
      <rect x="30" y="30" width="140" height="44" fill="#030303"/>
      <text x="100" y="58" fill="#fff5ef" font-family="monospace" font-weight="bold" font-size="22" text-anchor="middle">POSE 02</text>
    </svg>`
  )}`,
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450">
      <rect width="600" height="450" fill="#6f98c8"/>
      <rect x="175" y="95" width="250" height="240" rx="20" fill="#fff5ef" stroke="#030303" stroke-width="10"/>
      <circle cx="255" cy="185" r="14" fill="#030303"/>
      <circle cx="345" cy="185" r="14" fill="#030303"/>
      <rect x="250" y="245" width="100" height="16" fill="#fb2c36"/>
      <rect x="30" y="30" width="140" height="44" fill="#030303"/>
      <text x="100" y="58" fill="#fff5ef" font-family="monospace" font-weight="bold" font-size="22" text-anchor="middle">POSE 03</text>
    </svg>`
  )}`,
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450">
      <rect width="600" height="450" fill="#d86a60"/>
      <polygon points="300,75 335,155 422,165 356,222 375,308 300,262 225,308 244,222 178,165 265,155" fill="#facc15" stroke="#030303" stroke-width="10"/>
      <rect x="30" y="30" width="140" height="44" fill="#030303"/>
      <text x="100" y="58" fill="#fff5ef" font-family="monospace" font-weight="bold" font-size="22" text-anchor="middle">POSE 04</text>
    </svg>`
  )}`,
];
