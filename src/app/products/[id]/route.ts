import { PrismaClient } from "../../../../generated/prisma";
import { ApiError } from "@/lib/apiError";

const prisma = new PrismaClient();

interface Params {
  params: { id: string };
}

export async function GET(_req: Request, { params }: Params) {
  const { id } = params;

  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
    include: { category: true, brand: true },
  });

  if (!product) throw new ApiError("Produkt nie istnieje", 404);

  return new Response(JSON.stringify(product), { status: 200 });
}
