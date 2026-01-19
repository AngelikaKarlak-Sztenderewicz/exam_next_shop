import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get('name');

  if (!name) {
    return NextResponse.json({ error: 'Invalid brand name' }, { status: 400 });
  }

  const brand = await prisma.brand.findUnique({
    where: { name },
    include: { products: { include: { category: true } } },
  });

  if (!brand) {
    return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
  }

  const products = brand.products.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    stock: p.stock,
    imageUrl: p.imageUrl,
    category: { id: p.category.id, name: p.category.name },
  }));

  return NextResponse.json({ name: brand.name, products });
}
