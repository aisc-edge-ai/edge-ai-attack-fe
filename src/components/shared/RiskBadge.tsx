import { Tag, Intent } from '@blueprintjs/core';
import type { RiskLevel } from '@/types';

const RISK_CONFIG: Record<RiskLevel, { label: string; intent: Intent }> = {
  vulnerable: { label: '취약 (Vulnerable)', intent: Intent.DANGER },
  warning: { label: '경고 (Warning)', intent: Intent.WARNING },
  safe: { label: '안전 (Safe)', intent: Intent.SUCCESS },
};

interface RiskBadgeProps {
  risk: RiskLevel;
}

export function RiskBadge({ risk }: RiskBadgeProps) {
  const config = RISK_CONFIG[risk];
  return (
    <Tag intent={config.intent} minimal round>
      {config.label}
    </Tag>
  );
}
