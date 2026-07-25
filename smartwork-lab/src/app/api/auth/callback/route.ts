import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** Google OAuth 콜백 — 인증 코드를 세션으로 교환합니다. */
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const supabase = createClient();

  if (code && supabase) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }
  return NextResponse.redirect(new URL("/login?error=callback", req.url));
}
