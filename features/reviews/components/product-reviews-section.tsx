import { Star } from "lucide-react";
import { getProductReviews } from "@/features/reviews/services";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/common/empty-state";

export async function ProductReviewsSection({ productId }: { productId: string }) {
  const { averageRating, totalReviews, reviews } = await getProductReviews(
    productId
  ).catch(() => ({ averageRating: 0, totalReviews: 0, reviews: [] }));

  return (
    <div className="space-y-6 pt-10 border-t border-border">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Ulasan Pembeli</h2>
          <p className="text-sm text-muted-foreground">
            Berdasarkan {totalReviews} ulasan terverifikasi
          </p>
        </div>
        {totalReviews > 0 && (
          <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
            <div className="text-3xl font-bold">{averageRating}</div>
            <div className="space-y-1">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`size-4 ${
                      averageRating >= star
                        ? "fill-amber-400 text-amber-400"
                        : "text-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">Dari 5 bintang</p>
            </div>
          </div>
        )}
      </div>

      {reviews.length === 0 ? (
        <EmptyState
          title="Belum ada ulasan"
          message="Jadilah yang pertama memberikan ulasan untuk produk ini setelah membelinya."
        />
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`size-4 ${
                          review.rating >= star
                            ? "fill-amber-400 text-amber-400"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(review.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-foreground">
                  {review.review_text}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
