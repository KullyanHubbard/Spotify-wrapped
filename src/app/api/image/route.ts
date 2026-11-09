import { type NextRequest } from "next/server";

// Proxy gambar Spotify supaya same-origin, jadi html-to-image bisa menggambarnya ke canvas tanpa masalah CORS.
const ALLOWED_HOSTS = new Set(["i.scdn.co", "mosaic.scdn.co", "image-cdn-ak.spotifycdn.com", "image-cdn-fa.spotifycdn.com"]);

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get("u");
  let target: URL;
  try {
    target = new URL(raw ?? "");
  } catch {
    return new Response("bad url", { status: 400 });
  }
  if (target.protocol !== "https:" || !ALLOWED_HOSTS.has(target.hostname)) {
    return new Response("host not allowed", { status: 400 });
  }
  const upstream = await fetch(target, { cache: "no-store" });
  if (!upstream.ok || !upstream.body) return new Response("upstream error", { status: 502 });
  return new Response(upstream.body, {
    headers: {
      "Content-Type": upstream.headers.get("Content-Type") ?? "image/jpeg",
      "Cache-Control": "public, max-age=86400, immutable",
    },
  });
}
