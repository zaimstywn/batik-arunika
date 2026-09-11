import { getCustomerWishlist } from "@/features/wishlist/services";
import WishlistPageClient from "@/features/wishlist/components/wishlist-client";

export const metadata = {
  title: "Wishlist",
  description: "Lihat daftar produk favorit Anda.",
};

export default async function WishlistPage() {
  const initialWishlist = await getCustomerWishlist().catch(() => []);

  return <WishlistPageClient initialWishlist={initialWishlist} />;
}
