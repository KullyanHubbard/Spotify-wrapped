/* eslint-disable @next/next/no-img-element -- html-to-image butuh <img> biasa, bukan next/image */
import type { ReactNode } from "react";
import type { SlideProps } from "@/designs/types";
import { hourLabel, listenerType, proxiedImageUrl, RANGE_LABEL } from "@/lib/stats";

const HAIRLINE = "border-luxury-line";
const LABEL = "font-luxury-body text-[2.6cqw] font-medium uppercase tracking-[0.35em]";
const ROMAN = ["I", "II", "III", "IV", "V"];

/** Ukuran font (cqw) yang mengecil untuk teks panjang, supaya judul besar tetap muat. */
function fitFontSize(text: string, max: number, min: number, chars = 8) {
  return `${Math.max(min, Math.min(max, (max * chars) / Math.max(text.length, 1)))}cqw`;
}

const pad2 = (n: number) => String(n).padStart(2, "0");
const rangeText = (props: SlideProps) => (props.stats.source === "file" ? String(props.year) : RANGE_LABEL[props.range]);

/** Kata terakhir dibuat miring, seperti "Transform *the* way" di contoh design. */
function ItalicLast({ text }: { text: string }) {
  const words = text.split(" ");
  const last = words.pop();
  return (
    <>
      {words.join(" ")} {words.length > 0 && <br />}
      <em className="italic">{last}</em>
    </>
  );
}

function SlideFrame({ props, dark = false, children }: { props: SlideProps; dark?: boolean; children: ReactNode }) {
  return (
    <div
      className={`flex h-full w-full flex-col font-luxury-body ${dark ? "bg-luxury-ink text-luxury-ivory" : "bg-luxury-ivory text-luxury-ink"}`}
    >
      <header className="flex items-center justify-between px-[8cqw] pt-[8cqw]">
        <span className={LABEL}>Wrapped</span>
        <span className={`${LABEL} text-luxury-stone`}>N° {pad2(props.n)}</span>
      </header>
      <div className="relative flex min-h-0 flex-1 flex-col px-[8cqw] py-[7cqw]">{children}</div>
      <footer className={`mx-[8cqw] flex justify-between border-t-[0.2cqw] py-[4cqw] ${dark ? "border-luxury-stone/40" : HAIRLINE}`}>
        <span className={`${LABEL} text-luxury-stone`}>{rangeText(props)}</span>
        <span className={`${LABEL} text-luxury-stone`}>Spotify</span>
      </footer>
    </div>
  );
}

/** Foto hitam-putih; tanpa foto jadi bidang abu muda polos. */
function CoverImage({ src, className = "" }: { src: string | null; className?: string }) {
  const url = proxiedImageUrl(src);
  return url ? (
    <img src={url} alt="" crossOrigin="anonymous" className={`block object-cover grayscale ${className}`} />
  ) : (
    <div className={`bg-luxury-mist ${className}`} />
  );
}

function Display({ children, className = "", fontSize }: { children: ReactNode; className?: string; fontSize?: string }) {
  return (
    <h2 className={`font-luxury-display font-normal leading-[0.98] tracking-[-0.01em] ${className}`} style={fontSize ? { fontSize } : undefined}>
      {children}
    </h2>
  );
}

function IntroSlide(props: SlideProps) {
  return (
    <SlideFrame props={props}>
      <p className={`${LABEL} text-luxury-stone`}>Edisi {props.year}</p>
      <h1 className="mt-auto font-luxury-display text-[24cqw] font-normal leading-[0.92] tracking-[-0.02em]">
        Ini
        <br />
        <em className="italic">musik</em>
        <br />
        kamu
      </h1>
      <p className="mt-[8cqw] max-w-[62cqw] text-[3.4cqw] font-light leading-relaxed text-luxury-stone">
        Rangkuman {rangeText(props)}, disusun dengan tenang untuk {props.name}.
      </p>
    </SlideFrame>
  );
}

