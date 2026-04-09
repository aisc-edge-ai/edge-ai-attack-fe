import { useAttackWizardStore } from '@/stores/attackWizardStore';
import { useDatasets } from '@/hooks/useDatasets';
import { Card, Elevation, Icon, Tag, Divider, RadioGroup, Radio } from '@blueprintjs/core';

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
    <div className="animate-fade-in">
      <h5 className="bp6-heading" style={{ marginBottom: 20 }}>공격 데이터 설정</h5>

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
      {dataSource === 'load' && (
        <div className="datasource-sub animate-fade-in">
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
              <Card compact className="dataset-info-card">
                <div className="dataset-info-content">
                  <Icon icon="document" size={16} />
                  <div>
                    <div className="dataset-info-name">{latestDataset.name}</div>
                    <div className="dataset-info-meta">
                      <Tag minimal round>{latestDataset.createdAt}</Tag>
                      <Tag minimal round>{latestDataset.size}</Tag>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            <Radio value="fixed" label="고정 데이터셋" style={{ marginTop: 12 }} />
            {datasetSubOption === 'fixed' && datasets && (
              <div className="dataset-list">
                {datasets.map((ds) => (
                  <Card
                    key={ds.id}
                    interactive
                    selected={selectedDatasetId === ds.id}
                    compact
                    className="dataset-list-item"
                    onClick={() => setDatasetId(ds.id)}
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
                        <Tag minimal round>{ds.type}</Tag>
                        <span className="dataset-list-size">{ds.size}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </RadioGroup>
        </div>
      )}
    </div>
  );
}
