export type ConversationKind =
  | 'touriste_guide'
  | 'touriste_hotel'
  | 'touriste_restaurant'
  | 'touriste_artisan'
  | 'entreprise_prestataire'
  | 'support_client'
  | 'groupe_voyageurs';

export interface Conversation {
  id: string;
  kind: ConversationKind;
  participant_ids: string[];
  linked_booking_id?: string;
  group_id?: string;
  last_message_preview?: string;
  last_message_at?: string;
  created_at: string;
}

export type MessageAttachmentType = 'image' | 'document' | 'location';

export interface MessageAttachment {
  type: MessageAttachmentType;
  url?: string;
  latitude?: number;
  longitude?: number;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  content?: string;
  attachments: MessageAttachment[];
  read_by: string[];
  created_at: string;
}

export interface StartConversationPayload {
  kind: ConversationKind;
  other_user_id: string;
  linked_booking_id?: string;
  initial_message: string;
}

export interface SendMessagePayload {
  content?: string;
  attachments?: MessageAttachment[];
}

export interface ContactSupportPayload {
  subject: string;
  message: string;
}