function TopArtistSlide(props: SlideProps) {
  const artist = props.stats.topArtists[0];
  if (!artist) return <EmptySlide {...props} />;
  return (
    <SlideFrame props={props}>
      <p className={`${LABEL} text-luxury-stone`}>Artis pilihan</p>
      <CoverImage src={artist.image} className="mt-[6cqw] aspect-[4/5] w-full" />
      <div className="mt-auto flex items-end justify-between gap-[4cqw] pt-[6cqw]">
        <Display className="min-w-0 break-words" fontSize={fitFontSize(artist.name, 11, 6.5, 10)}>
          {artist.name}
        </Display>
        <span className="shrink-0 font-luxury-display text-[7cqw] italic text-luxury-stone">N° 1</span>
      </div>
    </SlideFrame>
  );
}

function RankedList({ items }: { items: { id: string; title: string; subtitle?: string }[] }) {
  return (
    <ol className={`mt-auto border-t-[0.2cqw] ${HAIRLINE}`}>
      {items.map((item, i) => (
        <li key={item.id} className={`grid grid-cols-[11cqw_1fr] items-baseline border-b-[0.2cqw] py-[3.2cqw] ${HAIRLINE}`}>
          <span className="font-luxury-display text-[4.6cqw] italic text-luxury-stone">{ROMAN[i]}.</span>
          <span className="min-w-0">
            <span className="line-clamp-1 block font-luxury-display text-[6.4cqw] leading-tight">{item.title}</span>
            {item.subtitle && <span className={`mt-[0.8cqw] line-clamp-1 block ${LABEL} text-[2.3cqw] text-luxury-stone`}>{item.subtitle}</span>}
          </span>
        </li>
      ))}
    </ol>
  );
}

function TopArtistsSlide(props: SlideProps) {
  return (
    <SlideFrame props={props}>
      <p className={`${LABEL} text-luxury-stone`}>Koleksi artis</p>
      <Display className="mt-[5cqw] text-[16cqw]">
        Lima
        <br />
        <em className="italic">artis</em>
      </Display>
      <RankedList items={props.stats.topArtists.map((a) => ({ id: a.id, title: a.name }))} />
    </SlideFrame>
  );
}

function TopTrackSlide(props: SlideProps) {
  const track = props.stats.topTracks[0];
  if (!track) return <EmptySlide {...props} />;
  return (
    <SlideFrame props={props}>
      <p className={`${LABEL} text-luxury-stone`}>Lagu yang terus kembali</p>
      <CoverImage src={track.album.image} className="mt-[6cqw] aspect-square w-[70cqw] self-end" />
      <div className="mt-auto pt-[6cqw]">
        <Display className="line-clamp-3 break-words" fontSize={fitFontSize(track.name, 11, 6.5, 11)}>
          {track.name}
        </Display>
        <p className={`mt-[3cqw] line-clamp-1 ${LABEL} text-luxury-stone`}>{track.artists.join(" · ")}</p>
      </div>
    </SlideFrame>
  );
}

function TopTracksSlide(props: SlideProps) {
  return (
    <SlideFrame props={props}>
      <p className={`${LABEL} text-luxury-stone`}>Koleksi lagu</p>
      <Display className="mt-[5cqw] text-[13cqw]">
        Lima
        <br />
        <em className="italic">lagu</em>
      </Display>
      <RankedList items={props.stats.topTracks.map((t) => ({ id: t.id, title: t.name, subtitle: t.artists.join(" · ") }))} />
    </SlideFrame>
  );
}

function TopAlbumSlide(props: SlideProps) {
  const top = props.stats.topAlbum;
  if (!top) return <EmptySlide {...props} />;
  return (
    <SlideFrame props={props}>
      <p className={`${LABEL} text-luxury-stone`}>Album yang menetap</p>
      <CoverImage src={top.album.image} className="mt-[6cqw] aspect-square w-[70cqw]" />
      <div className="mt-auto pt-[6cqw]">
        <Display className="line-clamp-3 break-words" fontSize={fitFontSize(top.album.name, 10, 6, 12)}>
          {top.album.name}
        </Display>
        <div className={`mt-[4cqw] flex items-baseline justify-between border-t-[0.2cqw] pt-[3cqw] ${HAIRLINE}`}>
          <span className={`${LABEL} text-luxury-stone`}>{top.artist}</span>
          <span className="font-luxury-display text-[4.6cqw] italic">
            {props.stats.source === "file" ? `${top.count} kali diputar` : `${top.count} dari ${props.stats.trackCount} lagu teratas`}
          </span>
        </div>
      </div>
    </SlideFrame>
  );
}

