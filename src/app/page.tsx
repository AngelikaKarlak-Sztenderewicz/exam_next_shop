import { prisma } from '@/lib/prisma';
import type { Category, Brand, Product } from '@/generated/prisma';
import Image from 'next/image';
import { MouseIcon } from '../components/icons/MouseIcon';
import { KeyboardIcon } from '../components/icons/KeyboardIcon';
import { HeadphonesIcon } from '../components/icons/HeadphonesIcon';
import { MonitorIcon } from '../components/icons/MonitorIcon';
import { WebcamIcon } from '../components/icons/WebcamIcon';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';

const categoryIcons: Record<string, React.FC<{ className?: string }>> = {
  mouse: MouseIcon,
  keyboard: KeyboardIcon,
  headphone: HeadphonesIcon,
  monitor: MonitorIcon,
  webcam: WebcamIcon,
};

export default async function HomePage() {
  const categories: Category[] = await prisma.category.findMany();
  const allProducts: (Product & { category: Category; brand: Brand })[] =
    await prisma.product.findMany({
      include: { category: true, brand: true },
    });
  const brands: Brand[] = await prisma.brand.findMany();

  function getRandomItems<T>(arr: T[], n: number) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
  }

  const recommendedProducts = getRandomItems(allProducts, 6);

  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* KARUZELA KATEGORII */}
      <section className="flex flex-col items-center justify-center p-8 w-full">
        <h2 className="text-3xl font-bold mb-6">Category</h2>
        <div className="flex overflow-x-auto gap-4 px-4 justify-center">
          {categories.map((c: Category) => {
            const Icon = categoryIcons[c.name] ?? (() => null);
            return (
              <Link
                key={c.id}
                href={`/products/category/${c.name}`}
                className="flex-none w-[220px] h-[190px] bg-customGray rounded shadow flex flex-col items-center justify-center p-4 hover:scale-105 transition-transform"
              >
                <Icon className="w-20 h-20 mb-4 text-white" />
                <div className="text-white font-bold text-center">{c.name}</div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* REKOMENDACJE */}
      <section className="flex flex-col items-center justify-center p-8 w-full">
        <h2 className="text-3xl font-bold mb-6">Recommendation</h2>

        <div className="w-full overflow-x-auto scroll-smooth scrollbar-hide">
          <div className="flex gap-6 px-2">
            {recommendedProducts.map(
              (p: Product & { category: Category; brand: Brand }) => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  name={p.name}
                  price={p.price}
                  imageUrl={p.imageUrl}
                  stock={p.stock}
                  className="flex-shrink-0"
                />
              )
            )}
          </div>
        </div>
      </section>

      {/* MARKI */}
      <section className="flex flex-col items-center justify-center p-8 w-full">
        <h2 className="text-3xl font-bold mb-6 text-white">Brands</h2>
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
    </div>
  );
}
