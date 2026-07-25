import { redirect } from "next/navigation";
import { Wrench, CheckCircle2, Circle } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import * as data from "@/lib/data";
import { getSession } from "@/lib/session";
import { maintenanceStatusLabel } from "@/lib/labels";
import { formatDateTime } from "@/lib/utils";

export const metadata = { title: "유지보수" };

export default function MaintenancePage() {
  if (getSession()?.role !== "admin") redirect("/dashboard");

  const maints = data.getMaintenances();
  const apps = data.getWebApps();
  const appMap = Object.fromEntries(apps.map((a) => [a.id, a]));

  const columns = [
    { key: "scheduled", title: "예정" },
    { key: "in_progress", title: "진행중" },
    { key: "completed", title: "완료" },
  ] as const;

  return (
    <div>
      <PageHeader title="유지보수 관리" description="점검 일정과 체크리스트를 관리합니다." />

      <div className="grid gap-4 lg:grid-cols-3">
        {columns.map((col) => {
          const items = maints.filter((m) => m.status === col.key);
          return (
            <div key={col.key}>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="flex items-center gap-2 font-semibold">
                  <Wrench className="size-4 text-muted-foreground" />
                  {col.title}
                </h2>
                <Badge variant="muted">{items.length}</Badge>
              </div>
              <div className="space-y-3">
                {items.map((m) => {
                  const st = maintenanceStatusLabel[m.status];
                  const done = m.checklist.filter((c) => c.done).length;
                  return (
                    <Card key={m.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <Badge variant={st.variant}>{st.label}</Badge>
                          <span className="text-xs text-muted-foreground">{m.assignee}</span>
                        </div>
                        <h3 className="mt-2 text-sm font-semibold">{m.title}</h3>
                        <p className="text-xs text-muted-foreground">{appMap[m.appId]?.name}</p>
                        <p className="mt-1 text-xs text-muted-foreground">일정 · {formatDateTime(m.scheduledAt)}</p>

                        <div className="mt-3 space-y-1.5">
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>체크리스트</span>
                            <span>{done}/{m.checklist.length}</span>
                          </div>
                          {m.checklist.map((c, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm">
                              {c.done ? (
                                <CheckCircle2 className="size-4 text-success" />
                              ) : (
                                <Circle className="size-4 text-muted-foreground" />
                              )}
                              <span className={c.done ? "text-muted-foreground line-through" : ""}>{c.label}</span>
                            </div>
                          ))}
                        </div>
                        {m.notes && <p className="mt-3 rounded bg-muted p-2 text-xs text-muted-foreground">{m.notes}</p>}
                      </CardContent>
                    </Card>
                  );
                })}
                {items.length === 0 && (
                  <div className="rounded-lg border border-dashed py-8 text-center text-xs text-muted-foreground">없음</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
