import Image from "next/image";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import AddToCartButton from "@/components/AddToCartButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");

  const { id } = await params;

  const productId = Number(id);

  console.log("Server params.id:", id);
  console.log("Converted id:", productId);

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
    <div className="p-6 flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-1/2 h-[400px] relative rounded-lg overflow-hidden bg-gray-100">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-contain"
        />
      </div>

      <div className="flex-1 flex flex-col gap-4 text-white">
        <div className="text-gray-400 text-sm">
          <Link href="/products" className="hover:underline">
            Products
          </Link>
          &nbsp;&gt;&nbsp;
          <span>{product.category.name}</span>
        </div>

        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-xl font-semibold">{product.price} </p>
        <p className="text-gray-300">{product.brand.name}</p>
        <p className="mt-4">{product.description}</p>

        <AddToCartButton productId={product.id} productName={product.name} />
      </div>
    </div>
  );
}
