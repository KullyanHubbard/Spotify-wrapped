/* eslint-disable @next/next/no-img-element -- html-to-image butuh <img> biasa, bukan next/image */
import type { ReactNode } from "react";
import { hourLabel, img, listenerType, RANGE_LABEL, type Stats } from "@/lib/stats";
import type { TimeRange } from "@/lib/types";

export type SlideProps = { stats: Stats; name: string; range: TimeRange; n: number; total: number };

const LINE = "border-current border-[0.7cqw]";

/** Ukuran font (cqw) yang mengecil untuk teks panjang, supaya judul besar tetap muat. */
function fit(text: string, max: number, min: number, chars = 8) {
  return `${Math.max(min, Math.min(max, (max * chars) / Math.max(text.length, 1)))}cqw`;
}

const pad = (n: number) => String(n).padStart(2, "0");

function Frame({
  p,
  label,
  className,
  children,
}: {
  p: SlideProps;
  label: string;
  className: string;
  children: ReactNode;
}) {
  return (
    <div className={`flex h-full w-full flex-col font-sans ${className}`}>
      <header className={`flex border-0 border-b-[0.7cqw] border-current font-mono text-[3.1cqw] uppercase`}>
        <span className="px-[4cqw] py-[2.6cqw] font-bold">Wraped®</span>
        <span className="flex-1 border-l-[0.7cqw] border-current px-[4cqw] py-[2.6cqw]">{label}</span>
        <span className="border-l-[0.7cqw] border-current px-[4cqw] py-[2.6cqw]">
          {pad(p.n)}/{pad(p.total)}
        </span>
      </header>
      <div className="relative flex min-h-0 flex-1 flex-col p-[5.5cqw]">{children}</div>
      <footer className="flex justify-between border-t-[0.7cqw] border-current px-[4cqw] py-[2.6cqw] font-mono text-[3.1cqw] uppercase">
        <span>{RANGE_LABEL[p.range]}</span>
        <span>Spotify Stats</span>
      </footer>
    </div>
  );
}

function Cover({ src, className = "" }: { src: string | null; className?: string }) {
  const url = img(src);
  return url ? (
    <img src={url} alt="" crossOrigin="anonymous" className={`block object-cover ${LINE} ${className}`} />
  ) : (
    <div className={`${LINE} bg-current/20 ${className}`} />
  );
}

function Tag({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`inline-block self-start bg-ink px-[2.5cqw] py-[1cqw] font-mono text-[3.3cqw] uppercase text-paper ${className}`}>
      {children}
    </span>
  );
}

function Intro(p: SlideProps) {
  return (
    <Frame p={p} label="Intro" className="bg-sun text-ink">
      <div className="flex items-start justify-between">
        <Tag>Untuk</Tag>
        <span className="font-mono text-[3.3cqw]">{new Date().getFullYear()}</span>
      </div>
      <p className="mt-[2cqw] font-black uppercase leading-none tracking-[-0.04em]" style={{ fontSize: fit(p.name, 11, 6, 10) }}>
        {p.name}
      </p>
      <h1 className="mt-auto text-[25cqw] font-black uppercase leading-[0.8] tracking-[-0.035em]">
        Ini
        <br />
        musik
        <br />
        kamu<span className="text-signal">.</span>
      </h1>
      <div className={`mt-[7cqw] grid grid-cols-[1fr_auto] ${LINE} bg-paper shadow-[2cqw_2cqw_0_currentColor]`}>
        <span className="px-[3.5cqw] py-[3cqw] text-[5cqw] font-bold">Rangkuman {RANGE_LABEL[p.range]}</span>
        <span className="flex items-center border-l-[0.7cqw] border-current px-[4cqw] text-[8cqw] font-black">↘</span>
      </div>
    </Frame>
  );
}

