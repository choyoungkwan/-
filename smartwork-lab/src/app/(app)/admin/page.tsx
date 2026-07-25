import { redirect } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { AppForm } from "@/components/admin/app-form";
import { DeleteAppButton } from "@/components/admin/delete-app-button";
import { StatusSelect } from "@/components/status-select";
import { ExportButton } from "@/components/admin/export-button";
import * as data from "@/lib/data";
import { getSession } from "@/lib/session";
import { updateWebAppStatusAction } from "@/lib/actions";
import { appStatusLabel } from "@/lib/labels";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "웹앱 관리" };

export default function AdminPage() {
  if (getSession()?.role !== "admin") redirect("/dashboard");

  const apps = data.getWebApps();
  const categories = data.getCategories();
  const catMap = Object.fromEntries(categories.map((c) => [c.id, c]));
  const statusOptions = (["operating", "maintenance", "deprecated"] as const).map((s) => ({
    value: s,
    label: appStatusLabel[s].label,
  }));

  const csvRows = apps.map((a) => ({
    이름: a.name,
    카테고리: catMap[a.categoryId]?.name ?? "",
    상태: appStatusLabel[a.status].label,
    담당자: a.owner,
    버전: a.version,
    실행횟수: a.launchCount,
    URL: a.url,
    최근수정: formatDate(a.updatedAt),
  }));

  return (
    <div>
      <PageHeader
        title="웹앱 관리"
        description="스마트워크 웹앱을 등록·수정·삭제하고 상태를 관리합니다."
        action={<ExportButton rows={csvRows} filename="smartwork-apps.csv" />}
      />

      {/* 카테고리 요약 */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {categories.map((c) => (
          <Card key={c.id} className="p-4">
            <span className="flex size-8 items-center justify-center rounded-lg text-white" style={{ backgroundColor: c.color }}>
              <Icon name={c.icon} className="size-4" />
            </span>
            <p className="mt-2 text-sm font-medium">{c.name}</p>
            <p className="text-xs text-muted-foreground">{apps.filter((a) => a.categoryId === c.id).length}개 웹앱</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* 웹앱 테이블 */}
        <Card>
          <CardHeader><CardTitle className="text-base">등록된 웹앱 ({apps.length})</CardTitle></CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs text-muted-foreground">
                    <th className="px-4 py-2 font-medium">웹앱</th>
                    <th className="px-4 py-2 font-medium">카테고리</th>
                    <th className="px-4 py-2 font-medium">상태</th>
                    <th className="px-4 py-2 font-medium">수정일</th>
                    <th className="px-4 py-2" />
                  </tr>
                </thead>
                <tbody>
                  {apps.map((a) => (
                    <tr key={a.id} className="border-b last:border-0 hover:bg-accent/40">
                      <td className="px-4 py-2.5">
                        <Link href={`/apps/${a.id}`} className="flex items-center gap-2 font-medium hover:text-primary">
                          <span className="flex size-7 items-center justify-center rounded-md text-white" style={{ backgroundColor: catMap[a.categoryId]?.color }}>
                            <Icon name={a.icon} className="size-3.5" />
                          </span>
                          <span className="truncate">{a.name}</span>
                        </Link>
                      </td>
                      <td className="px-4 py-2.5">
                        <Badge variant="secondary">{catMap[a.categoryId]?.name}</Badge>
                      </td>
                      <td className="px-4 py-2.5">
                        <StatusSelect
                          value={a.status}
                          options={statusOptions}
                          action={updateWebAppStatusAction.bind(null, a.id)}
                          className="h-8 w-24 text-xs"
                        />
                      </td>
                      <td className="px-4 py-2.5 text-xs text-muted-foreground">{formatDate(a.updatedAt)}</td>
                      <td className="px-4 py-2.5 text-right">
                        <DeleteAppButton id={a.id} name={a.name} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* 등록 폼 */}
        <Card className="h-fit">
          <CardHeader><CardTitle className="text-base">새 웹앱 등록</CardTitle></CardHeader>
          <CardContent>
            <AppForm categories={categories} existingUrls={apps.map((a) => a.url)} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
