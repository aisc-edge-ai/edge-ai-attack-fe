import type { AttackGraphicProps } from './types';

/**
 * 이미지 분류 모델 (CNN/ResNet/VGG/AlexNet) + MTC (Model Type Classification) 그래픽.
 * CNN 레이어 스택 → softmax 확률 분포 → 공격자가 분포 패턴으로 모델 타입 추론.
 */
export function ClassificationGraphic({ state }: AttackGraphicProps) {
  // 4개 후보 모델별 softmax 분포 예시
  const distributions = [
    { name: 'CNN', value: 0.18, color: '#a7b6c2' },
    { name: 'ResNet', value: 0.62, color: '#cd4246' },
    { name: 'VGG', value: 0.14, color: '#a7b6c2' },
    { name: 'AlexNet', value: 0.06, color: '#a7b6c2' },
  ];

  return (
    <svg
      className={`attack-graphic attack-graphic--mtc attack-graphic--${state}`}
      viewBox="0 0 600 400"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="이미지 분류 모델 추론 공격"
    >
      <defs>
        <linearGradient id="mtc-bg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f8fafd" />
          <stop offset="100%" stopColor="#eef2f6" />
        </linearGradient>
        <linearGradient id="mtc-layer" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2d72d2" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#2d72d2" stopOpacity="0.3" />
        </linearGradient>
      </defs>

      <rect width="600" height="400" fill="url(#mtc-bg)" />

      {/* Input image — CIFAR-10 thumbnail (pixel grid) */}
      <g transform="translate(36, 130)">
        <text
          x="0"
          y="-12"
          fontFamily="Consolas, Monaco, monospace"
          fontSize="11"
          letterSpacing="0.12em"
          fill="rgba(16,22,26,0.5)"
        >
          INPUT · CIFAR-10
        </text>
        <rect width="96" height="96" rx="4" fill="#ffffff" stroke="rgba(16,22,26,0.15)" />
        {/* 8x8 pixel mosaic */}
        {Array.from({ length: 64 }).map((_, i) => {
          const x = (i % 8) * 12;
          const y = Math.floor(i / 8) * 12;
          const opacity = 0.15 + ((i * 37) % 60) / 100;
          return <rect key={i} x={x} y={y} width="12" height="12" fill="#2d72d2" opacity={opacity} />;
        })}
      </g>

      {/* CNN layer stack — 4 layers narrowing */}
      <g transform="translate(170, 100)">
        <text
          x="0"
          y="-12"
          fontFamily="Consolas, Monaco, monospace"
          fontSize="11"
          letterSpacing="0.12em"
          fill="rgba(16,22,26,0.5)"
        >
          LAYERS
        </text>
        {[
          { x: 0, height: 160, label: 'conv1' },
          { x: 44, height: 132, label: 'conv2' },
          { x: 88, height: 102, label: 'fc1' },
          { x: 132, height: 76, label: 'fc2' },
        ].map((layer, idx) => (
          <g key={layer.label} transform={`translate(${layer.x}, ${(160 - layer.height) / 2})`}>
            <rect
              width="32"
              height={layer.height}
              rx="3"
              fill="url(#mtc-layer)"
              stroke="#2d72d2"
              strokeOpacity="0.4"
              className="mtc-layer"
              style={{ animationDelay: `${idx * 0.2}s` }}
            />
            <text
              x="16"
              y={layer.height + 18}
              textAnchor="middle"
              fontFamily="Consolas, Monaco, monospace"
              fontSize="10"
              fill="rgba(16,22,26,0.55)"
            >
              {layer.label}
            </text>
          </g>
        ))}
        {/* Connector lines */}
        {[32, 76, 120].map((x) => (
          <path
            key={x}
            d={`M${x} 80 L${x + 12} 80`}
            stroke="rgba(45,114,210,0.5)"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />
        ))}
      </g>

      {/* Softmax distribution — output probabilities */}
      <g transform="translate(360, 100)">
        <text
          x="0"
          y="-12"
          fontFamily="Consolas, Monaco, monospace"
          fontSize="11"
          letterSpacing="0.12em"
          fill="rgba(16,22,26,0.5)"
        >
          SOFTMAX OUTPUT
        </text>
        {distributions.map((d, idx) => {
          const barWidth = d.value * 200;
          return (
            <g key={d.name} transform={`translate(0, ${idx * 38})`}>
              <text
                x="0"
                y="14"
                fontFamily="var(--font-sans)"
                fontSize="12"
                fontWeight="600"
                fill="rgba(16,22,26,0.7)"
              >
                {d.name}
              </text>
              <rect
                x="56"
                y="2"
                width="200"
                height="16"
                rx="2"
                fill="rgba(16,22,26,0.06)"
              />
              <rect
                x="56"
                y="2"
                width={barWidth}
                height="16"
                rx="2"
                fill={d.color}
                className="mtc-bar"
                style={{ animationDelay: `${idx * 0.15}s` }}
              />
              <text
                x={56 + barWidth + 6}
                y="14"
                fontFamily="Consolas, Monaco, monospace"
                fontSize="11"
                fontWeight="700"
                fill={d.color === '#cd4246' ? '#cd4246' : 'rgba(16,22,26,0.55)'}
              >
                {(d.value * 100).toFixed(0)}%
              </text>
            </g>
          );
        })}
      </g>

      {/* Attacker arrow + inference label */}
      <g transform="translate(360, 320)">
        <path
          d="M0 0 L240 0"
          stroke="#cd4246"
          strokeWidth="2"
          strokeDasharray="6 4"
          className="mtc-leak-line"
        />
        <path d="M240 0 L232 -4 M240 0 L232 4" stroke="#cd4246" strokeWidth="2" fill="none" />
        <text
          x="120"
          y="-8"
          textAnchor="middle"
          fontFamily="Consolas, Monaco, monospace"
          fontSize="11"
          fontWeight="700"
          fill="#cd4246"
          letterSpacing="0.1em"
        >
          INFERRED TYPE = ResNet
        </text>
        <text
          x="120"
          y="22"
          textAnchor="middle"
          fontFamily="var(--font-sans)"
          fontSize="11"
          fill="rgba(16,22,26,0.55)"
        >
          model identity leaked via output distribution
        </text>
      </g>
    </svg>
  );
}
