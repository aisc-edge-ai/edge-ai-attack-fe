import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/api/dashboard';
import { DASHBOARD_REFETCH_INTERVAL } from '@/lib/query-config';

export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: dashboardApi.getSummary,
    staleTime: 25_000,
    refetchInterval: DASHBOARD_REFETCH_INTERVAL,
  });
}

export function useDashboardTrend(days: number = 30) {
  return useQuery({
    queryKey: ['dashboard', 'trend', days],
    queryFn: () => dashboardApi.getTrend(days),
  });
}

export function useDashboardDevices() {
  return useQuery({
    queryKey: ['dashboard', 'devices'],
    queryFn: dashboardApi.getDevices,
    staleTime: 25_000,
    refetchInterval: DASHBOARD_REFETCH_INTERVAL,
  });
}

export function useDashboardModelVulnerabilities() {
  return useQuery({
    queryKey: ['dashboard', 'modelVulnerabilities'],
    queryFn: dashboardApi.getModelVulnerabilities,
  });
}

export function useDashboardRiskDistribution() {
  return useQuery({
    queryKey: ['dashboard', 'riskDistribution'],
    queryFn: dashboardApi.getRiskDistribution,
  });
}

export function useDashboardRecentAttacks(limit: number = 5) {
  return useQuery({
    queryKey: ['dashboard', 'recentAttacks', limit],
    queryFn: () => dashboardApi.getRecentAttacks(limit),
    staleTime: 25_000,
    refetchInterval: DASHBOARD_REFETCH_INTERVAL,
  });
}
