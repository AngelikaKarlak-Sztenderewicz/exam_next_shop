"use client";

import React from "react";

interface Props {
  productId: number;
  productName: string;
}

export default function AddToCartButton({ productId, productName }: Props) {
  function handleClick() {
    alert(`${productName} added to cart!`);
  }

  return (
    <button
      onClick={handleClick}
      className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Add to Cart
    </button>
  );
}
