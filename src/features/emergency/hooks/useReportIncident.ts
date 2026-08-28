import { useMutation } from '@tanstack/react-query';

import { reportIncident } from '../api/emergency.api';

export function useReportIncident() {
  return useMutation({
    mutationFn: reportIncident,
  });
}
