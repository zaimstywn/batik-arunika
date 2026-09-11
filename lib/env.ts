import { z } from "zod";

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .url("NEXT_PUBLIC_SUPABASE_URL must be a valid URL"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY is required"),
  NEXT_PUBLIC_APP_URL: z.string().min(1).default("http://localhost:3000"),
  NEXT_PUBLIC_APP_NAME: z.string().min(1).default("Batik Arunika"),
  NEXT_PUBLIC_MIDTRANS_CLIENT_KEY: z.string().min(1).optional(),
});

export function getPublicEnv() {
  const parsed = publicEnvSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_MIDTRANS_CLIENT_KEY:
      process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || undefined,
  });

  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join(", ");
    throw new Error(`Invalid public environment variables: ${issues}`);
  }

  return parsed.data;
}

const serverIntegrationsSchema = z.object({
  ADMIN_EMAIL: z.string().email().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  MIDTRANS_SERVER_KEY: z.string().min(1).optional(),
  MIDTRANS_IS_PRODUCTION: z.enum(["true", "false"]).default("false").optional(),
  BITESHIP_API_KEY: z.string().min(1).optional(),
  BITESHIP_BASE_URL: z.string().url().default("https://api.biteship.com").optional(),
});

export type ServerIntegrationsEnv = z.infer<typeof serverIntegrationsSchema>;

export function getServerIntegrationsEnv(): ServerIntegrationsEnv {
  const parsed = serverIntegrationsSchema.safeParse({
    ADMIN_EMAIL: process.env.ADMIN_EMAIL || undefined,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || undefined,
    MIDTRANS_SERVER_KEY: process.env.MIDTRANS_SERVER_KEY || undefined,
    MIDTRANS_IS_PRODUCTION: process.env.MIDTRANS_IS_PRODUCTION || undefined,
    BITESHIP_API_KEY: process.env.BITESHIP_API_KEY || undefined,
    BITESHIP_BASE_URL: process.env.BITESHIP_BASE_URL || undefined,
  });

  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join(", ");
    throw new Error(`Invalid server integration variables: ${issues}`);
  }

  return parsed.data;
}
