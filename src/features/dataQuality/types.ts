export interface ReportDataErrorPayload {
  item_type: string;
  item_id: string;
  description: string;
}

export type DataErrorReportStatus = 'reported' | 'reviewing' | 'corrected' | 'dismissed';

export interface DataErrorReport {
  id: string;
  reporter_id: string;
  item_type: string;
  item_id: string;
  description: string;
  status: DataErrorReportStatus;
  created_at: string;
}

export interface ModerateReportPayload {
  status: DataErrorReportStatus;
}
