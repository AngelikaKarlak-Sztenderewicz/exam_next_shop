"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Product } from "@/lib/api/products";
import Link from "next/link";

type Category = { id: number; name: string };

interface ProductsPageClientProps {
  categories: Category[];
  initialCategory: string;
}

export default function ProductsPageClient({
  categories,
  initialCategory,
}: ProductsPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortOption] = useState("nameAsc");
  const [showCount] = useState(9);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setPage(1);
    const params = new URLSearchParams(searchParams.toString());
    if (category === "All") {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    router.push(`/products?${params.toString()}`);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const queryParams = new URLSearchParams();
      if (selectedCategory !== "All")
        queryParams.append("category", selectedCategory);
      if (minPrice) queryParams.append("minPrice", minPrice);
      if (maxPrice) queryParams.append("maxPrice", maxPrice);
      queryParams.append("sort", sortOption);
      queryParams.append("limit", showCount.toString());
      queryParams.append("page", page.toString());

      const res = await fetch(`/api/products?${queryParams.toString()}`);
      const data = await res.json();

      setProducts(data.products);
      setTotal(data.total);
    };
    fetchProducts();
  }, [selectedCategory, minPrice, maxPrice, sortOption, showCount, page]);

  return (
    <div className="p-6 flex gap-6">
      {/* LEWA CZĘŚĆ – FILTRY */}
      <div className="w-1/4 flex flex-col gap-6">
        <div>
          <h2 className="font-bold mb-2 text-white">Kategorie</h2>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => handleCategoryClick("All")}
              className={`p-2 rounded ${
                selectedCategory === "All"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-white"
              }`}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => handleCategoryClick(c.name)}
                className={`p-2 rounded ${
                  selectedCategory === c.name
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-white"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Cena (FILTRY) */}
        <div>
          <h2 className="font-bold mb-2 text-white">Cena</h2>
          <div className="flex gap-2">
            <input
              type="number"
              step={1}
              min={0}
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-1/2 p-2 rounded bg-gray-700 text-white"
            />
            <input
              type="number"
              step={1}
              min={minPrice ? Number(minPrice) + 1 : 1}
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-1/2 p-2 rounded bg-gray-700 text-white"
            />
          </div>
        </div>
      </div>

      {/* PRAWA CZĘŚĆ – PRODUKTY */}
      <div className="w-3/4 flex flex-col gap-6">
        {products.length === 0 ? (
          <div className="text-white font-bold text-xl text-center mt-10">
            No products found
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-4 justify-start">
              {products.map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${p.id}`}
                  className="flex-none w-[220px] h-[290px]"
                >
                  <div className=" bg-customGray rounded shadow flex flex-col items-center justify-center p-4">
                    <Image
                      src={p.imageUrl}
                      alt={p.name}
                      width={120}
                      height={120}
                      className="mb-4 rounded"
                      style={{ objectFit: "cover" }}
                    />
                    <h2 className="text-white font-bold text-center">
                      {p.name}
                    </h2>
                    <p className="text-white font-semibold">{p.price} $</p>
                    <p className="text-gray-400 text-sm text-center">
                      {p.category.name} - {p.brand.name}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* PAGINACJA */}
            <div className="flex justify-center gap-2 mt-4">
              {Array.from(
                { length: Math.ceil(total / showCount) },
                (_, i) => i + 1
              ).map((num) => (
                <button
                  key={num}
                  onClick={() => setPage(num)}
                  className={`px-3 py-1 rounded ${
                    page === num
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 text-white"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
