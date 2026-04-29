import { useState, useEffect, useCallback, useRef } from 'react';
import { WS_BASE_URL } from '@/lib/constants';
import type { AttackProgress } from '@/types';

const MAX_RECONNECT_ATTEMPTS = 3;
const RECONNECT_INTERVAL_MS = 2000;

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
  const reconnectAttemptRef = useRef(0);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressStatusRef = useRef<AttackProgress['status'] | null>(null);
  const connectWebSocketRef = useRef<((id: string) => void) | null>(null);

  const cleanup = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (mockIntervalRef.current) {
      clearInterval(mockIntervalRef.current);
      mockIntervalRef.current = null;
    }
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
    reconnectAttemptRef.current = 0;
  }, []);

  const connectWebSocket = useCallback(
    (id: string) => {
      try {
        const ws = new WebSocket(`${WS_BASE_URL}/attack/${id}/progress`);
        wsRef.current = ws;

        ws.onopen = () => {
          setIsConnected(true);
          setError(null);
          reconnectAttemptRef.current = 0;
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data) as AttackProgress;
            progressStatusRef.current = data.status;
            setProgress(data);
          } catch {
            console.warn('[WebSocket] 메시지 파싱 실패:', event.data);
          }
        };

        ws.onerror = () => {
          setError('WebSocket 연결 오류');
          setIsConnected(false);
        };

        ws.onclose = (event) => {
          setIsConnected(false);
          wsRef.current = null;

          // 정상 종료(1000) 또는 완료 상태면 재연결하지 않음
          const isCompleted =
            progressStatusRef.current === 'completed' ||
            progressStatusRef.current === 'failed' ||
            progressStatusRef.current === 'cancelled';
          if (event.code === 1000 || isCompleted) return;

          // 재연결 시도
          if (reconnectAttemptRef.current < MAX_RECONNECT_ATTEMPTS) {
            reconnectAttemptRef.current += 1;
            console.warn(
              `[WebSocket] 재연결 시도 ${reconnectAttemptRef.current}/${MAX_RECONNECT_ATTEMPTS}`
            );
            reconnectTimerRef.current = setTimeout(() => {
              connectWebSocketRef.current?.(id);
            }, RECONNECT_INTERVAL_MS);
          } else {
            setError('WebSocket 연결이 끊어졌습니다. 새로고침 해주세요.');
          }
        };
      } catch {
        setError('WebSocket 연결 실패');
      }
    },
    []
  );

  useEffect(() => {
    connectWebSocketRef.current = connectWebSocket;
    return () => {
      if (connectWebSocketRef.current === connectWebSocket) {
        connectWebSocketRef.current = null;
      }
    };
  }, [connectWebSocket]);

  useEffect(() => {
    if (!attackId) {
      cleanup();
      progressStatusRef.current = null;
      return;
    }

    progressStatusRef.current = null;

    // DEV + MSW mock 모드에서만 WebSocket mock 사용
    if (import.meta.env.DEV && import.meta.env.VITE_MOCK_API === 'true') {
      queueMicrotask(() => {
        setIsConnected(true);
        setError(null);
      });
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

    // 프로덕션: 실제 WebSocket 연결 (재연결 지원)
    const connectTimer = setTimeout(() => {
      connectWebSocket(attackId);
    }, 0);

    return () => {
      clearTimeout(connectTimer);
      cleanup();
    };
  }, [attackId, cleanup, connectWebSocket]);

  return {
    progress: attackId ? progress : null,
    isConnected: attackId ? isConnected : false,
    error,
  };
}
