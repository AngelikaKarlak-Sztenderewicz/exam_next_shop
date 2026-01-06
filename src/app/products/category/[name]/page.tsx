import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

{
  /*strona dynamiczna, renderuje produkty dla danej kategorii.*/
}

interface ProductPageProps {
  params: { name: string };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { name } = params;

  if (!name) {
    notFound();
  }

  const category = await prisma.category.findUnique({
    where: { name },
    include: { products: true },
  });

  if (!category) {
    notFound();
  }

  return (
    <div>
      <h1>Kategoria: {category.name}</h1>
      <ul>
        {category.products.map((product) => (
          <li key={product.id}>
            {product.name} - {product.price} zł
          </li>
        ))}
      </ul>
    </div>
  );
}
