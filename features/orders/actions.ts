"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getServerIntegrationsEnv } from "@/lib/env";
import { createServiceClient } from "@/lib/supabase/service";
import { createClient } from "@/lib/supabase/server";
import type { OrderStatus } from "@/types";

const updateStatusSchema = z.object({
  orderId: z.string().uuid("ID pesanan tidak valid"),
  status: z.enum([
    "pending_payment",
    "processing",
    "shipped",
    "completed",
    "cancelled",
  ]),
});

export type UpdateOrderStatusResult = {
  success: boolean;
  message?: string;
};

export async function updateOrderStatusAction(
  values: unknown
): Promise<UpdateOrderStatusResult> {
  const parsed = updateStatusSchema.safeParse(values);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Data tidak valid",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return { success: false, message: "Anda harus masuk sebagai admin." };
  }

  const { ADMIN_EMAIL } = getServerIntegrationsEnv();
  const isAdmin =
    !!ADMIN_EMAIL && user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  if (!isAdmin) {
    return { success: false, message: "Akses ditolak. Bukan admin." };
  }

  const nextStatus: OrderStatus = parsed.data.status;

  try {
    const service = createServiceClient();
    const { error } = await service
      .from("orders")
      .update({ order_status: nextStatus })
      .eq("id", parsed.data.orderId);

    if (error) {
      return { success: false, message: "Gagal memperbarui status pesanan." };
    }
  } catch {
    return {
      success: false,
      message: "Konfigurasi service database belum lengkap.",
    };
  }

  revalidatePath("/admin/orders");
  revalidatePath("/profile");

  return { success: true, message: "Status pesanan diperbarui." };
}
