import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';

import '../i18n/config';
import { ToastViewport } from '../shared/ui';
import { queryClient } from '../shared/queryClient';
import { router } from './routes/router';

export function AppProviders() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ToastViewport />
    </QueryClientProvider>
  );
}
