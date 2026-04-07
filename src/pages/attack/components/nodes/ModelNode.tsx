import { Handle, Position } from '@xyflow/react';
import { Card, Icon, type IconName } from '@blueprintjs/core';

const MODEL_LABELS: Record<string, { icon: string; title: string; subtitle: string }> = {
  cctv: { icon: 'camera', title: 'CCTV', subtitle: '객체 탐지' },
  voice: { icon: 'headset', title: 'AI 비서', subtitle: '음성 인식' },
  autonomous: { icon: 'drive-time', title: '자율주행', subtitle: '이미지 분류' },
};

export function ModelNode({ data }: { data: { modelType: string } }) {
  const info = MODEL_LABELS[data.modelType] || MODEL_LABELS.cctv;

  return (
    <>
      <Handle type="target" position={Position.Left} />
      <Card className="workflow-node workflow-node-model">
        <Icon icon={info.icon as IconName} size={28} />
        <div>
          <div className="workflow-node-title">{info.title}</div>
          <div className="workflow-node-sub">{info.subtitle}</div>
        </div>
      </Card>
      <Handle type="source" position={Position.Right} />
    </>
  );
}
