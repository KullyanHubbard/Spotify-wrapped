"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toBlob } from "html-to-image";
import { SLIDES } from "./Slides";
import { computeStats } from "@/lib/stats";
import type { TimeRange, WrappedData } from "@/lib/types";

const SHORT_RANGE: Record<TimeRange, string> = { short_term: "4 minggu", medium_term: "6 bulan", long_term: "1 tahun" };

const ERRORS: Record<string, string> = {
  not_allowlisted:
    "Akun Spotify kamu belum terdaftar di app ini. Di Development Mode, pemilik app harus menambahkan email Spotify kamu di Dashboard > Settings > User Management.",
  rate_limited: "Kena rate limit Spotify. Tunggu sebentar lalu coba lagi.",
  spotify_error: "Spotify lagi error. Coba lagi nanti.",
};

export default function WrappedViewer() {
  const [range, setRange] = useState<TimeRange>("medium_term");
  const [data, setData] = useState<WrappedData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [busy, setBusy] = useState(false);
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
        if (!res.ok) setError(ERRORS[body.error] ?? ERRORS.spotify_error);
        else {
          setData(body);
          setError(null);
          setIndex(0);
        }
      })
      .catch(() => !cancelled && setError(ERRORS.spotify_error));
    return () => {
      cancelled = true;
    };
  }, [range]);

  const stats = useMemo(() => (data ? computeStats(data) : null), [data]);

  const go = (delta: number) => setIndex((i) => Math.min(SLIDES.length - 1, Math.max(0, i + delta)));

  async function share() {
    const node = slideRef.current;
    if (!node) return;
    setBusy(true);
    try {
      const w = node.offsetWidth;
      const opts = { pixelRatio: 1080 / w, canvasWidth: w, canvasHeight: (w * 16) / 9 };
      // Safari sering melewatkan gambar di render pertama, jadi render dua kali dan pakai hasil kedua.
      await toBlob(node, opts);
      const blob = await toBlob(node, opts);
      if (!blob) throw new Error("render gagal");
      const file = new File([blob], `wraped-${index + 1}.png`, { type: "image/png" });

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file] });
      } else {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = file.name;
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") alert("Gagal membuat gambar. Coba lagi.");
    } finally {
      setBusy(false);
    }
  }

  if (error) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-6 p-6">
        <span className="self-start bg-signal px-2 py-1 font-mono text-xs uppercase">Error</span>
        <p className="text-2xl font-extrabold leading-tight tracking-tight">{error}</p>
        <a href="/api/auth/login" className="brut self-start bg-acid px-6 py-3 font-mono text-sm font-bold uppercase">
          Login ulang →
        </a>
      </main>
    );
  }

  if (!stats || !data) {
    return (
      <main className="flex min-h-dvh items-center justify-center">
        <p className="animate-pulse font-mono text-sm uppercase">Lagi ngumpulin data kamu...</p>
      </main>
    );
  }

  const Slide = SLIDES[index];
  const width = "min(calc(100vw - 2rem), calc((100dvh - 9rem) * 9 / 16))";

  return (
    <main className="flex min-h-dvh flex-col items-center gap-4 px-4 py-4">
      <div className="flex gap-1" style={{ width }}>
        {SLIDES.map((_, i) => (
          <button
            key={i}
            aria-label={`Slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-2 flex-1 border-2 border-ink ${i <= index ? "bg-ink" : "bg-paper"}`}
          />
        ))}
      </div>

      <div className="relative border-2 border-ink shadow-[6px_6px_0_var(--color-ink)]" style={{ width }}>
        <div ref={slideRef} className="@container aspect-[9/16] w-full overflow-hidden">
          <Slide stats={stats} name={data.user.name} range={data.range} n={index + 1} total={SLIDES.length} />
        </div>
        <button aria-label="Sebelumnya" className="absolute inset-y-0 left-0 w-1/3" onClick={() => go(-1)} />
        <button aria-label="Berikutnya" className="absolute inset-y-0 right-0 w-2/3" onClick={() => go(1)} />
      </div>

      <div className="flex items-stretch gap-3 font-mono text-xs font-bold uppercase" style={{ width }}>
        <select
          value={range}
          onChange={(e) => setRange(e.target.value as TimeRange)}
          className="brut min-w-0 flex-1 appearance-none bg-paper px-3 py-3 uppercase"
        >
          {(Object.keys(SHORT_RANGE) as TimeRange[]).map((r) => (
            <option key={r} value={r}>
              {SHORT_RANGE[r]}
            </option>
          ))}
        </select>
        <button onClick={share} disabled={busy} className="brut shrink-0 bg-acid px-4 py-3 uppercase disabled:opacity-50">
          {busy ? "..." : "Share ↗"}
        </button>
        <form action="/api/auth/logout" method="post" className="flex">
          <button className="brut bg-paper px-3 py-3 uppercase">Keluar</button>
        </form>
      </div>
    </main>
  );
}
