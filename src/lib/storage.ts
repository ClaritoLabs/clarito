import type { Product } from "./types";

const STORAGE_KEY = "clarito_saved_products";

export function getSavedProducts(): Product[] {
  try {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Product[];
  } catch {
    return [];
  }
}

export function saveProduct(product: Product): void {
  try {
    if (typeof window === "undefined") return;
    const saved = getSavedProducts();
    const filtered = saved.filter((p) => p.barcode !== product.barcode);
    filtered.push(product);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch {
    // localStorage full or unavailable
  }
}

export function removeProduct(barcode: string): void {
  try {
    if (typeof window === "undefined") return;
    const saved = getSavedProducts();
    const filtered = saved.filter((p) => p.barcode !== barcode);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch {
    // localStorage unavailable
  }
}

export function isProductSaved(barcode: string): boolean {
  return getSavedProducts().some((p) => p.barcode === barcode);
}
