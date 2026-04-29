export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';
export const WS_BASE_URL =
  import.meta.env.VITE_WS_BASE_URL ||
  (typeof window !== 'undefined'
    ? `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}/ws`
    : '/ws');

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

// RISK_LABELS와 RISK_STYLES는 RiskBadge 컴포넌트 내부로 이동 (Blueprint Tag 활용)

// v1 백엔드가 실행 가능한 범위. voice/autonomous는 미구현.
export const SUPPORTED_MODEL_TYPES = ['cctv'] as const;
export const SUPPORTED_ATTACK_TYPE_IDS = ['atk-hiding', 'atk-altering', 'atk-creating'] as const;

export type SupportedModelType = (typeof SUPPORTED_MODEL_TYPES)[number];
export type SupportedAttackTypeId = (typeof SUPPORTED_ATTACK_TYPE_IDS)[number];

export const isModelTypeSupported = (modelType: string): boolean =>
  (SUPPORTED_MODEL_TYPES as readonly string[]).includes(modelType);

export const isAttackTypeSupported = (attackTypeId: string): boolean =>
  (SUPPORTED_ATTACK_TYPE_IDS as readonly string[]).includes(attackTypeId);
