import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createOrder,
  fetchMyOrders,
  fetchProductById,
  fetchReceivedOrders,
  quoteDeliveryFee,
  updateOrderStatus,
} from '../api/market.api';
import type { Order, ProductCategory, UpdateOrderStatusPayload } from '../types';

export interface OrderWithProduct extends Order {
  product_name?: string;
  product_photo?: string;
  product_category?: ProductCategory;
}

async function attachProductInfo(orders: Order[]): Promise<OrderWithProduct[]> {
  const uniqueProductIds = Array.from(new Set(orders.map((o) => o.product_id)));
  const products = await Promise.all(uniqueProductIds.map((id) => fetchProductById(id).catch(() => null)));
  const productById = new Map(
    products.filter((p): p is NonNullable<typeof p> => p !== null).map((p) => [p.id, p]),
  );
  return orders.map((order) => {
    const product = productById.get(order.product_id);
    return {
      ...order,
      product_name: product?.name,
      product_photo: product?.photos?.[0],
      product_category: product?.category,
    };
  });
}

export function useMyOrders() {
  return useQuery({
    queryKey: ['my-orders'],
    queryFn: async (): Promise<OrderWithProduct[]> => attachProductInfo(await fetchMyOrders()),
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-orders'] }),
  });
}

export function useReceivedOrders(statusFilter?: string) {
  return useQuery({
    queryKey: ['received-orders', statusFilter],
    queryFn: async (): Promise<OrderWithProduct[]> => attachProductInfo(await fetchReceivedOrders(statusFilter)),
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, payload }: { orderId: string; payload: UpdateOrderStatusPayload }) =>
      updateOrderStatus(orderId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['received-orders'] }),
  });
}

/**
 * Estime les frais de livraison pour une région de destination et un sous-total.
 * Désactivé tant que la région n'est pas renseignée. Le résultat sert d'aperçu ;
 * le backend recalcule et fige les frais à la création de chaque commande.
 */
export function useDeliveryFeeQuote(region: string | undefined, subtotal: number) {
  return useQuery({
    queryKey: ['delivery-fee-quote', region, subtotal],
    queryFn: () => quoteDeliveryFee({ region: region as string, subtotal }),
    enabled: Boolean(region) && subtotal > 0,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}
