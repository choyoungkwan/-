-- ─────────────────────────────────────────────────────────────
-- 스마트워크 랩 — 시드 데이터 (schema.sql 실행 후 사용)
-- 데모 화면과 동일한 초기 데이터입니다. 운영 데이터가 쌓이기 전 참고용.
-- ─────────────────────────────────────────────────────────────

-- 카테고리
insert into categories (name, slug, color, icon, "order") values
  ('행정·문서', 'admin', '#2563eb', 'FileText', 1),
  ('이용자 관리', 'client', '#059669', 'Users', 2),
  ('보고·통계', 'report', '#7c3aed', 'BarChart3', 3),
  ('소통·알림', 'comm', '#db2777', 'MessageSquare', 4),
  ('AI·자동화', 'ai', '#ea580c', 'Sparkles', 5)
on conflict (slug) do nothing;

-- 웹앱 (카테고리 slug 로 category_id 매핑)
insert into web_apps (name, slug, description, category_id, tags, icon, url, owner, version, status, launch_count, favorite_count)
select v.name, v.slug, v.description, c.id, v.tags, v.icon, v.url, v.owner, v.version, v.status::app_status, v.launch_count, v.favorite_count
from (values
  ('후원자 관리 대장', 'donor-ledger', '정기·일시 후원 내역을 등록하고 영수증을 자동 발급합니다.', 'client', array['후원','영수증','CRM'], 'HeartHandshake', 'https://apps.uman.or.kr/donor-ledger', '박후원', '2.3.1', 'operating', 1284, 42),
  ('사례관리 노트', 'case-notes', '이용자별 상담·사례관리 기록을 남기고 담당자 간 공유합니다.', 'client', array['사례관리','상담','기록'], 'NotebookPen', 'https://apps.uman.or.kr/case-notes', '이사례', '1.8.0', 'operating', 2041, 67),
  ('차량 예약 시스템', 'vehicle-booking', '공용 차량을 시간대별로 예약하고 중복 예약을 방지합니다.', 'admin', array['예약','차량','일정'], 'CarFront', 'https://apps.uman.or.kr/vehicle-booking', '최총무', '3.0.2', 'operating', 890, 31),
  ('월간 실적 보고서 생성기', 'monthly-report', '팀별 실적을 입력하면 표준 보고서를 자동 생성하고 PDF로 내려받습니다.', 'report', array['보고서','실적','PDF'], 'FileBarChart', 'https://apps.uman.or.kr/monthly-report', '정기획', '1.4.5', 'maintenance', 612, 24),
  ('프로그램 신청 접수', 'program-apply', '프로그램 신청을 온라인 접수하고 정원·대기자를 관리합니다.', 'client', array['신청','프로그램','QR'], 'ClipboardList', 'https://apps.uman.or.kr/program-apply', '한프로', '2.1.0', 'operating', 1560, 55),
  ('직원 공지 게시판', 'staff-board', '부서 공지와 회람을 게시하고 읽음 확인을 집계합니다.', 'comm', array['공지','회람','게시판'], 'Megaphone', 'https://apps.uman.or.kr/staff-board', '송소통', '1.2.3', 'operating', 3120, 88),
  ('AI 상담 요약 도우미', 'ai-summary', '상담 기록의 핵심 요약과 후속 조치를 제안합니다. 결과는 참고용입니다.', 'ai', array['AI','요약','상담'], 'Sparkles', 'https://apps.uman.or.kr/ai-summary', '정기획', '0.9.0', 'operating', 430, 19),
  ('비품 재고 관리', 'inventory', '비품 입출고와 재고를 기록하고 부족 품목을 알립니다.', 'admin', array['재고','비품','물품'], 'Package', 'https://apps.uman.or.kr/inventory', '최총무', '1.0.0', 'deprecated', 210, 6),
  ('자원봉사 시간 관리', 'volunteer-hours', '자원봉사 활동 시간을 기록하고 확인증을 발급합니다.', 'client', array['자원봉사','1365','확인증'], 'Clock', 'https://apps.uman.or.kr/volunteer-hours', '한프로', '1.5.2', 'operating', 740, 28),
  ('운영 통계 대시보드', 'ops-dashboard', '사업별 이용자 수·예산 집행률을 차트로 시각화합니다.', 'report', array['통계','차트','대시보드'], 'PieChart', 'https://apps.uman.or.kr/ops-dashboard', '정기획', '2.0.0', 'operating', 980, 40)
) as v(name, slug, description, cat_slug, tags, icon, url, owner, version, status, launch_count, favorite_count)
join categories c on c.slug = v.cat_slug
on conflict (slug) do nothing;

-- 공지
insert into notices (title, body, pinned, author_name) values
  ('스마트워크 랩 정식 오픈 안내', '흩어져 있던 스마트워크 웹앱을 한 곳에서 찾고 실행하세요. 자주 쓰는 웹앱은 즐겨찾기에 추가해 두세요.', true, '기획실'),
  ('[점검] 월간 실적 보고서 생성기 정기점검', '정기 점검 시간에는 이용이 제한됩니다.', false, '정기획'),
  ('개선요청·오류신고 안내', '불편한 점이나 오류는 상단 메뉴에서 바로 등록하세요.', false, '기획실');
