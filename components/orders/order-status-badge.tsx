import { Badge } from "@/components/ui/badge";
import type { OrderStatus, PaymentStatus } from "@/types";

const paymentLabels: Record<PaymentStatus, string> = {
  pending: "Menunggu Bayar",
  paid: "Lunas",
  failed: "Gagal",
};

const orderLabels: Record<OrderStatus, string> = {
  pending_payment: "Menunggu Pembayaran",
  processing: "Diproses",
  shipped: "Dikirim",
  completed: "Selesai",
  cancelled: "Dibatalkan",
};

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const variant =
    status === "paid" ? "default" : status === "failed" ? "destructive" : "secondary";
  return <Badge variant={variant}>{paymentLabels[status]}</Badge>;
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const variant =
    status === "cancelled"
      ? "destructive"
      : status === "completed"
        ? "default"
        : status === "pending_payment"
          ? "secondary"
          : "outline";
  return <Badge variant={variant}>{orderLabels[status]}</Badge>;
}

export function formatShortId(id: string): string {
  return id.length > 8 ? `${id.slice(0, 8).toUpperCase()}` : id.toUpperCase();
}
