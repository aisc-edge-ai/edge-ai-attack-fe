/** 백엔드 API 에러 응답 공통 형식. axios 에러의 `error.response.data` 와 매칭. */
export interface ApiError {
  /** 사용자에게 표시 가능한 에러 메시지 */
  message: string;
  /** 백엔드에서 정의한 에러 코드 (선택) — 향후 카테고리별 처리 시 활용 */
  code?: string;
}

/**
 * 페이지네이션 응답 표준 형식.
 *
 * 현재 사용처: `GET /results`.
 * 새 페이지네이션 endpoint 추가 시 이 타입을 그대로 사용.
 */
export interface PaginatedResponse<T> {
  /** 현재 페이지의 데이터 배열 */
  data: T[];
  /** 전체 항목 수 (페이지네이션 UI 가 마지막 페이지 계산용) */
  total: number;
}
