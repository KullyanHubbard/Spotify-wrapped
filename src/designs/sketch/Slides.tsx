/* eslint-disable @next/next/no-img-element -- html-to-image butuh <img> biasa, bukan next/image */
import type { ReactNode } from "react";
import type { SlideProps } from "@/designs/types";
import { hourLabel, listenerType, proxiedImageUrl, RANGE_LABEL } from "@/lib/stats";

// Sudut tidak rata supaya garis terlihat digambar tangan.
const WOBBLY = "rounded-[1.5cqw_6cqw_2cqw_5cqw/5cqw_2cqw_6cqw_1.5cqw]";
const BOX = `border-[0.6cqw] border-sketch-ink ${WOBBLY}`;
const SHADOW = "shadow-[1.4cqw_1.4cqw_0_var(--color-sketch-ink)]";
const CIRCLE = "rounded-[52%_48%_50%_46%/48%_52%_46%_50%] border-[0.6cqw] border-sketch-ink";
const DOTTED_PAPER =
  "bg-sketch-paper bg-[radial-gradient(circle,var(--color-sketch-dot)_0.25cqw,transparent_0.3cqw)] bg-[length:4.5cqw_4.5cqw]";

/** Ukuran font (cqw) yang mengecil untuk teks panjang, supaya judul besar tetap muat. */
function fitFontSize(text: string, max: number, min: number, chars = 8) {
  return `${Math.max(min, Math.min(max, (max * chars) / Math.max(text.length, 1)))}cqw`;
}

const rangeText = (props: SlideProps) => (props.stats.source === "file" ? String(props.year) : RANGE_LABEL[props.range]);

function SlideFrame({ props, label, children }: { props: SlideProps; label: string; children: ReactNode }) {
  return (
    <div className={`flex h-full w-full flex-col font-sketch-hand text-sketch-ink ${DOTTED_PAPER}`}>
      <header className="flex items-center justify-between px-[6cqw] pt-[5cqw]">
        <span className="font-sketch-display text-[5.5cqw] font-bold">
          wrapped<span className="text-sketch-red">.</span>
        </span>
        <span className="text-[4cqw] text-sketch-faint">{label}</span>
        <span className={`${CIRCLE} flex size-[11cqw] items-center justify-center text-[3.6cqw]`}>
          {props.n}/{props.total}
        </span>
      </header>
      <div className="relative flex min-h-0 flex-1 flex-col px-[6cqw] py-[4cqw]">{children}</div>
      <footer className="mx-[6cqw] flex justify-between border-t-[0.5cqw] border-dashed border-sketch-ink/40 py-[3cqw] text-[3.6cqw] text-sketch-faint">
        <span>{rangeText(props)}</span>
        <span>spotify stats</span>
      </footer>
    </div>
  );
}

/** Foto dalam bingkai sketsa; tanpa foto jadi kotak abu bergaris putus-putus. */
function CoverImage({ src, className = "" }: { src: string | null; className?: string }) {
  const url = proxiedImageUrl(src);
  return (
    <div className={`bg-sketch-paper p-[1.4cqw] ${BOX} ${className}`}>
      {url ? (
        <img src={url} alt="" crossOrigin="anonymous" className={`block h-full w-full object-cover ${WOBBLY}`} />
      ) : (
        <div className={`h-full w-full border-[0.4cqw] border-dashed border-sketch-ink/35 bg-sketch-gray ${WOBBLY}`} />
      )}
    </div>
  );
}

/** Stiker lingkaran merah, seperti titik merah di contoh design. */
function RedDot({ children, className = "" }: { children?: ReactNode; className?: string }) {
  return (
    <span
      className={`absolute flex items-center justify-center rounded-full border-[0.6cqw] border-sketch-ink bg-sketch-red font-sketch-display font-bold text-sketch-paper ${className}`}
    >
      {children}
    </span>
  );
}

function Squiggle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 8" preserveAspectRatio="none" aria-hidden className={className}>
      <path d="M1 5 Q 12 1, 25 5 T 50 5 T 75 5 T 99 4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

function DoodleArrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 60" aria-hidden className={className}>
      <path d="M6 6 C 20 20, 16 40, 46 48" fill="none" stroke="currentColor" strokeWidth="2.2" strokeDasharray="4 4" strokeLinecap="round" />
      <path d="M35 51 L47 48 L41 37" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Note({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`inline-block self-start px-[3cqw] py-[1.2cqw] text-[4.2cqw] ${BOX} bg-sketch-paper ${className}`}>{children}</span>;
}

function Heading({ children, className = "", fontSize }: { children: ReactNode; className?: string; fontSize?: string }) {
  return (
    <h2 className={`font-sketch-display font-bold leading-[0.95] ${className}`} style={fontSize ? { fontSize } : undefined}>
      {children}
    </h2>
  );
}

function IntroSlide(props: SlideProps) {
  return (
    <SlideFrame props={props} label="intro">
      <Note className="-rotate-2">untuk {props.name}</Note>
      <h1 className="mt-auto font-sketch-display text-[19cqw] font-bold leading-[0.9]">
        Ini musik
        <br />
        kamu<span className="text-sketch-red">!</span>
      </h1>
      <p className="mt-[4cqw] max-w-[70cqw] text-[5cqw] leading-snug">
        Rangkuman {rangeText(props)}, digambar khusus buat kamu.
      </p>
      <div className="mt-[6cqw] flex items-end justify-between">
        <span className={`${BOX} ${SHADOW} bg-sketch-paper px-[5cqw] py-[2.5cqw] font-sketch-display text-[5cqw] font-bold`}>
          Mulai lihat
        </span>
        <DoodleArrow className="w-[16cqw] -scale-x-100" />
        <span className={`${CIRCLE} flex size-[22cqw] -rotate-6 items-center justify-center font-sketch-display text-[6cqw] font-bold`}>
          {props.year}
        </span>
      </div>
    </SlideFrame>
  );
}

function TopArtistSlide(props: SlideProps) {
  const artist = props.stats.topArtists[0];
  if (!artist) return <EmptySlide {...props} />;
  return (
    <SlideFrame props={props} label="artis #1">
      <Note className="rotate-1">paling sering kamu putar</Note>
      <div className="relative mx-auto mt-[6cqw] w-[70cqw]">
        <CoverImage src={artist.image} className={`aspect-square w-full -rotate-2 ${SHADOW}`} />
        <RedDot className="-bottom-[5cqw] -right-[5cqw] size-[20cqw] text-[8cqw]">01</RedDot>
      </div>
      <Heading className="mt-auto break-words" fontSize={fitFontSize(artist.name, 14, 7, 9)}>
          {artist.name}
        </Heading>
      <Squiggle className="mt-[1cqw] h-[3cqw] w-[45cqw] text-sketch-red" />
    </SlideFrame>
  );
}

