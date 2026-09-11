"use client";

import { useState } from "react";
import { Plus, Trash2, Edit, CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/common/empty-state";
import { Badge } from "@/components/ui/badge";
import { AddressForm } from "@/features/addresses/components/address-form";
import {
  AddressFormData,
  deleteAddress,
  setDefaultAddress,
  createAddress,
  updateAddress,
} from "@/features/addresses/services";
import type { Address } from "@/types";

export default function AddressesPageClient({
  initialAddresses,
}: {
  initialAddresses: Address[];
}) {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [isOpen, setIsOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const handleSaveAddress = async (data: AddressFormData) => {
    if (editingAddress) {
      const result = await updateAddress(editingAddress.id, data);
      if (result.success && result.data) {
        setAddresses(
          addresses.map((a) => (a.id === editingAddress.id ? result.data! : a))
        );
      }
    } else {
      const result = await createAddress(data);
      if (result.success && result.data) {
        setAddresses([result.data, ...addresses]);
      }
    }
  };

  const handleDelete = async (addressId: string) => {
    const result = await deleteAddress(addressId);
    if (result.success) {
      setAddresses(addresses.filter((a) => a.id !== addressId));
    }
  };

  const handleSetDefault = async (addressId: string) => {
    const result = await setDefaultAddress(addressId);
    if (result.success) {
      setAddresses(
        addresses.map((a) => ({
          ...a,
          is_default: a.id === addressId,
        }))
      );
    }
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setIsOpen(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Buku Alamat</CardTitle>
          <Button
            onClick={() => {
              setEditingAddress(null);
              setIsOpen(true);
            }}
          >
            <Plus className="mr-2 size-4" />
            Tambah Alamat
          </Button>
        </CardHeader>
        <CardContent>
          {addresses.length === 0 ? (
            <EmptyState
              title="Belum ada alamat"
              message="Tambahkan alamat pengiriman untuk memudahkan proses checkout."
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {addresses.map((address) => (
                <Card
                  key={address.id}
                  className="flex flex-col justify-between p-4"
                >
                  <div>
                    {address.is_default && (
                      <Badge className="mb-2" variant="secondary">
                        <CheckCircle2 className="mr-1 size-3" />
                        Utama
                      </Badge>
                    )}
                    <div className="space-y-1 text-sm">
                      <p className="font-semibold text-foreground">
                        {address.recipient_name}
                      </p>
                      <p>{address.phone}</p>
                      <p className="line-clamp-2 text-muted-foreground">
                        {address.full_address}
                      </p>
                      <p>
                        {address.city}, {address.province} {address.postal_code}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(address)}
                      className="text-primary hover:bg-primary/10 hover:text-primary"
                    >
                      <Edit className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSetDefault(address.id)}
                      className="text-primary hover:bg-primary/10 hover:text-primary"
                    >
                      {address.is_default ? (
                        <CheckCircle2 className="size-4" />
                      ) : (
                        <Circle className="size-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(address.id)}
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      <AddressForm
        open={isOpen}
        onOpenChange={setIsOpen}
        onSubmit={handleSaveAddress}
        initialData={
          editingAddress
            ? {
                recipient_name: editingAddress.recipient_name,
                phone: editingAddress.phone,
                full_address: editingAddress.full_address,
                city: editingAddress.city,
                province: editingAddress.province,
                postal_code: editingAddress.postal_code,
                is_default: editingAddress.is_default ?? false,
              }
            : undefined
        }
        isEditing={!!editingAddress}
      />
    </div>
  );
}
