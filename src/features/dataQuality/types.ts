export interface ReportDataErrorPayload {
  item_type: string;
  item_id: string;
  description: string;
}

export interface DataErrorReport {
  id: string;
  reporter_id: string;
  item_type: string;
  item_id: string;
  description: string;
  status: 'reported' | 'reviewing' | 'corrected' | 'dismissed';
  created_at: string;
}
