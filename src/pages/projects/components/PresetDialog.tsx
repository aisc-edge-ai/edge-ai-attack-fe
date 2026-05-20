import { useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogBody,
  DialogFooter,
  FormGroup,
  InputGroup,
  TextArea,
  HTMLSelect,
  Checkbox,
  RadioGroup,
  Radio,
  Button,
  Intent,
} from '@blueprintjs/core';
import type { Preset, PresetFormValues } from '@/types';
import {
  SUPPORTED_MODEL_TYPES,
  SUPPORTED_ATTACK_TYPE_IDS,
  MODEL_TYPE_LABELS,
  ATTACK_TYPE_LABELS,
} from '@/lib/constants';
import { MOCK_MODELS_FOR_PRESETS, MOCK_DATASETS_FOR_PRESETS } from '@/lib/mock-data';
import { useCreatePreset, useUpdatePreset } from '@/hooks/usePresets';

const presetSchema = z.object({
  name: z.string().min(1, '프리셋 이름을 입력하세요').max(50, '50자 이내로 입력하세요'),
  description: z.string().max(200, '200자 이내로 입력하세요'),
  modelType: z.enum(['cctv', 'voice', 'autonomous', 'classification', 'imagenet'], {
    error: '모델 유형을 선택하세요',
  }),
  modelId: z.string().min(1, '모델을 선택하세요'),
  modelName: z.string().min(1),
  attackTypeIds: z.array(z.string()).min(1, '최소 1개 공격 기법을 선택하세요'),
  dataSource: z.enum(['generate', 'load']),
  datasetIds: z.array(z.string()),
  datasetNames: z.array(z.string()),
}).refine(
  (data) => data.dataSource === 'generate' || data.datasetIds.length > 0,
  { message: '데이터셋을 1개 이상 선택하세요', path: ['datasetIds'] },
);

type FormData = z.infer<typeof presetSchema>;

interface PresetDialogProps {
  mode: 'closed' | 'create' | 'edit';
  preset: Preset | null;
  onClose: () => void;
}

const EMPTY_VALUES: FormData = {
  name: '',
  description: '',
  modelType: 'cctv',
  modelId: '',
  modelName: '',
  attackTypeIds: [],
  dataSource: 'generate',
  datasetIds: [],
  datasetNames: [],
};

const DATASET_CATEGORY_BY_MODEL_TYPE: Record<string, string> = {
  cctv: 'image',
  voice: 'voice',
  classification: 'tensor',
};

