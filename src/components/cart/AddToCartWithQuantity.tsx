'use client';

import { useState } from 'react';
import { useCart } from '@/store/cartStore';
import { CartIcon } from '../icons';
import { Button, QuantitySelector } from '../ui';

interface Props {
  productId: number;
  name: string;
  price: number;
  imageUrl: string;
  stock: number;
  categoryName: string;
}

export function AddToCartWithQuantity({
  productId,
  name,
  price,
  imageUrl,
  stock,
  categoryName,
}: Props) {
  const [quantity, setQuantity] = useState(1);
  const addToCart = useCart((s) => s.addToCart);

  const handleAddToCart = () => {
    if (stock <= 0) return;

    addToCart({
      id: productId,
      name,
      price,
      imageUrl,
      stock,
      quantity,
      categoryName,
    });
    fetch('/api/notify/cart-add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: `${quantity} x ${name} dodano do koszyka`,
      }),
    }).catch(() => {});
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      <span>Quantity</span>
      <div className="flex gap-4 items-center">
        <QuantitySelector
          quantity={quantity}
          stock={stock}
          onIncrease={() => setQuantity((q) => Math.min(q + 1, stock))}
          onDecrease={() => setQuantity((q) => Math.max(q - 1, 1))}
        />
        <span>Stock: {stock}</span>
      </div>
      <div className="flex justify-between items-center py-2">
        <span>Subtotal:</span>
        <span className="text-2xl">{(price * quantity).toFixed(2)}$</span>
      </div>
      <Button
        className="w-full bg-transparent border border-customOrange text-customOrange"
        disabled={stock === 0}
        onClick={handleAddToCart}
      >
        <span className=" items-center flex gap-2 justify-center">
          Add to Cart <CartIcon />
        </span>
      </Button>
    </div>
  );
}
