import { getServerIntegrationsEnv } from "@/lib/env";

export type MidtransCustomerDetails = {
  firstName: string;
  email?: string;
  phone?: string;
};

export type MidtransItemDetails = {
  id: string;
  price: number;
  quantity: number;
  name: string;
};

export type MidtransTransactionResult = {
  token: string;
  redirectUrl?: string;
  isMock: boolean;
};

function snapBaseUrl(isProduction: boolean): string {
  return isProduction
    ? "https://app.midtrans.com/snap/v1/transactions"
    : "https://app.sandbox.midtrans.com/snap/v1/transactions";
}

export async function createMidtransTransaction(
  orderId: string,
  grossAmount: number,
  customer: MidtransCustomerDetails,
  items: MidtransItemDetails[]
): Promise<MidtransTransactionResult> {
  const { MIDTRANS_SERVER_KEY, MIDTRANS_IS_PRODUCTION } =
    getServerIntegrationsEnv();

  if (!MIDTRANS_SERVER_KEY) {
    console.warn(
      "[midtrans] MIDTRANS_SERVER_KEY missing, using mock Snap token for development."
    );
    return {
      token: `mock-snap-token-${orderId.slice(0, 8)}`,
      isMock: true,
    };
  }

  const response = await fetch(snapBaseUrl(MIDTRANS_IS_PRODUCTION === "true"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Basic ${Buffer.from(`${MIDTRANS_SERVER_KEY}:`).toString("base64")}`,
    },
    body: JSON.stringify({
      transaction_details: {
        order_id: orderId,
        gross_amount: grossAmount,
      },
      customer_details: {
        first_name: customer.firstName,
        email: customer.email,
        phone: customer.phone,
      },
      item_details: items,
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Midtrans Snap request failed (${response.status}): ${body}`);
  }

  const payload = (await response.json()) as {
    token?: string;
    redirect_url?: string;
  };

  if (!payload.token) {
    throw new Error("Midtrans Snap response did not include a token.");
  }

  return {
    token: payload.token,
    redirectUrl: payload.redirect_url,
    isMock: false,
  };
}
