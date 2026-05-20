import { useMemo } from 'react';
import { Icon } from '@blueprintjs/core';
import { AudioPlayer } from '@/components/shared/AudioPlayer';
import type { AttackResult } from '@/types';

type VisualEvidence = NonNullable<AttackResult['detail']>['visualEvidence'];

interface AudioEvidenceProps {
  evidence: VisualEvidence;
}

export function AudioEvidence({ evidence }: AudioEvidenceProps) {
  const samples = evidence.audioSamples ?? [];

  const { clean, attack } = useMemo(() => {
    const cleanSamples: typeof samples = [];
    const attackSamples: typeof samples = [];
    for (const s of samples) {
      if (s.label.includes('공격') || s.label.includes('합성')) {
        attackSamples.push(s);
      } else {
        cleanSamples.push(s);
      }
    }
    return { clean: cleanSamples, attack: attackSamples };
  }, [samples]);

  const hasAudio = clean.length > 0 || attack.length > 0;
  const hasSpectrograms = evidence.spectrogramOriginal || evidence.spectrogramSynth;

  if (!hasAudio && !hasSpectrograms) return null;

  return (
    <div>
      {hasAudio && (
        <div className="evidence-audio-grid">
          <div className="evidence-audio-column">
            <div className="evidence-audio-column-header">원본 음성 (정상 화자)</div>
            {clean.map((s, i) => (
              <AudioPlayer key={`clean-${i}`} label={s.label} src={s.src} />
            ))}
          </div>
          <div className="evidence-audio-column evidence-audio-column--attack">
            <div className="evidence-audio-column-header danger">공격 음성 (합성)</div>
            {attack.map((s, i) => (
              <AudioPlayer key={`attack-${i}`} label={s.label} src={s.src} />
            ))}
          </div>
        </div>
      )}

      {hasSpectrograms && (
        <div className="evidence-spectrogram-grid">
          {evidence.spectrogramOriginal && (
            <div className="evidence-panel">
              <div className="evidence-header">원본 음성 스펙트로그램</div>
              <div className="evidence-body">
                <img
                  src={evidence.spectrogramOriginal}
                  alt="Original spectrogram"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
            </div>
          )}
          {evidence.spectrogramSynth && (
            <div className="evidence-panel danger">
              <div className="evidence-header">
                <Icon icon="warning-sign" size={12} style={{ marginRight: 4 }} />
                공격 음성 스펙트로그램
              </div>
              <div className="evidence-body">
                <img
                  src={evidence.spectrogramSynth}
                  alt="Synth spectrogram"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
