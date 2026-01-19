import { prisma } from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Breadcrumb } from '@/components/ui';
import { ProductCard } from '@/components/product';

type Props = {
  params: { name?: string } | Promise<{ name?: string }>;
};

export default async function BrandPage({ params }: Props) {
  const resolved = (await params) ?? {};
  const name = resolved.name;

  if (!name) {
    notFound();
  }

  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/login');
  }

  const brand = await prisma.brand.findUnique({
    where: { name },
    include: {
      products: {
        include: { category: true },
      },
    },
  });

  if (!brand) notFound();

  return (
    <div className="p-6">
      <Breadcrumb
        items={[
          { label: 'Products', href: '/products' },
          { label: brand.name },
        ]}
      />

      <h1 className="text-3xl font-bold mb-6">Chosen brand: {brand.name}</h1>

      <div className="flex flex-wrap gap-6">
        {brand.products.length === 0 ? (
          <div>No products for this brand</div>
        ) : (
          brand.products.map((p) => (
            <ProductCard
              key={p.id}
              id={p.id}
              name={p.name}
              price={p.price}
              imageUrl={p.imageUrl}
              stock={p.stock}
              categoryName={p.category.name}
              className="flex-shrink-0"
            />
          ))
        )}
      </div>
    </div>
  );
}
