'use client';

import Image from 'next/image';
import type { CartItem } from '@/types/cart';
import { QuantitySelector } from '../ui';
import { BinIcon } from '../icons/BinIcon';

type AddToCartFn = (
  item: Omit<CartItem, 'quantity'> & { quantity?: number }
) => void;

type Props = {
  item: CartItem;
  addToCart: AddToCartFn;
  removeFromCart: (id: number) => void;
  showNoteEditor: Record<number, boolean>;
  toggleNote: (id: number) => void;
  notes: Record<number, string>;
  updateNote: (id: number, value: string) => void;
  showRemove?: boolean;
  onRemove?: (id: number) => void;
};

export function CheckoutItem({
  item,
  addToCart,
  removeFromCart,
  showNoteEditor,
  toggleNote,
  notes,
  updateNote,
  showRemove = false,
  onRemove,
}: Props) {
  return (
    <div className="relative w-full max-w-md mx-auto sm:max-w-full sm:mx-0 flex flex-col sm:flex-row gap-4 items-start">
      {showRemove && onRemove && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove(item.id);
          }}
          className="hidden sm:block absolute top-2 right-2 p-1"
          aria-label="remove"
        >
          <BinIcon />
        </button>
      )}
      <div className="relative w-full h-48 sm:w-40 sm:h-32 rounded-md overflow-hidden flex-shrink-0 bg-white">
        <Image
          src={item.imageUrl ?? ''}
          alt={item.name}
          fill
          className="object-contain"
        />
        {showRemove && onRemove && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRemove(item.id);
            }}
            className="absolute top-2 right-2 sm:hidden bg-black/60 p-1 rounded"
            aria-label="remove"
          >
            <BinIcon />
          </button>
        )}
      </div>
      <div className="flex-1 flex flex-col gap-2">
        <div>
          <div className="text-xl sm:text-2xl font-semibold">{item.name}</div>
          <div className="text-sm inline-flex rounded-md bg-customOrange py-2 px-3 mt-2">
            {item.categoryName}
          </div>
        </div>
        <div className="block sm:hidden text-2xl font-semibold">
          ${(item.price * item.quantity).toFixed(2)}
        </div>
        <div className="w-full mt-4">
          <div className="hidden sm:flex items-center justify-between w-full">
            <div className="text-2xl font-semibold">
              ${(item.price * item.quantity).toFixed(2)}
            </div>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleNote(item.id);
                }}
                className="text-sm text-customOrange"
              >
                {showNoteEditor[item.id] ? 'Hide note' : 'Write Note'}
              </button>

              <div
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <QuantitySelector
                  quantity={item.quantity}
                  stock={item.stock}
                  onIncrease={() =>
                    addToCart({
                      id: item.id,
                      name: item.name,
                      price: item.price,
                      imageUrl: item.imageUrl ?? '',
                      stock: item.stock,
                      categoryName: item.categoryName,
                      quantity: 1,
                    })
                  }
                  onDecrease={() => {
                    if (item.quantity > 1) {
                      addToCart({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        imageUrl: item.imageUrl ?? '',
                        stock: item.stock,
                        categoryName: item.categoryName,
                        quantity: -1,
                      });
                    } else {
                      removeFromCart(item.id);
                    }
                  }}
                />
              </div>
            </div>
          </div>
          <div className="flex sm:hidden items-center justify-between mt-2">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleNote(item.id);
              }}
              className="text-sm text-customOrange"
            >
              {showNoteEditor[item.id] ? 'Hide note' : 'Write Note'}
            </button>

            <div
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <QuantitySelector
                quantity={item.quantity}
                stock={item.stock}
                onIncrease={() =>
                  addToCart({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    imageUrl: item.imageUrl ?? '',
                    stock: item.stock,
                    categoryName: item.categoryName,
                    quantity: 1,
                  })
                }
                onDecrease={() => {
                  if (item.quantity > 1) {
                    addToCart({
                      id: item.id,
                      name: item.name,
                      price: item.price,
                      imageUrl: item.imageUrl ?? '',
                      stock: item.stock,
                      categoryName: item.categoryName,
                      quantity: -1,
                    });
                  } else {
                    removeFromCart(item.id);
                  }
                }}
              />
            </div>
          </div>
        </div>
        {showNoteEditor[item.id] && (
          <textarea
            value={notes[item.id] ?? ''}
            onChange={(e) => updateNote(item.id, e.target.value)}
            maxLength={100}
            placeholder="Add a note for this item (max 100 chars)"
            className="w-full p-2 rounded bg-gray-800"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          />
        )}
      </div>
    </div>
  );
}
