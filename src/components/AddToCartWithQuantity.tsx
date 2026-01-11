"use client";

import { useState } from "react";
import { useCart } from "@/store/cartStore";
import Button from "./Button";

interface Props {
  productId: number;
  name: string;
  price: number;
  imageUrl: string;
  stock: number;
}

export default function AddToCartWithQuantity({ productId, name, price, imageUrl, stock }: Props) {
  const [quantity, setQuantity] = useState(1);
  const addToCart = useCart((s) => s.addToCart);

  const subtotal = (Number(price) * quantity).toFixed(2);

  const handleAdd = () => {
    setQuantity((q) => Math.min(q + 1, stock));
  };

  const handleRemove = () => {
    setQuantity((q) => Math.max(q - 1, 1));
  };

  const handleAddToCart = () => {
    addToCart({ id: productId, name, price, imageUrl, stock, quantity });
    alert(`${quantity} x ${name} added to cart!`);
  };

  return (
    <div className="mt-6 flex flex-col gap-4 bg-gray-800 p-4 rounded">
      <div className="flex items-center gap-4">
        <button onClick={handleRemove} className="px-2 py-1 bg-gray-700 rounded">-</button>
        <span className="text-white w-8 text-center">{quantity}</span>
        <button onClick={handleAdd} className="px-2 py-1 bg-gray-700 rounded">+</button>
        <span className="text-gray-400">Stock: {stock}</span>
      </div>
      <div className="text-white">
        Subtotal: ${subtotal}
      </div>
      <Button
        onClick={handleAddToCart}
      >
        Add to Cart
      </Button>
    </div>
  );
}