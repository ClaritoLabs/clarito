import type { Rating } from "./types";

export function getScoreColor(score: number): string {
  if (score >= 76) return "#1B8A2E";
  if (score >= 51) return "#C4A800";
  if (score >= 26) return "#E8A317";
  return "#D42A2A";
}

export function getScoreColorClass(score: number): string {
  if (score >= 76) return "text-clarito-green";
  if (score >= 51) return "text-yellow-600";
  if (score >= 26) return "text-clarito-orange";
  return "text-clarito-red";
}

export function getRatingColor(rating: Rating): string {
  switch (rating) {
    case "Excelente":
      return "bg-clarito-green text-white";
    case "Bueno":
      return "bg-yellow-500 text-white";
    case "Mediocre":
      return "bg-clarito-orange text-white";
    case "Malo":
      return "bg-clarito-red text-white";
  }
}

export function getNovaLabel(group: number): string {
  switch (group) {
    case 1:
      return "Sin procesar";
    case 2:
      return "Ingredientes culinarios";
    case 3:
      return "Procesado";
    case 4:
      return "Ultraprocesado";
    default:
      return "Desconocido";
  }
}

export function getNovaColor(group: number): string {
  switch (group) {
    case 1:
      return "bg-clarito-green text-white";
    case 2:
      return "bg-yellow-500 text-white";
    case 3:
      return "bg-clarito-orange text-white";
    case 4:
      return "bg-clarito-red text-white";
    default:
      return "bg-gray-400 text-white";
  }
}

export function generateSummary(product: {
  name: string;
  score: number;
  rating: string;
  novaGroup: number;
  excessSugar: boolean;
  excessSodium: boolean;
  excessFat: boolean;
  excessSaturatedFat: boolean;
  excessCalories: boolean;
}): string {
  const octagonos: string[] = [];
  if (product.excessSugar) octagonos.push("azúcares");
  if (product.excessSodium) octagonos.push("sodio");
  if (product.excessFat) octagonos.push("grasas totales");
  if (product.excessSaturatedFat) octagonos.push("grasas saturadas");
  if (product.excessCalories) octagonos.push("calorías");

  const parts: string[] = [];

  if (product.score >= 76) {
    parts.push(
      `${product.name} es una buena opción nutricional con un puntaje de ${product.score}/100.`
    );
  } else if (product.score >= 51) {
    parts.push(
      `${product.name} tiene una calidad nutricional aceptable (${product.score}/100).`
    );
  } else if (product.score >= 26) {
    parts.push(
      `${product.name} tiene una calidad nutricional baja (${product.score}/100). Consumí con moderación.`
    );
  } else {
    parts.push(
      `${product.name} tiene una calidad nutricional muy baja (${product.score}/100). Evitá el consumo frecuente.`
    );
  }

  if (product.novaGroup === 4) {
    parts.push("Es un producto ultraprocesado (NOVA 4).");
  } else if (product.novaGroup === 1) {
    parts.push(
      "Es un alimento sin procesar o mínimamente procesado (NOVA 1)."
    );
  }

  if (octagonos.length > 0) {
    parts.push(
      `Tiene exceso de ${octagonos.join(", ")} según la ley de etiquetado frontal.`
    );
  } else {
    parts.push("No tiene sellos de advertencia.");
  }

  return parts.join(" ");
}

export function getRiskColor(risk: string): string {
  switch (risk) {
    case "safe":
      return "bg-clarito-green";
    case "moderate":
      return "bg-clarito-orange";
    case "risky":
      return "bg-clarito-red";
    default:
      return "bg-gray-400";
  }
}

export function getRiskLabel(risk: string): string {
  switch (risk) {
    case "safe":
      return "Seguro";
    case "moderate":
      return "Moderado";
    case "risky":
      return "Riesgoso";
    default:
      return "Desconocido";
  }
}
