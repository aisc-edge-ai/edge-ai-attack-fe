import type { AttackGraphicProps } from './types';

/**
 * 음성 인식 모델 그래픽. 좌측 정상 화자, 우측 변조/합성 신호.
 * attackId 별 색상/주파수 모티프 분기.
 */
const ATTACK_PALETTE: Record<string, { stroke: string; accent: string; label: string }> = {
  'atk-rtvc': { stroke: '#d9822b', accent: '#cd4246', label: 'RTVC' },
  'atk-tortoise': { stroke: '#9179f2', accent: '#cd4246', label: 'Tortoise-TTS' },
  'atk-yourtts': { stroke: '#19a3b5', accent: '#cd4246', label: 'YourTTS' },
  'atk-avc': { stroke: '#cd4246', accent: '#cd4246', label: 'AVC' },
};

const buildWavePath = (
  yCenter: number,
  amplitude: number,
  frequency: number,
  phase: number,
): string => {
  const points: string[] = [];
  for (let x = 0; x <= 240; x += 4) {
    const y =
      yCenter +
      Math.sin((x / 240) * Math.PI * frequency + phase) * amplitude +
      Math.sin((x / 240) * Math.PI * frequency * 2.3 + phase * 1.5) * (amplitude * 0.35);
    points.push(`${x === 0 ? 'M' : 'L'}${x} ${y.toFixed(1)}`);
  }
  return points.join(' ');
};

export function VoiceGraphic({ state, attackId }: AttackGraphicProps) {
  const palette =
    (attackId ? ATTACK_PALETTE[attackId] : undefined) ?? ATTACK_PALETTE['atk-rtvc'];

  return (
    <svg
      className={`attack-graphic attack-graphic--voice attack-graphic--${state}`}
      viewBox="0 0 600 400"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="음성 인식 모델"
    >
      <defs>
        <linearGradient id="voice-bg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f5f8fa" />
          <stop offset="100%" stopColor="#ecf1f5" />
        </linearGradient>
      </defs>

      <rect width="600" height="400" fill="url(#voice-bg)" />

      {/* 좌측: 원본 화자 */}
      <g transform="translate(40, 60)">
        <text
          x="0"
          y="0"
          fontFamily="Consolas, Monaco, monospace"
          fontSize="11"
          letterSpacing="0.12em"
          fill="rgba(16,22,26,0.5)"
        >
          ORIGINAL SPEAKER
        </text>
        {/* mic icon */}
        <g transform="translate(0, 24)">
          <rect x="10" y="0" width="20" height="34" rx="10" fill="#5c7080" />
          <path d="M2 24 Q2 44 20 44 Q38 44 38 24" fill="none" stroke="#5c7080" strokeWidth="2.5" />
          <rect x="18" y="44" width="4" height="14" fill="#5c7080" />
          <rect x="6" y="58" width="28" height="3" rx="1.5" fill="#5c7080" />
        </g>
        {/* clean waveform */}
        <path
          d={buildWavePath(140, 28, 4, 0)}
          fill="none"
          stroke="#5c7080"
          strokeWidth="2"
          strokeLinecap="round"
          className="voice-wave-clean"
        />
        <path d="M0 140 L240 140" stroke="rgba(16,22,26,0.08)" strokeWidth="1" strokeDasharray="2 4" />
        <text
          x="120"
          y="200"
          textAnchor="middle"
          fontFamily="var(--font-sans)"
          fontSize="12"
          fill="rgba(16,22,26,0.55)"
        >
          embedding: spk_001
        </text>
      </g>

      {/* 우측: 공격 합성 신호 */}
      <g transform="translate(320, 60)">
        <text
          x="0"
          y="0"
          fontFamily="Consolas, Monaco, monospace"
          fontSize="11"
          letterSpacing="0.12em"
          fill={palette.accent}
        >
          SYNTHESIZED · {palette.label}
        </text>
        {/* synthetic signal — higher freq / amplitude */}
        <path
          d={buildWavePath(140, 42, 7, 0.8)}
          fill="none"
          stroke={palette.stroke}
          strokeWidth="2.2"
          strokeLinecap="round"
          className="voice-wave-attack"
        />
        {/* overlay shimmer */}
        <path
          d={buildWavePath(140, 18, 14, 1.3)}
          fill="none"
          stroke={palette.accent}
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.55"
          className="voice-wave-shimmer"
        />
        <path d="M0 140 L240 140" stroke="rgba(16,22,26,0.08)" strokeWidth="1" strokeDasharray="2 4" />
        <text
          x="120"
          y="200"
          textAnchor="middle"
          fontFamily="var(--font-sans)"
          fontSize="12"
          fill={palette.accent}
        >
          target embedding ≈ spk_001
        </text>
      </g>

      {/* Center transfer arrow */}
      <g transform="translate(294, 184)">
        <path d="M0 16 L12 16 M0 16 L4 12 M0 16 L4 20" stroke="#cd4246" strokeWidth="2" fill="none" />
        <text
          x="6"
          y="-2"
          textAnchor="middle"
          fontFamily="Consolas, Monaco, monospace"
          fontSize="10"
          fill="#cd4246"
          letterSpacing="0.1em"
        >
          CLONE
        </text>
      </g>

      {/* Bottom decision bar */}
      <g transform="translate(40, 320)">
        <rect x="0" y="0" width="520" height="44" rx="6" fill="rgba(16,22,26,0.04)" />
        <text
          x="20"
          y="28"
          fontFamily="Consolas, Monaco, monospace"
          fontSize="12"
          fontWeight="700"
          fill="rgba(16,22,26,0.65)"
        >
          Speaker verification
        </text>
        <rect x="260" y="12" width="240" height="20" rx="3" fill="#ffffff" stroke="rgba(16,22,26,0.12)" />
        <rect
          x="260"
          y="12"
          width="220"
          height="20"
          rx="3"
          fill={palette.accent}
          className="voice-decision-bar"
        />
        <text
          x="500"
          y="27"
          textAnchor="end"
          fontFamily="Consolas, Monaco, monospace"
          fontSize="11"
          fontWeight="700"
          fill="#ffffff"
        >
          ACCEPT (spoofed)
        </text>
      </g>
    </svg>
  );
}
