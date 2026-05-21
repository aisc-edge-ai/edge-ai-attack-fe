import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';
import { Button, Card, Elevation, Icon, Intent } from '@blueprintjs/core';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[AppErrorBoundary]', error, info.componentStack);
  }

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: 32 }}>
        <Card elevation={Elevation.TWO} style={{ maxWidth: 480, textAlign: 'center', padding: 32 }}>
          <Icon icon="error" size={48} intent={Intent.DANGER} />
          <h3 className="bp6-heading" style={{ marginTop: 16 }}>
            예기치 않은 오류가 발생했습니다
          </h3>
          <p className="bp6-text-muted" style={{ marginBottom: 20 }}>
            페이지를 새로고침하면 대부분의 문제가 해결됩니다.
          </p>
          <Button intent={Intent.PRIMARY} icon="refresh" text="새로고침" onClick={this.handleReload} />
        </Card>
      </div>
    );
  }
}
