export type AIConversationType =
  | 'general'
  | 'itinerary'
  | 'translation'
  | 'cultural_summary'
  | 'pro_writing_help'
  | 'business_planning';

export type MessageRole = 'user' | 'assistant';

export interface AIMessage {
  role: MessageRole;
  content: string;
  created_at: string;
}

export interface AIConversation {
  id: string;
  type: AIConversationType;
  title?: string;
  messages: AIMessage[];
  updated_at: string;
}

export interface AIConversationSummary {
  id: string;
  type: AIConversationType;
  title?: string;
  updated_at: string;
}

export interface SendMessagePayload {
  conversation_id?: string;
  type?: AIConversationType;
  message: string;
  context?: Record<string, unknown>;
}
