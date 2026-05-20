import type { AttackGraphicProps } from './types';

/**
 * 새 CCTV 그래픽 — 모니터 카드 안에 가두지 않고 페이지 배경 위에 떠 있는
 * isometric detection scene. 카메라 device + view cone + 객체 + bbox
 * + adversarial patch 가 한 무대에 배치된다.
 *
 *  attackId 분기 (CCTV scene):
 *    atk-hiding   : bbox/객체 fade + HIDDEN red strip
 *    atk-altering : bbox shake + class label glitch (person ↔ tree)
 *    atk-creating : 우측 빈 공간에 ghost bbox phantom 등장
 */
export function CctvSceneGraphic({
  state,
  attackId,
  modelDisplayLabel,
  datasetLabel,
}: AttackGraphicProps) {
  const isHiding = attackId === 'atk-hiding';
  const isAltering = attackId === 'atk-altering';
  const isCreating = attackId === 'atk-creating';
  const hasAttack = isHiding || isAltering || isCreating;

  const modelLabel = modelDisplayLabel ?? 'YOLOv5';

  return (
    <svg
      className={`attack-graphic attack-graphic--cctv attack-graphic--cctv-scene attack-graphic--${state}`}
      viewBox="0 0 600 400"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="CCTV 객체 탐지 시뮬레이션"
    >
      <defs>
        {/* 카메라 본체 그라데이션 */}
        <linearGradient id="cam-body" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3a4754" />
          <stop offset="55%" stopColor="#252a31" />
          <stop offset="100%" stopColor="#1c2127" />
        </linearGradient>
        <linearGradient id="cam-body-top" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5c6b7a" />
          <stop offset="100%" stopColor="#3a4754" />
        </linearGradient>
        {/* lens 반사 */}
        <radialGradient id="cam-lens" cx="40%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#6aa6ff" stopOpacity="0.9" />
          <stop offset="55%" stopColor="#2d72d2" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#0a1f3d" stopOpacity="1" />
        </radialGradient>
        {/* detection beam (옅은 blue) */}
        <linearGradient id="beam-fill" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(45,114,210,0.32)" />
          <stop offset="55%" stopColor="rgba(45,114,210,0.16)" />
          <stop offset="100%" stopColor="rgba(45,114,210,0)" />
        </linearGradient>
        <linearGradient id="beam-edge" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(45,114,210,0.6)" />
          <stop offset="100%" stopColor="rgba(45,114,210,0)" />
        </linearGradient>
        {/* 객체 silhouette */}
        <linearGradient id="subject-fill" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#7a8a99" />
          <stop offset="100%" stopColor="#4a5867" />
        </linearGradient>
        {/* beam 내부 가로 grid pattern (천천히 drift) */}
        <pattern id="beam-grid" width="40" height="14" patternUnits="userSpaceOnUse">
          <path
            d="M0 7 L40 7"
            stroke="rgba(45,114,210,0.18)"
            strokeWidth="0.6"
          />
        </pattern>
        {/* adversarial patch crosshatch */}
        <pattern
          id="cctv-patch-hatch"
          width="6"
          height="6"
          patternUnits="userSpaceOnUse"
        >
          <rect width="6" height="6" fill="rgba(205,66,70,0.78)" />
          <path
            d="M0 0 L6 6 M6 0 L0 6"
            stroke="rgba(255,255,255,0.55)"
            strokeWidth="0.8"
          />
        </pattern>
        {/* scan line gradient */}
        <linearGradient id="cctv-scene-scan-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(45,114,210,0)" />
          <stop offset="50%" stopColor="rgba(45,114,210,0.7)" />
          <stop offset="100%" stopColor="rgba(45,114,210,0)" />
        </linearGradient>
        <clipPath id="beam-clip">
          {/* 사다리꼴 beam 영역 */}
          <path d="M128 76 L460 156 L460 332 L128 110 Z" />
        </clipPath>
      </defs>

      {/* ============ CAM-01 chip (카메라 옆 floating 라벨) ============ */}
      <g className="cctv-scene-cam-chip">
        <rect
          x="148"
          y="50"
          width="146"
          height="22"
          rx="3"
          fill="rgba(16,22,26,0.82)"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1"
        />
        <circle cx="158" cy="61" r="2.6" fill="#cd4246" className="cctv-rec" />
        <text
          x="166"
          y="65"
          fontFamily="Consolas, Monaco, monospace"
          fontSize="10.5"
          fill="rgba(255,255,255,0.92)"
          letterSpacing="0.08em"
        >
          CAM-01 · {modelLabel}
        </text>
      </g>

      {/* ============ DATASET chip (우상단, Stage 04 hover/select 시 표시) ============ */}
      {datasetLabel && (
        <g className="cctv-scene-dataset-chip">
          <rect
            x="384"
            y="26"
            width="200"
            height="22"
            rx="3"
            fill="rgba(16,22,26,0.82)"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="1"
          />
          <text
            x="394"
            y="41"
            fontFamily="Consolas, Monaco, monospace"
            fontSize="10"
            fill="rgba(255,255,255,0.92)"
            letterSpacing="0.06em"
          >
            DATASET · {datasetLabel}
          </text>
        </g>
      )}

      {/* ============ Wall mount bracket ============ */}
      <g className="cctv-scene-bracket">
        <rect
          x="36"
          y="78"
          width="14"
          height="34"
          rx="2"
          fill="#8a98a6"
        />
        <rect
          x="46"
          y="92"
          width="36"
          height="6"
          rx="1.5"
          fill="#5c6b7a"
        />
      </g>

      {/* ============ CCTV camera body (3/4 isometric) ============ */}
      <g className="cctv-scene-camera">
        {/* main housing */}
        <path
          d="M78 70 L150 60 L150 116 L78 132 Z"
          fill="url(#cam-body)"
          stroke="rgba(16,22,26,0.6)"
          strokeWidth="1"
        />
        {/* top plate */}
        <path
          d="M78 70 L150 60 L142 56 L72 66 Z"
          fill="url(#cam-body-top)"
        />
        {/* side panel highlight */}
        <path
          d="M78 70 L78 132 L72 128 L72 66 Z"
          fill="rgba(16,22,26,0.55)"
        />
        {/* tiny REC LED on top */}
        <circle
          cx="98"
          cy="65"
          r="2"
          fill="#cd4246"
          className="cctv-scene-rec-led"
        />
        <circle
          cx="116"
          cy="63"
          r="1.4"
          fill="rgba(15,153,96,0.85)"
        />
        {/* lens housing */}
        <ellipse
          cx="155"
          cy="92"
          rx="14"
          ry="16"
          fill="#1c2127"
          stroke="rgba(255,255,255,0.08)"
        />
        <ellipse cx="155" cy="92" rx="10" ry="12" fill="url(#cam-lens)" />
        <ellipse
          cx="151"
          cy="86"
          rx="3"
          ry="2"
          fill="rgba(255,255,255,0.7)"
        />
        {/* lens collar */}
        <path
          d="M148 78 L165 78 L165 106 L148 106 Z"
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="0.8"
        />
      </g>

      {/* ============ Detection beam (view cone) ============ */}
      <g className="cctv-scene-beam">
        {/* fill cone */}
        <path
          d="M128 76 L460 156 L460 332 L128 110 Z"
          fill="url(#beam-fill)"
        />
        {/* leading/trailing edge */}
        <path
          d="M128 76 L460 156"
          stroke="url(#beam-edge)"
          strokeWidth="1.2"
          fill="none"
        />
        <path
          d="M128 110 L460 332"
          stroke="url(#beam-edge)"
          strokeWidth="1.2"
          fill="none"
        />
        {/* internal grid (drift via CSS translate) */}
        <g clipPath="url(#beam-clip)">
          <rect
            x="120"
            y="68"
            width="360"
            height="280"
            fill="url(#beam-grid)"
            className="cctv-scene-beam-grid"
          />
          {/* perspective sweep line (좌→우 scan) */}
          <path
            d="M180 96 L182 320"
            stroke="url(#cctv-scene-scan-grad)"
            strokeWidth="40"
            strokeLinecap="round"
            className="cctv-scene-beam-scan"
          />
        </g>
      </g>

      {/* ============ Ground shadow ============ */}
      <ellipse
        cx="340"
        cy="318"
        rx="56"
        ry="9"
        fill="rgba(16,22,26,0.28)"
        className="cctv-scene-ground"
      />

      {/* ============ Subject (pedestrian silhouette) ============ */}
      <g
        className={`cctv-scene-subject${
          isHiding ? ' cctv-scene-subject--hiding' : ''
        }`}
      >
        {/* head */}
        <ellipse cx="340" cy="172" rx="13" ry="15" fill="url(#subject-fill)" />
        {/* shoulders / torso */}
        <path
          d="M312 198
             Q312 188 325 186
             L355 186
             Q368 188 368 198
             L368 256
             Q368 262 360 263
             L320 263
             Q312 262 312 256 Z"
          fill="url(#subject-fill)"
        />
        {/* legs (slight stride) */}
        <path
          d="M324 263
             L322 308
             L334 308
             L338 263 Z"
          fill="url(#subject-fill)"
        />
        <path
          d="M342 263
             L346 308
             L358 308
             L356 263 Z"
          fill="url(#subject-fill)"
        />
        {/* neck shadow */}
        <ellipse cx="340" cy="188" rx="6" ry="2" fill="rgba(16,22,26,0.35)" />
      </g>

      {/* ============ Detection bbox — 4 corner brackets ============ */}
      {!isHiding && (
        <g
          className={`cctv-scene-bbox${
            isAltering ? ' cctv-scene-bbox--altering' : ''
          }`}
        >
          {/* top-left ┌ */}
          <path
            d="M292 162 L292 152 L312 152"
            stroke="#0f9960"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
          {/* top-right ┐ */}
          <path
            d="M368 152 L388 152 L388 162"
            stroke="#0f9960"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
          {/* bottom-left └ */}
          <path
            d="M292 308 L292 318 L312 318"
            stroke="#0f9960"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
          {/* bottom-right ┘ */}
          <path
            d="M368 318 L388 318 L388 308"
            stroke="#0f9960"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
          {/* full bbox subtle line */}
          <rect
            x="292"
            y="152"
            width="96"
            height="166"
            fill="none"
            stroke="rgba(15,153,96,0.32)"
            strokeWidth="1"
            strokeDasharray="3 4"
          />
        </g>
      )}

      {/* ============ Confidence chip (객체 위) ============ */}
      {!isHiding && (
        <g className="cctv-scene-confidence">
          <rect
            x="292"
            y="130"
            width="96"
            height="18"
            rx="2"
            fill="rgba(15,153,96,0.95)"
          />
          {/* 1.idle/preview/selected steady label */}
          <text
            x="298"
            y="143"
            fontFamily="Consolas, Monaco, monospace"
            fontSize="11"
            fontWeight="700"
            fill="#ffffff"
            letterSpacing="0.04em"
            className={`cctv-scene-conf-text cctv-scene-conf-stage-1${
              isAltering ? ' cctv-scene-conf-altering' : ''
            }`}
          >
            {isAltering ? 'person 0.96' : 'person 0.96'}
          </text>
          {/* altering glitch swap label (alternate person ↔ tree) */}
          {isAltering && (
            <text
              x="298"
              y="143"
              fontFamily="Consolas, Monaco, monospace"
              fontSize="11"
              fontWeight="700"
              fill="#ffffff"
              letterSpacing="0.04em"
              className="cctv-scene-conf-text cctv-scene-conf-altering-alt"
            >
              tree 0.71
            </text>
          )}
          {/* 2,3: running 시 dive 단계 */}
          <text
            x="298"
            y="143"
            fontFamily="Consolas, Monaco, monospace"
            fontSize="11"
            fontWeight="700"
            fill="#ffffff"
            letterSpacing="0.04em"
            className="cctv-scene-conf-text cctv-scene-conf-stage-2"
          >
            person 0.42
          </text>
          <text
            x="298"
            y="143"
            fontFamily="Consolas, Monaco, monospace"
            fontSize="11"
            fontWeight="700"
            fill="#ffffff"
            letterSpacing="0.04em"
            className="cctv-scene-conf-text cctv-scene-conf-stage-3"
          >
            person 0.12
          </text>
        </g>
      )}

      {/* ============ Adversarial patch (chest area) ============ */}
      {hasAttack && (
        <g className="cctv-scene-patch">
          <rect
            x="320"
            y="212"
            width="40"
            height="40"
            rx="2"
            fill="url(#cctv-patch-hatch)"
            stroke="#cd4246"
            strokeWidth="1.5"
          />
          <text
            x="340"
            y="266"
            textAnchor="middle"
            fontFamily="Consolas, Monaco, monospace"
            fontSize="9"
            fontWeight="700"
            fill="#cd4246"
            letterSpacing="0.14em"
          >
            PATCH
          </text>
        </g>
      )}

      {/* ============ Hiding strip (HIDDEN) ============ */}
      {isHiding && (
        <g className="cctv-scene-hidden-strip">
          <rect
            x="280"
            y="218"
            width="120"
            height="32"
            rx="3"
            fill="rgba(205,66,70,0.92)"
          />
          <text
            x="340"
            y="239"
            textAnchor="middle"
            fontFamily="Consolas, Monaco, monospace"
            fontSize="14"
            fontWeight="700"
            fill="#ffffff"
            letterSpacing="0.18em"
          >
            HIDDEN
          </text>
        </g>
      )}

      {/* ============ Ghost bbox (creating) ============ */}
      {isCreating && (
        <g className="cctv-scene-ghost">
          {/* phantom bbox in empty area */}
          <path
            d="M410 198 L410 188 L424 188"
            stroke="#cd4246"
            strokeWidth="2.2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M450 188 L464 188 L464 198"
            stroke="#cd4246"
            strokeWidth="2.2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M410 286 L410 296 L424 296"
            stroke="#cd4246"
            strokeWidth="2.2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M450 296 L464 296 L464 286"
            stroke="#cd4246"
            strokeWidth="2.2"
            fill="none"
            strokeLinecap="round"
          />
          <rect
            x="410"
            y="188"
            width="54"
            height="108"
            fill="rgba(205,66,70,0.05)"
            stroke="rgba(205,66,70,0.32)"
            strokeWidth="1"
            strokeDasharray="3 4"
          />
          {/* ghost label */}
          <rect
            x="410"
            y="166"
            width="78"
            height="18"
            rx="2"
            fill="rgba(205,66,70,0.92)"
          />
          <text
            x="416"
            y="179"
            fontFamily="Consolas, Monaco, monospace"
            fontSize="11"
            fontWeight="700"
            fill="#ffffff"
            letterSpacing="0.04em"
          >
            ghost 0.89
          </text>
        </g>
      )}

      {/* ============ ATTACK INJECTED strip (좌하단, running only) ============ */}
      <g className="cctv-scene-injected">
        <rect
          x="22"
          y="358"
          width="172"
          height="26"
          rx="3"
          fill="#cd4246"
        />
        <circle cx="34" cy="371" r="3" fill="#ffffff" />
        <text
          x="44"
          y="375"
          fontFamily="Consolas, Monaco, monospace"
          fontSize="12"
          fontWeight="700"
          fill="#ffffff"
          letterSpacing="0.16em"
        >
          ATTACK INJECTED
        </text>
      </g>

      {/* ============ FPS / FRAME mini metric (우하단) ============ */}
      <g className="cctv-scene-metric">
        <text
          x="578"
          y="370"
          textAnchor="end"
          fontFamily="Consolas, Monaco, monospace"
          fontSize="10"
          fill="rgba(16,22,26,0.55)"
          letterSpacing="0.06em"
        >
          FPS · 28.4
        </text>
        <text
          x="578"
          y="384"
          textAnchor="end"
          fontFamily="Consolas, Monaco, monospace"
          fontSize="10"
          fill="rgba(16,22,26,0.45)"
          letterSpacing="0.06em"
        >
          FRAME · 01:24:18
        </text>
        <circle
          cx="486"
          cy="367"
          r="2.4"
          fill="#0f9960"
          className="cctv-scene-tick"
        />
      </g>

      {/* ============ Corner focus brackets (frame edges) ============ */}
      <g
        className="cctv-scene-corner"
        stroke="rgba(45,114,210,0.45)"
        strokeWidth="1.4"
        fill="none"
      >
        <path d="M14 14 L14 34 M14 14 L34 14" />
        <path d="M586 14 L586 34 M586 14 L566 14" />
        <path d="M14 386 L14 366 M14 386 L34 386" />
        <path d="M586 386 L586 366 M586 386 L566 386" />
      </g>
    </svg>
  );
}
