import { useMutation } from '@tanstack/react-query';

import { triggerSOS } from '../api/emergency.api';

export function useTriggerSOS() {
  return useMutation({
    mutationFn: triggerSOS,
  });
}
