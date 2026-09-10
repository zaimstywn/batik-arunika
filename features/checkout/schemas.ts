import { z } from "zod";

export const addressSchema = z.object({
  recipientName: z
    .string()
    .trim()
    .min(2, "Nama penerima minimal 2 karakter"),
  phone: z
    .string()
    .trim()
    .min(8, "Nomor telepon minimal 8 digit")
    .max(15, "Nomor telepon maksimal 15 digit"),
  fullAddress: z
    .string()
    .trim()
    .min(10, "Alamat lengkap minimal 10 karakter"),
  city: z.string().trim().min(2, "Kota/Kabupaten wajib diisi"),
  province: z.string().trim().min(2, "Provinsi wajib diisi"),
  postalCode: z
    .string()
    .trim()
    .min(5, "Kode pos minimal 5 digit")
    .max(5, "Kode pos maksimal 5 digit"),
});

export type AddressInput = z.infer<typeof addressSchema>;

export const checkoutItemSchema = z.object({
  productId: z.string().uuid("ID produk tidak valid"),
  quantity: z.number().int().min(1, "Jumlah minimal 1"),
});

export type CheckoutItemInput = z.infer<typeof checkoutItemSchema>;

export const checkoutPayloadSchema = z.object({
  address: addressSchema,
  items: z.array(checkoutItemSchema).min(1, "Keranjang tidak boleh kosong"),
  shippingCost: z.number().int().min(0).default(20000),
});

export type CheckoutPayloadInput = z.infer<typeof checkoutPayloadSchema>;
