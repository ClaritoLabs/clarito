"use client";

import { useState, useEffect, useRef } from "react";
import type { Product } from "@/lib/types";
import { searchOFF } from "@/lib/openfoodfacts";

export function useOFFSearch(query: string, debounceMs = 500) {
  const [offResults, setOffResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const trimmed = query.trim();

    // Clear results immediately when query is empty or too short
    if (trimmed.length < 2) {
      setOffResults([]);
      setIsSearching(false);
      return;
    }

    // Mark as searching immediately so UI can show spinner
    setIsSearching(true);

    const timer = setTimeout(async () => {
      // Abort any in-flight request
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const results = await searchOFF(trimmed);
        if (!controller.signal.aborted) {
          setOffResults(results);
        }
      } catch {
        if (!controller.signal.aborted) {
          setOffResults([]);
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

  return { offResults, isSearching };
}
