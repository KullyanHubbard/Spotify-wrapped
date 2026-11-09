"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toBlob } from "html-to-image";
import { SLIDES } from "./Slides";
import { computeStats, RANGE_LABEL } from "@/lib/stats";
import type { TimeRange, WrappedData } from "@/lib/types";

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
      <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-6 p-6 text-center">
        <p className="text-lg">{error}</p>
        <a href="/api/auth/login" className="rounded-full bg-[#1DB954] px-6 py-3 font-bold text-black">
          Login ulang
        </a>
      </main>
    );
  }

  if (!stats || !data) {
    return <main className="flex min-h-dvh items-center justify-center text-lg opacity-70">Lagi ngumpulin data kamu...</main>;
  }

  const Slide = SLIDES[index];

  return (
    <main className="flex min-h-dvh flex-col items-center gap-3 py-3">
      <div className="relative" style={{ width: "min(100vw, calc((100dvh - 7.5rem) * 9 / 16))" }}>
        <div ref={slideRef} className="@container aspect-[9/16] w-full overflow-hidden sm:rounded-2xl">
          <Slide stats={stats} name={data.user.name} range={data.range} />
        </div>

        <div className="pointer-events-none absolute inset-x-3 top-3 flex gap-1">
          {SLIDES.map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full ${i <= index ? "bg-white" : "bg-white/30"}`} />
          ))}
        </div>
        <button aria-label="Sebelumnya" className="absolute inset-y-0 left-0 w-1/3" onClick={() => go(-1)} />
        <button aria-label="Berikutnya" className="absolute inset-y-0 right-0 w-2/3" onClick={() => go(1)} />
      </div>

      <div className="flex w-full max-w-md items-center gap-2 px-4">
        <select
          value={range}
          onChange={(e) => setRange(e.target.value as TimeRange)}
          className="flex-1 rounded-full bg-neutral-800 px-4 py-3 text-sm"
        >
          {(Object.keys(RANGE_LABEL) as TimeRange[]).map((r) => (
            <option key={r} value={r}>
              {RANGE_LABEL[r]}
            </option>
          ))}
        </select>
        <button
          onClick={share}
          disabled={busy}
          className="shrink-0 rounded-full bg-[#1DB954] px-5 py-3 text-sm font-bold text-black disabled:opacity-50"
        >
          {busy ? "Membuat..." : "Share"}
        </button>
        <form action="/api/auth/logout" method="post">
          <button className="rounded-full bg-neutral-800 px-4 py-3 text-sm">Keluar</button>
        </form>
      </div>
    </main>
  );
}
