/* eslint-disable @next/next/no-img-element -- html-to-image butuh <img> biasa, bukan next/image */
import type { ReactNode } from "react";
import type { SlideProps } from "@/designs/types";
import { hourLabel, listenerType, proxiedImageUrl, RANGE_LABEL } from "@/lib/stats";

const OUTLINE = "border-[0.6cqw] border-playful-ink";
// Bayangan berlapis pink lalu lavender, seperti foto di contoh design.
const STACKED_SHADOW = "shadow-[2.2cqw_2.2cqw_0_var(--color-playful-pink),4.4cqw_4.4cqw_0_var(--color-playful-lavender)]";
const HARD_SHADOW = "shadow-[1.2cqw_1.2cqw_0_var(--color-playful-ink)]";
/** Warna kartu statistik bergiliran: ungu, kuning, pink, mint. */
const PILL_COLORS = [
  "bg-playful-purple text-white",
  "bg-playful-yellow text-playful-ink",
  "bg-playful-pink text-playful-ink",
  "bg-playful-mint text-playful-ink",
];

/** Ukuran font (cqw) yang mengecil untuk teks panjang, supaya judul besar tetap muat. */
function fitFontSize(text: string, max: number, min: number, chars = 8) {
  return `${Math.max(min, Math.min(max, (max * chars) / Math.max(text.length, 1)))}cqw`;
}

const pad2 = (n: number) => String(n).padStart(2, "0");
const rangeText = (props: SlideProps) => (props.stats.source === "file" ? String(props.year) : RANGE_LABEL[props.range]);

/** Hiasan geometri di latar. `quiet` untuk slide berisi daftar, supaya hiasan tidak mengintip di sela baris. */
function Shapes({ quiet = false }: { quiet?: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <span className="absolute -left-[12cqw] top-[38%] size-[40cqw] rounded-full bg-playful-lime/60" />
      <span className="absolute -right-[6cqw] top-[14%] size-[16cqw] rotate-12 rounded-[3cqw] border-[0.6cqw] border-playful-yellow" />
      {!quiet && (
        <>
          <svg viewBox="0 0 40 36" className="absolute bottom-[16%] right-[8cqw] w-[13cqw] -rotate-12 text-playful-pink">
            <path d="M20 3 L37 33 L3 33 Z" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
          </svg>
          <span className="absolute right-[24cqw] top-[30%] size-[4cqw] rounded-full bg-playful-purple" />
        </>
      )}
    </div>
  );
}

function SlideFrame({
  props,
  label,
  dark = false,
  quietShapes = false,
  children,
}: {
  props: SlideProps;
  label: string;
  dark?: boolean;
  quietShapes?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-full w-full flex-col font-playful-display ${dark ? "bg-playful-ink text-playful-cream" : "bg-playful-cream text-playful-ink"}`}
    >
      {!dark && <Shapes quiet={quietShapes} />}
      <header className="relative flex items-center justify-between px-[6cqw] pt-[5cqw]">
        <span className="text-[5.5cqw] font-extrabold tracking-tight">
          wrapped<span className="text-playful-purple">.</span>
        </span>
        <span className="text-[3.6cqw] font-medium opacity-70">{label}</span>
        <span className="rounded-full bg-playful-purple px-[3cqw] py-[1cqw] text-[3.4cqw] font-bold text-white">
          {pad2(props.n)} / {pad2(props.total)}
        </span>
      </header>
      <div className="relative flex min-h-0 flex-1 flex-col px-[6cqw] py-[5cqw]">{children}</div>
      <footer className="relative flex items-center justify-between px-[6cqw] pb-[5cqw] text-[3.4cqw] font-semibold">
        <span className={`rounded-full border-[0.5cqw] px-[3cqw] py-[0.8cqw] ${dark ? "border-playful-cream" : "border-playful-ink"}`}>
          {rangeText(props)}
        </span>
        <span className="opacity-70">spotify stats</span>
      </footer>
    </div>
  );
}

/** Label kuning miring bergaris tepi, seperti banner di contoh design. */
function Banner({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-block self-start -rotate-2 bg-playful-yellow px-[3cqw] py-[1.5cqw] text-[3.4cqw] font-bold uppercase leading-tight text-playful-ink ${OUTLINE} ${className}`}
    >
      {children}
    </span>
  );
}

