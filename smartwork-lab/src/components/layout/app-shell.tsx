"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, Search, LogOut, ExternalLink } from "lucide-react";
import { SidebarNav } from "./sidebar";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Role, User } from "@/lib/types";
import { logout } from "@/lib/actions";

export function AppShell({ user, children }: { user: User; children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const [q, setQ] = React.useState("");

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(q.trim() ? `/apps?q=${encodeURIComponent(q.trim())}` : "/apps");
  }

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[260px_1fr]">
      {/* 데스크톱 사이드바 */}
      <aside className="sticky top-0 hidden h-screen border-r bg-card lg:block">
        <SidebarNav role={user.role} />
      </aside>

      {/* 모바일 드로어 */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-72 border-r bg-card shadow-xl animate-fade-in">
            <div className="flex justify-end p-2">
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="닫기">
                <X />
              </Button>
            </div>
            <SidebarNav role={user.role} onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-col">
        {/* 상단바 */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(true)} aria-label="메뉴">
            <Menu />
          </Button>

          <form onSubmit={onSearch} className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="웹앱, 태그, 담당자 검색…"
              className="h-10 w-full rounded-md border border-input bg-card pl-9 pr-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </form>

          <div className="ml-auto flex items-center gap-1">
            <ThemeToggle />
            <div className="mx-1 hidden items-center gap-2 sm:flex">
              <div className="text-right leading-tight">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-[11px] text-muted-foreground">{user.department}</p>
              </div>
              <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                {user.role === "admin" ? "관리자" : "직원"}
              </Badge>
            </div>
            <form action={logout}>
              <Button variant="ghost" size="icon" aria-label="로그아웃" type="submit">
                <LogOut />
              </Button>
            </form>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-6xl animate-fade-in">{children}</div>
        </main>

        <footer className="border-t px-6 py-4 text-center text-xs text-muted-foreground">
          우만종합사회복지관 · 스마트워크 랩 — AI 분석 결과는 운영 개선을 위한 참고 자료이며, 직원 평가 목적으로 사용하지 않습니다.
        </footer>
      </div>
    </div>
  );
}
