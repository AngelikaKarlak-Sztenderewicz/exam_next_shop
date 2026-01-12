'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/store/cartStore';
import { CartIcon } from './icons/CartIcon';

export type ProductCardProps = {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  stock: number;
  className?: string;
};

export default function ProductCard({
  id,
  name,
  price,
  imageUrl,
  stock,
  className = '',
}: ProductCardProps) {
  const addToCart = useCart((state) => state.addToCart);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart({ id, name, price, imageUrl, stock, quantity: 1 });
  };

  return (
    <Link href={`/products/${id}`} className="group">
      <div className="relative flex flex-col items-center bg-customGray rounded p-4">
        <button
          onClick={handleAddToCart}
          aria-label="Add to cart"
          className="absolute top-3 right-3 z-10 bg-customGray rounded-full p-2 shadow hover:scale-105 transition"
        >
          <CartIcon />
        </button>

        <div
          className={`w-[268px] h-[204px] bg-white flex items-center justify-center mb-2 rounded-[6px] ${className}`}
        >
          <Image
            src={imageUrl}
            alt={name}
            width={268}
            height={204}
            className="object-contain rounded-[6px] max-h-[204px] max-w-[268px]"
          />
        </div>

        <h3 className="font-bold text-center mt-2">{name}</h3>
        <p className="font-semibold">{price} $</p>
      </div>
    </Link>
  );
}