/** Foto bersudut bulat dengan bayangan berlapis; tanpa foto jadi kotak lavender. */
function CoverImage({ src, className = "", shadow = STACKED_SHADOW }: { src: string | null; className?: string; shadow?: string }) {
  const url = proxiedImageUrl(src);
  const shape = `overflow-hidden rounded-[5cqw] ${OUTLINE} ${shadow} ${className}`;
  return url ? (
    <img src={url} alt="" crossOrigin="anonymous" className={`block object-cover ${shape}`} />
  ) : (
    <div className={`bg-playful-lavender ${shape}`} />
  );
}

/** Tombol pil ungu dengan lingkaran panah, hanya hiasan. */
function PillButton({ children }: { children: ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-[2.5cqw] self-start rounded-full bg-playful-purple py-[1.6cqw] pl-[4.5cqw] pr-[1.6cqw] text-[3.8cqw] font-bold text-white ${OUTLINE} ${HARD_SHADOW}`}>
      {children}
      <span className="flex size-[6.5cqw] items-center justify-center rounded-full bg-white text-[3.6cqw] text-playful-purple">→</span>
    </span>
  );
}

function Title({ children, className = "", fontSize }: { children: ReactNode; className?: string; fontSize?: string }) {
  return (
    <h2 className={`font-extrabold leading-[1.02] tracking-[-0.02em] ${className}`} style={fontSize ? { fontSize } : undefined}>
      {children}
    </h2>
  );
}

function IntroSlide(props: SlideProps) {
  return (
    <SlideFrame props={props} label="intro">
      <Banner>Rangkuman {rangeText(props)} khusus buat {props.name}</Banner>
      <h1 className="mt-auto text-[16cqw] font-extrabold leading-[1] tracking-[-0.03em]">
        Ini musik
        <br />
        kamu<span className="text-playful-purple">.</span>
      </h1>
      <p className="mt-[4cqw] max-w-[72cqw] text-[4.4cqw] leading-snug text-playful-muted">
        Artis, lagu, album, dan jam dengar favorit kamu, dirangkum jadi satu cerita.
      </p>
      <div className="mt-[6cqw] flex items-center gap-[3cqw]">
        <PillButton>Mulai</PillButton>
        <span className={`rounded-full px-[4cqw] py-[1.8cqw] text-[3.8cqw] font-bold ${OUTLINE}`}>▶ {props.year}</span>
      </div>
    </SlideFrame>
  );
}

function TopArtistSlide(props: SlideProps) {
  const artist = props.stats.topArtists[0];
  if (!artist) return <EmptySlide {...props} />;
  return (
    <SlideFrame props={props} label="artis #1">
      <Banner>Paling sering kamu putar</Banner>
      <div className="relative mt-[6cqw] w-[66cqw]">
        <CoverImage src={artist.image} className="aspect-square w-full" />
        <span className={`absolute -right-[8cqw] -top-[4cqw] flex size-[18cqw] rotate-12 items-center justify-center rounded-full bg-playful-yellow text-[7cqw] font-extrabold ${OUTLINE}`}>
          #1
        </span>
      </div>
      <Title className="mt-auto break-words" fontSize={fitFontSize(artist.name, 13, 7, 9)}>
        {artist.name}
      </Title>
    </SlideFrame>
  );
}

function TopArtistsSlide(props: SlideProps) {
  return (
    <SlideFrame props={props} label="top artis" quietShapes>
      <Banner>Top 5 artis</Banner>
      <Title className="mt-[3cqw] text-[12cqw]">Yang paling sering nemenin</Title>
      <ol className="mt-auto flex flex-col gap-[2.4cqw]">
        {props.stats.topArtists.map((artist, i) => (
          <li key={artist.id} className={`flex items-center gap-[3cqw] rounded-full bg-white py-[1.4cqw] pl-[1.4cqw] pr-[4cqw] ${OUTLINE}`}>
            <span className={`flex size-[10cqw] shrink-0 items-center justify-center rounded-full text-[4.4cqw] font-extrabold ${PILL_COLORS[i % 4]}`}>
              {i + 1}
            </span>
            <span className="line-clamp-1 flex-1 text-[5.4cqw] font-bold">{artist.name}</span>
            <CoverImage src={artist.image} shadow="" className="aspect-square w-[10cqw] shrink-0 rounded-full border-[0.4cqw]" />
          </li>
        ))}
      </ol>
    </SlideFrame>
  );
}

function TopTrackSlide(props: SlideProps) {
  const track = props.stats.topTracks[0];
  if (!track) return <EmptySlide {...props} />;
  return (
    <SlideFrame props={props} label="lagu #1">
      <Banner>Diputar terus-terusan</Banner>
      <CoverImage src={track.album.image} className="mt-[6cqw] aspect-square w-[64cqw] self-end -rotate-2" />
      <div className="mt-auto">
        <Title className="line-clamp-3 break-words" fontSize={fitFontSize(track.name, 12, 6.5, 10)}>
          {track.name}
        </Title>
        <p className="mt-[2cqw] line-clamp-1 text-[4.4cqw] text-playful-muted">{track.artists.join(", ")}</p>
        <div className="mt-[4cqw]">
          <PillButton>Putar lagi</PillButton>
        </div>
      </div>
    </SlideFrame>
  );
}

function TopTracksSlide(props: SlideProps) {
  return (
    <SlideFrame props={props} label="top lagu" quietShapes>
      <Banner>Top 5 lagu</Banner>
      <Title className="mt-[3cqw] text-[12cqw]">Nggak bosen-bosen</Title>
      <ol className="mt-auto flex flex-col gap-[2.4cqw]">
        {props.stats.topTracks.map((track, i) => (
          <li key={track.id} className={`flex items-center gap-[3cqw] rounded-[4cqw] bg-white px-[3cqw] py-[2cqw] ${OUTLINE}`}>
            <span className={`flex size-[9cqw] shrink-0 items-center justify-center rounded-[2.5cqw] text-[4.4cqw] font-extrabold ${PILL_COLORS[i % 4]}`}>
              {i + 1}
            </span>
            <span className="min-w-0">
              <span className="line-clamp-1 block text-[5cqw] font-bold leading-tight">{track.name}</span>
              <span className="line-clamp-1 block text-[3.4cqw] text-playful-muted">{track.artists.join(", ")}</span>
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-[3cqw] text-[3cqw] text-playful-muted">* berdasarkan jumlah putar</p>
    </SlideFrame>
  );
}

function TopAlbumSlide(props: SlideProps) {
  const top = props.stats.topAlbum;
  if (!top) return <EmptySlide {...props} />;
  return (
    <SlideFrame props={props} label="album">
      <Banner>Album yang paling nempel</Banner>
      <CoverImage src={top.album.image} className="mx-auto mt-[6cqw] aspect-square w-[60cqw] rotate-2" />
      <div className="mt-auto grid grid-cols-[1fr_auto] items-end gap-[4cqw]">
        <div className="min-w-0">
          <Title className="line-clamp-3 break-words" fontSize={fitFontSize(top.album.name, 11, 6, 11)}>
            {top.album.name}
          </Title>
          <p className="mt-[1.5cqw] line-clamp-1 text-[4.2cqw] text-playful-muted">{top.artist}</p>
        </div>
        <div className={`flex flex-col items-center rounded-[5cqw] bg-playful-mint px-[4cqw] py-[3cqw] ${OUTLINE} ${HARD_SHADOW}`}>
          <span className="text-[10cqw] font-extrabold leading-none">{top.count}</span>
          <span className="text-[3cqw] font-semibold">{props.stats.source === "file" ? "putar" : `/${props.stats.trackCount} lagu`}</span>
        </div>
      </div>
    </SlideFrame>
  );
}

function ListeningClockSlide(props: SlideProps) {
  const { hours, peakHour, recentCount, recentMinutes, source } = props.stats;
  const max = Math.max(1, ...hours);
  return (
    <SlideFrame props={props} label="jam dengar">
      <Banner>Kamu itu tipe</Banner>
      <Title className="mt-[3cqw] text-[13cqw]">{listenerType(peakHour)}</Title>
      {peakHour !== null && (
        <p className="mt-[3cqw] text-[4.6cqw]">
          Puncaknya jam{" "}
          <span className="rounded-full bg-playful-purple px-[2.5cqw] py-[0.5cqw] font-bold text-white">{hourLabel(peakHour)}</span>
        </p>
      )}
      <div className={`mt-auto rounded-[5cqw] bg-white p-[3.5cqw] ${OUTLINE} ${HARD_SHADOW}`}>
        <div className="flex h-[34cqw] items-end gap-[0.7cqw]">
          {hours.map((count, hour) => (
            <div
              key={hour}
              className={`flex-1 rounded-full ${hour === peakHour ? "bg-playful-pink" : "bg-playful-lavender"}`}
              style={{ height: `${Math.max(4, (count / max) * 100)}%` }}
            />
          ))}
        </div>
        <div className="mt-[1.5cqw] flex justify-between text-[3cqw] font-semibold text-playful-muted">
          <span>00</span>
          <span>06</span>
          <span>12</span>
          <span>18</span>
          <span>23</span>
        </div>
      </div>
      <p className="mt-[3.5cqw] text-[3.4cqw] text-playful-muted">
        {source === "file"
          ? `Dari ${recentCount} putar sepanjang ${props.year} · ${recentMinutes} menit`
          : `Dari ${recentCount} lagu terakhir · ${recentMinutes} menit`}
      </p>
    </SlideFrame>
  );
}

function NumbersSlide(props: SlideProps) {
  const s = props.stats;
  const isFile = s.source === "file";
  // Selalu 4 kartu (ungu, kuning, pink, mint); rentang 1 tahun tidak punya angka "favorit lama".
  const stats: { value: string; label: string }[] = [
    isFile
      ? s.loyalTotal > 0
        ? { value: `${s.loyalCount}/${s.loyalTotal}`, label: "lagu top 10 juga favorit lama" }
        : { value: String(s.trackCount), label: `lagu berbeda sepanjang ${props.year}` }
      : props.range !== "long_term"
        ? { value: `${s.loyalCount}/${s.loyalTotal}`, label: "lagu top 10 juga favorit lama" }
        : { value: String(s.trackCount), label: "lagu teratas yang dianalisis" },
    {
      value: String(s.uniqueArtistsInTop),
      label: isFile ? `artis berbeda sepanjang ${props.year}` : `artis berbeda di top ${s.trackCount} lagu`,
    },
    {
      value: String(s.recentMinutes),
      label: isFile ? `menit dari ${s.recentCount} putar sepanjang ${props.year}` : `menit dari ${s.recentCount} lagu terakhir`,
    },
    { value: s.peakHour === null ? "-" : hourLabel(s.peakHour), label: "jam paling sering dengar" },
  ];

  return (
    <SlideFrame props={props} label="angka" dark>
      <span className="inline-block self-start -rotate-2 bg-playful-yellow px-[3cqw] py-[1.5cqw] text-[3.4cqw] font-bold uppercase text-playful-ink">
        Dalam angka
      </span>
      <Title className="mt-[3cqw] text-[12cqw]">Kebiasaan dengar kamu</Title>
      <div className="mt-auto grid grid-cols-2 gap-[3.5cqw]">
        {stats.map((stat, i) => (
          <div key={i} className={`flex flex-col justify-between gap-[2cqw] rounded-[6cqw] px-[4cqw] py-[4cqw] ${PILL_COLORS[i]}`}>
            <span className="text-[10cqw] font-extrabold leading-none">{stat.value}</span>
            <span className="text-[3.4cqw] font-semibold leading-snug">{stat.label}</span>
          </div>
        ))}
      </div>
      {s.topGenres.length > 0 && (
        <p className="mt-[4cqw] text-[3.6cqw]">
          Genre: <span className="font-bold text-playful-yellow">{s.topGenres.slice(0, 3).join(", ")}</span>
        </p>
      )}
    </SlideFrame>
  );
}

function SummarySlide(props: SlideProps) {
  const s = props.stats;
  return (
    <SlideFrame props={props} label="ringkasan" quietShapes>
      <div className="flex items-center gap-[5cqw]">
        <CoverImage src={s.topArtists[0]?.image ?? null} className="aspect-square w-[26cqw] shrink-0 -rotate-3" />
        <div className="min-w-0">
          <Banner>Wrapped</Banner>
          <p className="mt-[2.5cqw] break-words font-extrabold leading-none" style={{ fontSize: fitFontSize(props.name, 9, 5.5, 8) }}>
            {props.name}
          </p>
        </div>
      </div>

      <p className="mt-auto text-[28cqw] font-extrabold leading-[0.9] tracking-[-0.04em]">
        {props.year}
        <span className="text-playful-pink">.</span>
      </p>

      <div className={`mt-[4cqw] grid grid-cols-2 overflow-hidden rounded-[5cqw] bg-white ${OUTLINE} ${HARD_SHADOW}`}>
        {[
          { title: "Top artis", items: s.topArtists.map((a) => a.name), color: "bg-playful-purple text-white" },
          { title: "Top lagu", items: s.topTracks.map((t) => t.name), color: "bg-playful-pink text-playful-ink" },
        ].map((column, ci) => (
          <div key={column.title} className={`min-w-0 ${ci ? "border-l-[0.5cqw] border-playful-ink" : ""}`}>
            <p className={`px-[3cqw] py-[1.4cqw] text-[3.4cqw] font-bold ${column.color}`}>{column.title}</p>
            <ol className="space-y-[0.8cqw] px-[3cqw] py-[2cqw]">
              {column.items.map((name, i) => (
                <li key={i} className="flex gap-[1.5cqw] text-[3.8cqw] leading-tight">
                  <span className="font-bold text-playful-purple">{i + 1}</span>
                  <span className="line-clamp-1">{name}</span>
                </li>
              ))}
            </ol>
          </div>
        ))}
        <div className="border-t-[0.5cqw] border-playful-ink bg-playful-yellow px-[3cqw] py-[2cqw]">
          <p className="text-[3cqw] font-semibold">Album</p>
          <p className="line-clamp-2 text-[4.2cqw] font-extrabold leading-tight">{s.topAlbum?.album.name ?? "-"}</p>
        </div>
        <div className="border-l-[0.5cqw] border-t-[0.5cqw] border-playful-ink bg-playful-mint px-[3cqw] py-[2cqw]">
          <p className="text-[3cqw] font-semibold">Tipe</p>
          <p className="line-clamp-2 text-[4.2cqw] font-extrabold leading-tight">{listenerType(s.peakHour)}</p>
        </div>
      </div>
    </SlideFrame>
  );
}

function EmptySlide(props: SlideProps) {
  return (
    <SlideFrame props={props} label="kosong">
      <div className="mx-auto mt-[8cqw] flex gap-[4cqw]">
        <span className={`size-[16cqw] rounded-full bg-playful-purple ${OUTLINE}`} />
        <span className={`size-[16cqw] rotate-12 rounded-[3cqw] bg-playful-yellow ${OUTLINE}`} />
        <span className={`size-[16cqw] rounded-full bg-playful-pink ${OUTLINE}`} />
      </div>
      <Title className="mt-auto text-[12cqw]">Belum cukup data.</Title>
      <p className="mt-[3cqw] text-[4.4cqw] text-playful-muted">Dengerin lebih banyak dulu, atau ganti rentang waktunya.</p>
    </SlideFrame>
  );
}

export function TotalMinutesSlide(props: SlideProps) {
  const h = props.stats.history;
  if (!h) return <EmptySlide {...props} />;

  return (
    <SlideFrame props={props} label="menit">
      <Banner>Riwayat {props.year}</Banner>
      <Title className="mt-[3cqw] text-[12cqw]">Total Menit Asli</Title>

      <div className={`mt-[4cqw] flex flex-col items-center justify-center rounded-[8cqw] bg-playful-yellow p-[6cqw] ${OUTLINE} ${HARD_SHADOW} text-center text-playful-ink`}>
        <span className="text-[17cqw] font-extrabold leading-none">
          {h.totalMinutes.toLocaleString("id-ID")}
        </span>
        <span className="mt-[1cqw] text-[5cqw] font-bold uppercase tracking-wider">Menit Dengar</span>
      </div>

      <div className="mt-auto space-y-[3cqw]">
        {h.topTrack && (
          <div className={`rounded-[6cqw] bg-playful-mint p-[4cqw] ${OUTLINE} text-playful-ink`}>
            <p className="text-[3.2cqw] font-semibold text-playful-ink/75">Lagu paling sering diputar</p>
            <p className="line-clamp-1 text-[4.8cqw] font-extrabold leading-tight">{h.topTrack.name}</p>
            <p className="line-clamp-1 text-[3.6cqw]">{h.topTrack.artist} ({h.topTrack.plays} kali)</p>
          </div>
        )}
        {h.busiestDay && (
          <div className={`rounded-[6cqw] bg-playful-pink p-[4cqw] ${OUTLINE} text-playful-ink`}>
            <p className="text-[3.2cqw] font-semibold text-playful-ink/75">Hari paling sibuk</p>
            <p className="text-[4.8cqw] font-extrabold leading-tight">{h.busiestDay.date}</p>
            <p className="text-[3.6cqw]">{h.busiestDay.minutes.toLocaleString("id-ID")} menit</p>
          </div>
        )}
      </div>

      <p className="mt-[3cqw] text-[3.2cqw] text-playful-muted">
        data sampai {h.lastDate}
      </p>
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
