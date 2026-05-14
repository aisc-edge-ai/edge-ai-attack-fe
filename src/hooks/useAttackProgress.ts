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
  const reconnectAttemptRef = useRef(0);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressStatusRef = useRef<AttackProgress['status'] | null>(null);
  const connectWebSocketRef = useRef<((id: string) => void) | null>(null);

  const cleanup = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
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

    // 실제 WebSocket 연결 (재연결 지원). MSW 제거 이후 분기 단일화.
    const connectTimer = setTimeout(() => {
      connectWebSocket(attackId);
    }, 0);

    return () => {
      clearTimeout(connectTimer);
      cleanup();
    };
  }, [attackId, cleanup, connectWebSocket]);

  // attackId 전환 직후에는 직전 공격에서 보존된 local progress(특히 terminal
  // status)가 watcher에 잠시 노출돼 잘못된 토스트를 유발할 수 있으므로,
  // return 시점에서 attackId 매칭이 맞을 때만 progress를 노출한다.
  return {
    progress: attackId && progress?.attackId === attackId ? progress : null,
    isConnected: attackId ? isConnected : false,
    error,
  };
}
