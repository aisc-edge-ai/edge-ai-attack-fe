import type { ModelType } from './model';

/**
 * 공격 기법 트리 구조 — `GET /attack?modelType=` 응답.
 * 모델 유형 (cctv/voice 등) 별로 카테고리 + 자식 공격을 묶어서 응답.
 */
export interface AttackCategory {
  id: string;
  name: string;
  children: AttackType[];
}

/** 개별 공격 기법. `enabled=false` 면 UI 에서 선택 비활성화. */
export interface AttackType {
  id: string;
  name: string;
  categoryId: string;
  enabled?: boolean;
}

/**
 * 공격 실행 요청 body — `POST /attack/execute`.
 *
 * `dataSource` 가 'load' 면 `datasetIds` 는 1개 이상 필수,
 * 'generate' 면 빈 배열 (백엔드가 새로 생성).
 */
export interface AttackExecuteRequest {
  modelType: ModelType;
  /** 1개 이상 — 다중 공격 동시 실행 지원 */
  attackTypeIds: string[];
  /** 'generate' = 백엔드가 데이터 생성, 'load' = 기존 데이터셋 사용 */
  dataSource: 'generate' | 'load';
  /** dataSource='load' 면 1개 이상. 'generate' 면 빈 배열 또는 생략. */
  datasetIds: string[];
}

/**
 * WebSocket `WS /ws/attack/{attackId}/progress` 메시지.
 *
 * 라이프사이클: preparing → running (progress 0~100) → saving → completed/failed/cancelled
 */
export interface AttackProgress {
  attackId: string;
  status: 'preparing' | 'running' | 'saving' | 'completed' | 'failed' | 'cancelled';
  /** 0~100 정수 */
  progress: number;
  /** 전체 step 수 */
  total: number;
  /** 현재 단계 사람이 읽을 라벨, 예: "이미지 32/100 처리 중" */
  currentStep: string;
  /** 예상 남은 초 — 알 수 없을 시 생략 */
  eta?: number;
}
