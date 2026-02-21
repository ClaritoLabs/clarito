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
      <div className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm transition-all hover:shadow-md active:scale-[0.98]">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-2xl">
          {product.emoji}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-clarito-green-dark">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500">{product.brand}</p>
          <div className="mt-1 flex items-center gap-2">
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
              {product.category}
            </span>
            {octagonCount > 0 && (
              <span className="flex items-center gap-1 text-xs font-medium text-clarito-red">
                <span>⬡</span>
                {octagonCount} sello{octagonCount > 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
        <ScoreCircle score={product.score} size="sm" />
      </div>
    </Link>
  );
}
