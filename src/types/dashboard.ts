export type DeviceStatusType = 'online' | 'offline' | 'warning';
export type LogStatus = 'completed' | 'running' | 'failed';

export interface DashboardSummary {
  totalModels: number;
  totalAttacks: number;
  avgSuccessRate: number;
  safetyVerified: number;
  // 백엔드가 아직 제공하지 않을 수 있어 optional로 처리.
  modelsDelta?: number;
  attacksDelta?: number;
  successRateDelta?: number;
  safetyVerifiedDelta?: number;
}

export interface DeviceStatus {
  name: string;
  status: DeviceStatusType;
  type: string;
}

export interface RecentLog {
  status: LogStatus;
  model: string;
  attack: string;
  successRate: string;
  date: string;
  risk: 'high' | 'low' | 'none';
}

export interface DashboardTrendPoint {
  date: string;
  cctv: number;
  voice: number;
  autonomous: number;
  overall: number;
}

export interface ModelVulnerabilityScore {
  modelId: string;
  modelName: string;
  modelType: string;
  avgSuccessRate: number;
  attackCount: number;
}

export interface RiskDistribution {
  vulnerable: number;
  warning: number;
  safe: number;
}
