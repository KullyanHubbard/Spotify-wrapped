/* eslint-disable @next/next/no-img-element -- html-to-image butuh <img> biasa, bukan next/image */
import type { ReactNode } from "react";
import { hourLabel, listenerType, proxiedImageUrl, RANGE_LABEL } from "@/lib/stats";
import type { SlideProps } from "@/designs/types";

const BORDER = "border-current border-[0.7cqw]";

/** Ukuran font (cqw) yang mengecil untuk teks panjang, supaya judul besar tetap muat. */
function fitFontSize(text: string, max: number, min: number, chars = 8) {
  return `${Math.max(min, Math.min(max, (max * chars) / Math.max(text.length, 1)))}cqw`;
}

const pad2 = (n: number) => String(n).padStart(2, "0");

function SlideFrame({
  props,
  label,
  className,
  children,
}: {
  props: SlideProps;
  label: string;
  className: string;
  children: ReactNode;
}) {
  return (
    <div className={`flex h-full w-full flex-col font-neo-display [&_.font-black]:[word-spacing:0.08em] ${className}`}>
      <header className={`flex border-0 border-b-[0.7cqw] border-current font-neo-mono text-[3.1cqw] uppercase`}>
        <span className="px-[4cqw] py-[2.6cqw] font-bold">Wraped®</span>
        <span className="flex-1 border-l-[0.7cqw] border-current px-[4cqw] py-[2.6cqw]">{label}</span>
        <span className="border-l-[0.7cqw] border-current px-[4cqw] py-[2.6cqw]">
          {pad2(props.n)}/{pad2(props.total)}
        </span>
      </header>
      <div className="relative flex min-h-0 flex-1 flex-col p-[5.5cqw]">{children}</div>
      <footer className="flex justify-between border-t-[0.7cqw] border-current px-[4cqw] py-[2.6cqw] font-neo-mono text-[3.1cqw] uppercase">
        <span>{RANGE_LABEL[props.range]}</span>
        <span>Spotify Stats</span>
      </footer>
    </div>
  );
}

function CoverImage({ src, className = "" }: { src: string | null; className?: string }) {
  const url = proxiedImageUrl(src);
  return url ? (
    <img src={url} alt="" crossOrigin="anonymous" className={`block object-cover ${BORDER} ${className}`} />
  ) : (
    <div className={`${BORDER} bg-current/20 ${className}`} />
  );
}

function Tag({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`inline-block self-start bg-neo-ink px-[2.5cqw] py-[1cqw] font-neo-mono text-[3.3cqw] uppercase text-neo-paper ${className}`}>
      {children}
    </span>
  );
}

function IntroSlide(props: SlideProps) {
  return (
    <SlideFrame props={props} label="Intro" className="bg-neo-sun text-neo-ink">
      <div className="flex items-start justify-between">
        <Tag>Untuk</Tag>
        <span className="font-neo-mono text-[3.3cqw]">{props.year}</span>
      </div>
      <p className="mt-[2cqw] font-black uppercase leading-none tracking-[-0.04em]" style={{ fontSize: fitFontSize(props.name, 11, 6, 10) }}>
        {props.name}
      </p>
      <h1 className="mt-auto text-[25cqw] font-black uppercase leading-[0.8] tracking-[-0.035em]">
        Ini
        <br />
        musik
        <br />
        kamu<span className="text-neo-signal">.</span>
      </h1>
      <div className={`mt-[7cqw] grid grid-cols-[1fr_auto] ${BORDER} bg-neo-paper shadow-[2cqw_2cqw_0_currentColor]`}>
        <span className="px-[3.5cqw] py-[3cqw] text-[5cqw] font-bold">Rangkuman {RANGE_LABEL[props.range]}</span>
        <span className="flex items-center border-l-[0.7cqw] border-current px-[4cqw] text-[8cqw] font-black">↘</span>
      </div>
    </SlideFrame>
  );
}

