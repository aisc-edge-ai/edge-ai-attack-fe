import { cn } from '@/lib/utils';

interface StatusDotProps {
  status: 'online' | 'offline' | 'warning';
  className?: string;
}

const statusLabels = {
  online: '정상 작동',
  offline: '연결 끊김',
  warning: '취약점 경고',
};

export function StatusDot({ status, className }: StatusDotProps) {
  return (
    <span
      className={cn('status-dot', status, className)}
      role="status"
      aria-label={statusLabels[status]}
    />
  );
}
