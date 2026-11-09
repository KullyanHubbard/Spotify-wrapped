/* eslint-disable @next/next/no-img-element -- html-to-image butuh <img> biasa, bukan next/image */
import type { ReactNode } from "react";
import type { SlideProps } from "@/designs/types";
import { hourLabel, listenerType, proxiedImageUrl, RANGE_LABEL } from "@/lib/stats";

// Border 3D ala Windows 95: terang di kiri-atas, gelap di kanan-bawah (timbul), atau kebalikannya (cekung).
const RAISED = "border-[0.7cqw] border-t-retro-white border-l-retro-white border-b-retro-shade border-r-retro-shade";
const SUNKEN = "border-[0.7cqw] border-t-retro-shade border-l-retro-shade border-b-retro-white border-r-retro-white";
// Garis pemisah "groove": gelap di atas, terang di bawah.
const GROOVE = "h-[0.9cqw] border-t-[0.45cqw] border-b-[0.45cqw] border-t-retro-shade border-b-retro-white";
const YELLOW_TITLE =
  "font-retro-display uppercase text-retro-yellow [text-shadow:0.5cqw_0.5cqw_0_var(--color-retro-black),-0.2cqw_-0.2cqw_0_var(--color-retro-shade)]";

/** Ukuran font (cqw) yang mengecil untuk teks panjang, supaya judul besar tetap muat. */
function fitFontSize(text: string, max: number, min: number, chars = 8) {
  return `${Math.max(min, Math.min(max, (max * chars) / Math.max(text.length, 1)))}cqw`;
}

const pad3 = (n: number) => String(n).padStart(3, "0");

function RainbowRule({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`h-[1cqw] bg-[linear-gradient(90deg,#ff0000,#ff9900,#ffff00,#00cc00,#0099ff,#6633ff,#ff00ff)] ${className}`}
    />
  );
}

/** Papan LCD hitam bertulisan hijau, seperti counter pengunjung. */
function Lcd({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`inline-block bg-retro-black px-[2.5cqw] py-[0.6cqw] font-retro-lcd text-retro-lcd ${SUNKEN} ${className}`}>
      {children}
    </span>
  );
}

function SlideFrame({ props, label, children }: { props: SlideProps; label: string; children: ReactNode }) {
  return (
    <div className="flex h-full w-full flex-col bg-retro-gray font-retro-body text-retro-black">
      <div className="mx-auto h-[1.4cqw] w-[14cqw] bg-retro-red" />
      <header className="flex items-center justify-between px-[5cqw] pb-[3cqw] pt-[3cqw]">
        <span className={`${YELLOW_TITLE} text-[6cqw] leading-none`}>Wrapped</span>
        <Lcd className="text-[4.4cqw] leading-none">
          {label} | {pad3(props.n)}/{pad3(props.total)}
        </Lcd>
      </header>
      <div className={GROOVE} />
      <div className="relative flex min-h-0 flex-1 flex-col px-[5cqw] py-[4.5cqw]">{children}</div>
      <div className={GROOVE} />
      <footer className="flex justify-between px-[5cqw] py-[2.6cqw] font-retro-mono text-[3.2cqw] uppercase">
        <span>{RANGE_LABEL[props.range]}</span>
        <span>Best viewed in 9:16</span>
      </footer>
    </div>
  );
}

/** Foto dalam bingkai cekung; tanpa foto jadi panel abu (bertulisan "no image" kalau cukup besar). */
function CoverImage({ src, className = "", small = false }: { src: string | null; className?: string; small?: boolean }) {
  const url = proxiedImageUrl(src);
  return (
    <div className={`bg-retro-white p-[1cqw] ${SUNKEN} ${className}`}>
      {url ? (
        <img src={url} alt="" crossOrigin="anonymous" className="block h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-retro-panel font-retro-mono text-[3cqw] uppercase text-retro-shade">
          {!small && "[no image]"}
        </div>
      )}
    </div>
  );
}

