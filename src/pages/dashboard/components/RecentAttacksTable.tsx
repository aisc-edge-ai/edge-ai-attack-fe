import { Button, HTMLTable, Intent, Tag } from '@blueprintjs/core';
import { useNavigate } from 'react-router-dom';
import type { LogStatus, RecentLog } from '@/types';
import { DashboardSectionUnavailable } from './DashboardSectionUnavailable';

interface RecentAttacksTableProps {
  rows: RecentLog[] | undefined;
  isLoading: boolean;
  isError?: boolean;
}

const STATUS_LABEL: Record<LogStatus, string> = {
  completed: 'Verified',
  running: 'Analyzing',
  failed: 'Stopped / Failed',
};

const STATUS_INTENT: Record<LogStatus, Intent> = {
  completed: Intent.SUCCESS,
  running: Intent.PRIMARY,
  failed: Intent.DANGER,
};

export function RecentAttacksTable({ rows, isLoading, isError }: RecentAttacksTableProps) {
  const navigate = useNavigate();

  const renderBody = () => {
    if (isLoading) {
      return Array.from({ length: 4 }).map((_, i) => (
        <tr key={i}>
          {Array.from({ length: 5 }).map((_, j) => (
            <td key={j}>
              <div className="bp6-skeleton" style={{ height: 14, width: '80%' }} />
            </td>
          ))}
        </tr>
      ));
    }

    if (isError || !rows) {
      return (
        <tr>
          <td colSpan={5} style={{ padding: 0 }}>
            <DashboardSectionUnavailable height={120} />
          </td>
        </tr>
      );
    }

    if (rows.length === 0) {
      return (
        <tr>
          <td colSpan={5} className="recent-attacks-empty">
            최근 공격 기록이 없습니다.
          </td>
        </tr>
      );
    }

    return rows.map((row, i) => (
      <tr key={`${row.date}-${i}`}>
        <td>
          <Tag minimal round intent={STATUS_INTENT[row.status]}>
            {STATUS_LABEL[row.status]}
          </Tag>
        </td>
        <td>{row.model}</td>
        <td>{row.attack}</td>
        <td className="recent-attacks-rate">{row.successRate}</td>
        <td className="recent-attacks-date">{row.date}</td>
      </tr>
    ));
  };

  return (
    <div className="recent-attacks-wrapper">
      <HTMLTable striped className="recent-attacks-table">
        <thead>
          <tr>
            <th style={{ width: 140 }}>Status</th>
            <th>Target Model</th>
            <th>Attack Type</th>
            <th style={{ width: 120 }}>Success Rate</th>
            <th style={{ width: 180 }}>Date / Time</th>
          </tr>
        </thead>
        <tbody>{renderBody()}</tbody>
      </HTMLTable>
      <div className="recent-attacks-footer">
        <Button
          minimal
          rightIcon="arrow-right"
          text="View All"
          onClick={() => navigate('/results')}
        />
      </div>
    </div>
  );
}
