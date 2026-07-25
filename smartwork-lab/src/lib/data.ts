// ─────────────────────────────────────────────────────────────
// 데이터 접근 계층 (Data Access Layer)
//
// 이 모듈은 화면 코드가 데이터 소스(Supabase / 데모)를 몰라도 되도록
// 단일 진입점을 제공합니다. 현재는 즉시 실행 가능한 "데모 모드"로 동작하며,
// Supabase 환경변수가 설정되면 lib/supabase 의 클라이언트로 교체하여
// 동일한 함수 시그니처로 확장할 수 있습니다. (확장성/유지보수성 목표)
// ─────────────────────────────────────────────────────────────
import * as seed from "./seed";
import type {
  Category,
  DashboardStats,
  ErrorReport,
  ImprovementRequest,
  Maintenance,
  Notice,
  WebApp,
} from "./types";

export const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL;

// 서버 프로세스 수명 동안 유지되는 가변 데모 저장소.
// (등록/수정 등의 동작을 데모에서도 확인할 수 있게 함)
const store = {
  categories: [...seed.categories],
  webApps: [...seed.webApps],
  notices: [...seed.notices],
  maintenances: [...seed.maintenances],
  requests: [...seed.improvementRequests],
  errors: [...seed.errorReports],
  auditLogs: [...seed.auditLogs],
  favorites: new Set<string>(["a-2", "a-6"]), // 데모 사용자의 즐겨찾기
};

const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v));
const uid = (p: string) => `${p}-${Math.random().toString(36).slice(2, 8)}`;

// ── 조회 ────────────────────────────────────────────────────
export function getCategories(): Category[] {
  return clone(store.categories.sort((a, b) => a.order - b.order));
}

export function getWebApps(): WebApp[] {
  return clone(store.webApps);
}

export function getWebApp(id: string): WebApp | undefined {
  return clone(store.webApps.find((a) => a.id === id));
}

export function getWebAppBySlug(slug: string): WebApp | undefined {
  return clone(store.webApps.find((a) => a.slug === slug));
}

export function getCategory(id: string): Category | undefined {
  return store.categories.find((c) => c.id === id);
}

export function getNotices(): Notice[] {
  return clone(
    store.notices.sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return b.createdAt.localeCompare(a.createdAt);
    })
  );
}

export function getMaintenances(): Maintenance[] {
  return clone(
    store.maintenances.sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt))
  );
}

