export type BookingItemType =
  | 'hotel'
  | 'activity'
  | 'guide'
  | 'restaurant'
  | 'transport'
  | 'event'
  | 'experience'
  | 'visit';

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'refunded';

export interface Booking {
  id: string;
  booking_reference: string;
  customer_id: string;
  item_type: BookingItemType;
  item_id: string;
  slot_id?: string;
  room_type_name?: string;
  item_title: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  currency: string;
  scheduled_date?: string;
  status: BookingStatus;
  ticket_qr_code: string;
  cancellation_reason?: string;
  created_at: string;
}

export interface PublicTicket {
  booking_reference: string;
  item_type: BookingItemType;
  item_title: string;
  quantity: number;
  scheduled_date?: string;
  status: BookingStatus;
}

export interface CreateBookingPayload {
  item_type: BookingItemType;
  item_id: string;
  item_title: string;
  quantity?: number;
  unit_price?: number;
  currency?: string;
  scheduled_date?: string;
  room_type_name?: string;
  slot_id?: string;
}

export interface Invoice {
  id: string;
  booking_id: string;
  amount: number;
  currency: string;
  issued_at: string;
}
