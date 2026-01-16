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
import RecommendationCarousel from '@/components/homepageComponents/RecommendationCarousel';
import CategoriesList from '@/components/homepageComponents/CategoriesList';
import BrandsList from '@/components/homepageComponents/BrandsList';

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

      <CategoriesList categories={categories} />

      {/* REKOMENDACJE */}

      <RecommendationCarousel recommendedProducts={recommendedProducts} />

      {/* MARKI */}
      <BrandsList brands={brands} />
    </div>
  );
}
