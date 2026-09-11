"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Mail, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { updateProfile, updatePassword, type ProfileUpdateData, type PasswordUpdateData } from "@/features/settings/services";

export default function SettingsPageClient({
  initialProfile,
}: {
  initialProfile: { email: string; full_name?: string; phone?: string };
}) {
  const [profile] = useState(initialProfile);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm<ProfileUpdateData>({
    defaultValues: {
      full_name: profile.full_name || "",
      phone: profile.phone || "",
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors },
  } = useForm<PasswordUpdateData>();

  const onProfileSubmit = async (data: ProfileUpdateData) => {
    setIsProfileLoading(true);
    const result = await updateProfile(data);
    setIsProfileLoading(false);

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.error);
    }
  };

  const onPasswordSubmit = async (data: PasswordUpdateData) => {
    setIsPasswordLoading(true);
    const result = await updatePassword(data);
    setIsPasswordLoading(false);

    if (result.success) {
      toast.success(result.message);
      resetPasswordForm();
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informasi Profil</CardTitle>
          <CardDescription>
            Perbarui nama dan kontak Anda.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <div className="flex items-center gap-2">
                <Input
                  id="email"
                  value={profile.email}
                  readOnly
                  className="bg-muted text-muted-foreground"
                />
                <Badge variant="secondary">
                  <Mail className="mr-1 size-3" />
                  Tidak dapat diubah
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="full_name" className="text-sm font-medium">Nama Lengkap</label>
              <Input
                id="full_name"
                {...registerProfile("full_name", {
                  required: "Nama wajib diisi",
                })}
                placeholder="John Doe"
              />
              {profileErrors.full_name && (
                <p className="text-xs text-destructive">
                  {profileErrors.full_name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">Nomor Telepon</label>
              <Input
                id="phone"
                {...registerProfile("phone", {
                  pattern: {
                    value: /^[\d\s\-+()]+$/,
                    message: "Nomor telepon tidak valid",
                  },
                })}
                placeholder="08123456789"
              />
              {profileErrors.phone && (
                <p className="text-xs text-destructive">{profileErrors.phone.message}</p>
              )}
            </div>

            <Button type="submit" disabled={isProfileLoading}>
              <Save className="mr-2 size-4" />
              {isProfileLoading ? "Menyimpan..." : "Simpan Profil"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Keamanan</CardTitle>
          <CardDescription>
            Ganti password untuk menjaga keamanan akun Anda.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="currentPassword" className="text-sm font-medium">Password Saat Ini</label>
              <Input
                id="currentPassword"
                type="password"
                {...registerPassword("currentPassword", {
                  required: "Password saat ini wajib diisi",
                })}
                placeholder="••••••••"
              />
              {passwordErrors.currentPassword && (
                <p className="text-xs text-destructive">
                  {passwordErrors.currentPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="newPassword" className="text-sm font-medium">Password Baru</label>
              <Input
                id="newPassword"
                type="password"
                {...registerPassword("newPassword", {
                  required: "Password baru wajib diisi",
                  minLength: {
                    value: 8,
                    message: "Password minimal 8 karakter",
                  },
                })}
                placeholder="••••••••"
              />
              {passwordErrors.newPassword && (
                <p className="text-xs text-destructive">
                  {passwordErrors.newPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">Konfirmasi Password Baru</label>
              <Input
                id="confirmPassword"
                type="password"
                {...registerPassword("confirmPassword", {
                  required: "Konfirmasi password wajib diisi",
                })}
                placeholder="••••••••"
              />
              {passwordErrors.confirmPassword && (
                <p className="text-xs text-destructive">
                  {passwordErrors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button type="submit" disabled={isPasswordLoading}>
              {isPasswordLoading ? "Mengganti..." : "Ganti Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
