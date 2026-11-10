"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { toBlob } from "html-to-image";
import { DESIGNS, type DesignId } from "@/designs";
import { PREVIEW_SAMPLE } from "@/designs/preview-sample";
import { parseHistoryStats } from "@/lib/history";
import { MODE_KEY, useMode } from "@/lib/mode";
import { computeStats, statsFromHistory } from "@/lib/stats";
import type { TimeRange, WrappedData } from "@/lib/types";

const STORAGE_KEY = "wrapped.history.v2";
const LEGACY_STORAGE_KEY = "wrapped.history.v1";

function subscribeHistory(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("wrapped:history-change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("wrapped:history-change", callback);
  };
}

function getHistorySnapshot(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function getServerHistorySnapshot(): string | null {
  return null;
}

const RANGE_SHORT_LABEL: Record<TimeRange, string> = {
  short_term: "4 minggu",
  medium_term: "6 bulan",
  long_term: "1 tahun",
};

const ERROR_MESSAGES: Record<string, string> = {
  not_allowlisted:
    "Akun Spotify kamu belum terdaftar di app ini. Di Development Mode, pemilik app harus menambahkan email Spotify kamu di Dashboard > Settings > User Management.",
  rate_limited: "Kena rate limit Spotify. Tunggu sebentar lalu coba lagi.",
  spotify_error: "Spotify lagi error. Coba lagi nanti.",
};

async function generateSlideBlob(node: HTMLElement): Promise<Blob> {
  const width = node.offsetWidth;
  const options = { pixelRatio: 1080 / width, canvasWidth: width, canvasHeight: (width * 16) / 9 };
  // Safari membutuhkan dua pass render agar gambar di SVG foreignObject ter-decode sempurna
  await toBlob(node, options);
  const blob = await toBlob(node, options);
  if (!blob) throw new Error("Render canvas gagal");
  return blob;
}

export default function WrappedViewer({ design }: { design: DesignId }) {
  const { slides, totalMinutesSlide, fontClassName } = DESIGNS[design];
  const [range, setRange] = useState<TimeRange>("medium_term");
  const [data, setData] = useState<WrappedData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [index, setIndex] = useState(0);
  const [exporting, setExporting] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const slideRef = useRef<HTMLDivElement>(null);
  const cachedBlobRef = useRef<{ index: number; range: TimeRange; blob: Blob } | null>(null);
  const hintTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const mode = useMode();
  const currentYear = new Date().getFullYear();
  const rawHistory = useSyncExternalStore(subscribeHistory, getHistorySnapshot, getServerHistorySnapshot);
  const storedHistory = useMemo(() => (mode === "lengkap" ? parseHistoryStats(rawHistory) : null), [mode, rawHistory]);
  // Ringkasan tanpa pemilik diklaim akun pertama yang membukanya; milik akun lain tidak pernah ditampilkan.
  const userId = data?.user.id;
  const historyStats = storedHistory && userId && (storedHistory.ownerId ?? userId) === userId ? storedHistory : null;

  useEffect(() => {
    if (!storedHistory || !userId) return;
    try {
      if (storedHistory.ownerId === undefined) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...storedHistory, ownerId: userId }));
      } else if (storedHistory.ownerId !== userId) {
        localStorage.removeItem(STORAGE_KEY);
      } else return;
      window.dispatchEvent(new Event("wrapped:history-change"));
    } catch {}
  }, [storedHistory, userId]);

  const stats = useMemo(() => {
    if (!data) return null;
    if (mode === "lengkap") {
      return historyStats ? statsFromHistory(historyStats) : PREVIEW_SAMPLE.stats;
    }
    return computeStats(data);
  }, [data, mode, historyStats]);

  const activeSlides = useMemo(() => {
    if (stats?.history && totalMinutesSlide) {
      return [slides[0], totalMinutesSlide, ...slides.slice(1)];
    }
    return slides;
  }, [slides, totalMinutesSlide, stats?.history]);

  const safeIndex = Math.min(index, Math.max(0, activeSlides.length - 1));

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") setIndex(Math.max(0, safeIndex - 1));
      else if (e.key === "ArrowRight") setIndex(Math.min(activeSlides.length - 1, safeIndex + 1));
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeSlides.length, safeIndex]);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/wrapped?range=${range}`)
      .then(async (res) => {
        if (res.status === 401) {
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
  }, [range, attempt]);

  const step = (delta: number) => setIndex(Math.min(activeSlides.length - 1, Math.max(0, safeIndex + delta)));

  // Pre-render blob di background saat slide aktif atau data berganti.
  // Menjaga agar saat tombol Share ditekan di iOS Safari, navigator.share terpanggil instan tanpa NotAllowedError.
  useEffect(() => {
    let active = true;
    cachedBlobRef.current = null;

    const timer = setTimeout(async () => {
      const node = slideRef.current;
      if (!node || !active) return;
      try {
        const blob = await generateSlideBlob(node);
        if (active) cachedBlobRef.current = { index: safeIndex, range, blob };
      } catch {
        // Blob cache gagal, fallback ke render on-demand
      }
    }, 450);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [safeIndex, range, stats]);

  async function shareSlide() {
    const node = slideRef.current;
    if (!node || exporting) return;
    setExporting(true);

    try {
      let blob: Blob;
      if (cachedBlobRef.current && cachedBlobRef.current.index === safeIndex && cachedBlobRef.current.range === range) {
        blob = cachedBlobRef.current.blob;
      } else {
        blob = await generateSlideBlob(node);
      }

      const fileName = `wrapped-${range}-${safeIndex + 1}.png`;
      const file = new File([blob], fileName, { type: "image/png" });

      const download = () => {
        const anchor = document.createElement("a");
        anchor.href = URL.createObjectURL(blob);
        anchor.download = fileName;
        anchor.click();
        setTimeout(() => URL.revokeObjectURL(anchor.href), 1000);
      };

      if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
        try {
          if (navigator.canShare && !navigator.canShare({ files: [file] })) {
            download();
            return;
          }
          // Hanya files (tanpa text/title), supaya Instagram Stories muncul sebagai target share di iOS/Android.
          await navigator.share({ files: [file] });
        } catch (err) {
          if ((err as Error).name === "AbortError") return;

          if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);
          setHint("Buka via browser biasa (Safari/Chrome) untuk langsung share ke Story");
          hintTimeoutRef.current = setTimeout(() => setHint(null), 5000);
          download();
        }
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
      <main className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center gap-6 p-6 bg-pri text-sec">
        <div className="nextec-hard-card border-2 border-red bg-pri p-6 sm:p-8 flex flex-col gap-4">
          <div className="flex items-center justify-between font-mono text-xs text-red font-bold uppercase tracking-widest border-b border-red/30 pb-3">
            <span>[ERR-500 {"//"} TELEMETRI GAGAL]</span>
            <span className="h-2 w-2 bg-red animate-pulse" />
          </div>
          <p className="font-body text-sm sm:text-base leading-relaxed text-sec/90">{error}</p>
          <div className="flex flex-wrap gap-3 pt-3 border-t border-sec/20">
            <button
              onClick={() => {
                setError(null);
                setData(null);
                setAttempt((n) => n + 1);
              }}
              className="nextec-hard-button bg-red px-6 py-3 font-mono text-xs font-bold uppercase tracking-wider text-[#fff5ef]"
            >
              Coba Lagi
            </button>
            <a
              href="/api/auth/login"
              className="nextec-hard-button bg-pri px-6 py-3 font-mono text-xs font-bold uppercase tracking-wider text-sec"
            >
              Login Ulang →
            </a>
          </div>
        </div>
      </main>
    );
  }

  if (!stats || !data) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center bg-pri text-sec gap-4 p-6">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 bg-red animate-ping" />
          <span className="h-2.5 w-2.5 bg-sec animate-pulse" />
        </div>
        <p className="font-display text-4xl sm:text-5xl uppercase tracking-wider text-center">
          Mengumpulkan Telemetri...
        </p>
        <p className="font-mono text-xs text-sec/60 uppercase tracking-widest text-center">
          Sinkronisasi data Spotify Web API {"//"} Mohon tunggu
        </p>
      </main>
    );
  }

  const Slide = activeSlides[safeIndex] ?? activeSlides[0];
  const slideWidth = "min(calc(100vw - 2rem), calc((100dvh - 9rem) * 9 / 16))";

  return (
    <main className="flex min-h-dvh flex-col items-center gap-4 bg-pri text-sec px-4 py-4">
      {mode === "lengkap" && !historyStats && (
        <div
          role="status"
          style={{ width: slideWidth }}
          className="border-2 border-sec bg-pri px-3 py-2 font-mono text-xs leading-snug text-sec break-words"
        >
          Ini contoh. Upload file riwayat di{" "}
          <Link href="/wrapped" className="font-bold text-red underline hover:text-sec">
            halaman pilih design
          </Link>{" "}
          untuk melihat datamu.
        </div>
      )}

      <div className="flex gap-1.5" style={{ width: slideWidth }}>
        {activeSlides.map((_, i) => (
          <button
            key={i}
            aria-label={`Slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-2 flex-1 transition-colors ${i <= safeIndex ? "bg-red" : "bg-sec/20"}`}
          />
        ))}
      </div>

      <div className="relative border-2 border-sec shadow-[8px_8px_0_var(--color-sec)]" style={{ width: slideWidth }}>
        <div ref={slideRef} className={`@container aspect-[9/16] w-full overflow-hidden ${fontClassName}`}>
          <Slide
            stats={stats}
            name={data.user.name}
            range={data.range}
            year={historyStats?.year ?? currentYear}
            n={safeIndex + 1}
            total={activeSlides.length}
          />
        </div>
        <button aria-label="Sebelumnya" className="absolute inset-y-0 left-0 w-1/3" onClick={() => step(-1)} />
        <button aria-label="Berikutnya" className="absolute inset-y-0 right-0 w-2/3" onClick={() => step(1)} />
      </div>

      {hint && (
        <div
          role="status"
          style={{ width: slideWidth }}
          className="border border-red bg-red/10 px-3 py-2 text-center font-mono text-xs text-red font-bold uppercase tracking-wider"
        >
          {hint}
        </div>
      )}

      <div className="flex items-stretch gap-2 font-mono text-xs font-bold uppercase" style={{ width: slideWidth }}>
        {mode !== "lengkap" && (
          <select
            aria-label="Rentang waktu"
            value={range}
            onChange={(e) => {
              setData(null);
              setRange(e.target.value as TimeRange);
            }}
            className="nextec-hard-button min-w-0 flex-1 appearance-none bg-pri text-sec px-3 py-2.5 cursor-pointer uppercase"
          >
            {(Object.keys(RANGE_SHORT_LABEL) as TimeRange[]).map((r) => (
              <option key={r} value={r} className="bg-pri text-sec">
                {RANGE_SHORT_LABEL[r]}
              </option>
            ))}
          </select>
        )}
        <button
          onClick={shareSlide}
          disabled={exporting}
          title="Bagikan ke Instagram Story"
          className={`nextec-hard-button bg-red px-4 py-2.5 text-[#fff5ef] disabled:opacity-50 ${mode === "lengkap" ? "flex-1" : "shrink-0"}`}
        >
          {exporting ? "..." : "Share ↗"}
        </button>
        <Link href="/wrapped" className="nextec-hard-button flex items-center bg-pri text-sec px-3 py-2.5">
          Design
        </Link>
        <form
          action="/api/auth/logout"
          method="post"
          className="flex"
          onSubmit={() => {
            // Browser bersama: riwayat dan mode tidak terikat akun, jangan sampai terbaca user berikutnya.
            try {
              localStorage.removeItem(STORAGE_KEY);
              localStorage.removeItem(LEGACY_STORAGE_KEY);
              localStorage.removeItem(MODE_KEY);
            } catch {}
          }}
        >
          <button className="nextec-hard-button bg-pri text-sec px-3 py-2.5">Keluar</button>
        </form>
      </div>
    </main>
  );
}
