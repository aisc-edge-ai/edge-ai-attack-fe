import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="login-page bp6-dark">
      {/* 좌측: 로그인 폼 영역 */}
      <div className="login-left">
        <div className="login-left-header">
          <img src="/edge_logo.png" alt="Edge AI" className="login-brand-logo" />
        </div>
        <div className="login-left-center">
          <Outlet />
        </div>
      </div>

      {/* 우측: 이미지 패널 */}
      <div className="login-right">
        <img src="/login-bg.png" alt="" className="login-right-image" />
        <div className="login-right-title">
          <span className="login-right-title-sub">Soongsil</span>
          <span className="login-right-title-main">AI Safety Center</span>
        </div>
      </div>
    </div>
  );
}
