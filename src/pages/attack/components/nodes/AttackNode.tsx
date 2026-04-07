import { Handle, Position } from '@xyflow/react';
import { Card, Icon, Tag } from '@blueprintjs/core';
import { MOCK_ATTACK_CATEGORIES } from '@/lib/mock-data';

export function AttackNode({ data }: { data: { attackIds: string[] } }) {
  const allAttacks = MOCK_ATTACK_CATEGORIES.flatMap((c) => c.children);
  const selected = allAttacks.filter((a) => data.attackIds.includes(a.id));

  return (
    <>
      <Handle type="target" position={Position.Left} />
      <Card className="workflow-node workflow-node-attack">
        <Icon icon="shield" size={28} />
        <div>
          <div className="workflow-node-title">공격 기법</div>
          <div className="workflow-node-tags">
            {selected.map((a) => (
              <Tag key={a.id} minimal round>
                {a.name}
              </Tag>
            ))}
          </div>
        </div>
      </Card>
      <Handle type="source" position={Position.Right} />
    </>
  );
}
