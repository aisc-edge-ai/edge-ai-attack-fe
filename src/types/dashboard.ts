export type DeviceStatusType = 'online' | 'offline' | 'warning';
export type LogStatus = 'completed' | 'running' | 'failed';

export interface DashboardSummary {
  totalModels: number;
  totalAttacks: number;
  avgSuccessRate: number;
  safetyVerified: number;
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
