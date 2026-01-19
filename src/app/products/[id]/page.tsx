import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Breadcrumb } from '@/components/ui';
import { ShieldIcon } from '@/components/icons';
import { ProductDescription } from '@/components/product';
import { AddToCartWithQuantity } from '@/components/cart';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const session = await getServerSession(authOptions);

  if (!session) redirect('/login');

  const { id } = await params;

  const productId = Number(id);

  if (isNaN(productId)) {
    notFound();
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { category: true, brand: true },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="h-fit">
        <Breadcrumb
          items={[
            { label: 'Products', href: '/products' },
            {
              label: product.category.name,
              href: `/products/category/${product.category.name}`,
            },
            { label: product.name },
          ]}
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        <div className="w-full lg:w-1/3 relative aspect-square rounded-lg overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-contain bg-white"
          />
        </div>
        <div className="w-full lg:w-1/3 flex flex-col gap-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>

          <Link
            href={`/products/category/${product.category.name}`}
            className="w-fit rounded-md font-bold bg-customOrange py-2 px-5 text-base hover:opacity-90"
          >
            {product.category.name}
          </Link>

          <p className="text-xl font-semibold">{product.price} $</p>

          <ProductDescription description={product.description ?? ''} />

          <div className="flex flex-col gap-3">
            <p>Shipping available</p>
            <div className="flex gap-2">
              <ShieldIcon />
              <div>
                <span>NexusHub Courier</span>
                <p>Estimated arrival 30 Sep - 3 Oct</p>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/3 flex flex-col gap-4 p-6 bg-customGray rounded h-fit">
          <AddToCartWithQuantity
            productId={product.id}
            name={product.name}
            price={product.price}
            imageUrl={product.imageUrl}
            stock={product.stock}
            categoryName={product.name}
          />
        </div>
      </div>
    </div>
  );
}
