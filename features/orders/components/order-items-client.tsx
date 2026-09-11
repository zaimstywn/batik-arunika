"use client";

import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReviewModal } from "@/features/reviews/components/review-modal";
import { formatIDR } from "@/lib/format";
import type { OrderItem } from "@/types";

type OrderItemsClientProps = {
  items: OrderItem[];
  orderId: string;
  orderStatus: string;
};

export function OrderItemsClient({
  items,
  orderId,
  orderStatus,
}: OrderItemsClientProps) {
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const isDelivered = orderStatus === "completed" || orderStatus === "shipped";

  const handleOpenReview = (productId: string, productName: string) => {
    setSelectedProduct({ id: productId, name: productName });
    setReviewModalOpen(true);
  };

  return (
    <>
      <div className="divide-y divide-border rounded-lg border border-border">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex-1">
              <p className="font-medium">{item.product_name}</p>
              <p className="text-sm text-muted-foreground">
                {item.quantity}x {formatIDR(item.price_at_time)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <p className="font-semibold">
                {formatIDR(item.price_at_time * item.quantity)}
              </p>
              {isDelivered && item.product_id && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleOpenReview(item.product_id!, item.product_name)
                  }
                >
                  <MessageSquare className="mr-2 size-4" />
                  Beri Ulasan
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedProduct && (
        <ReviewModal
          productId={selectedProduct.id}
          productName={selectedProduct.name}
          orderId={orderId}
          open={reviewModalOpen}
          onOpenChange={setReviewModalOpen}
        />
      )}
    </>
  );
}
