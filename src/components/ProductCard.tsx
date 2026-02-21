import Link from "next/link";
import type { Product } from "@/lib/types";
import ScoreCircle from "./ScoreCircle";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const octagonCount = [
    product.excessSugar,
    product.excessSodium,
    product.excessFat,
    product.excessSaturatedFat,
    product.excessCalories,
  ].filter(Boolean).length;

  return (
    <Link href={`/producto/${product.barcode}`}>
      <div className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
        <ScoreCircle score={product.score} size="sm" />
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-clarito-green-dark">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500">{product.brand}</p>
          <div className="mt-1 flex items-center gap-2">
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
              {product.category}
            </span>
            {octagonCount > 0 && (
              <span className="text-xs text-clarito-red">
                {octagonCount} sello{octagonCount > 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
        <svg
          className="h-5 w-5 shrink-0 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </Link>
  );
}
