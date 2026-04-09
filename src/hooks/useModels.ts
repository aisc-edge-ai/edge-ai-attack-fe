import { useQuery } from '@tanstack/react-query';
import { modelsApi } from '@/api/models';

export function useModels() {
  return useQuery({
    queryKey: ['models'],
    queryFn: modelsApi.getModels,
  });
}
