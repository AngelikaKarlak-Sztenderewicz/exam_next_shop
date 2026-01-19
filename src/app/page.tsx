import { prisma } from '@/lib/prisma';
import type { Category, Brand, Product } from '@/generated/prisma';
import {
  BrandsList,
  CategoriesList,
  CategoryHeroCarousel,
  RecommendationCarousel,
} from '@/components/homepageComponents';

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
      <CategoryHeroCarousel
        categories={categories.map((c) => ({ name: c.name.toLowerCase() }))}
      />
      <CategoriesList categories={categories} />
      <RecommendationCarousel recommendedProducts={recommendedProducts} />
      <BrandsList brands={brands} />
    </div>
  );
}
