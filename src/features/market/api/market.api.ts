import { apiClient } from '../../../shared/api/client';
import type { PaginatedResponse } from '../../../shared/api/types';
import type {
  ArtisanFilters,
  ArtisanSummary,
  CreateOrderPayload,
  DeliveryFeeQuote,
  DeliveryFeeQuoteRequest,
  Order,
  ProductDetail,
  ProductFilters,
  ProductSummary,
  UpdateOrderStatusPayload,
} from '../types';

export async function fetchProducts(filters: ProductFilters = {}): Promise<PaginatedResponse<ProductSummary>> {
  const { data } = await apiClient.get<PaginatedResponse<ProductSummary>>('/market/products', {
    params: filters,
  });
  return data;
}

export async function fetchProductById(productId: string): Promise<ProductDetail> {
  const { data } = await apiClient.get<ProductDetail>(`/market/products/${productId}`);
  return data;
}

export async function fetchArtisans(params: ArtisanFilters = {}): Promise<ArtisanSummary[]> {
  const { data } = await apiClient.get<ArtisanSummary[]>('/market/artisans', { params });
  return data;
}

export async function fetchArtisanById(artisanId: string): Promise<ArtisanSummary> {
  const { data } = await apiClient.get<ArtisanSummary>(`/market/artisans/${artisanId}`);
  return data;
}

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  const { data } = await apiClient.post<Order>('/market/orders', payload);
  return data;
}

export async function quoteDeliveryFee(payload: DeliveryFeeQuoteRequest): Promise<DeliveryFeeQuote> {
  const { data } = await apiClient.post<DeliveryFeeQuote>('/market/delivery-fees/quote', payload);
  return data;
}

export async function fetchMyOrders(): Promise<Order[]> {
  const { data } = await apiClient.get<Order[]>('/market/orders/me');
  return data;
}

export async function fetchReceivedOrders(status?: string): Promise<Order[]> {
  const { data } = await apiClient.get<Order[]>('/market/orders/received', {
    params: status ? { status } : undefined,
  });
  return data;
}

export async function updateOrderStatus(orderId: string, payload: UpdateOrderStatusPayload): Promise<Order> {
  const { data } = await apiClient.patch<Order>(`/market/orders/${orderId}/status`, payload);
  return data;
}
