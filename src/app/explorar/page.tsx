"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  products as hardcodedProducts,
  categories,
  categoryEmojis,
  searchProducts,
} from "@/data/products";
import { getSavedProducts } from "@/lib/storage";
import { useOFFSearch } from "@/hooks/useOFFSearch";
import ProductCard from "@/components/ProductCard";

export default function Explorar() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [savedProducts, setSavedProducts] = useState<
    typeof hardcodedProducts
  >([]);

  const { offResults, isSearching, error: offError, searchOFF, clearResults } =
    useOFFSearch();

  // Load saved products from localStorage on mount
  useEffect(() => {
    setSavedProducts(getSavedProducts());
  }, []);

  // Merge hardcoded + saved, hardcoded takes precedence
  const allLocalProducts = useMemo(() => {
    const hardcodedBarcodes = new Set(hardcodedProducts.map((p) => p.barcode));
    const uniqueSaved = savedProducts.filter(
      (p) => !hardcodedBarcodes.has(p.barcode)
    );
    return [...hardcodedProducts, ...uniqueSaved];
  }, [savedProducts]);

  const filteredProducts = useMemo(() => {
    let result = query ? searchProducts(query) : allLocalProducts;
    // Also search saved products by name/brand
    if (query) {
      const q = query.toLowerCase();
      const savedMatches = savedProducts.filter(
        (p) =>
          !hardcodedProducts.some((hp) => hp.barcode === p.barcode) &&
          (p.name.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.barcode.includes(q))
      );
      const hardcodedResults = searchProducts(query);
      const barcodes = new Set(hardcodedResults.map((p) => p.barcode));
      result = [
        ...hardcodedResults,
        ...savedMatches.filter((p) => !barcodes.has(p.barcode)),
      ];
    }
    if (selectedCategory !== "Todas") {
      result = result.filter((p) => p.category === selectedCategory);
    }
    return result;
  }, [query, selectedCategory, allLocalProducts, savedProducts]);

  // Clear OFF results when query changes
  useEffect(() => {
    clearResults();
  }, [query, clearResults]);

  const showOFFButton =
    filteredProducts.length === 0 &&
    query.trim().length > 0 &&
    !isSearching &&
    offResults.length === 0;

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
            {query && (
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
          {filteredProducts.length} producto
          {filteredProducts.length !== 1 ? "s" : ""}
          {selectedCategory !== "Todas" && ` en ${selectedCategory}`}
          {query && ` para "${query}"`}
        </p>
      </div>

      {/* Product grid */}
      <main className="px-4 pb-8 sm:px-6 md:px-8">
        {filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product.barcode} product={product} />
            ))}
          </div>
        )}

        {/* Empty local results */}
        {filteredProducts.length === 0 && !isSearching && offResults.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-4xl">🔍</p>
            <p className="mt-3 text-lg font-medium text-gray-400">
              No se encontraron productos
            </p>
            <p className="mt-1 text-sm text-gray-300">
              Intentá con otro nombre o marca
            </p>
          </div>
        )}

        {/* Search OFF button */}
        {showOFFButton && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => searchOFF(query)}
              className="flex h-12 items-center gap-2 rounded-2xl bg-clarito-green px-6 text-sm font-semibold text-white shadow-sm transition-all hover:bg-clarito-green/90 active:scale-[0.98]"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                />
              </svg>
              Buscar en Open Food Facts
            </button>
          </div>
        )}

        {/* Loading spinner */}
        {isSearching && (
          <div className="flex flex-col items-center gap-3 py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-3 border-gray-200 border-t-clarito-green" />
            <p className="text-sm text-gray-400">
              Buscando en Open Food Facts...
            </p>
          </div>
        )}

        {/* OFF error */}
        {offError && (
          <div className="mt-4 rounded-2xl bg-red-50 p-4 text-center">
            <p className="text-sm text-clarito-red">{offError}</p>
          </div>
        )}

        {/* OFF results */}
        {offResults.length > 0 && (
          <div className="mt-6">
            <div className="mb-3 flex items-center gap-2">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-xs font-medium text-gray-400">
                Resultados de Open Food Facts
              </span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
              {offResults.map((product) => (
                <ProductCard
                  key={product.barcode}
                  product={product}
                  source="off"
                />
              ))}
            </div>
          </div>
        )}

        {/* OFF search returned nothing */}
        {!isSearching &&
          offResults.length === 0 &&
          filteredProducts.length === 0 &&
          offError === null &&
          !showOFFButton &&
          query.trim().length > 0 && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-400">
                Tampoco se encontraron resultados en Open Food Facts.
              </p>
            </div>
          )}
      </main>
    </div>
  );
}
