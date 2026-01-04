import { PrismaClient } from "../generated/prisma";
import Image from "next/image";

const prisma = new PrismaClient();

export default async function HomePage() {
  const categories = await prisma.category.findMany();

  const recommendedProducts = await prisma.product.findMany({
    include: { category: true, brand: true },
    orderBy: { id: "asc" },
    take: 6,
  });

  const brands = await prisma.brand.findMany();

  return (
    <div className="min-h-screen flex flex-col">
      {/* KARUZELA KATEGORII */}
      <section className="relative h-screen w-full bg-gray-200 flex flex-col justify-center items-center">
        <h2 className="text-4xl font-bold mb-8">Categories</h2>
        <div className="flex overflow-x-auto space-x-4 px-4">
          {categories.map((c) => (
            <div
              key={c.id}
              className="flex-none w-64 h-40 bg-blue-500 text-white font-bold flex justify-center items-center rounded shadow-lg"
            >
              {c.name}
            </div>
          ))}
        </div>
      </section>

      {/* REKOMENDACJE */}
      <section className="p-8 bg-white">
        <h2 className="text-3xl font-bold mb-6">Recomendation</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6 overflow-x-auto">
          {recommendedProducts.map((p) => (
            <div
              key={p.id}
              className="border rounded p-4 shadow flex flex-col items-center bg-white"
            >
        
              <div className="w-full aspect-square mb-2 relative">
                <Image
                  src={p.imageUrl}
                  alt={p.name}
                  width={200}
                  height={200}
                  className="object-cover rounded"
                />
              </div>

              <h3 className="font-semibold text-center">{p.name}</h3>
              <p className="text-gray-600">{p.price} zł</p>
              <p className="text-sm text-gray-500">{p.brand.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MARKI */}
      <section className="p-8 bg-gray-100">
        <h2 className="text-3xl font-bold mb-6">Brands</h2>

        <div className="flex flex-wrap gap-4 justify-center">
          {brands.map((b) => (
            <div
              key={b.id}
              className="w-40 h-20 bg-white border rounded shadow flex justify-center items-center font-bold"
            >
              <Image
                src={b.imageUrl}
                alt={b.name}
                width={160}
                height={80}
                className="object-contain"
              />
              {b.name}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
