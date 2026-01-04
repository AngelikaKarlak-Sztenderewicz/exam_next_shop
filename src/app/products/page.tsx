import Image from "next/image";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true, brand: true },
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Produkty</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((p) => (
          <div key={p.id} className="border p-4 rounded shadow">
            <Image
              src={p.imageUrl}
              alt={p.name}
              width={300} 
              height={200} 
              className="mb-2 rounded"
              style={{ objectFit: "cover" }}
            />
            <h2 className="font-semibold">{p.name}</h2>
            <p>{p.price} zł</p>
            <p className="text-sm text-gray-500">
              {p.category.name} - {p.brand.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
