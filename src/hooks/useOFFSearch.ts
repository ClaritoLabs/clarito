"use client";

import { useState, useCallback } from "react";
import type { Product } from "@/lib/types";
import { searchOFF } from "@/lib/openfoodfacts";

export function useOFFSearch() {
  const [offResults, setOffResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string) => {
    setIsSearching(true);
    setError(null);
    setOffResults([]);
    try {
      const results = await searchOFF(query);
      setOffResults(results);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al buscar en Open Food Facts."
      );
    } finally {
      setIsSearching(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setOffResults([]);
    setError(null);
  }, []);

  return { offResults, isSearching, error, searchOFF: search, clearResults };
}
