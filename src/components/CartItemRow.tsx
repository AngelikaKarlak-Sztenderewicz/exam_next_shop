"use client";

import { useCart } from "@/store/cartStore";
import Image from "next/image";

interface Props {
  id: number;
  name: string;
  price: number ;
  imageUrl: string;
  quantity: number;
  stock: number; 
}

export default function CartItemRow({
  id,
  name,
  price,
  imageUrl,
  quantity,
  stock,
}: Props) {
  const addToCart = useCart((s) => s.addToCart);
  const removeFromCart = useCart((s) => s.removeFromCart);

  const subtotal = (Number(price) * quantity).toFixed(2);

  const handleAdd = () => {
    if (quantity < stock) {
      addToCart({ id, name, price, imageUrl, stock, quantity: 1 });
    }
  };

 const handleRemove = () => {
  if (quantity > 1) {
    addToCart({ id, name, price, imageUrl, stock, quantity: -1 });
  } else {
    removeFromCart(id);
  }
};

  return (
    <div className="flex items-center justify-between p-2 border-b">
      <div className="flex items-center gap-4">
        <Image
          src={imageUrl}
          alt={name}
          width={64}
          height={64}
          className="object-cover rounded"
        />
        <div>
          <div className="font-bold">{name}</div>
          <div className="text-gray-400">${Number(price).toFixed(2)}</div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleRemove}
          className="px-2 py-1 bg-gray-200 rounded"
        >
          -
        </button>
        <span className="w-6 text-center">{quantity}</span>
        <button
          onClick={handleAdd}
          className="px-2 py-1 bg-gray-200 rounded"
          disabled={quantity >= stock} 
        >
          +
        </button>
      </div>

      <div className="font-semibold">${subtotal}</div>

      <button
        onClick={() => removeFromCart(id)}
        className="text-red-500 px-2"
      >
        Remove
      </button>
    </div>
  );
}
