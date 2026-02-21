import Link from "next/link";
import type { Product } from "@/lib/types";
import ScoreCircle from "./ScoreCircle";

interface ProductCardProps {
  product: Product;
  source?: "local" | "saved" | "off";
}

export default function ProductCard({
  product,
  source,
}: ProductCardProps) {
  const octagonCount = [
    product.excessSugar,
    product.excessSodium,
    product.excessFat,
    product.excessSaturatedFat,
    product.excessCalories,
  ].filter(Boolean).length;

  return (
    <Link href={`/producto/${product.barcode}`}>
      <div className="flex min-h-[4.5rem] items-center gap-3 rounded-2xl bg-white p-3.5 shadow-sm transition-all hover:shadow-md active:scale-[0.98] sm:gap-4 sm:p-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-2xl sm:h-12 sm:w-12">
          {product.emoji}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-clarito-green-dark sm:text-base">
            {product.name}
          </h3>
          <p className="text-xs text-gray-500 sm:text-sm">{product.brand}</p>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
              {product.category}
            </span>
            {octagonCount > 0 && (
              <span className="flex items-center gap-1 text-xs font-medium text-clarito-red">
                <span>⬡</span>
                {octagonCount} sello{octagonCount > 1 ? "s" : ""}
              </span>
            )}
            {source === "off" && (
              <span className="rounded-full bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-500">
                OFF
              </span>
            )}
            {source === "saved" && (
              <span className="rounded-full bg-clarito-green-light px-1.5 py-0.5 text-[10px] font-medium text-clarito-green">
                Guardado
              </span>
            )}
          </div>
        </div>
        <ScoreCircle score={product.score} size="sm" />
      </div>
    </Link>
  );
}
