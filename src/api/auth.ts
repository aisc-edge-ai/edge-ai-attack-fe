import axios from 'axios';
import apiClient from './client';
import { API_BASE_URL } from '@/lib/constants';
import type { LoginRequest, LoginResponse } from '@/types';

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>(
      '/auth/login',
      credentials
    );
    return response.data;
  },

  // raw axios 사용 — apiClient 경유 시 401 인터셉터에서 무한 루프 발생 가능
  refresh: async (refreshToken: string): Promise<{ accessToken: string }> => {
    const response = await axios.post<{ accessToken: string }>(
      `${API_BASE_URL}/auth/refresh`,
      { refreshToken }
    );
    return response.data;
  },

  // TODO: 백엔드에서 서버 토큰 무효화가 필요한 경우 구현
  // logout: async (refreshToken: string): Promise<void> => {
  //   await apiClient.post('/auth/logout', { refreshToken });
  // },
};
