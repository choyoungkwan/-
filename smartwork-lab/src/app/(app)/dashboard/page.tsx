import Link from "next/link";
import { ArrowRight, Bug, Lightbulb, Wrench, Pin } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { PopularBarChart, CategoryPieChart } from "@/components/dashboard/charts";
import { AppCard } from "@/components/webapp/app-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import * as data from "@/lib/data";
import { getSession } from "@/lib/session";
import { relativeTime } from "@/lib/utils";
import { appStatusLabel } from "@/lib/labels";

export const metadata = { title: "대시보드" };

export default function DashboardPage() {
  const user = getSession()!;
  const stats = data.getDashboardStats();
  const categories = data.getCategories();
  const catMap = Object.fromEntries(categories.map((c) => [c.id, c]));
  const apps = data.getWebApps();
  const popular = data.getPopularApps(5);
  const recent = data.getRecentlyUpdatedApps(3);
  const notices = data.getNotices().slice(0, 3);
  const favorites = data.getFavorites();
  const maints = data.getMaintenances().filter((m) => m.status !== "completed").slice(0, 3);

  const popularData = popular.map((a) => ({ name: a.name, launches: a.launchCount }));
  const categoryData = categories.map((c) => ({
    name: c.name,
    value: apps.filter((a) => a.categoryId === c.id).length,
    color: c.color,
  }));

  return (
    <div>
      <PageHeader
        title={`안녕하세요, ${user.name}님`}
        description="오늘의 스마트워크 운영 현황을 확인하세요."
      />

      {/* 운영 현황 요약 */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="전체 웹앱" value={stats.totalApps} icon="LayoutGrid" hint={`이번 달 신규 ${stats.newThisMonth}개`} />
        <StatCard label="운영 중" value={stats.operating} icon="CircleCheck" tone="success" />
        <StatCard label="점검 중" value={stats.maintenance} icon="Wrench" tone="warning" />
        <StatCard label="미해결 오류" value={stats.openErrors} icon="Bug" tone="destructive" />
      </div>

      {/* 차트 */}
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>인기 웹앱 (실행 횟수)</CardTitle>
            <Link href="/apps" className="text-xs text-primary hover:underline">전체 보기</Link>
          </CardHeader>
          <CardContent>
            <PopularBarChart data={popularData} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>카테고리 분포</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryPieChart data={categoryData} />
            <div className="mt-2 grid grid-cols-2 gap-1.5">
              {categoryData.map((c) => (
                <div key={c.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="size-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                  {c.name} ({c.value})
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {/* 공지 */}
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>공지사항</CardTitle>
            <Link href="/notices" className="text-xs text-primary hover:underline">더보기</Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {notices.map((n) => (
              <Link key={n.id} href="/notices" className="block rounded-lg border p-3 hover:bg-accent/50">
                <div className="flex items-center gap-1.5">
                  {n.pinned && <Pin className="size-3.5 text-primary" />}
                  <p className="truncate text-sm font-medium">{n.title}</p>
                </div>
                <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{n.body}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">{n.authorName} · {relativeTime(n.createdAt)}</p>
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* 처리 대기 요약 */}
        <Card>
          <CardHeader>
            <CardTitle>처리 대기</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <SummaryRow href="/improvements" icon={<Lightbulb className="size-4 text-warning" />} label="개선요청" count={stats.openRequests} />
            <SummaryRow href="/errors" icon={<Bug className="size-4 text-destructive" />} label="오류신고" count={stats.openErrors} />
            <SummaryRow href="/maintenance" icon={<Wrench className="size-4 text-primary" />} label="유지보수 일정" count={stats.upcomingMaintenance} />
          </CardContent>
        </Card>

        {/* 유지보수 일정 */}
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>다가오는 점검</CardTitle>
            <Link href="/maintenance" className="text-xs text-primary hover:underline">더보기</Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {maints.length === 0 && <p className="text-sm text-muted-foreground">예정된 점검이 없습니다.</p>}
            {maints.map((m) => {
              const app = data.getWebApp(m.appId);
              return (
                <div key={m.id} className="rounded-lg border p-3">
                  <p className="truncate text-sm font-medium">{m.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {app?.name} · {m.assignee} · {relativeTime(m.scheduledAt)}
                  </p>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* 최근 업데이트 */}
      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">최근 업데이트된 웹앱</h2>
          <Link href="/apps" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
            전체 웹앱 <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recent.map((a) => (
            <AppCard key={a.id} app={a} category={catMap[a.categoryId]} isFavorite={favorites.includes(a.id)} />
          ))}
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ href, icon, label, count }: { href: string; icon: React.ReactNode; label: string; count: number }) {
  return (
    <Link href={href} className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent/50">
      <span className="flex items-center gap-2 text-sm font-medium">{icon}{label}</span>
      <Badge variant={count > 0 ? "default" : "muted"}>{count}건</Badge>
    </Link>
  );
}
