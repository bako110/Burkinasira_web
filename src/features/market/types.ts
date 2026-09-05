export type ProductCategory =
  | 'tissus_vetements'
  | 'bijoux'
  | 'poterie'
  | 'sculpture'
  | 'objet_art'
  | 'produit_agricole'
  | 'produit_alimentaire'
  | 'souvenir';

export type FulfillmentMode = 'livraison' | 'retrait' | 'les_deux';

export interface ProductSummary {
  id: string;
  artisan_id: string;
  name: string;
  slug: string;
  price: number;
  currency: string;
  photo?: string;
  category: ProductCategory;
  average_rating: number;
  review_count: number;
  in_stock: boolean;
  stock_quantity: number;
}

export interface ProductFilters {
  category?: ProductCategory;
  artisan_id?: string;
  q?: string;
  page?: number;
  page_size?: number;
}

export type ArtisanStatus = 'pending' | 'active' | 'suspended';

export interface ArtisanSummary {
  id: string;
  user_id: string;
  display_name: string;
  story?: string;
  photo_url?: string;
  photos: string[];
  videos: string[];
  region?: string;
  province?: string;
  city?: string;
  is_verified: boolean;
  status: ArtisanStatus;
  average_rating: number;
  review_count: number;
}

export interface ArtisanFilters {
  region?: string;
  province?: string;
  verified_only?: boolean;
}

export type ProductStatus = 'draft' | 'published' | 'out_of_stock' | 'archived';

export interface ProductDetail {
  id: string;
  artisan_id: string;
  name: string;
  slug: string;
  description?: string;
  category: ProductCategory;
  price: number;
  currency: string;
  photos: string[];
  videos: string[];
  stock_quantity?: number;
  fulfillment_mode?: FulfillmentMode;
  average_rating?: number;
  review_count?: number;
  status: ProductStatus;
}

export type OrderStatus = string;

export interface Order {
  id: string;
  buyer_id: string;
  product_id: string;
  artisan_id?: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  delivery_fee: number;
  delivery_region?: string;
  delivery_address?: string;
  delivery_provider?: string;
  delivery_eta_days_min?: number;
  delivery_eta_days_max?: number;
  total_price: number;
  currency: string;
  fulfillment_mode: FulfillmentMode;
  status: OrderStatus;
  created_at: string;
}

/**
 * Mode concret d'une commande : le backend refuse « les_deux » (ambigu pour le
 * calcul des frais de livraison).
 */
export type OrderFulfillmentMode = 'livraison' | 'retrait';

export interface CreateOrderPayload {
  product_id: string;
  quantity: number;
  fulfillment_mode: OrderFulfillmentMode;
  /** Obligatoire quand fulfillment_mode vaut « livraison ». */
  delivery_region?: string;
  delivery_address?: string;
}

export interface DeliveryFeeQuoteRequest {
  region: string;
  subtotal: number;
}

export interface DeliveryFeeQuote {
  region: string;
  matched_region: string;
  subtotal: number;
  delivery_fee: number;
  free_delivery_applied: boolean;
  total: number;
  currency: string;
  agency_id?: string;
  delivery_provider?: string;
  eta_days_min?: number;
  eta_days_max?: number;
}
