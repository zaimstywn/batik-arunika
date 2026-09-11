"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/common/empty-state";
import { formatIDR } from "@/lib/format";
import { removeFromWishlist, type WishlistItem } from "@/features/wishlist/services";
import { toast } from "sonner";

export default function WishlistPageClient({
  initialWishlist,
}: {
  initialWishlist: WishlistItem[];
}) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>(initialWishlist);

  const handleRemove = async (wishlistId: string) => {
    const result = await removeFromWishlist(wishlistId);
    if (result.success) {
      setWishlist(wishlist.filter((item) => item.id !== wishlistId));
      toast.success("Dihapus dari wishlist");
    } else {
      toast.error(result.error ?? "Gagal menghapus dari wishlist");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="size-5 text-primary" aria-hidden="true" />
            Wishlist Saya
          </CardTitle>
        </CardHeader>
        <CardContent>
          {wishlist.length === 0 ? (
            <EmptyState
              title="Wishlist kosong"
              message="Tambahkan produk favorit Anda ke wishlist untuk melihatnya di sini."
              action={
                <Link href="/koleksi">
                  <Button className="mt-2">
                    <ShoppingCart className="mr-2 size-4" />
                    Jelajahi Produk
                  </Button>
                </Link>
              }
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {wishlist.map((item) => {
                if (!item.product) return null;
                return (
                <Card key={item.id} className="overflow-hidden">
                  <Link href={`/koleksi/${item.product.slug}`}>
                    <div className="relative aspect-square overflow-hidden bg-muted">
                      {item.product.image_url ? (
                        <Image
                          src={item.product.image_url}
                          alt={item.product.name}
                          fill
                          className="object-cover transition-transform hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground">
                          Tanpa Foto
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="p-4 space-y-3">
                    <div>
                      <Link
                        href={`/koleksi/${item.product.slug}`}
                        className="font-semibold hover:text-primary"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-lg font-bold text-primary">
                        {formatIDR(item.product.price)}
                      </p>
                      {item.product.stock === 0 && (
                        <p className="text-xs text-destructive">Stok habis</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/koleksi/${item.product.slug}`}
                        className="flex-1"
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                        >
                          <ShoppingCart className="mr-2 size-4" />
                          Lihat Detail
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemove(item.id)}
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              )})}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
