import { useSyncExternalStore } from "react";

export type Mode = "cepat" | "lengkap";

export const MODE_KEY = "wrapped.mode.v1";
const MODE_EVENT = "wrapped:mode-change";

export function readMode(): Mode {
  if (typeof window === "undefined") return "cepat";
  try {
    const val = localStorage.getItem(MODE_KEY);
    return val === "lengkap" ? "lengkap" : "cepat";
  } catch {
    return "cepat";
  }
}

export function saveMode(mode: Mode): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(MODE_KEY, mode);
    window.dispatchEvent(new Event(MODE_EVENT));
  } catch {
    // Abaikan error kuota / akses localStorage
  }
}

function subscribeMode(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(MODE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(MODE_EVENT, callback);
  };
}

function getSnapshot(): Mode {
  return readMode();
}

function getServerSnapshot(): Mode {
  return "cepat";
}

export function useMode(): Mode {
  return useSyncExternalStore(subscribeMode, getSnapshot, getServerSnapshot);
}
