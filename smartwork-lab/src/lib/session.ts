import { cookies } from "next/headers";
import type { Role, User } from "./types";
import { users } from "./seed";

/**
 * 현재 로그인 사용자를 반환합니다.
 *
 * 데모 모드: 쿠키(sw_role)에 저장된 역할로 시드 사용자를 반환합니다.
 * 운영 모드: 이 함수 내부를 Supabase auth.getUser() + profiles 조회로 교체하면
 *            나머지 화면 코드는 수정 없이 동작합니다. (권한 분리 유지)
 */
export function getSession(): User | null {
  const role = cookies().get("sw_role")?.value as Role | undefined;
  if (!role) return null;
  const name = cookies().get("sw_name")?.value;
  const base = users.find((u) => u.role === role) ?? users[0];
  return { ...base, name: name || base.name };
}

export function isAdmin(): boolean {
  return getSession()?.role === "admin";
}
