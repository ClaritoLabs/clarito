"use client";

import { useState, useMemo } from "react";
import { products, categories, categoryEmojis, searchProducts } from "@/data/products";
import ProductCard from "@/components/ProductCard";

export default function Home() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");

  const filteredProducts = useMemo(() => {
    let result = query ? searchProducts(query) : products;
    if (selectedCategory !== "Todas") {
      result = result.filter((p) => p.category === selectedCategory);
    }
    return result;
  }, [query, selectedCategory]);

  return (
    <div className="mx-auto min-h-screen max-w-6xl">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-clarito-green-dark px-4 pb-5 pt-10 sm:px-6 md:px-8 md:pt-8 md:pb-6">
        <div className="mx-auto max-w-4xl">
          <div className="mb-1 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-clarito-green/20 md:h-11 md:w-11">
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
            </div>
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
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-gray-200 text-gray-500 hover:bg-gray-300"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
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
          {filteredProducts.length} producto{filteredProducts.length !== 1 ? "s" : ""}
          {selectedCategory !== "Todas" && ` en ${selectedCategory}`}
          {query && ` para "${query}"`}
        </p>
      </div>

      {/* Product grid */}
      <main className="px-4 pb-8 sm:px-6 md:px-8">
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-4xl">🔍</p>
            <p className="mt-3 text-lg font-medium text-gray-400">
              No se encontraron productos
            </p>
            <p className="mt-1 text-sm text-gray-300">
              Intentá con otro nombre o marca
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 md:gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.barcode} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
