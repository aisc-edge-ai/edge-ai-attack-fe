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
  /**
   * Model Type Inference (MTC) 전용 — 3가지 방법의 best validation accuracy (0~100 정수).
   * Baseline = softmax probability only, Blackbox = +feature1, Graybox = +feature1+feature2.
   * 출처: `results_raw/comparison/summary_comparison.csv`
   */
  inferenceAccuracy?: {
    baseline: number;
    blackbox: number;
    graybox: number;
  };
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
      /** 음성 결과의 시각적 증거 — 원본/타겟/공격 음성 샘플. src 미지정 시 placeholder */
      audioSamples?: Array<{
        label: string;
        src?: string;
      }>;
      /** MTC 전용 — 4모델 × 3방법 confusion matrix 합본 이미지 URL */
      confusionMatrixCombined?: string;
      /** MTC 전용 — 방법별 ROC curve 비교 이미지 URL */
      rocCurveComparison?: string;
      /** MTC 전용 — 방법별 validation accuracy 학습곡선 이미지 URL */
      valAccuracyComparison?: string;
    };
  };
}

export interface ResultSummary {
  totalAttacks: number;
  avgVulnerability: number;
  mostVulnerableModel: { name: string; rate: string };
  mostLethalAttack: { name: string; rate: string };
}
