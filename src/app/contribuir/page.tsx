import Link from "next/link";

export default function Contribuir() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="mx-auto max-w-md text-center">
        <p className="text-5xl">🧪</p>
        <h1 className="mt-5 text-2xl font-extrabold text-gray-800">
          Próximamente
        </h1>
        <p className="mt-3 text-base leading-relaxed text-gray-500">
          Estamos trabajando para que puedas sugerir productos que falten.
          Mientras tanto, podés escribirnos a{" "}
          <a
            href="mailto:info@clarito.app?subject=Sugerir producto"
            className="font-medium text-clarito-green underline underline-offset-2"
          >
            info@clarito.app
          </a>{" "}
          para pedir que agreguemos un producto.
        </p>
        <Link
          href="/explorar"
          className="mt-8 inline-flex h-12 items-center gap-2 rounded-2xl bg-clarito-green-dark px-6 text-sm font-semibold text-white transition-all hover:bg-clarito-green-dark/80 active:scale-[0.98]"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Volver a explorar
        </Link>
      </div>
    </div>
  );
}
