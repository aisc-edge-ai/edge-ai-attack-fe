import { Handle, Position } from '@xyflow/react';
import { Card, Icon } from '@blueprintjs/core';

export function DataSourceNode({ data }: { data: { dataSource: string; datasetName?: string } }) {
  const isGenerate = data.dataSource === 'generate';

  return (
    <>
      <Handle type="target" position={Position.Left} />
      <Card className="workflow-node workflow-node-data">
        <Icon icon={isGenerate ? 'refresh' : 'database'} size={28} />
        <div>
          <div className="workflow-node-title">
            {isGenerate ? '실시간 생성' : '저장 데이터'}
          </div>
          <div className="workflow-node-sub">
            {isGenerate ? '자동 공격 데이터 생성' : data.datasetName || '데이터셋 선택됨'}
          </div>
        </div>
      </Card>
      <Handle type="source" position={Position.Right} />
    </>
  );
}
