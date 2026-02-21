import type { Ingredient, Nutrition, Rating, RiskLevel } from "./types";

export interface OctogonoResult {
  excessSugar: boolean;
  excessSodium: boolean;
  excessFat: boolean;
  excessSaturatedFat: boolean;
  excessCalories: boolean;
}

// Ley 27.642 — Etiquetado Frontal de Alimentos
// Umbrales para sólidos (por 100g) y líquidos (por 100ml)
const THRESHOLDS = {
  solid: { calories: 275, sugars: 10, totalFat: 13, saturatedFat: 4, sodium: 400 },
  liquid: { calories: 70, sugars: 5, totalFat: 3, saturatedFat: 1.5, sodium: 200 },
};

export function detectOctogonos(
  nutrition: Nutrition,
  isLiquid: boolean
): OctogonoResult {
  const t = isLiquid ? THRESHOLDS.liquid : THRESHOLDS.solid;
  return {
    excessCalories: nutrition.calories >= t.calories,
    excessSugar: nutrition.sugars >= t.sugars,
    excessFat: nutrition.totalFat >= t.totalFat,
    excessSaturatedFat: nutrition.saturatedFat >= t.saturatedFat,
    excessSodium: nutrition.sodium >= t.sodium,
  };
}

export function countOctogonos(oct: OctogonoResult): number {
  return [
    oct.excessSugar,
    oct.excessSodium,
    oct.excessFat,
    oct.excessSaturatedFat,
    oct.excessCalories,
  ].filter(Boolean).length;
}

/**
 * Score 0-100 compuesto por:
 * - Nutri-Score (40%): A=40, B=30, C=20, D=10, E=0
 * - NOVA (30%): 1=30, 2=22, 3=15, 4=0
 * - Octógonos (30%): 30 - (6 * cantidad de octógonos)
 */
export function calculateScore(
  nutriscoreGrade: string | undefined,
  novaGroup: number,
  octogonos: OctogonoResult
): number {
  // Nutri-Score component (0-40)
  const nutriscorePoints: Record<string, number> = {
    a: 40, b: 30, c: 20, d: 10, e: 0,
  };
  const nsComponent = nutriscoreGrade
    ? (nutriscorePoints[nutriscoreGrade.toLowerCase()] ?? 20)
    : 20; // default to C if unknown

  // NOVA component (0-30)
  const novaPoints: Record<number, number> = { 1: 30, 2: 22, 3: 15, 4: 0 };
  const novaComponent = novaPoints[novaGroup] ?? 0;

  // Octógonos component (0-30)
  const octCount = countOctogonos(octogonos);
  const octComponent = Math.max(0, 30 - octCount * 6);

  return Math.round(nsComponent + novaComponent + octComponent);
}

export function scoreToRating(score: number): Rating {
  if (score >= 76) return "Excelente";
  if (score >= 51) return "Bueno";
  if (score >= 26) return "Mediocre";
  return "Malo";
}

// Keywords for ingredient risk classification
const RISKY_KEYWORDS = [
  "azucar", "azúcar", "jarabe", "glucosa", "fructosa", "sacarosa",
  "hidrogenado", "hidrogenada", "trans",
  "tbhq", "bha", "bht",
  "nitrito", "nitrato",
  "e150", "e250", "e251",
  "aspartamo", "ciclamato", "sacarina",
  "acesulfame",
];

const MODERATE_KEYWORDS = [
  "sal", "aceite", "grasa", "vegetal",
  "colorante", "saborizante", "conservante",
  "fosfórico", "fosforico",
  "benzoato", "sorbato",
  "dextrosa", "maltodextrina",
  "cafeína", "cafeina",
  "almidón modificado", "almidon modificado",
  "propionato",
  "lecitina",
  "mono y diglicéridos", "emulsionante",
  "antioxidante",
  "ácido cítrico", "acido citrico",
];

export function classifyIngredient(name: string): RiskLevel {
  const lower = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  for (const kw of RISKY_KEYWORDS) {
    const kwNorm = kw.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (lower.includes(kwNorm)) return "risky";
  }
  for (const kw of MODERATE_KEYWORDS) {
    const kwNorm = kw.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (lower.includes(kwNorm)) return "moderate";
  }
  return "safe";
}

/**
 * Parsea texto de ingredientes (comma-separated) a Ingredient[].
 * Maneja paréntesis anidados: "aceite vegetal (palma, soja)" → un solo ingrediente.
 */
export function parseIngredients(text: string): Ingredient[] {
  if (!text || !text.trim()) return [];

  const ingredients: string[] = [];
  let current = "";
  let depth = 0;

  for (const char of text) {
    if (char === "(") {
      depth++;
      current += char;
    } else if (char === ")") {
      depth = Math.max(0, depth - 1);
      current += char;
    } else if (char === "," && depth === 0) {
      const trimmed = current.trim();
      if (trimmed) ingredients.push(trimmed);
      current = "";
    } else {
      current += char;
    }
  }
  const last = current.trim();
  if (last) ingredients.push(last);

  return ingredients
    .map((name) => {
      // Clean up: remove leading numbers/percentages, dots
      const cleaned = name.replace(/^\d+[\.,]?\d*\s*%?\s*/, "").trim();
      if (!cleaned) return null;
      // Capitalize first letter
      const capitalized = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
      return {
        name: capitalized,
        riskLevel: classifyIngredient(cleaned),
      };
    })
    .filter((i): i is Ingredient => i !== null);
}

const LIQUID_KEYWORDS = [
  "bebida", "jugo", "juice", "agua", "water",
  "cerveza", "beer", "gaseosa", "soda", "cola",
  "leche", "milk", "yogur", "yogurt",
  "vino", "wine", "refresco", "drink",
  "néctar", "nectar", "té", "tea", "café",
];

export function isLiquidProduct(
  categories: string | undefined,
  quantity: string | undefined
): boolean {
  if (quantity) {
    const lower = quantity.toLowerCase();
    if (/\d+\s*(ml|l|cl|dl)\b/.test(lower)) return true;
  }
  if (categories) {
    const lower = categories.toLowerCase();
    return LIQUID_KEYWORDS.some((kw) => lower.includes(kw));
  }
  return false;
}
