import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createOrder, fetchMyOrders } from '../api/market.api';

export function useMyOrders() {
  return useQuery({
    queryKey: ['my-orders'],
    queryFn: fetchMyOrders,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-orders'] }),
  });
}
