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
    <div className="mx-auto min-h-screen max-w-lg">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-clarito-green-dark px-5 pb-5 pt-12">
        <div className="mb-1 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-clarito-green/20">
            <svg
              className="h-5 w-5 text-clarito-green"
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
            className="text-2xl font-extrabold tracking-tight"
            style={{
              background: "linear-gradient(135deg, #4ade80, #1B8A2E)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            clarito
          </h1>
        </div>
        <p className="mb-4 text-sm font-medium text-green-200/70">
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
            className="w-full rounded-2xl bg-white/95 py-3.5 pl-11 pr-4 text-sm text-gray-800 shadow-sm outline-none backdrop-blur-sm placeholder:text-gray-400 focus:ring-2 focus:ring-clarito-green"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-full bg-gray-200 p-1 text-gray-500 hover:bg-gray-300"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </header>

      {/* Categories */}
      <div className="no-scrollbar flex gap-2 overflow-x-auto px-5 py-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${
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
      <div className="px-5 pb-2">
        <p className="text-xs text-gray-400">
          {filteredProducts.length} producto{filteredProducts.length !== 1 ? "s" : ""}
          {selectedCategory !== "Todas" && ` en ${selectedCategory}`}
          {query && ` para "${query}"`}
        </p>
      </div>

      {/* Product list */}
      <main className="space-y-3 px-5 pb-8">
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
          filteredProducts.map((product) => (
            <ProductCard key={product.barcode} product={product} />
          ))
        )}
      </main>
    </div>
  );
}
