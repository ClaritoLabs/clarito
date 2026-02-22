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
 * - Procesamiento (30%): 1=30, 2=22, 3=15, 4=0
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

// Marcadores de ultra-procesado (NOVA 4)
// Si el producto contiene AL MENOS UNO de estos, es ultra-procesado
const ULTRA_PROCESSED_MARKERS = [
  "jarabe de maiz", "jarabe de maíz",
  "alta fructosa",
  "aceite hidrogenado", "aceite vegetal hidrogenado",
  "grasa hidrogenada", "grasa vegetal hidrogenada",
  "proteina aislada", "proteína aislada",
  "proteina hidrolizada", "proteína hidrolizada",
  "almidon modificado", "almidón modificado",
  "dextrosa",
  "maltodextrina",
  "jarabe de glucosa",
  "glutamato monosodico", "glutamato monosódico",
  "aspartamo",
  "acesulfame",
  "sucralosa",
  "sacarina",
  "ciclamato",
  "carboximetilcelulosa",
  "polisorbato",
  "tbhq",
  "bha",
  "bht",
  "nitrito de sodio", "nitrito",
  "nitrato",
  "rojo 40", "red 40",
  "amarillo 5", "yellow 5",
  "amarillo 6", "yellow 6",
  "azul 1", "blue 1",
  "caramelo iv", "caramelo 4", "e150d",
  "saborizante artificial", "aroma artificial",
  "colorante artificial",
];

// Marcadores de procesado (NOVA 3)
// Producto con 4-8 ingredientes que contiene estos PERO NINGUNO de ultra-procesado
const PROCESSED_MARKERS = [
  "sal",
  "azucar", "azúcar",
  "aceite",
  "vinagre",
  "sorbato de potasio", "sorbato",
  "acido citrico", "ácido cítrico",
  "acido ascorbico", "ácido ascórbico",
  "conservante",
];

// Keywords for ingredient risk classification (para el badge de cada ingrediente)
const RISKY_KEYWORDS = [
  ...ULTRA_PROCESSED_MARKERS,
  "azucar", "azúcar", "jarabe", "glucosa", "fructosa", "sacarosa",
  "hidrogenado", "hidrogenada", "trans",
  "e150", "e250", "e251",
];

const MODERATE_KEYWORDS = [
  "sal", "aceite", "grasa", "vegetal",
  "colorante", "saborizante", "conservante",
  "fosfórico", "fosforico",
  "benzoato", "sorbato",
  "cafeína", "cafeina",
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

/**
 * Estima el nivel de procesamiento basado en ingredientes concretos.
 *
 * 4 (Ultra-procesado): contiene al menos un marcador de ultra-procesado
 * 3 (Procesado): 4-8 ingredientes con sal/azúcar/aceite/conservantes simples, sin marcadores ultra
 * 2 (Mínimamente procesado): 2-4 ingredientes sin aditivos artificiales
 * 1 (Natural): 1-2 ingredientes, alimentos sin modificar
 */
export function estimateNovaGroup(ingredients: Ingredient[]): 1 | 2 | 3 | 4 {
  if (ingredients.length === 0) return 1;

  const total = ingredients.length;
  const allNames = ingredients.map((i) =>
    i.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  );

  // Check for ultra-processed markers
  const hasUltraMarker = ULTRA_PROCESSED_MARKERS.some((marker) => {
    const norm = marker.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return allNames.some((name) => name.includes(norm));
  });

  if (hasUltraMarker) return 4;

  // Check for processed markers (sal, azúcar, aceite, conservantes simples)
  const hasProcessedMarker = PROCESSED_MARKERS.some((marker) => {
    const norm = marker.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return allNames.some((name) => name.includes(norm));
  });

  if (hasProcessedMarker && total >= 4) return 3;

  // Mínimamente procesado: 2-4 ingredientes sin aditivos
  if (total >= 2 && total <= 4) return 2;

  // Más de 4 ingredientes sin marcadores → procesado
  if (total > 4) return 3;

  // 1 ingrediente natural
  return 1;
}

/**
 * Estima un grado Nutri-Score simplificado (a-e) a partir de datos nutricionales.
 * Estima un grado basado en el perfil nutricional del producto.
 */
export function estimateNutriscoreGrade(nutrition: Nutrition, isLiquid: boolean): string {
  let negative = 0;

  if (isLiquid) {
    if (nutrition.calories > 54) negative += 4;
    else if (nutrition.calories > 27) negative += 2;
    else if (nutrition.calories > 0) negative += 1;

    if (nutrition.sugars > 9) negative += 4;
    else if (nutrition.sugars > 4.5) negative += 2;
    else if (nutrition.sugars > 1.5) negative += 1;
  } else {
    if (nutrition.calories > 335) negative += 4;
    else if (nutrition.calories > 200) negative += 2;
    else if (nutrition.calories > 80) negative += 1;

    if (nutrition.sugars > 27) negative += 4;
    else if (nutrition.sugars > 13.5) negative += 2;
    else if (nutrition.sugars > 4.5) negative += 1;
  }

  if (nutrition.saturatedFat > 10) negative += 4;
  else if (nutrition.saturatedFat > 4) negative += 2;
  else if (nutrition.saturatedFat > 1) negative += 1;

  const sodiumG = nutrition.sodium / 1000;
  if (sodiumG > 0.9) negative += 4;
  else if (sodiumG > 0.45) negative += 2;
  else if (sodiumG > 0.18) negative += 1;

  let positive = 0;

  if (nutrition.fiber > 3.5) positive += 4;
  else if (nutrition.fiber > 2) positive += 2;
  else if (nutrition.fiber > 0.7) positive += 1;

  if (nutrition.protein > 8) positive += 4;
  else if (nutrition.protein > 4.8) positive += 2;
  else if (nutrition.protein > 1.6) positive += 1;

  const total = negative - positive;

  if (total <= -1) return "a";
  if (total <= 3) return "b";
  if (total <= 8) return "c";
  if (total <= 13) return "d";
  return "e";
}
