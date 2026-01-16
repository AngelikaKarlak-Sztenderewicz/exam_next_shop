'use client';

import { useCart } from '@/store/cartStore';
import Button from './Button';

interface Props {
  productId: number;
  productName: string;
  price: number;
  imageUrl: string;
  stock: number;
  categoryName: string;
}

export default function AddToCartButton({
  productId,
  productName,
  price,
  imageUrl,
  stock,
  categoryName,
}: Props) {
  const addToCart = useCart((s) => s.addToCart);

  const handleClick = () => {
    addToCart({
      id: productId,
      name: productName,
      price,
      imageUrl,
      stock,
      categoryName,
    });

    fetch('/api/notify/cart-add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: `${productName} dodany do koszyka` }),
    }).catch(() => {});
  };

  return (
    <Button
      onClick={handleClick}
      className="border border-customOrange bg-transparent text-customOrange"
    >
      Add to Cart
    </Button>
  );
}
