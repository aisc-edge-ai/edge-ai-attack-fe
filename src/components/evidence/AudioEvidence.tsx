import { AudioPlayer } from '@/components/shared/AudioPlayer';
import type { AttackResult } from '@/types';

type VisualEvidence = NonNullable<AttackResult['detail']>['visualEvidence'];

interface AudioEvidenceProps {
  evidence: VisualEvidence;
}

/**
 * 음성 인식 결과의 시각 증거.
 * 원본/타겟/공격 등 라벨 별 오디오 샘플을 세로 스택으로 표시.
 */
export function AudioEvidence({ evidence }: AudioEvidenceProps) {
  const samples = evidence.audioSamples ?? [];
  return (
    <div className="evidence-audio-stack">
      {samples.map((sample, idx) => (
        <AudioPlayer key={`${sample.label}-${idx}`} label={sample.label} src={sample.src} />
      ))}
    </div>
  );
}
