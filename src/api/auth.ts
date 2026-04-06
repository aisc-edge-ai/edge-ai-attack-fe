import apiClient from './client';
import type { LoginRequest, LoginResponse } from '@/types';

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>(
      '/auth/login',
      credentials
    );
    return response.data;
  },

  refresh: async (refreshToken: string): Promise<{ accessToken: string }> => {
    const response = await apiClient.post<{ accessToken: string }>(
      '/auth/refresh',
      { refreshToken }
    );
    return response.data;
  },
};