function ListeningClockSlide(props: SlideProps) {
  const { hours, peakHour, recentCount, recentMinutes, source } = props.stats;
  const max = Math.max(1, ...hours);
  return (
    <SlideFrame props={props} dark>
      <p className={`${LABEL} text-luxury-stone`}>Waktu mendengar</p>
      <Display className="mt-[5cqw] text-[13cqw]">
        <ItalicLast text={listenerType(peakHour)} />
      </Display>
      {peakHour !== null && <p className="mt-auto font-luxury-display text-[22cqw] leading-none">{hourLabel(peakHour)}</p>}
      <div className={`${peakHour === null ? "mt-auto" : "mt-[6cqw]"} flex h-[22cqw] items-end justify-between`}>
        {hours.map((count, hour) => (
          <div
            key={hour}
            className={`w-[0.5cqw] ${hour === peakHour ? "bg-luxury-ivory" : "bg-luxury-stone/60"}`}
            style={{ height: `${Math.max(3, (count / max) * 100)}%` }}
          />
        ))}
      </div>
      <div className={`mt-[2cqw] flex justify-between ${LABEL} text-[2.2cqw] text-luxury-stone`}>
        <span>00</span>
        <span>12</span>
        <span>23</span>
      </div>
      <p className="mt-[5cqw] text-[3.2cqw] font-light text-luxury-stone">
        {source === "file"
          ? `Dari ${recentCount} putar sepanjang ${props.year}, ${recentMinutes} menit.`
          : `Dari ${recentCount} lagu terakhir, ${recentMinutes} menit.`}
      </p>
    </SlideFrame>
  );
}

function NumbersSlide(props: SlideProps) {
  const s = props.stats;
  const isFile = s.source === "file";
  const rows: { value: string; label: string }[] = [];
  if (isFile ? s.loyalTotal > 0 : props.range !== "long_term") {
    rows.push({ value: `${s.loyalCount}/${s.loyalTotal}`, label: "Lagu top 10 yang juga favorit lama" });
  }
  rows.push({
    value: String(s.uniqueArtistsInTop),
    label: isFile ? `Artis berbeda sepanjang ${props.year}` : `Artis berbeda di ${s.trackCount} lagu teratas`,
  });
  rows.push({
    value: String(s.recentMinutes),
    label: isFile ? `Menit dari ${s.recentCount} putar sepanjang ${props.year}` : `Menit dari ${s.recentCount} lagu terakhir`,
  });

  return (
    <SlideFrame props={props}>
      <p className={`${LABEL} text-luxury-stone`}>Dalam angka</p>
      <Display className="mt-[5cqw] text-[16cqw]">
        Sedikit
        <br />
        <em className="italic">angka</em>
      </Display>
      <dl className={`mt-auto border-t-[0.2cqw] ${HAIRLINE}`}>
        {rows.map((row) => (
          <div key={row.label} className={`grid grid-cols-[34cqw_1fr] items-baseline border-b-[0.2cqw] py-[4cqw] ${HAIRLINE}`}>
            <dt className="font-luxury-display text-[13cqw] leading-none">{row.value}</dt>
            <dd className="text-[3.2cqw] font-light leading-snug text-luxury-stone">{row.label}</dd>
          </div>
        ))}
      </dl>
      {s.topGenres.length > 0 && (
        <p className={`mt-[4cqw] ${LABEL} text-luxury-stone`}>{s.topGenres.slice(0, 3).join(" · ")}</p>
      )}
    </SlideFrame>
  );
}

