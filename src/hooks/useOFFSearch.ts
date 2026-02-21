"use client";

import { useState, useEffect, useRef } from "react";
import type { Product } from "@/lib/types";
import { searchOFF } from "@/lib/openfoodfacts";

export function useOFFSearch(query: string, debounceMs = 500) {
  const [offResults, setOffResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [offError, setOffError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const trimmed = query.trim();

    // Clear results immediately when query is empty or too short
    if (trimmed.length < 2) {
      setOffResults([]);
      setIsSearching(false);
      setOffError(null);
      return;
    }

    // Mark as searching immediately so UI can show spinner
    setIsSearching(true);
    setOffError(null);

    const timer = setTimeout(async () => {
      // Abort any in-flight request
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const results = await searchOFF(trimmed, controller.signal);
        if (!controller.signal.aborted) {
          setOffResults(results);
          setOffError(null);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setOffResults([]);
          // Don't show error for user-initiated aborts
          if (!(err instanceof DOMException && err.name === "AbortError")) {
            setOffError("Algunos resultados no pudieron cargarse");
          }
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsSearching(false);
        }
      }
    }, debounceMs);

    return () => {
      clearTimeout(timer);
      abortRef.current?.abort();
    };
  }, [query, debounceMs]);

  return { offResults, isSearching, offError };
}
