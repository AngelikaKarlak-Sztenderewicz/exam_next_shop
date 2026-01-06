import ProductsPageClient from "./ProductsPageClient";
import { prisma } from "@/lib/prisma";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const categories = await prisma.category.findMany();
  const initialCategory = searchParams.category || "All";

  return (
    <ProductsPageClient
      categories={categories}
      initialCategory={initialCategory}
    />
  );
}
