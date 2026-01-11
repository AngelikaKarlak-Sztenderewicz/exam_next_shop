'use client';

import { useCart } from '@/store/cartStore';
import Button from './Button';

interface Props {
  productId: number;
  productName: string;
  price: number;
  imageUrl: string;
  stock: number;
}

export default function AddToCartButton({
  productId,
  productName,
  price,
  imageUrl,
  stock,
}: Props) {
  const addToCart = useCart((s) => s.addToCart);

  function handleClick() {
    addToCart({
      id: productId,
      name: productName,
      price,
      imageUrl,
      stock,
      quantity: 1,
    });
  }

  return (
    <Button
      onClick={handleClick}
      className=" border border-submitButtonColor bg-transparent text-submitButtonColor"
    >
      Add to Cart
    </Button>
  );
}
