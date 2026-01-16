{
  /*strona dynamiczna, renderuje produkty dla danej kategorii.*/
}
import { prisma } from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Breadcrumb } from '@/components/Breadcrumb';
import ProductCard from '@/components/ProductCard';

interface Props {
  params: { name: string };
}

export default async function CategoryPage({ params }: Props) {
  const session = await getServerSession(authOptions);

  if (!session) redirect('/login');

  const { name } = await params;

  if (!name) {
    notFound();
  }

  const category = await prisma.category.findUnique({
    where: { name },
    include: {
      products: { include: { brand: true, category: true } },
    },
  });

  if (!category) {
    notFound();
  }

  return (
    <div className="p-6">
      <Breadcrumb
        items={[
          { label: 'Products', href: '/products' },
          {
            label: category.name,
          },
        ]}
      />
      <h1 className="text-3xl font-bold mb-6 text-white">
        Choosen category: {category.name}
      </h1>

      <div className="flex flex-wrap gap-6">
        {category.products.length === 0 ? (
          <div className="text-white">No products in this category</div>
        ) : (
          category.products.map((p) => (
            <ProductCard
              key={p.id}
              id={p.id}
              name={p.name}
              price={p.price}
              imageUrl={p.imageUrl}
              stock={p.stock}
              categoryName={p.category.name}
              className="flex-shrink-0 items-center"
            />
          ))
        )}
      </div>
    </div>
  );
}
