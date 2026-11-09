"use client";

import { useSearchParams } from "next/navigation";

const MESSAGES: Record<string, string> = {
  access_denied: "Login dibatalkan.",
  state_mismatch: "Sesi login kedaluwarsa atau tidak cocok. Coba lagi.",
  token_exchange_failed: "Gagal menukar kode login. Cek SPOTIFY_CLIENT_ID dan Redirect URI.",
};

export default function LoginError() {
  const error = useSearchParams().get("error");
  if (!error) return null;
  return <p role="alert" className="border-l-4 border-press-red bg-ink/5 px-4 py-3 text-sm">{MESSAGES[error] ?? `Error: ${error}`}</p>;
}
