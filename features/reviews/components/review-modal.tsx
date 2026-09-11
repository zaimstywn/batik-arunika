"use client";

import { useState } from "react";
import { Star, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { createProductReview } from "@/features/reviews/services";
import { toast } from "sonner";

type ReviewModalProps = {
  productId: string;
  productName: string;
  orderId?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ReviewModal({
  productId,
  productName,
  orderId,
  open,
  onOpenChange,
}: ReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) {
      toast.error("Tulis ulasan Anda terlebih dahulu");
      return;
    }

    setIsSubmitting(true);
    const result = await createProductReview({
      productId,
      orderId,
      rating,
      reviewText,
    });
    setIsSubmitting(false);

    if (result.success) {
      toast.success("Ulasan berhasil dikirim");
      setReviewText("");
      setRating(5);
      onOpenChange(false);
    } else {
      toast.error(result.error ?? "Gagal mengirim ulasan");
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <MessageSquare className="size-5 text-primary" />
            Beri Ulasan Produk
          </SheetTitle>
          <SheetDescription>
            Bagikan pengalaman Anda menggunakan {productName}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Rating Bintang</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 focus:outline-none"
                >
                  <Star
                    className={`size-8 transition-colors ${
                      (hoverRating || rating) >= star
                        ? "fill-amber-400 text-amber-400"
                        : "text-muted-foreground/30"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="reviewText" className="text-sm font-medium">
              Ulasan Anda
            </label>
            <textarea
              id="reviewText"
              rows={4}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Ceritakan kualitas bahan, kenyamanan, dan kesesuaian produk..."
              className="w-full rounded-md border border-border bg-background p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Mengirim..." : "Kirim Ulasan"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
