import type {
  AttackCategory,
  Dataset,
  Model,
  AttackResult,
  DashboardSummary,
  DeviceStatus,
  RecentLog,
  DashboardTrendPoint,
  ModelVulnerabilityScore,
  RiskDistribution,
} from '@/types';

// ==========================================
// 모델 목록
// ==========================================
export const MOCK_MODELS: Model[] = [
  { id: 'MDL-001', name: 'YOLOv5', type: '객체 탐지', modelType: 'cctv', framework: 'PyTorch', node: 'CCTV Node 01', status: 'active', registeredAt: '2026-02-01' },
  { id: 'MDL-003', name: 'ResNet50', type: '이미지 분류', modelType: 'autonomous', framework: 'TensorFlow', node: 'Auto-Drive Vision', status: 'active', registeredAt: '2026-01-20' },
  { id: 'MDL-004', name: 'Whisper', type: '음성 인식', modelType: 'voice', framework: 'PyTorch', node: 'Voice Hub', status: 'offline', registeredAt: '2026-02-10' },
];

// ==========================================
// 공격 종류 (모델 타입별 필터링)
// ==========================================
export const MOCK_ATTACK_CATEGORIES: AttackCategory[] = [
  {
    id: 'cat-adversarial',
    name: '적대적 공격',
    children: [
      { id: 'atk-fgsm', name: 'FGSM', categoryId: 'cat-adversarial' },
      { id: 'atk-bim', name: 'BIM', categoryId: 'cat-adversarial' },
      { id: 'atk-pgd', name: 'PGD', categoryId: 'cat-adversarial' },
    ],
  },
  {
    id: 'cat-patch',
    name: '적대적 패치 공격',
    children: [
      { id: 'atk-hiding', name: 'Hiding', categoryId: 'cat-patch' },
      { id: 'atk-creating', name: 'Creating', categoryId: 'cat-patch' },
      { id: 'atk-altering', name: 'Altering', categoryId: 'cat-patch' },
    ],
  },
  {
    id: 'cat-voice',
    name: '음성 인식 인증 우회 공격 (딥보이스)',
    children: [
      { id: 'atk-deepvoice', name: '딥보이스 우회', categoryId: 'cat-voice' },
    ],
  },
];

// 모델 타입별 사용 가능한 공격 카테고리 매핑
export const MODEL_ATTACK_MAP: Record<string, string[]> = {
  cctv: ['cat-adversarial', 'cat-patch'],
  voice: ['cat-adversarial', 'cat-voice'],
  autonomous: ['cat-adversarial', 'cat-patch'],
};

// ==========================================
// 공격 데이터셋
// ==========================================
export const MOCK_DATASETS: Dataset[] = [
  { id: 'DS-001', name: 'Person-Hiding Patch v2', type: '적대적 패치 (이미지)', datasetType: 'image_patch', size: '1.2 MB', usage: 45, createdAt: '2026-02-11' },
  { id: 'DS-002', name: 'Stop-Sign Altering Patch', type: '적대적 패치 (이미지)', datasetType: 'image_patch', size: '840 KB', usage: 12, createdAt: '2026-02-08' },
  { id: 'DS-003', name: 'DeepVoice Bypass Audio', type: '적대적 노이즈 (오디오)', datasetType: 'audio_noise', size: '15.4 MB', usage: 8, createdAt: '2026-01-28' },
  { id: 'DS-004', name: 'Standard FGSM Noise', type: '노이즈 텐서', datasetType: 'noise_tensor', size: '4.5 MB', usage: 120, createdAt: '2026-01-15' },
];

// ==========================================
// 공격 결과 로그
// ==========================================
export const MOCK_RESULTS: AttackResult[] = [
  { id: 'LOG-20260212-001', date: '2026-02-12 10:30', model: 'YOLOv5', modelType: '객체 탐지', attack: 'Patch-Hiding', successRate: '76.47%', beforeAccuracy: '95.2%', afterAccuracy: '22.4%', risk: 'vulnerable', beforeAP: '0.996', afterAP: '0.524', beforeAR: '0.997', afterAR: '0.561', attackSuccessRate: '100%', confThreshold: 0.4, averageCIoU: 0.308, dataset: 'demo_hiding_test' },
  { id: 'LOG-20260211-003', date: '2026-02-11 16:20', model: 'ResNet50', modelType: '자율주행 (분류)', attack: 'PGD', successRate: '98.56%', beforeAccuracy: '99.8%', afterAccuracy: '1.2%', risk: 'vulnerable', beforeAP: '0.998', afterAP: '0.012', beforeAR: '0.999', afterAR: '0.015', attackSuccessRate: '98.56%', confThreshold: 0.4, averageCIoU: 0.005, dataset: 'demo_pgd_test' },
  { id: 'LOG-20260211-004', date: '2026-02-11 14:10', model: 'Whisper', modelType: '음성 인식', attack: '딥보이스 우회', successRate: '56.59%', beforeAccuracy: '96.5%', afterAccuracy: '42.0%', risk: 'warning', beforeAP: '0.965', afterAP: '0.420', beforeAR: '0.970', afterAR: '0.435', attackSuccessRate: '56.59%', confThreshold: 0.5, averageCIoU: 0.41, dataset: 'demo_deepvoice_test' },
];

