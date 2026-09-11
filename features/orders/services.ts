import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import type { Address, Order, OrderItem } from "@/types";

export type OrderWithItems = Order & {
  address: Address | null;
  items: OrderItem[];
};

export async function getCustomerOrders(): Promise<Order[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Anda harus masuk untuk melihat pesanan.");
  }

  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, user_id, address_id, subtotal, shipping_cost, grand_total, payment_status, order_status, created_at"
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Gagal memuat pesanan: ${error.message}`);
  }

  return (data ?? []) as Order[];
}

export async function getCustomerOrderDetail(
  orderId: string
): Promise<OrderWithItems | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Anda harus masuk untuk melihat detail pesanan.");
  }

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select(
      "id, user_id, address_id, subtotal, shipping_cost, grand_total, payment_status, order_status, created_at"
    )
    .eq("id", orderId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (orderError) {
    throw new Error(`Gagal memuat pesanan: ${orderError.message}`);
  }

  if (!order) {
    return null;
  }

  const { data: items, error: itemsError } = await supabase
    .from("order_items")
    .select("id, order_id, product_id, product_name, price_at_time, quantity, created_at")
    .eq("order_id", orderId)
    .order("created_at");

  if (itemsError) {
    throw new Error(`Gagal memuat rincian pesanan: ${itemsError.message}`);
  }

  let address: Address | null = null;
  if (order.address_id) {
    const { data: addressRow } = await supabase
      .from("addresses")
      .select(
        "id, user_id, recipient_name, phone, full_address, city, province, postal_code, created_at"
      )
      .eq("id", order.address_id)
      .maybeSingle();
    address = (addressRow ?? null) as Address | null;
  }

  return {
    ...(order as Order),
    address,
    items: (items ?? []) as OrderItem[],
  };
}

export type AdminOrderRow = Order & {
  customer_email: string | null;
};

export type AdminDashboardStats = {
  totalOrders: number;
  totalProducts: number;
  totalRevenue: number;
  pendingOrders: number;
  recentOrders: AdminOrderRow[];
};

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  const supabase = createServiceClient();

  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select(
      "id, user_id, address_id, subtotal, shipping_cost, grand_total, payment_status, order_status, created_at"
    )
    .order("created_at", { ascending: false });

  if (ordersError) {
    throw new Error(`Gagal memuat statistik admin: ${ordersError.message}`);
  }

  const { count: productCount, error: productError } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true });

  if (productError) {
    throw new Error(`Gagal menghitung produk: ${productError.message}`);
  }

  const allOrders = (orders ?? []) as Order[];

  const totalRevenue = allOrders
    .filter(
      (o) =>
        o.payment_status === "paid" ||
        o.order_status === "shipped" ||
        o.order_status === "completed"
    )
    .reduce((sum, o) => sum + o.grand_total, 0);

  const pendingOrders = allOrders.filter(
    (o) => o.order_status === "pending_payment"
  ).length;

  const recentOrders = allOrders.slice(0, 5);
  const userIds = [...new Set(recentOrders.map((o) => o.user_id).filter(Boolean))] as string[];

  const emailMap = new Map<string, string>();
  if (userIds.length > 0) {
    const { data: users } = await supabase.auth.admin.listUsers();
    for (const u of users?.users ?? []) {
      if (u.email) emailMap.set(u.id, u.email);
    }
  }

  return {
    totalOrders: allOrders.length,
    totalProducts: productCount ?? 0,
    totalRevenue,
    pendingOrders,
    recentOrders: recentOrders.map((order) => ({
      ...order,
      customer_email: order.user_id ? emailMap.get(order.user_id) ?? null : null,
    })),
  };
}

export async function getAllOrdersForAdmin(): Promise<AdminOrderRow[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, user_id, address_id, subtotal, shipping_cost, grand_total, payment_status, order_status, created_at"
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Gagal memuat pesanan admin: ${error.message}`);
  }

  const orders = (data ?? []) as Order[];
  const userIds = [...new Set(orders.map((o) => o.user_id).filter(Boolean))] as string[];

  const emailMap = new Map<string, string>();
  if (userIds.length > 0) {
    const { data: users } = await supabase.auth.admin.listUsers();
    for (const u of users?.users ?? []) {
      if (u.email) emailMap.set(u.id, u.email);
    }
  }

  return orders.map((order) => ({
    ...order,
    customer_email: order.user_id ? emailMap.get(order.user_id) ?? null : null,
  }));
}
