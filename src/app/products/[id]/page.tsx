import Image from "next/image";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

interface ProductPageProps {
  params: { id: string };
}

export default async function ProductPage(props: ProductPageProps) {
  const { params } = await props;
  const id = Number(params.id);
  console.log("params.id:", params.id);
  console.log("converted id:", id);
  console.log("isNaN(id)?", isNaN(id));
  console.log("params:", params);

  if (isNaN(id)) {
    return (
      <div className="p-6 text-center text-red-500">
        Nieprawidłowe ID produktu
      </div>
    );
  }

  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true, brand: true },
  });

  if (!product) {
    return <div className="p-6 text-center">Product not found</div>;
  }

  return (
    <div className="p-6 flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-1/2 h-[400px] relative rounded-lg overflow-hidden bg-gray-100">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-contain"
        />
      </div>

      {/* Szczegóły */}
      <div className="flex-1 flex flex-col gap-4 text-white">
        {/* Breadcrumb */}
        <div className="text-gray-400 text-sm">
          <Link href="/products" className="hover:underline">
            Products
          </Link>
          / <span>{product.category.name}</span>
        </div>

        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-xl font-semibold">{product.price} </p>
        <p className="text-gray-300">{product.brand.name}</p>
        <p className="mt-4">{product.description}</p>

        <button
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            // dodawanie do koszyka na poxniej
            alert(`${product.name} added to cart!`);
          }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
