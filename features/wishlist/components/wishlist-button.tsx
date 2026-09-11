"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleWishlist } from "@/features/wishlist/services";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type WishlistButtonProps = {
  productId: string;
  isWishlisted: boolean;
  isAuthenticated: boolean;
  size?: "sm" | "default" | "lg" | "icon";
  variant?: "default" | "ghost" | "outline";
};

export function WishlistButton({
  productId,
  isWishlisted: initialWishlisted,
  isAuthenticated,
  size = "icon",
  variant = "ghost",
}: WishlistButtonProps) {
  const [isWishlisted, setIsWishlisted] = useState(initialWishlisted);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleToggle = async () => {
    if (!isAuthenticated) {
      toast.error("Silakan masuk terlebih dahulu");
      router.push("/login");
      return;
    }

    setIsLoading(true);
    const result = await toggleWishlist(productId);
    setIsLoading(false);

    if (result.success) {
      setIsWishlisted(result.isWishlisted ?? false);
      toast.success(
        result.isWishlisted
          ? "Ditambahkan ke wishlist"
          : "Dihapus dari wishlist"
      );
    } else {
      toast.error(result.error ?? "Terjadi kesalahan");
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggle}
      disabled={isLoading}
      aria-label={isWishlisted ? "Hapus dari wishlist" : "Tambah ke wishlist"}
    >
      <Heart
        className={isWishlisted ? "fill-red-500 text-red-500" : ""}
        aria-hidden="true"
      />
    </Button>
  );
}
