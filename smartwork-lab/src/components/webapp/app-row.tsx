import Link from "next/link";
import { Rocket } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { FavoriteButton } from "./favorite-button";
import { appStatusLabel } from "@/lib/labels";
import { formatDate } from "@/lib/utils";
import type { Category, WebApp } from "@/lib/types";

export function AppRow({
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
    <div className="flex items-center gap-3 p-3 transition-colors hover:bg-accent/50">
      <span
        className="flex size-9 shrink-0 items-center justify-center rounded-lg text-white"
        style={{ backgroundColor: category?.color ?? "hsl(var(--primary))" }}
      >
        <Icon name={app.icon} className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <Link href={`/apps/${app.id}`} className="truncate font-medium hover:text-primary">
            {app.name}
          </Link>
          <Badge variant={status.variant} className="text-[11px]">{status.label}</Badge>
        </div>
        <p className="truncate text-xs text-muted-foreground">{app.description}</p>
      </div>
      <div className="hidden shrink-0 text-right text-xs text-muted-foreground md:block">
        <p>담당 {app.owner}</p>
        <p>수정 {formatDate(app.updatedAt)}</p>
      </div>
      <FavoriteButton appId={app.id} initial={isFavorite} />
      <a
        href={app.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 rounded-md bg-primary px-2.5 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
      >
        <Rocket className="size-3.5" /> 실행
      </a>
    </div>
  );
}
