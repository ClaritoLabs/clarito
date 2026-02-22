import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { products as hardcodedProducts } from "@/data/products";
import type { Product, Nutrition, Ingredient } from "@/lib/types";
import {
  detectOctogonos,
  calculateScore,
  scoreToRating,
  parseIngredients,
  estimateNovaGroup,
  estimateNutriscoreGrade,
} from "@/lib/scoring";
import { generateSummary } from "@/lib/utils";

const ADMIN_PASSWORD = "clarito2026";

const CATEGORY_EMOJIS: Record<string, string> = {
  Bebidas: "🥤",
  Lácteos: "🥛",
  Galletitas: "🍪",
  Snacks: "🥔",
  Golosinas: "🍫",
  Panificados: "🍞",
  Carnes: "🥩",
  Almacén: "🫙",
  Congelados: "❄️",
  Otros: "📦",
};

// Map Supabase row → Product
function mapFromSupabase(row: Record<string, unknown>): Product {
  return {
    barcode: row.barcode as string,
    name: row.name as string,
    brand: row.brand as string,
    category: row.category as string,
    emoji: row.emoji as string,
    score: row.score as number,
    rating: row.rating as Product["rating"],
    novaGroup: row.nova_group as 1 | 2 | 3 | 4,
    excessSugar: row.excess_sugar as boolean,
    excessSodium: row.excess_sodium as boolean,
    excessFat: row.excess_fat as boolean,
    excessSaturatedFat: row.excess_saturated_fat as boolean,
    excessCalories: row.excess_calories as boolean,
    summary: row.summary as string,
    nutrition: row.nutrition as Nutrition,
    ingredients: row.ingredients as Ingredient[],
    imageUrl: (row.image_url as string) || undefined,
    alternatives: (row.alternatives as Product["alternatives"]) || [],
    isLiquid: row.is_liquid as boolean,
  };
}


// GET /api/products?q=query&category=Bebidas
export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim() || "";
  const category = request.nextUrl.searchParams.get("category") || "";

  if (!isSupabaseConfigured()) {
    // Fallback to hardcoded products
    let results = hardcodedProducts;
    if (q) {
      const lower = q.toLowerCase();
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(lower) ||
          p.brand.toLowerCase().includes(lower) ||
          p.barcode.includes(q)
      );
    }
    if (category && category !== "Todas") {
      results = results.filter((p) => p.category === category);
    }
    return NextResponse.json(results);
  }

  let query = supabase.from("products").select("*");

  if (q) {
    query = query.or(
      `name.ilike.%${q}%,brand.ilike.%${q}%,barcode.ilike.%${q}%`
    );
  }
  if (category && category !== "Todas") {
    query = query.eq("category", category);
  }

  query = query.order("name");

  const { data, error } = await query;

  if (error) {
    console.error("[Products API] Error:", error.message);
    return NextResponse.json([], { status: 500 });
  }

  const products = (data || []).map(mapFromSupabase);
  return NextResponse.json(products);
}

// POST /api/products — create new product (admin only)
export async function POST(request: NextRequest) {
  const password = request.headers.get("x-admin-password");
  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase no está configurado" },
      { status: 500 }
    );
  }

  const body = await request.json();

  const nutrition: Nutrition = {
    calories: Number(body.calories) || 0,
    totalFat: Number(body.totalFat) || 0,
    saturatedFat: Number(body.saturatedFat) || 0,
    sodium: Number(body.sodium) || 0,
    totalCarbs: 0,
    sugars: Number(body.sugars) || 0,
    fiber: Number(body.fiber) || 0,
    protein: Number(body.protein) || 0,
  };

  const isLiquid = body.isLiquid === true;
  const ingredients = parseIngredients(body.ingredientsText || "");
  const octogonos = detectOctogonos(nutrition, isLiquid);
  const novaGroup = estimateNovaGroup(ingredients);
  const nutriscoreGrade = estimateNutriscoreGrade(nutrition, isLiquid);
  const score = calculateScore(nutriscoreGrade, novaGroup, octogonos);
  const rating = scoreToRating(score);
  const emoji = CATEGORY_EMOJIS[body.category] || "📦";
  const name = (body.name || "").trim();
  const summary = generateSummary({
    name,
    score,
    rating,
    novaGroup,
    ...octogonos,
  });

  const row = {
    barcode: (body.barcode || "").trim(),
    name,
    brand: (body.brand || "").trim(),
    category: body.category || "Otros",
    emoji,
    score,
    rating,
    nova_group: novaGroup,
    is_liquid: isLiquid,
    excess_sugar: octogonos.excessSugar,
    excess_sodium: octogonos.excessSodium,
    excess_fat: octogonos.excessFat,
    excess_saturated_fat: octogonos.excessSaturatedFat,
    excess_calories: octogonos.excessCalories,
    summary,
    nutrition,
    ingredients,
    image_url: (body.imageUrl || "").trim() || null,
    alternatives: [],
  };

  const { data, error } = await supabase
    .from("products")
    .insert(row)
    .select()
    .single();

  if (error) {
    console.error("[Products API] Insert error:", error.message);
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "Ya existe un producto con ese código de barras" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(mapFromSupabase(data), { status: 201 });
}
