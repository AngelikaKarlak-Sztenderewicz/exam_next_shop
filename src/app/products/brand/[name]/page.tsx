import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface Props {
  params: { name: string };
}

export default async function BrandPage({ params }: Props) {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");

  const { name } = await params;

  if (!name) {
    notFound();
  }

  const brand = await prisma.brand.findUnique({
    where: { name },
    include: {
      products: { include: { category: true, brand: true } },
    },
  });

  if (!brand) {
    notFound();
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-white">
        Choosen brand: {brand.name}
      </h1>

      <div className="flex flex-wrap gap-6">
        {brand.products.length === 0 ? (
          <div className="text-white">There are no products of this brand</div>
        ) : (
          brand.products.map((p) => (
            <Link key={p.id} href={`/products/${p.id}`}>
              <div className="flex flex-col items-center bg-customGray rounded p-4 cursor-pointer hover:scale-105 transition-transform">
                <div className="w-[268px] h-[204px] bg-white flex items-center justify-center mb-2 rounded-[6px]">
                  <Image
                    src={p.imageUrl}
                    alt={p.name}
                    width={268}
                    height={204}
                    className="object-contain rounded-[6px] max-h-[204px] max-w-[268px]"
                  />
                </div>
                <h3 className="font-bold text-center mt-2 text-white">
                  {p.name}
                </h3>
                <p className="font-semibold text-white">{p.price} $</p>
                <p className="text-gray-300">{p.category?.name}</p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
