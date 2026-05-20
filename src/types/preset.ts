import type { ModelType } from './model';

export interface Preset {
  id: string;
  name: string;
  description: string;
  modelType: ModelType;
  modelId: string;
  modelName: string;
  attackTypeIds: string[];
  dataSource: 'generate' | 'load';
  datasetIds: string[];
  datasetNames: string[];
  createdAt: string;
  updatedAt: string;
}

export type PresetFormValues = Omit<Preset, 'id' | 'createdAt' | 'updatedAt'>;
