import { NextResponse } from "next/server";
import { appUrl, clearTokens } from "@/lib/spotify";

export async function POST() {
  await clearTokens();
  return NextResponse.redirect(appUrl("/"), 303);
}
