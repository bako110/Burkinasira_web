import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  fetchReceivedReports,
  fetchReceivedReportsCount,
  moderateReceivedReport,
} from '../api/dataQuality.api';
import type { DataErrorReportStatus, ModerateReportPayload } from '../types';

const RECEIVED_KEY = ['data-quality', 'received-reports'] as const;
const COUNT_KEY = ['data-quality', 'received-reports', 'count'] as const;

/** Liste des signalements reçus sur les fiches du prestataire connecté. */
export function useReceivedReports(statusFilter?: DataErrorReportStatus) {
  return useQuery({
    queryKey: [...RECEIVED_KEY, statusFilter ?? 'all'],
    queryFn: () => fetchReceivedReports(statusFilter),
  });
}

/** Compteur de signalements non traités — alimente la pastille de nav pro. */
export function useReceivedReportsCount() {
  return useQuery({
    queryKey: COUNT_KEY,
    queryFn: fetchReceivedReportsCount,
    staleTime: 60_000,
  });
}

export function useModerateReceivedReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ModerateReportPayload }) =>
      moderateReceivedReport(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RECEIVED_KEY });
    },
  });
}
