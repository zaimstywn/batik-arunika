import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  OrderStatusBadge,
  PaymentStatusBadge,
  formatShortId,
} from "@/components/orders/order-status-badge";
import { getCustomerOrderDetail } from "@/features/orders/services";
import { formatIDR } from "@/lib/format";
import { cn } from "@/lib/utils";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Pesanan #${formatShortId(id)}`,
    description: "Detail pesanan Batik Arunika Anda.",
  };
}

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params;
  const order = await getCustomerOrderDetail(id).catch(() => null);

  if (!order) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/dashboard/orders"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "gap-2 pl-0 text-muted-foreground"
          )}
        >
          <ArrowLeft className="size-4" />
          Kembali ke Riwayat Pesanan
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Pesanan #{formatShortId(order.id)}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Dibuat pada{" "}
          {new Date(order.created_at).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <PaymentStatusBadge status={order.payment_status} />
          <OrderStatusBadge status={order.order_status} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Alamat Pengiriman</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            {order.address ? (
              <>
                <p className="font-semibold">{order.address.recipient_name}</p>
                <p>{order.address.full_address}</p>
                <p>
                  {order.address.city}, {order.address.province}{" "}
                  {order.address.postal_code}
                </p>
                <p className="text-muted-foreground">{order.address.phone}</p>
              </>
            ) : (
              <p className="text-muted-foreground">Alamat tidak tersedia</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Ringkasan Pembayaran</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatIDR(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ongkos Kirim</span>
              <span>{formatIDR(order.shipping_cost)}</span>
            </div>
            <div className="border-t border-border pt-2">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatIDR(order.grand_total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Produk yang Dipesan</CardTitle>
        </CardHeader>
        <CardContent>
          {order.items.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Tidak ada produk dalam pesanan ini.
            </p>
          ) : (
            <div className="divide-y divide-border rounded-lg border border-border">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4"
                >
                  <div className="flex-1">
                    <p className="font-medium">{item.product_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.quantity}x {formatIDR(item.price_at_time)}
                    </p>
                  </div>
                  <p className="font-semibold">
                    {formatIDR(item.price_at_time * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
