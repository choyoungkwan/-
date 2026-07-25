import { Bug, Paperclip } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label, Select } from "@/components/ui/input";
import { StatusSelect } from "@/components/status-select";
import * as data from "@/lib/data";
import { getSession } from "@/lib/session";
import { createErrorAction, updateErrorStatusAction } from "@/lib/actions";
import { errorStatusLabel, errorStatusOrder, priorityLabel } from "@/lib/labels";
import { relativeTime, formatDateTime } from "@/lib/utils";

export const metadata = { title: "오류신고" };

export default function ErrorsPage({ searchParams }: { searchParams: { app?: string } }) {
  const errors = data.getErrors();
  const apps = data.getWebApps();
  const appMap = Object.fromEntries(apps.map((a) => [a.id, a]));
  const isAdmin = getSession()?.role === "admin";
  const statusOptions = errorStatusOrder.map((s) => ({ value: s, label: errorStatusLabel[s].label }));

  return (
    <div>
      <PageHeader title="오류신고" description="웹앱 이용 중 발생한 오류를 신고하고 처리 현황을 확인하세요." />

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        {/* 등록 폼 */}
        <Card className="h-fit lg:sticky lg:top-20">
          <CardHeader><CardTitle className="text-base">새 오류신고</CardTitle></CardHeader>
          <CardContent>
            <form action={createErrorAction} className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="appId">대상 웹앱</Label>
                <Select id="appId" name="appId" defaultValue={searchParams.app ?? ""}>
                  <option value="">전체 / 기타</option>
                  {apps.map((a) => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="title">제목</Label>
                <Input id="title" name="title" required placeholder="어떤 오류인가요?" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="body">상세 내용</Label>
                <Textarea id="body" name="body" required placeholder="재현 방법, 발생 화면 등을 적어주세요" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="priority">우선순위</Label>
                <Select id="priority" name="priority" defaultValue="medium">
                  <option value="low">낮음</option>
                  <option value="medium">보통</option>
                  <option value="high">높음</option>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="screenshot">화면 캡처 (선택)</Label>
                <Input id="screenshot" name="screenshot" type="file" accept="image/*" className="cursor-pointer file:mr-3 file:rounded file:border-0 file:bg-secondary file:px-2 file:py-1 file:text-xs" />
                <p className="text-[11px] text-muted-foreground">운영 모드에서는 Supabase Storage 에 업로드됩니다.</p>
              </div>
              <Button type="submit" className="w-full"><Bug /> 오류신고 등록</Button>
            </form>
          </CardContent>
        </Card>

        {/* 목록 */}
        <div className="space-y-3">
          {errors.map((e) => {
            const st = errorStatusLabel[e.status];
            const pr = priorityLabel[e.priority];
            return (
              <Card key={e.id}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant={st.variant}>{st.label}</Badge>
                        <Badge variant={pr.variant}>우선순위 {pr.label}</Badge>
                        {e.appId && appMap[e.appId] && (
                          <span className="truncate text-xs text-muted-foreground">{appMap[e.appId].name}</span>
                        )}
                      </div>
                      <h3 className="mt-1.5 font-semibold">{e.title}</h3>
                      <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">{e.body}</p>
                      {e.history.length > 0 && (
                        <div className="mt-3 space-y-1 border-l-2 border-border pl-3">
                          {e.history.map((h, i) => (
                            <p key={i} className="text-xs text-muted-foreground">
                              <span className="font-medium text-foreground">{h.by}</span> · {formatDateTime(h.at)} — {h.note}
                            </p>
                          ))}
                        </div>
                      )}
                      <p className="mt-2 text-xs text-muted-foreground">{e.reporterName} · {relativeTime(e.createdAt)}</p>
                    </div>
                    {isAdmin && (
                      <StatusSelect
                        value={e.status}
                        options={statusOptions}
                        action={updateErrorStatusAction.bind(null, e.id)}
                        className="w-28 shrink-0"
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
          {errors.length === 0 && (
            <div className="rounded-xl border border-dashed py-16 text-center text-sm text-muted-foreground">
              등록된 오류신고가 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
