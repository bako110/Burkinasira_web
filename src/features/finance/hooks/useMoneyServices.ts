import { useQuery } from '@tanstack/react-query';

import { fetchMoneyServices } from '../api/finance.api';
import type { MoneyServiceFilters } from '../types';

export function useMoneyServices(filters: MoneyServiceFilters = {}) {
  return useQuery({
    queryKey: ['money-services', filters],
    queryFn: () => fetchMoneyServices(filters),
  });
}
