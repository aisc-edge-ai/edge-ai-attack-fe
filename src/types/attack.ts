import type { ModelType } from './model';

export interface AttackCategory {
  id: string;
  name: string;
  children: AttackType[];
}

export interface AttackType {
  id: string;
  name: string;
  categoryId: string;
}

export interface AttackExecuteRequest {
  modelType: ModelType;
  attackTypeIds: string[];
  dataSource: 'generate' | 'load';
  datasetId?: string;
}

export interface AttackProgress {
  attackId: string;
  status: 'preparing' | 'running' | 'saving' | 'completed' | 'failed';
  progress: number;
  total: number;
  currentStep: string;
  eta?: number;
}
