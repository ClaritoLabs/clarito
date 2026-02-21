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
    <div className="min-h-screen pb-28">
      {/* Header - full width */}
      <header className="sticky top-0 z-10 bg-clarito-green-dark px-4 pb-4 pt-10 sm:px-6 md:px-8 md:pt-6">
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <Link
            href="/"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
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
            <h1 className="truncate text-lg font-bold text-white md:text-xl">
              {product.name}
            </h1>
            <p className="text-sm text-green-200/70 md:text-base">
              {product.brand}
            </p>
          </div>
          <span className="text-3xl md:text-4xl">{product.emoji}</span>
        </div>
      </header>

      {/* Content card - floating on desktop */}
      <div className="md:px-8 md:py-8 lg:px-12">
        <div className="mx-auto max-w-3xl md:overflow-hidden md:rounded-3xl md:bg-white md:shadow-xl md:ring-1 md:ring-gray-100">

          {/* Score + Info hero — side by side on desktop */}
          <section className="px-4 py-8 sm:px-6 md:flex md:items-center md:gap-10 md:px-10 md:py-10">
            {/* Score circle */}
            <div className="flex flex-col items-center gap-4 md:shrink-0">
              <ScoreCircle score={product.score} size="lg" animated />
              <RatingBadge rating={product.rating} size="lg" />
            </div>

            {/* Info panel — stacked on mobile, right side on desktop */}
            <div className="mt-6 flex flex-col items-center gap-4 md:mt-0 md:flex-1 md:items-start">
              {/* NOVA badge */}
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold md:text-sm ${getNovaColor(product.novaGroup)}`}
                >
                  NOVA {product.novaGroup}
                </span>
                <span className="text-xs text-gray-500 md:text-sm">
                  {getNovaLabel(product.novaGroup)}
                </span>
              </div>

              {/* Octógonos inline on desktop */}
              {octagonos.length > 0 && (
                <div className="w-full">
                  <p className="mb-2 text-sm font-medium text-gray-500 max-md:hidden">
                    Sellos de advertencia
                  </p>
                  <div className="flex flex-wrap justify-center gap-4 md:justify-start md:gap-5">
                    {octagonos.map((o) => (
                      <OctagonBadge key={o.key} label={o.label} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Octógonos card — mobile only (full card version) */}
          {octagonos.length > 0 && (
            <section
              className="animate-fade-in-up px-4 pb-6 sm:px-6 md:hidden"
              style={{ animationDelay: "0.1s" }}
            >
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

          {/* Ley reference — desktop only */}
          {octagonos.length > 0 && (
            <div className="hidden border-t border-gray-100 px-10 py-2 md:block">
              <p className="text-xs text-gray-400">
                Según la Ley de Etiquetado Frontal (Ley 27.642)
              </p>
            </div>
          )}

          {/* En resumen */}
          <section
            className="animate-fade-in-up px-4 pb-6 sm:px-6 md:px-10 md:pb-8"
            style={{ animationDelay: "0.2s" }}
          >
            <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold text-clarito-green-dark md:text-xl">
              <span>💬</span> En resumen
            </h3>
            <div className="rounded-2xl bg-white p-4 shadow-sm md:rounded-xl md:bg-gray-50 md:p-5 md:shadow-none">
              <div
                className="mb-3 h-1 w-12 rounded-full"
                style={{ backgroundColor: scoreColor }}
              />
              <p className="text-sm leading-relaxed text-gray-700 md:text-base md:leading-7">
                {product.summary}
              </p>
            </div>
          </section>

          {/* Ingredients — 2 columns on desktop */}
          <section
            className="animate-fade-in-up px-4 pb-6 sm:px-6 md:px-10 md:pb-8"
            style={{ animationDelay: "0.3s" }}
          >
            <IngredientList ingredients={product.ingredients} />
          </section>

          {/* Nutrition — 2 columns on desktop */}
          <section
            className="animate-fade-in-up px-4 pb-6 sm:px-6 md:px-10 md:pb-8"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="rounded-2xl bg-white p-5 shadow-sm md:rounded-xl md:bg-gray-50 md:p-6 md:shadow-none">
              <NutritionBars nutrition={product.nutrition} />
            </div>
          </section>

          {/* Alternatives — horizontal on desktop */}
          {product.alternatives.length > 0 && (
            <section
              className="animate-fade-in-up px-4 pb-6 sm:px-6 md:px-10 md:pb-8"
              style={{ animationDelay: "0.5s" }}
            >
              <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-clarito-green-dark md:text-xl">
                <span>🔄</span> Alternativas más saludables
              </h3>
              <div className="space-y-2 md:flex md:gap-4 md:space-y-0">
                {product.alternatives.map((alt, i) => {
                  const inner = (
                    <div className="flex min-h-[4rem] flex-1 items-center justify-between rounded-2xl bg-white p-4 shadow-sm transition-all hover:shadow-md md:rounded-xl md:bg-gray-50 md:shadow-none md:ring-1 md:ring-gray-200 md:hover:ring-clarito-green/40 md:hover:shadow-sm">
                      <div>
                        <p className="font-medium text-gray-800 md:text-lg">
                          {alt.name}
                        </p>
                        <p className="text-sm text-gray-500">{alt.brand}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-clarito-green md:text-2xl">
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
                    <Link key={i} href={`/producto/${alt.barcode}`} className="md:flex-1">
                      {inner}
                    </Link>
                  ) : (
                    <div key={i} className="md:flex-1">{inner}</div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Disclaimer */}
          <section className="px-4 pb-8 sm:px-6 md:px-10 md:pb-10">
            <div className="rounded-2xl bg-gray-50 p-4 md:rounded-xl md:p-5">
              <p className="text-center text-xs leading-relaxed text-gray-400 md:text-sm">
                La información nutricional es orientativa y se basa en datos
                públicos del envase del producto. Los puntajes son calculados por
                un algoritmo propio y no reemplazan el asesoramiento de un
                profesional de la salud. Clarito no tiene relación comercial con
                ninguna marca.
              </p>
            </div>
          </section>
        </div>
      </div>

      {/* WhatsApp share button */}
      <div className="fixed bottom-0 left-0 right-0 z-20">
        <div className="mx-auto max-w-3xl bg-gradient-to-t from-clarito-bg via-clarito-bg to-transparent px-4 pb-5 pt-8 sm:px-6 md:px-8">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-6 text-base font-semibold text-white shadow-lg transition-transform active:scale-[0.98] md:h-14 md:text-lg"
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
