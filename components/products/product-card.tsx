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

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative flex aspect-[4/3] items-center justify-center bg-muted">
        {product.badge ? (
          <Badge className="absolute top-3 left-3">{product.badge}</Badge>
        ) : null}
        <p className="px-6 text-center text-sm font-medium text-muted-foreground">
          Foto {product.name}
        </p>
      </div>
      <CardContent className="space-y-1 pt-4">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {product.category}
        </p>
        <CardTitle className="text-base">{product.name}</CardTitle>
        <CardDescription className="text-base font-semibold text-foreground">
          {formatIDR(product.price)}
        </CardDescription>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" type="button" aria-label={`Tambah ${product.name} ke keranjang`} disabled>
          <ShoppingBag />
          Tambah ke Keranjang
        </Button>
      </CardFooter>
    </Card>
  );
}
