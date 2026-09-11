"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { updateOrderStatusAction } from "@/features/orders/actions";
import type { OrderStatus } from "@/types";

type StatusFormProps = {
  orderId: string;
  currentStatus: OrderStatus;
};

const statusOptions: { value: OrderStatus; label: string }[] = [
  { value: "pending_payment", label: "Menunggu Pembayaran" },
  { value: "processing", label: "Diproses" },
  { value: "shipped", label: "Dikirim" },
  { value: "completed", label: "Selesai" },
  { value: "cancelled", label: "Dibatalkan" },
];

export function StatusForm({ orderId, currentStatus }: StatusFormProps) {
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextStatus = e.target.value as OrderStatus;
    startTransition(async () => {
      const result = await updateOrderStatusAction({
        orderId,
        status: nextStatus,
      });
      if (!result.success) {
        toast.error(result.message ?? "Gagal memperbarui status.");
        return;
      }
      toast.success("Status pesanan diperbarui.");
    });
  };

  return (
    <select
      value={currentStatus}
      onChange={handleChange}
      disabled={isPending}
      className="h-8 rounded-lg border border-input bg-background px-2.5 text-xs font-medium text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
      aria-label="Ubah status pesanan"
    >
      {statusOptions.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
