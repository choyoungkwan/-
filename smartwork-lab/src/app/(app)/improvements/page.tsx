import { Lightbulb } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label, Select } from "@/components/ui/input";
import { StatusSelect } from "@/components/status-select";
import * as data from "@/lib/data";
import { getSession } from "@/lib/session";
import { createRequestAction, updateRequestStatusAction } from "@/lib/actions";
import { requestStatusLabel, requestStatusOrder } from "@/lib/labels";
import { relativeTime } from "@/lib/utils";

export const metadata = { title: "개선요청" };

export default function ImprovementsPage({ searchParams }: { searchParams: { app?: string } }) {
  const requests = data.getRequests();
  const apps = data.getWebApps();
  const appMap = Object.fromEntries(apps.map((a) => [a.id, a]));
  const isAdmin = getSession()?.role === "admin";
  const statusOptions = requestStatusOrder.map((s) => ({ value: s, label: requestStatusLabel[s].label }));

  return (
    <div>
      <PageHeader title="개선요청" description="웹앱 사용 중 불편한 점이나 필요한 기능을 제안하세요." />

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        {/* 등록 폼 */}
        <Card className="h-fit lg:sticky lg:top-20">
          <CardHeader><CardTitle className="text-base">새 개선요청</CardTitle></CardHeader>
          <CardContent>
            <form action={createRequestAction} className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="appId">대상 웹앱 (선택)</Label>
                <Select id="appId" name="appId" defaultValue={searchParams.app ?? ""}>
                  <option value="">전체 / 기타</option>
                  {apps.map((a) => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="title">제목</Label>
                <Input id="title" name="title" required placeholder="개선 제안 제목" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="body">내용</Label>
                <Textarea id="body" name="body" required placeholder="구체적으로 작성해 주세요" />
              </div>
              <Button type="submit" className="w-full"><Lightbulb /> 개선요청 등록</Button>
            </form>
          </CardContent>
        </Card>

        {/* 목록 */}
        <div className="space-y-3">
          {requests.map((r) => {
            const st = requestStatusLabel[r.status];
            return (
              <Card key={r.id}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <Badge variant={st.variant}>{st.label}</Badge>
                        {r.appId && appMap[r.appId] && (
                          <span className="truncate text-xs text-muted-foreground">{appMap[r.appId].name}</span>
                        )}
                      </div>
                      <h3 className="mt-1.5 font-semibold">{r.title}</h3>
                      <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">{r.body}</p>
                      <p className="mt-2 text-xs text-muted-foreground">{r.requesterName} · {relativeTime(r.createdAt)}</p>
                    </div>
                    {isAdmin && (
                      <StatusSelect
                        value={r.status}
                        options={statusOptions}
                        action={updateRequestStatusAction.bind(null, r.id)}
                        className="w-28 shrink-0"
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
          {requests.length === 0 && (
            <div className="rounded-xl border border-dashed py-16 text-center text-sm text-muted-foreground">
              등록된 개선요청이 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
