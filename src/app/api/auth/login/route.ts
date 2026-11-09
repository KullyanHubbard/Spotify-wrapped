import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { authorizeUrl, codeChallenge, cookieBase, COOKIE, appUrl, randomString, env } from "@/lib/spotify";

export async function GET(request: NextRequest) {
  try {
    const { redirectUri } = env();
    const jar = await cookies();
    const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");

    // Di development, pastikan host sesuai dengan redirect URI (127.0.0.1, bukan localhost)
    if (process.env.NODE_ENV === "development") {
      const targetHost = new URL(redirectUri).host;
      if (host !== targetHost && !request.nextUrl.searchParams.has("r")) {
        return NextResponse.redirect(appUrl(`${request.nextUrl.pathname}?r=1`));
      }
    }

    const verifier = randomString(64);
    const state = randomString(16);
    jar.set(COOKIE.verifier, verifier, { ...cookieBase, maxAge: 600 });
    jar.set(COOKIE.state, state, { ...cookieBase, maxAge: 600 });

    return NextResponse.redirect(authorizeUrl(state, await codeChallenge(verifier)));
  } catch (err) {
    console.error("Login route error:", err);
    return NextResponse.redirect(new URL("/?error=config_error", request.url));
  }
}
