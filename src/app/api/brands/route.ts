import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { name } = req.query;

  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'Invalid brand name' });
  }

  const brand = await prisma.brand.findUnique({
    where: { name },
    include: { products: { include: { category: true } } },
  });

  if (!brand) return res.status(404).json({ error: 'Brand not found' });

  const products = brand.products.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    stock: p.stock,
    imageUrl: p.imageUrl,
    category: { id: p.category.id, name: p.category.name },
  }));

  res.status(200).json({ name: brand.name, products });
}
