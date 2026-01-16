'use client';

import { useCart } from '@/store/cartStore';
import CartItemRow from '@/components/CartItemRow';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const router = useRouter();

  const items = useCart((s) => s.items);
  const selectedIds = useCart((s) => s.selectedIds);
  const toggleSelect = useCart((s) => s.toggleSelect);
  const selectAll = useCart((s) => s.selectAll);
  const clearSelection = useCart((s) => s.clearSelection);

  // 🧠 tylko zaznaczone
  const selectedItems = useMemo(
    () => items.filter((i) => selectedIds.includes(i.id)),
    [items, selectedIds]
  );

  const total = useMemo(
    () => selectedItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [selectedItems]
  );

  const allSelected = items.length > 0 && selectedIds.length === items.length;

  // 🟡 KOSZYK PUSTY (fizycznie)
  if (items.length === 0) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-xl text-white">
        Cart is empty
      </div>
    );
  }

  return (
    <section className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* LEFT */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={() => (allSelected ? clearSelection() : selectAll())}
              className="w-5 h-5"
            />
            <span className="font-semibold text-white">Select all</span>
          </div>

          {selectedIds.length === 0 && (
            <span className="text-sm text-orange-400">
              Select at least one product to checkout
            </span>
          )}
        </div>

        <div className="space-y-3">
          {items.map((item) => (
            <CartItemRow
              key={item.id}
              {...item}
              selected={selectedIds.includes(item.id)}
              onToggleSelect={toggleSelect}
            />
          ))}
        </div>
      </div>

      {/* RIGHT */}
      <aside className="bg-[#1f1f1f] border rounded-xl p-6 text-white">
        <h3 className="font-medium text-lg">Summary</h3>

        <div className="mt-4 border-t border-gray-700 pt-4">
          <div className="flex justify-between text-sm text-gray-300">
            <span>
              Products ({selectedItems.reduce((sum, i) => sum + i.quantity, 0)})
            </span>
            <span>${total.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-lg font-semibold mt-4">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <button
            onClick={() => router.push('/checkout')}
            disabled={selectedIds.length === 0}
            className={`mt-6 w-full py-3 rounded-lg font-medium transition
              ${
                selectedIds.length === 0
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-orange-500 hover:bg-orange-600'
              }`}
          >
            Checkout
          </button>
        </div>
      </aside>
    </section>
  );
}
