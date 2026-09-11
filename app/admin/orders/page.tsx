import type { Metadata } from "next";
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
import { getAllOrdersForAdmin } from "@/features/orders/services";
import { StatusForm } from "@/app/admin/orders/status-form";
import { formatIDR } from "@/lib/format";

export const metadata: Metadata = {
  title: "Kelola Pesanan",
  description: "Daftar seluruh pesanan Batik Arunika.",
};

export default async function AdminOrdersPage() {
  const orders = await getAllOrdersForAdmin().catch((error: Error) => {
    console.warn(`[admin] Failed to load orders: ${error.message}`);
    return [];
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Semua Pesanan</CardTitle>
        <CardDescription>
          {orders.length} pesanan tercatat. Ubah status fulfillment dari daftar
          berikut.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <EmptyState
            title="Belum ada pesanan"
            message="Pesanan pelanggan akan tampil di sini."
          />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-3xl text-left text-sm">
              <thead className="bg-muted/60 text-xs tracking-wide text-muted-foreground uppercase">
                <tr>
                  <th className="px-4 py-3 font-semibold">Pesanan</th>
                  <th className="px-4 py-3 font-semibold">Pelanggan</th>
                  <th className="px-4 py-3 font-semibold">Tanggal</th>
                  <th className="px-4 py-3 font-semibold">Total</th>
                  <th className="px-4 py-3 font-semibold">Pembayaran</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Ubah Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.map((order) => (
                  <tr key={order.id} className="align-top">
                    <td className="px-4 py-3 font-mono font-semibold">
                      #{formatShortId(order.id)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {order.customer_email ?? "—"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3 font-semibold whitespace-nowrap">
                      {formatIDR(order.grand_total)}
                    </td>
                    <td className="px-4 py-3">
                      <PaymentStatusBadge status={order.payment_status} />
                    </td>
                    <td className="px-4 py-3">
                      <OrderStatusBadge status={order.order_status} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusForm
                        orderId={order.id}
                        currentStatus={order.order_status}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
