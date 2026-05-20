export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';
export const WS_BASE_URL =
  import.meta.env.VITE_WS_BASE_URL ||
  (typeof window !== 'undefined'
    ? `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}/ws`
    : '/ws');

export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  ATTACK: '/attack',
  RESULTS: '/results',
  RESULT_DETAIL: '/results/:id',
  PROJECTS: '/projects',
} as const;

export const ROUTE_TITLES: Record<string, string> = {
  '/dashboard': '기본 페이지 (대시보드)',
  '/attack': '모의 공격 페이지',
  '/results': '모의 공격 결과',
  '/projects': '프로젝트 관리',
};

// RISK_LABELS와 RISK_STYLES는 RiskBadge 컴포넌트 내부로 이동 (Blueprint Tag 활용)

// v1 백엔드가 실행 가능한 범위. autonomous 는 미구현. voice 는 DeepVoice 통합 완료.
export const SUPPORTED_MODEL_TYPES = ['cctv', 'voice', 'classification', 'imagenet'] as const;
export const SUPPORTED_ATTACK_TYPE_IDS = [
  'atk-hiding',
  'atk-altering',
  'atk-creating',
  'atk-mtc',
  'atk-rtvc',
  'atk-tortoise',
  'atk-yourtts',
  'atk-avc',
  'atk-fgsm',
  'atk-bim',
  'atk-contour-fgsm',
  'atk-contour-bim',
] as const;

export type SupportedModelType = (typeof SUPPORTED_MODEL_TYPES)[number];
export type SupportedAttackTypeId = (typeof SUPPORTED_ATTACK_TYPE_IDS)[number];

export const isModelTypeSupported = (modelType: string): boolean =>
  (SUPPORTED_MODEL_TYPES as readonly string[]).includes(modelType);

export const isAttackTypeSupported = (attackTypeId: string): boolean =>
  (SUPPORTED_ATTACK_TYPE_IDS as readonly string[]).includes(attackTypeId);

/**
 * CCTV(객체 탐지) 모델 id → CctvSceneGraphic 헤더 chip에 표시될 짧은 라벨.
 * 백엔드 model 목록에서 새 id 가 들어오면 여기에 매핑만 추가하면 그래픽에 즉시 반영된다.
 */
export const ATTACK_TYPE_LABELS: Record<string, string> = {
  'atk-hiding': 'Patch Hiding',
  'atk-altering': 'Patch Altering',
  'atk-creating': 'Patch Creating',
  'atk-mtc': 'MTC',
  'atk-rtvc': 'RTVC',
  'atk-tortoise': 'TorToise TTS',
  'atk-yourtts': 'YourTTS',
  'atk-avc': 'AVC',
  'atk-fgsm': 'FGSM',
  'atk-bim': 'BIM',
  'atk-contour-fgsm': 'Contour-FGSM',
  'atk-contour-bim': 'Contour-BIM',
};

export const MODEL_TYPE_LABELS: Record<string, string> = {
  cctv: 'CCTV (객체 탐지)',
  voice: 'Voice (음성 인식)',
  classification: 'Classification (분류)',
  imagenet: 'ImageNet (적대적 공격)',
};

export const CCTV_MODEL_LABELS: Record<string, string> = {
  yolov5l6: 'YOLOv5',
  yolov5: 'YOLOv5',
  yolov8: 'YOLOv8',
  'faster-rcnn': 'Faster R-CNN',
  ssd: 'SSD',
};
