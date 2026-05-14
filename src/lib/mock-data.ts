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

// ============================================================================
// 딥보이스 mock — mock-providers.ts 의 registry 에서 사용.
// 백엔드 미연결 영역만 mock 으로 표시. 미래 신규 모델 추가는 mock-providers.ts
// 에 entry 만 추가하면 됨.
// ============================================================================

export const MOCK_VOICE_MODELS: Model[] = [
  {
    id: 'MDL-007',
    name: 'Resemblyzer',
    type: '음성 인식 (화자 인증)',
    modelType: 'voice',
    framework: 'PyTorch',
    node: 'Voice Hub',
    status: 'active',
    registeredAt: '2026-04-17',
  },
  {
    id: 'MDL-008',
    name: 'ECAPA-TDNN',
    type: '음성 인식 (화자 인증)',
    modelType: 'voice',
    framework: 'PyTorch',
    node: 'Voice Hub',
    status: 'active',
    registeredAt: '2026-04-17',
  },
];

export const MOCK_VOICE_CATEGORY: AttackCategory = {
  id: 'cat-voice',
  name: '음성 인식 인증 우회 공격 (딥보이스)',
  children: [
    { id: 'atk-rtvc', name: 'RTVC (Real-Time Voice Cloning)', categoryId: 'cat-voice' },
    { id: 'atk-tortoise', name: 'Tortoise-TTS', categoryId: 'cat-voice' },
    { id: 'atk-yourtts', name: 'YourTTS', categoryId: 'cat-voice' },
    { id: 'atk-avc', name: 'AVC (Adversarial Voice Cloning)', categoryId: 'cat-voice' },
  ],
};

export const MOCK_VOICE_DATASETS: Dataset[] = [
  { id: 'DS-V01', name: 'VCTK', type: '음성 코퍼스 (다화자)', datasetType: 'audio_noise', size: '11.2 GB', usage: 24, createdAt: '2026-04-17', category: 'voice' },
  { id: 'DS-V02', name: 'MCV (Mozilla Common Voice)', type: '음성 코퍼스 (크라우드)', datasetType: 'audio_noise', size: '76.4 GB', usage: 18, createdAt: '2026-04-17', category: 'voice' },
  { id: 'DS-V03', name: 'LibriSpeech_Selected', type: '음성 코퍼스 (오디오북)', datasetType: 'audio_noise', size: '6.8 GB', usage: 32, createdAt: '2026-04-17', category: 'voice' },
  { id: 'DS-V04', name: 'CSNED', type: '한국어 음성 데이터셋', datasetType: 'audio_noise', size: '4.5 GB', usage: 11, createdAt: '2026-04-17', category: 'voice' },
  { id: 'DS-V05', name: 'CSUKIED', type: '한영 다국어 음성', datasetType: 'audio_noise', size: '5.1 GB', usage: 7, createdAt: '2026-04-17', category: 'voice' },
  { id: 'DS-V06', name: 'FST', type: '합성 음성 평가셋', datasetType: 'audio_noise', size: '2.3 GB', usage: 15, createdAt: '2026-04-17', category: 'voice' },
];

export const MOCK_VOICE_RESULTS_LIST: AttackResult[] = [
  {
    id: 'LOG-20260417-010',
    date: '2026-04-17 11:05',
    model: 'Resemblyzer',
    modelType: '음성 인식 (화자 인증)',
    attack: 'RTVC',
    successRate: '64.20%',
    beforeAccuracy: '94.1%',
    afterAccuracy: '29.9%',
    risk: 'vulnerable',
    beforeAP: '0.941',
    afterAP: '0.299',
    beforeAR: '0.945',
    afterAR: '0.310',
    attackSuccessRate: '64.20%',
    confThreshold: 0.5,
    dataset: 'VCTK + LibriSpeech_Selected',
    detail: {
      metrics: {
        clean: { EER: 0.041, accuracy: 0.941 },
        patched: { EER: 0.331, accuracy: 0.299 },
        noise_baseline: { EER: 0.052, accuracy: 0.928 },
      },
      visualEvidence: {
        sampleImages: [],
        audioSamples: [
          { label: '원본 음성 (정상 화자)' },
          { label: '타겟 화자 샘플' },
          { label: '공격 음성 (RTVC 합성)' },
        ],
      },
    },
  },
  {
    id: 'LOG-20260417-011',
    date: '2026-04-17 13:42',
    model: 'ECAPA-TDNN',
    modelType: '음성 인식 (화자 인증)',
    attack: 'YourTTS',
    successRate: '48.85%',
    beforeAccuracy: '97.6%',
    afterAccuracy: '49.9%',
    risk: 'warning',
    beforeAP: '0.976',
    afterAP: '0.499',
    beforeAR: '0.978',
    afterAR: '0.512',
    attackSuccessRate: '48.85%',
    confThreshold: 0.5,
    dataset: 'MCV + CSNED',
    detail: {
      metrics: {
        clean: { EER: 0.024, accuracy: 0.976 },
        patched: { EER: 0.249, accuracy: 0.499 },
        noise_baseline: { EER: 0.030, accuracy: 0.965 },
      },
      visualEvidence: {
        sampleImages: [],
        audioSamples: [
          { label: '원본 음성 (정상 화자)' },
          { label: '타겟 화자 샘플' },
          { label: '공격 음성 (YourTTS 합성)' },
        ],
      },
    },
  },
];

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
