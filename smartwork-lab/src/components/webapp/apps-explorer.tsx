"use client";
import * as React from "react";
import { LayoutGrid, List, Search, X } from "lucide-react";
import { AppCard } from "./app-card";
import { AppRow } from "./app-row";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Category, WebApp } from "@/lib/types";

type View = "grid" | "list";

export function AppsExplorer({
  apps,
  categories,
  favorites,
  initialQuery = "",
}: {
  apps: WebApp[];
  categories: Category[];
  favorites: string[];
  initialQuery?: string;
}) {
  const [q, setQ] = React.useState(initialQuery);
  const [cat, setCat] = React.useState<string>("all");
  const [tag, setTag] = React.useState<string | null>(null);
  const [view, setView] = React.useState<View>("grid");

  const favSet = React.useMemo(() => new Set(favorites), [favorites]);
  const catMap = React.useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, c])),
    [categories]
  );

  const allTags = React.useMemo(() => {
    const set = new Set<string>();
    apps.forEach((a) => a.tags.forEach((t) => set.add(t)));
    return [...set].sort();
  }, [apps]);

  const filtered = React.useMemo(() => {
    const needle = q.trim().toLowerCase();
    return apps.filter((a) => {
      if (cat !== "all" && a.categoryId !== cat) return false;
      if (tag && !a.tags.includes(tag)) return false;
      if (!needle) return true;
      return (
        a.name.toLowerCase().includes(needle) ||
        a.description.toLowerCase().includes(needle) ||
        a.owner.toLowerCase().includes(needle) ||
        a.tags.some((t) => t.toLowerCase().includes(needle))
      );
    });
  }, [apps, q, cat, tag]);

  const active = q || cat !== "all" || tag;

  return (
    <div>
      {/* 검색 + 뷰 전환 */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="이름, 설명, 담당자, 태그로 검색"
            className="h-10 w-full rounded-md border border-input bg-card pl-9 pr-9 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          {q && (
            <button
              onClick={() => setQ("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:bg-accent"
              aria-label="검색어 지우기"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
        <div className="flex rounded-md border p-0.5">
          <button
            onClick={() => setView("grid")}
            className={cn("rounded p-1.5", view === "grid" ? "bg-accent text-foreground" : "text-muted-foreground")}
            aria-label="카드 보기"
          >
            <LayoutGrid className="size-4" />
          </button>
          <button
            onClick={() => setView("list")}
            className={cn("rounded p-1.5", view === "list" ? "bg-accent text-foreground" : "text-muted-foreground")}
            aria-label="목록 보기"
          >
            <List className="size-4" />
          </button>
        </div>
      </div>

      {/* 카테고리 필터 */}
      <div className="mb-3 flex flex-wrap gap-1.5">
        <FilterChip active={cat === "all"} onClick={() => setCat("all")}>
          전체
        </FilterChip>
        {categories.map((c) => (
          <FilterChip key={c.id} active={cat === c.id} onClick={() => setCat(c.id)} color={c.color}>
            {c.name}
          </FilterChip>
        ))}
      </div>

      {/* 태그 필터 */}
      <div className="mb-5 flex flex-wrap gap-1.5">
        {allTags.map((t) => (
          <button
            key={t}
            onClick={() => setTag(tag === t ? null : t)}
            className={cn(
              "rounded-full border px-2.5 py-0.5 text-xs transition-colors",
              tag === t
                ? "border-primary bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent"
            )}
          >
            #{t}
          </button>
        ))}
      </div>

      <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
        <span>총 {filtered.length}개</span>
        {active && (
          <Button variant="ghost" size="sm" onClick={() => { setQ(""); setCat("all"); setTag(null); }}>
            필터 초기화
          </Button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed py-16 text-center text-sm text-muted-foreground">
          조건에 맞는 웹앱이 없습니다.
        </div>
      ) : view === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((a) => (
            <AppCard key={a.id} app={a} category={catMap[a.categoryId]} isFavorite={favSet.has(a.id)} />
          ))}
        </div>
      ) : (
        <div className="divide-y overflow-hidden rounded-xl border bg-card">
          {filtered.map((a) => (
            <AppRow key={a.id} app={a} category={catMap[a.categoryId]} isFavorite={favSet.has(a.id)} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  color,
  children,
}: {
  active: boolean;
  onClick: () => void;
  color?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium transition-colors",
        active ? "border-primary bg-primary/10 text-primary" : "hover:bg-accent"
      )}
    >
      {color && <span className="size-2 rounded-full" style={{ backgroundColor: color }} />}
      {children}
    </button>
  );
}
