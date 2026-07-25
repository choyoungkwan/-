import { NextResponse, type NextRequest } from "next/server";

// 로그인하지 않은 사용자를 /login 으로 보냅니다. (권한 기반 접근 제어의 1차 관문)
const PUBLIC_PATHS = ["/login"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hasSession = req.cookies.has("sw_role");

  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    if (hasSession) return NextResponse.redirect(new URL("/dashboard", req.url));
    return NextResponse.next();
  }

  if (!hasSession) {
    const url = new URL("/login", req.url);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  // 정적 자산/이미지/API 는 제외
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
