import { PrismaClient } from "../../generated/prisma";
import { ApiError } from "@/lib/apiError";

const prisma = new PrismaClient();

export async function GET() {
  const categories = await prisma.category.findMany();

  if (!categories || categories.length === 0)
    throw new ApiError("Nie znaleziono kategorii", 404);

  return new Response(JSON.stringify(categories), { status: 200 });
}
