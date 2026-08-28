import { useQuery } from '@tanstack/react-query';

import { fetchProductById } from '../api/market.api';

export function useProductDetail(productId: string | undefined) {
  return useQuery({
    queryKey: ['product-detail', productId],
    queryFn: () => fetchProductById(productId!),
    enabled: Boolean(productId),
    retry: false,
  });
}
