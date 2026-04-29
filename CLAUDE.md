# CLAUDE.md — 엣지 AI 모의공격시스템 프론트엔드

## 프로젝트 개요

IITP 엣지 AI 보안 과제의 시제품. 다양한 AI 모델(이미지 분류, 객체 인식, 음성 인식)에 대한 모의 공격 수행 및 취약성 분석 시스템의 프론트엔드.

- **레포**: https://github.com/aisc-edge-ai/edge-ai-attack-fe
- **백엔드**: 별도 레포 (edge-ai-attack-be), FastAPI 등 Python 기반 예정
- **현재 상태**: 로그인 + 모의공격 수행 + 결과 페이지 구현 완료, MSW mock으로 독립 개발 중

## 기술 스택

| 영역 | 기술 |
|------|------|
| 빌드 | Vite 8 + React 18 + TypeScript 6 |
| UI | **Palantir Blueprint 6** (Apache 2.0 License) |
| 라우팅 | React Router v7 |
| 상태관리 | Zustand (클라이언트) + TanStack Query (서버) |
| HTTP | Axios (JWT 인터셉터) |
| 실시간 | WebSocket (공격 진행률) |
| 차트 | Recharts |
| 아이콘 | @blueprintjs/icons |
| 폼 | React Hook Form + Zod |
| Mock | MSW (Mock Service Worker) |
| 테스트 | Vitest + React Testing Library |
| CSS | Blueprint CSS + 커스텀 CSS (Tailwind 미사용) |

