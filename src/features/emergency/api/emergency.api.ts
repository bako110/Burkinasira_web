import { apiClient } from '../../../shared/api/client';
import type {
  EmergencyContact,
  SecurityAlert,
  TriggerSOSPayload,
  SOSAlertResult,
  ReportIncidentPayload,
  IncidentReportResult,
} from '../types';

export async function fetchEmergencyContacts(region?: string): Promise<EmergencyContact[]> {
  const { data } = await apiClient.get<EmergencyContact[]>('/emergency-services/contacts', {
    params: region ? { region } : undefined,
  });
  return data;
}

export async function fetchSecurityAlerts(region?: string): Promise<SecurityAlert[]> {
  const { data } = await apiClient.get<SecurityAlert[]>('/security-alerts', {
    params: region ? { region } : undefined,
  });
  return data;
}

export async function triggerSOS(payload: TriggerSOSPayload): Promise<SOSAlertResult> {
  const { data } = await apiClient.post<SOSAlertResult>('/emergency-services/sos', payload);
  return data;
}

export async function reportIncident(payload: ReportIncidentPayload): Promise<IncidentReportResult> {
  const { data } = await apiClient.post<IncidentReportResult>('/security-alerts/incidents', payload);
  return data;
}
