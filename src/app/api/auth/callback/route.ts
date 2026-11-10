import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { appUrl, COOKIE, exchangeCode, saveTokens } from "@/lib/spotify";

export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const fail = (reason: string) => NextResponse.redirect(appUrl(`/?error=${encodeURIComponent(reason)}`));

  const error = url.searchParams.get("error");
  if (error) return fail(error);

  const jar = await cookies();
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const verifier = jar.get(COOKIE.verifier)?.value;
  if (!code || !state || !verifier || state !== jar.get(COOKIE.state)?.value) {
    return fail("state_mismatch");
  }
  jar.delete(COOKIE.verifier);
  jar.delete(COOKIE.state);

  try {
    await saveTokens(await exchangeCode(code, verifier));
  } catch (e) {
    console.error(e);
    return fail("token_exchange_failed");
  }
  return NextResponse.redirect(appUrl("/mulai"));
}
