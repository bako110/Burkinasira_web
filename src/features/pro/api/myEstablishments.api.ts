import { apiClient } from '../../../shared/api/client';
import type { HotelDetail } from '../../hotels/types';
import type { RestaurantDetail } from '../../restaurants/types';
import type { TransportProviderDetail } from '../../mobility/types';
import type { ArtisanSummary, ProductDetail } from '../../market/types';
import type {
  CreateHotelPayload,
  CreateRestaurantPayload,
  CreateTransportProviderPayload,
  CreateArtisanProfilePayload,
  CreateProductPayload,
} from '../types';

async function getOrNull<T>(url: string): Promise<T | null> {
  try {
    const { data } = await apiClient.get<T>(url);
    return data;
  } catch (err: unknown) {
    if (typeof err === 'object' && err !== null && 'response' in err) {
      const status = (err as { response?: { status?: number } }).response?.status;
      if (status === 404) return null;
    }
    throw err;
  }
}

export async function fetchMyHotels(): Promise<HotelDetail[]> {
  const { data } = await apiClient.get<HotelDetail[]>('/hotels/me/list');
  return data;
}

export async function createMyHotel(payload: CreateHotelPayload): Promise<HotelDetail> {
  const { data } = await apiClient.post<HotelDetail>('/hotels', payload);
  return data;
}

export async function updateMyHotel(id: string, payload: Partial<CreateHotelPayload>): Promise<HotelDetail> {
  const { data } = await apiClient.patch<HotelDetail>(`/hotels/${id}`, payload);
  return data;
}

export async function deleteMyHotel(id: string): Promise<void> {
  await apiClient.delete(`/hotels/${id}`);
}

export async function fetchMyRestaurants(): Promise<RestaurantDetail[]> {
  const { data } = await apiClient.get<RestaurantDetail[]>('/restaurants/me/list');
  return data;
}

export async function createMyRestaurant(payload: CreateRestaurantPayload): Promise<RestaurantDetail> {
  const { data } = await apiClient.post<RestaurantDetail>('/restaurants', payload);
  return data;
}

export async function updateMyRestaurant(
  id: string,
  payload: Partial<CreateRestaurantPayload>,
): Promise<RestaurantDetail> {
  const { data } = await apiClient.patch<RestaurantDetail>(`/restaurants/${id}`, payload);
  return data;
}

export async function deleteMyRestaurant(id: string): Promise<void> {
  await apiClient.delete(`/restaurants/${id}`);
}

export async function fetchMyTransportProviders(): Promise<TransportProviderDetail[]> {
  const { data } = await apiClient.get<TransportProviderDetail[]>('/mobility/providers/me/list');
  return data;
}

export async function createMyTransportProvider(
  payload: CreateTransportProviderPayload,
): Promise<TransportProviderDetail> {
  const { data } = await apiClient.post<TransportProviderDetail>('/mobility/providers', payload);
  return data;
}

export async function updateMyTransportProvider(
  id: string,
  payload: Partial<CreateTransportProviderPayload>,
): Promise<TransportProviderDetail> {
  const { data } = await apiClient.patch<TransportProviderDetail>(`/mobility/providers/${id}`, payload);
  return data;
}

export async function deleteMyTransportProvider(id: string): Promise<void> {
  await apiClient.delete(`/mobility/providers/${id}`);
}

export async function fetchMyArtisanProfile(): Promise<ArtisanSummary | null> {
  return getOrNull<ArtisanSummary>('/market/artisans/me');
}

export async function createMyArtisanProfile(payload: CreateArtisanProfilePayload): Promise<ArtisanSummary> {
  const { data } = await apiClient.post<ArtisanSummary>('/market/artisans', payload);
  return data;
}

export async function updateMyArtisanProfile(payload: Partial<CreateArtisanProfilePayload>): Promise<ArtisanSummary> {
  const { data } = await apiClient.patch<ArtisanSummary>('/market/artisans/me', payload);
  return data;
}

export async function fetchMyProducts(): Promise<ProductDetail[]> {
  const { data } = await apiClient.get<ProductDetail[]>('/market/products/me/list');
  return data;
}

export async function createMyProduct(payload: CreateProductPayload): Promise<ProductDetail> {
  const { data } = await apiClient.post<ProductDetail>('/market/products', payload);
  return data;
}

export async function updateMyProduct(id: string, payload: Partial<CreateProductPayload>): Promise<ProductDetail> {
  const { data } = await apiClient.patch<ProductDetail>(`/market/products/${id}`, payload);
  return data;
}

export async function deleteMyProduct(id: string): Promise<void> {
  await apiClient.delete(`/market/products/${id}`);
}
