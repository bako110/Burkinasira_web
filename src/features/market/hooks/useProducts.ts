import { useQuery } from '@tanstack/react-query';

import { fetchProducts } from '../api/market.api';
import type { ProductFilters } from '../types';

export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: ['market-products', filters],
    queryFn: () => fetchProducts(filters),
  });
}
