import type { AttackResult } from '@/types';

export function isImagenetResult(result: AttackResult): boolean {
  return (
    result.modelType === 'imagenet' ||
    result.modelType === 'ImageNet 적대적 공격' ||
    result.modelType?.startsWith('ImageNet') ||
    false
  );
}
