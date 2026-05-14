import axios from 'axios';
import apiClient from './client';
import { API_BASE_URL } from '@/lib/constants';
import type { LoginRequest, LoginResponse } from '@/types';

export const authApi = {
  /**
   * 로그인 — `POST /auth/login`.
   * 응답의 `accessToken` 은 메모리 (authStore), `refreshToken` 은 localStorage 에 저장.
   */
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>(
      '/auth/login',
      credentials
    );
    return response.data;
  },

  /**
   * accessToken 재발급 — `POST /auth/refresh`.
   *
   * raw axios 사용 — apiClient 경유 시 401 인터셉터에서 무한 루프 발생 가능.
   */
  refresh: async (refreshToken: string): Promise<{ accessToken: string }> => {
    const response = await axios.post<{ accessToken: string }>(
      `${API_BASE_URL}/auth/refresh`,
      { refreshToken }
    );
    return response.data;
  },

  // logout: 백엔드 토큰 무효화 endpoint 미구현 — 클라이언트 단 logout (authStore.clearAuth) 만 수행.
  // 서버 측 토큰 블랙리스트가 필요하면 `POST /auth/logout` 추가하고 여기에 메서드 노출.
};
