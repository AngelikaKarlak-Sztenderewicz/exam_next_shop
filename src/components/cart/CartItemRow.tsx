'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/store/cartStore';
import type { CartItem } from '@/types/cart';
import { CheckoutItem } from './CheckoutItem';

interface Props extends CartItem {
  selected: boolean;
  onToggleSelect: (id: number) => void;
}

export function CartItemRow({
  id,
  name,
  categoryName,
  price,
  imageUrl,
  quantity,
  stock,
  selected,
  onToggleSelect,
}: Props) {
  const addToCart = useCart((s) => s.addToCart);
  const removeFromCart = useCart((s) => s.removeFromCart);

  const [showNoteEditor, setShowNoteEditor] = useState<Record<number, boolean>>(
    {}
  );
  const [notes, setNotes] = useState<Record<number, string>>({});

  const toggleNote = (nid: number) =>
    setShowNoteEditor((prev) => ({ ...prev, [nid]: !prev[nid] }));

  const updateNote = (nid: number, value: string) =>
    setNotes((prev) => ({ ...prev, [nid]: value }));

  const item: CartItem = {
    id,
    name,
    categoryName,
    price,
    imageUrl,
    quantity,
    stock,
  };

  return (
    <div className="flex gap-4 items-start">
      <input
        type="checkbox"
        checked={selected}
        onChange={() => onToggleSelect(id)}
        className="w-5 h-5 accent-customOrange mt-2"
      />
      <Link
        href={`/products/${id}`}
        className="flex-1 rounded-md bg-customGray p-6 block hover:ring-1 hover:ring-customOrange transition"
      >
        <CheckoutItem
          item={item}
          addToCart={(p) => {
            addToCart(p);
          }}
          removeFromCart={(itemId) => {
            removeFromCart(itemId);
          }}
          showNoteEditor={showNoteEditor}
          toggleNote={toggleNote}
          notes={notes}
          updateNote={updateNote}
          showRemove={true}
          onRemove={(itemId) => removeFromCart(itemId)}
        />
      </Link>
    </div>
  );
}
