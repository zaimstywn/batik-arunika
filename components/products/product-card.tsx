import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { formatIDR } from "@/lib/format";
import type { Product } from "@/types";
import { WishlistButton } from "@/features/wishlist/components/wishlist-button";

type ProductCardProps = {
  product: Product;
  isWishlisted?: boolean;
  isAuthenticated?: boolean;
};

export function ProductCard({
  product,
  isWishlisted = false,
  isAuthenticated = false,
}: ProductCardProps) {
  const isOutOfStock = product.stock <= 0;

  return (
    <Card className="flex flex-col justify-between overflow-hidden">
      <div>
        <Link
          href={`/koleksi/${product.slug}`}
          className="group block"
          aria-label={`Lihat detail ${product.name}`}
        >
          <div className="relative flex aspect-[4/3] items-center justify-center bg-muted transition-colors group-hover:bg-muted/80">
            {product.badge ? (
              <Badge className="absolute top-3 left-3">{product.badge}</Badge>
            ) : null}
            {isOutOfStock ? (
              <Badge variant="destructive" className="absolute top-3 right-3">
                Habis
              </Badge>
            ) : null}
            <div className="absolute top-2 right-2 z-10" onClick={(e) => e.stopPropagation()}>
              <WishlistButton
                productId={product.id}
                isWishlisted={isWishlisted}
                isAuthenticated={isAuthenticated}
                variant="ghost"
                size="icon"
              />
            </div>
            <p className="px-6 text-center text-sm font-medium text-muted-foreground group-hover:text-foreground">
              {product.name}
            </p>
          </div>
        </Link>
        <CardContent className="space-y-1 pt-4">
          {product.category ? (
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              {product.category}
            </p>
          ) : null}
          <CardTitle className="text-base">
            <Link
              href={`/koleksi/${product.slug}`}
              className="transition-colors hover:text-primary"
            >
              {product.name}
            </Link>
          </CardTitle>
          <CardDescription className="text-base font-semibold text-foreground">
            {formatIDR(product.price)}
          </CardDescription>
        </CardContent>
      </div>
      <CardFooter className="pt-2">
        <Button
          variant="outline"
          className="w-full"
          type="button"
          aria-label={`Tambah ${product.name} ke keranjang`}
          disabled
        >
          <ShoppingBag />
          {isOutOfStock ? "Stok Habis" : "Tambah ke Keranjang"}
        </Button>
      </CardFooter>
    </Card>
  );
}
