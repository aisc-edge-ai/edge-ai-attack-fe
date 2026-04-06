import type {
  AttackCategory,
  Dataset,
  Model,
  AttackResult,
  DashboardSummary,
  DeviceStatus,
  RecentLog,
} from '@/types';

// ==========================================
// 모델 목록
// ==========================================
export const MOCK_MODELS: Model[] = [
  { id: 'MDL-001', name: 'YOLOv8', type: '객체 탐지', modelType: 'cctv', framework: 'PyTorch', node: 'CCTV Node 01', status: 'active', registeredAt: '2026-02-01' },
  { id: 'MDL-002', name: 'DETR', type: '객체 탐지', modelType: 'cctv', framework: 'ONNX', node: 'CCTV Node 02', status: 'testing', registeredAt: '2026-02-05' },
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
  { id: 'LOG-20260212-001', date: '2026-02-12 10:30', model: 'YOLOv8', modelType: '객체 탐지', attack: 'Patch-Hiding', successRate: '76.47%', beforeAccuracy: '95.2%', afterAccuracy: '22.4%', risk: 'high' },
  { id: 'LOG-20260212-002', date: '2026-02-12 09:15', model: 'DETR', modelType: '객체 탐지', attack: 'FGSM', successRate: '12.50%', beforeAccuracy: '92.1%', afterAccuracy: '80.5%', risk: 'low' },
  { id: 'LOG-20260211-003', date: '2026-02-11 16:20', model: 'ResNet50', modelType: '자율주행 (분류)', attack: 'PGD', successRate: '98.56%', beforeAccuracy: '99.8%', afterAccuracy: '1.2%', risk: 'critical' },
  { id: 'LOG-20260211-004', date: '2026-02-11 14:10', model: 'Whisper', modelType: '음성 인식', attack: '딥보이스 우회', successRate: '56.59%', beforeAccuracy: '96.5%', afterAccuracy: '42.0%', risk: 'medium' },
];

// ==========================================
// 대시보드 데이터
// ==========================================
export const MOCK_DASHBOARD_SUMMARY: DashboardSummary = {
  totalModels: 12,
  totalAttacks: 3450,
  avgSuccessRate: 24.8,
  safetyVerified: 8,
};

export const MOCK_DEVICE_STATUSES: DeviceStatus[] = [
  { name: 'CCTV Node 01', status: 'online', type: '객체 탐지 (YOLOv8)' },
  { name: 'CCTV Node 02', status: 'warning', type: '객체 탐지 (DETR)' },
  { name: 'Voice Assistant Hub', status: 'offline', type: '음성 인식 (Whisper)' },
  { name: 'Auto-Drive Vision', status: 'online', type: '이미지 분류 (ResNet)' },
];

export const MOCK_RECENT_LOGS: RecentLog[] = [
  { status: 'running', model: 'Whisper (AI 비서)', attack: '음성 인식 인증 우회', successRate: '분석 중...', date: '현재 진행중', risk: 'none' },
  { status: 'completed', model: 'YOLOv8 (CCTV)', attack: '적대적 패치 (Hiding)', successRate: '76.4%', date: '2026-02-12 10:30', risk: 'high' },
  { status: 'completed', model: 'ResNet50 (자율주행)', attack: 'FGSM 적대적 공격', successRate: '12.1%', date: '2026-02-11 15:45', risk: 'low' },
  { status: 'failed', model: 'DETR (CCTV)', attack: 'PGD 적대적 공격', successRate: '-', date: '2026-02-11 09:20', risk: 'none' },
];
