"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getServerIntegrationsEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

async function verifyAdmin(): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) return false;
  const { ADMIN_EMAIL } = getServerIntegrationsEnv();
  return !!ADMIN_EMAIL && user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

const createCategorySchema = z.object({
  name: z.string().trim().min(2, "Nama kategori minimal 2 karakter"),
  description: z.string().trim().optional(),
});

export type CategoryActionResult = {
  success: boolean;
  message?: string;
};

export async function createCategoryAction(values: unknown): Promise<CategoryActionResult> {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) {
    return { success: false, message: "Akses ditolak. Bukan admin." };
  }

  const parsed = createCategorySchema.safeParse(values);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Data kategori tidak valid",
    };
  }

  const slug = slugify(parsed.data.name);

  try {
    const service = createServiceClient();
    const { error } = await service.from("categories").insert({
      name: parsed.data.name,
      slug,
      description: parsed.data.description || null,
    });

    if (error) {
      if (error.code === "23505") {
        return { success: false, message: "Kategori dengan nama/slug ini sudah ada." };
      }
      return { success: false, message: `Gagal membuat kategori: ${error.message}` };
    }
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : "Gagal terhubung ke database.",
    };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/koleksi");
  revalidatePath("/");

  return { success: true, message: "Kategori berhasil ditambahkan." };
}

const createProductSchema = z.object({
  name: z.string().trim().min(2, "Nama produk minimal 2 karakter"),
  categoryId: z.string().uuid("Kategori wajib dipilih"),
  price: z.coerce.number().int().min(0, "Harga minimal 0"),
  stock: z.coerce.number().int().min(0, "Stok minimal 0"),
  description: z.string().trim().optional(),
  imageUrl: z.string().trim().optional(),
  isFeatured: z.boolean().default(false),
});

export type ProductActionResult = {
  success: boolean;
  message?: string;
};

export async function createProductAction(values: unknown): Promise<ProductActionResult> {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) {
    return { success: false, message: "Akses ditolak. Bukan admin." };
  }

  const parsed = createProductSchema.safeParse(values);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Data produk tidak valid",
    };
  }

  const slug = slugify(parsed.data.name);

  try {
    const service = createServiceClient();
    const { error } = await service.from("products").insert({
      name: parsed.data.name,
      slug,
      description: parsed.data.description || null,
      price: parsed.data.price,
      stock: parsed.data.stock,
      category_id: parsed.data.categoryId,
      image_url: parsed.data.imageUrl || null,
      is_featured: parsed.data.isFeatured,
    });

    if (error) {
      if (error.code === "23505") {
        return { success: false, message: "Produk dengan nama/slug ini sudah ada." };
      }
      return { success: false, message: `Gagal membuat produk: ${error.message}` };
    }
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : "Gagal terhubung ke database.",
    };
  }

  revalidatePath("/admin/products");
  revalidatePath("/koleksi");
  revalidatePath("/");

  return { success: true, message: "Produk berhasil ditambahkan." };
}
