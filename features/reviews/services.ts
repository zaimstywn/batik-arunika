"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ProductReview = {
  id: string;
  user_id: string;
  product_id: string;
  order_id: string | null;
  rating: number;
  review_text: string;
  created_at: string;
  reviewer_name?: string;
};

export type ReviewSummary = {
  averageRating: number;
  totalReviews: number;
  reviews: ProductReview[];
};

export async function getProductReviews(
  productId: string
): Promise<ReviewSummary> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("product_reviews")
    .select("id, user_id, product_id, order_id, rating, review_text, created_at")
    .eq("product_id", productId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch product reviews:", error.message);
    return { averageRating: 0, totalReviews: 0, reviews: [] };
  }

  const reviews = (data ?? []) as ProductReview[];
  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? Number(
          (
            reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews
          ).toFixed(1)
        )
      : 0;

  return {
    averageRating,
    totalReviews,
    reviews,
  };
}

export type CreateReviewData = {
  productId: string;
  orderId?: string;
  rating: number;
  reviewText: string;
};

export async function createProductReview(
  data: CreateReviewData
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Anda harus masuk terlebih dahulu." };
  }

  if (data.rating < 1 || data.rating > 5) {
    return { success: false, error: "Rating harus antara 1 sampai 5." };
  }

  if (!data.reviewText || data.reviewText.trim().length === 0) {
    return { success: false, error: "Ulasan tidak boleh kosong." };
  }

  const { error } = await supabase.from("product_reviews").insert({
    user_id: user.id,
    product_id: data.productId,
    order_id: data.orderId || null,
    rating: data.rating,
    review_text: data.reviewText.trim(),
  });

  if (error) {
    console.error("Failed to create review:", error.message);
    if (error.code === "23505") {
      return { success: false, error: "Anda sudah memberikan ulasan untuk produk ini." };
    }
    return { success: false, error: "Gagal mengirim ulasan." };
  }

  revalidatePath(`/koleksi`);
  return { success: true };
}
