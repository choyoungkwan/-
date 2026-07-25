import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Bug, ExternalLink, Lightbulb, Rocket, User } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { FavoriteButton } from "@/components/webapp/favorite-button";
import * as data from "@/lib/data";
import { appStatusLabel } from "@/lib/labels";
import { formatDate } from "@/lib/utils";

export function generateMetadata({ params }: { params: { id: string } }) {
  const app = data.getWebApp(params.id);
  return { title: app?.name ?? "웹앱" };
}

export default function AppDetailPage({ params }: { params: { id: string } }) {
  const app = data.getWebApp(params.id);
  if (!app) notFound();

  const category = data.getCategory(app.categoryId);
  const favorites = data.getFavorites();
  const status = appStatusLabel[app.status];
  const relatedMaint = data.getMaintenances().filter((m) => m.appId === app.id);
  const relatedErrors = data.getErrors().filter((e) => e.appId === app.id);
  const relatedReqs = data.getRequests().filter((r) => r.appId === app.id);

  return (
    <div>
      <Link href="/apps" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> 웹앱 목록
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* 본문 */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <span
                  className="flex size-16 shrink-0 items-center justify-center rounded-2xl text-white"
                  style={{ backgroundColor: category?.color ?? "hsl(var(--primary))" }}
                >
                  <Icon name={app.icon} className="size-8" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h1 className="text-2xl font-bold">{app.name}</h1>
                    <FavoriteButton appId={app.id} initial={favorites.includes(app.id)} />
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    {category && <Badge variant="secondary">{category.name}</Badge>}
                    <Badge variant={status.variant}>{status.label}</Badge>
                    <Badge variant="muted">v{app.version}</Badge>
                  </div>
                </div>
              </div>

              <p className="mt-5 leading-relaxed text-foreground/90">{app.description}</p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {app.tags.map((t) => (
                  <span key={t} className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">#{t}</span>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <a href={app.url} target="_blank" rel="noopener noreferrer">
                  <Button><Rocket /> 웹앱 실행</Button>
                </a>
                <Link href={`/improvements?app=${app.id}`}>
                  <Button variant="outline"><Lightbulb /> 개선요청</Button>
                </Link>
                <Link href={`/errors?app=${app.id}`}>
                  <Button variant="outline"><Bug /> 오류신고</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* 관련 이력 */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <MiniList title="개선요청" empty="등록된 개선요청이 없습니다." items={relatedReqs.map((r) => ({ id: r.id, title: r.title, meta: r.requesterName }))} href="/improvements" />
            <MiniList title="오류신고" empty="등록된 오류신고가 없습니다." items={relatedErrors.map((e) => ({ id: e.id, title: e.title, meta: e.reporterName }))} href="/errors" />
          </div>
        </div>

        {/* 사이드 정보 */}
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">정보</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <InfoRow label="담당자" value={<span className="inline-flex items-center gap-1"><User className="size-3.5" />{app.owner}</span>} />
              {app.ownerEmail && <InfoRow label="연락처" value={app.ownerEmail} />}
              <InfoRow label="버전" value={`v${app.version}`} />
              <InfoRow label="상태" value={<Badge variant={status.variant}>{status.label}</Badge>} />
              <InfoRow label="등록일" value={formatDate(app.createdAt)} />
              <InfoRow label="최근 수정" value={formatDate(app.updatedAt)} />
              <InfoRow label="실행 횟수" value={`${app.launchCount.toLocaleString()}회`} />
              <InfoRow label="즐겨찾기" value={`${app.favoriteCount}명`} />
              <div className="border-t pt-3">
                <a href={app.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 break-all text-sm text-primary hover:underline">
                  <ExternalLink className="size-3.5 shrink-0" />{app.url}
                </a>
              </div>
            </CardContent>
          </Card>

          {relatedMaint.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-base">유지보수 이력</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                {relatedMaint.map((m) => (
                  <div key={m.id} className="rounded-lg border p-2.5">
                    <p className="font-medium">{m.title}</p>
                    <p className="text-xs text-muted-foreground">{m.assignee} · {formatDate(m.scheduledAt)}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}

function MiniList({
  title,
  items,
  empty,
  href,
}: {
  title: string;
  items: { id: string; title: string; meta: string }[];
  empty: string;
  href: string;
}) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-base">{title}</CardTitle>
        <Link href={href} className="text-xs text-primary hover:underline">더보기</Link>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.length === 0 && <p className="text-sm text-muted-foreground">{empty}</p>}
        {items.map((i) => (
          <div key={i.id} className="rounded-lg border p-2.5">
            <p className="truncate text-sm font-medium">{i.title}</p>
            <p className="text-xs text-muted-foreground">{i.meta}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
