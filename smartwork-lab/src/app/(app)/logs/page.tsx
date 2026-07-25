import { redirect } from "next/navigation";
import { ScrollText } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import * as data from "@/lib/data";
import { getSession } from "@/lib/session";
import { formatDateTime } from "@/lib/utils";

export const metadata = { title: "감사 로그" };

export default function LogsPage() {
  if (getSession()?.role !== "admin") redirect("/dashboard");
  const logs = data.getAuditLogs();

  return (
    <div>
      <PageHeader
        title="감사 로그"
        description="모든 관리자 작업이 기록됩니다. (개인정보 보호 · 접근 추적)"
      />
      <Card>
        <CardContent className="p-0">
          <ul className="divide-y">
            {logs.map((l) => (
              <li key={l.id} className="flex items-center gap-3 p-4">
                <span className="flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <ScrollText className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm">
                    <span className="font-medium">{l.actor}</span>
                    <Badge variant="secondary" className="mx-1.5">{l.action}</Badge>
                    <span className="text-muted-foreground">{l.target}</span>
                  </p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">{formatDateTime(l.at)}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
