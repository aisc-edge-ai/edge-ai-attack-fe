export type DeviceStatusType = 'online' | 'offline' | 'warning';
export type LogStatus = 'completed' | 'running' | 'failed';

/**
 * 대시보드 상단 KPI 카드 — `GET /dashboard/summary`.
 *
 * `*Delta` 필드는 전주/전월 대비 변화량 (백분율 포인트). 백엔드 미구현 시 생략 가능,
 * UI 는 delta 없으면 변화량 칩을 숨김.
 */
export interface DashboardSummary {
  totalModels: number;
  totalAttacks: number;
  /** 0~100 정수 백분율 */
  avgSuccessRate: number;
  /** 안전 검증된 모델 수 */
  safetyVerified: number;
  modelsDelta?: number;
  attacksDelta?: number;
  successRateDelta?: number;
  safetyVerifiedDelta?: number;
}

/** Edge 디바이스 상태 — `GET /dashboard/devices`. mock 폴백 중. */
export interface DeviceStatus {
  name: string;
  status: DeviceStatusType;
  type: string;
}

/** 최근 공격 로그 — `GET /dashboard/recent-attacks`. mock 폴백 중. */
export interface RecentLog {
  status: LogStatus;
  model: string;
  attack: string;
  /** 백분율 문자열, 예: "82%" */
  successRate: string;
  date: string;
  risk: 'high' | 'low' | 'none';
}

/** 공격 trend 차트 — `GET /dashboard/trend`. mock 폴백 중. */
export interface DashboardTrendPoint {
  date: string;
  cctv: number;
  voice: number;
  autonomous: number;
  overall: number;
}

/** 모델별 취약도 점수 — `GET /dashboard/model-vulnerabilities`. mock 폴백 중. */
export interface ModelVulnerabilityScore {
  modelId: string;
  modelName: string;
  modelType: string;
  /** 0~100 정수 백분율 */
  avgSuccessRate: number;
  attackCount: number;
}

/** Risk 분포 — `GET /dashboard/risk-distribution`. mock 폴백 중. */
export interface RiskDistribution {
  vulnerable: number;
  warning: number;
  safe: number;
}
