export type NotificationCategory =
  | 'reservation_confirmation'
  | 'rappel_activite'
  | 'changement_horaire'
  | 'annulation'
  | 'alerte_securite'
  | 'alerte_meteo'
  | 'evenement_proximite'
  | 'promotion_personnalisee'
  | 'message_prestataire'
  | 'rappel_voyage';

export interface AppNotification {
  id: string;
  category: NotificationCategory;
  title: string;
  body: string;
  related_id?: string;
  is_read: boolean;
  created_at: string;
}

export interface NotificationPreferences {
  user_id: string;
  enabled_categories: NotificationCategory[];
  push_enabled: boolean;
  in_app_enabled: boolean;
}

export interface UpdatePreferencesPayload {
  enabled_categories?: NotificationCategory[];
  push_enabled?: boolean;
  in_app_enabled?: boolean;
}

export const ALL_NOTIFICATION_CATEGORIES: NotificationCategory[] = [
  'reservation_confirmation',
  'rappel_activite',
  'changement_horaire',
  'annulation',
  'alerte_securite',
  'alerte_meteo',
  'evenement_proximite',
  'promotion_personnalisee',
  'message_prestataire',
  'rappel_voyage',
];
