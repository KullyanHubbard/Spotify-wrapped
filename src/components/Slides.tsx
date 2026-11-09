/* eslint-disable @next/next/no-img-element -- html-to-image butuh <img> biasa, bukan next/image */
import type { ReactNode } from "react";
import { hourLabel, img, listenerType, RANGE_LABEL, type Stats } from "@/lib/stats";
import type { TimeRange } from "@/lib/types";

type Props = { stats: Stats; name: string; range: TimeRange };

function Frame({ bg, children }: { bg: string; children: ReactNode }) {
  return (
    <div className={`flex h-full w-full flex-col justify-between p-[7cqw] pt-[11cqw] text-white ${bg}`}>
      {children}
      <div className="flex items-center justify-between text-[3cqw] font-semibold uppercase tracking-widest opacity-70">
        <span>Wraped</span>
        <span>spotify stats</span>
      </div>
    </div>
  );
}

function Cover({ src, className = "" }: { src: string | null; className?: string }) {
  const url = img(src);
  return url ? (
    <img src={url} alt="" crossOrigin="anonymous" className={`object-cover ${className}`} />
  ) : (
    <div className={`bg-white/20 ${className}`} />
  );
}

function Intro({ name, range }: Props) {
  return (
    <Frame bg="bg-gradient-to-br from-[#1DB954] via-[#0f6b33] to-black">
      <div className="mt-[20cqw]">
        <p className="text-[5cqw] font-semibold opacity-80">Hai, {name}</p>
        <h1 className="mt-[3cqw] text-[14cqw] font-black leading-[0.95]">Ini musik kamu.</h1>
        <p className="mt-[5cqw] text-[5cqw] opacity-80">Rangkuman {RANGE_LABEL[range]}.</p>
      </div>
    </Frame>
  );
}

function TopArtist({ stats }: Props) {
  const a = stats.topArtists[0];
  if (!a) return <Empty />;
  return (
    <Frame bg="bg-gradient-to-b from-[#7c3aed] to-[#1e0b3a]">
      <p className="text-[5.5cqw] font-bold">Artis nomor satu kamu</p>
      <Cover src={a.image} className="mx-auto aspect-square w-[75cqw] rounded-full shadow-2xl" />
      <h2 className="text-center text-[11cqw] font-black leading-none">{a.name}</h2>
    </Frame>
  );
}

function TopArtists({ stats }: Props) {
  return (
    <Frame bg="bg-gradient-to-b from-[#f97316] to-[#431407]">
      <p className="text-[6cqw] font-bold">Top artis kamu</p>
      <ol className="space-y-[4cqw]">
        {stats.topArtists.map((a, i) => (
          <li key={a.id} className="flex items-center gap-[4cqw]">
            <span className="w-[7cqw] text-[7cqw] font-black">{i + 1}</span>
            <Cover src={a.image} className="aspect-square w-[17cqw] rounded-full" />
            <span className="line-clamp-2 text-[6cqw] font-bold leading-tight">{a.name}</span>
          </li>
        ))}
      </ol>
      <span />
    </Frame>
  );
}

function TopTrack({ stats }: Props) {
  const t = stats.topTracks[0];
  if (!t) return <Empty />;
  return (
    <Frame bg="bg-gradient-to-b from-[#ec4899] to-[#3b0420]">
      <p className="text-[5.5cqw] font-bold">Lagu yang paling sering kamu putar</p>
      <Cover src={t.album.image} className="mx-auto aspect-square w-[75cqw] rounded-lg shadow-2xl" />
      <div className="text-center">
        <h2 className="line-clamp-2 text-[9cqw] font-black leading-none">{t.name}</h2>
        <p className="mt-[2cqw] text-[5cqw] opacity-80">{t.artists.join(", ")}</p>
      </div>
    </Frame>
  );
}

function TopTracks({ stats }: Props) {
  return (
    <Frame bg="bg-gradient-to-b from-[#0ea5e9] to-[#082f49]">
      <p className="text-[6cqw] font-bold">Top lagu kamu</p>
      <ol className="space-y-[4cqw]">
        {stats.topTracks.map((t, i) => (
          <li key={t.id} className="flex items-center gap-[4cqw]">
            <span className="w-[7cqw] text-[7cqw] font-black">{i + 1}</span>
            <Cover src={t.album.image} className="aspect-square w-[17cqw] rounded" />
            <span className="min-w-0">
              <span className="line-clamp-1 block text-[5.5cqw] font-bold">{t.name}</span>
              <span className="line-clamp-1 block text-[4cqw] opacity-75">{t.artists.join(", ")}</span>
            </span>
          </li>
        ))}
      </ol>
      <span />
    </Frame>
  );
}

