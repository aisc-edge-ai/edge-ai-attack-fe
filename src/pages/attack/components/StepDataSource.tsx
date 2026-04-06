import { useAttackWizardStore } from '@/stores/attackWizardStore';
import { useDatasets } from '@/hooks/useDatasets';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
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
    <div className="animate-[fadeIn_0.3s_ease-out_forwards] max-w-xl mx-auto">
      <h3 className="text-2xl font-bold mb-8 text-center text-foreground">
        공격 데이터 설정
      </h3>
      <Card>
        <CardContent className="pt-6 space-y-4">
          {/* 실시간 생성 */}
          <label
            className={cn(
              'flex items-start p-5 border rounded-lg cursor-pointer transition',
              dataSource === 'generate'
                ? 'border-primary bg-primary/10'
                : 'border-border hover:bg-muted'
            )}
            onClick={() => setDataSource('generate')}
          >
            <input
              type="radio"
              name="datasource"
              className="mt-1 mr-4 w-5 h-5 accent-primary"
              checked={dataSource === 'generate'}
              onChange={() => setDataSource('generate')}
            />
            <div className="flex flex-col">
              <span className="font-bold text-foreground mb-1">
                실시간 공격 데이터 생성
              </span>
              <span className="text-sm text-muted-foreground">
                선택한 모델과 공격 기법에 맞춰 시스템이 자동으로 데이터를 생성합니다.
              </span>
            </div>
          </label>

          {/* 저장된 데이터 */}
          <label
            className={cn(
              'flex items-start p-5 border rounded-lg cursor-pointer transition',
              dataSource === 'load'
                ? 'border-primary bg-primary/10'
                : 'border-border hover:bg-muted'
            )}
            onClick={() => setDataSource('load')}
          >
            <input
              type="radio"
              name="datasource"
              className="mt-1 mr-4 w-5 h-5 accent-primary"
              checked={dataSource === 'load'}
              onChange={() => setDataSource('load')}
            />
            <div className="flex flex-col">
              <span className="font-bold text-foreground mb-1">
                저장된 데이터 불러오기
              </span>
              <span className="text-sm text-muted-foreground">
                사전에 준비된 공격 데이터셋을 선택하여 테스트를 진행합니다.
              </span>
            </div>
          </label>

          {/* 저장된 데이터 서브옵션 */}
          {dataSource === 'load' && (
            <div className="animate-[fadeIn_0.3s_ease-out_forwards] border-t border-border pt-5 space-y-4">
              <RadioGroup
                value={datasetSubOption || ''}
                onValueChange={(val) => {
                  setDatasetSubOption(val as 'latest' | 'fixed');
                  if (val === 'latest' && latestDataset) {
                    setDatasetId(latestDataset.id);
                  } else {
                    setDatasetId(null);
                  }
                }}
              >
                <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted">
                  <RadioGroupItem value="latest" id="ds-latest" className="mt-0.5" />
                  <Label htmlFor="ds-latest" className="cursor-pointer flex-1">
                    <div className="font-semibold text-foreground">가장 최근 데이터셋</div>
                    {latestDataset ? (
                      <div className="mt-1 text-sm text-muted-foreground bg-muted p-2 rounded border border-border">
                        {latestDataset.name}{' '}
                        <span className="opacity-70">
                          ({latestDataset.createdAt} · {latestDataset.size})
                        </span>
                      </div>
                    ) : (
                      <div className="mt-1 text-sm text-muted-foreground">
                        저장된 데이터셋이 없습니다.
                      </div>
                    )}
                  </Label>
                </div>

                <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted">
                  <RadioGroupItem value="fixed" id="ds-fixed" className="mt-0.5" />
                  <Label htmlFor="ds-fixed" className="cursor-pointer flex-1">
                    <div className="font-semibold text-foreground mb-2">고정 데이터셋</div>
                    {datasetSubOption === 'fixed' && datasets && (
                      <div className="space-y-1.5 animate-[fadeIn_0.3s_ease-out_forwards]">
                        {datasets.map((ds) => (
                          <div
                            key={ds.id}
                            onClick={(e) => {
                              e.preventDefault();
                              setDatasetId(ds.id);
                            }}
                            className={cn(
                              'flex items-center justify-between p-2.5 rounded border cursor-pointer transition text-sm',
                              selectedDatasetId === ds.id
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-border bg-muted hover:border-primary/50 text-foreground'
                            )}
                          >
                            <div>
                              <span className="font-medium">{ds.name}</span>
                              <span className="text-muted-foreground ml-2 text-xs">{ds.type}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">{ds.size}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
