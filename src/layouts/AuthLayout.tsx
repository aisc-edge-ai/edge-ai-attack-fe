import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="neo-auth-layout">
      {/* 좌측: 로그인 폼 */}
      <div className="neo-form-side">
        <div className="neo-form-wrapper">
          <Outlet />
        </div>
      </div>

      {/* 우측: 다크 배경 + 로고 + 정보 텍스트 */}
      <div className="neo-art-side">
        <img src="/logo-aisc.svg" alt="" className="neo-bg-logo" />
        <div className="neo-bg-info">
          <div className="neo-bg-info-item">
            <span>EXPLORE</span>
            <span>EDGE AI SECURITY</span>
            <span>PLATFORM</span>
          </div>
          <div className="neo-bg-info-item">
            <span>AI안전성연구센터</span>
            <span>IITP 엣지 AI 보안 과제</span>
          </div>
        </div>
      </div>
    </div>
  );
}
