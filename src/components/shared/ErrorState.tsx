import { NonIdealState, Button, Icon } from '@blueprintjs/core';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = '데이터를 불러올 수 없습니다',
  description = '네트워크 연결을 확인하고 다시 시도해주세요.',
  onRetry,
}: ErrorStateProps) {
  return (
    <NonIdealState
      icon={<Icon icon="error" size={48} />}
      title={title}
      description={description}
      action={onRetry ? <Button icon="refresh" text="다시 시도" onClick={onRetry} /> : undefined}
    />
  );
}
