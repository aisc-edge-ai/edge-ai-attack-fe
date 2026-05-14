export type DatasetType = 'image_patch' | 'audio_noise' | 'noise_tensor';

export type DatasetCategory = 'image' | 'voice';

export interface Dataset {
  id: string;
  name: string;
  type: string;
  datasetType: DatasetType;
  size: string;
  usage: number;
  createdAt: string;
  /** 모달리티 분류 — voice 면 음성 attack(atk-rtvc 등) 흐름에서만 노출 */
  category?: DatasetCategory;
}
