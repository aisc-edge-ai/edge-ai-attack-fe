export type RiskLevel = 'critical' | 'high' | 'medium' | 'low';

export interface AttackResult {
  id: string;
  date: string;
  model: string;
  modelType: string;
  attack: string;
  successRate: string;
  beforeAccuracy: string;
  afterAccuracy: string;
  risk: RiskLevel;
}

export interface ResultSummary {
  totalAttacks: number;
  avgVulnerability: number;
  mostVulnerableModel: { name: string; rate: string };
  mostLethalAttack: { name: string; rate: string };
}
