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

function IngredientItem({
  ingredient,
  index,
  openIndex,
  setOpenIndex,
}: {
  ingredient: Ingredient;
  index: number;
  openIndex: number | null;
  setOpenIndex: (i: number | null) => void;
}) {
  const isOpen = openIndex === index;
  return (
    <div>
      <button
        onClick={() => setOpenIndex(isOpen ? null : index)}
        className="flex min-h-[2.75rem] w-full items-center justify-between rounded-xl bg-white p-3.5 shadow-sm transition-colors hover:bg-gray-50 md:bg-gray-50 md:shadow-none md:ring-1 md:ring-gray-200 md:hover:ring-gray-300"
      >
        <div className="flex items-center gap-2.5">
          <RiskDot riskLevel={ingredient.riskLevel} />
          <span className="text-left text-sm font-medium text-gray-800 md:text-base">
            {ingredient.name}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium text-white ${getRiskColor(ingredient.riskLevel)}`}
          >
            {getRiskLabel(ingredient.riskLevel)}
          </span>
          {ingredient.description && (
            <svg
              className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
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
      {isOpen && ingredient.description && (
        <div className="animate-expand mx-1 mt-1 rounded-lg border-l-3 border-gray-200 bg-gray-50 px-3.5 py-3 md:bg-white">
          <p className="text-sm leading-relaxed text-gray-600 md:text-base md:leading-7">
            {ingredient.description}
          </p>
        </div>
      )}
    </div>
  );
}

export default function IngredientList({ ingredients }: IngredientListProps) {
  const [expanded, setExpanded] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const visibleCount = expanded ? ingredients.length : 3;
  const visible = ingredients.slice(0, visibleCount);

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="mb-3 flex min-h-[2.75rem] w-full items-center justify-between text-left"
      >
        <h3 className="text-lg font-semibold text-clarito-green-dark md:text-xl">
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

      {/* Single column on mobile, 2 columns on desktop */}
      <div className="space-y-2 md:grid md:grid-cols-2 md:gap-3 md:space-y-0">
        {visible.map((ingredient, i) => (
          <IngredientItem
            key={i}
            ingredient={ingredient}
            index={i}
            openIndex={openIndex}
            setOpenIndex={setOpenIndex}
          />
        ))}
      </div>

      {ingredients.length > 3 && !expanded && (
        <button
          onClick={() => setExpanded(true)}
          className="mt-3 flex min-h-[2.75rem] items-center gap-1 text-sm font-medium text-clarito-green md:text-base"
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
