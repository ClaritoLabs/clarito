"use client";

import { useState } from "react";
import type { Ingredient } from "@/lib/types";
import { getRiskColor, getRiskLabel } from "@/lib/utils";

interface IngredientListProps {
  ingredients: Ingredient[];
}

export default function IngredientList({ ingredients }: IngredientListProps) {
  const [expanded, setExpanded] = useState(false);
  const visibleCount = expanded ? ingredients.length : 3;

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="mb-3 flex w-full items-center justify-between text-left"
      >
        <h3 className="text-lg font-semibold text-clarito-green-dark">
          Ingredientes ({ingredients.length})
        </h3>
        <svg
          className={`h-5 w-5 text-gray-500 transition-transform ${expanded ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div className="space-y-2">
        {ingredients.slice(0, visibleCount).map((ingredient, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-lg bg-white p-3 shadow-sm"
          >
            <span className="text-sm text-gray-800">{ingredient.name}</span>
            <span
              className={`flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium text-white ${getRiskColor(ingredient.riskLevel)}`}
            >
              <span
                className={`inline-block h-1.5 w-1.5 rounded-full bg-white`}
              />
              {getRiskLabel(ingredient.riskLevel)}
            </span>
          </div>
        ))}
      </div>
      {ingredients.length > 3 && !expanded && (
        <button
          onClick={() => setExpanded(true)}
          className="mt-2 text-sm font-medium text-clarito-green"
        >
          Ver {ingredients.length - 3} ingredientes más...
        </button>
      )}
    </div>
  );
}