function TopArtistSlide(props: SlideProps) {
  const a = props.stats.topArtists[0];
  if (!a) return <EmptySlide {...props} />;
  return (
    <SlideFrame props={props} label="Artis #1" className="bg-neo-paper text-neo-ink">
      <div className="flex items-end justify-between">
        <Tag>Paling sering kamu putar</Tag>
        <span className="text-[22cqw] font-black leading-[0.75] tracking-[-0.045em] text-neo-signal">01</span>
      </div>
      <CoverImage src={a.image} className="mt-[5cqw] aspect-square w-[68cqw] shadow-[3cqw_3cqw_0_var(--color-neo-signal)]" />
      <h2
        className="mt-auto break-words font-black uppercase leading-[0.9] tracking-[-0.035em]"
        style={{ fontSize: fitFontSize(a.name, 17, 8) }}
      >
        {a.name}
      </h2>
    </SlideFrame>
  );
}

function TopArtistsSlide(props: SlideProps) {
  return (
    <SlideFrame props={props} label="Top artis" className="bg-neo-cobalt text-neo-paper">
      <h2 className="text-[18cqw] font-black uppercase leading-[0.82] tracking-[-0.045em]">
        Top 5
        <br />
        artis
      </h2>
      <ol className="mt-auto border-t-[0.7cqw] border-current">
        {props.stats.topArtists.map((a, i) => (
          <li key={a.id} className="flex items-center gap-[3.5cqw] border-b-[0.7cqw] border-current py-[2.6cqw]">
            <span className="w-[9cqw] font-neo-mono text-[5cqw] font-bold">{pad2(i + 1)}</span>
            <CoverImage src={a.image} className="aspect-square w-[14cqw] shrink-0" />
            <span className="line-clamp-1 text-[6.4cqw] font-extrabold uppercase tracking-[-0.03em]">{a.name}</span>
          </li>
        ))}
      </ol>
    </SlideFrame>
  );
}

function TopTrackSlide(props: SlideProps) {
  const t = props.stats.topTracks[0];
  if (!t) return <EmptySlide {...props} />;
  return (
    <SlideFrame props={props} label="Lagu #1" className="bg-neo-signal text-neo-ink">
      <Tag>Diputar terus-terusan</Tag>
      <div className="mt-[5cqw] flex items-start gap-[4cqw]">
        <CoverImage src={t.album.image} className="aspect-square w-[66cqw] bg-neo-paper shadow-[3cqw_3cqw_0_currentColor]" />
        <span className="font-neo-mono text-[3.3cqw] uppercase [writing-mode:vertical-rl]">Track — 01</span>
      </div>
      <div className="mt-auto">
        <h2
          className="line-clamp-3 break-words font-black uppercase leading-[0.9] tracking-[-0.035em]"
          style={{ fontSize: fitFontSize(t.name, 15, 7.5, 9) }}
        >
          {t.name}
        </h2>
        <p className="mt-[3cqw] font-neo-mono text-[4cqw] uppercase">{t.artists.join(" / ")}</p>
      </div>
    </SlideFrame>
  );
}

