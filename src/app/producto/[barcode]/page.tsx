"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductByBarcode } from "@/data/products";
import { getNovaColor, getNovaLabel, getScoreColor } from "@/lib/utils";
import ScoreCircle from "@/components/ScoreCircle";
import RatingBadge from "@/components/RatingBadge";
import OctagonBadge from "@/components/OctagonBadge";
import IngredientList from "@/components/IngredientList";
import NutritionBars from "@/components/NutritionBars";

export default function ProductDetail({
  params,
}: {
  params: Promise<{ barcode: string }>;
}) {
  const { barcode } = use(params);
  const product = getProductByBarcode(barcode);

  if (!product) {
    notFound();
  }

  const octagonos: { key: string; label: string }[] = [];
  if (product.excessSugar)
    octagonos.push({ key: "sugar", label: "Azúcares" });
  if (product.excessSodium)
    octagonos.push({ key: "sodium", label: "Sodio" });
  if (product.excessFat)
    octagonos.push({ key: "fat", label: "Grasas Totales" });
  if (product.excessSaturatedFat)
    octagonos.push({ key: "satfat", label: "Grasas Saturadas" });
  if (product.excessCalories)
    octagonos.push({ key: "cal", label: "Calorías" });

  const scoreColor = getScoreColor(product.score);

  const shareText = `Escaneé *${product.name}* (${product.brand}) con *Clarito* y tiene un puntaje de *${product.score}/100* - ${product.rating}${octagonos.length > 0 ? `\n${octagonos.length} sello${octagonos.length > 1 ? "s" : ""} de advertencia` : ""}\n\nMirá más en clarito-cyan.vercel.app`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

  return (
    <div className="mx-auto min-h-screen max-w-lg pb-28">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-clarito-green-dark px-5 pb-4 pt-12">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
          >
            <svg
              className="h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-bold text-white">
              {product.name}
            </h1>
            <p className="text-sm text-green-200/70">{product.brand}</p>
          </div>
          <span className="text-3xl">{product.emoji}</span>
        </div>
      </header>

      {/* Score section */}
      <section className="flex flex-col items-center gap-4 px-5 py-8">
        <ScoreCircle score={product.score} size="lg" animated />
        <RatingBadge rating={product.rating} size="lg" />
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${getNovaColor(product.novaGroup)}`}
          >
            NOVA {product.novaGroup}
          </span>
          <span className="text-xs text-gray-500">
            {getNovaLabel(product.novaGroup)}
          </span>
        </div>
      </section>

      {/* Octógonos de la Ley de Etiquetado */}
      {octagonos.length > 0 && (
        <section className="animate-fade-in-up px-5 pb-6" style={{ animationDelay: "0.1s" }}>
          <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-clarito-green-dark">
            <span>⬡</span> Sellos de advertencia
          </h3>
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex flex-wrap justify-center gap-5">
              {octagonos.map((o) => (
                <OctagonBadge key={o.key} label={o.label} />
              ))}
            </div>
            <p className="mt-4 text-center text-xs text-gray-400">
              Según la Ley de Etiquetado Frontal (Ley 27.642)
            </p>
          </div>
        </section>
      )}

      {/* En resumen */}
      <section className="animate-fade-in-up px-5 pb-6" style={{ animationDelay: "0.2s" }}>
        <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold text-clarito-green-dark">
          <span>💬</span> En resumen
        </h3>
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <div
            className="mb-3 h-1 w-12 rounded-full"
            style={{ backgroundColor: scoreColor }}
          />
          <p className="text-sm leading-relaxed text-gray-700">
            {product.summary}
          </p>
        </div>
      </section>

      {/* Ingredients */}
      <section className="animate-fade-in-up px-5 pb-6" style={{ animationDelay: "0.3s" }}>
        <IngredientList ingredients={product.ingredients} />
      </section>

      {/* Nutrition */}
      <section className="animate-fade-in-up px-5 pb-6" style={{ animationDelay: "0.4s" }}>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <NutritionBars nutrition={product.nutrition} />
        </div>
      </section>

      {/* Alternatives */}
      {product.alternatives.length > 0 && (
        <section className="animate-fade-in-up px-5 pb-6" style={{ animationDelay: "0.5s" }}>
          <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-clarito-green-dark">
            <span>🔄</span> Alternativas más saludables
          </h3>
          <div className="space-y-2">
            {product.alternatives.map((alt, i) => {
              const inner = (
                <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm transition-all hover:shadow-md">
                  <div>
                    <p className="font-medium text-gray-800">{alt.name}</p>
                    <p className="text-sm text-gray-500">{alt.brand}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-clarito-green">
                      {alt.score}
                    </span>
                    <span className="text-xs text-gray-400">/100</span>
                    {alt.barcode && (
                      <svg
                        className="h-4 w-4 text-gray-400"
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
                    )}
                  </div>
                </div>
              );

              return alt.barcode ? (
                <Link key={i} href={`/producto/${alt.barcode}`}>
                  {inner}
                </Link>
              ) : (
                <div key={i}>{inner}</div>
              );
            })}
          </div>
        </section>
      )}

      {/* Disclaimer */}
      <section className="px-5 pb-8">
        <div className="rounded-2xl bg-gray-50 p-4">
          <p className="text-center text-xs leading-relaxed text-gray-400">
            La información nutricional es orientativa y se basa en datos
            públicos del envase del producto. Los puntajes son calculados por un
            algoritmo propio y no reemplazan el asesoramiento de un profesional
            de la salud. Clarito no tiene relación comercial con ninguna marca.
          </p>
        </div>
      </section>

      {/* WhatsApp share button */}
      <div className="fixed bottom-0 left-0 right-0 z-20 mx-auto max-w-lg">
        <div className="bg-gradient-to-t from-clarito-bg via-clarito-bg to-transparent px-5 pb-5 pt-8">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-6 py-3.5 text-base font-semibold text-white shadow-lg transition-transform active:scale-[0.98]"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Compartir por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
