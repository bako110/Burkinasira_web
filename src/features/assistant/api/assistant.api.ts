import { apiClient } from '../../../shared/api/client';
import type { AIConversation, AIConversationSummary, SendMessagePayload } from '../types';

export async function sendMessage(payload: SendMessagePayload): Promise<AIConversation> {
  const { data } = await apiClient.post<AIConversation>('/ai/messages', payload);
  return data;
}

export async function fetchMyConversations(): Promise<AIConversationSummary[]> {
  const { data } = await apiClient.get<AIConversationSummary[]>('/ai/conversations');
  return data;
}

export async function fetchConversation(conversationId: string): Promise<AIConversation> {
  const { data } = await apiClient.get<AIConversation>(`/ai/conversations/${conversationId}`);
  return data;
}
