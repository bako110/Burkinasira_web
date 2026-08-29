import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';

import '../i18n/config';
import { ToastViewport } from '../shared/ui';
import { router } from './routes/router';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
    },
  },
});

export function AppProviders() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ToastViewport />
    </QueryClientProvider>
  );
}
