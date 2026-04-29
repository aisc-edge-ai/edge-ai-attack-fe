import apiClient from './client';
import type {
  DashboardSummary,
  DashboardTrendPoint,
  DeviceStatus,
  ModelVulnerabilityScore,
  RecentLog,
  RiskDistribution,
} from '@/types';
import {
  MOCK_DASHBOARD_TREND,
  MOCK_DEVICE_STATUSES,
  MOCK_MODEL_VULNERABILITIES,
  MOCK_RECENT_LOGS,
  MOCK_RISK_DISTRIBUTION,
} from '@/lib/mock-data';

/**
 * 백엔드가 신규 대시보드 엔드포인트를 구현하기 전까지 임시로 mock 데이터를 반환한다.
 * 백엔드 구현 완료 시 해당 엔드포인트의 호출에서 `withMockFallback` 래퍼만 벗기면 즉시
 * 실데이터로 전환된다. 모든 엔드포인트가 구현되면 이 헬퍼와 mock import를 제거하면 됨.
 */
async function withMockFallback<T>(
  fetcher: () => Promise<T>,
  mock: T,
  endpointName: string
): Promise<T> {
  try {
    return await fetcher();
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn(
        `[dashboard] ${endpointName} 미구현 또는 호출 실패 → mock 데이터로 폴백`,
        error
      );
    }
    return mock;
  }
}

export const dashboardApi = {
  // 백엔드 구현 완료 → 폴백 없음 (KPI 응답이 부분적이어도 컴포넌트가 안전하게 렌더)
  getSummary: async (): Promise<DashboardSummary> => {
    const response = await apiClient.get<DashboardSummary>('/dashboard/summary');
    return response.data;
  },

  // 백엔드 미구현 → mock 폴백
  getTrend: (days: number = 30): Promise<DashboardTrendPoint[]> =>
    withMockFallback(
      async () => {
        const response = await apiClient.get<DashboardTrendPoint[]>('/dashboard/trend', {
          params: { days },
        });
        return response.data;
      },
      MOCK_DASHBOARD_TREND.slice(-days),
      '/dashboard/trend'
    ),

  getDevices: (): Promise<DeviceStatus[]> =>
    withMockFallback(
      async () => {
        const response = await apiClient.get<DeviceStatus[]>('/dashboard/devices');
        return response.data;
      },
      MOCK_DEVICE_STATUSES,
      '/dashboard/devices'
    ),

  getModelVulnerabilities: (): Promise<ModelVulnerabilityScore[]> =>
    withMockFallback(
      async () => {
        const response = await apiClient.get<ModelVulnerabilityScore[]>(
          '/dashboard/model-vulnerabilities'
        );
        return response.data;
      },
      MOCK_MODEL_VULNERABILITIES,
      '/dashboard/model-vulnerabilities'
    ),

  getRiskDistribution: (): Promise<RiskDistribution> =>
    withMockFallback(
      async () => {
        const response = await apiClient.get<RiskDistribution>('/dashboard/risk-distribution');
        return response.data;
      },
      MOCK_RISK_DISTRIBUTION,
      '/dashboard/risk-distribution'
    ),

  getRecentAttacks: (limit: number = 5): Promise<RecentLog[]> =>
    withMockFallback(
      async () => {
        const response = await apiClient.get<RecentLog[]>('/dashboard/recent-attacks', {
          params: { limit },
        });
        return response.data;
      },
      MOCK_RECENT_LOGS.slice(0, limit),
      '/dashboard/recent-attacks'
    ),
};
