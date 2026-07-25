// ─────────────────────────────────────────────────────────────
// AI 운영 분석
//
// OPENAI_API_KEY 가 설정되면 OpenAI 로 자연어 리포트를 생성하고,
// 없으면 동일한 데이터를 규칙 기반으로 분석해 즉시 결과를 제공합니다.
// 어느 경우든 결과는 "참고용"이며 최종 의사결정은 관리자가 합니다.
// (사회복지 윤리 기준: 직원 평가 목적 사용 금지)
// ─────────────────────────────────────────────────────────────
import * as data from "./data";
import type { WebApp } from "./types";

export interface Insight {
  key: string;
  title: string;
  icon: string;
  tone: "default" | "success" | "warning" | "destructive";
  items: { label: string; detail: string }[];
}

export function buildInsights(): Insight[] {
  const apps = data.getWebApps();
  const errors = data.getErrors();
  const requests = data.getRequests();
  const sorted = [...apps].sort((a, b) => b.launchCount - a.launchCount);

  const mostUsed = sorted.slice(0, 3);
  const leastUsed = sorted
    .filter((a) => a.status !== "deprecated")
    .slice(-3)
    .reverse();

  // 유지보수 우선순위 = 미해결 오류 수(가중) + 사용량
  const priority = [...apps]
    .map((a) => {
      const openErr = errors.filter((e) => e.appId === a.id && (e.status === "open" || e.status === "in_progress")).length;
      const score = openErr * 100 + Math.round(a.launchCount / 100);
      return { app: a, openErr, score };
    })
    .filter((x) => x.openErr > 0 || x.app.status === "maintenance")
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return [
    {
      key: "most-used",
      title: "많이 사용하는 웹앱",
      icon: "TrendingUp",
      tone: "success",
      items: mostUsed.map((a) => ({
        label: a.name,
        detail: `실행 ${a.launchCount.toLocaleString()}회 · 즐겨찾기 ${a.favoriteCount}명 — 안정적 운영과 지속 지원 권장`,
      })),
    },
    {
      key: "least-used",
      title: "사용이 적은 웹앱",
      icon: "TrendingDown",
      tone: "warning",
      items: leastUsed.map((a) => ({
        label: a.name,
        detail: `실행 ${a.launchCount.toLocaleString()}회 — 홍보 강화 또는 기능 개선 여부 검토 필요`,
      })),
    },
    {
      key: "maintenance",
      title: "유지보수 우선순위 제안",
      icon: "Wrench",
      tone: "destructive",
      items: priority.length
        ? priority.map((p) => ({
            label: p.app.name,
            detail: `미해결 오류 ${p.openErr}건${p.app.status === "maintenance" ? " · 현재 점검중" : ""} — 우선 처리 권장`,
          }))
        : [{ label: "특이사항 없음", detail: "현재 긴급 유지보수가 필요한 웹앱이 없습니다." }],
    },
    {
      key: "ideas",
      title: "개선 아이디어 · 신규 추천",
      icon: "Lightbulb",
      tone: "default",
      items: [
        {
          label: "접수된 개선요청 반영",
          detail: `현재 미완료 개선요청 ${requests.filter((r) => r.status !== "done").length}건 — 사용 빈도 높은 웹앱부터 우선 반영을 제안합니다.`,
        },
        {
          label: "통합 알림 기능",
          detail: "여러 웹앱의 마감/일정 알림을 한 곳에서 받는 알림 센터 도입을 고려해볼 수 있습니다.",
        },
        {
          label: "모바일 간편 실행",
          detail: "실행 빈도가 높은 상위 웹앱을 홈 화면 바로가기로 추천하면 접근성이 향상됩니다.",
        },
      ],
    },
  ];
}

export function buildMonthlyReport(): string {
  const stats = data.getDashboardStats();
  const apps = data.getWebApps();
  const top = data.getPopularApps(3);
  const month = new Date().toISOString().slice(0, 7).replace("-", "년 ") + "월";

  return [
    `# ${month} 스마트워크 운영 리포트`,
    "",
    `## 운영 현황`,
    `- 전체 웹앱 ${stats.totalApps}개 (운영중 ${stats.operating} · 점검중 ${stats.maintenance})`,
    `- 이번 달 신규 등록 ${stats.newThisMonth}개`,
    `- 미해결 오류 ${stats.openErrors}건 · 처리 대기 개선요청 ${stats.openRequests}건`,
    "",
    `## 이용 분석`,
    `- 총 실행 횟수 ${apps.reduce((s, a) => s + a.launchCount, 0).toLocaleString()}회`,
    `- 인기 웹앱: ${top.map((a) => a.name).join(", ")}`,
    "",
    `## 권고 사항 (참고용)`,
    `- 사용량 상위 웹앱의 안정적 운영을 유지하고, 미해결 오류를 우선 처리하십시오.`,
    `- 사용이 저조한 웹앱은 홍보 또는 기능 개선 필요성을 검토하십시오.`,
    "",
    `> 본 리포트는 운영 개선을 위한 참고 자료이며, 직원 평가 목적으로 사용하지 않습니다.`,
  ].join("\n");
}

/** 운영 모드에서 OpenAI 로 리포트를 생성 (환경변수 설정 시). */
export async function generateAiReport(): Promise<string> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return buildMonthlyReport();

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [
          { role: "system", content: "너는 사회복지관의 스마트워크 운영 분석가다. 결과는 참고용이며 직원 평가에 쓰지 않는다. 한국어로 간결하게 작성한다." },
          { role: "user", content: `다음 운영 데이터로 월간 리포트를 작성해줘:\n${buildMonthlyReport()}` },
        ],
        temperature: 0.4,
      }),
    });
    const json = await res.json();
    return json.choices?.[0]?.message?.content ?? buildMonthlyReport();
  } catch {
    return buildMonthlyReport();
  }
}
