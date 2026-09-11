"use server";

import { z } from "zod";
import {
  fetchShippingRates,
  type ShippingItemInput,
  type ShippingRate,
} from "@/features/shipping/biteship";

const ratesRequestSchema = z.object({
  postalCode: z.string().trim().min(5, "Kode pos minimal 5 digit").max(5),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().min(1),
      })
    )
    .min(1, "Keranjang tidak boleh kosong"),
});

export type RatesActionResult = {
  success: boolean;
  message?: string;
  rates?: ShippingRate[];
};

export async function getRatesForAddress(
  values: unknown
): Promise<RatesActionResult> {
  const parsed = ratesRequestSchema.safeParse(values);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Kode pos tidak valid",
    };
  }

  try {
    const items: ShippingItemInput[] = parsed.data.items;
    const rates = await fetchShippingRates(parsed.data.postalCode, items);
    return { success: true, rates };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Gagal memuat ongkos kirim.",
    };
  }
}
