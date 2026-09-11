import { getServerIntegrationsEnv } from "@/lib/env";

export type ShippingItemInput = {
  productId: string;
  quantity: number;
};

export type ShippingRate = {
  id: string;
  courier: string;
  service: string;
  description: string;
  duration: string;
  price: number;
  isMock: boolean;
};

export const STORE_ORIGIN_POSTAL_CODE = "50275";
export const STORE_ORIGIN_LABEL = "Tembalang, Semarang";

const MOCK_RATES: ShippingRate[] = [
  {
    id: "mock-jne-reg",
    courier: "JNE",
    service: "REG",
    description: "Layanan reguler antar kota",
    duration: "2-3 hari",
    price: 15000,
    isMock: true,
  },
  {
    id: "mock-sicepat-reg",
    courier: "SiCepat",
    service: "REG",
    description: "Layanan reguler ekonomi",
    duration: "2-4 hari",
    price: 18000,
    isMock: true,
  },
  {
    id: "mock-jnt-express",
    courier: "J&T",
    service: "Express",
    description: "Layanan ekspres prioritas",
    duration: "1-2 hari",
    price: 22000,
    isMock: true,
  },
];

type BiteshipRateResponse = {
  success?: boolean;
  pricing?: {
    courier_name?: string;
    courier_service_name?: string;
    description?: string;
    duration?: string;
    price?: number;
  }[];
};

export async function fetchShippingRates(
  destinationPostalCode: string,
  items: ShippingItemInput[]
): Promise<ShippingRate[]> {
  const postalCode = destinationPostalCode.trim();
  if (postalCode.length < 5) {
    throw new Error("Kode pos tujuan minimal 5 digit.");
  }
  if (items.length === 0) {
    throw new Error("Keranjang kosong, tidak ada tarif yang bisa dihitung.");
  }

  const { BITESHIP_API_KEY, BITESHIP_BASE_URL } = getServerIntegrationsEnv();

  if (!BITESHIP_API_KEY) {
    console.warn(
      "[biteship] BITESHIP_API_KEY missing, using mock rates for development."
    );
    return MOCK_RATES;
  }

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const baseUrl = (BITESHIP_BASE_URL ?? "https://api.biteship.com").replace(/\/$/, "");

  try {
    const response = await fetch(`${baseUrl}/v1/rates/couriers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: BITESHIP_API_KEY,
      },
      body: JSON.stringify({
        origin_postal_code: STORE_ORIGIN_POSTAL_CODE,
        destination_postal_code: postalCode,
        couriers: "jne,sicepat,jnt",
        items: [
          {
            name: "Paket Batik Arunika",
            quantity: totalQuantity,
            weight: 500 * totalQuantity,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Biteship request failed with status ${response.status}`);
    }

    const payload = (await response.json()) as BiteshipRateResponse;
    const pricing = Array.isArray(payload.pricing) ? payload.pricing : [];

    const rates = pricing
      .filter(
        (entry): entry is NonNullable<typeof entry> & { price: number } =>
          typeof entry?.price === "number" && entry.price >= 0
      )
      .map((entry, index) => ({
        id: `biteship-${index}-${entry.courier_name ?? "courier"}-${entry.courier_service_name ?? "service"}`,
        courier: entry.courier_name ?? "Kurir",
        service: entry.courier_service_name ?? "Reguler",
        description: entry.description ?? "Layanan pengiriman Biteship",
        duration: entry.duration ?? "-",
        price: entry.price,
        isMock: false,
      }));

    if (rates.length === 0) {
      console.warn("[biteship] Empty live rates, using mock rates fallback.");
      return MOCK_RATES;
    }

    return rates;
  } catch (error) {
    console.warn(
      `[biteship] Live rate request failed (${error instanceof Error ? error.message : "unknown error"}), using mock rates fallback.`
    );
    return MOCK_RATES;
  }
}
