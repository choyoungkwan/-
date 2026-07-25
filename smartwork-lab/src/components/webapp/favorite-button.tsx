"use client";
import * as React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { toggleFavoriteAction } from "@/lib/actions";

export function FavoriteButton({
  appId,
  initial,
  className,
}: {
  appId: string;
  initial: boolean;
  className?: string;
}) {
  const [fav, setFav] = React.useState(initial);
  const [pending, start] = React.useTransition();

  return (
    <button
      type="button"
      aria-label={fav ? "즐겨찾기 해제" : "즐겨찾기 추가"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setFav((v) => !v); // 낙관적 업데이트
        start(() => toggleFavoriteAction(appId));
      }}
      disabled={pending}
      className={cn(
        "rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent",
        fav && "text-warning",
        className
      )}
    >
      <Star className={cn("size-4", fav && "fill-current")} />
    </button>
  );
}
