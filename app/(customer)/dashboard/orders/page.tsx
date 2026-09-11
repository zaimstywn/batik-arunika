import Link from "next/link";
import { EmptyState } from "@/components/common/empty-state";
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
import { getCustomerOrders } from "@/features/orders/services";
import { formatIDR } from "@/lib/format";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export const metadata = {
  title: "Riwayat Pesanan",
  description: "Lihat semua pesanan Anda di Batik Arunika.",
};

export default async function OrdersPage() {
  const orders = await getCustomerOrders().catch(() => []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Pesanan</CardTitle>
          <CardDescription>
            Total {orders.length} pesanan
          </CardDescription>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <EmptyState
              title="Belum ada pesanan"
              message="Mulai belanja dan riwayat pesanan Anda akan tampil di sini."
            />
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <Link
                  key={order.id}
                  href={`/dashboard/orders/${order.id}`}
                  className="block"
                >
                  <div className="flex flex-col gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-muted sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                      <p className="font-mono text-sm font-semibold">
                        #{formatShortId(order.id)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString(
                          "id-ID",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )}{" "}
                        • {formatIDR(order.grand_total)}
                      </p>
                      <div className="flex flex-wrap gap-2 pt-1">
                        <PaymentStatusBadge status={order.payment_status} />
                        <OrderStatusBadge status={order.order_status} />
                      </div>
                    </div>
                    <div
                      className={cn(
                        buttonVariants({ variant: "outline", size: "sm" })
                      )}
                    >
                      Lihat Detail
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
