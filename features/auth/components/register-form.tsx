"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerAction } from "@/features/auth/actions";
import { registerSchema, type RegisterInput } from "@/features/auth/schemas";

export function RegisterForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverNotice, setServerNotice] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (values: RegisterInput) => {
    setServerError(null);
    setServerNotice(null);
    const result = await registerAction(values);
    if (!result.success) {
      const message = result.message ?? "Gagal mendaftar. Silakan coba lagi.";
      setServerError(message);
      toast.error(message);
      return;
    }
    if (result.message) {
      setServerNotice(result.message);
      toast.success("Pendaftaran berhasil");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <label htmlFor="register-name" className="text-sm font-medium">
          Nama
        </label>
        <Input
          id="register-name"
          type="text"
          autoComplete="name"
          placeholder="Nama lengkap"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "register-name-error" : undefined}
          {...register("name")}
        />
        {errors.name ? (
          <p id="register-name-error" className="text-xs text-destructive">
            {errors.name.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="register-email" className="text-sm font-medium">
          Email
        </label>
        <Input
          id="register-email"
          type="email"
          autoComplete="email"
          placeholder="nama@email.com"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "register-email-error" : undefined}
          {...register("email")}
        />
        {errors.email ? (
          <p id="register-email-error" className="text-xs text-destructive">
            {errors.email.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="register-password" className="text-sm font-medium">
          Password
        </label>
        <Input
          id="register-password"
          type="password"
          autoComplete="new-password"
          placeholder="Minimal 6 karakter"
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? "register-password-error" : undefined}
          {...register("password")}
        />
        {errors.password ? (
          <p id="register-password-error" className="text-xs text-destructive">
            {errors.password.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="register-confirm-password" className="text-sm font-medium">
          Konfirmasi Password
        </label>
        <Input
          id="register-confirm-password"
          type="password"
          autoComplete="new-password"
          placeholder="Ulangi password"
          aria-invalid={!!errors.confirmPassword}
          aria-describedby={errors.confirmPassword ? "register-confirm-password-error" : undefined}
          {...register("confirmPassword")}
        />
        {errors.confirmPassword ? (
          <p id="register-confirm-password-error" className="text-xs text-destructive">
            {errors.confirmPassword.message}
          </p>
        ) : null}
      </div>

      {serverError ? (
        <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {serverError}
        </p>
      ) : null}

      {serverNotice ? (
        <p role="status" className="rounded-lg bg-primary/10 px-3 py-2 text-sm text-foreground">
          {serverNotice}
        </p>
      ) : null}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin" aria-hidden="true" />
            Memproses...
          </>
        ) : (
          "Daftar"
        )}
      </Button>
    </form>
  );
}
