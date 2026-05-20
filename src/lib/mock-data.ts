import type {
  DashboardSummary,
  DeviceStatus,
  RecentLog,
  DashboardTrendPoint,
  ModelVulnerabilityScore,
  RiskDistribution,
} from '@/types';

// ============================================================================
// 대시보드 mock fallback — src/api/dashboard.ts 의 withMockFallback 이 사용.
// 백엔드 endpoint 미구현 시에만 폴백. 구현 완료되면 dashboard.ts 의 fallback 제거.
// ============================================================================

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

// ============================================================================
// 프리셋 mock — src/stores/presetStore.ts 초기 시드 + 다이얼로그 선택지
// ============================================================================

import type { Preset } from '@/types/preset';

export const MOCK_MODELS_FOR_PRESETS: Array<{ id: string; name: string; modelType: string }> = [
  { id: 'yolov5l6', name: 'YOLOv5-L6', modelType: 'cctv' },
  { id: 'yolov8', name: 'YOLOv8', modelType: 'cctv' },
  { id: 'faster-rcnn', name: 'Faster R-CNN', modelType: 'cctv' },
  { id: 'whisper-v1', name: 'Whisper', modelType: 'voice' },
  { id: 'conformer-v1', name: 'Conformer', modelType: 'voice' },
  { id: 'resnet50', name: 'ResNet50', modelType: 'classification' },
  { id: 'mobilenet', name: 'MobileNet', modelType: 'classification' },
  { id: 'efficientdet', name: 'EfficientDet', modelType: 'classification' },
];

export const MOCK_DATASETS_FOR_PRESETS: Array<{ id: string; name: string; category: string }> = [
  { id: 'ds-img-001', name: 'cctv_patch_v1.zip', category: 'image' },
  { id: 'ds-img-002', name: 'cctv_alter_v2.zip', category: 'image' },
  { id: 'ds-img-003', name: 'cctv_create_v1.zip', category: 'image' },
  { id: 'ds-audio-001', name: 'voice_samples_ko.zip', category: 'voice' },
  { id: 'ds-audio-002', name: 'voice_eval_en.zip', category: 'voice' },
  { id: 'ds-tensor-001', name: 'noise_tensor_v1.pt', category: 'tensor' },
];

export const MOCK_PRESETS: Preset[] = [
  {
    id: 'preset-001',
    name: 'CCTV Patch Hiding',
    description: 'YOLOv5 모델에 대한 Patch Hiding 공격 프리셋. 보안 카메라 탐지 우회 시나리오.',
    modelType: 'cctv',
    modelId: 'yolov5l6',
    modelName: 'YOLOv5-L6',
    attackTypeIds: ['atk-hiding'],
    dataSource: 'load',
    datasetIds: ['ds-img-001'],
    datasetNames: ['cctv_patch_v1.zip'],
    createdAt: '2026-04-10T09:00:00Z',
    updatedAt: '2026-05-01T14:30:00Z',
  },
  {
    id: 'preset-002',
    name: 'CCTV Patch Altering',
    description: 'YOLOv5 대상 Patch Altering 공격. 탐지 결과를 변조하는 시나리오.',
    modelType: 'cctv',
    modelId: 'yolov5l6',
    modelName: 'YOLOv5-L6',
    attackTypeIds: ['atk-altering'],
    dataSource: 'load',
    datasetIds: ['ds-img-002'],
    datasetNames: ['cctv_alter_v2.zip'],
    createdAt: '2026-04-12T11:00:00Z',
    updatedAt: '2026-04-28T09:15:00Z',
  },
  {
    id: 'preset-003',
    name: 'Voice DeepVoice 합성',
    description: 'RTVC 기반 음성 합성 공격. 화자 인증 우회 시나리오.',
    modelType: 'voice',
    modelId: 'whisper-v1',
    modelName: 'Whisper',
    attackTypeIds: ['atk-rtvc'],
    dataSource: 'load',
    datasetIds: ['ds-audio-001'],
    datasetNames: ['voice_samples_ko.zip'],
    createdAt: '2026-04-15T13:00:00Z',
    updatedAt: '2026-05-05T16:00:00Z',
  },
  {
    id: 'preset-004',
    name: 'Classification MTC',
    description: 'Model Type Classification 공격. 모델 구조 추론 시나리오.',
    modelType: 'classification',
    modelId: 'resnet50',
    modelName: 'ResNet50',
    attackTypeIds: ['atk-mtc'],
    dataSource: 'generate',
    datasetIds: [],
    datasetNames: [],
    createdAt: '2026-04-20T10:00:00Z',
    updatedAt: '2026-04-20T10:00:00Z',
  },
  {
    id: 'preset-005',
    name: 'CCTV 다중 공격 통합',
    description: 'Hiding + Altering + Creating 3종 동시 공격. 종합 취약성 평가용.',
    modelType: 'cctv',
    modelId: 'yolov5l6',
    modelName: 'YOLOv5-L6',
    attackTypeIds: ['atk-hiding', 'atk-altering', 'atk-creating'],
    dataSource: 'load',
    datasetIds: ['ds-img-001', 'ds-img-003'],
    datasetNames: ['cctv_patch_v1.zip', 'cctv_create_v1.zip'],
    createdAt: '2026-05-01T08:00:00Z',
    updatedAt: '2026-05-10T11:45:00Z',
  },
  {
    id: 'preset-006',
    name: 'AVC 음성 변환 공격',
    description: 'Adversarial Voice Conversion 공격. 음성 인식 시스템 강건성 검증.',
    modelType: 'voice',
    modelId: 'whisper-v1',
    modelName: 'Whisper',
    attackTypeIds: ['atk-avc'],
    dataSource: 'generate',
    datasetIds: [],
    datasetNames: [],
    createdAt: '2026-05-08T14:00:00Z',
    updatedAt: '2026-05-12T10:20:00Z',
  },
];
