import { Icon } from '@blueprintjs/core';

interface DashboardSectionUnavailableProps {
  height?: number;
  message?: string;
}

export function DashboardSectionUnavailable({
  height = 240,
  message = '데이터를 불러올 수 없습니다',
}: DashboardSectionUnavailableProps) {
  return (
    <div className="dashboard-section-unavailable" style={{ minHeight: height }}>
      <Icon icon="cloud-download" size={20} />
      <span>{message}</span>
    </div>
  );
}
