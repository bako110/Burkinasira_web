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
  name: string;
  price: number;
  currency: string;
  photo?: string;
  category: ProductCategory;
  stock_quantity?: number;
  fulfillment_mode?: FulfillmentMode;
  average_rating?: number;
}

export interface ProductFilters {
  category?: ProductCategory;
  artisan_id?: string;
  q?: string;
  page?: number;
  page_size?: number;
}

export interface ArtisanSummary {
  id: string;
  user_id: string;
  display_name: string;
  story?: string;
  photo_url?: string;
  region?: string;
  city?: string;
  is_verified: boolean;
  average_rating: number;
  review_count: number;
}

export interface ProductDetail {
  id: string;
  artisan_id: string;
  name: string;
  description?: string;
  category: ProductCategory;
  price: number;
  currency: string;
  photos: string[];
  stock_quantity?: number;
  fulfillment_mode?: FulfillmentMode;
  average_rating?: number;
  review_count?: number;
}
