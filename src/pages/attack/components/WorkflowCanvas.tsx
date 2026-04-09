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
import { useAttackTypes } from '@/hooks/useAttacks';
import { StartNode } from './nodes/StartNode';
import { ModelNode } from './nodes/ModelNode';
import { AttackNode } from './nodes/AttackNode';
import { DataSourceNode } from './nodes/DataSourceNode';

const nodeTypes: NodeTypes = {
  startNode: StartNode,
  modelNode: ModelNode,
  attackNode: AttackNode,
  dataSourceNode: DataSourceNode,
};

const ANIMATED_EDGE = {
  animated: true,
  style: { stroke: '#2D72D2', strokeWidth: 2 },
  markerEnd: { type: MarkerType.ArrowClosed, color: '#2D72D2', width: 16, height: 16 },
};

export function WorkflowCanvas() {
  const { currentStep, selectedModelType, selectedAttackIds, dataSource, selectedDatasetId } =
    useAttackWizardStore();
  const { data: datasets } = useDatasets({ sort: 'latest' });
  const { data: attackCategories } = useAttackTypes(selectedModelType);

  const { nodes, edges, nodeKey } = useMemo(() => {
    const n: Node[] = [];
    const e: Edge[] = [];
    let x = 50;
    const y = 120;
    const gap = 260;

    // 시작 노드 (항상)
    n.push({
      id: 'start',
      type: 'startNode',
      data: {},
      position: { x, y },
    });

    // 모델 노드: Step 1부터 보임 (선택 전이면 빈 상태)
    if (currentStep >= 1) {
      x += gap;
      n.push({
        id: 'model',
        type: 'modelNode',
        data: { modelType: selectedModelType || '' },
        position: { x, y },
      });
      e.push({ id: 'e-start-model', source: 'start', target: 'model', ...ANIMATED_EDGE });
    }

    // 공격 노드: Step 2부터 보임
    if (currentStep >= 2) {
      x += gap;
      const allAttacks = (attackCategories || []).flatMap((c) => c.children);
      const attackNames = allAttacks
        .filter((a) => selectedAttackIds.includes(a.id))
        .map((a) => a.name);
      n.push({
        id: 'attack',
        type: 'attackNode',
        data: { attackNames },
        position: { x, y },
      });
      e.push({ id: 'e-model-attack', source: 'model', target: 'attack', ...ANIMATED_EDGE });
    }

    // 데이터소스 노드: Step 3부터 보임
    if (currentStep >= 3) {
      x += gap;
      const dataset = datasets?.find((d) => d.id === selectedDatasetId);
      n.push({
        id: 'datasource',
        type: 'dataSourceNode',
        data: { dataSource, datasetName: dataset?.name },
        position: { x, y },
      });
      e.push({ id: 'e-attack-data', source: 'attack', target: 'datasource', ...ANIMATED_EDGE });
    }

    return {
      nodes: n,
      edges: e,
      nodeKey: n.map(nd => nd.id).join('-'),
    };
  }, [currentStep, selectedModelType, selectedAttackIds, dataSource, selectedDatasetId, datasets, attackCategories]);

  return (
    <div className="workflow-canvas">
      <ReactFlow
        key={nodeKey}
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
