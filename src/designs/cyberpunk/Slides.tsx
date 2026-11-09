/* eslint-disable @next/next/no-img-element -- html-to-image butuh <img> biasa, bukan next/image */
import type { ReactNode } from "react";
import type { SlideProps } from "@/designs/types";
import { hourLabel, listenerType, proxiedImageUrl, RANGE_LABEL } from "@/lib/stats";

// Warna neon solid + glow (bukan teks gradien, karena background-clip:text sering gagal saat diekspor).
const NEON = {
  white: "text-cyberpunk-white [text-shadow:0_0_2cqw_rgb(241_245_249/0.45)]",
  green: "text-cyberpunk-green [text-shadow:0_0_2.5cqw_rgb(74_222_128/0.7)]",
  magenta: "text-cyberpunk-magenta [text-shadow:0_0_2.5cqw_rgb(232_121_249/0.7)]",
  purple: "text-cyberpunk-purple [text-shadow:0_0_2.5cqw_rgb(167_139_250/0.7)]",
  cyan: "text-cyberpunk-cyan [text-shadow:0_0_2.5cqw_rgb(34_211_238/0.7)]",
} as const;
type NeonColor = keyof typeof NEON;
/** Urutan warna neon per baris/item, mengikuti judul di contoh design. */
const NEON_CYCLE: NeonColor[] = ["green", "magenta", "purple", "cyan"];

const GRID =
  "bg-cyberpunk-bg bg-[linear-gradient(var(--color-cyberpunk-grid)_0.2cqw,transparent_0.2cqw),linear-gradient(90deg,var(--color-cyberpunk-grid)_0.2cqw,transparent_0.2cqw)] bg-[length:7cqw_7cqw]";
const GLOW_BORDER = "border-[0.4cqw] border-cyberpunk-green/60 shadow-[0_0_2cqw_rgb(74_222_128/0.25)]";

/** Ukuran font (cqw) yang mengecil untuk teks panjang, supaya judul besar tetap muat. */
function fitFontSize(text: string, max: number, min: number, chars = 8) {
  return `${Math.max(min, Math.min(max, (max * chars) / Math.max(text.length, 1)))}cqw`;
}

const pad2 = (n: number) => String(n).padStart(2, "0");

