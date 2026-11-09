"use client";

import { useSearchParams } from "next/navigation";

const ERROR_DESCRIPTIONS: Record<string, string> = {
  access_denied: "Login dibatalkan oleh pengguna.",
  state_mismatch: "Sesi login kedaluwarsa atau tidak cocok. Coba lagi.",
  token_exchange_failed: "Gagal menukar kode autentikasi. Pastikan SPOTIFY_CLIENT_ID dan Redirect URI cocok.",
  config_error: "Konfigurasi server belum lengkap. Cek SPOTIFY_CLIENT_ID dan SPOTIFY_REDIRECT_URI di .env.local.",
};

export default function LoginError() {
  const error = useSearchParams().get("error");
  if (!error) return null;

  return (
    <div
      role="alert"
      className="border-2 border-red bg-red/10 p-4 font-mono text-xs text-sec flex items-start gap-3"
    >
      <span className="bg-red text-[#fff5ef] px-1.5 py-0.5 font-bold shrink-0">ERR</span>
      <p className="leading-relaxed">{ERROR_DESCRIPTIONS[error] ?? "Terjadi kendala autentikasi. Silakan coba kembali."}</p>
    </div>
  );
}
