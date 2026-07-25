"use client";
import * as React from "react";
import { Select } from "@/components/ui/input";

/**
 * 상태 변경 셀렉트 — 값이 바뀌면 바인딩된 서버 액션을 호출합니다. (관리자 전용 UI)
 * 호출부에서 대상 id 를 미리 바인딩한 action 을 넘깁니다.
 */
export function StatusSelect({
  value,
  options,
  action,
  className,
}: {
  value: string;
  options: { value: string; label: string }[];
  action: (value: string) => Promise<void>;
  className?: string;
}) {
  const [pending, start] = React.useTransition();
  return (
    <Select
      defaultValue={value}
      disabled={pending}
      className={className}
      onChange={(e) => {
        const v = e.target.value;
        start(() => action(v));
      }}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </Select>
  );
}
