"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { categories, categoryEmojis } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/types";

export default function Explorar() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  // Fetch products from API
  const fetchProducts = async (
    q: string,
    category: string,
    signal?: AbortSignal
  ) => {
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (category && category !== "Todas") params.set("category", category);

    const res = await fetch(`/api/products?${params}`, { signal });
    if (!res.ok) return [];
    return (await res.json()) as Product[];
  };

  // Initial load
  useEffect(() => {
    setIsLoading(true);
    fetchProducts("", "Todas")
      .then(setProducts)
      .finally(() => setIsLoading(false));
  }, []);

  // Search with debounce
  useEffect(() => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsSearching(true);

    const timer = setTimeout(async () => {
      try {
        const results = await fetchProducts(
          query,
          selectedCategory,
          controller.signal
        );
        if (!controller.signal.aborted) {
          setProducts(results);
        }
      } catch {
        // Aborted or network error
      } finally {
        if (!controller.signal.aborted) {
          setIsSearching(false);
        }
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, selectedCategory]);

  const hasQuery = query.trim().length > 0;
  const noResults = !isLoading && !isSearching && products.length === 0;

  return (
    <div className="mx-auto min-h-screen max-w-6xl">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-clarito-green-dark px-4 pb-5 pt-10 sm:px-6 md:px-8 md:pt-8 md:pb-6">
        <div className="mx-auto max-w-4xl">
          <div className="mb-1 flex items-center gap-2.5">
            <Link
              href="/"
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-clarito-green/20 md:h-11 md:w-11"
            >
              <svg
                className="h-5 w-5 text-clarito-green md:h-6 md:w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2" />
                <path d="M8 12l3 3 5-5" />
              </svg>
            </Link>
            <h1
              className="text-2xl font-extrabold tracking-tight md:text-3xl"
              style={{
                background: "linear-gradient(135deg, #4ade80, #1B8A2E)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              clarito
            </h1>
          </div>
          <p className="mb-4 text-sm font-medium text-green-200/70 md:text-base">
            Sabé lo que comés
          </p>

          {/* Search */}
          <div className="relative">
            <svg
              className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Buscá un producto o marca..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-12 w-full rounded-2xl bg-white/95 pl-11 pr-10 text-sm text-gray-800 shadow-sm outline-none backdrop-blur-sm placeholder:text-gray-400 focus:ring-2 focus:ring-clarito-green md:text-base"
            />
            {isSearching && hasQuery && (
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-clarito-green" />
              </div>
            )}
            {query && !isSearching && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-gray-200 text-gray-500 hover:bg-gray-300"
              >
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Categories */}
      <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-4 sm:px-6 md:flex-wrap md:px-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`flex h-11 shrink-0 items-center gap-1.5 rounded-full px-4 text-sm font-medium transition-all md:px-5 md:text-base ${
              selectedCategory === cat
                ? "bg-clarito-green text-white shadow-sm"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            <span className="text-sm">{categoryEmojis[cat]}</span>
            {cat}
          </button>
        ))}
      </div>

      {/* Results count */}
      <div className="px-4 pb-2 sm:px-6 md:px-8">
        <p className="text-xs text-gray-400 md:text-sm">
          {products.length} producto
          {products.length !== 1 ? "s" : ""}
          {selectedCategory !== "Todas" && ` en ${selectedCategory}`}
          {hasQuery && ` para "${query}"`}
        </p>
      </div>

      {/* Product grid */}
      <main className="px-4 pb-8 sm:px-6 md:px-8">
        {/* Loading initial */}
        {isLoading && (
          <div className="flex flex-col items-center gap-3 py-16">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-gray-200 border-t-clarito-green" />
            <p className="text-sm text-gray-400">Cargando productos...</p>
          </div>
        )}

        {!isLoading && products.length > 0 && (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.barcode} product={product} />
            ))}
          </div>
        )}

        {/* No results */}
        {!isLoading && noResults && hasQuery && (
          <div className="py-16 text-center">
            <p className="text-4xl">🔍</p>
            <p className="mt-4 text-lg font-medium text-gray-500">
              No encontramos ese producto
            </p>
            <p className="mt-1.5 text-sm text-gray-400">
              Todavía no tenemos datos sobre &quot;{query}&quot;
            </p>
            <Link
              href="/contribuir"
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-clarito-green-dark px-5 text-sm font-semibold text-white transition-all hover:bg-clarito-green-dark/80 active:scale-[0.98]"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Sugerir este producto
            </Link>
          </div>
        )}

        {/* No products at all */}
        {!isLoading && noResults && !hasQuery && (
          <div className="py-16 text-center">
            <p className="text-4xl">📦</p>
            <p className="mt-4 text-lg font-medium text-gray-500">
              No hay productos cargados
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
