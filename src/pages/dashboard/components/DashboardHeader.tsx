import { Button, Intent } from '@blueprintjs/core';
import { useNavigate } from 'react-router-dom';

export function DashboardHeader() {
  const navigate = useNavigate();
  return (
    <div className="dashboard-header">
      <div className="dashboard-header-text">
        <h2 className="dashboard-header-title">Edge AI Adversarial Attack Dashboard</h2>
        <p className="dashboard-header-desc">
          시스템 전반의 모의공격 현황 및 AI 모델 취약성 요약
        </p>
      </div>
      <Button
        intent={Intent.PRIMARY}
        icon="play"
        text="Start New Attack"
        onClick={() => navigate('/attack')}
        large
      />
    </div>
  );
}
