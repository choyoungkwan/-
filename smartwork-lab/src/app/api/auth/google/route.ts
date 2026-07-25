import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Google OAuth 시작 (운영 모드).
 * Supabase가 설정되어 있으면 Google OAuth 로 리다이렉트하고,
 * 데모 모드에서는 로그인 페이지로 되돌립니다.
 */
export async function GET(req: NextRequest) {
  const supabase = createClient();
  if (!supabase) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const origin = req.nextUrl.origin;
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/api/auth/callback`,
      queryParams: { access_type: "offline", prompt: "consent" },
    },
  });

  if (error || !data.url) {
    return NextResponse.redirect(new URL("/login?error=oauth", req.url));
  }
  return NextResponse.redirect(data.url);
}
