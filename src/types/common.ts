/** 백엔드 API 에러 응답 공통 형식 */
export interface ApiError {
  message: string;
  code?: string;
}

/** 페이지네이션 응답 래퍼 (현재 /results에서 사용) */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
}
