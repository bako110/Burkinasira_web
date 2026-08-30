import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  fetchMyHotels,
  createMyHotel,
  updateMyHotel,
  deleteMyHotel,
  fetchMyRestaurants,
  createMyRestaurant,
  updateMyRestaurant,
  deleteMyRestaurant,
  fetchMyTransportProviders,
  createMyTransportProvider,
  updateMyTransportProvider,
  deleteMyTransportProvider,
  fetchMyArtisanProfile,
  createMyArtisanProfile,
  updateMyArtisanProfile,
  fetchMyProducts,
  createMyProduct,
  updateMyProduct,
  deleteMyProduct,
} from '../api/myEstablishments.api';
import type { CreateHotelPayload, CreateRestaurantPayload, CreateTransportProviderPayload, CreateProductPayload } from '../types';

export function useMyHotels() {
  return useQuery({ queryKey: ['my-hotels'], queryFn: fetchMyHotels });
}

export function useCreateMyHotel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateHotelPayload) => createMyHotel(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-hotels'] }),
  });
}

export function useUpdateMyHotel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CreateHotelPayload> }) => updateMyHotel(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-hotels'] }),
  });
}

export function useDeleteMyHotel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteMyHotel(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-hotels'] }),
  });
}

export function useMyRestaurants() {
  return useQuery({ queryKey: ['my-restaurants'], queryFn: fetchMyRestaurants });
}

export function useCreateMyRestaurant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateRestaurantPayload) => createMyRestaurant(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-restaurants'] }),
  });
}

export function useUpdateMyRestaurant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CreateRestaurantPayload> }) =>
      updateMyRestaurant(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-restaurants'] }),
  });
}

export function useDeleteMyRestaurant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteMyRestaurant(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-restaurants'] }),
  });
}

export function useMyTransportProviders() {
  return useQuery({ queryKey: ['my-transport-providers'], queryFn: fetchMyTransportProviders });
}

export function useCreateMyTransportProvider() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTransportProviderPayload) => createMyTransportProvider(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-transport-providers'] }),
  });
}

export function useUpdateMyTransportProvider() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CreateTransportProviderPayload> }) =>
      updateMyTransportProvider(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-transport-providers'] }),
  });
}

export function useDeleteMyTransportProvider() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteMyTransportProvider(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-transport-providers'] }),
  });
}

export function useMyArtisanProfile() {
  return useQuery({ queryKey: ['my-artisan-profile'], queryFn: fetchMyArtisanProfile });
}

export function useCreateMyArtisanProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMyArtisanProfile,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-artisan-profile'] }),
  });
}

export function useUpdateMyArtisanProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateMyArtisanProfile,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-artisan-profile'] }),
  });
}

export function useMyProducts() {
  return useQuery({ queryKey: ['my-products'], queryFn: fetchMyProducts });
}

export function useCreateMyProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateProductPayload) => createMyProduct(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-products'] }),
  });
}

export function useUpdateMyProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CreateProductPayload> }) => updateMyProduct(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-products'] }),
  });
}

export function useDeleteMyProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteMyProduct(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-products'] }),
  });
}
