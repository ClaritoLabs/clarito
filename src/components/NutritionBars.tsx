import type { Nutrition } from "@/lib/types";

interface NutritionBarsProps {
  nutrition: Nutrition;
}

const nutrients: {
  key: keyof Nutrition;
  label: string;
  unit: string;
  max: number;
  emoji: string;
}[] = [
  { key: "calories", label: "Calorías", unit: "kcal", max: 600, emoji: "🔥" },
  { key: "totalFat", label: "Grasas totales", unit: "g", max: 50, emoji: "🫒" },
  {
    key: "saturatedFat",
    label: "Grasas saturadas",
    unit: "g",
    max: 25,
    emoji: "🧈",
  },
  { key: "sugars", label: "Azúcares", unit: "g", max: 50, emoji: "🍬" },
  { key: "sodium", label: "Sodio", unit: "mg", max: 800, emoji: "🧂" },
  { key: "fiber", label: "Fibra", unit: "g", max: 10, emoji: "🌾" },
  { key: "protein", label: "Proteínas", unit: "g", max: 30, emoji: "💪" },
];

function getBarColor(key: string, value: number, max: number): string {
  const pct = value / max;
  if (key === "fiber" || key === "protein") {
    if (pct >= 0.5) return "bg-clarito-green";
    if (pct >= 0.25) return "bg-yellow-500";
    return "bg-gray-300";
  }
  if (pct >= 0.6) return "bg-clarito-red";
  if (pct >= 0.3) return "bg-clarito-orange";
  return "bg-clarito-green";
}

export default function NutritionBars({ nutrition }: NutritionBarsProps) {
  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold text-clarito-green-dark md:text-xl">
        Nutrición por 100g
      </h3>
      <div className="space-y-3.5 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-4 md:space-y-0">
        {nutrients.map(({ key, label, unit, max, emoji }) => {
          const value = nutrition[key];
          const pct = Math.min((value / max) * 100, 100);
          return (
            <div key={key}>
              <div className="mb-1 flex items-center justify-between text-sm md:text-base">
                <span className="flex items-center gap-1.5 text-gray-700">
                  <span className="text-xs">{emoji}</span>
                  {label}
                </span>
                <span className="font-semibold text-gray-900">
                  {value}
                  {unit}
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100 md:h-3">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${getBarColor(key, value, max)}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