function TopArtistsSlide(props: SlideProps) {
  return (
    <SlideFrame props={props} label="top artis">
      <Heading className="text-[15cqw]">Top 5 artis</Heading>
      <Squiggle className="h-[3cqw] w-[55cqw] text-sketch-red" />
      <ol className="mt-auto">
        {props.stats.topArtists.map((artist, i) => (
          <li key={artist.id} className="flex items-center gap-[3.5cqw] border-b-[0.5cqw] border-dashed border-sketch-ink/40 py-[2.4cqw]">
            <span className={`${CIRCLE} flex size-[9cqw] shrink-0 items-center justify-center font-sketch-display text-[4.4cqw] font-bold`}>
              {i + 1}
            </span>
            <CoverImage src={artist.image} className="aspect-square w-[13cqw] shrink-0 p-[0.8cqw]" />
            <span className="line-clamp-1 font-sketch-display text-[6cqw] font-bold">{artist.name}</span>
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
      <Note className="-rotate-1">diputar terus-terusan</Note>
      <div className="relative mx-auto mt-[6cqw] w-[66cqw]">
        <CoverImage src={track.album.image} className={`aspect-square w-full rotate-2 ${SHADOW}`} />
        <RedDot className="-left-[5cqw] -top-[5cqw] size-[16cqw] text-[7cqw]">♪</RedDot>
      </div>
      <div className="mt-auto">
        <Heading className="line-clamp-3 break-words" fontSize={fitFontSize(track.name, 13, 7, 10)}>
          {track.name}
        </Heading>
        <p className="mt-[2cqw] line-clamp-1 text-[4.8cqw]">{track.artists.join(", ")}</p>
      </div>
    </SlideFrame>
  );
}

function TopTracksSlide(props: SlideProps) {
  return (
    <SlideFrame props={props} label="top lagu">
      <Heading className="text-[15cqw]">
        Top 5 lagu<span className="text-sketch-red">*</span>
      </Heading>
      <Squiggle className="h-[3cqw] w-[55cqw] text-sketch-red" />
      <ol className="mt-auto">
        {props.stats.topTracks.map((track, i) => (
          <li key={track.id} className="grid grid-cols-[9cqw_1fr] items-baseline border-b-[0.5cqw] border-dashed border-sketch-ink/40 py-[2.4cqw]">
            <span className="font-sketch-display text-[6cqw] font-bold text-sketch-red">{i + 1}.</span>
            <span className="min-w-0">
              <span className="line-clamp-1 block font-sketch-display text-[5.6cqw] font-bold leading-tight">{track.name}</span>
              <span className="line-clamp-1 block text-[4cqw] text-sketch-faint">{track.artists.join(", ")}</span>
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-[3cqw] text-[3.6cqw] text-sketch-faint">* berdasarkan jumlah putar</p>
    </SlideFrame>
  );
}

function TopAlbumSlide(props: SlideProps) {
  const top = props.stats.topAlbum;
  if (!top) return <EmptySlide {...props} />;
  return (
    <SlideFrame props={props} label="album">
      <Note className="rotate-1">album yang paling nempel</Note>
      <CoverImage src={top.album.image} className={`mx-auto mt-[6cqw] aspect-square w-[62cqw] -rotate-1 ${SHADOW}`} />
      <div className="mt-auto grid grid-cols-[1fr_auto] items-end gap-[4cqw]">
        <div className="min-w-0">
          <Heading className="line-clamp-3 break-words" fontSize={fitFontSize(top.album.name, 11, 6.5, 11)}>
          {top.album.name}
        </Heading>
          <p className="mt-[1.5cqw] line-clamp-1 text-[4.6cqw]">{top.artist}</p>
        </div>
        <div className={`${CIRCLE} flex size-[26cqw] rotate-3 flex-col items-center justify-center`}>
          <span className="font-sketch-display text-[9cqw] font-bold leading-none">{top.count}</span>
          <span className="text-[3.4cqw]">{props.stats.source === "file" ? "putar" : `/${props.stats.trackCount} lagu`}</span>
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
      <Note className="-rotate-2">kamu itu tipe...</Note>
      <Heading className="mt-[4cqw] text-[13cqw]">{listenerType(peakHour)}</Heading>
      {peakHour !== null && (
        <p className="mt-[3cqw] text-[5cqw]">
          puncaknya jam{" "}
          <span className="relative inline-block font-sketch-display font-bold">
            {hourLabel(peakHour)}
            <Squiggle className="absolute -bottom-[1.5cqw] left-0 h-[2.5cqw] w-full text-sketch-red" />
          </span>
        </p>
      )}
      <div className="mt-auto">
        <div className="flex h-[40cqw] items-end gap-[0.7cqw] border-b-[0.6cqw] border-sketch-ink">
          {hours.map((count, hour) => (
            <div
              key={hour}
              className={`flex-1 rounded-t-[1cqw] border-[0.4cqw] border-b-0 border-sketch-ink ${hour === peakHour ? "bg-sketch-red" : "bg-sketch-paper"}`}
              style={{ height: `${Math.max(3, (count / max) * 100)}%` }}
            />
          ))}
        </div>
        <div className="mt-[1.5cqw] flex justify-between text-[3.6cqw]">
          <span>00</span>
          <span>06</span>
          <span>12</span>
          <span>18</span>
          <span>23</span>
        </div>
        <p className="mt-[3cqw] text-[3.8cqw] text-sketch-faint">
          {source === "file"
            ? `dari ${recentCount} putar sepanjang ${props.year} · ${recentMinutes} menit`
            : `dari ${recentCount} lagu terakhir · ${recentMinutes} menit`}
        </p>
      </div>
    </SlideFrame>
  );
}

function NumbersSlide(props: SlideProps) {
  const s = props.stats;
  const isFile = s.source === "file";
  const stats: { value: string; label: string }[] = [];
  if (isFile ? s.loyalTotal > 0 : props.range !== "long_term") {
    stats.push({ value: `${s.loyalCount}/${s.loyalTotal}`, label: "lagu top 10 kamu juga favorit jangka panjang" });
  }
  stats.push({
    value: String(s.uniqueArtistsInTop),
    label: isFile ? `artis berbeda sepanjang ${props.year}` : `artis berbeda di top ${s.trackCount} lagu`,
  });
  stats.push({
    value: String(s.recentMinutes),
    label: isFile ? `menit dari ${s.recentCount} putar sepanjang ${props.year}` : `menit dari ${s.recentCount} lagu terakhir`,
  });

  return (
    <SlideFrame props={props} label="angka">
      <Heading className="text-[15cqw]">Dalam angka</Heading>
      <Squiggle className="h-[3cqw] w-[55cqw] text-sketch-red" />
      <ul className="mt-auto flex flex-col gap-[5cqw]">
        {stats.map((stat, i) => (
          <li key={i} className="grid grid-cols-[30cqw_1fr] items-center gap-[4cqw]">
            <span
              className={`${CIRCLE} flex aspect-square w-full items-center justify-center font-sketch-display text-[8cqw] font-bold ${i % 2 ? "rotate-3" : "-rotate-3"} ${i === 0 ? "bg-sketch-red text-sketch-paper" : "bg-sketch-paper"}`}
            >
              {stat.value}
            </span>
            <span className="text-[5cqw] leading-snug">{stat.label}</span>
          </li>
        ))}
      </ul>
      {s.topGenres.length > 0 && (
        <p className="mt-[5cqw] text-[4cqw]">
          genre: <span className="font-sketch-display font-bold">{s.topGenres.slice(0, 3).join(", ")}</span>
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
        <CoverImage src={s.topArtists[0]?.image ?? null} className={`aspect-square w-[26cqw] shrink-0 -rotate-3 ${SHADOW}`} />
        <div className="min-w-0">
          <Note className="rotate-1">wrapped</Note>
          <p className="mt-[2cqw] break-words font-sketch-display font-bold leading-none" style={{ fontSize: fitFontSize(props.name, 9, 5.5, 8) }}>
            {props.name}
          </p>
        </div>
      </div>

      <p className="relative mt-auto self-start font-sketch-display text-[28cqw] font-bold leading-[0.85]">
        {props.year}
        <span className="text-sketch-red">!</span>
      </p>

      <div className={`mt-[4cqw] grid grid-cols-2 bg-sketch-paper ${BOX} ${SHADOW}`}>
        {[
          { title: "top artis", items: s.topArtists.map((a) => a.name) },
          { title: "top lagu", items: s.topTracks.map((t) => t.name) },
        ].map((column, ci) => (
          <div key={column.title} className={`min-w-0 px-[3cqw] py-[2.5cqw] ${ci ? "border-l-[0.5cqw] border-dashed border-sketch-ink/40" : ""}`}>
            <p className="font-sketch-display text-[4.4cqw] font-bold text-sketch-red">{column.title}</p>
            <ol className="mt-[1cqw] space-y-[0.8cqw]">
              {column.items.map((name, i) => (
                <li key={i} className="flex gap-[1.5cqw] text-[4cqw] leading-tight">
                  <span className="text-sketch-faint">{i + 1}.</span>
                  <span className="line-clamp-1">{name}</span>
                </li>
              ))}
            </ol>
          </div>
        ))}
        <div className="border-t-[0.5cqw] border-dashed border-sketch-ink/40 px-[3cqw] py-[2cqw]">
          <p className="text-[3.4cqw] text-sketch-faint">album</p>
          <p className="line-clamp-2 font-sketch-display text-[4.4cqw] font-bold leading-tight">{s.topAlbum?.album.name ?? "-"}</p>
        </div>
        <div className="border-l-[0.5cqw] border-t-[0.5cqw] border-dashed border-sketch-ink/40 px-[3cqw] py-[2cqw]">
          <p className="text-[3.4cqw] text-sketch-faint">tipe</p>
          <p className="line-clamp-2 font-sketch-display text-[4.4cqw] font-bold leading-tight">{listenerType(s.peakHour)}</p>
        </div>
      </div>
    </SlideFrame>
  );
}

function EmptySlide(props: SlideProps) {
  return (
    <SlideFrame props={props} label="kosong">
      <div className={`mx-auto mt-[10cqw] aspect-square w-[50cqw] border-[0.6cqw] border-dashed border-sketch-ink/50 bg-sketch-gray ${WOBBLY}`} />
      <Heading className="mt-auto text-[12cqw]">
        Belum cukup data<span className="text-sketch-red">!</span>
      </Heading>
      <p className="mt-[3cqw] text-[5cqw]">Dengerin lebih banyak dulu, atau ganti rentang waktunya.</p>
    </SlideFrame>
  );
}

export function TotalMinutesSlide(props: SlideProps) {
  const h = props.stats.history;
  if (!h) return <EmptySlide {...props} />;

  return (
    <SlideFrame props={props} label="total menit">
      <Note className="-rotate-1">riwayat dengar {props.year}</Note>
      <div className="mt-[3cqw]">
        <Heading className="text-[13cqw]">Total menit asli</Heading>
        <Squiggle className="h-[2.5cqw] w-[50cqw] text-sketch-red" />
      </div>

      <div className="my-auto flex flex-col items-center">
        <div className={`${CIRCLE} ${SHADOW} flex flex-col items-center justify-center bg-sketch-yellow p-[6cqw] text-center`}>
          <span className="font-sketch-display text-[16cqw] font-bold leading-none text-sketch-ink">
            {h.totalMinutes.toLocaleString("id-ID")}
          </span>
          <span className="font-sketch-hand text-[5.5cqw] uppercase tracking-wider text-sketch-ink">menit</span>
        </div>
      </div>

      <div className="mt-auto space-y-[3cqw]">
        {h.topTrack && (
          <div className={`bg-sketch-paper p-[3.5cqw] ${BOX} ${SHADOW}`}>
            <p className="text-[3.5cqw] text-sketch-faint">lagu paling sering diputar</p>
            <p className="line-clamp-1 font-sketch-display text-[4.8cqw] font-bold">{h.topTrack.name}</p>
            <p className="line-clamp-1 text-[3.8cqw]">{h.topTrack.artist} ({h.topTrack.plays} kali)</p>
          </div>
        )}
        {h.busiestDay && (
          <div className={`bg-sketch-paper p-[3.5cqw] ${BOX} ${SHADOW}`}>
            <p className="text-[3.5cqw] text-sketch-faint">hari paling sibuk</p>
            <p className="font-sketch-display text-[4.8cqw] font-bold">{h.busiestDay.date}</p>
            <p className="text-[3.8cqw]">{h.busiestDay.minutes.toLocaleString("id-ID")} menit</p>
          </div>
        )}
      </div>

      <p className="mt-[3cqw] text-[3.4cqw] text-sketch-faint">data sampai {h.lastDate}</p>
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
