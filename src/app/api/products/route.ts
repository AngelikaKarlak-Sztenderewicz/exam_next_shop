import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const category = searchParams.get("category") ?? undefined;
  const minPrice = searchParams.get("minPrice")
    ? Number(searchParams.get("minPrice"))
    : undefined;
  const maxPrice = searchParams.get("maxPrice")
    ? Number(searchParams.get("maxPrice"))
    : undefined;
  const sort =
    (searchParams.get("sort") as "nameAsc" | "priceAsc" | "priceDesc") ??
    "nameAsc";
  const limit = searchParams.get("limit")
    ? Number(searchParams.get("limit"))
    : 9;
  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;

  const where: any = {};
  if (category && category !== "All") where.category = { name: category };
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }

  const orderBy: any =
    sort === "priceAsc"
      ? { price: "asc" }
      : sort === "priceDesc"
      ? { price: "desc" }
      : { name: "asc" };

  const products = await prisma.product.findMany({
    where,
    include: { category: true, brand: true },
    orderBy,
    skip: (page - 1) * limit,
    take: limit,
  });

  const total = await prisma.product.count({ where });

  return NextResponse.json({ products, total });
}
