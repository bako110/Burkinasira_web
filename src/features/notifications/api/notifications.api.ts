import { apiClient } from '../../../shared/api/client';
import type { AppNotification, NotificationPreferences, UpdatePreferencesPayload } from '../types';

export async function fetchMyNotifications(unreadOnly = false): Promise<AppNotification[]> {
  const { data } = await apiClient.get<AppNotification[]>('/notifications', {
    params: unreadOnly ? { unread_only: true } : undefined,
  });
  return data;
}

export async function markNotificationAsRead(notificationId: string): Promise<AppNotification> {
  const { data } = await apiClient.post<AppNotification>(`/notifications/${notificationId}/read`);
  return data;
}

export async function markAllNotificationsAsRead(): Promise<void> {
  await apiClient.post('/notifications/read-all');
}

export async function deleteNotification(notificationId: string): Promise<void> {
  await apiClient.delete(`/notifications/${notificationId}`);
}

export async function fetchMyNotificationPreferences(): Promise<NotificationPreferences> {
  const { data } = await apiClient.get<NotificationPreferences>('/notifications/preferences/me');
  return data;
}

export async function updateMyNotificationPreferences(
  payload: UpdatePreferencesPayload,
): Promise<NotificationPreferences> {
  const { data } = await apiClient.patch<NotificationPreferences>('/notifications/preferences/me', payload);
  return data;
}
