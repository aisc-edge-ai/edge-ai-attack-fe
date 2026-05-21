import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { HotkeysProvider } from '@blueprintjs/core';
import { AppErrorBoundary } from '@/components/shared/AppErrorBoundary';
import { STALE_TIME_DEFAULT } from '@/lib/query-config';
import { router } from './routes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: STALE_TIME_DEFAULT,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export function Providers() {
  return (
    <AppErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <HotkeysProvider>
          <RouterProvider router={router} />
        </HotkeysProvider>
      </QueryClientProvider>
    </AppErrorBoundary>
  );
}
