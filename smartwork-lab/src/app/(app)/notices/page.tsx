import { Pin, Megaphone } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label } from "@/components/ui/input";
import * as data from "@/lib/data";
import { getSession } from "@/lib/session";
import { createNoticeAction } from "@/lib/actions";
import { formatDateTime } from "@/lib/utils";

export const metadata = { title: "공지사항" };

export default function NoticesPage() {
  const notices = data.getNotices();
  const isAdmin = getSession()?.role === "admin";

  return (
    <div>
      <PageHeader title="공지사항" description="복지관 스마트워크 운영 공지를 확인하세요." />

      {isAdmin && (
        <Card className="mb-6">
          <CardHeader><CardTitle className="text-base">새 공지 작성 (관리자)</CardTitle></CardHeader>
          <CardContent>
            <form action={createNoticeAction} className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="title">제목</Label>
                <Input id="title" name="title" required placeholder="공지 제목" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="body">내용</Label>
                <Textarea id="body" name="body" required placeholder="공지 내용을 입력하세요" />
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="pinned" className="size-4 rounded border-input" />
                  상단 고정
                </label>
                <Button type="submit">공지 등록</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {notices.map((n) => (
          <Card key={n.id}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  {n.pinned && <Badge variant="default" className="gap-1"><Pin className="size-3" />고정</Badge>}
                  <h3 className="font-semibold">{n.title}</h3>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">{formatDateTime(n.createdAt)}</span>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm text-foreground/90">{n.body}</p>
              <p className="mt-3 text-xs text-muted-foreground">작성자 · {n.authorName}</p>
            </CardContent>
          </Card>
        ))}
        {notices.length === 0 && (
          <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed py-16 text-muted-foreground">
            <Megaphone className="size-8" />
            <p className="text-sm">등록된 공지가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
