import { useMutation } from '@tanstack/react-query';

import { reportDataError } from '../api/dataQuality.api';

export function useReportDataError() {
  return useMutation({
    mutationFn: reportDataError,
  });
}
