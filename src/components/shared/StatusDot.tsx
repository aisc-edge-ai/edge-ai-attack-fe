import { cn } from '@/lib/utils';

interface StatusDotProps {
  status: 'online' | 'offline' | 'warning';
  className?: string;
}

const statusColors = {
  online: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]',
  offline: 'bg-muted-foreground',
  warning: 'bg-destructive animate-pulse',
};

export function StatusDot({ status, className }: StatusDotProps) {
  return (
    <div className={cn('w-2.5 h-2.5 rounded-full', statusColors[status], className)} />
  );
}
