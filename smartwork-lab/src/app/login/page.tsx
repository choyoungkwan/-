import { LayoutGrid, ShieldCheck, Sparkles, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { demoLogin } from "@/lib/actions";
import { isDemoMode } from "@/lib/data";

export const metadata = { title: "로그인" };

export default function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* 좌측 브랜드 패널 */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-primary p-12 text-primary-foreground lg:flex">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <LayoutGrid className="size-6" />
          스마트워크 랩
        </div>
        <div className="space-y-6">
          <h1 className="text-4xl font-bold leading-tight">
            흩어진 스마트워크 웹앱을
            <br />
            하나의 플랫폼에서.
          </h1>
          <p className="max-w-md text-primary-foreground/80">
            우만종합사회복지관의 모든 스마트워크 웹앱을 검색·실행하고, 운영 현황과 개선
            요청을 한 곳에서 관리합니다.
          </p>
          <ul className="space-y-3 text-sm text-primary-foreground/90">
            <li className="flex items-center gap-2"><Search className="size-4" /> 통합 검색과 즐겨찾기</li>
            <li className="flex items-center gap-2"><ShieldCheck className="size-4" /> 권한 기반 접근 제어</li>
            <li className="flex items-center gap-2"><Sparkles className="size-4" /> AI 운영 분석 (참고용)</li>
          </ul>
        </div>
        <p className="text-xs text-primary-foreground/60">
          © {new Date().getFullYear()} 우만종합사회복지관 · SmartWork Lab
        </p>
      </div>

      {/* 우측 로그인 */}
      <div className="flex items-center justify-center p-6">
        <Card className="w-full max-w-sm p-8">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary lg:hidden">
              <LayoutGrid className="size-6" />
            </div>
            <h2 className="text-xl font-semibold">로그인</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              기관 Google 계정으로 로그인하세요.
            </p>
          </div>

          {/* Google 로그인 (운영: Supabase OAuth 연결) */}
          <form action="/api/auth/google" method="get">
            <Button type="submit" variant="outline" className="w-full" disabled={isDemoMode}>
              <GoogleIcon />
              Google 계정으로 로그인
            </Button>
          </form>

          {isDemoMode && (
            <div className="mt-6">
              <div className="relative mb-4 text-center text-xs text-muted-foreground">
                <span className="relative z-10 bg-card px-2">데모 모드 — 역할을 선택해 둘러보기</span>
                <span className="absolute inset-x-0 top-1/2 -z-0 border-t" />
              </div>
              <div className="grid gap-2">
                <form action={demoLogin.bind(null, "admin", "관리자")}>
                  <Button type="submit" className="w-full">관리자로 입장</Button>
                </form>
                <form action={demoLogin.bind(null, "staff", "김직원")}>
                  <Button type="submit" variant="secondary" className="w-full">일반 직원으로 입장</Button>
                </form>
              </div>
              <p className="mt-4 text-center text-xs text-muted-foreground">
                Supabase 환경변수를 설정하면 실제 Google 로그인이 활성화됩니다.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.4-.96 2.6-2.05 3.4v2.8h3.3c1.94-1.8 3.05-4.4 3.05-7.5 0-.7-.06-1.4-.18-2z" transform="translate(0 0)" />
      <path fill="#4285F4" d="M12 22c2.7 0 4.96-.9 6.62-2.4l-3.3-2.6c-.9.6-2.06 1-3.32 1-2.56 0-4.72-1.7-5.5-4.05H3.1v2.6C4.76 19.9 8.1 22 12 22z" />
      <path fill="#FBBC05" d="M6.5 13.95c-.2-.6-.32-1.25-.32-1.95s.12-1.35.32-1.95V7.45H3.1C2.4 8.8 2 10.35 2 12s.4 3.2 1.1 4.55z" />
      <path fill="#34A853" d="M12 6c1.47 0 2.78.5 3.82 1.5l2.85-2.85C16.96 3.05 14.7 2 12 2 8.1 2 4.76 4.1 3.1 7.45L6.5 10.05C7.28 7.7 9.44 6 12 6z" />
    </svg>
  );
}
