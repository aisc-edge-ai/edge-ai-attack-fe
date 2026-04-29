export type RiskLevel = 'vulnerable' | 'warning' | 'safe';

export interface AttackResult {
  id: string;                    // e.g., "LOG-20260212-001"
  date: string;                  // e.g., "2026-02-12 10:30"
  model: string;                 // e.g., "YOLOv5"
  modelType: string;             // e.g., "객체 탐지"
  attack: string;                // e.g., "Patch-Hiding"
  successRate: string;           // 백분율 문자열, e.g., "76.47%"
  beforeAccuracy: string;        // 백분율 문자열, e.g., "95.2%"
  afterAccuracy: string;         // 백분율 문자열, e.g., "22.4%"
  risk: RiskLevel;
  // Detection metrics (from clean_map_stats.txt / patch_map_stats.txt)
  beforeAP?: string;             // 소수점 문자열, e.g., "0.996"
  afterAP?: string;              // 소수점 문자열, e.g., "0.524"
  beforeAR?: string;             // 소수점 문자열, e.g., "0.997"
  afterAR?: string;              // 소수점 문자열, e.g., "0.561"
  attackSuccessRate?: string;    // 백분율 문자열, e.g., "100%"
  confThreshold?: number;        // e.g., 0.4
  averageCIoU?: number;          // e.g., 0.308
  dataset?: string;              // 테스트에 사용된 데이터셋명, e.g., "demo_hiding_test"
  rawResultsUrl?: string;
  resultsJsonUrl?: string;
  visualizationUrl?: string;
  detail?: {
    metrics: {
      clean: Record<string, number>;
      patched: Record<string, number>;
      noise_baseline: Record<string, number>;
    };
    visualEvidence: {
      patchImage?: string;
      confusionMatrix?: string;
      sampleImages: Array<{
        imageId: string;
        clean: string;
        patched: string;
      }>;
    };
  };
}

export interface ResultSummary {
  totalAttacks: number;
  avgVulnerability: number;
  mostVulnerableModel: { name: string; rate: string };
  mostLethalAttack: { name: string; rate: string };
}
