import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerIntegrationsEnv } from "@/lib/env";
import { createServiceClient } from "@/lib/supabase/service";
import type { OrderStatus, PaymentStatus } from "@/types";

const xenditInvoiceCallbackSchema = z.object({
  id: z.string().optional(),
  external_id: z.string().min(1),
  status: z.string().min(1),
  payment_method: z.string().optional(),
  payment_channel: z.string().optional(),
  paid_amount: z.number().optional(),
});

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export async function POST(request: Request) {
  const { XENDIT_WEBHOOK_TOKEN } = getServerIntegrationsEnv();

  // If token is configured, enforce strict verification against x-callback-token
  if (XENDIT_WEBHOOK_TOKEN) {
    const callbackToken = request.headers.get("x-callback-token");
    if (!callbackToken || !timingSafeEqual(callbackToken, XENDIT_WEBHOOK_TOKEN)) {
      return NextResponse.json(
        { message: "Token verifikasi webhook tidak valid." },
        { status: 401 }
      );
    }
  } else {
    console.warn(
      "[xendit] XENDIT_WEBHOOK_TOKEN missing. Accepting callback in development fallback mode."
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Payload JSON tidak valid." },
      { status: 400 }
    );
  }

  const parsed = xenditInvoiceCallbackSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Payload invoice Xendit tidak lengkap." },
      { status: 400 }
    );
  }

  const { external_id: orderId, status } = parsed.data;

  let paymentStatus: PaymentStatus = "pending";
  let orderStatus: OrderStatus = "pending_payment";

  const normalizedStatus = status.toUpperCase();

  switch (normalizedStatus) {
    case "PAID":
    case "SETTLED":
      paymentStatus = "paid";
      orderStatus = "processing";
      break;
    case "PENDING":
      paymentStatus = "pending";
      orderStatus = "pending_payment";
      break;
    case "EXPIRED":
      paymentStatus = "failed";
      orderStatus = "cancelled";
      break;
    default:
      return NextResponse.json({
        message: `Status invoice '${status}' diabaikan.`,
      });
  }

  try {
    const supabase = createServiceClient();
    const { error } = await supabase
      .from("orders")
      .update({
        payment_status: paymentStatus,
        order_status: orderStatus,
      })
      .eq("id", orderId);

    if (error) {
      return NextResponse.json(
        { message: `Gagal memperbarui pesanan: ${error.message}` },
        { status: 500 }
      );
    }
  } catch (err) {
    return NextResponse.json(
      {
        message:
          err instanceof Error
            ? err.message
            : "Gagal terhubung ke database service.",
      },
      { status: 503 }
    );
  }

  return NextResponse.json({
    message: "Webhook Xendit berhasil diproses.",
    orderId,
    status: normalizedStatus,
  });
}
