export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
export const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL || '/ws';

export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  ATTACK: '/attack',
  RESULTS: '/results',
  RESULT_DETAIL: '/results/:id',
  PROJECTS: '/projects',
} as const;

export const ROUTE_TITLES: Record<string, string> = {
  '/dashboard': '기본 페이지 (대시보드)',
  '/attack': '모의 공격 페이지',
  '/results': '모의 공격 결과',
  '/projects': '프로젝트 관리',
};

// RISK_LABELS와 RISK_STYLES는 RiskBadge 컴포넌트 내부로 이동 (shadcn Badge 활용)
