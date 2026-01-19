'use client';

import Link from 'next/link';
import type { Category } from '@/generated/prisma';
import {
  HeadphonesIcon,
  KeyboardIcon,
  MonitorIcon,
  MouseIcon,
  WebcamIcon,
} from '../icons';

const categoryIcons: Record<string, React.FC<{ className?: string }>> = {
  mouse: MouseIcon,
  keyboard: KeyboardIcon,
  headphone: HeadphonesIcon,
  monitor: MonitorIcon,
  webcam: WebcamIcon,
};

type Props = {
  categories: Category[];
};

export function CategoriesList({ categories }: Props) {
  return (
    <section className="flex flex-col items-center justify-center p-8 w-full">
      <h2 className="text-3xl font-bold mb-6">Category</h2>
      <div className="flex flex-wrap gap-4 px-4 justify-center">
        {categories.map((c: Category) => {
          const Icon = categoryIcons[c.name] ?? (() => null);

          return (
            <Link
              key={c.id}
              href={`/products/category/${c.name}`}
              className="flex-none w-[220px] h-[190px] bg-customGray rounded shadow flex flex-col items-center justify-center p-4 hover:scale-105 transition-transform"
            >
              <Icon className="w-20 h-20 mb-4" />
              <div className="font-bold text-center">{c.name}</div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
