import type {
  Dataset,
  AttackResult,
  Model,
  AttackCategory,
  ModelType,
} from '@/types';
import {
  MOCK_VOICE_MODELS,
  MOCK_VOICE_CATEGORY,
  MOCK_VOICE_DATASETS,
  MOCK_VOICE_RESULTS_LIST,
} from './mock-data';

/**
 * Mock provider registry — 백엔드 미연결 모델/공격 흐름을 frontend mock 으로 서빙하는 통합 정의.
 *
 * 확장 방법:
 *   1) mock-data.ts 에 새 mock 데이터 set 추가 (models / category / datasets / results)
 *   2) 아래 MOCK_PROVIDERS 배열에 entry 1개 push
 *   3) 끝 — 모든 분기 helper 가 자동으로 새 provider 처리
 *
 * 백엔드 전환 방법:
 *   - 해당 provider entry 를 제거하거나 attackIds 를 빈 배열로 두면 자동으로 axios → backend 직행
 */
export interface MockProvider {
  /** registry 식별자 (디버깅/로그/queryKey 용) */
  id: string;
  /** UI 노출용 라벨 (필요 시) */
  label: string;
  /** 매칭 조건: 사용자가 이 modelType 을 선택했을 때만 */
  modelType: ModelType;
  /** 매칭 조건: 선택된 attackIds 중 하나라도 이 목록에 있어야 */
  attackIds: string[];
  /** 백엔드 /models 응답에 append 할 mock 모델 (modelType 기준 1회) */
  models: Model[];
  /** /attack?modelType=X 응답으로 사용될 카테고리 */
  category: AttackCategory;
  /** Step 3 데이터셋 후보 — useVisualizationDatasets 가 사용 */
  datasets: Dataset[];
  /** /results 목록 append + /results/:id 매칭에 사용 */
  results: AttackResult[];
}

export const MOCK_PROVIDERS: MockProvider[] = [
  {
    id: 'deepvoice',
    label: '딥보이스 (음성 인증 우회)',
    modelType: 'voice',
    attackIds: ['atk-rtvc', 'atk-tortoise', 'atk-yourtts', 'atk-avc'],
    models: MOCK_VOICE_MODELS,
    category: MOCK_VOICE_CATEGORY,
    datasets: MOCK_VOICE_DATASETS,
    results: MOCK_VOICE_RESULTS_LIST,
  },
  // 미래 추가 예시:
  // {
  //   id: 'lidar',
  //   label: 'LiDAR 스푸핑',
  //   modelType: 'autonomous',
  //   attackIds: ['atk-lidar-spoof'],
  //   models: MOCK_LIDAR_MODELS,
  //   category: MOCK_LIDAR_CATEGORY,
  //   datasets: MOCK_LIDAR_DATASETS,
  //   results: MOCK_LIDAR_RESULTS,
  // },
];

/**
 * Step 3 데이터셋 분기용 — modelType + attackIds 조합으로 매칭.
 * 선택된 attackIds 중 하나라도 provider 의 attackIds 에 포함되면 hit.
 */
export function findDatasetMockProvider(
  modelType: ModelType | null | undefined,
  attackIds: string[],
): MockProvider | null {
  if (!modelType || attackIds.length === 0) return null;
  return (
    MOCK_PROVIDERS.find(
      (p) =>
        p.modelType === modelType &&
        attackIds.some((id) => p.attackIds.includes(id)),
    ) ?? null
  );
}

/** modelType 만으로 매칭 — /models, /attack?modelType=X 응답 시 사용 가능 */
export function findProviderByModelType(modelType: string): MockProvider | null {
  return MOCK_PROVIDERS.find((p) => p.modelType === modelType) ?? null;
}

/** 모든 mock 모델 (백엔드 /models 응답에 append 용) */
export function getAllMockModels(): Model[] {
  return MOCK_PROVIDERS.flatMap((p) => p.models);
}

/** 모든 mock 결과 (목록 append + id 검색 용) */
export function getAllMockResults(): AttackResult[] {
  return MOCK_PROVIDERS.flatMap((p) => p.results);
}

/**
 * 백엔드 응답에 mock 항목을 안전하게 병합.
 * - Array 응답: `[...backend, ...mocks]`
 * - Paginated 응답 (`{ data, total }`): `data` 에 mock 추가, `total` 증가
 */
export function mergeWithMocks<T extends { id: string }>(
  backend: T[] | { data: T[]; total: number },
  mocks: T[],
): T[] | { data: T[]; total: number } {
  if (Array.isArray(backend)) {
    return [...backend, ...mocks];
  }
  return {
    ...backend,
    data: [...(backend.data ?? []), ...mocks],
    total: (backend.total ?? 0) + mocks.length,
  };
}