export function PresetDialog({ mode, preset, onClose }: PresetDialogProps) {
  const isOpen = mode !== 'closed';
  const isEdit = mode === 'edit';

  const createMutation = useCreatePreset();
  const updateMutation = useUpdatePreset();

  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(presetSchema),
    defaultValues: EMPTY_VALUES as FormData,
  });

  useEffect(() => {
    if (mode === 'edit' && preset) {
      reset({
        name: preset.name,
        description: preset.description,
        modelType: preset.modelType,
        modelId: preset.modelId,
        modelName: preset.modelName,
        attackTypeIds: [...preset.attackTypeIds],
        dataSource: preset.dataSource,
        datasetIds: [...preset.datasetIds],
        datasetNames: [...preset.datasetNames],
      });
    } else if (mode === 'create') {
      reset(EMPTY_VALUES);
    }
  }, [mode, preset, reset]);

  const watchedModelType = watch('modelType');
  const watchedDataSource = watch('dataSource');
  const watchedAttackIds = watch('attackTypeIds');
  const watchedDatasetIds = watch('datasetIds');
  const watchedDatasetNames = watch('datasetNames');

  const filteredModels = useMemo(
    () => MOCK_MODELS_FOR_PRESETS.filter((m) => m.modelType === watchedModelType),
    [watchedModelType],
  );

  const filteredAttacks = useMemo(() => {
    const modelTypeAttackMap: Record<string, string[]> = {
      cctv: ['atk-hiding', 'atk-altering', 'atk-creating'],
      voice: ['atk-rtvc', 'atk-tortoise', 'atk-yourtts', 'atk-avc'],
      classification: ['atk-mtc'],
    };
    const allowed = modelTypeAttackMap[watchedModelType] ?? [];
    return SUPPORTED_ATTACK_TYPE_IDS.filter((id) => allowed.includes(id));
  }, [watchedModelType]);

  const filteredDatasets = useMemo(() => {
    const category = DATASET_CATEGORY_BY_MODEL_TYPE[watchedModelType];
    return MOCK_DATASETS_FOR_PRESETS.filter((d) => !category || d.category === category);
  }, [watchedModelType]);

  const handleModelTypeChange = (newType: string) => {
    setValue('modelType', newType as FormData['modelType']);
    setValue('modelId', '');
    setValue('modelName', '');
    setValue('attackTypeIds', []);
    setValue('datasetIds', []);
    setValue('datasetNames', []);
  };

  const toggleAttack = (id: string) => {
    const current = watchedAttackIds;
    if (current.includes(id)) {
      setValue('attackTypeIds', current.filter((a) => a !== id));
    } else {
      setValue('attackTypeIds', [...current, id]);
    }
  };

  const toggleDataset = (dsId: string, dsName: string) => {
    const currentIds = watchedDatasetIds;
    const currentNames = watchedDatasetNames;
    if (currentIds.includes(dsId)) {
      setValue('datasetIds', currentIds.filter((d) => d !== dsId));
      setValue('datasetNames', currentNames.filter((n) => n !== dsName));
    } else {
      setValue('datasetIds', [...currentIds, dsId]);
      setValue('datasetNames', [...currentNames, dsName]);
    }
  };

  const onSubmit = async (data: FormData) => {
    const values: PresetFormValues = data;
    if (isEdit && preset) {
      await updateMutation.mutateAsync({ id: preset.id, values });
    } else {
      await createMutation.mutateAsync(values);
    }
    onClose();
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? '프리셋 수정' : '새 프리셋'}
      icon="cog"
      className="preset-dialog"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogBody>
          <div className="preset-dialog-body">
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <FormGroup
                  label="프리셋 이름"
                  intent={errors.name ? Intent.DANGER : Intent.NONE}
                  helperText={errors.name?.message}
                >
                  <InputGroup
                    {...field}
                    placeholder="예: CCTV Patch Hiding"
                    intent={errors.name ? Intent.DANGER : Intent.NONE}
                  />
                </FormGroup>
              )}
            />

            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <FormGroup
                  label="설명"
                  intent={errors.description ? Intent.DANGER : Intent.NONE}
                  helperText={errors.description?.message}
                >
                  <TextArea
                    {...field}
                    fill
                    rows={2}
                    placeholder="프리셋에 대한 간단한 설명"
                    intent={errors.description ? Intent.DANGER : Intent.NONE}
                  />
                </FormGroup>
              )}
            />

            <div className="preset-dialog-field-row">
              <FormGroup
                label="모델 유형"
                intent={errors.modelType ? Intent.DANGER : Intent.NONE}
                helperText={errors.modelType?.message}
              >
                <HTMLSelect
                  value={watchedModelType}
                  onChange={(e) => handleModelTypeChange(e.target.value)}
                  fill
                >
                  {SUPPORTED_MODEL_TYPES.map((mt) => (
                    <option key={mt} value={mt}>
                      {MODEL_TYPE_LABELS[mt] ?? mt}
                    </option>
                  ))}
                </HTMLSelect>
              </FormGroup>

              <Controller
                name="modelId"
                control={control}
                render={({ field }) => (
                  <FormGroup
                    label="모델"
                    intent={errors.modelId ? Intent.DANGER : Intent.NONE}
                    helperText={errors.modelId?.message}
                  >
                    <HTMLSelect
                      value={field.value}
                      onChange={(e) => {
                        const selected = filteredModels.find((m) => m.id === e.target.value);
                        field.onChange(e.target.value);
                        setValue('modelName', selected?.name ?? '');
                      }}
                      fill
                    >
                      <option value="">모델 선택...</option>
                      {filteredModels.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                        </option>
                      ))}
                    </HTMLSelect>
                  </FormGroup>
                )}
              />
            </div>

            <FormGroup
              label="공격 기법"
              intent={errors.attackTypeIds ? Intent.DANGER : Intent.NONE}
              helperText={errors.attackTypeIds?.message}
            >
              <div className="preset-dialog-attack-list">
                {filteredAttacks.map((id) => (
                  <Checkbox
                    key={id}
                    label={ATTACK_TYPE_LABELS[id] ?? id}
                    checked={watchedAttackIds.includes(id)}
                    onChange={() => toggleAttack(id)}
                    style={{ marginBottom: 0 }}
                  />
                ))}
              </div>
            </FormGroup>

            <Controller
              name="dataSource"
              control={control}
              render={({ field }) => (
                <FormGroup label="데이터 소스">
                  <RadioGroup
                    selectedValue={field.value}
                    onChange={(e) => {
                      field.onChange((e.target as HTMLInputElement).value);
                      if ((e.target as HTMLInputElement).value === 'generate') {
                        setValue('datasetIds', []);
                        setValue('datasetNames', []);
                      }
                    }}
                    inline
                  >
                    <Radio label="자동 생성" value="generate" />
                    <Radio label="기존 데이터셋 사용" value="load" />
                  </RadioGroup>
                </FormGroup>
              )}
            />

            {watchedDataSource === 'load' && (
              <FormGroup
                label="데이터셋 선택"
                intent={errors.datasetIds ? Intent.DANGER : Intent.NONE}
                helperText={errors.datasetIds?.message}
              >
                <div className="preset-dialog-dataset-list">
                  {filteredDatasets.map((ds) => (
                    <Checkbox
                      key={ds.id}
                      label={ds.name}
                      checked={watchedDatasetIds.includes(ds.id)}
                      onChange={() => toggleDataset(ds.id, ds.name)}
                      style={{ marginBottom: 0 }}
                    />
                  ))}
                </div>
              </FormGroup>
            )}
          </div>
        </DialogBody>

        <DialogFooter
          actions={
            <>
              <Button text="취소" onClick={onClose} disabled={isSubmitting} />
              <Button
                text={isEdit ? '수정' : '생성'}
                intent={Intent.PRIMARY}
                type="submit"
                loading={isSubmitting}
              />
            </>
          }
        />
      </form>
    </Dialog>
  );
}
