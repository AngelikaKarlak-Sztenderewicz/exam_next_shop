import { create } from "zustand";
import type { StateCreator } from "zustand";

export type CartItem = {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  stock: number;
};

type CartState = {
  items: CartItem[];
 addToCart: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeFromCart: (id: number) => void;
};

const cartStore: StateCreator<CartState> = (set) => ({
  items: [],

  addToCart: (item) =>
    set((state) => {
      const existing = state.items.find((i) => i.id === item.id);

      if (existing) {
        const newQuantity = Math.min(
          existing.quantity + (item.quantity ?? 1),
          existing.stock
        );
        return {
          items: state.items.map((i) =>
            i.id === item.id ? { ...i, quantity: newQuantity } : i
          ),
        };
      }

      return {
        items: [...state.items, { ...item, quantity: item.quantity ?? 1 }],
      };
    }),

  removeFromCart: (id) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    })),
});

export const useCart = create<CartState>(cartStore);
