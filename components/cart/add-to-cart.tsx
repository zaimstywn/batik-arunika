"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/features/cart/store";
import type { Product } from "@/types";

type AddToCartProps = {
  product: Product;
};

export function AddToCart({ product }: AddToCartProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);
  const isOutOfStock = product.stock <= 0;

  const onAdd = () => {
    const result = addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      imageUrl: product.image_url,
      maxStock: product.stock,
      quantity,
    });

    if (result.added <= 0) {
      toast.error("Stok produk habis, tidak bisa ditambahkan.");
      return;
    }

    if (result.capped) {
      toast.warning(`${product.name} ditambahkan, jumlah dibatasi stok (${product.stock} pcs).`);
      return;
    }

    toast.success(`${product.name} ditambahkan ke keranjang.`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">Jumlah</span>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Kurangi jumlah"
            disabled={isOutOfStock || quantity <= 1}
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            <Minus />
          </Button>
          <span className="w-10 text-center text-sm font-semibold" aria-live="polite">
            {quantity}
          </span>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Tambah jumlah"
            disabled={isOutOfStock || quantity >= product.stock}
            onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
          >
            <Plus />
          </Button>
        </div>
      </div>

      <Button type="button" size="lg" className="w-full gap-2" disabled={isOutOfStock} onClick={onAdd}>
        <ShoppingBag className="size-5" />
        {isOutOfStock ? "Stok Habis" : "Tambah ke Keranjang"}
      </Button>
    </div>
  );
}
