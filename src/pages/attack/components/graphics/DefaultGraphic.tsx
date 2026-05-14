import type { AttackGraphicProps } from './types';

/**
 * 모델 선택 전 placeholder. 회로기판 풍 그리드 + 중앙 펄스.
 */
export function DefaultGraphic({ state }: AttackGraphicProps) {
  return (
    <svg
      className={`attack-graphic attack-graphic--default attack-graphic--${state}`}
      viewBox="0 0 600 400"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="공격 대상 모델을 선택하세요"
    >
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" fill="none" stroke="rgba(45,114,210,0.08)" strokeWidth="1" />
        </pattern>
        <radialGradient id="default-pulse" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(45,114,210,0.32)" />
          <stop offset="60%" stopColor="rgba(45,114,210,0.06)" />
          <stop offset="100%" stopColor="rgba(45,114,210,0)" />
        </radialGradient>
      </defs>
      <rect width="600" height="400" fill="url(#grid)" />
      <circle cx="300" cy="200" r="180" fill="url(#default-pulse)" className="default-pulse" />
      <circle cx="300" cy="200" r="36" fill="#ffffff" stroke="#2d72d2" strokeWidth="2" />
      <path
        d="M286 200 L300 214 L320 188"
        stroke="#2d72d2"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text
        x="300"
        y="280"
        textAnchor="middle"
        fontFamily="var(--font-sans)"
        fontSize="13"
        fontWeight="600"
        letterSpacing="0.08em"
        fill="rgba(16,22,26,0.55)"
      >
        SELECT TARGET MODEL
      </text>
    </svg>
  );
}
