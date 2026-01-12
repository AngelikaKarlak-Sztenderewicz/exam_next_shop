import ProductsPageClient from './ProductsPageClient';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

type SearchParams = {
  category?: string;
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const params = await searchParams;
  const initialCategory = params.category ?? 'All';

  const categories = await prisma.category.findMany();

  return (
    <ProductsPageClient
      categories={categories}
      initialCategory={initialCategory}
    />
  );
}
