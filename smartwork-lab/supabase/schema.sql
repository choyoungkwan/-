-- ─────────────────────────────────────────────────────────────
-- 스마트워크 랩 (SmartWork Lab) — Supabase / PostgreSQL 스키마
-- Supabase SQL Editor 에 붙여넣어 실행하세요.
-- Row Level Security(RLS)로 권한 기반 접근 제어를 구현합니다.
-- ─────────────────────────────────────────────────────────────

-- 확장
create extension if not exists "uuid-ossp";

-- ── 역할 ENUM ────────────────────────────────────────────────
do $$ begin
  create type app_role as enum ('admin', 'staff');
  create type app_status as enum ('operating', 'maintenance', 'deprecated');
  create type request_status as enum ('received', 'reviewing', 'planned', 'done');
  create type error_status as enum ('open', 'in_progress', 'resolved', 'wontfix');
  create type maintenance_status as enum ('scheduled', 'in_progress', 'completed');
  create type priority as enum ('low', 'medium', 'high');
exception when duplicate_object then null; end $$;

-- ── 사용자 프로필 (auth.users 확장) ───────────────────────────
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  name text not null,
  role app_role not null default 'staff',
  department text,
  avatar_url text,
  created_at timestamptz not null default now()
);

-- ── 카테고리 ─────────────────────────────────────────────────
create table if not exists categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  color text not null default '#2563eb',
  icon text not null default 'Folder',
  "order" int not null default 0
);

-- ── 웹앱 ────────────────────────────────────────────────────
create table if not exists web_apps (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  description text not null default '',
  category_id uuid references categories(id) on delete set null,
  tags text[] not null default '{}',
  icon text not null default 'AppWindow',
  cover_image_url text,
  url text not null,
  owner text not null,
  owner_email text,
  version text not null default '1.0.0',
  status app_status not null default 'operating',
  launch_count int not null default 0,
  favorite_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- 중복 등록 방지: 동일 URL 유일
  constraint web_apps_url_unique unique (url)
);

-- ── 즐겨찾기 ─────────────────────────────────────────────────
create table if not exists favorites (
  user_id uuid references profiles(id) on delete cascade,
  app_id uuid references web_apps(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, app_id)
);

