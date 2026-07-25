"use client";
import * as React from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteWebAppAction } from "@/lib/actions";

export function DeleteAppButton({ id, name }: { id: string; name: string }) {
  const [pending, start] = React.useTransition();
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={`${name} 삭제`}
      disabled={pending}
      onClick={() => {
        if (confirm(`'${name}' 웹앱을 삭제할까요? 이 작업은 되돌릴 수 없습니다.`)) {
          start(() => deleteWebAppAction(id));
        }
      }}
    >
      <Trash2 className="text-destructive" />
    </Button>
  );
}
