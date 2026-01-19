'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Brand } from '@/generated/prisma';

type Props = {
  brands: Brand[];
};

export function BrandsList({ brands }: Props) {
  return (
    <section className="flex flex-col items-center justify-center p-8 w-full">
      <h2 className="text-3xl font-bold mb-6">Brands</h2>
      <div className="flex gap-4 flex-wrap justify-center">
        {brands.map((b: Brand) => (
          <Link key={b.id} href={`/products/brand/${b.name}`}>
            <div className="flex-none w-[220px] rounded-[8px] p-4 shadow bg-customGray flex flex-col items-center">
              <div className="w-1/3 aspect-square relative mb-2">
                <Image
                  src={b.imageUrl || ''}
                  alt={b.name}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="font-bold text-center">{b.name}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
