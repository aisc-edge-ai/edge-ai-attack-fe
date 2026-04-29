import { useEffect } from 'react';
import { useAttackWizardStore } from '@/stores/attackWizardStore';
import { useVisualizationDatasets } from '@/hooks/useDatasets';
import {
  Card,
  Elevation,
  Icon,
  Tag,
  Divider,
  RadioGroup,
  Radio,
  Spinner,
  SpinnerSize,
} from '@blueprintjs/core';
import type { Dataset } from '@/types';

export function StepDataSource() {
  const {
    dataSource,
    setDataSource,
    datasetSubOption,
    setDatasetSubOption,
    selectedDatasetId,
    setDatasetId,
    selectedAttackIds,
  } = useAttackWizardStore();

  const isLoadMode = dataSource === 'load';
  const kind = datasetSubOption ?? null;

  const latestQuery = useVisualizationDatasets({
    attackTypeIds: selectedAttackIds,
    kind: 'latest',
    enabled: isLoadMode && kind === 'latest',
  });
  const fixedQuery = useVisualizationDatasets({
    attackTypeIds: selectedAttackIds,
    kind: 'fixed',
    enabled: isLoadMode && kind === 'fixed',
  });

  // 라디오 변경 시 datasetId 리셋
  useEffect(() => {
    if (!isLoadMode) {
      if (selectedDatasetId !== null) setDatasetId(null);
    }
  }, [isLoadMode, selectedDatasetId, setDatasetId]);

  // 선택된 datasetId가 현재 표시되는 목록에 없으면 리셋
  useEffect(() => {
    if (!isLoadMode || !kind) return;
    const list = (kind === 'latest' ? latestQuery.data : fixedQuery.data) ?? [];
    if (selectedDatasetId && !list.some((ds) => ds.id === selectedDatasetId)) {
      setDatasetId(null);
    }
  }, [
    isLoadMode,
    kind,
    latestQuery.data,
    fixedQuery.data,
    selectedDatasetId,
    setDatasetId,
  ]);

  return (
    <div className="animate-fade-in">
      {/* 데이터 소스 선택 — interactive Card 패턴 */}
      <div className="datasource-options">
        <Card
          interactive
          selected={dataSource === 'generate'}
          elevation={dataSource === 'generate' ? Elevation.TWO : Elevation.ZERO}
          className="datasource-card"
          onClick={() => setDataSource('generate')}
        >
          <div className="datasource-card-content">
            <div className="datasource-card-icon">
              <Icon
                icon="refresh"
                size={24}
                intent={dataSource === 'generate' ? 'primary' : 'none'}
              />
            </div>
            <div className="datasource-card-text">
              <div className="datasource-card-title">실시간 공격 데이터 생성</div>
              <div className="datasource-card-desc">
                선택한 모델과 공격 기법에 맞춰 시스템이 자동으로 데이터를 생성합니다.
              </div>
            </div>
            <Icon
              icon={dataSource === 'generate' ? 'tick-circle' : 'circle'}
              size={18}
              intent={dataSource === 'generate' ? 'primary' : 'none'}
              className="datasource-card-check"
            />
          </div>
        </Card>

        <Card
          interactive
          selected={dataSource === 'load'}
          elevation={dataSource === 'load' ? Elevation.TWO : Elevation.ZERO}
          className="datasource-card"
          onClick={() => setDataSource('load')}
        >
          <div className="datasource-card-content">
            <div className="datasource-card-icon">
              <Icon
                icon="database"
                size={24}
                intent={dataSource === 'load' ? 'primary' : 'none'}
              />
            </div>
            <div className="datasource-card-text">
              <div className="datasource-card-title">저장된 데이터 불러오기</div>
              <div className="datasource-card-desc">
                사전에 준비된 공격 데이터셋을 선택하여 테스트를 진행합니다.
              </div>
            </div>
            <Icon
              icon={dataSource === 'load' ? 'tick-circle' : 'circle'}
              size={18}
              intent={dataSource === 'load' ? 'primary' : 'none'}
              className="datasource-card-check"
            />
          </div>
        </Card>
      </div>

      {/* 저장된 데이터 서브옵션 */}
      {isLoadMode && (
        <div className="datasource-sub animate-fade-in">
          <Divider style={{ margin: '20px 0' }} />

          <RadioGroup
            onChange={(e) => {
              const val = (e.target as HTMLInputElement).value as 'latest' | 'fixed';
              setDatasetSubOption(val);
              setDatasetId(null);
            }}
            selectedValue={datasetSubOption || ''}
          >
            <Radio value="latest" label="가장 최근 데이터셋" />
            {kind === 'latest' && (
              <DatasetList
                isLoading={latestQuery.isLoading}
                isError={latestQuery.isError}
                data={latestQuery.data ?? []}
                selectedDatasetId={selectedDatasetId}
                onSelect={setDatasetId}
              />
            )}

            <Radio value="fixed" label="고정 데이터셋" style={{ marginTop: 12 }} />
            {kind === 'fixed' && (
              <DatasetList
                isLoading={fixedQuery.isLoading}
                isError={fixedQuery.isError}
                data={fixedQuery.data ?? []}
                selectedDatasetId={selectedDatasetId}
                onSelect={setDatasetId}
              />
            )}
          </RadioGroup>
        </div>
      )}
    </div>
  );
}

interface DatasetListProps {
  isLoading: boolean;
  isError: boolean;
  data: Dataset[];
  selectedDatasetId: string | null;
  onSelect: (id: string) => void;
}

function DatasetList({
  isLoading,
  isError,
  data,
  selectedDatasetId,
  onSelect,
}: DatasetListProps) {
  if (isLoading) {
    return (
      <div className="dataset-empty-state">
        <Spinner size={SpinnerSize.SMALL} />
        <span>데이터셋을 불러오는 중...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="dataset-empty-state">
        <Icon icon="warning-sign" size={16} />
        <span>데이터셋을 불러오지 못했습니다.</span>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="dataset-empty-state">
        <Icon icon="database" size={16} />
        <span>해당 공격 종류에 맞는 데이터셋이 없습니다.</span>
      </div>
    );
  }

  return (
    <div className="dataset-list">
      {data.map((ds) => (
        <Card
          key={ds.id}
          interactive
          selected={selectedDatasetId === ds.id}
          compact
          className="dataset-list-item"
          onClick={() => onSelect(ds.id)}
        >
          <div className="dataset-list-content">
            <div className="dataset-list-left">
              <Icon
                icon={selectedDatasetId === ds.id ? 'tick-circle' : 'circle'}
                size={16}
                intent={selectedDatasetId === ds.id ? 'primary' : 'none'}
              />
              <span className="dataset-list-name">{ds.name}</span>
            </div>
            <div className="dataset-list-right">
              <Tag minimal round>
                {ds.type}
              </Tag>
              <span className="dataset-list-size">{ds.size}</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
