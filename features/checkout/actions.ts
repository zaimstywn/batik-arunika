"use server";

import { revalidatePath } from "next/cache";
import { checkoutPayloadSchema } from "@/features/checkout/schemas";
import { createClient } from "@/lib/supabase/server";

export type CheckoutActionResult = {
  success: boolean;
  message?: string;
  orderId?: string;
};

export async function createOrderAction(values: unknown): Promise<CheckoutActionResult> {
  const parsed = checkoutPayloadSchema.safeParse(values);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues[0]?.message ?? "Data checkout tidak valid";
    return { success: false, message: errorMsg };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { address, items, shippingCost } = parsed.data;

  // 1. Fetch current authentic product prices & stock from database
  const productIds = items.map((i) => i.productId);
  const { data: dbProducts, error: productError } = await supabase
    .from("products")
    .select("id, name, price, stock")
    .in("id", productIds);

  if (productError || !dbProducts) {
    return { success: false, message: "Gagal memverifikasi harga produk." };
  }

  const productMap = new Map(dbProducts.map((p) => [p.id, p]));

  // 2. Validate and recalculate server-side subtotal
  let serverSubtotal = 0;
  const verifiedOrderItems: {
    product_id: string;
    product_name: string;
    price_at_time: number;
    quantity: number;
  }[] = [];

  for (const clientItem of items) {
    const dbProduct = productMap.get(clientItem.productId);
    if (!dbProduct) {
      return { success: false, message: `Produk dengan ID ${clientItem.productId} tidak ditemukan.` };
    }
    if (dbProduct.stock < clientItem.quantity) {
      return { success: false, message: `Stok produk ${dbProduct.name} tidak mencukupi (tersisa ${dbProduct.stock}).` };
    }

    const lineTotal = dbProduct.price * clientItem.quantity;
    serverSubtotal += lineTotal;

    verifiedOrderItems.push({
      product_id: dbProduct.id,
      product_name: dbProduct.name,
      price_at_time: dbProduct.price,
      quantity: clientItem.quantity,
    });
  }

  const grandTotal = serverSubtotal + shippingCost;

  // 3. Insert address record
  const { data: addressRecord, error: addressError } = await supabase
    .from("addresses")
    .insert({
      user_id: user?.id ?? null,
      recipient_name: address.recipientName,
      phone: address.phone,
      full_address: address.fullAddress,
      city: address.city,
      province: address.province,
      postal_code: address.postalCode,
    })
    .select("id")
    .single();

  if (addressError || !addressRecord) {
    return { success: false, message: "Gagal menyimpan alamat pengiriman." };
  }

  // 4. Insert order record
  const { data: orderRecord, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user?.id ?? null,
      address_id: addressRecord.id,
      subtotal: serverSubtotal,
      shipping_cost: shippingCost,
      grand_total: grandTotal,
      payment_status: "pending",
      order_status: "pending_payment",
    })
    .select("id")
    .single();

  if (orderError || !orderRecord) {
    return { success: false, message: "Gagal membuat pesanan." };
  }

  // 5. Insert order items record
  const orderItemsPayload = verifiedOrderItems.map((item) => ({
    order_id: orderRecord.id,
    ...item,
  }));

  const { error: itemsError } = await supabase.from("order_items").insert(orderItemsPayload);

  if (itemsError) {
    return { success: false, message: "Gagal menyimpan rincian pesanan." };
  }

  revalidatePath("/", "layout");

  return {
    success: true,
    orderId: orderRecord.id,
  };
}
