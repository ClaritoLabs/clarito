"use client";

import { useState, useMemo } from "react";
import { products, categories, searchProducts } from "@/lib/data";
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
        <div className="mb-1 flex items-center gap-2">
          <svg
            className="h-7 w-7 text-clarito-green"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
          </svg>
          <h1 className="text-2xl font-bold text-white">Clarito</h1>
        </div>
        <p className="mb-4 text-sm text-green-200/70">
          Escaneá lo que comés
        </p>

        {/* Search */}
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
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
            placeholder="Buscá un producto, marca o código..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-xl bg-white py-3 pl-10 pr-4 text-sm text-gray-800 shadow-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-clarito-green"
          />
        </div>
      </header>

      {/* Categories */}
      <div className="no-scrollbar flex gap-2 overflow-x-auto px-5 py-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              selectedCategory === cat
                ? "bg-clarito-green text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product list */}
      <main className="space-y-3 px-5 pb-8">
        {filteredProducts.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-lg text-gray-400">
              No se encontraron productos
            </p>
            <p className="mt-1 text-sm text-gray-300">
              Intentá con otra búsqueda
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
