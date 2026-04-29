import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/api/dashboard';

export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: dashboardApi.getSummary,
    refetchInterval: 30000,
  });
}

export function useDashboardTrend(days: number = 30) {
  return useQuery({
    queryKey: ['dashboard', 'trend', days],
    queryFn: () => dashboardApi.getTrend(days),
    staleTime: 5 * 60 * 1000,
  });
}

export function useDashboardDevices() {
  return useQuery({
    queryKey: ['dashboard', 'devices'],
    queryFn: dashboardApi.getDevices,
    refetchInterval: 30000,
  });
}

export function useDashboardModelVulnerabilities() {
  return useQuery({
    queryKey: ['dashboard', 'modelVulnerabilities'],
    queryFn: dashboardApi.getModelVulnerabilities,
    staleTime: 5 * 60 * 1000,
  });
}

export function useDashboardRiskDistribution() {
  return useQuery({
    queryKey: ['dashboard', 'riskDistribution'],
    queryFn: dashboardApi.getRiskDistribution,
    staleTime: 5 * 60 * 1000,
  });
}

export function useDashboardRecentAttacks(limit: number = 5) {
  return useQuery({
    queryKey: ['dashboard', 'recentAttacks', limit],
    queryFn: () => dashboardApi.getRecentAttacks(limit),
    refetchInterval: 30000,
  });
}
