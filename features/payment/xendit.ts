import { getPublicEnv, getServerIntegrationsEnv } from "@/lib/env";

export type XenditCustomerDetails = {
  givenNames: string;
  email?: string;
  mobileNumber?: string;
};

export type XenditItemDetails = {
  name: string;
  quantity: number;
  price: number;
  category?: string;
};

export type XenditInvoiceResult = {
  id: string;
  invoiceUrl: string;
  status: string;
  isMock: boolean;
};

const XENDIT_INVOICE_ENDPOINT = "https://api.xendit.co/v2/invoices";

export async function createInvoice(
  orderId: string,
  amount: number,
  customer: XenditCustomerDetails,
  items: XenditItemDetails[]
): Promise<XenditInvoiceResult> {
  const { XENDIT_SECRET_KEY } = getServerIntegrationsEnv();
  const { NEXT_PUBLIC_APP_URL } = getPublicEnv();

  if (!XENDIT_SECRET_KEY) {
    console.warn(
      "[xendit] XENDIT_SECRET_KEY missing, using mock invoice URL for development."
    );
    return {
      id: `mock-xendit-${orderId.slice(0, 8)}`,
      invoiceUrl: `${NEXT_PUBLIC_APP_URL}/checkout/success?orderId=${orderId}&status=mock_paid`,
      status: "PENDING",
      isMock: true,
    };
  }

  const successUrl = `${NEXT_PUBLIC_APP_URL}/checkout/success?orderId=${orderId}&status=success`;
  const failureUrl = `${NEXT_PUBLIC_APP_URL}/checkout/success?orderId=${orderId}&status=error`;

  const authHeader = `Basic ${Buffer.from(`${XENDIT_SECRET_KEY}:`).toString("base64")}`;

  const body = {
    external_id: orderId,
    amount,
    payer_email: customer.email,
    description: `Pesanan Batik Arunika #${orderId.slice(0, 8).toUpperCase()}`,
    customer: {
      given_names: customer.givenNames,
      email: customer.email,
      mobile_number: customer.mobileNumber,
    },
    items: items.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      category: item.category ?? "Batik",
    })),
    success_redirect_url: successUrl,
    failure_redirect_url: failureUrl,
    currency: "IDR",
  };

  const response = await fetch(XENDIT_INVOICE_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    throw new Error(
      `Xendit Invoice creation failed (${response.status}): ${errorBody}`
    );
  }

  const payload = (await response.json()) as {
    id?: string;
    invoice_url?: string;
    status?: string;
  };

  if (!payload.invoice_url || !payload.id) {
    throw new Error("Xendit Invoice response did not include invoice_url or id.");
  }

  return {
    id: payload.id,
    invoiceUrl: payload.invoice_url,
    status: payload.status ?? "PENDING",
    isMock: false,
  };
}
