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
          const qtyDelta = item.quantity ?? 1;

          if (!existing) {
            if ((item.stock ?? 0) <= 0) {
              showToast('Product is out of stock');
              return state;
            }
            if (qtyDelta <= 0) {
              showToast('Invalid quantity');
              return state;
            }

            const finalQty = Math.min(qtyDelta, item.stock ?? qtyDelta);
            if (finalQty <= 0) {
              showToast('Product is out of stock');
              return state;
            }

            const newItem: CartItem = {
              ...item,
              quantity: finalQty,
            } as CartItem;

            showToast('Product added to cart');

            return {
              items: [...state.items, newItem],
              selectedIds: [...state.selectedIds, newItem.id],
            };
          }

          const currentStock = existing.stock ?? 0;
          const newQtyRaw = existing.quantity + qtyDelta;

          if (newQtyRaw <= 0) {
            showToast('Product removed from cart');
            return {
              items: state.items.filter((i) => i.id !== item.id),
              selectedIds: state.selectedIds.filter((sid) => sid !== item.id),
            };
          }
          if (newQtyRaw > currentStock) {
            if (existing.quantity >= currentStock) {
              showToast('Reached maximum available stock');
              return state;
            }
            const newItems = state.items.map((i) =>
              i.id === item.id ? { ...i, quantity: currentStock } : i
            );
            showToast('Quantity adjusted to available stock');
            return { items: newItems };
          }

          const newItems = state.items.map((i) =>
            i.id === item.id ? { ...i, quantity: newQtyRaw } : i
          );

          showToast('Product quantity updated');
          return { items: newItems };
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
