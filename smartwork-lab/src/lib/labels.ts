// 상태/우선순위 한글 라벨 + 뱃지 색상 매핑 (일관된 UI 표현)
import type {
  AppStatus,
  ErrorStatus,
  MaintenanceStatus,
  Priority,
  RequestStatus,
} from "./types";

type Variant = "default" | "success" | "warning" | "destructive" | "muted" | "secondary";

export const appStatusLabel: Record<AppStatus, { label: string; variant: Variant }> = {
  operating: { label: "운영중", variant: "success" },
  maintenance: { label: "점검중", variant: "warning" },
  deprecated: { label: "종료", variant: "muted" },
};

export const requestStatusLabel: Record<RequestStatus, { label: string; variant: Variant }> = {
  received: { label: "접수", variant: "secondary" },
  reviewing: { label: "검토중", variant: "default" },
  planned: { label: "반영예정", variant: "warning" },
  done: { label: "완료", variant: "success" },
};

export const errorStatusLabel: Record<ErrorStatus, { label: string; variant: Variant }> = {
  open: { label: "접수", variant: "destructive" },
  in_progress: { label: "처리중", variant: "warning" },
  resolved: { label: "해결", variant: "success" },
  wontfix: { label: "보류", variant: "muted" },
};

export const maintenanceStatusLabel: Record<MaintenanceStatus, { label: string; variant: Variant }> = {
  scheduled: { label: "예정", variant: "secondary" },
  in_progress: { label: "진행중", variant: "warning" },
  completed: { label: "완료", variant: "success" },
};

export const priorityLabel: Record<Priority, { label: string; variant: Variant }> = {
  low: { label: "낮음", variant: "muted" },
  medium: { label: "보통", variant: "secondary" },
  high: { label: "높음", variant: "destructive" },
};

export const requestStatusOrder: RequestStatus[] = ["received", "reviewing", "planned", "done"];
export const errorStatusOrder: ErrorStatus[] = ["open", "in_progress", "resolved", "wontfix"];
