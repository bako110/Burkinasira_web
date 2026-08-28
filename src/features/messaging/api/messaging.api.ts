import { apiClient } from '../../../shared/api/client';
import type {
  ChatMessage,
  Conversation,
  ContactSupportPayload,
  SendMessagePayload,
  StartConversationPayload,
} from '../types';

export async function fetchConversations(): Promise<Conversation[]> {
  const { data } = await apiClient.get<Conversation[]>('/messaging/conversations');
  return data;
}

export async function fetchConversation(conversationId: string): Promise<Conversation> {
  const { data } = await apiClient.get<Conversation>(`/messaging/conversations/${conversationId}`);
  return data;
}

export async function fetchMessages(conversationId: string): Promise<ChatMessage[]> {
  const { data } = await apiClient.get<ChatMessage[]>(`/messaging/conversations/${conversationId}/messages`);
  return data;
}

export async function sendMessage(conversationId: string, payload: SendMessagePayload): Promise<ChatMessage> {
  const { data } = await apiClient.post<ChatMessage>(
    `/messaging/conversations/${conversationId}/messages`,
    payload,
  );
  return data;
}

export async function startConversation(payload: StartConversationPayload): Promise<Conversation> {
  const { data } = await apiClient.post<Conversation>('/messaging/conversations', payload);
  return data;
}

export async function contactSupport(payload: ContactSupportPayload): Promise<Conversation> {
  const { data } = await apiClient.post<Conversation>('/messaging/support', payload);
  return data;
}
