import type { AttackGraphicProps } from './types';

/**
 * CCTV / 객체 탐지 모델 그래픽. attackId 별 시각 모티프 분기:
 *  - atk-hiding : 객체 박스가 사라지는 fade
 *  - atk-creating : 가짜 박스가 새로 생겨남
 *  - atk-altering : 박스가 변형 (rotate + scale)
 */
export function CctvGraphic({ state, attackId }: AttackGraphicProps) {
  const isHiding = attackId === 'atk-hiding';
  const isCreating = attackId === 'atk-creating';
  const isAltering = attackId === 'atk-altering';

  return (
    <svg
      className={`attack-graphic attack-graphic--cctv attack-graphic--${state}`}
      viewBox="0 0 600 400"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="CCTV 객체 탐지 모델"
    >
      <defs>
        <linearGradient id="cctv-frame" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1c2127" />
          <stop offset="100%" stopColor="#252a31" />
        </linearGradient>
        <linearGradient id="scan-line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(45,114,210,0)" />
          <stop offset="50%" stopColor="rgba(45,114,210,0.6)" />
          <stop offset="100%" stopColor="rgba(45,114,210,0)" />
        </linearGradient>
        <pattern id="cctv-noise" width="3" height="3" patternUnits="userSpaceOnUse">
          <rect width="3" height="3" fill="rgba(255,255,255,0.02)" />
          <rect width="1" height="1" fill="rgba(255,255,255,0.08)" />
        </pattern>
      </defs>

      {/* Camera body */}
      <rect x="20" y="20" width="560" height="360" rx="12" fill="url(#cctv-frame)" />
      <rect x="20" y="20" width="560" height="360" rx="12" fill="url(#cctv-noise)" />

      {/* Header strip */}
      <rect x="20" y="20" width="560" height="32" rx="12" fill="rgba(16,22,26,0.6)" />
      <circle cx="44" cy="36" r="5" fill="#cd4246" className="cctv-rec" />
      <text
        x="60"
        y="40"
        fontFamily="Consolas, Monaco, monospace"
        fontSize="11"
        letterSpacing="0.12em"
        fill="rgba(255,255,255,0.65)"
      >
        REC · CAM-01 · CCTV
      </text>
      <text
        x="560"
        y="40"
        textAnchor="end"
        fontFamily="Consolas, Monaco, monospace"
        fontSize="11"
        fill="rgba(255,255,255,0.5)"
      >
        YOLOv5
      </text>

      {/* Scene placeholder (person silhouette) */}
      <g transform="translate(180, 90)">
        <ellipse cx="120" cy="44" rx="30" ry="34" fill="rgba(255,255,255,0.18)" />
        <path
          d="M60 240 Q60 130 120 110 Q180 130 180 240 Z"
          fill="rgba(255,255,255,0.14)"
        />
        <ellipse cx="120" cy="260" rx="80" ry="14" fill="rgba(0,0,0,0.3)" />
      </g>

      {/* Detection bounding box — varies by attack */}
      {!isHiding && (
        <g className="cctv-box-real">
          <rect
            x="232"
            y="92"
            width="136"
            height="220"
            fill="none"
            stroke="#0f9960"
            strokeWidth="2.5"
            strokeDasharray={isAltering ? '6 4' : '0'}
            className={isAltering ? 'cctv-box-altering' : ''}
          />
          <rect x="232" y="76" width="78" height="18" fill="#0f9960" />
          <text
            x="240"
            y="89"
            fontFamily="Consolas, Monaco, monospace"
            fontSize="11"
            fontWeight="700"
            fill="#ffffff"
          >
            person 0.96
          </text>
        </g>
      )}

      {/* Hidden / hiding effect — semi-transparent overlay */}
      {isHiding && (
        <g className="cctv-hidden">
          <rect
            x="232"
            y="92"
            width="136"
            height="220"
            fill="none"
            stroke="#cd4246"
            strokeWidth="2.5"
            strokeDasharray="6 6"
            opacity="0.25"
          />
          <rect
            x="232"
            y="180"
            width="136"
            height="44"
            fill="rgba(205,66,70,0.85)"
          />
          <text
            x="300"
            y="208"
            textAnchor="middle"
            fontFamily="Consolas, Monaco, monospace"
            fontSize="13"
            fontWeight="700"
            fill="#ffffff"
            letterSpacing="0.08em"
          >
            HIDDEN
          </text>
        </g>
      )}

      {/* Fake creation — secondary phantom box */}
      {isCreating && (
        <g className="cctv-fake">
          <rect
            x="420"
            y="200"
            width="100"
            height="120"
            fill="none"
            stroke="#cd4246"
            strokeWidth="2.5"
          />
          <rect x="420" y="184" width="78" height="18" fill="#cd4246" />
          <text
            x="428"
            y="197"
            fontFamily="Consolas, Monaco, monospace"
            fontSize="11"
            fontWeight="700"
            fill="#ffffff"
          >
            ghost 0.89
          </text>
        </g>
      )}

      {/* Adversarial patch overlay (visible for all attacks) */}
      <g className="cctv-patch">
        <rect x="270" y="180" width="56" height="56" fill="rgba(205,66,70,0.15)" stroke="#cd4246" strokeWidth="1.5" />
        <path d="M270 180 L326 236 M326 180 L270 236" stroke="#cd4246" strokeWidth="1.2" opacity="0.6" />
        <text
          x="298"
          y="252"
          textAnchor="middle"
          fontFamily="Consolas, Monaco, monospace"
          fontSize="9"
          fill="#cd4246"
          letterSpacing="0.1em"
        >
          PATCH
        </text>
      </g>

      {/* Scan line — animated via CSS */}
      <rect x="20" y="60" width="560" height="2" fill="url(#scan-line-grad)" className="cctv-scan" />

      {/* Crosshair corners */}
      {[
        [40, 70],
        [556, 70],
        [40, 364],
        [556, 364],
      ].map(([x, y], idx) => (
        <g key={idx} stroke="#2d72d2" strokeWidth="1.5" fill="none">
          <path d={`M${x} ${y} L${x + (x < 300 ? 14 : -14)} ${y}`} />
          <path d={`M${x} ${y} L${x} ${y + (y < 200 ? 14 : -14)}`} />
        </g>
      ))}
    </svg>
  );
}
