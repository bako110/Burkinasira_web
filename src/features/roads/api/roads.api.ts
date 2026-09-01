import { apiClient } from '../../../shared/api/client';
import type {
  BreakdownReport,
  ReportBreakdownPayload,
  RoadServiceDetail,
  RoadServiceFilters,
  RoadServiceSummary,
} from '../types';

export interface RoadServiceListResponse {
  items: RoadServiceSummary[];
  total: number;
  page: number;
  page_size: number;
}

export async function fetchRoadServices(
  filters: RoadServiceFilters = {},
): Promise<RoadServiceListResponse> {
  const { data } = await apiClient.get<RoadServiceListResponse>('/roads', {
    params: filters,
  });
  return data;
}

export async function fetchRoadServiceById(serviceId: string): Promise<RoadServiceDetail> {
  const { data } = await apiClient.get<RoadServiceDetail>(`/roads/${serviceId}`);
  return data;
}

export async function reportBreakdown(payload: ReportBreakdownPayload): Promise<BreakdownReport> {
  const { data } = await apiClient.post<BreakdownReport>('/roads/breakdowns', payload);
  return data;
}

export async function fetchMyBreakdowns(): Promise<BreakdownReport[]> {
  const { data } = await apiClient.get<BreakdownReport[]>('/roads/breakdowns/me');
  return data;
}
