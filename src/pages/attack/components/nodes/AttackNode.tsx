import { Handle, Position } from '@xyflow/react';
import { Icon, Tag } from '@blueprintjs/core';

export function AttackNode({ data }: { data: { attackNames: string[] } }) {
  const names = data.attackNames || [];

  return (
    <>
      <Handle type="target" position={Position.Left} />
      <div className="workflow-node workflow-node-attack">
        <Icon icon="shield" size={20} />
        <div>
          <div className="workflow-node-title">{names.length > 0 ? '공격 기법' : '공격 선택 대기'}</div>
          <div className="workflow-node-tags">
            {names.length > 0 ? names.map((name) => (
              <Tag key={name} minimal round>{name}</Tag>
            )) : <span className="workflow-node-sub">공격을 선택하세요</span>}
          </div>
        </div>
      </div>
      <Handle type="source" position={Position.Right} />
    </>
  );
}
