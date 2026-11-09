/* eslint-disable @next/next/no-img-element -- html-to-image butuh <img> biasa, bukan next/image */
import type { ReactNode } from "react";
import type { SlideProps } from "@/designs/types";
import { hourLabel, listenerType, proxiedImageUrl, RANGE_LABEL } from "@/lib/stats";

const DASHED = "border-t-[0.35cqw] border-dashed border-nota-ink/60";
const DOUBLE = "border-t-[1cqw] border-double border-nota-ink";
const BAR_WIDTH = 10;

/** Ukuran font (cqw) yang mengecil untuk teks panjang, supaya judul besar tetap muat. */
function fitFontSize(text: string, max: number, min: number, chars = 8) {
  return `${Math.max(min, Math.min(max, (max * chars) / Math.max(text.length, 1)))}cqw`;
}

const pad2 = (n: number) => String(n).padStart(2, "0");

/** Tepi kertas bergerigi (sobekan struk). */
function ZigZag({ flip = false }: { flip?: boolean }) {
  const teeth = 24;
  const step = 100 / teeth;
  const points = Array.from({ length: teeth }, (_, i) => `${i * step},3 ${i * step + step / 2},0`).join(" ");
  return (
    <svg viewBox="0 0 100 3" preserveAspectRatio="none" aria-hidden className={`block h-[2.4cqw] w-full ${flip ? "-mt-[0.1cqw] rotate-180" : "-mb-[0.1cqw]"}`}>
      <polygon points={`${points} 100,3`} className="fill-nota-paper" />
    </svg>
  );
}

function Divider({ double = false, className = "" }: { double?: boolean; className?: string }) {
  return <div aria-hidden className={`my-[2.5cqw] ${double ? DOUBLE : DASHED} ${className}`} />;
}

/** Baris struk: kiri ........ kanan. */
function Row({ left, right, bold = false, className = "" }: { left: ReactNode; right: ReactNode; bold?: boolean; className?: string }) {
  return (
    <div className={`flex items-end gap-[1cqw] leading-snug ${bold ? "font-bold" : ""} ${className}`}>
      <span className="min-w-0 truncate">{left}</span>
      <span aria-hidden className="mb-[1cqw] min-w-[3cqw] flex-1 border-b-[0.35cqw] border-dotted border-nota-ink/40" />
      <span className="shrink-0">{right}</span>
    </div>
  );
}

function SlideFrame({ props, label, children }: { props: SlideProps; label: string; children: ReactNode }) {
  return (
    <div className="flex h-full w-full flex-col bg-nota-desk px-[7cqw] py-[7cqw] font-nota-mono text-[3.4cqw] text-nota-ink">
      <div className="flex min-h-0 w-full flex-1 flex-col drop-shadow-[0_1.5cqw_2.5cqw_rgb(0_0_0/0.45)]">
        <ZigZag />
        <div className="flex min-h-0 flex-1 flex-col bg-nota-paper px-[6cqw] py-[3cqw]">
          <header className="text-center">
            <p className="text-[5.4cqw] font-bold tracking-[0.08em]">WRAPPED MUSIC STORE</p>
            <p className="text-[2.8cqw] text-nota-faded">Jl. Spotify No. 9/16 · Edisi {props.year}</p>
          </header>
          <Divider double />
          <div className="flex justify-between text-[2.8cqw] uppercase">
            <span>Nota #{props.year}-{pad2(props.n)}</span>
            <span>{RANGE_LABEL[props.range]}</span>
          </div>
          <Divider />
          <div className="flex min-h-0 flex-1 flex-col">{children}</div>
          <Divider />
          <div className="flex justify-between text-[2.8cqw] uppercase text-nota-faded">
            <span>
              Hal. {pad2(props.n)}/{pad2(props.total)}
            </span>
            <span>{label}</span>
          </div>
        </div>
        <ZigZag flip />
      </div>
    </div>
  );
}

