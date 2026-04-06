import { Badge } from '@/components/ui/badge';
import type { RiskLevel } from '@/types';

const RISK_CONFIG: Record<RiskLevel, { label: string; variant: 'destructive' | 'outline'; className?: string }> = {
  critical: { label: '치명적', variant: 'destructive' },
  high: { label: '위험(상)', variant: 'outline', className: 'border-orange-300 bg-orange-50 text-orange-700' },
  medium: { label: '위험(중)', variant: 'outline', className: 'border-amber-300 bg-amber-50 text-amber-700' },
  low: { label: '양호', variant: 'outline', className: 'border-emerald-300 bg-emerald-50 text-emerald-700' },
};

interface RiskBadgeProps {
  risk: RiskLevel;
}

export function RiskBadge({ risk }: RiskBadgeProps) {
  const config = RISK_CONFIG[risk];
  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
}
