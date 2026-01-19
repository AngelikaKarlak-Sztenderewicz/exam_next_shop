'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/product';

type Category = { id: number; name: string };

export type Product = {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  stock: number;
  categoryName: string;
};

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
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  const [showCount, setShowCount] = useState(9);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [filtersOpen, setFiltersOpen] = useState(false);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setPage(1);
    const params = new URLSearchParams(searchParams?.toString() ?? '');
    if (category === 'All') {
      params.delete('category');
    } else {
      params.set('category', category);
    }
    router.push(`/products?${params.toString()}`);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const queryParams = new URLSearchParams();
      if (selectedCategory && selectedCategory !== 'All')
        queryParams.append('category', selectedCategory);
      if (minPrice) queryParams.append('minPrice', minPrice);
      if (maxPrice) queryParams.append('maxPrice', maxPrice);
      queryParams.append('sort', sortOption);
      queryParams.append('limit', showCount.toString());
      queryParams.append('page', page.toString());

      const res = await fetch(`/api/products?${queryParams.toString()}`);
      const data = await res.json();

      const mapped: Product[] = (data.products || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        imageUrl: p.imageUrl,
        stock: p.stock,
        categoryName: p.categoryName ?? p.category?.name,
      }));

      console.log('Fetched products sample:', mapped.slice(0, 3));
      setProducts(mapped);
      setTotal(data.total ?? 0);
    };

    fetchProducts();
  }, [selectedCategory, minPrice, maxPrice, sortOption, showCount, page]);

  return (
    <div className="flex flex-col lg:flex-row lg:items-start">
      <div className="lg:hidden p-4">
        <button
          onClick={() => setFiltersOpen((s) => !s)}
          aria-expanded={filtersOpen}
          className="px-4 py-2 rounded shadow bg-customOrange font-medium"
        >
          {filtersOpen ? 'Ukryj filtry' : 'Pokaż filtry'}
        </button>
      </div>

      <aside
        className={`${
          filtersOpen ? 'block' : 'hidden'
        } lg:block p-6 lg:p-10 bg-transparent`}
      >
        <div className="flex flex-col gap-6 lg:flex-shrink-0 lg:min-w-[360px]">
          <div>
            <h2 className="font-bold mb-4 text-2xl">Category</h2>

            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedCategory === 'All'}
                  onChange={() => handleCategoryClick('All')}
                  className="w-4 h-4 rounded accent-customOrange"
                />
                <span>All</span>
              </label>

              {categories.map((c) => (
                <label
                  key={c.id}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategory === c.name}
                    onChange={() => handleCategoryClick(c.name)}
                    className="w-4 h-4 accent-customOrange"
                  />
                  <span>{c.name}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="w-full lg:w-80">
            <h2 className="font-bold mb-2 text-2xl">Price</h2>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  step={1}
                  min={0}
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-1/2 p-2 rounded"
                />
                <span className="text-2xl">$</span>
              </div>

              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  step={1}
                  min={minPrice ? Number(minPrice) + 1 : 1}
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-1/2 p-2 rounded"
                />
                <span className="text-2xl">$</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
      <main className="flex-1 min-w-0">
        <div className="max-w-7xl mx-auto flex flex-col gap-14 p-4 lg:p-10">
          <div className="flex gap-8 flex-wrap">
            <div className="flex items-center gap-4">
              <span className="font-bold">Sort by</span>
              <select
                value={sortOption}
                onChange={(e) => {
                  setPage(1);
                  setSortOption(e.target.value);
                }}
                className="p-2 rounded"
              >
                <option value="newest">Latest</option>
                <option value="priceAsc">Price: ascending </option>
                <option value="priceDesc">Price: descending</option>
              </select>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-bold">Show</span>
              <select
                value={showCount}
                onChange={(e) => {
                  setPage(1);
                  setShowCount(Number(e.target.value));
                }}
                className="p-2 rounded"
              >
                {[9, 12, 18].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {products.length === 0 ? (
              <div className="font-bold text-xl text-center mt-10">
                No products found
              </div>
            ) : (
              <>
                <div className="flex flex-wrap gap-4">
                  {products.map((p) => (
                    <ProductCard
                      key={p.id}
                      id={p.id}
                      name={p.name}
                      price={p.price}
                      imageUrl={p.imageUrl}
                      stock={p.stock}
                      categoryName={p.categoryName}
                    />
                  ))}
                </div>
                <div className="flex justify-center gap-2 mt-4">
                  {Array.from(
                    { length: Math.ceil(total / showCount) },
                    (_, i) => i + 1
                  ).map((num) => (
                    <button
                      key={num}
                      onClick={() => setPage(num)}
                      className={`px-3 py-1 rounded ${
                        page === num ? 'bg-customOrange' : ''
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
      </main>
    </div>
  );
}
