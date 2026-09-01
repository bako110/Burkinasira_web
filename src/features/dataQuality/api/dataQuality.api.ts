import { apiClient } from '../../../shared/api/client';
import type { DataErrorReport, ReportDataErrorPayload } from '../types';

export async function reportDataError(payload: ReportDataErrorPayload): Promise<DataErrorReport> {
  const { data } = await apiClient.post<DataErrorReport>('/data-quality/error-reports', payload);
  return data;
}
