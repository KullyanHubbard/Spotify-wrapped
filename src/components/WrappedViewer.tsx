"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { toBlob } from "html-to-image";
import { DESIGNS, type DesignId } from "@/designs";
import { computeStats } from "@/lib/stats";
import type { TimeRange, WrappedData } from "@/lib/types";

const RANGE_SHORT_LABEL: Record<TimeRange, string> = { short_term: "4 minggu", medium_term: "6 bulan", long_term: "1 tahun" };

const ERROR_MESSAGES: Record<string, string> = {
  not_allowlisted:
    "Akun Spotify kamu belum terdaftar di app ini. Di Development Mode, pemilik app harus menambahkan email Spotify kamu di Dashboard > Settings > User Management.",
  rate_limited: "Kena rate limit Spotify. Tunggu sebentar lalu coba lagi.",
  spotify_error: "Spotify lagi error. Coba lagi nanti.",
};

export default function WrappedViewer({ design }: { design: DesignId }) {
  const { slides, fontClassName } = DESIGNS[design];
  const [range, setRange] = useState<TimeRange>("medium_term");
  const [data, setData] = useState<WrappedData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [exporting, setExporting] = useState(false);
  const slideRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/wrapped?range=${range}`)
      .then(async (res) => {
        if (res.status === 401) {
          // Route Handler (bukan halaman), jadi butuh full navigation, bukan router.push.
          // eslint-disable-next-line @next/next/no-location-assign-relative-destination
          window.location.href = "/api/auth/login";
          return;
        }
        const body = await res.json();
        if (cancelled) return;
        if (!res.ok) setError(ERROR_MESSAGES[body.error] ?? ERROR_MESSAGES.spotify_error);
        else {
          setData(body);
          setError(null);
          setIndex(0);
        }
      })
      .catch(() => !cancelled && setError(ERROR_MESSAGES.spotify_error));
    return () => {
      cancelled = true;
    };
  }, [range]);

  const stats = useMemo(() => (data ? computeStats(data) : null), [data]);

  const step = (delta: number) => setIndex((i) => Math.min(slides.length - 1, Math.max(0, i + delta)));

  async function shareSlide() {
    const node = slideRef.current;
    if (!node) return;
    setExporting(true);
    try {
      const w = node.offsetWidth;
      const opts = { pixelRatio: 1080 / w, canvasWidth: w, canvasHeight: (w * 16) / 9 };
      // Safari sering melewatkan gambar di render pertama, jadi render dua kali dan pakai hasil kedua.
      await toBlob(node, opts);
      const blob = await toBlob(node, opts);
      if (!blob) throw new Error("render gagal");
      const file = new File([blob], `wraped-${index + 1}.png`, { type: "image/png" });

      const download = () => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = file.name;
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      };

      if (navigator.canShare?.({ files: [file] })) {
        // Safari menolak share (NotAllowedError) kalau render terlalu lama sejak tap; fallback ke download.
        await navigator.share({ files: [file] }).catch((e: Error) => {
          if (e.name !== "NotAllowedError") throw e;
          download();
        });
      } else {
        download();
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") alert("Gagal membuat gambar. Coba lagi.");
    } finally {
      setExporting(false);
    }
  }

  if (error) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-5 p-6">
        <span className="border-b border-ink pb-2 text-xs font-semibold uppercase tracking-[0.25em] text-press-red">Ralat</span>
        <p className="font-headline text-3xl font-bold leading-tight">{error}</p>
        <a
          href="/api/auth/login"
          className="self-start bg-ink px-6 py-3 font-headline text-lg font-bold text-newsprint transition-colors hover:bg-press-red"
        >
          Login ulang →
        </a>
      </main>
    );
  }

  if (!stats || !data) {
    return (
      <main className="flex min-h-dvh items-center justify-center">
        <p className="animate-pulse font-headline text-xl italic">Sedang naik cetak…</p>
      </main>
    );
  }

  const Slide = slides[index];
  const slideWidth = "min(calc(100vw - 2rem), calc((100dvh - 9rem) * 9 / 16))";

  return (
    <main className="flex min-h-dvh flex-col items-center gap-4 bg-newsprint px-4 py-4">
      <div className="flex gap-1" style={{ width: slideWidth }}>
        {slides.map((_, i) => (
          <button
            key={i}
            aria-label={`Slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-1.5 flex-1 ${i <= index ? "bg-ink" : "bg-ink/15"}`}
          />
        ))}
      </div>

      <div className="relative border-4 border-double border-ink" style={{ width: slideWidth }}>
        <div ref={slideRef} className={`@container aspect-[9/16] w-full overflow-hidden ${fontClassName}`}>
          <Slide
            stats={stats}
            name={data.user.name}
            range={data.range}
            year={new Date().getFullYear()}
            n={index + 1}
            total={slides.length}
          />
        </div>
        <button aria-label="Sebelumnya" className="absolute inset-y-0 left-0 w-1/3" onClick={() => step(-1)} />
        <button aria-label="Berikutnya" className="absolute inset-y-0 right-0 w-2/3" onClick={() => step(1)} />
      </div>

      <div className="flex items-stretch gap-2 text-sm font-semibold" style={{ width: slideWidth }}>
        <select
          aria-label="Rentang waktu"
          value={range}
          onChange={(e) => setRange(e.target.value as TimeRange)}
          className="min-w-0 flex-1 appearance-none border border-ink bg-newsprint px-3 py-2.5"
        >
          {(Object.keys(RANGE_SHORT_LABEL) as TimeRange[]).map((r) => (
            <option key={r} value={r}>
              {RANGE_SHORT_LABEL[r]}
            </option>
          ))}
        </select>
        <button onClick={shareSlide} disabled={exporting} className="shrink-0 bg-ink px-4 py-2.5 text-newsprint transition-colors hover:bg-press-red disabled:opacity-50">
          {exporting ? "..." : "Share ↗"}
        </button>
        <Link href="/wrapped" className="flex items-center border border-ink px-3 py-2.5 hover:bg-ink/5">
          Design
        </Link>
        <form action="/api/auth/logout" method="post" className="flex">
          <button className="border border-ink px-3 py-2.5 hover:bg-ink/5">Keluar</button>
        </form>
      </div>
    </main>
  );
}
