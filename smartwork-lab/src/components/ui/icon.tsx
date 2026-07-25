import { icons, type LucideProps } from "lucide-react";
import { AppWindow } from "lucide-react";

/**
 * lucide 아이콘 이름(문자열)으로 아이콘을 렌더링합니다.
 * 웹앱/카테고리 데이터가 아이콘 이름을 문자열로 저장하므로 이 매핑이 필요합니다.
 */
export function Icon({ name, ...props }: { name: string } & LucideProps) {
  const LucideIcon = (icons as Record<string, React.ComponentType<LucideProps>>)[name] ?? AppWindow;
  return <LucideIcon {...props} />;
}
