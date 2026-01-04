import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

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

export async function getProducts(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    include: { category: true, brand: true },
  });

  return products.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    stock: p.stock,
    imageUrl: p.imageUrl,
    description: p.description ?? undefined,
    category: { id: p.category.id, name: p.category.name },
    brand: { id: p.brand.id, name: p.brand.name },
  }));
}
