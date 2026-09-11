import Link from "next/link";
import { Package, ShoppingBag } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata = {
  title: "Admin",
  description: "Panel admin Batik Arunika.",
};

export default function AdminOverviewPage() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Link href="/admin/orders">
        <Card className="h-full p-6 transition-colors hover:border-primary/40">
          <ShoppingBag className="size-6 text-primary" aria-hidden="true" />
          <CardHeader className="px-0">
            <CardTitle>Kelola Pesanan</CardTitle>
            <CardDescription>
              Lihat seluruh pesanan dan perbarui status fulfillment.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            <span className="text-sm font-medium text-primary">Buka pesanan →</span>
          </CardContent>
        </Card>
      </Link>
      <Link href="/admin/products">
        <Card className="h-full p-6 transition-colors hover:border-primary/40">
          <Package className="size-6 text-primary" aria-hidden="true" />
          <CardHeader className="px-0">
            <CardTitle>Kelola Produk</CardTitle>
            <CardDescription>
              Manajemen katalog akan hadir pada milestone berikutnya.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            <span className="text-sm font-medium text-primary">Segera hadir →</span>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
