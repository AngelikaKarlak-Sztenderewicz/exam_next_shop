'use client';

import { useEffect, useRef } from 'react';
import type { Category, Brand, Product } from '@/generated/prisma';
import { ProductCard } from '../product';

type Props = {
  recommendedProducts: (Product & { category: Category; brand: Brand })[];
};

export function RecommendationCarousel({ recommendedProducts }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<number | null>(null);

  const items = [...recommendedProducts, ...recommendedProducts];

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const speed = 1.2;
    const edge = 120;

    const clear = () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    const startScroll = (direction: 'left' | 'right') => {
      clear();
      intervalRef.current = window.setInterval(() => {
        el.scrollLeft += direction === 'right' ? speed : -speed;
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft -= el.scrollWidth / 2;
        }
        if (el.scrollLeft <= 0) {
          el.scrollLeft += el.scrollWidth / 2;
        }
      }, 16);
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;

      if (x < edge) startScroll('left');
      else if (x > rect.width - edge) startScroll('right');
      else clear();
    };

    el.addEventListener('mousemove', onMouseMove);
    el.addEventListener('mouseleave', clear);

    return () => {
      clear();
      el.removeEventListener('mousemove', onMouseMove);
      el.removeEventListener('mouseleave', clear);
    };
  }, []);

  return (
    <section className="flex flex-col items-center p-8 w-full">
      <h2 className="text-3xl font-bold mb-6">Recommendation</h2>

      <div ref={containerRef} className="w-full overflow-hidden cursor-pointer">
        <div className="flex gap-6 px-2 w-max">
          {items.map((p, i) => (
            <ProductCard
              key={`${p.id}-${i}`}
              id={p.id}
              name={p.name}
              price={p.price}
              imageUrl={p.imageUrl}
              stock={p.stock}
              categoryName={p.category.name}
              className="flex-shrink-0"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
