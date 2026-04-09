import { Handle, Position } from '@xyflow/react';

export function StartNode() {
  return (
    <div style={{
      background: '#1C2127',
      color: '#F5F8FA',
      border: '1px solid #394B59',
      borderRadius: 3,
      padding: '10px 18px',
      fontSize: 13,
      fontWeight: 600,
    }}>
      모의 공격 시작
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
