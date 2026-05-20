import { Button, Intent } from '@blueprintjs/core';

interface ProjectHeaderProps {
  presetCount: number;
  onCreateClick: () => void;
}

export function ProjectHeader({ presetCount, onCreateClick }: ProjectHeaderProps) {
  return (
    <>
      <div className="projects-header">
        <div className="projects-header-text">
          <h2 className="projects-header-title">프로젝트 관리</h2>
          <p className="projects-header-desc">
            공격 시뮬레이션 프리셋을 관리하고 재사용하세요.
          </p>
        </div>
        <Button
          intent={Intent.PRIMARY}
          icon="plus"
          text="새 프리셋"
          onClick={onCreateClick}
        />
      </div>

      <section className="results-section-card">
        <header className="results-section-header">프로젝트 개요</header>
        <div className="prominent-card">
          <div className="prominent-item">
            <div className="prominent-label">총 프리셋 수</div>
            <div className="prominent-value">{presetCount}</div>
          </div>
          <div className="prominent-item">
            <div className="prominent-label">총 보고서 수</div>
            <div className="prominent-value">—</div>
          </div>
          <div className="prominent-item">
            <div className="prominent-label">최근 실행일</div>
            <div className="prominent-value text-value compact">—</div>
          </div>
          <div className="prominent-item">
            <div className="prominent-label">모델 유형</div>
            <div className="prominent-value text-value compact">—</div>
          </div>
        </div>
      </section>
    </>
  );
}
