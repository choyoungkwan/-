// 사이드바 네비게이션 구성 — 새 메뉴 추가가 쉽도록 데이터로 분리
export interface NavItem {
  href: string;
  label: string;
  icon: string; // lucide 아이콘 이름
  adminOnly?: boolean;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const navSections: NavSection[] = [
  {
    title: "이용",
    items: [
      { href: "/dashboard", label: "홈 대시보드", icon: "LayoutDashboard" },
      { href: "/apps", label: "웹앱", icon: "LayoutGrid" },
      { href: "/favorites", label: "즐겨찾기", icon: "Star" },
      { href: "/notices", label: "공지사항", icon: "Megaphone" },
    ],
  },
  {
    title: "요청·지원",
    items: [
      { href: "/improvements", label: "개선요청", icon: "Lightbulb" },
      { href: "/errors", label: "오류신고", icon: "Bug" },
    ],
  },
  {
    title: "운영 (관리자)",
    items: [
      { href: "/admin", label: "웹앱 관리", icon: "Settings2", adminOnly: true },
      { href: "/maintenance", label: "유지보수", icon: "Wrench", adminOnly: true },
      { href: "/ai", label: "AI 운영 분석", icon: "Sparkles", adminOnly: true },
      { href: "/logs", label: "감사 로그", icon: "ScrollText", adminOnly: true },
    ],
  },
];
