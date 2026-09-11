import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getPublicEnv, getServerIntegrationsEnv } from "@/lib/env";

export function createServiceClient() {
  const publicEnv = getPublicEnv();
  const { SUPABASE_SERVICE_ROLE_KEY } = getServerIntegrationsEnv();

  if (!SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is required for webhook processing."
    );
  }

  return createSupabaseClient(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
