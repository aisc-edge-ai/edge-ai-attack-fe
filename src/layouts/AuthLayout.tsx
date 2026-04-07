import { Outlet } from 'react-router-dom';

const ASCII_ART = `
░░░░░░░░░░░░░░░░░░░░░░░░░░░░
░░▒▒▒▒▒▒▒▒▒▒░░░░░░▒▒▒▒▒▒░░░
░▒▓▓▓▓▓▓▓▓▓▒░░░░▒▓▓▓▓▓▓▒░░░
░▒▓█████████▓▒▒▒▓████████▓▒░░
░▒▓█ EDGE AI ██████ SEC  █▓▒░
░▒▓██████████████████████▓▒░░
░▒▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▒░░
░░▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░░
░░░░░░░░░░░░░░░░░░░░░░░░░░░░
░░ ADVERSARIAL ATTACK SIM  ░░
░░ VULNERABILITY ANALYSIS  ░░
░░ SECURITY ASSESSMENT     ░░
░░░░░░░░░░░░░░░░░░░░░░░░░░░░
░▒▓▓▒░░▒▓▓▒░░▒▓▓▒░░▒▓▓▒░░░░
░▒██▒░░▒██▒░░▒██▒░░▒██▒░░░░
░▒▓▓▒░░▒▓▓▒░░▒▓▓▒░░▒▓▓▒░░░░
░░░░░░░░░░░░░░░░░░░░░░░░░░░░
░░ AI SAFETY RESEARCH CTR  ░░
░░ IITP EDGE AI PROJECT   ░░
░░░░░░░░░░░░░░░░░░░░░░░░░░░░
░░▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░░
░▒▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▒░░
░▒▓████████████████████████▒░
░░▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░░
░░░░░░░░░░░░░░░░░░░░░░░░░░░░
`.trim();

export function AuthLayout() {
  return (
    <div className="neo-auth-layout">
      {/* 좌측: 로그인 폼 */}
      <div className="neo-form-side">
        <div className="neo-form-wrapper">
          <Outlet />
        </div>
      </div>

      {/* 우측: ASCII 아트 배경 */}
      <div className="neo-art-side">
        <div className="neo-art-text">{ASCII_ART}</div>
      </div>
    </div>
  );
}
