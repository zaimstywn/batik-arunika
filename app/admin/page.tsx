import Link from "next/link";
import { Banknote, Package, ShoppingBag, Wallet } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  OrderStatusBadge,
  PaymentStatusBadge,
  formatShortId,
} from "@/components/orders/order-status-badge";
import { getAdminDashboardStats } from "@/features/orders/services";
import { formatIDR } from "@/lib/format";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Admin",
  description: "Ringkasan toko Batik Arunika.",
};

export default async function AdminOverviewPage() {
  const stats = await getAdminDashboardStats().catch((error: Error) => {
    console.warn(`[admin] Failed to load dashboard: ${error.message}`);
    return {
      totalOrders: 0,
      totalProducts: 0,
      totalRevenue: 0,
      pendingOrders: 0,
      recentOrders: [],
    };
  });

  const statCards = [
    {
      label: "Total Pendapatan",
      value: formatIDR(stats.totalRevenue),
      hint: "Pesanan lunas / terkirim / selesai",
      icon: Banknote,
    },
    {
      label: "Total Pesanan",
      value: String(stats.totalOrders),
      hint: `${stats.pendingOrders} menunggu pembayaran`,
      icon: ShoppingBag,
    },
    {
      label: "Total Produk",
      value: String(stats.totalProducts),
      hint: "Katalog aktif di toko",
      icon: Package,
    },
    {
      label: "Perlu Tindakan",
      value: String(stats.pendingOrders),
      hint: "Pesanan pending_payment",
      icon: Wallet,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className="size-4 text-primary" aria-hidden="true" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{stat.hint}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Pesanan Terbaru</CardTitle>
            <CardDescription>5 transaksi terakhir yang masuk.</CardDescription>
          </div>
          <Link
            href="/admin/orders"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            Lihat Semua
          </Link>
        </CardHeader>
        <CardContent>
          {stats.recentOrders.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Belum ada pesanan tercatat.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {stats.recentOrders.map((order) => (
                <li
                  key={order.id}
                  className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-mono text-sm font-semibold">
                      #{formatShortId(order.id)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}{" "}
                      • {formatIDR(order.grand_total)}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <PaymentStatusBadge status={order.payment_status} />
                    <OrderStatusBadge status={order.order_status} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
