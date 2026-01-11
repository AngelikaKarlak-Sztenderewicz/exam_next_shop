'use client';

import Button from '@/components/Button';
import CartItemRow from '@/components/CartItemRow';
import { useCart } from '@/store/cartStore';
import { useRouter } from 'next/navigation';

export default function CartView() {
  const router = useRouter();
  const items = useCart((s) => s.items);

  const total = items
    .reduce((sum, i) => sum + Number(i.price) * i.quantity, 0)
    .toFixed(2);

  return (
    <section className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <h2 className="text-lg font-semibold">Your cart</h2>
        <div className="space-y-3">
          {items.length === 0 ? (
            <p className="text-white">Your cart is empty</p>
          ) : (
            items.map((p) => (
              <CartItemRow
                key={p.id}
                id={p.id}
                name={p.name}
                price={p.price}
                imageUrl={p.imageUrl}
                quantity={p.quantity}
                stock={p.stock}
              />
            ))
          )}
        </div>
      </div>

      <aside className="bg-white border rounded-xl p-4 shadow-sm">
        <h3 className="font-medium text-black">Summary</h3>
        <div className="mt-4 text-sm text-gray-700">Total: {total} $</div>
        <Button
          className="mt-4 w-full py-2 rounded-lg"
          disabled={items.length === 0}
          onClick={() => router.push('/checkout')}
        >
          Przejdź do płatności
        </Button>
      </aside>
    </section>
  );
}
