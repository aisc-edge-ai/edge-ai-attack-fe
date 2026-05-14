import { Card, Icon, Tag } from '@blueprintjs/core';

interface AudioPlayerProps {
  label: string;
  src?: string;
}

export function AudioPlayer({ label, src }: AudioPlayerProps) {
  const empty = !src;
  return (
    <Card
      compact
      className={`audio-player-card ${empty ? 'audio-player-empty' : ''}`}
    >
      <div className="audio-player-header">
        <Icon icon={empty ? 'volume-off' : 'volume-up'} size={14} />
        <span className="audio-player-label">{label}</span>
        {empty && (
          <Tag minimal intent="warning" round>
            미연결
          </Tag>
        )}
      </div>
      {src ? (
        <audio
          controls
          preload="none"
          src={src}
          style={{ width: '100%', marginTop: 4 }}
        />
      ) : (
        <div className="audio-player-placeholder">
          음성 데이터 미연결 (by 승민)
        </div>
      )}
    </Card>
  );
}
