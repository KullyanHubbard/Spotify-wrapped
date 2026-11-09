import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { authorizeUrl, codeChallenge, cookieBase, COOKIE, appUrl, randomString } from "@/lib/spotify";

export async function GET(request: NextRequest) {
  const jar = await cookies();
  // Cookie PKCE harus di-set di host yang sama dengan redirect URI (mis. 127.0.0.1, bukan localhost).
  if (request.headers.get("host") !== appUrl("/").host) {
    return NextResponse.redirect(appUrl(request.nextUrl.pathname));
  }

  const verifier = randomString(64);
  const state = randomString(16);
  jar.set(COOKIE.verifier, verifier, { ...cookieBase, maxAge: 600 });
  jar.set(COOKIE.state, state, { ...cookieBase, maxAge: 600 });

  return NextResponse.redirect(authorizeUrl(state, await codeChallenge(verifier)));
}
