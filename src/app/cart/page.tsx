"use client";

import { useEffect, useState } from "react";

type CartItem = {
  id: number;
  quantity: number;
  totalPrice: number;
  product: { name: string; price: number };
};

export default function CartPage() {
  const [cart, setCart] = useState<{ items: CartItem[]; totalAmount: number }>({
    items: [],
    totalAmount: 0,
  });

  useEffect(() => {
    fetch("/api/cart")
      .then((res) => res.json())
      .then(setCart);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Twój koszyk</h1>
      {cart.items.length === 0 ? (
        <p>Koszyk jest pusty</p>
      ) : (
        <div>
          {cart.items.map((item) => (
            <div key={item.id} className="flex justify-between border-b py-2">
              <span>
                {item.product.name} x {item.quantity}
              </span>
              <span>{item.totalPrice.toFixed(2)}$</span>
            </div>
          ))}
          <div className="font-bold text-lg mt-2">
            Suma: {cart.totalAmount.toFixed(2)} $
          </div>
        </div>
      )}
    </div>
  );
}