function TopArtist(p: SlideProps) {
  const a = p.stats.topArtists[0];
  if (!a) return <Empty {...p} />;
  return (
    <Frame p={p} label="Artis #1" className="bg-paper text-ink">
      <div className="flex items-end justify-between">
        <Tag>Paling sering kamu putar</Tag>
        <span className="text-[22cqw] font-black leading-[0.75] tracking-[-0.045em] text-signal">01</span>
      </div>
      <Cover src={a.image} className="mt-[5cqw] aspect-square w-[68cqw] shadow-[3cqw_3cqw_0_var(--color-signal)]" />
      <h2
        className="mt-auto break-words font-black uppercase leading-[0.9] tracking-[-0.035em]"
        style={{ fontSize: fit(a.name, 17, 8) }}
      >
        {a.name}
      </h2>
    </Frame>
  );
}

function TopArtists(p: SlideProps) {
  return (
    <Frame p={p} label="Top artis" className="bg-cobalt text-paper">
      <h2 className="text-[18cqw] font-black uppercase leading-[0.82] tracking-[-0.045em]">
        Top 5
        <br />
        artis
      </h2>
      <ol className="mt-auto border-t-[0.7cqw] border-current">
        {p.stats.topArtists.map((a, i) => (
          <li key={a.id} className="flex items-center gap-[3.5cqw] border-b-[0.7cqw] border-current py-[2.6cqw]">
            <span className="w-[9cqw] font-mono text-[5cqw] font-bold">{pad(i + 1)}</span>
            <Cover src={a.image} className="aspect-square w-[14cqw] shrink-0" />
            <span className="line-clamp-1 text-[6.4cqw] font-extrabold uppercase tracking-[-0.03em]">{a.name}</span>
          </li>
        ))}
      </ol>
    </Frame>
  );
}

function TopTrack(p: SlideProps) {
  const t = p.stats.topTracks[0];
  if (!t) return <Empty {...p} />;
  return (
    <Frame p={p} label="Lagu #1" className="bg-signal text-ink">
      <Tag>Diputar terus-terusan</Tag>
      <div className="mt-[5cqw] flex items-start gap-[4cqw]">
        <Cover src={t.album.image} className="aspect-square w-[66cqw] bg-paper shadow-[3cqw_3cqw_0_currentColor]" />
        <span className="font-mono text-[3.3cqw] uppercase [writing-mode:vertical-rl]">Track — 01</span>
      </div>
      <div className="mt-auto">
        <h2
          className="line-clamp-3 break-words font-black uppercase leading-[0.9] tracking-[-0.035em]"
          style={{ fontSize: fit(t.name, 15, 7.5, 9) }}
        >
          {t.name}
        </h2>
        <p className="mt-[3cqw] font-mono text-[4cqw] uppercase">{t.artists.join(" / ")}</p>
      </div>
    </Frame>
  );
}

