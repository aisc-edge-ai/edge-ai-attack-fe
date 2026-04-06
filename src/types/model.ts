export type ModelType = 'cctv' | 'voice' | 'autonomous';
export type ModelStatus = 'active' | 'testing' | 'offline';

export interface Model {
  id: string;
  name: string;
  type: string;
  modelType: ModelType;
  framework: string;
  node: string;
  status: ModelStatus;
  registeredAt: string;
}