## 빠른 시작

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # dist/ 정적 파일 생성
npm run lint
```

Mock 계정: `admin` / `admin`

## 디렉토리 구조

```
src/
├── app/              # App.tsx, routes.tsx, providers.tsx
├── layouts/          # AuthLayout, DashboardLayout (Blueprint Menu 기반 사이드바)
├── pages/
│   ├── login/        # 로그인 (Blueprint Card + FormGroup)
│   ├── attack/       # 모의 공격 수행 (3-step 위자드)
│   ├── results/      # 모의 공격 결과 (Blueprint Tabs + HTMLTable)
│   ├── dashboard/    # 대시보드 (placeholder)
│   └── projects/     # 프로젝트 관리 (placeholder)
├── components/
│   └── shared/       # RiskBadge, StatusDot, EmptyState, ProtectedRoute, CCTVBackground
├── api/              # Axios 클라이언트 + 엔드포인트별 모듈
├── hooks/            # useAuth, useAttacks, useAttackProgress, useDatasets, useResults
├── stores/           # Zustand: authStore, attackWizardStore
├── types/            # TypeScript 인터페이스
├── lib/              # constants, utils(classnames), mock-data, toaster
├── mocks/            # MSW 핸들러 (dev 전용)
└── main.tsx          # 진입점 (MSW 초기화 포함)
```

## 페이지 & 라우팅

| 경로 | 페이지 | 상태 |
|------|--------|------|
| `/login` | 로그인 | ✅ 완성 |
| `/dashboard` | 대시보드 | 📌 placeholder |
| `/attack` | 모의 공격 수행 (3-step 위자드) | ✅ 완성 |
| `/results` | 모의 공격 결과 | ✅ 완성 |
| `/results/:id` | 결과 상세 분석 | ✅ 완성 |
| `/projects` | 프로젝트 관리 | 📌 placeholder |

인증 필요한 모든 경로는 `ProtectedRoute`로 감싸져 있음. 미인증 시 `/login`으로 리디렉트.

## 핵심 아키텍처 결정

### 인증 플로우
- JWT (accessToken + refreshToken)
- `authStore` (Zustand + persist) → refreshToken만 localStorage 저장
- Axios 인터셉터: 요청 시 Bearer 자동 첨부, 401 시 refresh → 실패 시 로그아웃

### 모의 공격 위자드 (핵심 기능)
- 3-step: 모델 선택 → 공격 선택 → 데이터 소스/실행
- `attackWizardStore` (Zustand)로 전체 위자드 상태 관리
- 실행 후 WebSocket으로 실시간 진행률 수신 (DEV에서는 mock)
- 완료 후: 데이터 저장 / 결과 보기 / 새 공격 선택

### Mock API 전략
- MSW가 dev 환경에서 모든 API를 가로챔
- 백엔드 완성되면 handler 단위로 제거하여 점진적 전환
- `src/mocks/handlers.ts`에 모든 mock 정의

## 백엔드 API 엔드포인트 (프론트에서 사용)

| 메서드 | 경로 | 용도 |
|--------|------|------|
| POST | `/auth/login` | 로그인 |
| POST | `/auth/refresh` | 토큰 갱신 |
| GET | `/attack?modelType=` | 공격 목록 |
| POST | `/attack/execute` | 공격 실행 → `{ attackId }` |
| WS | `/ws/attack/{id}/progress` | 진행률 |
| GET | `/datasets?sort=` | 데이터셋 목록 |
| POST | `/datasets/save` | 공격 데이터 저장 |
| GET | `/results` | 결과 목록 |
| GET | `/results/{id}` | 결과 상세 |
| GET | `/results/summary` | 결과 요약 KPI |
| GET | `/dashboard/summary` | 대시보드 KPI |

## 코딩 규칙

### 디자인 시스템
> 상세 내용: [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md)

### 에러 수정 로그
> 과거 발생한 주요 버그와 해결 방법: [docs/ERROR_LOG.md](docs/ERROR_LOG.md)

### 사이트 카피
> 페이지별 UI 텍스트 정의: [docs/copy.md](docs/copy.md)

- **UI 라이브러리**: Palantir Blueprint 6 컴포넌트 우선 사용 (Button, Card, Dialog, HTMLTable, Tag 등)
- **스타일링**: Blueprint CSS 클래스 + 커스텀 CSS (Tailwind 미사용)
- **아이콘**: `@blueprintjs/icons` — `<Icon icon="icon-name" />` 패턴
- **색상**: Blueprint intent 시스템 (PRIMARY, SUCCESS, WARNING, DANGER) + 커스텀 CSS 변수
- **토스트**: `AppToaster` (Blueprint OverlayToaster) — `src/lib/toaster.ts`
- **클래스 유틸**: `cn()` from `src/lib/utils.ts` (classnames 래퍼)
- **CSS 네임스페이스**: Blueprint 6은 `bp6-` 접두사 사용 (`bp5-` 아님). 유틸 클래스: `bp6-heading`, `bp6-text-muted`, `bp6-skeleton`, `bp6-dark` 등

### 파일 구조
- 페이지별 디렉토리: `pages/<페이지명>/` + `components/` 하위 폴더
- API: `api/<도메인>.ts` (Axios 호출) → `hooks/use<도메인>.ts` (TanStack Query 래퍼)
- 타입: `types/<도메인>.ts`
- 공유 컴포넌트: `components/shared/`

### 상태 관리
- 서버 데이터 → TanStack Query (`useQuery`, `useMutation`)
- 클라이언트 전용 상태 → Zustand store
- 폼 상태 → React Hook Form + Zod (Blueprint InputGroup은 `Controller` 사용)

## 구현 우선순위

1. ~~로그인~~ ✅
2. ~~모의 공격 수행~~ ✅
3. ~~모의 공격 결과~~ ✅
4. **프로젝트 관리** ← 다음
5. 대시보드

## 환경 변수

| 변수 | dev | prod |
|------|-----|------|
| `VITE_API_BASE_URL` | `http://localhost:8080/api` | `/api` |
| `VITE_WS_BASE_URL` | `ws://localhost:8080/ws` | `/ws` |

## 배포

```bash
npm run build   # dist/ 생성
# nginx에 dist/ 서빙 + /api, /ws를 백엔드로 프록시
```

## 라이선스 고지

- **Palantir Blueprint**: Apache License 2.0 — 상업적 사용, 수정, 배포 허용
