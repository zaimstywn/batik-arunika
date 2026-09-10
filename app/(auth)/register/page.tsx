import type { Metadata } from "next";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RegisterForm } from "@/features/auth/components/register-form";

export const metadata: Metadata = {
  title: "Daftar",
  description: "Buat akun Batik Arunika untuk mulai berbelanja.",
};

export default function RegisterPage() {
  return (
    <main className="bg-background">
      <div className="mx-auto w-full max-w-md px-4 py-14 sm:px-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Daftar Akun Baru</CardTitle>
            <CardDescription>
              Buat akun untuk checkout lebih cepat dan pantau pesanan Anda.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm />
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Sudah punya akun?{" "}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Masuk di sini
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
