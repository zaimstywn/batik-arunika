"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/types";

export type WishlistItem = {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product: Product | null;
};

export type WishlistActionResult = {
  success: boolean;
  error?: string;
  isWishlisted?: boolean;
};

export async function getCustomerWishlist(): Promise<WishlistItem[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("wishlists")
    .select(
      `
      id,
      user_id,
      product_id,
      created_at,
      products (
        id,
        name,
        slug,
        description,
        price,
        stock,
        category_id,
        image_url,
        is_featured
      )
    `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch wishlist:", error.message);
    return [];
  }

  return (data ?? [])
    .map((item: { id: string; user_id: string; product_id: string; created_at: string; products: Product[] | null }) => ({
      id: item.id,
      user_id: item.user_id,
      product_id: item.product_id,
      created_at: item.created_at,
      product: item.products?.[0] ?? null,
    }))
    .filter((item) => item.product !== null) as WishlistItem[];
}

export async function isProductWishlisted(
  productId: string
): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return false;
  }

  const { data, error } = await supabase
    .from("wishlists")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .maybeSingle();

  if (error) {
    console.error("Failed to check wishlist status:", error.message);
    return false;
  }

  return data !== null;
}

export async function toggleWishlist(
  productId: string
): Promise<WishlistActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: "Anda harus masuk terlebih dahulu.",
    };
  }

  const { data: existing } = await supabase
    .from("wishlists")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("wishlists")
      .delete()
      .eq("id", existing.id);

    if (error) {
      console.error("Failed to remove from wishlist:", error.message);
      return {
        success: false,
        error: "Gagal menghapus dari wishlist.",
      };
    }

    revalidatePath("/dashboard/wishlist");
    revalidatePath("/koleksi");
    return { success: true, isWishlisted: false };
  } else {
    const { error } = await supabase.from("wishlists").insert({
      user_id: user.id,
      product_id: productId,
    });

    if (error) {
      console.error("Failed to add to wishlist:", error.message);
      return {
        success: false,
        error: "Gagal menambahkan ke wishlist.",
      };
    }

    revalidatePath("/dashboard/wishlist");
    revalidatePath("/koleksi");
    return { success: true, isWishlisted: true };
  }
}

export async function removeFromWishlist(
  wishlistId: string
): Promise<WishlistActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: "Anda harus masuk terlebih dahulu.",
    };
  }

  const { error } = await supabase
    .from("wishlists")
    .delete()
    .eq("id", wishlistId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Failed to remove from wishlist:", error.message);
    return {
      success: false,
      error: "Gagal menghapus dari wishlist.",
    };
  }

  revalidatePath("/dashboard/wishlist");
  return { success: true };
}
