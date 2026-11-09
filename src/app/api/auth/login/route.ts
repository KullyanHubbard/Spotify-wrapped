import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { authorizeUrl, codeChallenge, cookieBase, COOKIE, appUrl, randomString } from "@/lib/spotify";

export async function GET(request: NextRequest) {
  const jar = await cookies();
  // Cookie PKCE harus di-set di host yang sama dengan redirect URI (mis. 127.0.0.1, bukan localhost).
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  // Param "r" mencegah redirect loop kalau proxy menulis ulang host; lanjut login saja.
  if (host !== appUrl("/").host && !request.nextUrl.searchParams.has("r")) {
    return NextResponse.redirect(appUrl(`${request.nextUrl.pathname}?r=1`));
  }

  const verifier = randomString(64);
  const state = randomString(16);
  jar.set(COOKIE.verifier, verifier, { ...cookieBase, maxAge: 600 });
  jar.set(COOKIE.state, state, { ...cookieBase, maxAge: 600 });

  return NextResponse.redirect(authorizeUrl(state, await codeChallenge(verifier)));
}
