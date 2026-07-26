# Vercel 배포 가이드

이 앱(`smartwork-lab/`)은 Next.js 이므로 Vercel에 최적화되어 있습니다.
환경변수 없이도 **데모 모드**로 즉시 배포되며, Supabase/OpenAI 값을 넣으면 운영 모드로 전환됩니다.

## 1. 프로젝트 Import

1. [vercel.com](https://vercel.com) → GitHub 로그인
2. **Add New → Project** → 저장소 `choyoungkwan/-` Import
3. **Configure Project** 화면에서:
   - **Root Directory** → **`smartwork-lab`** 로 지정 ⚠️ (앱이 하위 폴더에 있음)
   - Framework Preset → **Next.js** (자동 감지)
   - Production Branch → 배포할 브랜치 선택
4. **Deploy**

> `vercel.json` 에 지역(`icn1`, 서울)과 기본 보안 헤더가 설정되어 있어 별도 조정 없이 배포됩니다.

## 2. 환경변수 (운영 모드로 전환할 때)

Vercel → 프로젝트 → **Settings → Environment Variables** 에 추가 후 **Redeploy**:

| 변수 | 설명 |
|--|--|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon public 키 |
| `OPENAI_API_KEY` | (선택) AI 운영 분석용 |
| `OPENAI_MODEL` | (선택) 기본 `gpt-4o-mini` |

- `NEXT_PUBLIC_SUPABASE_URL` 이 채워지면 실제 Google 로그인이 활성화됩니다.
- Supabase 스키마는 `supabase/schema.sql` → `supabase/seed.sql` 순서로 실행하세요.
- Google OAuth 리다이렉트 URL은 배포 도메인 기준 `https://<도메인>/api/auth/callback` 을 Supabase/Google Console에 등록합니다.

## 3. 로컬 배포 테스트

```bash
cd smartwork-lab
npm install
npm run build   # 프로덕션 빌드 검증
npm start        # http://localhost:3000
```
