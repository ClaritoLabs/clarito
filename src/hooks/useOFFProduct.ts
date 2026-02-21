"use client";

import { useState, useEffect } from "react";
import type { Product } from "@/lib/types";
import { getOFFProductByBarcode } from "@/lib/openfoodfacts";
import { getSavedProducts } from "@/lib/storage";

export type ProductSource = "local" | "saved" | "off" | null;

export function useOFFProduct(
  barcode: string,
  localProduct: Product | undefined
) {
  const [product, setProduct] = useState<Product | null>(localProduct ?? null);
  const [isLoading, setIsLoading] = useState(!localProduct);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<ProductSource>(
    localProduct ? "local" : null
  );

  useEffect(() => {
    // If we have a local product, use it directly
    if (localProduct) {
      setProduct(localProduct);
      setSource("local");
      setIsLoading(false);
      return;
    }

    // Check localStorage
    const saved = getSavedProducts().find((p) => p.barcode === barcode);
    if (saved) {
      setProduct(saved);
      setSource("saved");
      setIsLoading(false);
      return;
    }

    // Fetch from OFF
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    getOFFProductByBarcode(barcode)
      .then((result) => {
        if (cancelled) return;
        setProduct(result);
        setSource(result ? "off" : null);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(
          err instanceof Error
            ? err.message
            : "Error al cargar el producto."
        );
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [barcode, localProduct]);

  return { product, isLoading, error, source };
}
