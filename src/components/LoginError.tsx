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
  return <p className="rounded-lg bg-red-500/15 px-4 py-2 text-sm text-red-300">{MESSAGES[error] ?? `Error: ${error}`}</p>;
}
