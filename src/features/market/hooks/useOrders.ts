import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createOrder, fetchMyOrders, fetchProductById } from '../api/market.api';
import type { Order } from '../types';

export interface OrderWithProduct extends Order {
  product_name?: string;
  product_photo?: string;
}

export function useMyOrders() {
  return useQuery({
    queryKey: ['my-orders'],
    queryFn: async (): Promise<OrderWithProduct[]> => {
      const orders = await fetchMyOrders();
      const uniqueProductIds = Array.from(new Set(orders.map((o) => o.product_id)));
      const products = await Promise.all(
        uniqueProductIds.map((id) => fetchProductById(id).catch(() => null)),
      );
      const productById = new Map(
        products.filter((p): p is NonNullable<typeof p> => p !== null).map((p) => [p.id, p]),
      );
      return orders.map((order) => {
        const product = productById.get(order.product_id);
        return {
          ...order,
          product_name: product?.name,
          product_photo: product?.photos?.[0],
        };
      });
    },
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-orders'] }),
  });
}
