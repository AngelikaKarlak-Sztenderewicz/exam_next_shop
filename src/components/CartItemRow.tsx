// src/components/CartItemRow.tsx
'use client';

import Image from 'next/image';
import { BinIcon } from './icons/BinIcon';
import QuantitySelector from './QuantitySelector';
import { useCart } from '@/store/cartStore';
import type { CartItem } from '@/types/cart';

interface Props extends CartItem {
  selected: boolean;
  onToggleSelect: (id: number) => void;
}

function notifyRemove(name: string) {
  fetch('/api/notify/cart-remove', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: `${name} usunięto z koszyka` }),
  }).catch(() => {});
}

function notifyAdd(name: string) {
  fetch('/api/notify/cart-add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: `${name} dodano do koszyka` }),
  }).catch(() => {});
}

export default function CartItemRow({
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

  return (
    <div className="border-b py-4">
      <div className="flex gap-4 items-start">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onToggleSelect(id)}
          className="w-5 h-5 mt-2"
        />

        <div className="w-[170px] h-[130px] relative overflow-hidden rounded-md bg-white">
          <Image src={imageUrl} alt={name} fill className="object-cover" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="font-medium truncate">{name}</div>

          <div className="inline-block w-auto bg-orange-500 text-white text-sm rounded px-3 py-1 mt-2">
            {categoryName ?? 'Brak kategorii'}
          </div>

          <div className="mt-2 text-lg">${price.toFixed(2)}</div>
        </div>

        <div className="flex flex-col items-end gap-4">
          <div className="font-semibold">${(price * quantity).toFixed(2)}</div>

          <QuantitySelector
            quantity={quantity}
            stock={stock}
            onIncrease={() => {
              addToCart({
                id,
                name,
                price,
                imageUrl,
                stock,
                quantity: 1,
                categoryName: categoryName ?? 'Brak kategorii',
              });
              notifyAdd(name);
            }}
            onDecrease={() => {
              if (quantity > 1) {
                addToCart({
                  id,
                  name,
                  price,
                  imageUrl,
                  stock,
                  quantity: -1,
                  categoryName: categoryName ?? 'Brak kategorii',
                });
              } else {
                removeFromCart(id);
                notifyRemove(name);
              }
            }}
          />
          <button
            onClick={() => {
              removeFromCart(id);
              notifyRemove(name);
            }}
            aria-label="remove"
          >
            <BinIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
