import { ApiError } from "@/lib/apiError";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const categories = await prisma.category.findMany();

  if (!categories || categories.length === 0)
    throw new ApiError("Category not found", 404);

  return new Response(JSON.stringify(categories), { status: 200 });
}
