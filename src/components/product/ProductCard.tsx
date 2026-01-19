'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/store/cartStore';
import { CartIcon } from '../icons';

export type ProductCardProps = {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  stock: number;
  categoryName: string;
  className?: string;
};

export function ProductCard({
  id,
  name,
  price,
  imageUrl,
  stock,
  categoryName,
  className = '',
}: ProductCardProps) {
  const addToCart = useCart((state) => state.addToCart);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    console.log('ProductCard: addToCart', { id, name, categoryName });

    addToCart({ id, name, price, imageUrl, stock, quantity: 1, categoryName });
  };

  return (
    <Link href={`/products/${id}`} className="group">
      <div className="relative flex flex-col bg-customGray rounded p-4 w-[300]">
        <button
          onClick={handleAddToCart}
          aria-label="Add to cart"
          className="absolute top-3 right-3 z-10 bg-customGray rounded-full p-2 shadow hover:scale-105 transition"
        >
          <CartIcon />
        </button>

        <div
          className={`w-[268px] h-[204px] bg-white flex items-center justify-center mb-2 rounded-[6px] relative ${className}`}
        >
          <Image
            src={imageUrl}
            alt={name}
            width={268}
            height={204}
            className="object-contain rounded-md max-h-[204px] max-w-[268px]"
          />
        </div>

        <div>
          <span className="text-sm inline-flex w-fit rounded-md bg-customOrange py-1.5 px-2.5 ">
            {categoryName}
          </span>
          <h3 className="font-bold mt-2 truncate">{name}</h3>
          <p className="font-semibold text-3xl mt-1">{price} $</p>
        </div>
      </div>
    </Link>
  );
}
