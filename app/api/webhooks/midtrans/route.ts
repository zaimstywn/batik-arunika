import { createHash } from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerIntegrationsEnv } from "@/lib/env";
import { createServiceClient } from "@/lib/supabase/service";

const webhookPayloadSchema = z.object({
  order_id: z.string().min(1),
  status_code: z.string().min(1),
  gross_amount: z.string().min(1),
  signature_key: z.string().min(1),
  transaction_status: z.string().min(1),
});

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: "Payload JSON tidak valid." }, { status: 400 });
  }

  const parsed = webhookPayloadSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ message: "Payload Midtrans tidak lengkap." }, { status: 400 });
  }

  const { order_id, status_code, gross_amount, signature_key, transaction_status } =
    parsed.data;

  const { MIDTRANS_SERVER_KEY } = getServerIntegrationsEnv();
  if (!MIDTRANS_SERVER_KEY) {
    return NextResponse.json(
      { message: "Webhook belum dikonfigurasi (server key hilang)." },
      { status: 503 }
    );
  }

  const expectedSignature = createHash("sha512")
    .update(`${order_id}${status_code}${gross_amount}${MIDTRANS_SERVER_KEY}`)
    .digest("hex");

  if (!timingSafeEqualHex(expectedSignature, signature_key)) {
    return NextResponse.json({ message: "Tanda tangan tidak valid." }, { status: 401 });
  }

  let paymentStatus: "pending" | "paid" | "failed" = "pending";
  let orderStatus:
    | "pending_payment"
    | "processing"
    | "shipped"
    | "completed"
    | "cancelled" = "pending_payment";

  switch (transaction_status) {
    case "capture":
    case "settlement":
      paymentStatus = "paid";
      orderStatus = "processing";
      break;
    case "pending":
      paymentStatus = "pending";
      orderStatus = "pending_payment";
      break;
    case "deny":
    case "cancel":
    case "expire":
    case "failure":
      paymentStatus = "failed";
      orderStatus = "cancelled";
      break;
    default:
      return NextResponse.json({ message: "Status transaksi diabaikan." });
  }

  try {
    const supabase = createServiceClient();
    const { error } = await supabase
      .from("orders")
      .update({
        payment_status: paymentStatus,
        order_status: orderStatus,
      })
      .eq("id", order_id);

    if (error) {
      return NextResponse.json(
        { message: "Gagal memperbarui pesanan." },
        { status: 500 }
      );
    }
  } catch {
    return NextResponse.json(
      { message: "Konfigurasi service database belum lengkap." },
      { status: 503 }
    );
  }

  return NextResponse.json({ message: "Webhook diterima." });
}

function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}
