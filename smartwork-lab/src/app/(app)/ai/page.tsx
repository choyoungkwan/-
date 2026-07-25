import { redirect } from "next/navigation";
import { Sparkles, Info } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { getSession } from "@/lib/session";
import { buildInsights, buildMonthlyReport } from "@/lib/ai";
import { isDemoMode } from "@/lib/data";

export const metadata = { title: "AI 운영 분석" };

const toneMap = {
  default: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/15 text-warning",
  destructive: "bg-destructive/10 text-destructive",
} as const;

export default function AiPage() {
  if (getSession()?.role !== "admin") redirect("/dashboard");

  const insights = buildInsights();
  const report = buildMonthlyReport();

  return (
    <div>
      <PageHeader
        title="AI 운영 분석"
        description="사용 현황을 분석해 운영 개선 방향을 제안합니다."
      />

      {/* 윤리 안내 */}
      <div className="mb-6 flex items-start gap-2 rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm">
        <Info className="mt-0.5 size-4 shrink-0 text-primary" />
        <p className="text-muted-foreground">
          AI 분석 결과는 <span className="font-medium text-foreground">운영 개선을 위한 참고 자료</span>이며, 최종 의사결정은 관리자가 수행합니다.
          직원 평가 목적으로 사용하지 않습니다.
          {isDemoMode && " (데모 모드: 규칙 기반 분석 — OPENAI_API_KEY 설정 시 자연어 리포트가 생성됩니다.)"}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {insights.map((ins) => (
          <Card key={ins.key}>
            <CardHeader className="flex-row items-center gap-2">
              <span className={`flex size-8 items-center justify-center rounded-lg ${toneMap[ins.tone]}`}>
                <Icon name={ins.icon} className="size-4" />
              </span>
              <CardTitle className="text-base">{ins.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {ins.items.map((it, i) => (
                <div key={i} className="border-l-2 border-border pl-3">
                  <p className="text-sm font-medium">{it.label}</p>
                  <p className="text-xs text-muted-foreground">{it.detail}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 월간 리포트 */}
      <Card className="mt-6">
        <CardHeader className="flex-row items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Sparkles className="size-4" />
          </span>
          <CardTitle className="text-base">월간 운영 리포트 (자동 생성)</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="whitespace-pre-wrap rounded-lg bg-muted p-4 text-sm leading-relaxed text-foreground/90">
            {report}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
