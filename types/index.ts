export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  stock: number;
  category_id: string | null;
  image_url: string | null;
  is_featured: boolean;
  category?: string | null;
  badge?: string;
};

export type PaymentStatus = "pending" | "paid" | "failed";

export type OrderStatus =
  | "pending_payment"
  | "processing"
  | "shipped"
  | "completed"
  | "cancelled";

export type Address = {
  id: string;
  user_id: string | null;
  recipient_name: string;
  phone: string;
  full_address: string;
  city: string;
  province: string;
  postal_code: string;
  is_default?: boolean;
  created_at: string;
};

export type Order = {
  id: string;
  user_id: string | null;
  address_id: string | null;
  subtotal: number;
  shipping_cost: number;
  grand_total: number;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  created_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  price_at_time: number;
  quantity: number;
  created_at: string;
};
