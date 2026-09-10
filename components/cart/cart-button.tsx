"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { useCartCount } from "@/features/cart/store";
import { cn } from "@/lib/utils";

const emptySubscribe = () => () => {};

export function CartButton() {
  const count = useCartCount();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  return (
    <Link
      href="/keranjang"
      aria-label={mounted && count > 0 ? `Keranjang, ${count} item` : "Keranjang"}
      className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "relative")}
    >
      <ShoppingBag />
      {mounted && count > 0 ? (
        <Badge className="absolute -top-1 -right-1 h-4 min-w-4 px-1 text-[10px]">
          {count > 99 ? "99+" : count}
        </Badge>
      ) : null}
    </Link>
  );
}
