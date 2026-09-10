import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  imageUrl: string | null;
  maxStock: number;
  quantity: number;
};

type AddItemInput = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  imageUrl: string | null;
  maxStock: number;
  quantity?: number;
};

type CartState = {
  items: CartItem[];
  addItem: (input: AddItemInput) => { added: number; capped: boolean };
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
};

function clampQuantity(quantity: number, maxStock: number): number {
  if (maxStock <= 0) return 0;
  return Math.min(Math.max(1, Math.floor(quantity)), maxStock);
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (input) => {
        if (input.maxStock <= 0) {
          return { added: 0, capped: true };
        }
        const quantity = clampQuantity(input.quantity ?? 1, input.maxStock);
        const existing = get().items.find((item) => item.productId === input.productId);

        if (!existing) {
          set({
            items: [
              ...get().items,
              {
                productId: input.productId,
                slug: input.slug,
                name: input.name,
                price: input.price,
                imageUrl: input.imageUrl,
                maxStock: input.maxStock,
                quantity,
              },
            ],
          });
          return { added: quantity, capped: quantity < (input.quantity ?? 1) };
        }

        const nextQuantity = clampQuantity(existing.quantity + quantity, input.maxStock);
        set({
          items: get().items.map((item) =>
            item.productId === input.productId
              ? { ...item, quantity: nextQuantity, maxStock: input.maxStock }
              : item
          ),
        });
        return {
          added: nextQuantity - existing.quantity,
          capped: nextQuantity < existing.quantity + quantity,
        };
      },
      updateQuantity: (productId, quantity) => {
        const item = get().items.find((i) => i.productId === productId);
        if (!item) return;
        const next = clampQuantity(quantity, item.maxStock);
        set({
          items: get().items.map((i) =>
            i.productId === productId ? { ...i, quantity: next } : i
          ),
        });
      },
      removeItem: (productId) => {
        set({ items: get().items.filter((i) => i.productId !== productId) });
      },
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "batik-arunika-cart",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }) as CartState,
    }
  )
);

export function useCartCount(): number {
  return useCartStore((state) => state.items.reduce((sum, item) => sum + item.quantity, 0));
}

export function useCartSubtotal(): number {
  return useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  );
}