function TopTracksSlide(props: SlideProps) {
  return (
    <SlideFrame props={props} label="Top lagu" className="bg-neo-paper text-neo-ink">
      <h2 className="text-[18cqw] font-black uppercase leading-[0.82] tracking-[-0.045em]">
        Top 5
        <br />
        lagu<span className="text-neo-signal">*</span>
      </h2>
      <ol className="mt-auto border-t-[0.7cqw] border-current">
        {props.stats.topTracks.map((t, i) => (
          <li key={t.id} className="grid grid-cols-[9cqw_1fr] items-baseline border-b-[0.7cqw] border-current py-[2.8cqw]">
            <span className="font-neo-mono text-[5cqw] font-bold text-neo-signal">{pad2(i + 1)}</span>
            <span className="min-w-0">
              <span className="line-clamp-1 block text-[6cqw] font-extrabold uppercase leading-tight tracking-[-0.03em]">{t.name}</span>
              <span className="line-clamp-1 block font-neo-mono text-[3.3cqw] uppercase">{t.artists.join(" / ")}</span>
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-[3cqw] font-neo-mono text-[2.8cqw] uppercase">* berdasarkan jumlah putar</p>
    </SlideFrame>
  );
}

function TopAlbumSlide(props: SlideProps) {
  const a = props.stats.topAlbum;
  if (!a) return <EmptySlide {...props} />;
  return (
    <SlideFrame props={props} label="Album" className="bg-neo-acid text-neo-ink">
      <Tag>Album yang paling nempel</Tag>
      <CoverImage src={a.album.image} className="mx-auto mt-[6cqw] aspect-square w-[64cqw] shadow-[3cqw_3cqw_0_currentColor]" />
      <div className="mt-auto grid grid-cols-[1fr_auto] items-end gap-[4cqw]">
        <div className="min-w-0">
          <h2
            className="line-clamp-3 break-words font-black uppercase leading-[0.9] tracking-[-0.035em]"
            style={{ fontSize: fitFontSize(a.album.name, 12, 6.5, 10) }}
          >
            {a.album.name}
          </h2>
          <p className="mt-[2cqw] font-neo-mono text-[3.8cqw] uppercase">{a.artist}</p>
        </div>
        <div className={`${BORDER} bg-neo-ink px-[3cqw] py-[2cqw] text-center text-neo-acid`}>
          <p className="text-[11cqw] font-black leading-none tracking-[-0.035em]">{a.count}</p>
          <p className="font-neo-mono text-[2.6cqw] uppercase">/{props.stats.trackCount} lagu</p>
        </div>
      </div>
    </SlideFrame>
  );
}

function ListeningClockSlide(props: SlideProps) {
  const { hours, peakHour, recentCount, recentMinutes } = props.stats;
  const max = Math.max(1, ...hours);
  return (
    <SlideFrame props={props} label="Jam dengar" className="bg-neo-ink text-neo-paper">
      <span className="self-start bg-neo-acid px-[2.5cqw] py-[1cqw] font-neo-mono text-[3.3cqw] uppercase text-neo-ink">Kamu itu tipe</span>
      <h2 className="mt-[4cqw] text-[15cqw] font-black uppercase leading-[0.82] tracking-[-0.045em]">
        {listenerType(peakHour)}
      </h2>
      {peakHour !== null && (
        <p className="mt-[5cqw] font-neo-mono text-[4cqw] uppercase">
          Puncak: <span className="bg-neo-acid px-[1.5cqw] text-neo-ink">{hourLabel(peakHour)}</span>
        </p>
      )}
      <div className="mt-auto">
        <div className="flex h-[42cqw] items-end gap-[0.6cqw] border-b-[0.7cqw] border-current">
          {hours.map((v, h) => (
            <div
              key={h}
              className={`flex-1 ${h === peakHour ? "bg-neo-acid" : "bg-neo-paper"}`}
              style={{ height: `${Math.max(2, (v / max) * 100)}%` }}
            />
          ))}
        </div>
        <div className="mt-[1.5cqw] flex justify-between font-neo-mono text-[3cqw]">
          <span>00</span>
          <span>06</span>
          <span>12</span>
          <span>18</span>
          <span>23</span>
        </div>
        <p className="mt-[4cqw] font-neo-mono text-[3cqw] uppercase opacity-70">
          Dari {recentCount} lagu terakhir · {recentMinutes} menit
        </p>
      </div>
    </SlideFrame>
  );
}

function NumbersSlide(props: SlideProps) {
  const s = props.stats;
  const cells: { value: string; label: string; accent?: boolean }[] = [];
  if (props.range !== "long_term") {
    cells.push({ value: `${s.loyalCount}/${s.loyalTotal}`, label: "lagu top 10 kamu juga favorit jangka panjang", accent: true });
  }
  cells.push({ value: String(s.uniqueArtistsInTop), label: `artis berbeda di top ${s.trackCount} lagu` });
  cells.push({ value: String(s.recentMinutes), label: `menit dari ${s.recentCount} lagu terakhir` });

  return (
    <SlideFrame props={props} label="Angka" className="bg-neo-paper text-neo-ink">
      <h2 className="text-[18cqw] font-black uppercase leading-[0.82] tracking-[-0.045em]">
        Dalam
        <br />
        angka
      </h2>
      <div className={`mt-auto ${BORDER} shadow-[2.5cqw_2.5cqw_0_currentColor]`}>
        {cells.map((c, i) => (
          <div
            key={i}
            className={`grid grid-cols-[auto_1fr] items-center gap-[4cqw] px-[4cqw] py-[3.5cqw] ${i ? "border-t-[0.7cqw] border-current" : ""} ${c.accent ? "bg-neo-signal" : "bg-neo-paper"}`}
          >
            <span className="min-w-[24cqw] text-[13cqw] font-black leading-none tracking-[-0.045em]">{c.value}</span>
            <span className="font-neo-mono text-[3.4cqw] uppercase leading-snug">{c.label}</span>
          </div>
        ))}
      </div>
      {s.topGenres.length > 0 && (
        <p className="mt-[5cqw] font-neo-mono text-[3.4cqw] uppercase">
          Genre: <span className="font-bold">{s.topGenres.slice(0, 3).join(" / ")}</span>
        </p>
      )}
    </SlideFrame>
  );
}

function SummarySlide(props: SlideProps) {
  const s = props.stats;
  return (
    <SlideFrame props={props} label="Ringkasan" className="bg-neo-sun text-neo-ink">
      <div className="grid grid-cols-[auto_1fr] items-end gap-[4cqw]">
        <CoverImage src={s.topArtists[0]?.image ?? null} className="aspect-square w-[30cqw] shadow-[2cqw_2cqw_0_currentColor]" />
        <div className="min-w-0">
          <Tag>Wrapped</Tag>
          <p
            className="mt-[2cqw] break-words font-black uppercase leading-[0.9] tracking-[-0.035em]"
            style={{ fontSize: fitFontSize(props.name, 9.5, 5.5, 7) }}
          >
            {props.name}
          </p>
        </div>
      </div>

      <p className="mt-auto text-[34cqw] font-black leading-[0.78] tracking-[-0.06em]">
        {props.year}
        <span className="text-neo-signal">.</span>
      </p>

      <div className={`mt-[5cqw] grid grid-cols-2 ${BORDER} bg-neo-paper shadow-[2.5cqw_2.5cqw_0_currentColor]`}>
        {[
          { title: "Top artis", items: s.topArtists.map((a) => a.name) },
          { title: "Top lagu", items: s.topTracks.map((t) => t.name) },
        ].map((col, ci) => (
          <div key={col.title} className={`min-w-0 ${ci ? "border-l-[0.7cqw] border-current" : ""}`}>
            <p className="border-b-[0.7cqw] border-current bg-neo-ink px-[3cqw] py-[1.5cqw] font-neo-mono text-[3cqw] uppercase text-neo-paper">
              {col.title}
            </p>
            <ol className="space-y-[1.4cqw] px-[3cqw] py-[3cqw]">
              {col.items.map((name, i) => (
                <li key={i} className="flex gap-[2cqw] text-[4cqw] font-bold leading-tight">
                  <span className="font-neo-mono text-[3.4cqw]">{i + 1}</span>
                  <span className="line-clamp-1">{name}</span>
                </li>
              ))}
            </ol>
          </div>
        ))}
        <div className="border-t-[0.7cqw] border-current px-[3cqw] py-[2.5cqw]">
          <p className="font-neo-mono text-[3cqw] uppercase">Album</p>
          <p className="line-clamp-2 text-[4.6cqw] font-black uppercase leading-tight">{s.topAlbum?.album.name ?? "-"}</p>
        </div>
        <div className="border-l-[0.7cqw] border-t-[0.7cqw] border-current bg-neo-signal px-[3cqw] py-[2.5cqw]">
          <p className="font-neo-mono text-[3cqw] uppercase">Tipe</p>
          <p className="line-clamp-2 text-[4.6cqw] font-black uppercase leading-tight">{listenerType(s.peakHour)}</p>
        </div>
      </div>
    </SlideFrame>
  );
}

function EmptySlide(props: SlideProps) {
  return (
    <SlideFrame props={props} label="Kosong" className="bg-neo-paper text-neo-ink">
      <h2 className="mt-auto text-[12cqw] font-black uppercase leading-[0.9] tracking-[-0.035em]">Belum cukup data.</h2>
      <p className="mt-[4cqw] font-neo-mono text-[3.6cqw] uppercase">Dengerin lebih banyak dulu, atau ganti rentang waktunya.</p>
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
