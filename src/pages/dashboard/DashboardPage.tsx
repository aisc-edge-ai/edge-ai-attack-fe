import {
  useDashboard,
  useDashboardDevices,
  useDashboardModelVulnerabilities,
  useDashboardRecentAttacks,
  useDashboardRiskDistribution,
  useDashboardTrend,
} from '@/hooks/useDashboard';
import { DashboardHeader } from './components/DashboardHeader';
import { DashboardKpiCards } from './components/DashboardKpiCards';
import { AttackTrendChart } from './components/AttackTrendChart';
import { EdgeDeviceStatusList } from './components/EdgeDeviceStatusList';
import { ModelVulnerabilityChart } from './components/ModelVulnerabilityChart';
import { RiskDistributionChart } from './components/RiskDistributionChart';
import { RecentAttacksTable } from './components/RecentAttacksTable';

export function DashboardPage() {
  const { data: summary, isLoading: isSummaryLoading } = useDashboard();
  const { data: trend, isLoading: isTrendLoading, isError: isTrendError } =
    useDashboardTrend(30);
  const { data: devices, isLoading: isDevicesLoading, isError: isDevicesError } =
    useDashboardDevices();
  const {
    data: modelVulnerabilities,
    isLoading: isModelVulLoading,
    isError: isModelVulError,
  } = useDashboardModelVulnerabilities();
  const { data: riskDistribution, isLoading: isRiskLoading, isError: isRiskError } =
    useDashboardRiskDistribution();
  const { data: recentAttacks, isLoading: isRecentLoading, isError: isRecentError } =
    useDashboardRecentAttacks(5);

  return (
    <div className="dashboard-page-layout">
      <DashboardHeader />

      <DashboardKpiCards summary={summary} isLoading={isSummaryLoading} />

      <div className="dashboard-grid-2-1">
        <section className="dashboard-section-card">
          <header className="dashboard-section-header">
            <span>Attack Success Rate (Vulnerability) — Last 30 Days</span>
          </header>
          <div className="dashboard-section-body">
            <AttackTrendChart data={trend} isLoading={isTrendLoading} isError={isTrendError} />
          </div>
        </section>

        <section className="dashboard-section-card">
          <header className="dashboard-section-header">
            <span>Edge Device Status</span>
          </header>
          <div className="dashboard-section-body tight">
            <EdgeDeviceStatusList
              devices={devices}
              isLoading={isDevicesLoading}
              isError={isDevicesError}
            />
          </div>
        </section>
      </div>

      <div className="dashboard-grid-1-1">
        <section className="dashboard-section-card">
          <header className="dashboard-section-header">
            <span>Top Vulnerable Models</span>
          </header>
          <div className="dashboard-section-body">
            <ModelVulnerabilityChart
              data={modelVulnerabilities}
              isLoading={isModelVulLoading}
              isError={isModelVulError}
            />
          </div>
        </section>

        <section className="dashboard-section-card">
          <header className="dashboard-section-header">
            <span>Risk Distribution</span>
          </header>
          <div className="dashboard-section-body">
            <RiskDistributionChart
              data={riskDistribution}
              isLoading={isRiskLoading}
              isError={isRiskError}
            />
          </div>
        </section>
      </div>

      <section className="dashboard-section-card">
        <header className="dashboard-section-header">
          <span>Recent Attack Simulation History</span>
        </header>
        <div className="dashboard-section-body tight">
          <RecentAttacksTable
            rows={recentAttacks}
            isLoading={isRecentLoading}
            isError={isRecentError}
          />
        </div>
      </section>
    </div>
  );
}
