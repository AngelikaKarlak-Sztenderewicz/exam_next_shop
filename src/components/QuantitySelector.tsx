'use client';

import { Plus } from './icons/Plus';
import { Minus } from './icons/Minus';

interface Props {
  quantity: number;
  stock: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

export default function QuantitySelector({
  quantity,
  stock,
  onIncrease,
  onDecrease,
}: Props) {
  return (
    <div className="flex items-center gap-2 border rounded py-1">
      <button
        onClick={onDecrease}
        disabled={quantity <= 1}
        className="px-3 py-1 disabled:opacity-40"
      >
        <Minus />
      </button>

      <span className="w-6 text-center">{quantity}</span>

      <button
        onClick={onIncrease}
        disabled={quantity >= stock}
        className="px-3 py-1 disabled:opacity-40"
      >
        <Plus />
      </button>
    </div>
  );
}
