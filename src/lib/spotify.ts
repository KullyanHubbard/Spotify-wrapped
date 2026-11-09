import "server-only";
import { cookies } from "next/headers";

export const SCOPES = ["user-top-read", "user-read-recently-played"];

const ACCOUNTS = "https://accounts.spotify.com";
const API = "https://api.spotify.com/v1";

export const COOKIE = {
  verifier: "sp_verifier",
  state: "sp_state",
  access: "sp_access",
  refresh: "sp_refresh",
  expiresAt: "sp_expires_at",
} as const;

export function env() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI;
  if (!clientId || !redirectUri) {
    throw new Error("SPOTIFY_CLIENT_ID dan SPOTIFY_REDIRECT_URI belum di-set di .env.local");
  }
  return { clientId, redirectUri };
}

/** Origin app diambil dari redirect URI, karena request.url di dev selalu "localhost" walau dibuka via 127.0.0.1. */
export function appUrl(path: string) {
  return new URL(path, env().redirectUri);
}

export const cookieBase = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.SPOTIFY_REDIRECT_URI?.startsWith("https:") ?? false,
  path: "/",
};

function base64url(bytes: Uint8Array) {
  return Buffer.from(bytes).toString("base64url");
}

export function randomString(byteLength = 64) {
  return base64url(crypto.getRandomValues(new Uint8Array(byteLength)));
}

export async function codeChallenge(verifier: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
  return base64url(new Uint8Array(digest));
}

export function authorizeUrl(state: string, challenge: string) {
  const { clientId, redirectUri } = env();
  const params = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: redirectUri,
    scope: SCOPES.join(" "),
    code_challenge_method: "S256",
    code_challenge: challenge,
    state,
  });
  return `${ACCOUNTS}/authorize?${params}`;
}

type TokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
};

async function tokenRequest(body: Record<string, string>): Promise<TokenResponse> {
  const res = await fetch(`${ACCOUNTS}/api/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(body),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new SpotifyError(res.status, `Spotify token error ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

export function exchangeCode(code: string, verifier: string) {
  const { clientId, redirectUri } = env();
  return tokenRequest({
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
    client_id: clientId,
    code_verifier: verifier,
  });
}

// Spotify merotasi refresh token, jadi request paralel dengan token yang sama harus berbagi satu refresh.
// shortcut: hanya dedupe dalam satu proses server, pindah ke store bersama (Redis/KV) kalau jalan multi-instance.
const inflight = new Map<string, Promise<TokenResponse>>();

function refreshToken(refresh: string) {
  let p = inflight.get(refresh);
  if (!p) {
    p = tokenRequest({ grant_type: "refresh_token", refresh_token: refresh, client_id: env().clientId });
    inflight.set(refresh, p);
    // Simpan sebentar supaya request yang masih membawa cookie lama ikut dapat hasil yang sama.
    const drop = () => setTimeout(() => inflight.delete(refresh), 30_000);
    p.then(drop, () => inflight.delete(refresh));
  }
  return p;
}

export async function saveTokens(tokens: TokenResponse) {
  const jar = await cookies();
  const expiresAt = Date.now() + tokens.expires_in * 1000;
  jar.set(COOKIE.access, tokens.access_token, { ...cookieBase, maxAge: tokens.expires_in });
  jar.set(COOKIE.expiresAt, String(expiresAt), { ...cookieBase, maxAge: 60 * 60 * 24 * 30 });
  // PKCE refresh bisa mengembalikan refresh_token baru (yang lama jadi tidak valid).
  if (tokens.refresh_token) {
    jar.set(COOKIE.refresh, tokens.refresh_token, { ...cookieBase, maxAge: 60 * 60 * 24 * 30 });
  }
}

export async function clearTokens() {
  const jar = await cookies();
  for (const name of Object.values(COOKIE)) jar.delete(name);
}

/** Hanya dipanggil dari Route Handler, karena bisa menulis cookie saat refresh. */
export async function getAccessToken(): Promise<string | null> {
  const jar = await cookies();
  const access = jar.get(COOKIE.access)?.value;
  const expiresAt = Number(jar.get(COOKIE.expiresAt)?.value ?? 0);
  if (access && Date.now() < expiresAt - 60_000) return access;

  const refresh = jar.get(COOKIE.refresh)?.value;
  if (!refresh) return null;
  try {
    const tokens = await refreshToken(refresh);
    await saveTokens(tokens);
    return tokens.access_token;
  } catch (e) {
    // Hanya 400 (invalid_grant) yang berarti refresh token mati. Error jaringan/5xx dilempar supaya sesi tidak ikut terhapus.
    if (!(e instanceof SpotifyError && e.status === 400)) throw e;
    // Cookie tidak dihapus: refresh paralel yang kalah balapan bisa menimpa cookie baru milik pemenang. Login ulang menimpanya.
    return null;
  }
}

export class SpotifyError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export async function spotifyGet<T>(path: string, token: string): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new SpotifyError(res.status, await res.text());
  }
  return res.json();
}
