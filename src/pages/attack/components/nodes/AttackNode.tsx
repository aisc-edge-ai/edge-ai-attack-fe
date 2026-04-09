import { Handle, Position } from '@xyflow/react';
import { Icon, Tag } from '@blueprintjs/core';
import { MOCK_ATTACK_CATEGORIES } from '@/lib/mock-data';

export function AttackNode({ data }: { data: { attackIds: string[] } }) {
  const allAttacks = MOCK_ATTACK_CATEGORIES.flatMap((c) => c.children);
  const selected = allAttacks.filter((a) => data.attackIds.includes(a.id));

  return (
    <>
      <Handle type="target" position={Position.Left} />
      <div className="workflow-node workflow-node-attack">
        <Icon icon="shield" size={20} />
        <div>
          <div className="workflow-node-title">{selected.length > 0 ? '공격 기법' : '공격 선택 대기'}</div>
          <div className="workflow-node-tags">
            {selected.length > 0 ? selected.map((a) => (
              <Tag key={a.id} minimal round>
                {a.name}
              </Tag>
            )) : <span className="workflow-node-sub">공격을 선택하세요</span>}
          </div>
        </div>
      </div>
      <Handle type="source" position={Position.Right} />
    </>
  );
}
