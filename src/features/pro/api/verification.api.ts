import { apiClient } from '../../../shared/api/client';
import type { SubmitVerificationPayload, VerificationRequest } from '../types';

export async function fetchMyVerificationRequests(): Promise<VerificationRequest[]> {
  const { data } = await apiClient.get<VerificationRequest[]>('/verified/verification-requests/me');
  return data;
}

export async function submitVerificationRequest(payload: SubmitVerificationPayload): Promise<VerificationRequest> {
  const { data } = await apiClient.post<VerificationRequest>('/verified/verification-requests', payload);
  return data;
}
