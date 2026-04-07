import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { authApi } from '@/api/auth';
import type { LoginRequest } from '@/types';

export function useAuth() {
  const navigate = useNavigate();
  const { user, isAuthenticated, setAuth, clearAuth } = useAuthStore();

  const login = useCallback(
    async (credentials: LoginRequest) => {
      const response = await authApi.login(credentials);
      setAuth(response.user, response.accessToken, response.refreshToken);
      navigate('/dashboard');
    },
    [setAuth, navigate]
  );

  const logout = useCallback(() => {
    clearAuth();
    navigate('/login');
  }, [clearAuth, navigate]);

  return { user, isAuthenticated, login, logout };
}
