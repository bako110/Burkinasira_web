import { useQuery } from '@tanstack/react-query';

import { fetchEmergencyContacts } from '../api/emergency.api';

export function useEmergencyContacts(region?: string) {
  return useQuery({
    queryKey: ['emergency-contacts', region],
    queryFn: () => fetchEmergencyContacts(region),
  });
}