// ==========================================
// 대시보드 데이터
// ==========================================
export const MOCK_DASHBOARD_SUMMARY: DashboardSummary = {
  totalModels: 12,
  totalAttacks: 3450,
  avgSuccessRate: 24.8,
  safetyVerified: 8,
  modelsDelta: 2,
  attacksDelta: 150,
  successRateDelta: -2.1,
  safetyVerifiedDelta: 1,
};

export const MOCK_DEVICE_STATUSES: DeviceStatus[] = [
  { name: 'CCTV Node 01', status: 'online', type: '객체 탐지 (YOLOv5)' },
  { name: 'CCTV Node 02', status: 'warning', type: '객체 탐지 (YOLOv5)' },
  { name: 'Voice Assistant Hub', status: 'offline', type: '음성 인식 (Whisper)' },
  { name: 'Auto-Drive Vision', status: 'online', type: '이미지 분류 (ResNet50)' },
  { name: 'Edge Inference Box', status: 'online', type: '이미지 분류 (MobileNet)' },
];

export const MOCK_RECENT_LOGS: RecentLog[] = [
  { status: 'running', model: 'Whisper (AI 비서)', attack: '음성 인식 인증 우회', successRate: '분석 중...', date: '현재 진행중', risk: 'none' },
  { status: 'completed', model: 'YOLOv5 (CCTV)', attack: '적대적 패치 (Hiding)', successRate: '76.4%', date: '2026-02-12 10:30', risk: 'high' },
  { status: 'completed', model: 'ResNet50 (자율주행)', attack: 'PGD', successRate: '98.5%', date: '2026-02-11 16:20', risk: 'high' },
  { status: 'completed', model: 'YOLOv5 (CCTV)', attack: '적대적 패치 (Altering)', successRate: '34.2%', date: '2026-02-11 11:08', risk: 'low' },
  { status: 'failed', model: 'MobileNet (Edge Box)', attack: 'FGSM 적대적 공격', successRate: '실패', date: '2026-02-10 09:14', risk: 'none' },
];

function generateTrendData(days: number): DashboardTrendPoint[] {
  const today = new Date();
  return Array.from({ length: days }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (days - 1 - i));
    const phase = i / 4;
    const base = 28 + Math.sin(phase) * 9 + Math.cos(phase * 0.6) * 5;
    const cctv = Math.max(5, Math.min(95, Math.round(base + 12 + Math.sin(i * 0.7) * 6)));
    const voice = Math.max(5, Math.min(95, Math.round(base * 0.55 + 8 + Math.cos(i * 0.5) * 5)));
    const autonomous = Math.max(5, Math.min(95, Math.round(base * 0.95 + 6 + Math.sin(i * 0.4) * 7)));
    const overall = Math.round((cctv + voice + autonomous) / 3);
    return {
      date: date.toISOString().slice(0, 10),
      cctv,
      voice,
      autonomous,
      overall,
    };
  });
}

export const MOCK_DASHBOARD_TREND: DashboardTrendPoint[] = generateTrendData(30);

export const MOCK_MODEL_VULNERABILITIES: ModelVulnerabilityScore[] = [
  { modelId: 'MDL-003', modelName: 'ResNet50', modelType: '이미지 분류 (자율주행)', avgSuccessRate: 92.3, attackCount: 84 },
  { modelId: 'MDL-001', modelName: 'YOLOv5', modelType: '객체 탐지 (CCTV)', avgSuccessRate: 78.5, attackCount: 152 },
  { modelId: 'MDL-005', modelName: 'MobileNet', modelType: '이미지 분류 (Edge)', avgSuccessRate: 64.1, attackCount: 58 },
  { modelId: 'MDL-004', modelName: 'Whisper', modelType: '음성 인식 (AI 비서)', avgSuccessRate: 56.6, attackCount: 71 },
  { modelId: 'MDL-002', modelName: 'EfficientDet', modelType: '객체 탐지 (CCTV)', avgSuccessRate: 41.8, attackCount: 33 },
  { modelId: 'MDL-006', modelName: 'Conformer', modelType: '음성 인식 (AI 비서)', avgSuccessRate: 22.4, attackCount: 24 },
];

export const MOCK_RISK_DISTRIBUTION: RiskDistribution = {
  vulnerable: 7,
  warning: 3,
  safe: 8,
};
