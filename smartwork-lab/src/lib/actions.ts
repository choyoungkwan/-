"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { Role } from "./types";
import * as data from "./data";
import { getSession } from "./session";

// ── 인증 (데모) ──────────────────────────────────────────────
export async function demoLogin(role: Role, name?: string) {
  const c = cookies();
  const oneWeek = 60 * 60 * 24 * 7;
  c.set("sw_role", role, { httpOnly: true, sameSite: "lax", maxAge: oneWeek, path: "/" });
  if (name) c.set("sw_name", name, { httpOnly: true, sameSite: "lax", maxAge: oneWeek, path: "/" });
  redirect("/dashboard");
}

export async function logout() {
  const c = cookies();
  c.delete("sw_role");
  c.delete("sw_name");
  redirect("/login");
}

// ── 즐겨찾기 ─────────────────────────────────────────────────
export async function toggleFavoriteAction(appId: string) {
  data.toggleFavorite(appId);
  revalidatePath("/apps");
  revalidatePath("/favorites");
  revalidatePath(`/apps/${appId}`);
}

// ── 웹앱 (관리자) ────────────────────────────────────────────
export async function createWebAppAction(formData: FormData) {
  requireAdmin();
  const url = String(formData.get("url") || "");
  const name = String(formData.get("name") || "");
  data.createWebApp({
    name,
    slug: String(formData.get("slug") || name.toLowerCase().replace(/\s+/g, "-")),
    description: String(formData.get("description") || ""),
    categoryId: String(formData.get("categoryId") || ""),
    tags: String(formData.get("tags") || "").split(",").map((t) => t.trim()).filter(Boolean),
    icon: String(formData.get("icon") || "AppWindow"),
    url,
    owner: String(formData.get("owner") || ""),
    ownerEmail: String(formData.get("ownerEmail") || "") || undefined,
    version: String(formData.get("version") || "1.0.0"),
    status: (String(formData.get("status") || "operating") as any),
  });
  revalidatePath("/apps");
  revalidatePath("/admin");
  redirect("/apps");
}

export async function updateWebAppStatusAction(id: string, status: string) {
  requireAdmin();
  data.updateWebApp(id, { status: status as any });
  revalidatePath("/admin");
  revalidatePath("/apps");
  revalidatePath(`/apps/${id}`);
}

export async function deleteWebAppAction(id: string) {
  requireAdmin();
  data.deleteWebApp(id);
  revalidatePath("/apps");
  revalidatePath("/admin");
}

// ── 공지 (관리자) ────────────────────────────────────────────
export async function createNoticeAction(formData: FormData) {
  const session = requireAdmin();
  data.createNotice(
    String(formData.get("title") || ""),
    String(formData.get("body") || ""),
    session.name,
    formData.get("pinned") === "on"
  );
  revalidatePath("/notices");
  revalidatePath("/dashboard");
}

// ── 개선요청 ─────────────────────────────────────────────────
export async function createRequestAction(formData: FormData) {
  const session = getSession();
  data.createRequest({
    appId: String(formData.get("appId") || "") || undefined,
    title: String(formData.get("title") || ""),
    body: String(formData.get("body") || ""),
    requesterName: session?.name || "익명",
  });
  revalidatePath("/improvements");
}

export async function updateRequestStatusAction(id: string, status: string) {
  requireAdmin();
  data.updateRequestStatus(id, status as any);
  revalidatePath("/improvements");
}

// ── 오류신고 ─────────────────────────────────────────────────
export async function createErrorAction(formData: FormData) {
  const session = getSession();
  data.createError({
    appId: String(formData.get("appId") || "") || undefined,
    title: String(formData.get("title") || ""),
    body: String(formData.get("body") || ""),
    priority: (String(formData.get("priority") || "medium") as any),
    reporterName: session?.name || "익명",
  });
  revalidatePath("/errors");
}

export async function updateErrorStatusAction(id: string, status: string) {
  requireAdmin();
  data.updateErrorStatus(id, status as any);
  revalidatePath("/errors");
}

function requireAdmin() {
  const session = getSession();
  if (!session || session.role !== "admin") {
    throw new Error("권한이 없습니다. 관리자만 수행할 수 있습니다.");
  }
  return session;
}
