import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '@/types/cart';
import { useUIStore } from './uiStore';

type CartState = {
  items: CartItem[];
  selectedIds: number[];

  addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeFromCart: (id: number) => void;
  toggleSelect: (id: number) => void;
  selectAll: () => void;
  clearSelection: () => void;
  clearCart: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      selectedIds: [],

      addToCart: (item) =>
        set((state) => {
          const { showToast } = useUIStore.getState();

          const existing = state.items.find((i) => i.id === item.id);

          if (existing) {
            const newItems = state.items.map((i) =>
              i.id === item.id
                ? {
                    ...i,
                    quantity: Math.min(
                      i.quantity + (item.quantity ?? 1),
                      i.stock
                    ),
                  }
                : i
            );

            showToast('Product quantity updated');
            return { items: newItems };
          }

          const newItem: CartItem = {
            ...item,
            quantity: item.quantity ?? 1,
          } as CartItem;

          showToast('Product added to cart');

          return {
            items: [...state.items, newItem],
            selectedIds: [...state.selectedIds, newItem.id],
          };
        }),

      removeFromCart: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
          selectedIds: state.selectedIds.filter((sid) => sid !== id),
        })),

      toggleSelect: (id) =>
        set((state) => ({
          selectedIds: state.selectedIds.includes(id)
            ? state.selectedIds.filter((x) => x !== id)
            : [...state.selectedIds, id],
        })),

      selectAll: () =>
        set((state) => ({
          selectedIds: state.items.map((i) => i.id),
        })),

      clearSelection: () => set({ selectedIds: [] }),

      clearCart: () => set({ items: [], selectedIds: [] }),
    }),
    {
      name: 'cart-storage', 
    }
  )
);
