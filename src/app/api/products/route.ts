import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type {
  Prisma,
  Product as PrismaProduct,
  Brand,
  Category,
} from "@/generated/prisma";


type SortOptions = "nameAsc" | "priceAsc" | "priceDesc";

export type ProductWithRelations = PrismaProduct & { category: Category; brand: Brand };

export async function GET(req: NextRequest) {
  const url = new URL(req.url);

  const category = url.searchParams.get("category") ?? undefined;
  const minPriceRaw = url.searchParams.get("minPrice");
  const maxPriceRaw = url.searchParams.get("maxPrice");
  const sort = (url.searchParams.get("sort") as SortOptions) ?? "nameAsc";
  const limit = url.searchParams.get("limit") ? Number(url.searchParams.get("limit")) : 9;
  const page = url.searchParams.get("page") ? Number(url.searchParams.get("page")) : 1;

  const where: Prisma.ProductWhereInput = {};

  if (category && category !== "All") {
    where.category = { name: category };
  }

  if (minPriceRaw !== null || maxPriceRaw !== null) {
    const priceFilter: Prisma.FloatFilter = {};
    if (minPriceRaw !== null && minPriceRaw !== "") {
      const p = Number(minPriceRaw);
      if (!Number.isNaN(p)) priceFilter.gte = p;
    }
    if (maxPriceRaw !== null && maxPriceRaw !== "") {
      const p = Number(maxPriceRaw);
      if (!Number.isNaN(p)) priceFilter.lte = p;
    }

    if (Object.keys(priceFilter).length > 0) {
      where.price = priceFilter;
    }
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sort === "priceAsc" ? { price: "asc" } :
    sort === "priceDesc" ? { price: "desc" } :
    { name: "asc" };

  const products = await prisma.product.findMany({
    where,
    include: { category: true, brand: true },
    orderBy,
    skip: (page - 1) * limit,
    take: limit,
  });

  const total = await prisma.product.count({ where });

  const typedProducts: ProductWithRelations[] = products;

  return NextResponse.json({ products: typedProducts, total });
}