/** Ubah teks bebas jadi gaya SNAKE_CASE ala HUD. */
const snake = (text: string) => text.toUpperCase().replace(/[^A-Z0-9#]+/g, "_");

/** Label kecil bergaris hijau, seperti "SYSTEM_STATUS: ONLINE". */
function StatusTag({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-block self-start border-[0.35cqw] border-cyberpunk-green/70 px-[2cqw] py-[0.6cqw] font-cyberpunk-mono text-[2.8cqw] uppercase text-cyberpunk-green ${className}`}
    >
      {children}
    </span>
  );
}

/** Panel HUD dengan siku hijau di keempat sudut. */
function HudPanel({ children, className = "", accent = "border-cyberpunk-green" }: { children: ReactNode; className?: string; accent?: string }) {
  const corner = `absolute size-[4cqw] ${accent}`;
  return (
    <div className={`relative bg-cyberpunk-panel/85 ${className}`}>
      <span aria-hidden className={`${corner} -left-[0.4cqw] -top-[0.4cqw] border-l-[0.5cqw] border-t-[0.5cqw]`} />
      <span aria-hidden className={`${corner} -right-[0.4cqw] -top-[0.4cqw] border-r-[0.5cqw] border-t-[0.5cqw]`} />
      <span aria-hidden className={`${corner} -bottom-[0.4cqw] -left-[0.4cqw] border-b-[0.5cqw] border-l-[0.5cqw]`} />
      <span aria-hidden className={`${corner} -bottom-[0.4cqw] -right-[0.4cqw] border-b-[0.5cqw] border-r-[0.5cqw]`} />
      {children}
    </div>
  );
}

function SlideFrame({ props, label, children }: { props: SlideProps; label: string; children: ReactNode }) {
  return (
    <div className={`flex h-full w-full flex-col font-cyberpunk-display text-cyberpunk-text ${GRID}`}>
      <header className="flex items-center justify-between px-[6cqw] pt-[5.5cqw]">
        <StatusTag>Wraped_OS: online</StatusTag>
        <span className="font-cyberpunk-mono text-[2.8cqw] text-cyberpunk-green/80">
          {snake(label)} [{pad2(props.n)}/{pad2(props.total)}]
        </span>
      </header>
      <div className="relative flex min-h-0 flex-1 flex-col px-[6cqw] py-[5cqw]">{children}</div>
      <footer className="mx-[6cqw] flex justify-between border-t-[0.3cqw] border-cyberpunk-green/30 py-[3cqw] font-cyberpunk-mono text-[2.8cqw] uppercase text-cyberpunk-dim">
        <span>&gt; {RANGE_LABEL[props.range]}</span>
        <span>Spotify_stats</span>
      </footer>
    </div>
  );
}

/** Foto dalam panel HUD; tanpa foto jadi panel kosong bertulisan "NO_SIGNAL". */
function CoverImage({ src, className = "", small = false }: { src: string | null; className?: string; small?: boolean }) {
  const url = proxiedImageUrl(src);
  return (
    <HudPanel className={`p-[1.2cqw] ${className}`}>
      {url ? (
        <img src={url} alt="" crossOrigin="anonymous" className="block h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center border-[0.3cqw] border-cyberpunk-green/25 font-cyberpunk-mono text-[2.8cqw] text-cyberpunk-green/50">
          {!small && "NO_SIGNAL"}
        </div>
      )}
    </HudPanel>
  );
}

/** Paragraf gaya terminal: diawali "> ", diakhiri kursor. */
function Terminal({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`border-l-[0.4cqw] border-cyberpunk-green/50 pl-[3cqw] font-cyberpunk-mono text-[3.6cqw] leading-relaxed text-cyberpunk-text ${className}`}>
      &gt; {children} <span className="text-cyberpunk-green">_</span>
    </p>
  );
}

function Title({ children, color = "white", className = "", fontSize }: { children: ReactNode; color?: NeonColor; className?: string; fontSize?: string }) {
  return (
    <h2 className={`font-bold uppercase leading-[0.95] tracking-tight ${NEON[color]} ${className}`} style={fontSize ? { fontSize } : undefined}>
      {children}
    </h2>
  );
}

function IntroSlide(props: SlideProps) {
  return (
    <SlideFrame props={props} label="intro">
      <StatusTag>User: {props.name}</StatusTag>
      <h1 className="mt-auto text-[18cqw] font-bold uppercase leading-[0.92] tracking-tight">
        <span className={`block ${NEON.white}`}>Ini</span>
        <span className={`block ${NEON.green}`}>musik</span>
        <span className={`block ${NEON.magenta}`}>kamu</span>
        <span className={`block ${NEON.cyan}`}>{props.year}</span>
      </h1>
      <Terminal className="mt-[5cqw]">Rangkuman {RANGE_LABEL[props.range]} dari Spotify kamu, di-decode langsung di browser.</Terminal>
      <div className="mt-[6cqw] flex gap-[3cqw] font-cyberpunk-mono text-[3cqw] uppercase">
        <span className={`px-[3.5cqw] py-[2cqw] text-cyberpunk-green ${GLOW_BORDER}`}>Mulai scan →</span>
        <span className="border-[0.4cqw] border-cyberpunk-dim/60 px-[3.5cqw] py-[2cqw] text-cyberpunk-white">Lihat log</span>
      </div>
    </SlideFrame>
  );
}

function TopArtistSlide(props: SlideProps) {
  const artist = props.stats.topArtists[0];
  if (!artist) return <EmptySlide {...props} />;
  return (
    <SlideFrame props={props} label="artis 01">
      <span className="font-cyberpunk-mono text-[3cqw] text-cyberpunk-magenta">TARGET_LOCKED // RANK_01</span>
      <CoverImage src={artist.image} className="mt-[4cqw] aspect-square w-[72cqw] self-center" />
      <Title color="green" className="mt-auto break-words" fontSize={fitFontSize(artist.name, 13, 7, 9)}>
        {artist.name}
      </Title>
      <Terminal className="mt-[3cqw]">Artis paling sering kamu putar.</Terminal>
    </SlideFrame>
  );
}

function RankedList({ items }: { items: { id: string; title: string; subtitle?: string; image?: string | null }[] }) {
  return (
    <HudPanel className="mt-auto px-[3.5cqw] py-[2cqw]">
      <ol>
        {items.map((item, i) => (
          <li key={item.id} className={`flex items-center gap-[3cqw] py-[2cqw] ${i ? "border-t-[0.3cqw] border-cyberpunk-green/15" : ""}`}>
            <span className={`w-[9cqw] shrink-0 font-cyberpunk-mono text-[3.6cqw] font-bold ${NEON[NEON_CYCLE[i % 4]]}`}>[{pad2(i + 1)}]</span>
            {item.image !== undefined && <CoverImage src={item.image} small className="aspect-square w-[11cqw] shrink-0 p-[0.6cqw]" />}
            <span className="min-w-0">
              <span className="line-clamp-1 block text-[5.2cqw] font-bold uppercase leading-tight text-cyberpunk-white">{item.title}</span>
              {item.subtitle && <span className="line-clamp-1 block font-cyberpunk-mono text-[3cqw] text-cyberpunk-dim">{item.subtitle}</span>}
            </span>
          </li>
        ))}
      </ol>
    </HudPanel>
  );
}

function TopArtistsSlide(props: SlideProps) {
  return (
    <SlideFrame props={props} label="top artis">
      <StatusTag>Query: top_artists</StatusTag>
      <Title className="mt-[4cqw] text-[14cqw]">
        Top <span className={NEON.magenta}>5</span>
        <br />
        <span className={NEON.green}>artis</span>
      </Title>
      <RankedList items={props.stats.topArtists.map((a) => ({ id: a.id, title: a.name, image: a.image }))} />
    </SlideFrame>
  );
}

function TopTrackSlide(props: SlideProps) {
  const track = props.stats.topTracks[0];
  if (!track) return <EmptySlide {...props} />;
  return (
    <SlideFrame props={props} label="lagu 01">
      <span className="flex items-center gap-[2cqw] font-cyberpunk-mono text-[3cqw] text-cyberpunk-magenta">
        <span className="size-[2cqw] rounded-full bg-cyberpunk-magenta shadow-[0_0_2cqw_var(--color-cyberpunk-magenta)]" />
        NOW_PLAYING // LOOP
      </span>
      <CoverImage src={track.album.image} className="mt-[4cqw] aspect-square w-[68cqw] self-center" />
      <div className="mt-auto">
        <Title color="magenta" className="line-clamp-3 break-words" fontSize={fitFontSize(track.name, 12, 6.5, 10)}>
          {track.name}
        </Title>
        <p className="mt-[2cqw] line-clamp-1 font-cyberpunk-mono text-[3.4cqw] uppercase text-cyberpunk-text">{track.artists.join(" / ")}</p>
      </div>
    </SlideFrame>
  );
}

function TopTracksSlide(props: SlideProps) {
  return (
    <SlideFrame props={props} label="top lagu">
      <StatusTag>Query: top_tracks</StatusTag>
      <Title className="mt-[4cqw] text-[14cqw]">
        Top <span className={NEON.magenta}>5</span>
        <br />
        <span className={NEON.cyan}>lagu</span>
      </Title>
      <RankedList items={props.stats.topTracks.map((t) => ({ id: t.id, title: t.name, subtitle: t.artists.join(" / ") }))} />
      <p className="mt-[3cqw] font-cyberpunk-mono text-[2.8cqw] text-cyberpunk-dim">{"// berdasarkan jumlah putar"}</p>
    </SlideFrame>
  );
}

function TopAlbumSlide(props: SlideProps) {
  const top = props.stats.topAlbum;
  if (!top) return <EmptySlide {...props} />;
  return (
    <SlideFrame props={props} label="album">
      <span className="font-cyberpunk-mono text-[3cqw] text-cyberpunk-purple">ARCHIVE // MOST_PLAYED_ALBUM</span>
      <CoverImage src={top.album.image} className="mt-[4cqw] aspect-square w-[62cqw] self-center" />
      <div className="mt-auto grid grid-cols-[1fr_auto] items-end gap-[4cqw]">
        <div className="min-w-0">
          <Title color="purple" className="line-clamp-3 break-words" fontSize={fitFontSize(top.album.name, 11, 6, 11)}>
            {top.album.name}
          </Title>
          <p className="mt-[1.5cqw] line-clamp-1 font-cyberpunk-mono text-[3.4cqw] uppercase">{top.artist}</p>
        </div>
        <HudPanel accent="border-cyberpunk-magenta" className="px-[4cqw] py-[3cqw] text-center">
          <span className={`block text-[10cqw] font-bold leading-none ${NEON.magenta}`}>
            {top.count}/{props.stats.trackCount}
          </span>
          <span className="font-cyberpunk-mono text-[2.6cqw] text-cyberpunk-magenta/80">TRACK_LOAD</span>
        </HudPanel>
      </div>
    </SlideFrame>
  );
}

function ListeningClockSlide(props: SlideProps) {
  const { hours, peakHour, recentCount, recentMinutes } = props.stats;
  const max = Math.max(1, ...hours);
  return (
    <SlideFrame props={props} label="jam dengar">
      <StatusTag>Profile: listener_type</StatusTag>
      <Title color="cyan" className="mt-[4cqw] text-[13cqw]">
        {listenerType(peakHour)}
      </Title>
      {peakHour !== null && (
        <p className="mt-[3cqw] font-cyberpunk-mono text-[3.8cqw]">
          PEAK_HOUR: <span className={`font-bold ${NEON.magenta}`}>{hourLabel(peakHour)}</span>
        </p>
      )}
      <HudPanel className="mt-auto p-[3.5cqw]">
        <div className="flex h-[34cqw] items-end gap-[0.6cqw] border-b-[0.3cqw] border-cyberpunk-green/40">
          {hours.map((count, hour) => (
            <div
              key={hour}
              className={`flex-1 ${hour === peakHour ? "bg-cyberpunk-magenta shadow-[0_0_2cqw_var(--color-cyberpunk-magenta)]" : "bg-cyberpunk-green/70"}`}
              style={{ height: `${Math.max(2, (count / max) * 100)}%` }}
            />
          ))}
        </div>
        <div className="mt-[1.5cqw] flex justify-between font-cyberpunk-mono text-[2.8cqw] text-cyberpunk-dim">
          <span>00</span>
          <span>06</span>
          <span>12</span>
          <span>18</span>
          <span>23</span>
        </div>
      </HudPanel>
      <p className="mt-[3.5cqw] font-cyberpunk-mono text-[3cqw] text-cyberpunk-dim">
        {"// "}dari {recentCount} lagu terakhir · {recentMinutes} menit
      </p>
    </SlideFrame>
  );
}

function NumbersSlide(props: SlideProps) {
  const s = props.stats;
  // Selalu 4 panel supaya grid 2x2 penuh; rentang 1 tahun tidak punya angka "favorit lama".
  const stats: { value: string; label: string }[] = [
    props.range !== "long_term"
      ? { value: `${s.loyalCount}/${s.loyalTotal}`, label: "TOP10_LOYAL" }
      : { value: String(s.trackCount), label: "TRACKS_SCANNED" },
    { value: String(s.uniqueArtistsInTop), label: "UNIQUE_ARTISTS" },
    { value: String(s.recentMinutes), label: "MINUTES_LOGGED" },
    { value: s.peakHour === null ? "--" : hourLabel(s.peakHour), label: "PEAK_HOUR" },
  ];

  return (
    <SlideFrame props={props} label="angka">
      <StatusTag>HUD_display_v_0.9</StatusTag>
      <Title className="mt-[4cqw] text-[14cqw]">
        Dalam
        <br />
        <span className={NEON.green}>angka</span>
      </Title>
      <div className="mt-auto grid grid-cols-2 gap-[4cqw]">
        {stats.map((stat, i) => (
          <HudPanel key={stat.label} className="px-[4cqw] py-[4.5cqw]">
            <span className={`block text-[10cqw] font-bold leading-none ${NEON[NEON_CYCLE[i]]}`}>{stat.value}</span>
            <span className="mt-[2cqw] block font-cyberpunk-mono text-[2.8cqw] text-cyberpunk-dim">{stat.label}</span>
          </HudPanel>
        ))}
      </div>
      {s.topGenres.length > 0 && (
        <p className="mt-[4cqw] font-cyberpunk-mono text-[3cqw] uppercase">
          GENRE: <span className="text-cyberpunk-green">{s.topGenres.slice(0, 3).join(" / ")}</span>
        </p>
      )}
    </SlideFrame>
  );
}

function SummarySlide(props: SlideProps) {
  const s = props.stats;
  return (
    <SlideFrame props={props} label="ringkasan">
      <div className="flex items-center gap-[4cqw]">
        <CoverImage src={s.topArtists[0]?.image ?? null} className="aspect-square w-[24cqw] shrink-0" />
        <div className="min-w-0">
          <StatusTag>Wrapped_complete</StatusTag>
          <p className={`mt-[2cqw] break-words font-bold uppercase leading-none ${NEON.white}`} style={{ fontSize: fitFontSize(props.name, 8, 5, 8) }}>
            {props.name}
          </p>
        </div>
      </div>

      <p className={`mt-auto text-[28cqw] font-bold leading-[0.9] tracking-tight ${NEON.green}`}>{props.year}</p>

      <HudPanel className="mt-[4cqw] grid grid-cols-2">
        {[
          { title: "TOP_ARTIS", items: s.topArtists.map((a) => a.name), color: NEON.magenta },
          { title: "TOP_LAGU", items: s.topTracks.map((t) => t.name), color: NEON.cyan },
        ].map((column, ci) => (
          <div key={column.title} className={`min-w-0 px-[3cqw] py-[2.5cqw] ${ci ? "border-l-[0.3cqw] border-cyberpunk-green/25" : ""}`}>
            <p className={`font-cyberpunk-mono text-[3cqw] font-bold ${column.color}`}>{column.title}</p>
            <ol className="mt-[1.5cqw] space-y-[0.8cqw]">
              {column.items.map((name, i) => (
                <li key={i} className="flex gap-[1.5cqw] text-[3.8cqw] leading-tight text-cyberpunk-white">
                  <span className="font-cyberpunk-mono text-cyberpunk-dim">{i + 1}</span>
                  <span className="line-clamp-1">{name}</span>
                </li>
              ))}
            </ol>
          </div>
        ))}
        <div className="border-t-[0.3cqw] border-cyberpunk-green/25 px-[3cqw] py-[2cqw]">
          <p className="font-cyberpunk-mono text-[2.6cqw] text-cyberpunk-dim">ALBUM</p>
          <p className={`line-clamp-2 text-[4.2cqw] font-bold uppercase leading-tight ${NEON.purple}`}>{s.topAlbum?.album.name ?? "--"}</p>
        </div>
        <div className="border-l-[0.3cqw] border-t-[0.3cqw] border-cyberpunk-green/25 px-[3cqw] py-[2cqw]">
          <p className="font-cyberpunk-mono text-[2.6cqw] text-cyberpunk-dim">PROFILE</p>
          <p className={`line-clamp-2 text-[4.2cqw] font-bold uppercase leading-tight ${NEON.green}`}>{listenerType(s.peakHour)}</p>
        </div>
      </HudPanel>
    </SlideFrame>
  );
}

function EmptySlide(props: SlideProps) {
  return (
    <SlideFrame props={props} label="error">
      <StatusTag className="border-cyberpunk-magenta/70 text-cyberpunk-magenta">System_status: no_data</StatusTag>
      <Title color="magenta" className="mt-auto text-[13cqw]">
        Error_404
      </Title>
      <Title className="mt-[2cqw] text-[8cqw]">Belum cukup data</Title>
      <Terminal className="mt-[4cqw]">Dengerin lebih banyak dulu, atau ganti rentang waktunya.</Terminal>
    </SlideFrame>
  );
}

/** Urutan slide yang ditampilkan. */
export const SLIDES = [
  IntroSlide,
  TopArtistSlide,
  TopArtistsSlide,
  TopTrackSlide,
  TopTracksSlide,
  TopAlbumSlide,
  ListeningClockSlide,
  NumbersSlide,
  SummarySlide,
];
