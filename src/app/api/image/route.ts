import { type NextRequest } from "next/server";
import { COOKIE } from "@/lib/spotify";

const MAX_IMAGE_BYTES = 5_000_000;

// Proxy gambar Spotify supaya same-origin, jadi html-to-image bisa menggambarnya ke canvas tanpa masalah CORS.
const ALLOWED_HOSTS = new Set(["i.scdn.co", "mosaic.scdn.co", "image-cdn-ak.spotifycdn.com", "image-cdn-fa.spotifycdn.com"]);

export async function GET(request: NextRequest) {
  // Hanya untuk user yang login, supaya proxy ini tidak jadi bandwidth gratis untuk siapa saja.
  if (!request.cookies.has(COOKIE.access) && !request.cookies.has(COOKIE.refresh)) {
    return new Response("unauthorized", { status: 401 });
  }
  const raw = request.nextUrl.searchParams.get("u");
  let target: URL;
  try {
    target = new URL(raw ?? "");
  } catch {
    return new Response("bad url", { status: 400 });
  }
  if (target.protocol !== "https:" || target.port || target.username || target.password || !ALLOWED_HOSTS.has(target.hostname)) {
    return new Response("host not allowed", { status: 400 });
  }
  // redirect: "error" supaya redirect dari CDN tidak bisa keluar dari allowlist host.
  const upstream = await fetch(target, { cache: "no-store", redirect: "error", signal: AbortSignal.timeout(10_000) }).catch(
    () => null,
  );
  // Hanya gambar raster: HTML atau SVG dari upstream akan dieksekusi di origin app ini.
  const contentType = upstream?.headers.get("Content-Type") ?? "";
  if (!upstream?.ok || !upstream.body || !/^image\/(jpeg|png|webp)\b/.test(contentType)) {
    return new Response("upstream error", { status: 502 });
  }
  // shortcut: hanya menolak lewat Content-Length; respons tanpa header itu tetap diteruskan.
  if (Number(upstream.headers.get("Content-Length") ?? 0) > MAX_IMAGE_BYTES) {
    return new Response("image too large", { status: 502 });
  }
  return new Response(upstream.body, {
    headers: {
      "Content-Type": contentType,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "private, max-age=86400, immutable",
    },
  });
}
