"use client";

import { useRouter } from "next/navigation";
import { saveMode } from "@/lib/mode";

export default function ModePicker() {
  const router = useRouter();

  function selectMode(mode: "cepat" | "lengkap") {
    saveMode(mode);
    router.push("/wrapped");
  }

  return (
    <div className="grid gap-6 py-8 sm:grid-cols-2">
      <div className="nextec-hard-card flex flex-col justify-between border-2 border-sec bg-pri p-6 transition-colors hover:border-red">
        <div>
          <div className="mb-2 flex items-center justify-between font-mono text-xs text-sec/60">
            <span className="font-bold text-red">[MODE 01]</span>
            <span className="text-[10px] uppercase tracking-widest">Instan</span>
          </div>
          <h2 className="font-display text-3xl uppercase tracking-wide text-sec sm:text-4xl">
            Cepat
          </h2>
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
            <span className="text-[10px] uppercase tracking-widest">Ekstra</span>
          </div>
          <h2 className="font-display text-3xl uppercase tracking-wide text-sec sm:text-4xl">
            Lengkap
          </h2>
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
  );
}
