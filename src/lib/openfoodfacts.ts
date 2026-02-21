import type { Product, Nutrition } from "./types";
import { generateSummary } from "./utils";
import {
  detectOctogonos,
  calculateScore,
  scoreToRating,
  parseIngredients,
  isLiquidProduct,
} from "./scoring";

// ── OFF API types (exported for API routes) ──────────────────────

export interface OFFNutriments {
  "energy-kcal_100g"?: number;
  "energy-kcal"?: number;
  fat_100g?: number;
  fat?: number;
  "saturated-fat_100g"?: number;
  "saturated-fat"?: number;
  sodium_100g?: number;
  sodium?: number;
  carbohydrates_100g?: number;
  carbohydrates?: number;
  sugars_100g?: number;
  sugars?: number;
  fiber_100g?: number;
  fiber?: number;
  proteins_100g?: number;
  proteins?: number;
}

export interface OFFProduct {
  code?: string;
  product_name?: string;
  brands?: string;
  categories?: string;
  nutriscore_grade?: string;
  nova_group?: number;
  nutriments?: OFFNutriments;
  ingredients_text_es?: string;
  ingredients_text?: string;
  countries_tags?: string[];
  image_url?: string;
  quantity?: string;
}

export interface OFFSearchResponse {
  count: number;
  page: number;
  page_size: number;
  products: OFFProduct[];
}

export interface OFFProductResponse {
  code: string;
  product?: OFFProduct;
  status: number;
  status_verbose: string;
}

// ── Constants (exported for API routes) ──────────────────────────

export const OFF_FIELDS = [
  "code",
  "product_name",
  "brands",
  "categories",
  "nutriscore_grade",
  "nova_group",
  "nutriments",
  "ingredients_text_es",
  "ingredients_text",
  "countries_tags",
  "image_url",
  "quantity",
].join(",");

export const OFF_BASE_URL = "https://world.openfoodfacts.net/cgi/search.pl";
export const OFF_PRODUCT_URL = "https://world.openfoodfacts.net/api/v2/product";
export const OFF_USER_AGENT = "Clarito/1.0 (clarito-cyan.vercel.app)";

// ── Category mapping ─────────────────────────────────────────────

const CATEGORY_MAP: Record<string, string> = {
  bebida: "Bebidas",
  beverage: "Bebidas",
  drink: "Bebidas",
  gaseosa: "Bebidas",
  soda: "Bebidas",
  juice: "Bebidas",
  jugo: "Bebidas",
  water: "Bebidas",
  agua: "Bebidas",
  cerveza: "Bebidas",
  beer: "Bebidas",
  wine: "Bebidas",
  vino: "Bebidas",
  milk: "Lácteos",
  leche: "Lácteos",
  dairy: "Lácteos",
  lácteo: "Lácteos",
  lacteo: "Lácteos",
  yogur: "Lácteos",
  yogurt: "Lácteos",
  queso: "Lácteos",
  cheese: "Lácteos",
  galleta: "Galletitas",
  galletita: "Galletitas",
  cookie: "Galletitas",
  biscuit: "Galletitas",
  snack: "Snacks",
  chip: "Snacks",
  papa: "Snacks",
  golosina: "Golosinas",
  candy: "Golosinas",
  chocolate: "Golosinas",
  confection: "Golosinas",
  sweet: "Golosinas",
  alfajor: "Golosinas",
  pan: "Panificados",
  bread: "Panificados",
  panadería: "Panificados",
  panaderia: "Panificados",
};

const CATEGORY_EMOJIS: Record<string, string> = {
  Bebidas: "🥤",
  Lácteos: "🥛",
  Galletitas: "🍪",
  Snacks: "🥔",
  Golosinas: "🍫",
  Panificados: "🍞",
  Otros: "📦",
};

function mapCategory(categories: string | undefined): string {
  if (!categories) return "Otros";
  const lower = categories.toLowerCase();
  for (const [keyword, cat] of Object.entries(CATEGORY_MAP)) {
    if (lower.includes(keyword)) return cat;
  }
  return "Otros";
}

function mapNutrition(n: OFFNutriments | undefined): Nutrition {
  if (!n) {
    return {
      calories: 0, totalFat: 0, saturatedFat: 0, sodium: 0,
      totalCarbs: 0, sugars: 0, fiber: 0, protein: 0,
    };
  }
  return {
    calories: Math.round(n["energy-kcal_100g"] ?? n["energy-kcal"] ?? 0),
    totalFat: round1(n.fat_100g ?? n.fat ?? 0),
    saturatedFat: round1(n["saturated-fat_100g"] ?? n["saturated-fat"] ?? 0),
    sodium: Math.round((n.sodium_100g ?? n.sodium ?? 0) * 1000),
    totalCarbs: round1(n.carbohydrates_100g ?? n.carbohydrates ?? 0),
    sugars: round1(n.sugars_100g ?? n.sugars ?? 0),
    fiber: round1(n.fiber_100g ?? n.fiber ?? 0),
    protein: round1(n.proteins_100g ?? n.proteins ?? 0),
  };
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

// ── Mapper (exported for API routes) ─────────────────────────────

export function mapOFFToProduct(off: OFFProduct): Product | null {
  if (!off.product_name?.trim()) return null;

  const name = off.product_name.trim();
  const brand = off.brands?.split(",")[0]?.trim() || "Marca desconocida";
  const category = mapCategory(off.categories);
  const nutrition = mapNutrition(off.nutriments);
  const liquid = isLiquidProduct(off.categories, off.quantity);
  const novaGroup = (off.nova_group && off.nova_group >= 1 && off.nova_group <= 4
    ? off.nova_group
    : 4) as 1 | 2 | 3 | 4;

  const octogonos = detectOctogonos(nutrition, liquid);
  const score = calculateScore(off.nutriscore_grade, novaGroup, octogonos);
  const rating = scoreToRating(score);

  const ingredientsText = off.ingredients_text_es || off.ingredients_text || "";
  const ingredients = parseIngredients(ingredientsText);

  return {
    barcode: off.code || "",
    name,
    brand,
    category,
    emoji: CATEGORY_EMOJIS[category] || "📦",
    score,
    rating,
    novaGroup,
    ...octogonos,
    summary: generateSummary({ name, score, rating, novaGroup, ...octogonos }),
    nutrition,
    ingredients,
    imageUrl: off.image_url,
    alternatives: [],
  };
}

// ── Client-side functions (call our API proxy routes) ────────────

export async function searchOFF(
  query: string,
  signal?: AbortSignal
): Promise<Product[]> {
  const res = await fetch(
    `/api/search?q=${encodeURIComponent(query)}`,
    { signal }
  );

  if (!res.ok) {
    throw new Error("No se pudieron cargar los resultados.");
  }

  const data: Product[] = await res.json();
  return data;
}

export async function getOFFProductByBarcode(
  barcode: string,
  signal?: AbortSignal
): Promise<Product | null> {
  const res = await fetch(
    `/api/product?barcode=${encodeURIComponent(barcode)}`,
    { signal }
  );

  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error("No se pudo cargar el producto.");
  }

  const data: Product | null = await res.json();
  return data;
}
