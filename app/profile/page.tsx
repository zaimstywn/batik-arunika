import Link from "next/link";
import { redirect } from "next/navigation";
import { MapPin, Package } from "lucide-react";
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
import { LogoutButton } from "@/features/auth/components/logout-button";
import { getCustomerOrders } from "@/features/orders/services";
import { createClient } from "@/lib/supabase/server";
import { formatIDR } from "@/lib/format";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Profil",
  description: "Kelola akun Batik Arunika Anda.",
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const displayName =
    typeof user.user_metadata?.full_name === "string" &&
    user.user_metadata.full_name.trim().length > 0
      ? user.user_metadata.full_name
      : "Pelanggan Arunika";

  const orders = await getCustomerOrders().catch(() => []);

  return (
    <main className="bg-background">
      <div className="mx-auto w-full max-w-4xl space-y-6 px-4 py-10 sm:px-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Halo, {displayName}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </CardHeader>
          <CardContent>
            <LogoutButton />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Package className="size-4 text-primary" aria-hidden="true" />
                Riwayat Pesanan
              </CardTitle>
              <CardDescription>Pantau status pesanan Anda.</CardDescription>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <EmptyState
                  title="Belum ada pesanan"
                  message="Riwayat pesanan Anda akan tampil di sini setelah checkout."
                />
              ) : (
                <ul className="divide-y divide-border rounded-xl border border-border">
                  {orders.map((order) => (
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
                        className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                      >
                        Detail
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <MapPin className="size-4 text-primary" aria-hidden="true" />
                Buku Alamat
              </CardTitle>
              <CardDescription>Kelola alamat pengiriman Anda.</CardDescription>
            </CardHeader>
            <CardContent>
              <EmptyState
                title="Belum ada alamat tersimpan"
                message="Fitur buku alamat akan hadir pada milestone berikutnya."
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
