"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { saveMode } from "@/lib/mode";
import {
  PLATFORM_STATUS_LABEL,
  WRAPPED_PLATFORMS,
  type WrappedPlatformConfig,
  type WrappedPlatformId,
} from "@/lib/wrapped-platforms";

const FOCUS_RING = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red";

function PlatformIcon({ platform }: { platform: WrappedPlatformConfig }) {
  return (
    <svg viewBox="0 0 24 24" className="h-9 w-9 shrink-0" aria-hidden="true" shapeRendering="crispEdges">
      <path d={platform.iconPath} fill="currentColor" fillRule="evenodd" />
    </svg>
  );
}

export default function ModePicker({ themeCount }: { themeCount: number }) {
  const router = useRouter();
  const [platformId, setPlatformId] = useState<WrappedPlatformId>("spotify");
  const detailRef = useRef<HTMLElement>(null);
  const platform = WRAPPED_PLATFORMS.find((p) => p.id === platformId) ?? WRAPPED_PLATFORMS[0];

  function selectMode(mode: "cepat" | "lengkap") {
    saveMode(mode);
    router.push("/wrapped");
  }

  function selectPlatform(id: WrappedPlatformId) {
    setPlatformId(id);
    // Di layar sempit Tahap 02 ada di bawah lipatan; tanpa scroll, klik kartu terasa tidak berbuat apa-apa.
    const detail = detailRef.current;
    if (detail && detail.getBoundingClientRect().top > window.innerHeight * 0.6) {
      const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      detail.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
    }
  }

  return (
    <div className="flex flex-col gap-12 py-8">
      <section aria-labelledby="tahap-platform">
        <h2 id="tahap-platform" className="mb-5 font-mono text-xs font-bold uppercase tracking-wider text-sec">
          Tahap 01 · Pilih platform Wrapped
        </h2>

        {/* Spotify satu-satunya yang sudah jalan, jadi kartunya paling besar. */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {WRAPPED_PLATFORMS.map((p) => {
            const selected = p.id === platformId;
            const ready = p.status === "ready";
            return (
              <button
                key={p.id}
                type="button"
                aria-pressed={selected}
                onClick={() => selectPlatform(p.id)}
                className={`nextec-hard-card flex cursor-pointer flex-col gap-3 p-5 text-left ${FOCUS_RING} ${
                  selected ? "bg-sec text-pri [--nextec-hard-shadow:#fb2c36]" : "bg-pri text-sec"
                } ${ready ? "sm:col-span-2 lg:row-span-2 lg:p-7" : ""}`}
              >
                <div className="flex w-full items-start justify-between gap-3">
                  <PlatformIcon platform={p} />
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider">
                    {selected ? "Dipilih · " : ""}
                    {PLATFORM_STATUS_LABEL[p.status]}
                  </span>
                </div>
                <span
                  className={`self-start border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide ${
                    selected ? "border-pri/60" : "border-sec/40"
                  }`}
                >
                  {p.category}
                </span>
                <span
                  className={`font-display uppercase leading-none tracking-wide ${ready ? "text-4xl sm:text-5xl" : "text-2xl"}`}
                >
                  {p.name}
                </span>
                <span className={`font-body text-xs leading-relaxed ${selected ? "text-pri/80" : "text-sec/75"}`}>
                  {p.description}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section ref={detailRef} aria-labelledby="tahap-sumber" className="scroll-mt-6">
        <h2 id="tahap-sumber" aria-live="polite" className="mb-5 font-mono text-xs font-bold uppercase tracking-wider text-sec">
          Tahap 02 · Sumber data {platform.shortName}
        </h2>

        {platform.status === "ready" ? (
          <>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="nextec-hard-card flex flex-col justify-between border-2 border-sec bg-pri p-6 transition-colors hover:border-red">
                <div>
                  <div className="mb-2 flex items-center justify-between font-mono text-xs text-sec/60">
                    <span className="font-bold text-red">[MODE 01]</span>
                    <span className="text-[10px] uppercase tracking-widest">Via Web API</span>
                  </div>
                  <h3 className="font-display text-3xl uppercase tracking-wide text-sec sm:text-4xl">Cepat</h3>
                  <p className="mt-3 font-body text-xs leading-relaxed text-sec/75 sm:text-sm">
                    Langsung jadi dari data Spotify. Menit dihitung dari 50 lagu terakhir.
                  </p>
                </div>

                <div className="mt-6 border-t border-sec/20 pt-4">
                  <button
                    type="button"
                    onClick={() => selectMode("cepat")}
                    className="nextec-hard-button w-full cursor-pointer bg-pri px-4 py-3 font-mono text-xs uppercase font-bold text-sec transition-colors hover:bg-sec hover:text-pri focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red"
                  >
                    Pakai mode cepat
                  </button>
                </div>
              </div>

              <div className="nextec-hard-card flex flex-col justify-between border-2 border-sec bg-pri p-6 transition-colors hover:border-red">
                <div>
                  <div className="mb-2 flex items-center justify-between font-mono text-xs text-sec/60">
                    <span className="font-bold text-red">[MODE 02]</span>
                    <span className="text-[10px] uppercase tracking-widest">Upload file riwayat</span>
                  </div>
                  <h3 className="font-display text-3xl uppercase tracking-wide text-sec sm:text-4xl">Lengkap</h3>
                  <p className="mt-3 font-body text-xs leading-relaxed text-sec/75 sm:text-sm">
                    Total menit asli setahun dari file riwayat Spotify. File bisa kamu upload sekarang atau nanti.
                  </p>
                </div>

                <div className="mt-6 border-t border-sec/20 pt-4">
                  <button
                    type="button"
                    onClick={() => selectMode("lengkap")}
                    className="nextec-hard-button w-full cursor-pointer bg-red px-4 py-3 font-mono text-xs uppercase font-bold text-[#fff5ef] transition-colors hover:bg-sec hover:text-pri focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red"
                  >
                    Pakai mode lengkap
                  </button>
                </div>
              </div>
            </div>

            <p className="mt-6 font-body text-xs leading-relaxed text-sec/75 sm:text-sm">
              Belum masuk ke Spotify?{" "}
              <a href="/api/auth/login" className={`font-bold text-sec underline underline-offset-4 hover:text-red ${FOCUS_RING}`}>
                Masuk dengan Spotify
              </a>{" "}
              dulu, lalu pilih mode di atas.
            </p>
          </>
        ) : (
          <div className="nextec-hard-card flex flex-col gap-6 bg-pri p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <PlatformIcon platform={platform} />
              <h3 className="font-display text-3xl uppercase leading-none tracking-wide sm:text-4xl">{platform.name}</h3>
              <span className="border-2 border-sec px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider">
                {PLATFORM_STATUS_LABEL[platform.status]}
              </span>
            </div>

            <dl className="grid gap-6 md:grid-cols-3">
              <div>
                <dt className="font-mono text-[11px] font-bold uppercase tracking-wider">Cara mengambil data</dt>
                <dd className="mt-2 font-body text-xs leading-relaxed text-sec/75 sm:text-sm">{platform.dataMethod}</dd>
              </div>
              <div>
                <dt className="font-mono text-[11px] font-bold uppercase tracking-wider">Slide yang akan dibuat</dt>
                <dd className="mt-2">
                  <ul className="flex flex-col gap-1 font-body text-xs leading-relaxed text-sec/75 sm:text-sm">
                    {platform.highlights.map((h) => (
                      <li key={h}>· {h}</li>
                    ))}
                  </ul>
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[11px] font-bold uppercase tracking-wider">Privasi</dt>
                <dd className="mt-2 font-body text-xs leading-relaxed text-sec/75 sm:text-sm">{platform.privacy}</dd>
              </div>
            </dl>

            <div className="flex flex-wrap gap-3 border-t border-sec/20 pt-5">
              <Link
                href="/wrapped"
                className="nextec-hard-button inline-flex items-center justify-center bg-pri px-5 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-sec"
              >
                Lihat {themeCount} gaya desain (contoh data Spotify)
              </Link>
              <button
                type="button"
                onClick={() => setPlatformId("spotify")}
                className="nextec-hard-button cursor-pointer bg-red px-5 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-[#fff5ef]"
              >
                Kembali ke Spotify
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
