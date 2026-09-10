"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { CartItemRow } from "@/components/cart/cart-item-row";
import { EmptyState } from "@/components/common/empty-state";
import { useCartStore, useCartSubtotal } from "@/features/cart/store";
import { formatIDR } from "@/lib/format";
import { cn } from "@/lib/utils";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const subtotal = useCartSubtotal();

  if (items.length === 0) {
    return (
      <main className="bg-background">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
          <EmptyState
            title="Keranjang kamu masih kosong"
            message="Jelajahi koleksi batik resmi kami dan temukan favoritmu."
            action={
              <Link href="/koleksi" className={cn(buttonVariants({ size: "default" }))}>
                <ShoppingBag />
                Lihat Koleksi
              </Link>
            }
          />
        </div>
      </main>
    );
  }

  return (
    <main className="bg-background">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Keranjang Belanja</h1>
          <p className="text-sm text-muted-foreground">
            {items.length} jenis produk di keranjangmu.
          </p>
        </header>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
          <section className="space-y-4" aria-label="Item keranjang">
            {items.map((item) => (
              <CartItemRow key={item.productId} item={item} />
            ))}
          </section>

          <aside aria-label="Ringkasan belanja">
            <Card className="lg:sticky lg:top-24">
              <CardContent className="space-y-4">
                <CardTitle className="text-base">Ringkasan Belanja</CardTitle>
                <div className="space-y-2 border-t border-border pt-4 text-sm">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="font-semibold text-foreground">{formatIDR(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Ongkos kirim</span>
                    <span>Dihitung saat checkout</span>
                  </div>
                </div>
                <Button type="button" size="lg" className="w-full" disabled>
                  Lanjut ke Pembayaran
                  <ArrowRight />
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  Checkout akan hadir pada milestone berikutnya.
                </p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  );
}
