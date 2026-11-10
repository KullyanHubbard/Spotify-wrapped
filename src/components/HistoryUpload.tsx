"use client";

import { useMemo, useState, useSyncExternalStore, type ChangeEvent } from "react";
import { parseHistoryStats, readHistoryFile } from "@/lib/history";
import { useMode } from "@/lib/mode";

const STORAGE_KEY = "wrapped.history.v2";
const LEGACY_STORAGE_KEY = "wrapped.history.v1";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("wrapped:history-change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("wrapped:history-change", callback);
  };
}

function getSnapshot(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function getServerSnapshot(): string | null {
  return null;
}

export default function HistoryUpload() {
  const mode = useMode();
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const summary = useMemo(() => parseHistoryStats(raw)?.history ?? null, [raw]);

  const [reading, setReading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (mode !== "lengkap") {
    return null;
  }

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setReading(true);
    setErrorMessage(null);

    try {
      const result = await readHistoryFile(file);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
        localStorage.removeItem(LEGACY_STORAGE_KEY);
        window.dispatchEvent(new Event("wrapped:history-change"));
      } catch {
        // localStorage gagal disimpan
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Gagal memproses file riwayat.");
    } finally {
      setReading(false);
      e.target.value = "";
    }
  }

  function handleClear() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(LEGACY_STORAGE_KEY);
      window.dispatchEvent(new Event("wrapped:history-change"));
    } catch {
      // localStorage gagal dihapus
    }
    setErrorMessage(null);
  }

  return (
    <div className="my-6 w-full border-2 border-sec bg-pri px-4 py-3 has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-red sm:px-5">
      <input
        id="history-strip-upload"
        type="file"
        accept=".zip,.json"
        onChange={handleFileChange}
        disabled={reading}
        className="sr-only"
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          {reading ? (
            <p className="font-mono text-xs sm:text-sm font-bold text-sec">Membaca file...</p>
          ) : errorMessage ? (
            <p className="font-mono text-xs sm:text-sm font-bold text-red break-words">{errorMessage}</p>
          ) : summary ? (
            <p className="font-mono text-xs sm:text-sm text-sec">
              <span className="font-bold text-sec">Total menit asli aktif:</span>{" "}
              {summary.totalMinutes.toLocaleString("id-ID")} menit di {summary.year}.
            </p>
          ) : (
            <p className="font-mono text-xs sm:text-sm text-sec/80">
              <span className="font-bold text-sec">Mode lengkap:</span> belum ada file riwayat.
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {reading ? null : errorMessage ? (
            <label
              htmlFor="history-strip-upload"
              className="cursor-pointer border border-red bg-red px-3 py-1 font-mono text-xs font-bold uppercase text-[#fff5ef] transition-colors hover:bg-sec focus-within:ring-2 focus-within:ring-sec"
            >
              Coba file lain
            </label>
          ) : summary ? (
            <>
              <button
                type="button"
                onClick={handleClear}
                className="cursor-pointer border border-sec/40 px-3 py-1 font-mono text-xs font-bold uppercase text-sec/80 transition-colors hover:border-red hover:text-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red"
              >
                Hapus data
              </button>
              <label
                htmlFor="history-strip-upload"
                className="cursor-pointer border border-sec bg-sec px-3 py-1 font-mono text-xs font-bold uppercase text-pri transition-colors hover:bg-red focus-within:ring-2 focus-within:ring-red"
              >
                Ganti file
              </label>
            </>
          ) : (
            <>
              <label
                htmlFor="history-strip-upload"
                className="cursor-pointer border-2 border-sec bg-sec px-3 py-1.5 font-mono text-xs font-bold uppercase text-pri transition-colors hover:bg-red focus-within:ring-2 focus-within:ring-red"
              >
                Upload file
              </label>
            </>
          )}
        </div>
      </div>

      {!summary && !reading && (
        <details className="group mt-2 border-t border-sec/15 pt-2">
          <summary className="cursor-pointer font-mono text-xs sm:text-sm font-bold text-sec/75 underline transition-colors hover:text-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red">
            Cara dapat file
          </summary>
          <div className="mt-3">
            <p className="font-mono text-xs sm:text-sm font-bold uppercase text-red">
              Langkah meminta riwayat dari Spotify:
            </p>
            <ol className="mt-2 space-y-1.5 font-body text-xs sm:text-sm leading-relaxed text-sec/80">
              <li>
                <span className="font-mono font-bold text-sec">1.</span> Buka{" "}
                <span className="font-semibold text-sec">spotify.com</span>, login, lalu buka{" "}
                <span className="font-semibold text-sec">Account</span> dan pilih{" "}
                <span className="font-semibold text-sec">Privacy settings</span>.
              </li>
              <li>
                <span className="font-mono font-bold text-sec">2.</span> Di bagian download data, centang{" "}
                <span className="font-semibold text-sec">Extended streaming history</span>, lalu klik{" "}
                <span className="font-semibold text-sec">Request data</span>.
              </li>
              <li>
                <span className="font-mono font-bold text-sec">3.</span> Buka email dari Spotify dan klik link konfirmasi.
              </li>
              <li>
                <span className="font-mono font-bold text-sec">4.</span> Tunggu email data siap. Biasanya beberapa hari, paling lama 30 hari.
              </li>
              <li>
                <span className="font-mono font-bold text-sec">5.</span> Download file{" "}
                <span className="font-mono font-bold text-sec">.zip</span>, lalu upload di sini. File dibaca di browser kamu dan tidak dikirim ke server.
              </li>
            </ol>
          </div>
        </details>
      )}
    </div>
  );
}
