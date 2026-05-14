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
  Button,
} from '@blueprintjs/core';
import type { Dataset } from '@/types';

export function StepDataSource() {
  const {
    dataSource,
    setDataSource,
    datasetSubOption,
    setDatasetSubOption,
    selectedDatasetIds,
    selectedAttackIds,
    selectedModelType,
    toggleDatasetId,
    selectAllDatasets,
    clearDatasets,
    setHoveredDatasetId,
  } = useAttackWizardStore();

  const isLoadMode = dataSource === 'load';
  const kind = datasetSubOption ?? null;

  const latestQuery = useVisualizationDatasets({
    modelType: selectedModelType,
    attackTypeIds: selectedAttackIds,
    kind: 'latest',
    enabled: isLoadMode && kind === 'latest',
  });
  const fixedQuery = useVisualizationDatasets({
    modelType: selectedModelType,
    attackTypeIds: selectedAttackIds,
    kind: 'fixed',
    enabled: isLoadMode && kind === 'fixed',
  });

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
            }}
            selectedValue={datasetSubOption || ''}
          >
            <Radio value="latest" label="가장 최근 데이터셋" />
            {kind === 'latest' && (
              <DatasetMultiList
                isLoading={latestQuery.isLoading}
                isError={latestQuery.isError}
                data={latestQuery.data ?? []}
                selectedIds={selectedDatasetIds}
                onToggle={toggleDatasetId}
                onSelectAll={selectAllDatasets}
                onClear={clearDatasets}
                onHover={setHoveredDatasetId}
              />
            )}

            <Radio value="fixed" label="고정 데이터셋" style={{ marginTop: 12 }} />
            {kind === 'fixed' && (
              <DatasetMultiList
                isLoading={fixedQuery.isLoading}
                isError={fixedQuery.isError}
                data={fixedQuery.data ?? []}
                selectedIds={selectedDatasetIds}
                onToggle={toggleDatasetId}
                onSelectAll={selectAllDatasets}
                onClear={clearDatasets}
                onHover={setHoveredDatasetId}
              />
            )}
          </RadioGroup>
        </div>
      )}
    </div>
  );
}

interface DatasetMultiListProps {
  isLoading: boolean;
  isError: boolean;
  data: Dataset[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onSelectAll: (ids: string[]) => void;
  onClear: () => void;
  onHover?: (id: string | null) => void;
}

function DatasetMultiList({
  isLoading,
  isError,
  data,
  selectedIds,
  onToggle,
  onSelectAll,
  onClear,
  onHover,
}: DatasetMultiListProps) {
  // 데이터 도착 후 첫 진입 시 디폴트 전체 선택 (selectedIds === [] 가드)
  // deps 에 selectedIds 절대 추가 금지 — 무한 토글 방지
  useEffect(() => {
    if (data.length > 0 && selectedIds.length === 0) {
      onSelectAll(data.map((d) => d.id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

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

  const allSelected = data.every((d) => selectedIds.includes(d.id));

  return (
    <>
      <div className="dataset-multi-header">
        <Tag minimal round intent="primary">
          {selectedIds.length} / {data.length} 선택됨
        </Tag>
        <Button
          minimal
          small
          icon={allSelected ? 'cross' : 'tick'}
          text={allSelected ? '전체 해제' : '전체 선택'}
          onClick={() => (allSelected ? onClear() : onSelectAll(data.map((d) => d.id)))}
        />
      </div>
      <div className="dataset-list">
        {data.map((ds) => {
          const checked = selectedIds.includes(ds.id);
          return (
            <Card
              key={ds.id}
              interactive
              selected={checked}
              compact
              className="dataset-list-item"
              onClick={() => onToggle(ds.id)}
              onMouseEnter={() => onHover?.(ds.id)}
              onMouseLeave={() => onHover?.(null)}
            >
              <div className="dataset-list-content">
                <div className="dataset-list-left">
                  <Icon
                    icon={checked ? 'tick-circle' : 'circle'}
                    size={16}
                    intent={checked ? 'primary' : 'none'}
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
          );
        })}
      </div>
    </>
  );
}
