import type { Metadata } from "next";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "@/features/auth/components/login-form";

export const metadata: Metadata = {
  title: "Masuk",
  description: "Masuk ke akun Batik Arunika untuk berbelanja.",
};

export default function LoginPage() {
  return (
    <main className="bg-background">
      <div className="mx-auto w-full max-w-md px-4 py-14 sm:px-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Masuk ke Batik Arunika</CardTitle>
            <CardDescription>
              Masuk untuk mengelola pesanan dan berbelanja di toko resmi kami.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Belum punya akun?{" "}
              <Link href="/register" className="font-medium text-primary hover:underline">
                Daftar di sini
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
