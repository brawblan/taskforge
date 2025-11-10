import { QUERY_KEYS } from './KEYS';
import { GET } from '@/utilities/fetch';

export const getHealthQueryOptions = () => ({
  queryKey: [QUERY_KEYS.HEALTH],
  queryFn: async () =>
    await GET<{ ok: boolean; timestamp: string; message: string }>('/health'),
});
