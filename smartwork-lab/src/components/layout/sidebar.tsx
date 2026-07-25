"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid } from "lucide-react";
import { navSections } from "./nav";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import type { Role } from "@/lib/types";

export function SidebarNav({ role, onNavigate }: { role: Role; onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex h-full flex-col gap-6 p-4">
      <Link href="/dashboard" className="flex items-center gap-2 px-2 py-1" onClick={onNavigate}>
        <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <LayoutGrid className="size-5" />
        </span>
        <span className="text-sm font-bold leading-tight">
          스마트워크 랩
          <span className="block text-[11px] font-normal text-muted-foreground">우만종합사회복지관</span>
        </span>
      </Link>

      <div className="flex flex-1 flex-col gap-5 overflow-y-auto">
        {navSections.map((section) => {
          const items = section.items.filter((i) => !i.adminOnly || role === "admin");
          if (items.length === 0) return null;
          return (
            <div key={section.title}>
              <p className="mb-1 px-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                {section.title}
              </p>
              <ul className="space-y-0.5">
                {items.map((item) => {
                  const active =
                    pathname === item.href || pathname.startsWith(item.href + "/");
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onNavigate}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                          active
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-accent hover:text-foreground"
                        )}
                      >
                        <Icon name={item.icon} className="size-4" />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
