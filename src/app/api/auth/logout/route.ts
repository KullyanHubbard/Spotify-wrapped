import { NextResponse, type NextRequest } from "next/server";
import { appUrl, clearTokens } from "@/lib/spotify";

export async function POST(request: NextRequest) {
  // Browser selalu mengirim Origin pada POST lintas situs; tolak supaya situs lain tidak bisa memaksa logout.
  const origin = request.headers.get("origin");
  if (origin && origin !== appUrl("/").origin) return new Response("forbidden", { status: 403 });

  await clearTokens();
  return NextResponse.redirect(appUrl("/"), 303);
}
