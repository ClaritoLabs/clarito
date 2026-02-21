import type { Nutrition } from "@/lib/types";

interface NutritionBarsProps {
  nutrition: Nutrition;
}

const maxValues: Record<string, number> = {
  calories: 600,
  totalFat: 50,
  saturatedFat: 25,
  sodium: 800,
  totalCarbs: 80,
  sugars: 50,
  fiber: 10,
  protein: 30,
};

const labels: Record<string, string> = {
  calories: "Calorías",
  totalFat: "Grasas totales",
  saturatedFat: "Grasas saturadas",
  sodium: "Sodio",
  totalCarbs: "Carbohidratos",
  sugars: "Azúcares",
  fiber: "Fibra",
  protein: "Proteínas",
};

const units: Record<string, string> = {
  calories: "kcal",
  totalFat: "g",
  saturatedFat: "g",
  sodium: "mg",
  totalCarbs: "g",
  sugars: "g",
  fiber: "g",
  protein: "g",
};

function getBarColor(key: string, value: number): string {
  const max = maxValues[key];
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
  const entries = Object.entries(nutrition) as [string, number][];

  return (
    <div>
      <h3 className="mb-3 text-lg font-semibold text-clarito-green-dark">
        Nutrición por 100g
      </h3>
      <div className="space-y-3">
        {entries.map(([key, value]) => {
          const max = maxValues[key];
          const pct = Math.min((value / max) * 100, 100);
          return (
            <div key={key}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-gray-700">{labels[key]}</span>
                <span className="font-medium text-gray-900">
                  {value}
                  {units[key]}
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${getBarColor(key, value)}`}
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
