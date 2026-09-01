import { apiClient } from '../../../shared/api/client';
import type {
  AddEventParticipantPayload,
  CreateQuotePayload,
  EventParticipant,
  QuoteRequest,
} from '../types';

export async function createQuoteRequest(payload: CreateQuotePayload): Promise<QuoteRequest> {
  const { data } = await apiClient.post<QuoteRequest>('/business/quotes', payload);
  return data;
}

export async function fetchMyQuoteRequests(): Promise<QuoteRequest[]> {
  const { data } = await apiClient.get<QuoteRequest[]>('/business/quotes/me');
  return data;
}

export async function fetchQuoteRequestById(quoteId: string): Promise<QuoteRequest> {
  const { data } = await apiClient.get<QuoteRequest>(`/business/quotes/${quoteId}`);
  return data;
}

export async function addEventParticipant(
  quoteId: string,
  payload: AddEventParticipantPayload,
): Promise<EventParticipant> {
  const { data } = await apiClient.post<EventParticipant>(`/business/quotes/${quoteId}/participants`, payload);
  return data;
}

export async function fetchEventParticipants(quoteId: string): Promise<EventParticipant[]> {
  const { data } = await apiClient.get<EventParticipant[]>(`/business/quotes/${quoteId}/participants`);
  return data;
}

export async function removeEventParticipant(participantId: string): Promise<void> {
  await apiClient.delete(`/business/participants/${participantId}`);
}
