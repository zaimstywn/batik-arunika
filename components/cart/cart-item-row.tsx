"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatIDR } from "@/lib/format";
import { useCartStore, type CartItem } from "@/features/cart/store";

type QuantityControlsProps = {
  item: CartItem;
};

function QuantityControls({ item }: QuantityControlsProps) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  return (
    <div className="flex items-center gap-2" aria-label={`Jumlah ${item.name}`}>
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        aria-label={`Kurangi jumlah ${item.name}`}
        disabled={item.quantity <= 1}
        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
      >
        <Minus />
      </Button>
      <span className="w-8 text-center text-sm font-semibold" aria-live="polite">
        {item.quantity}
      </span>
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        aria-label={`Tambah jumlah ${item.name}`}
        disabled={item.quantity >= item.maxStock}
        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
      >
        <Plus />
      </Button>
    </div>
  );
}

export function CartItemRow({ item }: { item: CartItem }) {
  const removeItem = useCartStore((state) => state.removeItem);

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-muted px-2 text-center">
          <p className="line-clamp-3 text-[11px] font-medium text-muted-foreground">
            {item.name}
          </p>
        </div>

        <div className="min-w-0 flex-1 space-y-1">
          <p className="truncate text-sm font-semibold text-foreground">{item.name}</p>
          <p className="text-sm font-semibold text-primary">{formatIDR(item.price)}</p>
          <p className="text-xs text-muted-foreground">Maksimal {item.maxStock} pcs</p>
        </div>

        <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
          <QuantityControls item={item} />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            aria-label={`Hapus ${item.name} dari keranjang`}
            onClick={() => removeItem(item.productId)}
          >
            <Trash2 />
            Hapus
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
