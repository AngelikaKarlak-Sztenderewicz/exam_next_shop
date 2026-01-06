import { prisma } from "@/lib/prisma";

export type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
  imageUrl: string;
  description?: string;
  category: { id: number; name: string };
  brand: { id: number; name: string };
};

type GetProductsParams = {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "nameAsc" | "priceAsc" | "priceDesc";
  limit?: number;
  page?: number;
};

export async function getProducts(
  params: GetProductsParams = {}
): Promise<{ products: Product[]; total: number }> {
  const { category, minPrice, maxPrice, sort, limit = 9, page = 1 } = params;

  const where: any = {};

  if (category && category !== "All") {
    where.category = { name: category };
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }

  const orderBy =
    sort === "priceAsc"
      ? { price: "asc" }
      : sort === "priceDesc"
      ? { price: "desc" }
      : { name: "asc" };

  const total = await prisma.product.count({ where });

  const products = await prisma.product.findMany({
    where,
    include: { category: true, brand: true },
    orderBy,
    take: limit,
    skip: (page - 1) * limit,
  });

  return {
    total,
    products: products.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      stock: p.stock,
      imageUrl: p.imageUrl,
      description: p.description ?? undefined,
      category: { id: p.category.id, name: p.category.name },
      brand: { id: p.brand.id, name: p.brand.name },
    })),
  };
}
