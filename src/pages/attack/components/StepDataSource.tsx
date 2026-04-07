import { useAttackWizardStore } from '@/stores/attackWizardStore';
import { useDatasets } from '@/hooks/useDatasets';
import { Card, RadioGroup, Radio, Divider } from '@blueprintjs/core';
import { cn } from '@/lib/utils';

export function StepDataSource() {
  const {
    dataSource,
    setDataSource,
    datasetSubOption,
    setDatasetSubOption,
    selectedDatasetId,
    setDatasetId,
  } = useAttackWizardStore();

  const { data: datasets } = useDatasets({ sort: 'latest' });
  const latestDataset = datasets?.[0] || null;

  return (
    <div className="animate-fade-in" style={{ maxWidth: 480, margin: '0 auto' }}>
      <h3 style={{ textAlign: 'center', marginBottom: 32 }}>공격 데이터 설정</h3>
      <Card>
        {/* 데이터 소스 선택 */}
        <div
          className={cn('radio-card', dataSource === 'generate' && 'selected')}
          onClick={() => setDataSource('generate')}
        >
          <Radio
            checked={dataSource === 'generate'}
            onChange={() => setDataSource('generate')}
            style={{ margin: 0 }}
          />
          <div>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>실시간 공격 데이터 생성</div>
            <div className="bp6-text-muted" style={{ fontSize: 13 }}>
              선택한 모델과 공격 기법에 맞춰 시스템이 자동으로 데이터를 생성합니다.
            </div>
          </div>
        </div>

        <div
          className={cn('radio-card', dataSource === 'load' && 'selected')}
          onClick={() => setDataSource('load')}
          style={{ marginTop: 12 }}
        >
          <Radio
            checked={dataSource === 'load'}
            onChange={() => setDataSource('load')}
            style={{ margin: 0 }}
          />
          <div>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>저장된 데이터 불러오기</div>
            <div className="bp6-text-muted" style={{ fontSize: 13 }}>
              사전에 준비된 공격 데이터셋을 선택하여 테스트를 진행합니다.
            </div>
          </div>
        </div>

        {/* 저장된 데이터 서브옵션 */}
        {dataSource === 'load' && (
          <>
            <Divider style={{ margin: '20px 0' }} />
            <RadioGroup
              onChange={(e) => {
                const val = (e.target as HTMLInputElement).value as 'latest' | 'fixed';
                setDatasetSubOption(val);
                if (val === 'latest' && latestDataset) {
                  setDatasetId(latestDataset.id);
                } else {
                  setDatasetId(null);
                }
              }}
              selectedValue={datasetSubOption || ''}
            >
              <Radio value="latest" label="가장 최근 데이터셋" />
              {latestDataset && datasetSubOption === 'latest' && (
                <div className="bp6-text-muted" style={{ marginLeft: 28, fontSize: 13, marginBottom: 8 }}>
                  {latestDataset.name} ({latestDataset.createdAt} · {latestDataset.size})
                </div>
              )}

              <Radio value="fixed" label="고정 데이터셋" />
              {datasetSubOption === 'fixed' && datasets && (
                <div style={{ marginLeft: 28, marginTop: 8 }}>
                  {datasets.map((ds) => (
                    <div
                      key={ds.id}
                      className={cn('dataset-item', selectedDatasetId === ds.id && 'selected')}
                      onClick={() => setDatasetId(ds.id)}
                      style={{ marginBottom: 6 }}
                    >
                      <div>
                        <span style={{ fontWeight: 500 }}>{ds.name}</span>
                        <span className="bp6-text-muted" style={{ marginLeft: 8, fontSize: 12 }}>{ds.type}</span>
                      </div>
                      <span className="bp6-text-muted" style={{ fontSize: 12 }}>{ds.size}</span>
                    </div>
                  ))}
                </div>
              )}
            </RadioGroup>
          </>
        )}
      </Card>
    </div>
  );
}
