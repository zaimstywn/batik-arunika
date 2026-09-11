import Link from "next/link";
import { ArrowRight, Package, ShoppingBag } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyState } from "@/components/common/empty-state";
import {
  OrderStatusBadge,
  PaymentStatusBadge,
  formatShortId,
} from "@/components/orders/order-status-badge";
import { getCustomerOrders } from "@/features/orders/services";
import { formatIDR } from "@/lib/format";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Dashboard",
  description: "Dashboard pelanggan Batik Arunika.",
};

export default async function DashboardPage() {
  const orders = await getCustomerOrders().catch(() => []);
  const recentOrders = orders.slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pesanan</CardTitle>
            <ShoppingBag className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
            <p className="text-xs text-muted-foreground">
              Semua pesanan Anda
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pesanan Aktif
            </CardTitle>
            <Package className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                orders.filter(
                  (o) =>
                    o.order_status === "pending_payment" ||
                    o.order_status === "processing" ||
                    o.order_status === "shipped"
                ).length
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Sedang diproses atau dikirim
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Pesanan Terbaru</CardTitle>
              <CardDescription>
                Pantau status pesanan Anda di sini
              </CardDescription>
            </div>
            {orders.length > 3 && (
              <Link
                href="/dashboard/orders"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "gap-1"
                )}
              >
                Lihat Semua
                <ArrowRight className="size-4" />
              </Link>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <EmptyState
              title="Belum ada pesanan"
              message="Mulai belanja dan riwayat pesanan Anda akan tampil di sini."
            />
          ) : (
            <ul className="divide-y divide-border rounded-xl border border-border">
              {recentOrders.map((order) => (
                <li
                  key={order.id}
                  className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="space-y-1">
                    <p className="font-mono text-sm font-semibold">
                      #{formatShortId(order.id)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}{" "}
                      • {formatIDR(order.grand_total)}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <PaymentStatusBadge status={order.payment_status} />
                      <OrderStatusBadge status={order.order_status} />
                    </div>
                  </div>
                  <Link
                    href={`/profile/pesanan/${order.id}`}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" })
                    )}
                  >
                    Detail
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
