import { NextResponse, type NextRequest } from "next/server";
import { appUrl, clearTokens } from "@/lib/spotify";

export async function POST(request: NextRequest) {
  // Tolak POST lintas situs supaya situs lain tidak bisa memaksa logout. Tanpa Origin, andalkan Sec-Fetch-Site.
  const origin = request.headers.get("origin");
  const sameSite = origin ? origin === appUrl("/").origin : request.headers.get("sec-fetch-site") === "same-origin";
  if (!sameSite) return new Response("forbidden", { status: 403 });

  await clearTokens();
  return NextResponse.redirect(appUrl("/"), 303);
}
