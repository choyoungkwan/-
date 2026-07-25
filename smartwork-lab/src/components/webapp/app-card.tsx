import Link from "next/link";
import { ExternalLink, Rocket } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { FavoriteButton } from "./favorite-button";
import { appStatusLabel } from "@/lib/labels";
import type { Category, WebApp } from "@/lib/types";

export function AppCard({
  app,
  category,
  isFavorite,
}: {
  app: WebApp;
  category?: Category;
  isFavorite: boolean;
}) {
  const status = appStatusLabel[app.status];
  return (
    <Card className="group relative flex flex-col overflow-hidden transition-shadow hover:shadow-md">
      <div className="flex items-start gap-3 p-5 pb-3">
        <span
          className="flex size-11 shrink-0 items-center justify-center rounded-xl text-white"
          style={{ backgroundColor: category?.color ?? "hsl(var(--primary))" }}
        >
          <Icon name={app.icon} className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <Link href={`/apps/${app.id}`} className="min-w-0">
              <h3 className="truncate font-semibold leading-tight hover:text-primary">{app.name}</h3>
            </Link>
            <FavoriteButton appId={app.id} initial={isFavorite} className="-mr-1 -mt-1" />
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            {category && <Badge variant="secondary" className="text-[11px]">{category.name}</Badge>}
            <Badge variant={status.variant} className="text-[11px]">{status.label}</Badge>
          </div>
        </div>
      </div>

      <p className="line-clamp-2 px-5 text-sm text-muted-foreground">{app.description}</p>

      <div className="mt-3 flex flex-wrap gap-1.5 px-5">
        {app.tags.slice(0, 3).map((t) => (
          <span key={t} className="rounded bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">
            #{t}
          </span>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between gap-2 p-5 pt-4">
        <span className="text-xs text-muted-foreground">담당 {app.owner} · v{app.version}</span>
        <a
          href={app.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Rocket className="size-3.5" /> 실행
        </a>
      </div>
    </Card>
  );
}