-- ── 공지 ────────────────────────────────────────────────────
create table if not exists notices (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  body text not null default '',
  pinned boolean not null default false,
  author_id uuid references profiles(id) on delete set null,
  author_name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── 유지보수 ─────────────────────────────────────────────────
create table if not exists maintenances (
  id uuid primary key default uuid_generate_v4(),
  app_id uuid references web_apps(id) on delete cascade,
  title text not null,
  assignee text not null,
  status maintenance_status not null default 'scheduled',
  scheduled_at timestamptz not null,
  completed_at timestamptz,
  checklist jsonb not null default '[]',
  notes text
);

-- ── 개선 요청 ────────────────────────────────────────────────
create table if not exists improvement_requests (
  id uuid primary key default uuid_generate_v4(),
  app_id uuid references web_apps(id) on delete set null,
  title text not null,
  body text not null default '',
  status request_status not null default 'received',
  requester_id uuid references profiles(id) on delete set null,
  requester_name text not null,
  attachments text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── 오류 신고 ────────────────────────────────────────────────
create table if not exists error_reports (
  id uuid primary key default uuid_generate_v4(),
  app_id uuid references web_apps(id) on delete set null,
  title text not null,
  body text not null default '',
  status error_status not null default 'open',
  priority priority not null default 'medium',
  reporter_id uuid references profiles(id) on delete set null,
  reporter_name text not null,
  screenshots text[] not null default '{}',
  history jsonb not null default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── 감사 로그 (모든 관리자 작업 기록) ─────────────────────────
create table if not exists audit_logs (
  id uuid primary key default uuid_generate_v4(),
  actor text not null,
  action text not null,
  target text not null,
  at timestamptz not null default now()
);

-- ── updated_at 자동 갱신 트리거 ──────────────────────────────
create or replace function set_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

do $$ begin
  create trigger trg_web_apps_updated before update on web_apps for each row execute function set_updated_at();
  create trigger trg_notices_updated before update on notices for each row execute function set_updated_at();
  create trigger trg_requests_updated before update on improvement_requests for each row execute function set_updated_at();
  create trigger trg_errors_updated before update on error_reports for each row execute function set_updated_at();
exception when duplicate_object then null; end $$;

-- ── 신규 auth 사용자 → profiles 자동 생성 ────────────────────
create or replace function handle_new_user() returns trigger as $$
begin
  insert into public.profiles (id, email, name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    'staff'
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

do $$ begin
  create trigger on_auth_user_created after insert on auth.users
    for each row execute function handle_new_user();
exception when duplicate_object then null; end $$;

-- ─────────────────────────────────────────────────────────────
-- Row Level Security — 권한 기반 접근 제어
-- ─────────────────────────────────────────────────────────────
alter table profiles enable row level security;
alter table categories enable row level security;
alter table web_apps enable row level security;
alter table favorites enable row level security;
alter table notices enable row level security;
alter table maintenances enable row level security;
alter table improvement_requests enable row level security;
alter table error_reports enable row level security;
alter table audit_logs enable row level security;

-- 현재 사용자가 관리자인지 확인하는 헬퍼
create or replace function is_admin() returns boolean as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable;

-- 프로필: 본인 조회/수정, 관리자는 전체
drop policy if exists profiles_select on profiles;
create policy profiles_select on profiles for select using (auth.uid() = id or is_admin());
drop policy if exists profiles_update on profiles;
create policy profiles_update on profiles for update using (auth.uid() = id or is_admin());

-- 카테고리/웹앱: 로그인 사용자 조회, 관리자만 변경
drop policy if exists categories_read on categories;
create policy categories_read on categories for select using (auth.role() = 'authenticated');
drop policy if exists categories_write on categories;
create policy categories_write on categories for all using (is_admin()) with check (is_admin());

drop policy if exists web_apps_read on web_apps;
create policy web_apps_read on web_apps for select using (auth.role() = 'authenticated');
drop policy if exists web_apps_write on web_apps;
create policy web_apps_write on web_apps for all using (is_admin()) with check (is_admin());

-- 즐겨찾기: 본인 것만
drop policy if exists favorites_own on favorites;
create policy favorites_own on favorites for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 공지: 전체 조회, 관리자만 작성/수정/삭제
drop policy if exists notices_read on notices;
create policy notices_read on notices for select using (auth.role() = 'authenticated');
drop policy if exists notices_write on notices;
create policy notices_write on notices for all using (is_admin()) with check (is_admin());

-- 유지보수: 전체 조회, 관리자만 변경
drop policy if exists maint_read on maintenances;
create policy maint_read on maintenances for select using (auth.role() = 'authenticated');
drop policy if exists maint_write on maintenances;
create policy maint_write on maintenances for all using (is_admin()) with check (is_admin());

-- 개선요청: 전체 조회, 직원은 본인 것 작성, 관리자는 상태 변경
drop policy if exists req_read on improvement_requests;
create policy req_read on improvement_requests for select using (auth.role() = 'authenticated');
drop policy if exists req_insert on improvement_requests;
create policy req_insert on improvement_requests for insert with check (auth.uid() = requester_id);
drop policy if exists req_update on improvement_requests;
create policy req_update on improvement_requests for update using (is_admin());

-- 오류신고: 동일 정책
drop policy if exists err_read on error_reports;
create policy err_read on error_reports for select using (auth.role() = 'authenticated');
drop policy if exists err_insert on error_reports;
create policy err_insert on error_reports for insert with check (auth.uid() = reporter_id);
drop policy if exists err_update on error_reports;
create policy err_update on error_reports for update using (is_admin());

-- 감사로그: 관리자만 조회 (삽입은 서버 서비스 롤)
drop policy if exists audit_read on audit_logs;
create policy audit_read on audit_logs for select using (is_admin());
