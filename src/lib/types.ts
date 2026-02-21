export type RiskLevel = "safe" | "moderate" | "risky";

export type Rating = "Excelente" | "Bueno" | "Mediocre" | "Malo";

export interface Ingredient {
  name: string;
  riskLevel: RiskLevel;
  description?: string;
}

export interface Nutrition {
  calories: number;
  totalFat: number;
  saturatedFat: number;
  sodium: number;
  totalCarbs: number;
  sugars: number;
  fiber: number;
  protein: number;
}

export interface Alternative {
  name: string;
  brand: string;
  score: number;
  barcode?: string;
}

export interface Product {
  barcode: string;
  name: string;
  brand: string;
  category: string;
  emoji: string;
  score: number;
  rating: Rating;
  novaGroup: 1 | 2 | 3 | 4;
  excessSugar: boolean;
  excessSodium: boolean;
  excessFat: boolean;
  excessSaturatedFat: boolean;
  excessCalories: boolean;
  summary: string;
  nutrition: Nutrition;
  ingredients: Ingredient[];
  imageUrl?: string;
  alternatives: Alternative[];
}
