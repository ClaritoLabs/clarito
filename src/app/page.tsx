import Link from "next/link";

const exampleProducts = [
  {
    emoji: "🥛",
    name: "Leche Entera",
    brand: "La Serenísima",
    score: 78,
    rating: "Excelente" as const,
    octogonos: 0,
    barcode: "7793940100011",
  },
  {
    emoji: "🍦",
    name: "Yogur Vainilla",
    brand: "La Serenísima",
    score: 52,
    rating: "Bueno" as const,
    octogonos: 1,
    barcode: "7793940500190",
  },
  {
    emoji: "🥤",
    name: "Coca-Cola",
    brand: "Coca-Cola",
    score: 12,
    rating: "Malo" as const,
    octogonos: 2,
    barcode: "7790895000812",
  },
];

function getScoreColor(score: number) {
  if (score >= 76) return "#1B8A2E";
  if (score >= 51) return "#C4A800";
  if (score >= 26) return "#E8A317";
  return "#D42A2A";
}

function getRatingBg(rating: string) {
  switch (rating) {
    case "Excelente":
      return "bg-clarito-green/10 text-clarito-green";
    case "Bueno":
      return "bg-yellow-100 text-yellow-700";
    case "Mediocre":
      return "bg-orange-100 text-clarito-orange";
    case "Malo":
      return "bg-red-100 text-clarito-red";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

function MiniScoreCircle({ score }: { score: number }) {
  const color = getScoreColor(score);
  const size = 48;
  const strokeWidth = 3.5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <span
        className="absolute text-xs font-bold"
        style={{ color }}
      >
        {score}
      </span>
    </div>
  );
}

const steps = [
  {
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    title: "Buscá un producto",
    description: "Escribí el nombre, la marca o escaneá el código de barras.",
  },
  {
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Mirá el puntaje",
    description: "Cada producto tiene un score de 0 a 100 basado en la Ley 27.642.",
  },
  {
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Entendé qué comés",
    description: "Ingredientes explicados, octógonos de advertencia y alternativas más sanas.",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-clarito-green-dark px-4 pb-16 pt-14 sm:px-6 md:pb-24 md:pt-20">
        {/* Subtle background pattern */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }} />

        <div className="relative mx-auto max-w-5xl">
          <div className="flex flex-col items-center text-center md:flex-row md:items-start md:text-left md:gap-12 lg:gap-20">
            {/* Text content */}
            <div className="flex-1 md:py-8">
              <div className="mb-5 flex items-center justify-center gap-2.5 md:justify-start">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-clarito-green/20">
                  <svg
                    className="h-5 w-5 text-clarito-green"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2" />
                    <path d="M8 12l3 3 5-5" />
                  </svg>
                </div>
                <span
                  className="text-2xl font-extrabold tracking-tight"
                  style={{
                    background: "linear-gradient(135deg, #4ade80, #1B8A2E)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  clarito
                </span>
              </div>

              <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl">
                Sabé lo que{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, #4ade80, #22c55e)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  comés
                </span>
              </h1>

              <p className="mx-auto mt-5 max-w-md text-lg leading-relaxed text-green-200/70 md:mx-0 md:text-xl">
                Escaneá productos del supermercado y descubrí qué tan saludables son. Información clara para comer mejor en Argentina.
              </p>

              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row md:justify-start">
                <Link
                  href="/explorar"
                  className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-clarito-green px-8 text-base font-semibold text-white shadow-lg shadow-clarito-green/25 transition-all hover:bg-clarito-green/90 hover:shadow-xl hover:shadow-clarito-green/30 active:scale-[0.98] sm:w-auto"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Explorar productos
                </Link>
                <span className="text-sm text-green-200/40">
                  Gratis y sin registro
                </span>
              </div>
            </div>

            {/* Phone mockup */}
            <div className="mt-12 w-full max-w-[280px] md:mt-0 md:max-w-[300px]">
              <div className="relative mx-auto">
                {/* Phone frame */}
                <div className="overflow-hidden rounded-[2rem] border-[3px] border-white/10 bg-clarito-bg shadow-2xl">
                  {/* Status bar */}
                  <div className="flex h-7 items-center justify-center bg-clarito-green-dark">
                    <div className="h-1.5 w-16 rounded-full bg-white/20" />
                  </div>
                  {/* App header mini */}
                  <div className="bg-clarito-green-dark px-4 pb-3 pt-2">
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 rounded-md bg-clarito-green/20" />
                      <span className="text-sm font-bold text-clarito-green">clarito</span>
                    </div>
                    <div className="mt-2 h-8 rounded-xl bg-white/90" />
                  </div>
                  {/* Product cards mini */}
                  <div className="space-y-2 px-3 py-3">
                    {exampleProducts.map((p) => (
                      <div
                        key={p.barcode}
                        className="flex items-center gap-3 rounded-xl bg-white p-2.5 shadow-sm"
                      >
                        <span className="text-xl">{p.emoji}</span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-semibold text-gray-800">{p.name}</p>
                          <p className="text-[10px] text-gray-400">{p.brand}</p>
                        </div>
                        <div
                          className="flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold text-white"
                          style={{ backgroundColor: getScoreColor(p.score) }}
                        >
                          {p.score}
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Bottom padding */}
                  <div className="h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-2xl font-extrabold tracking-tight text-gray-800 sm:text-3xl">
            ¿Cómo funciona?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-center text-base text-gray-400">
            Tres pasos simples para tomar mejores decisiones en el supermercado.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
            {steps.map((step, i) => (
              <div
                key={i}
                className="relative flex flex-col items-center rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-gray-100 md:p-8"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-clarito-green/10 text-clarito-green">
                  {step.icon}
                </div>
                <span className="absolute -top-3 left-6 flex h-6 w-6 items-center justify-center rounded-full bg-clarito-green text-xs font-bold text-white">
                  {i + 1}
                </span>
                <h3 className="text-lg font-bold text-gray-800">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Example products */}
      <section className="bg-gray-50 px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-2xl font-extrabold tracking-tight text-gray-800 sm:text-3xl">
            Ejemplos reales
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-center text-base text-gray-400">
            Mirá cómo Clarito analiza productos que comprás todos los días.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
            {exampleProducts.map((product) => (
              <Link
                key={product.barcode}
                href={`/producto/${product.barcode}`}
                className="group flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100 transition-all hover:shadow-md hover:ring-gray-200 sm:flex-col sm:items-center sm:p-6 sm:text-center"
              >
                <span className="text-4xl sm:text-5xl">{product.emoji}</span>
                <div className="min-w-0 flex-1 sm:w-full">
                  <p className="truncate text-base font-semibold text-gray-800 group-hover:text-clarito-green">
                    {product.name}
                  </p>
                  <p className="text-sm text-gray-400">{product.brand}</p>
                  <div className="mt-2 flex items-center gap-2 sm:justify-center">
                    <MiniScoreCircle score={product.score} />
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${getRatingBg(product.rating)}`}>
                      {product.rating}
                    </span>
                  </div>
                  {product.octogonos > 0 && (
                    <p className="mt-1.5 text-xs text-gray-400">
                      {product.octogonos} {product.octogonos === 1 ? "sello" : "sellos"} de advertencia
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-800 sm:text-3xl">
            Empezá a comer mejor
          </h2>
          <p className="mx-auto mt-3 max-w-md text-base text-gray-400">
            Explorá cientos de productos argentinos y descubrí qué hay realmente en lo que comés.
          </p>
          <Link
            href="/explorar"
            className="mt-8 inline-flex h-14 items-center gap-2 rounded-2xl bg-clarito-green px-10 text-base font-semibold text-white shadow-lg shadow-clarito-green/25 transition-all hover:bg-clarito-green/90 hover:shadow-xl hover:shadow-clarito-green/30 active:scale-[0.98]"
          >
            Empezá a explorar
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-4 py-8 sm:px-6">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-clarito-green-dark">
              <svg
                className="h-3.5 w-3.5 text-clarito-green"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2" />
                <path d="M8 12l3 3 5-5" />
              </svg>
            </div>
            <span className="text-sm font-bold text-gray-800">clarito</span>
          </div>
          <p className="text-sm text-gray-400">
            Información nutricional clara basada en la Ley 27.642 de Etiquetado Frontal.
          </p>
          <p className="text-sm text-gray-400">
            Datos provistos por{" "}
            <a
              href="https://world.openfoodfacts.org"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-gray-600"
            >
              Open Food Facts
            </a>
          </p>
          <p className="mt-2 text-xs text-gray-300">
            Hecho en Argentina 🇦🇷
          </p>
        </div>
      </footer>
    </div>
  );
}