function TopAlbum({ stats }: Props) {
  const a = stats.topAlbum;
  if (!a) return <Empty />;
  return (
    <Frame bg="bg-gradient-to-b from-[#eab308] to-[#422006]">
      <p className="text-[5.5cqw] font-bold">Album yang paling nempel</p>
      <Cover src={a.album.image} className="mx-auto aspect-square w-[70cqw] rounded-lg shadow-2xl" />
      <div className="text-center">
        <h2 className="line-clamp-2 text-[9cqw] font-black leading-none">{a.album.name}</h2>
        <p className="mt-[2cqw] text-[5cqw] opacity-80">
          {a.artist} · {a.count} lagu di top {stats.trackCount} kamu
        </p>
      </div>
    </Frame>
  );
}

function Clock({ stats }: Props) {
  const max = Math.max(1, ...stats.hours);
  return (
    <Frame bg="bg-gradient-to-b from-[#14b8a6] to-[#042f2e]">
      <div>
        <p className="text-[5.5cqw] font-bold">Kamu itu tipe</p>
        <h2 className="mt-[2cqw] text-[11cqw] font-black leading-none">{listenerType(stats.peakHour)}</h2>
        {stats.peakHour !== null && (
          <p className="mt-[4cqw] text-[5cqw] opacity-85">
            Paling sering muter musik sekitar jam {hourLabel(stats.peakHour)}.
          </p>
        )}
      </div>
      <div className="flex h-[40cqw] items-end gap-[0.8cqw]">
        {stats.hours.map((v, h) => (
          <div
            key={h}
            className={`flex-1 rounded-t ${h === stats.peakHour ? "bg-white" : "bg-white/35"}`}
            style={{ height: `${Math.max(3, (v / max) * 100)}%` }}
          />
        ))}
      </div>
      <p className="text-[3.8cqw] opacity-70">
        Dari {stats.recentCount} lagu terakhir ({stats.recentMinutes} menit).
      </p>
    </Frame>
  );
}

function Loyalty({ stats, range }: Props) {
  const genres = stats.topGenres;
  return (
    <Frame bg="bg-gradient-to-b from-[#ef4444] to-[#450a0a]">
      <div className="mt-[10cqw] space-y-[10cqw]">
        {range !== "long_term" && (
          <div>
            <p className="text-[22cqw] font-black leading-none">
              {stats.loyalCount}/{stats.loyalTotal}
            </p>
            <p className="text-[5.5cqw] font-bold">lagu top 10 kamu juga favorit jangka panjangmu.</p>
          </div>
        )}
        <div>
          <p className="text-[22cqw] font-black leading-none">{stats.uniqueArtistsInTop}</p>
          <p className="text-[5.5cqw] font-bold">artis berbeda di top {stats.trackCount} lagu kamu.</p>
        </div>
        {genres.length > 0 && (
          <div>
            <p className="text-[5.5cqw] font-bold">Genre teratas</p>
            <p className="text-[7cqw] font-black capitalize leading-tight">{genres.slice(0, 3).join(", ")}</p>
          </div>
        )}
      </div>
    </Frame>
  );
}

function Summary({ stats, name, range }: Props) {
  const hero = stats.topArtists[0];
  return (
    <Frame bg="bg-gradient-to-b from-[#1DB954] to-[#052e16]">
      <div className="flex items-center gap-[5cqw]">
        <Cover src={hero?.image ?? null} className="aspect-square w-[32cqw] rounded-lg" />
        <div>
          <p className="text-[4cqw] uppercase tracking-widest opacity-75">{RANGE_LABEL[range]}</p>
          <h2 className="text-[8cqw] font-black leading-tight">{name}</h2>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-[5cqw]">
        <div>
          <p className="mb-[2cqw] text-[4cqw] font-bold opacity-75">Top Artis</p>
          <ol className="space-y-[1.5cqw] text-[4.3cqw] font-bold">
            {stats.topArtists.map((a, i) => (
              <li key={a.id} className="line-clamp-1">
                {i + 1} {a.name}
              </li>
            ))}
          </ol>
        </div>
        <div>
          <p className="mb-[2cqw] text-[4cqw] font-bold opacity-75">Top Lagu</p>
          <ol className="space-y-[1.5cqw] text-[4.3cqw] font-bold">
            {stats.topTracks.map((t, i) => (
              <li key={t.id} className="line-clamp-1">
                {i + 1} {t.name}
              </li>
            ))}
          </ol>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-[5cqw]">
        <div>
          <p className="text-[4cqw] font-bold opacity-75">Album</p>
          <p className="line-clamp-2 text-[5cqw] font-black">{stats.topAlbum?.album.name ?? "-"}</p>
        </div>
        <div>
          <p className="text-[4cqw] font-bold opacity-75">Tipe</p>
          <p className="text-[5cqw] font-black">{listenerType(stats.peakHour)}</p>
        </div>
      </div>
    </Frame>
  );
}

function Empty() {
  return (
    <Frame bg="bg-neutral-900">
      <p className="mt-[30cqw] text-center text-[6cqw] font-bold">
        Belum cukup data. Coba dengerin lebih banyak dulu, atau ganti rentang waktunya.
      </p>
    </Frame>
  );
}

export const SLIDES = [Intro, TopArtist, TopArtists, TopTrack, TopTracks, TopAlbum, Clock, Loyalty, Summary];