/** Foto ala cetakan thermal: hitam-putih kontras; tanpa foto jadi kotak arsir. */
function CoverImage({ src, className = "" }: { src: string | null; className?: string }) {
  const url = proxiedImageUrl(src);
  return url ? (
    <img src={url} alt="" crossOrigin="anonymous" className={`block object-cover contrast-125 grayscale ${className}`} />
  ) : (
    <div className={`bg-[repeating-linear-gradient(45deg,var(--color-nota-ink)_0_0.3cqw,transparent_0.3cqw_1.6cqw)] opacity-30 ${className}`} />
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return <p className="text-center text-[3.4cqw] font-bold uppercase tracking-[0.15em]">*** {children} ***</p>;
}

/** Barcode dekoratif yang dibentuk dari teks (nama + tahun), jadi tiap orang beda. */
function Barcode({ seed }: { seed: string }) {
  // Teks diulang sampai minimal 24 karakter supaya barcode tetap rapat untuk nama pendek.
  const text = seed.repeat(Math.ceil(24 / Math.max(seed.length, 1))).slice(0, 32);
  const widths = [1, 1, 1, ...[...text].flatMap((c) => [(c.charCodeAt(0) % 3) + 1, ((c.charCodeAt(0) >> 2) % 2) + 1]), 1, 1, 1];
  let x = 0;
  const bars = widths.map((w, i) => {
    const bar = i % 2 === 0 ? <rect key={i} x={x} y={0} width={w} height={20} /> : null;
    x += w;
    return bar;
  });
  return (
    <svg viewBox={`0 0 ${x} 20`} preserveAspectRatio="none" aria-hidden className="mx-auto block h-[11cqw] w-[62cqw] fill-nota-ink">
      {bars}
    </svg>
  );
}

function IntroSlide(props: SlideProps) {
  return (
    <SlideFrame props={props} label="Intro">
      <Row left="PELANGGAN" right={props.name} />
      <Row left="KASIR" right="ALGORITMA" />
      <Row left="PERIODE" right={RANGE_LABEL[props.range].toUpperCase()} />
      <h1 className="mt-auto text-center text-[12cqw] font-bold uppercase leading-[0.95] tracking-tight">
        Ini
        <br />
        musik
        <br />
        kamu
      </h1>
      <p className="mt-[4cqw] text-center text-[3cqw] text-nota-faded">Rincian belanja telinga kamu ada di halaman berikutnya.</p>
      <p className="mt-auto text-center text-[3cqw] font-bold">*** SIMPAN NOTA INI ***</p>
    </SlideFrame>
  );
}

function TopArtistSlide(props: SlideProps) {
  const artist = props.stats.topArtists[0];
  if (!artist) return <EmptySlide {...props} />;
  return (
    <SlideFrame props={props} label="Artis #1">
      <SectionTitle>Item terlaris</SectionTitle>
      <CoverImage src={artist.image} className="mx-auto mt-[4cqw] aspect-square w-[52cqw]" />
      <p className="mt-auto break-words text-center font-bold uppercase leading-tight" style={{ fontSize: fitFontSize(artist.name, 8, 5, 12) }}>
        {artist.name}
      </p>
      <Divider />
      <Row left="1x ARTIS #1" right="★★★★★" />
      <Row left="KATEGORI" right="PALING SERING" />
      <Row left="STATUS" right="FAVORIT" bold />
    </SlideFrame>
  );
}

function TopArtistsSlide(props: SlideProps) {
  const artists = props.stats.topArtists;
  return (
    <SlideFrame props={props} label="Top artis">
      <SectionTitle>Daftar belanja: artis</SectionTitle>
      <div className="mt-auto">
        <div className="flex justify-between text-[2.8cqw] text-nota-faded">
          <span>QTY ITEM</span>
          <span>PERINGKAT</span>
        </div>
        <Divider />
        <div className="space-y-[2.2cqw] text-[3.8cqw]">
          {artists.map((artist, i) => (
            <Row key={artist.id} left={`1x ${artist.name.toUpperCase()}`} right={`#${pad2(i + 1)}`} />
          ))}
        </div>
        <Divider double />
        <Row left="TOTAL ITEM" right={String(artists.length)} bold className="text-[4.4cqw]" />
      </div>
    </SlideFrame>
  );
}

function TopTrackSlide(props: SlideProps) {
  const track = props.stats.topTracks[0];
  if (!track) return <EmptySlide {...props} />;
  return (
    <SlideFrame props={props} label="Lagu #1">
      <SectionTitle>Lagu #1</SectionTitle>
      <CoverImage src={track.album.image} className="mx-auto mt-[4cqw] aspect-square w-[52cqw]" />
      <div className="mt-auto text-center">
        <p className="line-clamp-2 break-words font-bold uppercase leading-tight" style={{ fontSize: fitFontSize(track.name, 7.5, 5, 13) }}>
          {track.name}
        </p>
        <p className="mt-[1cqw] line-clamp-1 text-nota-faded">{track.artists.join(", ")}</p>
      </div>
      <Divider />
      <Row left="DIPUTAR" right="BERULANG KALI" />
      <Row left="STATUS" right="LUNAS" bold />
    </SlideFrame>
  );
}

function TopTracksSlide(props: SlideProps) {
  return (
    <SlideFrame props={props} label="Top lagu">
      <SectionTitle>Daftar belanja: lagu</SectionTitle>
      <div className="mt-auto space-y-[2.4cqw]">
        {props.stats.topTracks.map((track, i) => (
          <div key={track.id}>
            <Row left={`${i + 1}. ${track.name.toUpperCase()}`} right={`#${pad2(i + 1)}`} className="text-[3.8cqw]" />
            <p className="truncate pl-[4.5cqw] text-[2.9cqw] text-nota-faded">{track.artists.join(", ")}</p>
          </div>
        ))}
      </div>
      <Divider />
      <p className="text-[2.8cqw] text-nota-faded">* urutan berdasarkan jumlah putar</p>
    </SlideFrame>
  );
}

function TopAlbumSlide(props: SlideProps) {
  const top = props.stats.topAlbum;
  if (!top) return <EmptySlide {...props} />;
  return (
    <SlideFrame props={props} label="Album">
      <SectionTitle>Album terlaris</SectionTitle>
      <CoverImage src={top.album.image} className="mx-auto mt-[4cqw] aspect-square w-[52cqw]" />
      <div className="mt-auto text-center">
        <p className="line-clamp-2 break-words font-bold uppercase leading-tight" style={{ fontSize: fitFontSize(top.album.name, 7.5, 5, 13) }}>
          {top.album.name}
        </p>
        <p className="mt-[1cqw] line-clamp-1 text-nota-faded">{top.artist}</p>
      </div>
      <Divider />
      <Row left="LAGU DI TOP KAMU" right={`${top.count}/${props.stats.trackCount}`} bold />
    </SlideFrame>
  );
}

function ListeningClockSlide(props: SlideProps) {
  const { hours, peakHour, recentCount, recentMinutes } = props.stats;
  // Dikelompokkan per 4 jam supaya muat sebagai bar ASCII.
  const buckets = Array.from({ length: 6 }, (_, b) => ({
    label: `${pad2(b * 4)}-${pad2(b * 4 + 3)}`,
    count: hours.slice(b * 4, b * 4 + 4).reduce((sum, v) => sum + v, 0),
  }));
  const max = Math.max(1, ...buckets.map((b) => b.count));

  return (
    <SlideFrame props={props} label="Jam dengar">
      <SectionTitle>Laporan jam transaksi</SectionTitle>
      <Row left="TIPE" right={listenerType(peakHour).toUpperCase()} className="mt-[4cqw]" bold />
      <Row left="JAM SIBUK" right={peakHour === null ? "-" : hourLabel(peakHour)} />
      <div className="mt-auto">
        <Divider />
        <div className="space-y-[1.6cqw] whitespace-pre text-[3.6cqw]">
          {buckets.map((b) => {
            const filled = Math.round((b.count / max) * BAR_WIDTH);
            return (
              <p key={b.label}>
                {b.label} <span className="font-bold">{"#".repeat(filled)}</span>
                <span className="text-nota-faded">{"·".repeat(BAR_WIDTH - filled)}</span> {String(b.count).padStart(2, " ")}
              </p>
            );
          })}
        </div>
        <Divider />
        <Row left="SAMPEL" right={`${recentCount} LAGU`} />
        <Row left="DURASI" right={`${recentMinutes} MENIT`} />
      </div>
    </SlideFrame>
  );
}

function NumbersSlide(props: SlideProps) {
  const s = props.stats;
  return (
    <SlideFrame props={props} label="Angka">
      <SectionTitle>Ringkasan transaksi</SectionTitle>
      <div className="mt-auto space-y-[2cqw] text-[3.8cqw]">
        {props.range !== "long_term" && <Row left="LAGU SETIA (TOP 10)" right={`${s.loyalCount}/${s.loyalTotal}`} />}
        <Row left="ARTIS BERBEDA" right={String(s.uniqueArtistsInTop)} />
        <Row left="LAGU TERATAS" right={String(s.trackCount)} />
        <Row left="LAGU TERAKHIR" right={String(s.recentCount)} />
        {s.topGenres.length > 0 && <Row left="GENRE" right={s.topGenres[0].toUpperCase()} />}
      </div>
      <Divider double />
      <Row left="TOTAL MENIT" right={String(s.recentMinutes)} bold className="text-[6cqw]" />
      <Divider />
      <Row left="BAYAR" right="GRATIS" />
      <Row left="KEMBALI" right="0" />
    </SlideFrame>
  );
}

function SummarySlide(props: SlideProps) {
  const s = props.stats;
  return (
    <SlideFrame props={props} label="Ringkasan">
      <Row left="PELANGGAN" right={props.name} bold />
      <Divider />
      <div className="grid grid-cols-2 gap-[4cqw] text-[2.9cqw]">
        {[
          { title: "TOP ARTIS", items: s.topArtists.map((a) => a.name) },
          { title: "TOP LAGU", items: s.topTracks.map((t) => t.name) },
        ].map((column) => (
          <div key={column.title} className="min-w-0">
            <p className="text-[2.6cqw] text-nota-faded">{column.title}</p>
            <div className="mt-[1cqw] space-y-[0.6cqw]">
              {column.items.map((name, i) => (
                <p key={i} className="truncate">
                  {i + 1} {name.toUpperCase()}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Divider />
      <Row left="ALBUM" right={(s.topAlbum?.album.name ?? "-").toUpperCase()} className="text-[3cqw]" />
      <Row left="TIPE" right={listenerType(s.peakHour).toUpperCase()} className="text-[3cqw]" />
      <Divider double />
      <Row left="EDISI" right={String(props.year)} bold className="text-[5cqw]" />
      <div className="mt-auto pt-[3cqw]">
        <Barcode seed={`${props.name}${props.year}`} />
        <p className="mt-[1cqw] text-center text-[2.6cqw] tracking-[0.3em]">
          {props.year}
          {pad2(s.trackCount)}
          {pad2(s.uniqueArtistsInTop)}
          {String(s.recentMinutes).padStart(4, "0")}
        </p>
        <p className="mt-[2.5cqw] text-center text-[3cqw] font-bold">TERIMA KASIH SUDAH MENDENGARKAN</p>
      </div>
    </SlideFrame>
  );
}

function EmptySlide(props: SlideProps) {
  return (
    <SlideFrame props={props} label="Gagal">
      <SectionTitle>Transaksi gagal</SectionTitle>
      <p className="mt-auto text-center text-[9cqw] font-bold uppercase leading-tight">Data belum cukup</p>
      <p className="mt-[4cqw] text-center text-nota-faded">Dengerin lebih banyak dulu, atau ganti rentang waktunya.</p>
      <p className="mt-auto text-center font-bold">*** SILAKAN COBA LAGI ***</p>
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