function SummarySlide(props: SlideProps) {
  const s = props.stats;
  return (
    <SlideFrame props={props}>
      <p className={`${LABEL} text-luxury-stone`}>Rangkuman untuk</p>
      <p className="mt-[3cqw] break-words font-luxury-display italic leading-none" style={{ fontSize: fitFontSize(props.name, 9, 6, 10) }}>
        {props.name}
      </p>

      <p className="mt-auto font-luxury-display text-[30cqw] leading-[0.85] tracking-[-0.03em]">{props.year}</p>

      <div className={`mt-[6cqw] grid grid-cols-2 gap-[6cqw] border-t-[0.2cqw] pt-[4cqw] ${HAIRLINE}`}>
        {[
          { title: "Artis", items: s.topArtists.map((a) => a.name) },
          { title: "Lagu", items: s.topTracks.map((t) => t.name) },
        ].map((column) => (
          <div key={column.title} className="min-w-0">
            <p className={`${LABEL} text-luxury-stone`}>{column.title}</p>
            <ol className="mt-[2.5cqw] space-y-[1.2cqw]">
              {column.items.map((name, i) => (
                <li key={i} className="flex gap-[2cqw] text-[3.4cqw] leading-tight">
                  <span className="w-[5cqw] shrink-0 font-luxury-display italic text-luxury-stone">{ROMAN[i]}</span>
                  <span className="line-clamp-1">{name}</span>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
      <div className={`mt-[4cqw] grid grid-cols-2 gap-[6cqw] border-t-[0.2cqw] pt-[3cqw] ${HAIRLINE}`}>
        <div className="min-w-0">
          <p className={`${LABEL} text-luxury-stone`}>Album</p>
          <p className="mt-[1.5cqw] line-clamp-2 font-luxury-display text-[4.4cqw] italic leading-tight">{s.topAlbum?.album.name ?? "-"}</p>
        </div>
        <div className="min-w-0">
          <p className={`${LABEL} text-luxury-stone`}>Karakter</p>
          <p className="mt-[1.5cqw] line-clamp-2 font-luxury-display text-[4.4cqw] italic leading-tight">{listenerType(s.peakHour)}</p>
        </div>
      </div>
    </SlideFrame>
  );
}

function EmptySlide(props: SlideProps) {
  return (
    <SlideFrame props={props}>
      <Display className="mt-auto text-[16cqw]">
        Belum
        <br />
        <em className="italic">cukup</em>
        <br />
        data
      </Display>
      <p className="mt-[6cqw] max-w-[62cqw] text-[3.4cqw] font-light leading-relaxed text-luxury-stone">
        Dengarkan lebih banyak dulu, atau pilih rentang waktu lain.
      </p>
    </SlideFrame>
  );
}

export function TotalMinutesSlide(props: SlideProps) {
  const h = props.stats.history;
  if (!h) return <EmptySlide {...props} />;

  return (
    <SlideFrame props={props}>
      <p className={`${LABEL} text-luxury-stone`}>Waktu dengar · {props.year}</p>
      <Display className="mt-[4cqw] text-[15cqw]">
        Total
        <br />
        <em className="italic">menit</em>
      </Display>

      <div className={`mt-[6cqw] border-b-[0.2cqw] border-t-[0.2cqw] py-[5cqw] ${HAIRLINE}`}>
        <p className="font-luxury-display text-[17cqw] leading-none">
          {h.totalMinutes.toLocaleString("id-ID")}
        </p>
        <p className={`mt-[1.5cqw] ${LABEL} text-luxury-stone`}>Menit diputar</p>
      </div>

      <div className="mt-auto space-y-[4cqw]">
        {h.topTrack && (
          <div className={`border-b-[0.2cqw] pb-[3.5cqw] ${HAIRLINE}`}>
            <p className={`${LABEL} text-luxury-stone`}>Lagu teratas</p>
            <p className="mt-[1cqw] line-clamp-1 font-luxury-display text-[4.6cqw]">{h.topTrack.name}</p>
            <p className="mt-[0.5cqw] text-[3.2cqw] font-light text-luxury-stone">
              {h.topTrack.artist} · {h.topTrack.plays} kali
            </p>
          </div>
        )}
        {h.busiestDay && (
          <div className={`border-b-[0.2cqw] pb-[3.5cqw] ${HAIRLINE}`}>
            <p className={`${LABEL} text-luxury-stone`}>Hari paling sibuk</p>
            <p className="mt-[1cqw] font-luxury-display text-[4.6cqw]">{h.busiestDay.date}</p>
            <p className="mt-[0.5cqw] text-[3.2cqw] font-light text-luxury-stone">
              {h.busiestDay.minutes.toLocaleString("id-ID")} menit
            </p>
          </div>
        )}
      </div>

      <p className={`mt-[3.5cqw] ${LABEL} text-luxury-stone`}>
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
