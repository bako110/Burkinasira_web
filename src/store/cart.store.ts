import { create } from 'zustand';

import type { ProductCategory } from '../features/market/types';

export interface CartItem {
  product_id: string;
  name: string;
  price: number;
  currency: string;
  photo?: string;
  category?: ProductCategory;
  quantity: number;
  stock_quantity?: number;
  artisan_id: string;
  artisan_name?: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (productId: string) => void;
  removeItems: (productIds: string[]) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
}

const CART_KEY = 'burkinasira:cart';

function readStoredItems(): CartItem[] {
  const raw = localStorage.getItem(CART_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persist(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export const useCartStore = create<CartState>((set, get) => ({
  items: readStoredItems(),

  addItem: (item, quantity = 1) => {
    const items = get().items;
    const existing = items.find((i) => i.product_id === item.product_id);
    const maxQuantity = item.stock_quantity ?? Infinity;

    let next: CartItem[];
    if (existing) {
      next = items.map((i) =>
        i.product_id === item.product_id
          ? { ...i, quantity: Math.min(i.quantity + quantity, maxQuantity) }
          : i,
      );
    } else {
      next = [...items, { ...item, quantity: Math.min(quantity, maxQuantity) }];
    }
    persist(next);
    set({ items: next });
  },

  removeItem: (productId) => {
    const next = get().items.filter((i) => i.product_id !== productId);
    persist(next);
    set({ items: next });
  },

  removeItems: (productIds) => {
    const idsToRemove = new Set(productIds);
    const next = get().items.filter((i) => !idsToRemove.has(i.product_id));
    persist(next);
    set({ items: next });
  },

  setQuantity: (productId, quantity) => {
    const next = get()
      .items.map((i) => (i.product_id === productId ? { ...i, quantity } : i))
      .filter((i) => i.quantity > 0);
    persist(next);
    set({ items: next });
  },

  clear: () => {
    persist([]);
    set({ items: [] });
  },
}));

export function useCartTotalCount(): number {
  return useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));
}
