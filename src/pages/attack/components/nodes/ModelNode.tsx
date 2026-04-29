import { Handle, Position } from '@xyflow/react';
import { Icon, type IconName } from '@blueprintjs/core';

const MODEL_LABELS: Record<string, { icon: string; title: string; subtitle: string }> = {
  cctv: { icon: 'camera', title: 'CCTV', subtitle: '객체 탐지' },
  voice: { icon: 'headset', title: 'AI 비서', subtitle: '음성 인식' },
  autonomous: { icon: 'drive-time', title: '자율주행', subtitle: '이미지 분류' },
};

export function ModelNode({ data }: { data: { modelName?: string; modelType: string } }) {
  const info = data.modelType ? MODEL_LABELS[data.modelType] : null;

  return (
    <>
      <Handle type="target" position={Position.Left} />
      <div className="workflow-node workflow-node-model">
        <Icon icon={info ? info.icon as IconName : 'help'} size={20} />
        <div>
          <div className="workflow-node-title">
            {data.modelName || (info ? info.title : '모델 선택 대기')}
          </div>
          <div className="workflow-node-sub">{info ? info.subtitle : '모델을 선택하세요'}</div>
        </div>
      </div>
      <Handle type="source" position={Position.Right} />
    </>
  );
}
