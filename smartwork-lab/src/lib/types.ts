// ─────────────────────────────────────────────────────────────
// 스마트워크 랩 도메인 타입 정의
// Supabase 테이블 스키마(supabase/schema.sql)와 1:1 로 대응됩니다.
// ─────────────────────────────────────────────────────────────

export type Role = "admin" | "staff";

export type AppStatus = "operating" | "maintenance" | "deprecated";

export type RequestStatus =
  | "received" // 접수
  | "reviewing" // 검토중
  | "planned" // 반영예정
  | "done"; // 완료

export type ErrorStatus =
  | "open" // 접수
  | "in_progress" // 처리중
  | "resolved" // 해결
  | "wontfix"; // 미해결(보류)

export type MaintenanceStatus =
  | "scheduled" // 예정
  | "in_progress" // 진행중
  | "completed"; // 완료

export type Priority = "low" | "medium" | "high";

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  department?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  color: string; // hex, 카드/뱃지 포인트 컬러
  icon: string; // lucide 아이콘 이름
  order: number;
}

export interface WebApp {
  id: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  tags: string[];
  icon: string; // lucide 아이콘 이름
  coverImageUrl?: string;
  url: string;
  owner: string; // 담당자
  ownerEmail?: string;
  version: string;
  status: AppStatus;
  createdAt: string;
  updatedAt: string;
  // 집계 지표 (운영 분석용)
  launchCount: number;
  favoriteCount: number;
}

export interface Notice {
  id: string;
  title: string;
  body: string;
  pinned: boolean;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}

export interface Maintenance {
  id: string;
  appId: string;
  title: string;
  assignee: string;
  status: MaintenanceStatus;
  scheduledAt: string;
  completedAt?: string;
  checklist: { label: string; done: boolean }[];
  notes?: string;
}

export interface ImprovementRequest {
  id: string;
  appId?: string;
  title: string;
  body: string;
  status: RequestStatus;
  requesterName: string;
  attachments: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ErrorReport {
  id: string;
  appId?: string;
  title: string;
  body: string;
  status: ErrorStatus;
  priority: Priority;
  reporterName: string;
  screenshots: string[];
  history: { at: string; by: string; note: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface Favorite {
  userId: string;
  appId: string;
}

export interface AuditLog {
  id: string;
  actor: string;
  action: string;
  target: string;
  at: string;
}

// 대시보드 집계 결과
export interface DashboardStats {
  totalApps: number;
  operating: number;
  maintenance: number;
  newThisMonth: number;
  openErrors: number;
  openRequests: number;
  upcomingMaintenance: number;
}
