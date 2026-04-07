export type DatasetType = 'image_patch' | 'audio_noise' | 'noise_tensor';

export interface Dataset {
  id: string;
  name: string;
  type: string;
  datasetType: DatasetType;
  size: string;
  usage: number;
  createdAt: string;
}
