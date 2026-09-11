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
    <main className="bg-background">
      <div className="mx-auto w-full max-w-4xl space-y-6 px-4 py-10 sm:px-6">
        <div>
          <Link
            href="/profile"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "gap-2 pl-0 text-muted-foreground"
            )}
          >
            <ArrowLeft className="size-4" />
            Kembali ke Profil
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
                  <p className="text-muted-foreground">{order.address.phone}</p>
                  <p className="text-muted-foreground">{order.address.full_address}</p>
                  <p className="text-muted-foreground">
                    {order.address.city}, {order.address.province}{" "}
                    {order.address.postal_code}
                  </p>
                </>
              ) : (
                <p className="text-muted-foreground">Alamat tidak tersedia.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Ringkasan Pembayaran</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="font-semibold text-foreground">
                  {formatIDR(order.subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Ongkos kirim</span>
                <span className="font-semibold text-foreground">
                  {formatIDR(order.shipping_cost)}
                </span>
              </div>
              <div className="flex justify-between border-t border-border pt-2 text-base font-bold">
                <span>Total</span>
                <span className="text-primary">{formatIDR(order.grand_total)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Produk Dibeli</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-border">
              {order.items.map((item) => (
                <li key={item.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                  <div>
                    <p className="font-semibold">{item.product_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatIDR(item.price_at_time)} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold">
                    {formatIDR(item.price_at_time * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