export function getRequests(): ImprovementRequest[] {
  return clone(store.requests.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
}

export function getErrors(): ErrorReport[] {
  return clone(store.errors.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
}

export function getAuditLogs() {
  return clone(store.auditLogs.sort((a, b) => b.at.localeCompare(a.at)));
}

export function getFavorites(): string[] {
  return [...store.favorites];
}

// ── 집계 ────────────────────────────────────────────────────
export function getDashboardStats(): DashboardStats {
  const apps = store.webApps;
  const thisMonth = new Date().toISOString().slice(0, 7);
  return {
    totalApps: apps.length,
    operating: apps.filter((a) => a.status === "operating").length,
    maintenance: apps.filter((a) => a.status === "maintenance").length,
    newThisMonth: apps.filter((a) => a.createdAt.slice(0, 7) === thisMonth).length,
    openErrors: store.errors.filter((e) => e.status === "open" || e.status === "in_progress").length,
    openRequests: store.requests.filter((r) => r.status !== "done").length,
    upcomingMaintenance: store.maintenances.filter((m) => m.status !== "completed").length,
  };
}

export function getPopularApps(limit = 5): WebApp[] {
  return clone([...store.webApps].sort((a, b) => b.launchCount - a.launchCount).slice(0, limit));
}

export function getRecentlyUpdatedApps(limit = 5): WebApp[] {
  return clone(
    [...store.webApps].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, limit)
  );
}

// ── 변경 (데모 저장소에 반영) ──────────────────────────────────
export function toggleFavorite(appId: string): boolean {
  if (store.favorites.has(appId)) {
    store.favorites.delete(appId);
    const app = store.webApps.find((a) => a.id === appId);
    if (app) app.favoriteCount = Math.max(0, app.favoriteCount - 1);
    return false;
  }
  store.favorites.add(appId);
  const app = store.webApps.find((a) => a.id === appId);
  if (app) app.favoriteCount += 1;
  return true;
}

export function createWebApp(input: Omit<WebApp, "id" | "createdAt" | "updatedAt" | "launchCount" | "favoriteCount">): WebApp {
  const nowIso = new Date().toISOString();
  const app: WebApp = {
    ...input,
    id: uid("a"),
    createdAt: nowIso,
    updatedAt: nowIso,
    launchCount: 0,
    favoriteCount: 0,
  };
  store.webApps.unshift(app);
  logAction("관리자", "웹앱 등록", app.name);
  return clone(app);
}

export function updateWebApp(id: string, patch: Partial<WebApp>): WebApp | undefined {
  const app = store.webApps.find((a) => a.id === id);
  if (!app) return undefined;
  Object.assign(app, patch, { updatedAt: new Date().toISOString() });
  logAction("관리자", "웹앱 수정", app.name);
  return clone(app);
}

export function deleteWebApp(id: string): boolean {
  const idx = store.webApps.findIndex((a) => a.id === id);
  if (idx < 0) return false;
  const [removed] = store.webApps.splice(idx, 1);
  logAction("관리자", "웹앱 삭제", removed.name);
  return true;
}

export function createNotice(title: string, body: string, authorName: string, pinned = false): Notice {
  const nowIso = new Date().toISOString();
  const notice: Notice = { id: uid("n"), title, body, pinned, authorName, createdAt: nowIso, updatedAt: nowIso };
  store.notices.unshift(notice);
  logAction(authorName, "공지 작성", title);
  return clone(notice);
}

export function createRequest(input: { appId?: string; title: string; body: string; requesterName: string }): ImprovementRequest {
  const nowIso = new Date().toISOString();
  const req: ImprovementRequest = {
    id: uid("r"),
    appId: input.appId,
    title: input.title,
    body: input.body,
    status: "received",
    requesterName: input.requesterName,
    attachments: [],
    createdAt: nowIso,
    updatedAt: nowIso,
  };
  store.requests.unshift(req);
  return clone(req);
}

export function updateRequestStatus(id: string, status: ImprovementRequest["status"]): void {
  const r = store.requests.find((x) => x.id === id);
  if (r) {
    r.status = status;
    r.updatedAt = new Date().toISOString();
    logAction("관리자", "개선요청 상태변경", `${r.title} → ${status}`);
  }
}

export function createError(input: { appId?: string; title: string; body: string; priority: ErrorReport["priority"]; reporterName: string }): ErrorReport {
  const nowIso = new Date().toISOString();
  const err: ErrorReport = {
    id: uid("e"),
    appId: input.appId,
    title: input.title,
    body: input.body,
    status: "open",
    priority: input.priority,
    reporterName: input.reporterName,
    screenshots: [],
    history: [],
    createdAt: nowIso,
    updatedAt: nowIso,
  };
  store.errors.unshift(err);
  return clone(err);
}

export function updateErrorStatus(id: string, status: ErrorReport["status"], note?: string): void {
  const e = store.errors.find((x) => x.id === id);
  if (e) {
    e.status = status;
    e.updatedAt = new Date().toISOString();
    if (note) e.history.unshift({ at: e.updatedAt, by: "관리자", note });
    logAction("관리자", "오류신고 상태변경", `${e.title} → ${status}`);
  }
}

function logAction(actor: string, action: string, target: string) {
  store.auditLogs.unshift({ id: uid("l"), actor, action, target, at: new Date().toISOString() });
}