function TopTracks(p: SlideProps) {
  return (
    <Frame p={p} label="Top lagu" className="bg-paper text-ink">
      <h2 className="text-[18cqw] font-black uppercase leading-[0.82] tracking-[-0.045em]">
        Top 5
        <br />
        lagu<span className="text-signal">*</span>
      </h2>
      <ol className="mt-auto border-t-[0.7cqw] border-current">
        {p.stats.topTracks.map((t, i) => (
          <li key={t.id} className="grid grid-cols-[9cqw_1fr] items-baseline border-b-[0.7cqw] border-current py-[2.8cqw]">
            <span className="font-mono text-[5cqw] font-bold text-signal">{pad(i + 1)}</span>
            <span className="min-w-0">
              <span className="line-clamp-1 block text-[6cqw] font-extrabold uppercase leading-tight tracking-[-0.03em]">{t.name}</span>
              <span className="line-clamp-1 block font-mono text-[3.3cqw] uppercase">{t.artists.join(" / ")}</span>
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-[3cqw] font-mono text-[2.8cqw] uppercase">* berdasarkan jumlah putar</p>
    </Frame>
  );
}

function TopAlbum(p: SlideProps) {
  const a = p.stats.topAlbum;
  if (!a) return <Empty {...p} />;
  return (
    <Frame p={p} label="Album" className="bg-acid text-ink">
      <Tag>Album yang paling nempel</Tag>
      <Cover src={a.album.image} className="mx-auto mt-[6cqw] aspect-square w-[64cqw] shadow-[3cqw_3cqw_0_currentColor]" />
      <div className="mt-auto grid grid-cols-[1fr_auto] items-end gap-[4cqw]">
        <div className="min-w-0">
          <h2
            className="line-clamp-3 break-words font-black uppercase leading-[0.9] tracking-[-0.035em]"
            style={{ fontSize: fit(a.album.name, 12, 6.5, 10) }}
          >
            {a.album.name}
          </h2>
          <p className="mt-[2cqw] font-mono text-[3.8cqw] uppercase">{a.artist}</p>
        </div>
        <div className={`${LINE} bg-ink px-[3cqw] py-[2cqw] text-center text-acid`}>
          <p className="text-[11cqw] font-black leading-none tracking-[-0.035em]">{a.count}</p>
          <p className="font-mono text-[2.6cqw] uppercase">/{p.stats.trackCount} lagu</p>
        </div>
      </div>
    </Frame>
  );
}

function Clock(p: SlideProps) {
  const { hours, peakHour, recentCount, recentMinutes } = p.stats;
  const max = Math.max(1, ...hours);
  return (
    <Frame p={p} label="Jam dengar" className="bg-ink text-paper">
      <span className="self-start bg-acid px-[2.5cqw] py-[1cqw] font-mono text-[3.3cqw] uppercase text-ink">Kamu itu tipe</span>
      <h2 className="mt-[4cqw] text-[15cqw] font-black uppercase leading-[0.82] tracking-[-0.045em]">
        {listenerType(peakHour)}
      </h2>
      {peakHour !== null && (
        <p className="mt-[5cqw] font-mono text-[4cqw] uppercase">
          Puncak: <span className="bg-acid px-[1.5cqw] text-ink">{hourLabel(peakHour)}</span>
        </p>
      )}
      <div className="mt-auto">
        <div className="flex h-[42cqw] items-end gap-[0.6cqw] border-b-[0.7cqw] border-current">
          {hours.map((v, h) => (
            <div
              key={h}
              className={`flex-1 ${h === peakHour ? "bg-acid" : "bg-paper"}`}
              style={{ height: `${Math.max(2, (v / max) * 100)}%` }}
            />
          ))}
        </div>
        <div className="mt-[1.5cqw] flex justify-between font-mono text-[3cqw]">
          <span>00</span>
          <span>06</span>
          <span>12</span>
          <span>18</span>
          <span>23</span>
        </div>
        <p className="mt-[4cqw] font-mono text-[3cqw] uppercase opacity-70">
          Dari {recentCount} lagu terakhir · {recentMinutes} menit
        </p>
      </div>
    </Frame>
  );
}

function Numbers(p: SlideProps) {
  const s = p.stats;
  const cells: { value: string; label: string; accent?: boolean }[] = [];
  if (p.range !== "long_term") {
    cells.push({ value: `${s.loyalCount}/${s.loyalTotal}`, label: "lagu top 10 kamu juga favorit jangka panjang", accent: true });
  }
  cells.push({ value: String(s.uniqueArtistsInTop), label: `artis berbeda di top ${s.trackCount} lagu` });
  cells.push({ value: String(s.recentMinutes), label: `menit dari ${s.recentCount} lagu terakhir` });

  return (
    <Frame p={p} label="Angka" className="bg-paper text-ink">
      <h2 className="text-[18cqw] font-black uppercase leading-[0.82] tracking-[-0.045em]">
        Dalam
        <br />
        angka
      </h2>
      <div className={`mt-auto ${LINE} shadow-[2.5cqw_2.5cqw_0_currentColor]`}>
        {cells.map((c, i) => (
          <div
            key={i}
            className={`grid grid-cols-[auto_1fr] items-center gap-[4cqw] px-[4cqw] py-[3.5cqw] ${i ? "border-t-[0.7cqw] border-current" : ""} ${c.accent ? "bg-signal" : "bg-paper"}`}
          >
            <span className="min-w-[24cqw] text-[13cqw] font-black leading-none tracking-[-0.045em]">{c.value}</span>
            <span className="font-mono text-[3.4cqw] uppercase leading-snug">{c.label}</span>
          </div>
        ))}
      </div>
      {s.topGenres.length > 0 && (
        <p className="mt-[5cqw] font-mono text-[3.4cqw] uppercase">
          Genre: <span className="font-bold">{s.topGenres.slice(0, 3).join(" / ")}</span>
        </p>
      )}
    </Frame>
  );
}

function Summary(p: SlideProps) {
  const s = p.stats;
  return (
    <Frame p={p} label="Ringkasan" className="bg-sun text-ink">
      <div className="grid grid-cols-[auto_1fr] items-end gap-[4cqw]">
        <Cover src={s.topArtists[0]?.image ?? null} className="aspect-square w-[30cqw] shadow-[2cqw_2cqw_0_currentColor]" />
        <div className="min-w-0">
          <Tag>Wrapped</Tag>
          <p
            className="mt-[2cqw] break-words font-black uppercase leading-[0.9] tracking-[-0.035em]"
            style={{ fontSize: fit(p.name, 9.5, 5.5, 7) }}
          >
            {p.name}
          </p>
        </div>
      </div>

      <p className="mt-auto text-[34cqw] font-black leading-[0.78] tracking-[-0.06em]">
        {new Date().getFullYear()}
        <span className="text-signal">.</span>
      </p>

      <div className={`mt-[5cqw] grid grid-cols-2 ${LINE} bg-paper shadow-[2.5cqw_2.5cqw_0_currentColor]`}>
        {[
          { title: "Top artis", items: s.topArtists.map((a) => a.name) },
          { title: "Top lagu", items: s.topTracks.map((t) => t.name) },
        ].map((col, ci) => (
          <div key={col.title} className={`min-w-0 ${ci ? "border-l-[0.7cqw] border-current" : ""}`}>
            <p className="border-b-[0.7cqw] border-current bg-ink px-[3cqw] py-[1.5cqw] font-mono text-[3cqw] uppercase text-paper">
              {col.title}
            </p>
            <ol className="space-y-[1.4cqw] px-[3cqw] py-[3cqw]">
              {col.items.map((name, i) => (
                <li key={i} className="flex gap-[2cqw] text-[4cqw] font-bold leading-tight">
                  <span className="font-mono text-[3.4cqw]">{i + 1}</span>
                  <span className="line-clamp-1">{name}</span>
                </li>
              ))}
            </ol>
          </div>
        ))}
        <div className="border-t-[0.7cqw] border-current px-[3cqw] py-[2.5cqw]">
          <p className="font-mono text-[3cqw] uppercase">Album</p>
          <p className="line-clamp-2 text-[4.6cqw] font-black uppercase leading-tight">{s.topAlbum?.album.name ?? "-"}</p>
        </div>
        <div className="border-l-[0.7cqw] border-t-[0.7cqw] border-current bg-signal px-[3cqw] py-[2.5cqw]">
          <p className="font-mono text-[3cqw] uppercase">Tipe</p>
          <p className="line-clamp-2 text-[4.6cqw] font-black uppercase leading-tight">{listenerType(s.peakHour)}</p>
        </div>
      </div>
    </Frame>
  );
}

function Empty(p: SlideProps) {
  return (
    <Frame p={p} label="Kosong" className="bg-paper text-ink">
      <h2 className="mt-auto text-[12cqw] font-black uppercase leading-[0.9] tracking-[-0.035em]">Belum cukup data.</h2>
      <p className="mt-[4cqw] font-mono text-[3.6cqw] uppercase">Dengerin lebih banyak dulu, atau ganti rentang waktunya.</p>
    </Frame>
  );
}

export const SLIDES = [Intro, TopArtist, TopArtists, TopTrack, TopTracks, TopAlbum, Clock, Numbers, Summary];
