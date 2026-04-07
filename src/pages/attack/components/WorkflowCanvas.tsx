import { useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  type Node,
  type Edge,
  type NodeTypes,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useAttackWizardStore } from '@/stores/attackWizardStore';
import { useDatasets } from '@/hooks/useDatasets';
import { ModelNode } from './nodes/ModelNode';
import { AttackNode } from './nodes/AttackNode';
import { DataSourceNode } from './nodes/DataSourceNode';

const nodeTypes: NodeTypes = {
  modelNode: ModelNode,
  attackNode: AttackNode,
  dataSourceNode: DataSourceNode,
};

const EDGE_STYLE = {
  stroke: 'var(--bp-primary)',
  strokeWidth: 2,
};

const ANIMATED_EDGE = {
  animated: true,
  style: EDGE_STYLE,
  markerEnd: { type: MarkerType.ArrowClosed, color: 'var(--bp-primary)', width: 16, height: 16 },
};

export function WorkflowCanvas() {
  const { selectedModelType, selectedAttackIds, dataSource, selectedDatasetId } =
    useAttackWizardStore();
  const { data: datasets } = useDatasets({ sort: 'latest' });

  const { nodes, edges } = useMemo(() => {
    const n: Node[] = [];
    const e: Edge[] = [];
    let x = 50;
    const y = 120;
    const gap = 260;

    // 시작 노드 (항상 존재)
    n.push({
      id: 'start',
      type: 'input',
      data: { label: '모의 공격 시작' },
      position: { x, y },
      style: {
        background: '#1C2127',
        color: '#F5F8FA',
        border: '1px solid #394B59',
        borderRadius: 3,
        padding: '10px 18px',
        fontSize: 13,
        fontWeight: 600,
      },
    });

    // 모델 노드
    if (selectedModelType) {
      x += gap;
      n.push({
        id: 'model',
        type: 'modelNode',
        data: { modelType: selectedModelType },
        position: { x, y },
      });
      e.push({ id: 'e-start-model', source: 'start', target: 'model', ...ANIMATED_EDGE });
    }

    // 공격 노드
    if (selectedAttackIds.length > 0) {
      x += gap;
      n.push({
        id: 'attack',
        type: 'attackNode',
        data: { attackIds: selectedAttackIds },
        position: { x, y },
      });
      e.push({ id: 'e-model-attack', source: 'model', target: 'attack', ...ANIMATED_EDGE });
    }

    // 데이터소스 노드
    if (selectedAttackIds.length > 0 && (dataSource === 'generate' || selectedDatasetId)) {
      x += gap;
      const dataset = datasets?.find((d) => d.id === selectedDatasetId);
      n.push({
        id: 'datasource',
        type: 'dataSourceNode',
        data: { dataSource, datasetName: dataset?.name },
        position: { x, y },
      });
      e.push({
        id: 'e-attack-data',
        source: 'attack',
        target: 'datasource',
        ...ANIMATED_EDGE,
      });
    }

    return { nodes: n, edges: e };
  }, [selectedModelType, selectedAttackIds, dataSource, selectedDatasetId, datasets]);

  return (
    <div className="workflow-canvas">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        proOptions={{ hideAttribution: true }}
        nodesDraggable={true}
        nodesConnectable={false}
        elementsSelectable={false}
        minZoom={0.5}
        maxZoom={1.5}
      >
        <Background gap={20} size={1} color="rgba(16, 22, 26, 0.06)" />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
