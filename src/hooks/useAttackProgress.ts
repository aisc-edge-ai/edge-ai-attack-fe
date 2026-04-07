import { useState, useEffect, useCallback, useRef } from 'react';
import { WS_BASE_URL } from '@/lib/constants';
import type { AttackProgress } from '@/types';

interface UseAttackProgressReturn {
  progress: AttackProgress | null;
  isConnected: boolean;
  error: string | null;
}

export function useAttackProgress(
  attackId: string | null
): UseAttackProgressReturn {
  const [progress, setProgress] = useState<AttackProgress | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const mockIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const cleanup = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (mockIntervalRef.current) {
      clearInterval(mockIntervalRef.current);
      mockIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!attackId) {
      cleanup();
      setProgress(null);
      setIsConnected(false);
      return;
    }

    // DEV 환경에서는 WebSocket mock 사용
    if (import.meta.env.DEV) {
      setIsConnected(true);
      setError(null);
      let current = 0;
      const total = 100;

      const steps = [
        '공격 환경 준비 중...',
        '적대적 데이터 생성 중...',
        '모의 공격 수행 중...',
        '결과 분석 중...',
      ];

      mockIntervalRef.current = setInterval(() => {
        const increment = Math.floor(Math.random() * 5) + 2;
        current = Math.min(current + increment, total);

        const stepIndex = Math.min(
          Math.floor((current / total) * steps.length),
          steps.length - 1
        );

        const status = current >= total ? 'completed' : 'running';
        const eta =
          current > 0 ? Math.ceil(((total - current) / current) * 10) : 0;

        setProgress({
          attackId,
          status,
          progress: current,
          total,
          currentStep: `${steps[stepIndex]} (${current}/${total})`,
          eta,
        });

        if (current >= total) {
          if (mockIntervalRef.current) {
            clearInterval(mockIntervalRef.current);
            mockIntervalRef.current = null;
          }
        }
      }, 400);

      return cleanup;
    }

    // 프로덕션: 실제 WebSocket 연결
    try {
      const ws = new WebSocket(
        `${WS_BASE_URL}/attack/${attackId}/progress`
      );
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        setError(null);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as AttackProgress;
          setProgress(data);
        } catch {
          console.error('Failed to parse WebSocket message');
        }
      };

      ws.onerror = () => {
        setError('WebSocket 연결 오류');
        setIsConnected(false);
      };

      ws.onclose = () => {
        setIsConnected(false);
      };
    } catch {
      setError('WebSocket 연결 실패');
    }

    return cleanup;
  }, [attackId, cleanup]);

  return { progress, isConnected, error };
}
