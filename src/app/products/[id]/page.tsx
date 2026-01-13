import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Breadcrumb } from '@/components/Breadcrumb';
import AddToCartWithQuantity from '@/components/AddToCartWithQuantity';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const session = await getServerSession(authOptions);

  if (!session) redirect('/login');

  const { id } = await params;

  const productId = Number(id);

  console.log('Server params.id:', id);
  console.log('Converted id:', productId);

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
    <div className="p-6 flex md:flex-row gap-6">
      <Breadcrumb
        items={[
          { label: 'Products', href: '/products' },
          {
            label: product.category.name,
            href: `/products/category/${product.category.name}`,
          },
        ]}
      />

      <div className="flex  w-1/3 h-[400px] relative rounded-lg overflow-hidden bg-gray-100">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-contain"
        />
      </div>

      <div className="flex flex-col gap-8">
        <h1 className="text-3xl font-bold">{product.name}</h1>

        <Link
          href={`/products/category/${product.category.name}`}
          className="w-auto rounded-md font-bold bg-submitButtonColor  py-2 px-5 text-base hover:opacity-90"
        >
          {product.category.name}
        </Link>
        <p className="text-xl font-semibold">{product.price} </p>
        <p>{product.description}</p>
        <p>VIEW MORE TRZEBA DODAĆ </p>
        <div>
          <p>Shipping available</p>
          <div>
            <span>NexusHub Courier</span>
            <p>Estimated arrival 30 Sep - 3 Oct</p>
          </div>
        </div>
      </div>

      <div className="w-1/3 flex flex-col gap-8 p-6 bg-customGray">
        <div>div z kolorem</div>
        <AddToCartWithQuantity
          productId={product.id}
          name={product.name}
          price={product.price}
          imageUrl={product.imageUrl}
          stock={product.stock}
        />
      </div>
    </div>
  );
}
