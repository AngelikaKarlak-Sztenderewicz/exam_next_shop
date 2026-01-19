'use client';

import Link from 'next/link';
import { useState } from 'react';
import { CategoryHeroConfig } from '@/lib/CategoryHeroConfig';
import Image from 'next/image';

type Category = {
  name: string;
};

export function CategoryHeroCarousel({
  categories,
}: {
  categories: Category[];
}) {
  const slides = categories
    .map((c) => CategoryHeroConfig[c.name])
    .filter(Boolean);

  const [index, setIndex] = useState(0);
  const current = slides[index];

  if (!current) return null;

  return (
    <section className="hidden md:block px-8 mb-10">
      <div className="relative bg-customGray rounded-xl overflow-hidden">
        <div className="flex items-center h-72">
          <div className="flex-1">
            <div className="max-w-lg ml-24">
              <h2 className="text-4xl font-semibold mb-4">{current.title}</h2>

              <p className="text-neutral-400 mb-6">{current.description}</p>

              <Link
                href={`products/category/${categories[index].name}`}
                className="inline-flex items-center gap-2 px-5 py-2 border border-orange-500 text-orange-400 rounded hover:bg-orange-500/10"
              >
                Explore Category →
              </Link>
            </div>
          </div>
          <div className="flex-1 hidden md:flex justify-end relative h-72">
            <Image
              src={current.image}
              alt={current.title}
              fill
              className="object-contain"
            />
          </div>
        </div>
        <button
          onClick={() =>
            setIndex((i) => (i - 1 + slides.length) % slides.length)
          }
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-orange-500 text-black w-12 h-24 rounded"
        >
          ‹
        </button>

        <button
          onClick={() => setIndex((i) => (i + 1) % slides.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-orange-500 text-black w-12 h-24 rounded"
        >
          ›
        </button>
      </div>
    </section>
  );
}
