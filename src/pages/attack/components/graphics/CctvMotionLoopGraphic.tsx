import { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { withPublicPath } from '@/lib/publicPath';
import { CctvSceneGraphic } from './CctvSceneGraphic';
import type { AttackGraphicProps } from './types';

type MotionLoopKey = 'idle' | 'hiding' | 'altering' | 'creating';

const LOOP_BY_ATTACK: Record<string, MotionLoopKey> = {
  'atk-hiding': 'hiding',
  'atk-altering': 'altering',
  'atk-creating': 'creating',
};

const LOOP_ASSETS: Record<MotionLoopKey, { mp4: string; webm: string }> = {
  idle: {
    mp4: withPublicPath('animations/cctv-detection-idle.mp4'),
    webm: withPublicPath('animations/cctv-detection-idle.webm'),
  },
  hiding: {
    mp4: withPublicPath('animations/cctv-detection-hiding.mp4'),
    webm: withPublicPath('animations/cctv-detection-hiding.webm'),
  },
  altering: {
    mp4: withPublicPath('animations/cctv-detection-altering.mp4'),
    webm: withPublicPath('animations/cctv-detection-altering.webm'),
  },
  creating: {
    mp4: withPublicPath('animations/cctv-detection-creating.mp4'),
    webm: withPublicPath('animations/cctv-detection-creating.webm'),
  },
};

const LOOP_ORDER: MotionLoopKey[] = ['idle', 'hiding', 'altering', 'creating'];

export function CctvMotionLoopGraphic(props: AttackGraphicProps) {
  const { state, attackId, modelDisplayLabel, datasetLabel } = props;
  const loopKey = useMemo<MotionLoopKey>(
    () => (attackId ? LOOP_BY_ATTACK[attackId] ?? 'idle' : 'idle'),
    [attackId]
  );
  const [failedLoop, setFailedLoop] = useState<MotionLoopKey | null>(null);
  const activeVideoRef = useRef<HTMLVideoElement | null>(null);

  const isHiding = loopKey === 'hiding';
  const isAltering = loopKey === 'altering';
  const isCreating = loopKey === 'creating';
  const hasAttack = isHiding || isAltering || isCreating;

  useEffect(() => {
    const video = activeVideoRef.current;
    if (!video) return;

    video.playbackRate = state === 'running' ? 1.18 : 1;
  }, [loopKey, state]);

  if (failedLoop === loopKey) {
    return <CctvSceneGraphic {...props} />;
  }

  return (
    <div
      className={cn(
        'attack-graphic',
        'attack-graphic--cctv',
        'attack-graphic--cctv-motion',
        `attack-graphic--${state}`,
        `cctv-motion--${loopKey}`
      )}
      role="img"
      aria-label="CCTV 객체 탐지 모션 그래픽"
    >
      <div className="cctv-motion-video-stack" aria-hidden="true">
        {LOOP_ORDER.map((key) => (
          <LoopVideo
            key={key}
            loopKey={key}
            active={key === loopKey}
            refCallback={(node) => {
              if (key === loopKey) {
                activeVideoRef.current = node;
              }
            }}
            onError={key === loopKey ? () => setFailedLoop(key) : undefined}
          />
        ))}
      </div>

      <div className="cctv-motion-vignette" aria-hidden="true" />
      <CctvMotionOverlay
        state={state}
        isHiding={isHiding}
        isAltering={isAltering}
        isCreating={isCreating}
        hasAttack={hasAttack}
        modelDisplayLabel={modelDisplayLabel}
        datasetLabel={datasetLabel}
      />
    </div>
  );
}

interface LoopVideoProps {
  loopKey: MotionLoopKey;
  active: boolean;
  onError?: () => void;
  refCallback?: (node: HTMLVideoElement | null) => void;
}

function LoopVideo({ loopKey, active, onError, refCallback }: LoopVideoProps) {
  const asset = LOOP_ASSETS[loopKey];

  return (
    <video
      ref={refCallback}
      className={cn(
        'cctv-motion-video',
        active && 'cctv-motion-video--active'
      )}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      onError={onError}
    >
      <source src={asset.webm} type="video/webm" />
      <source src={asset.mp4} type="video/mp4" />
    </video>
  );
}

interface CctvMotionOverlayProps {
  state: AttackGraphicProps['state'];
  isHiding: boolean;
  isAltering: boolean;
  isCreating: boolean;
  hasAttack: boolean;
  modelDisplayLabel?: string;
  datasetLabel?: string;
}

function CctvMotionOverlay({
  state,
  isHiding,
  isAltering,
  isCreating,
  hasAttack,
  modelDisplayLabel,
  datasetLabel,
}: CctvMotionOverlayProps) {
  const modelLabel = modelDisplayLabel ?? 'YOLOv5';

  return (
    <svg
      className="cctv-motion-overlay"
      viewBox="0 0 600 400"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="cctv-motion-scan" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(45,114,210,0)" />
          <stop offset="50%" stopColor="rgba(45,114,210,0.82)" />
          <stop offset="100%" stopColor="rgba(45,114,210,0)" />
        </linearGradient>
        <pattern id="cctv-motion-patch" width="6" height="6" patternUnits="userSpaceOnUse">
          <rect width="6" height="6" fill="rgba(205,66,70,0.86)" />
          <path
            d="M0 0 L6 6 M6 0 L0 6"
            stroke="rgba(255,255,255,0.52)"
            strokeWidth="0.8"
          />
        </pattern>
      </defs>

      <g className="cctv-motion-chip cctv-motion-chip--camera">
        <rect x="24" y="24" width="152" height="24" rx="3" />
        <circle cx="38" cy="36" r="3" className="cctv-motion-rec" />
        <text x="48" y="40">
          CAM-01 · {modelLabel}
        </text>
      </g>

      {datasetLabel && (
        <g className="cctv-motion-chip cctv-motion-chip--dataset">
          <rect x="354" y="24" width="222" height="24" rx="3" />
          <text x="366" y="40">
            DATASET · {datasetLabel}
          </text>
        </g>
      )}

      <g className="cctv-motion-scan-cone">
        <path d="M116 80 L486 130 L512 334 L106 334 Z" />
        <path className="cctv-motion-scan-line" d="M156 98 L178 332" />
      </g>

      {!isHiding && (
        <>
          <g
            className={cn(
              'cctv-motion-bbox',
              isAltering && 'cctv-motion-bbox--altering'
            )}
          >
            <path d="M252 126 L252 108 L286 108" />
            <path d="M378 108 L412 108 L412 126" />
            <path d="M252 304 L252 322 L286 322" />
            <path d="M378 322 L412 322 L412 304" />
            <rect x="252" y="108" width="160" height="214" />
          </g>

          <g className="cctv-motion-confidence">
            <rect x="252" y="82" width="112" height="20" rx="2" />
            <text
              x="262"
              y="96"
              className={cn(
                'cctv-motion-confidence-text',
                'cctv-motion-confidence-stage-1',
                isAltering && 'cctv-motion-confidence--altering'
              )}
            >
              person 0.96
            </text>
            {isAltering && (
              <text
                x="262"
                y="96"
                className="cctv-motion-confidence-text cctv-motion-confidence-alt"
              >
                tree 0.71
              </text>
            )}
            <text
              x="262"
              y="96"
              className="cctv-motion-confidence-text cctv-motion-confidence-stage-2"
            >
              person 0.42
            </text>
            <text
              x="262"
              y="96"
              className="cctv-motion-confidence-text cctv-motion-confidence-stage-3"
            >
              person 0.12
            </text>
          </g>
        </>
      )}

      {hasAttack && (
        <g className="cctv-motion-patch">
          <rect x="316" y="206" width="42" height="42" rx="2" />
          <text x="337" y="264" textAnchor="middle">
            PATCH
          </text>
        </g>
      )}

      {isHiding && (
        <g className="cctv-motion-hidden">
          <rect x="248" y="196" width="142" height="36" rx="3" />
          <text x="319" y="220" textAnchor="middle">
            HIDDEN
          </text>
        </g>
      )}

      {isCreating && (
        <g className="cctv-motion-ghost">
          <path d="M424 146 L424 130 L448 130" />
          <path d="M496 130 L520 130 L520 146" />
          <path d="M424 278 L424 294 L448 294" />
          <path d="M496 294 L520 294 L520 278" />
          <rect x="424" y="130" width="96" height="164" />
          <rect x="424" y="104" width="86" height="20" rx="2" className="cctv-motion-ghost-label" />
          <text x="434" y="119" className="cctv-motion-ghost-text">
            ghost 0.89
          </text>
        </g>
      )}

      <g className={cn('cctv-motion-injected', state === 'running' && 'is-visible')}>
        <rect x="24" y="350" width="184" height="28" rx="3" />
        <circle cx="38" cy="364" r="3" />
        <text x="50" y="369">
          ATTACK INJECTED
        </text>
      </g>

      <g className={cn('cctv-motion-metric', state !== 'idle' && 'is-visible')}>
        <circle cx="484" cy="362" r="2.5" />
        <text x="576" y="366" textAnchor="end">
          FPS · 28.4
        </text>
        <text x="576" y="382" textAnchor="end">
          FRAME · 01:24:18
        </text>
      </g>

      <g className="cctv-motion-corners">
        <path d="M14 14 L14 34 M14 14 L34 14" />
        <path d="M586 14 L586 34 M586 14 L566 14" />
        <path d="M14 386 L14 366 M14 386 L34 386" />
        <path d="M586 386 L586 366 M586 386 L566 386" />
      </g>
    </svg>
  );
}
