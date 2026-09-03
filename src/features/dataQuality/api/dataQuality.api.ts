import { apiClient } from '../../../shared/api/client';
import type {
  DataErrorReport,
  DataErrorReportStatus,
  ModerateReportPayload,
  ReportDataErrorPayload,
} from '../types';

export async function reportDataError(payload: ReportDataErrorPayload): Promise<DataErrorReport> {
  const { data } = await apiClient.post<DataErrorReport>('/data-quality/error-reports', payload);
  return data;
}

/** Signalements portant sur les fiches du prestataire connecté. */
export async function fetchReceivedReports(
  statusFilter?: DataErrorReportStatus,
): Promise<DataErrorReport[]> {
  const { data } = await apiClient.get<DataErrorReport[]>('/data-quality/error-reports/received', {
    params: statusFilter ? { status_filter: statusFilter } : undefined,
  });
  return data;
}

/** Nombre de signalements non traités sur mes fiches (pastille de nav). */
export async function fetchReceivedReportsCount(): Promise<number> {
  const { data } = await apiClient.get<number>('/data-quality/error-reports/received/count');
  return data;
}

export async function moderateReceivedReport(
  reportId: string,
  payload: ModerateReportPayload,
): Promise<DataErrorReport> {
  const { data } = await apiClient.patch<DataErrorReport>(
    `/data-quality/error-reports/received/${reportId}`,
    payload,
  );
  return data;
}
