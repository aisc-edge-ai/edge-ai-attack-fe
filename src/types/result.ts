export type RiskLevel = 'vulnerable' | 'warning' | 'safe';

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
  // Detection metrics (from clean_map_stats.txt / patch_map_stats.txt)
  beforeAP?: string;
  afterAP?: string;
  beforeAR?: string;
  afterAR?: string;
  attackSuccessRate?: string;
  confThreshold?: number;
  averageCIoU?: number;
  dataset?: string;     // 테스트에 사용된 데이터셋명 (e.g., "demo_hiding_test")
}

export interface ResultSummary {
  totalAttacks: number;
  avgVulnerability: number;
  mostVulnerableModel: { name: string; rate: string };
  mostLethalAttack: { name: string; rate: string };
}