function GreenButton({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-block bg-retro-button px-[4cqw] py-[2cqw] font-retro-body text-[3.8cqw] font-bold uppercase text-retro-white ${RAISED} ${className}`}
    >
      &gt;&gt;&gt; {children} &lt;&lt;&lt;
    </span>
  );
}

function Title({ children, className = "", fontSize }: { children: ReactNode; className?: string; fontSize?: string }) {
  return (
    <h2 className={`${YELLOW_TITLE} leading-[0.95] ${className}`} style={fontSize ? { fontSize } : undefined}>
      {children}
    </h2>
  );
}

/** Kartu statistik putih/abu dengan angka navy, label Courier, keterangan hijau. */
function StatCard({ value, label, note, shaded = false }: { value: string; label: string; note?: string; shaded?: boolean }) {
  return (
    <div className={`flex flex-col items-center justify-center px-[2cqw] py-[3cqw] text-center ${RAISED} ${shaded ? "bg-retro-panel" : "bg-retro-white"}`}>
      <span className="font-retro-body text-[9cqw] font-bold leading-none text-retro-navy">{value}</span>
      <span className="mt-[1.2cqw] font-retro-mono text-[2.8cqw] uppercase leading-tight">{label}</span>
      {note && <span className="mt-[0.8cqw] text-[2.6cqw] text-retro-green">{note}</span>}
    </div>
  );
}

function IntroSlide(props: SlideProps) {
  return (
    <SlideFrame props={props} label="intro">
      <p className="text-center font-retro-mono text-[3.6cqw] uppercase">*** Selamat datang, {props.name} ***</p>
      <h1 className={`${YELLOW_TITLE} mt-auto text-center text-[15cqw] leading-[0.95]`}>
        Ini musik
        <br />
        kamu
      </h1>
      <RainbowRule className="mx-auto mt-[4cqw] w-[30cqw]" />
      <p className="mx-auto mt-[4cqw] max-w-[72cqw] text-center text-[4.2cqw] leading-snug">
        Rangkuman {RANGE_LABEL[props.range]} dari Spotify kamu, disusun langsung di browser.
      </p>
      <div className="mt-[6cqw] flex justify-center gap-[3cqw]">
        <GreenButton>Putar</GreenButton>
        <span className={`inline-block bg-retro-white px-[4cqw] py-[2cqw] text-[3.8cqw] font-bold uppercase ${RAISED}`}>Info</span>
      </div>
      <div className="mt-auto flex justify-center pt-[6cqw]">
        <Lcd className="text-[5cqw]">Edisi: {props.year} | Since 1995</Lcd>
      </div>
    </SlideFrame>
  );
}

function TopArtistSlide(props: SlideProps) {
  const artist = props.stats.topArtists[0];
  if (!artist) return <EmptySlide {...props} />;
  return (
    <SlideFrame props={props} label="artis #1">
      <p className="text-center font-retro-mono text-[3.6cqw] uppercase">Paling sering kamu putar</p>
      <div className={`mx-auto mt-[4cqw] w-[68cqw] bg-retro-gray p-[1.5cqw] ${RAISED}`}>
        <CoverImage src={artist.image} className="aspect-square w-full" />
      </div>
      <Title className="mt-auto break-words text-center" fontSize={fitFontSize(artist.name, 13, 7, 9)}>
        {artist.name}
      </Title>
      <RainbowRule className="mx-auto mt-[3cqw] w-[30cqw]" />
      <div className="mt-[4cqw] flex justify-center">
        <Lcd className="text-[5cqw]">Peringkat: #001</Lcd>
      </div>
    </SlideFrame>
  );
}

function TopArtistsSlide(props: SlideProps) {
  return (
    <SlideFrame props={props} label="top artis">
      <Title className="text-center text-[13cqw]">Top 5 artis</Title>
      <RainbowRule className="mx-auto mt-[3cqw] w-[30cqw]" />
      <ol className={`mt-auto bg-retro-white ${SUNKEN}`}>
        {props.stats.topArtists.map((artist, i) => (
          <li
            key={artist.id}
            className={`flex items-center gap-[3cqw] px-[3cqw] py-[2cqw] ${i % 2 ? "bg-retro-panel" : "bg-retro-white"}`}
          >
            <span className="w-[9cqw] font-retro-mono text-[4.4cqw] font-bold text-retro-navy">{pad3(i + 1)}</span>
            <CoverImage src={artist.image} small className="aspect-square w-[12cqw] shrink-0 p-[0.5cqw]" />
            <span className="line-clamp-1 text-[5.4cqw] font-bold">{artist.name}</span>
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
      <p className="text-center font-retro-mono text-[3.6cqw] uppercase">Diputar terus-terusan</p>
      <div className={`mx-auto mt-[4cqw] w-[64cqw] bg-retro-gray p-[1.5cqw] ${RAISED}`}>
        <CoverImage src={track.album.image} className="aspect-square w-full" />
      </div>
      <div className="mt-auto text-center">
        <Title className="line-clamp-3 break-words" fontSize={fitFontSize(track.name, 12, 6.5, 10)}>
          {track.name}
        </Title>
        <p className="mt-[2.5cqw] line-clamp-1 font-retro-mono text-[4cqw] uppercase">{track.artists.join(" / ")}</p>
      </div>
      <div className="mt-[4cqw] flex justify-center">
        <GreenButton>Now playing</GreenButton>
      </div>
    </SlideFrame>
  );
}

function TopTracksSlide(props: SlideProps) {
  return (
    <SlideFrame props={props} label="top lagu">
      <Title className="text-center text-[13cqw]">Top 5 lagu</Title>
      <RainbowRule className="mx-auto mt-[3cqw] w-[30cqw]" />
      <ol className={`mt-auto bg-retro-white ${SUNKEN}`}>
        {props.stats.topTracks.map((track, i) => (
          <li
            key={track.id}
            className={`grid grid-cols-[10cqw_1fr] items-baseline px-[3cqw] py-[2cqw] ${i % 2 ? "bg-retro-panel" : "bg-retro-white"}`}
          >
            <span className="font-retro-mono text-[4.4cqw] font-bold text-retro-navy">{pad3(i + 1)}</span>
            <span className="min-w-0">
              <span className="line-clamp-1 block text-[5.2cqw] font-bold leading-tight">{track.name}</span>
              <span className="line-clamp-1 block text-[3.4cqw] text-retro-green">{track.artists.join(" / ")}</span>
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-[3cqw] font-retro-mono text-[3cqw] uppercase">* berdasarkan jumlah putar</p>
    </SlideFrame>
  );
}

function TopAlbumSlide(props: SlideProps) {
  const top = props.stats.topAlbum;
  if (!top) return <EmptySlide {...props} />;
  return (
    <SlideFrame props={props} label="album">
      <p className="text-center font-retro-mono text-[3.6cqw] uppercase">Album yang paling nempel</p>
      <div className={`mx-auto mt-[4cqw] w-[60cqw] bg-retro-gray p-[1.5cqw] ${RAISED}`}>
        <CoverImage src={top.album.image} className="aspect-square w-full" />
      </div>
      <div className="mt-auto text-center">
        <Title className="line-clamp-3 break-words" fontSize={fitFontSize(top.album.name, 11, 6, 11)}>
          {top.album.name}
        </Title>
        <p className="mt-[2cqw] line-clamp-1 font-retro-mono text-[4cqw] uppercase">{top.artist}</p>
      </div>
      <div className="mx-auto mt-[4cqw] w-[44cqw]">
        <StatCard value={`${top.count}/${props.stats.trackCount}`} label="lagu di top kamu" note="dari album ini" />
      </div>
    </SlideFrame>
  );
}

function ListeningClockSlide(props: SlideProps) {
  const { hours, peakHour, recentCount, recentMinutes } = props.stats;
  const max = Math.max(1, ...hours);
  return (
    <SlideFrame props={props} label="jam dengar">
      <p className="text-center font-retro-mono text-[3.6cqw] uppercase">Kamu itu tipe</p>
      <Title className="mt-[2cqw] text-center text-[11cqw]">{listenerType(peakHour)}</Title>
      <RainbowRule className="mx-auto mt-[3cqw] w-[30cqw]" />
      {peakHour !== null && (
        <div className="mt-[4cqw] flex justify-center">
          <Lcd className="text-[5.5cqw]">Puncak: {hourLabel(peakHour)}</Lcd>
        </div>
      )}
      <div className={`mt-auto bg-retro-white p-[2.5cqw] ${SUNKEN}`}>
        <div className="flex h-[36cqw] items-end gap-[0.5cqw] border-b-[0.5cqw] border-retro-black">
          {hours.map((count, hour) => (
            <div
              key={hour}
              className={`flex-1 ${hour === peakHour ? "bg-retro-red" : "bg-retro-navy"}`}
              style={{ height: `${Math.max(2, (count / max) * 100)}%` }}
            />
          ))}
        </div>
        <div className="mt-[1.2cqw] flex justify-between font-retro-mono text-[3cqw]">
          <span>00</span>
          <span>06</span>
          <span>12</span>
          <span>18</span>
          <span>23</span>
        </div>
      </div>
      <p className="mt-[3cqw] text-center font-retro-mono text-[3.2cqw] uppercase">
        Dari {recentCount} lagu terakhir · {recentMinutes} menit
      </p>
    </SlideFrame>
  );
}

function NumbersSlide(props: SlideProps) {
  const s = props.stats;
  // Selalu 4 kartu supaya grid 2x2 penuh; rentang 1 tahun tidak punya angka "favorit lama".
  const cards: { value: string; label: string; note: string }[] = [
    props.range !== "long_term"
      ? { value: `${s.loyalCount}/${s.loyalTotal}`, label: "lagu top 10", note: "juga favorit lama" }
      : { value: String(s.trackCount), label: "lagu teratas", note: "yang dianalisis" },
    { value: String(s.uniqueArtistsInTop), label: "artis berbeda", note: `di top ${s.trackCount} lagu` },
    { value: String(s.recentMinutes), label: "menit dengar", note: `dari ${s.recentCount} lagu terakhir` },
    { value: s.peakHour === null ? "-" : hourLabel(s.peakHour), label: "jam puncak", note: "paling sering dengar" },
  ];

  return (
    <SlideFrame props={props} label="angka">
      <Title className="text-center text-[13cqw]">Dalam angka</Title>
      <RainbowRule className="mx-auto mt-[3cqw] w-[30cqw]" />
      <div className="mt-auto grid grid-cols-2">
        {cards.map((card, i) => (
          <StatCard key={i} {...card} shaded={i === 1 || i === 2} />
        ))}
      </div>
      {s.topGenres.length > 0 && (
        <p className="mt-[4cqw] text-center font-retro-mono text-[3.4cqw] uppercase">
          Genre: <span className="font-bold text-retro-navy">{s.topGenres.slice(0, 3).join(" / ")}</span>
        </p>
      )}
      <div className="mt-[4cqw] flex justify-center">
        <Lcd className="text-[4.6cqw]">Visitors: 000001 | Kamu</Lcd>
      </div>
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
          <p className="font-retro-mono text-[3.4cqw] uppercase">Wrapped milik</p>
          <p className="break-words font-retro-display uppercase leading-none" style={{ fontSize: fitFontSize(props.name, 8, 5, 8) }}>
            {props.name}
          </p>
        </div>
      </div>

      <p className={`${YELLOW_TITLE} mt-auto text-center text-[26cqw] leading-none`}>{props.year}</p>
      <RainbowRule className="mx-auto mt-[2cqw] w-[40cqw]" />

      <div className={`mt-[5cqw] grid grid-cols-2 bg-retro-white ${SUNKEN}`}>
        {[
          { title: "Top artis", items: s.topArtists.map((a) => a.name) },
          { title: "Top lagu", items: s.topTracks.map((t) => t.name) },
        ].map((column, ci) => (
          <div key={column.title} className={`min-w-0 ${ci ? "border-l-[0.5cqw] border-retro-shade" : ""}`}>
            <p className="bg-retro-navy px-[2.5cqw] py-[1cqw] font-retro-mono text-[3cqw] font-bold uppercase text-retro-white">
              {column.title}
            </p>
            <ol className="space-y-[0.8cqw] px-[2.5cqw] py-[2cqw]">
              {column.items.map((name, i) => (
                <li key={i} className="flex gap-[1.5cqw] text-[3.6cqw] leading-tight">
                  <span className="font-retro-mono text-retro-navy">{i + 1}.</span>
                  <span className="line-clamp-1">{name}</span>
                </li>
              ))}
            </ol>
          </div>
        ))}
        <div className="border-t-[0.5cqw] border-retro-shade bg-retro-panel px-[2.5cqw] py-[1.8cqw]">
          <p className="font-retro-mono text-[2.8cqw] uppercase">Album</p>
          <p className="line-clamp-2 text-[3.8cqw] font-bold leading-tight text-retro-navy">{s.topAlbum?.album.name ?? "-"}</p>
        </div>
        <div className="border-l-[0.5cqw] border-t-[0.5cqw] border-retro-shade bg-retro-panel px-[2.5cqw] py-[1.8cqw]">
          <p className="font-retro-mono text-[2.8cqw] uppercase">Tipe</p>
          <p className="line-clamp-2 text-[3.8cqw] font-bold leading-tight text-retro-green">{listenerType(s.peakHour)}</p>
        </div>
      </div>
    </SlideFrame>
  );
}

function EmptySlide(props: SlideProps) {
  return (
    <SlideFrame props={props} label="error">
      <div className={`mx-auto mt-auto w-full bg-retro-gray ${RAISED}`}>
        <p className="bg-retro-navy px-[3cqw] py-[1.5cqw] font-retro-mono text-[3.4cqw] font-bold text-retro-white">wrapped.exe</p>
        <div className="px-[4cqw] py-[5cqw] text-center">
          <p className="font-retro-display text-[7cqw] uppercase leading-tight">Belum cukup data</p>
          <p className="mt-[3cqw] text-[4cqw]">Dengerin lebih banyak dulu, atau ganti rentang waktunya.</p>
          <span className={`mt-[5cqw] inline-block bg-retro-gray px-[8cqw] py-[1.5cqw] text-[4cqw] font-bold ${RAISED}`}>OK</span>
        </div>
      </div>
      <div className="mt-auto" />
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
