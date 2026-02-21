"use client";

import { useState } from "react";
import type { Ingredient } from "@/lib/types";
import { getRiskColor, getRiskLabel } from "@/lib/utils";

interface IngredientListProps {
  ingredients: Ingredient[];
}

function RiskDot({ riskLevel }: { riskLevel: string }) {
  const colors: Record<string, string> = {
    safe: "bg-clarito-green",
    moderate: "bg-clarito-orange",
    risky: "bg-clarito-red",
  };
  return (
    <span
      className={`inline-block h-2.5 w-2.5 shrink-0 rounded-full ${colors[riskLevel] || "bg-gray-400"}`}
    />
  );
}

export default function IngredientList({ ingredients }: IngredientListProps) {
  const [expanded, setExpanded] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
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
          <div key={i}>
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="flex w-full items-center justify-between rounded-xl bg-white p-3.5 shadow-sm transition-colors hover:bg-gray-50"
            >
              <div className="flex items-center gap-2.5">
                <RiskDot riskLevel={ingredient.riskLevel} />
                <span className="text-sm font-medium text-gray-800">
                  {ingredient.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium text-white ${getRiskColor(ingredient.riskLevel)}`}
                >
                  {getRiskLabel(ingredient.riskLevel)}
                </span>
                {ingredient.description && (
                  <svg
                    className={`h-4 w-4 text-gray-400 transition-transform ${openIndex === i ? "rotate-180" : ""}`}
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
                )}
              </div>
            </button>
            {openIndex === i && ingredient.description && (
              <div className="animate-expand mx-2 mt-1 rounded-lg border-l-3 border-gray-200 bg-gray-50 px-3.5 py-3">
                <p className="text-sm leading-relaxed text-gray-600">
                  {ingredient.description}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
      {ingredients.length > 3 && !expanded && (
        <button
          onClick={() => setExpanded(true)}
          className="mt-3 flex items-center gap-1 text-sm font-medium text-clarito-green"
        >
          <svg
            className="h-4 w-4"
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
          Ver {ingredients.length - 3} ingredientes más
        </button>
      )}
    </div>
  );
}
