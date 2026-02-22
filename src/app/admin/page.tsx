"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import type { Product, Nutrition } from "@/lib/types";
import {
  detectOctogonos,
  calculateScore,
  scoreToRating,
  parseIngredients,
  estimateNovaGroup,
  estimateNutriscoreGrade,
  countOctogonos,
} from "@/lib/scoring";
import {
  generateSummary,
  getScoreColor,
  getProcessingLabel,
  getProcessingEmoji,
  getProcessingColor,
} from "@/lib/utils";

const ADMIN_PASSWORD = "clarito2026";

const CATEGORIES = [
  "Bebidas", "Lácteos", "Galletitas", "Snacks", "Golosinas",
  "Panificados", "Carnes", "Almacén", "Congelados", "Otros",
];

interface FormData {
  barcode: string;
  name: string;
  brand: string;
  category: string;
  isLiquid: boolean;
  calories: string;
  totalFat: string;
  saturatedFat: string;
  sugars: string;
  sodium: string;
  fiber: string;
  protein: string;
  ingredientsText: string;
}

const emptyForm: FormData = {
  barcode: "", name: "", brand: "", category: "Otros", isLiquid: false,
  calories: "", totalFat: "", saturatedFat: "", sugars: "",
  sodium: "", fiber: "", protein: "", ingredientsText: "",
};

// ── Helpers ──────────────────────────────────────────────────────

function resizeImage(file: File, maxWidth: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ── Photo Upload Zone ────────────────────────────────────────────

const MAX_PHOTOS = 5;

function PhotoUpload({
  photos,
  onAdd,
  onRemove,
}: {
  photos: string[];
  onAdd: (images: string[]) => void;
  onRemove: (index: number) => void;
}) {
  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const remaining = MAX_PHOTOS - photos.length;
    const toProcess = Array.from(files).slice(0, remaining);
    const resized = await Promise.all(toProcess.map((f) => resizeImage(f, 1200)));
    onAdd(resized);
    e.target.value = "";
  };

  return (
    <div>
      {/* Drop zone / main upload area */}
      {photos.length === 0 ? (
        <label className="flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-gray-200 bg-white p-8 transition-colors hover:border-clarito-green/40 active:bg-gray-50">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-50">
            <span className="text-3xl">📸</span>
          </div>
          <div className="text-center">
            <p className="font-semibold text-gray-700">Arrastrá o sacá fotos del producto</p>
            <p className="mt-1 text-xs text-gray-400">
              Podés subir de 1 a 5 fotos: frente, tabla nutricional, ingredientes, o lo que necesites
            </p>
          </div>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            multiple
            onChange={handleFiles}
            className="hidden"
          />
        </label>
      ) : (
        <div className="space-y-3">
          {/* Thumbnails grid */}
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {photos.map((photo, i) => (
              <div key={i} className="group relative">
                <img
                  src={photo}
                  alt={`Foto ${i + 1}`}
                  className="h-24 w-full rounded-xl object-cover sm:h-28"
                />
                <button
                  onClick={() => onRemove(i)}
                  className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-gray-800 text-xs font-bold text-white shadow-md transition-opacity hover:bg-red-600 sm:opacity-0 sm:group-hover:opacity-100"
                  aria-label="Eliminar foto"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Add more button */}
          {photos.length < MAX_PHOTOS && (
            <label className="flex h-10 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-dashed border-gray-200 text-sm font-medium text-gray-500 transition-colors hover:border-clarito-green/40 hover:text-clarito-green active:bg-gray-50">
              + Agregar otra foto
              <input
                type="file"
                accept="image/*"
                capture="environment"
                multiple
                onChange={handleFiles}
                className="hidden"
              />
            </label>
          )}

          <p className="text-center text-[10px] text-gray-300">
            {photos.length} de {MAX_PHOTOS} fotos
          </p>
        </div>
      )}
    </div>
  );
}

// ── Score Preview ────────────────────────────────────────────────

function ScorePreview({ form }: { form: FormData }) {
  const calc = useMemo(() => {
    const nutrition: Nutrition = {
      calories: Number(form.calories) || 0,
      totalFat: Number(form.totalFat) || 0,
      saturatedFat: Number(form.saturatedFat) || 0,
      sodium: Number(form.sodium) || 0,
      totalCarbs: 0,
      sugars: Number(form.sugars) || 0,
      fiber: Number(form.fiber) || 0,
      protein: Number(form.protein) || 0,
    };
    const ingredients = parseIngredients(form.ingredientsText);
    const octogonos = detectOctogonos(nutrition, form.isLiquid);
    const novaGroup = estimateNovaGroup(ingredients);
    const nsGrade = estimateNutriscoreGrade(nutrition, form.isLiquid);
    const score = calculateScore(nsGrade, novaGroup, octogonos);
    const rating = scoreToRating(score);
    const octCount = countOctogonos(octogonos);
    return { score, rating, novaGroup, octCount, octogonos };
  }, [form]);

  if (!form.name) return null;

  const color = getScoreColor(calc.score);

  const octLabels: string[] = [];
  if (calc.octogonos.excessSugar) octLabels.push("Azúcares");
  if (calc.octogonos.excessSodium) octLabels.push("Sodio");
  if (calc.octogonos.excessFat) octLabels.push("Grasas");
  if (calc.octogonos.excessSaturatedFat) octLabels.push("Grasas sat.");
  if (calc.octogonos.excessCalories) octLabels.push("Calorías");

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold text-gray-500">Preview</h3>
      <div className="flex items-center gap-4">
        <div
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-xl font-bold text-white"
          style={{ backgroundColor: color }}
        >
          {calc.score}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-gray-800">{form.name}</p>
          <p className="text-sm text-gray-400">{form.brand}</p>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${getProcessingColor(calc.novaGroup)}`}>
              {getProcessingEmoji(calc.novaGroup)} {getProcessingLabel(calc.novaGroup)}
            </span>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
              calc.rating === "Excelente" ? "bg-clarito-green/10 text-clarito-green"
              : calc.rating === "Bueno" ? "bg-yellow-100 text-yellow-700"
              : calc.rating === "Mediocre" ? "bg-orange-100 text-clarito-orange"
              : "bg-red-100 text-clarito-red"
            }`}>
              {calc.rating}
            </span>
          </div>
        </div>
      </div>
      {octLabels.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {octLabels.map((l) => (
            <span key={l} className="rounded bg-gray-900 px-2 py-0.5 text-[10px] font-bold text-white">
              EXCESO EN {l.toUpperCase()}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Password Gate ────────────────────────────────────────────────

function PasswordGate({ onAuth }: { onAuth: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("admin_auth", "true");
      onAuth();
    } else {
      setError(true);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-clarito-bg px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-extrabold text-gray-800">Admin Clarito</h1>
        <label className="mb-2 block text-sm font-medium text-gray-600">Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(false); }}
          className="mb-4 h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-clarito-green focus:ring-2 focus:ring-clarito-green/20"
          placeholder="Ingresá la contraseña"
          autoFocus
        />
        {error && <p className="mb-3 text-sm text-clarito-red">Contraseña incorrecta</p>}
        <button type="submit" className="h-12 w-full rounded-xl bg-clarito-green font-semibold text-white transition-colors hover:bg-clarito-green/90">
          Entrar
        </button>
        <Link href="/" className="mt-4 block text-center text-sm text-gray-400 hover:text-gray-600">Volver al inicio</Link>
      </form>
    </div>
  );
}

// ── Product List ─────────────────────────────────────────────────

function ProductList({
  products, onEdit, onDelete, loading,
}: {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (barcode: string) => void;
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
        <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-clarito-green" />
        <p className="mt-3 text-sm text-gray-400">Cargando productos...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
        <p className="text-4xl">📦</p>
        <p className="mt-3 text-gray-500">No hay productos cargados</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white shadow-sm">
      <h2 className="border-b border-gray-100 px-4 py-4 text-lg font-bold text-gray-800 sm:px-6">
        Productos ({products.length})
      </h2>
      <div className="divide-y divide-gray-50">
        {products.map((product) => (
          <div key={product.barcode} className="flex items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6 sm:py-4">
            <span className="text-2xl">{product.emoji}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-800">{product.name}</p>
              <p className="truncate text-xs text-gray-400">{product.brand} · {product.barcode}</p>
            </div>
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
              style={{ backgroundColor: getScoreColor(product.score) }}
            >
              {product.score}
            </span>
            <button
              onClick={() => onEdit(product)}
              className="shrink-0 rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-blue-600 active:bg-blue-100"
            >
              Editar
            </button>
            <button
              onClick={() => { if (confirm(`¿Eliminar "${product.name}"?`)) onDelete(product.barcode); }}
              className="shrink-0 rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-600 active:bg-red-100"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Admin Page ──────────────────────────────────────────────

type Step = "photos" | "review";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Photo + AI state
  const [step, setStep] = useState<Step>("photos");
  const [photos, setPhotos] = useState<string[]>([]);
  const [analyzing, setAnalyzing] = useState(false);

  // Form state (editable after AI analysis, or for manual edit)
  const [form, setForm] = useState<FormData>(emptyForm);
  const [editingBarcode, setEditingBarcode] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("admin_auth") === "true") {
      setAuthenticated(true);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoadingList(true);
    try {
      const res = await fetch("/api/products");
      if (res.ok) setProducts(await res.json());
    } catch { /* network error */ } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    if (authenticated) fetchProducts();
  }, [authenticated, fetchProducts]);

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const updateField = (field: keyof FormData, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // ── AI Analysis ──

  const handleAnalyze = async () => {
    if (photos.length === 0) {
      showMessage("error", "Subí al menos una foto");
      return;
    }

    setAnalyzing(true);
    setMessage(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": ADMIN_PASSWORD,
        },
        body: JSON.stringify({ images: photos }),
      });

      const data = await res.json();

      if (!res.ok) {
        showMessage("error", data.error || "Error al analizar");
        return;
      }

      // Populate form with AI results
      setForm({
        barcode: data.barcode || "",
        name: data.name || "",
        brand: data.brand || "",
        category: CATEGORIES.includes(data.category) ? data.category : "Otros",
        isLiquid: data.productType === "liquid",
        calories: data.nutrition?.calories != null ? String(data.nutrition.calories) : "",
        totalFat: data.nutrition?.fat != null ? String(data.nutrition.fat) : "",
        saturatedFat: data.nutrition?.saturatedFat != null ? String(data.nutrition.saturatedFat) : "",
        sugars: data.nutrition?.sugar != null ? String(data.nutrition.sugar) : "",
        sodium: data.nutrition?.sodium != null ? String(data.nutrition.sodium) : "",
        fiber: data.nutrition?.fiber != null ? String(data.nutrition.fiber) : "",
        protein: data.nutrition?.protein != null ? String(data.nutrition.protein) : "",
        ingredientsText: Array.isArray(data.ingredients) ? data.ingredients.join(", ") : "",
      });

      setStep("review");
      showMessage("success", "Datos extraídos. Revisá y corregí lo que haga falta.");
    } catch {
      showMessage("error", "Error de conexión");
    } finally {
      setAnalyzing(false);
    }
  };

  // ── Save Product ──

  const handleSave = async () => {
    if (!form.name || !form.barcode) {
      showMessage("error", "Nombre y código de barras son obligatorios");
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const body = {
        barcode: form.barcode,
        name: form.name,
        brand: form.brand,
        category: form.category,
        imageUrl: photos[0] || "",
        isLiquid: form.isLiquid,
        calories: Number(form.calories) || 0,
        totalFat: Number(form.totalFat) || 0,
        saturatedFat: Number(form.saturatedFat) || 0,
        sugars: Number(form.sugars) || 0,
        sodium: Number(form.sodium) || 0,
        fiber: Number(form.fiber) || 0,
        protein: Number(form.protein) || 0,
        ingredientsText: form.ingredientsText,
      };

      const url = editingBarcode ? `/api/products/${editingBarcode}` : "/api/products";
      const method = editingBarcode ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", "x-admin-password": ADMIN_PASSWORD },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        showMessage("error", data.error || "Error al guardar");
        return;
      }

      showMessage("success", editingBarcode ? "Producto actualizado" : "Producto guardado");
      resetAll();
      fetchProducts();
    } catch {
      showMessage("error", "Error de conexión");
    } finally {
      setSaving(false);
    }
  };

  // ── Edit existing product ──

  const handleEdit = (product: Product) => {
    setEditingBarcode(product.barcode);
    setForm({
      barcode: product.barcode,
      name: product.name,
      brand: product.brand,
      category: product.category,
      isLiquid: product.isLiquid || false,
      calories: String(product.nutrition.calories || ""),
      totalFat: String(product.nutrition.totalFat || ""),
      saturatedFat: String(product.nutrition.saturatedFat || ""),
      sugars: String(product.nutrition.sugars || ""),
      sodium: String(product.nutrition.sodium || ""),
      fiber: String(product.nutrition.fiber || ""),
      protein: String(product.nutrition.protein || ""),
      ingredientsText: product.ingredients.map((i) => i.name).join(", "),
    });
    setPhotos([]);
    setStep("review");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (barcode: string) => {
    try {
      const res = await fetch(`/api/products/${barcode}`, {
        method: "DELETE",
        headers: { "x-admin-password": ADMIN_PASSWORD },
      });
      if (!res.ok) {
        const data = await res.json();
        showMessage("error", data.error || "Error al eliminar");
        return;
      }
      showMessage("success", "Producto eliminado");
      fetchProducts();
    } catch {
      showMessage("error", "Error de conexión");
    }
  };

  const resetAll = () => {
    setForm(emptyForm);
    setPhotos([]);
    setStep("photos");
    setEditingBarcode(null);
  };

  if (!authenticated) {
    return <PasswordGate onAuth={() => setAuthenticated(true)} />;
  }

  const hasAnyImage = photos.length > 0;

  return (
    <div className="min-h-screen bg-clarito-bg pb-8">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-clarito-green-dark px-4 pb-4 pt-10 sm:px-6 md:px-8 md:pt-6">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Admin Clarito</h1>
            <p className="text-sm text-green-200/70">Fotos + IA</p>
          </div>
          <Link
            href="/explorar"
            className="flex h-9 items-center rounded-lg bg-white/10 px-4 text-sm font-medium text-white transition-colors hover:bg-white/20"
          >
            Ver app
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-4 px-4 py-4 sm:px-6 md:px-8 md:py-6">
        {/* Message */}
        {message && (
          <div className={`rounded-xl px-4 py-3 text-sm font-medium ${
            message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          }`}>
            {message.text}
          </div>
        )}

        {/* ─── STEP 1: Photos ─── */}
        {step === "photos" && (
          <div className="space-y-4">
            <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-6">
              <h2 className="mb-1 text-lg font-bold text-gray-800">Nuevo producto</h2>
              <p className="mb-5 text-sm text-gray-400">
                Sacá fotos del producto y la IA extrae los datos automáticamente.
              </p>

              <PhotoUpload
                photos={photos}
                onAdd={(newPhotos) =>
                  setPhotos((prev) => [...prev, ...newPhotos].slice(0, MAX_PHOTOS))
                }
                onRemove={(index) =>
                  setPhotos((prev) => prev.filter((_, i) => i !== index))
                }
              />

              <button
                onClick={handleAnalyze}
                disabled={analyzing || !hasAnyImage}
                className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-clarito-green text-sm font-semibold text-white transition-colors hover:bg-clarito-green/90 disabled:opacity-50 active:scale-[0.98]"
              >
                {analyzing ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Analizando con IA...
                  </>
                ) : (
                  "🔍 Analizar con IA"
                )}
              </button>

              {/* Manual entry shortcut */}
              <button
                onClick={() => setStep("review")}
                className="mt-3 w-full text-center text-xs text-gray-400 underline underline-offset-2"
              >
                O cargar datos manualmente
              </button>
            </div>
          </div>
        )}

        {/* ─── STEP 2: Review + Edit ─── */}
        {step === "review" && (
          <div className="space-y-4">
            {/* Photos reference (collapsible on mobile) */}
            {hasAnyImage && (
              <details className="rounded-2xl bg-white shadow-sm">
                <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-gray-500 sm:px-6">
                  📷 Ver fotos originales ({photos.length})
                </summary>
                <div className="grid grid-cols-3 gap-2 px-4 pb-4 sm:grid-cols-5 sm:px-6">
                  {photos.map((photo, i) => (
                    <img key={i} src={photo} alt={`Foto ${i + 1}`} className="rounded-lg" />
                  ))}
                </div>
              </details>
            )}

            {/* Editable form */}
            <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-6">
              <h2 className="mb-4 text-lg font-bold text-gray-800">
                {editingBarcode ? "Editar producto" : "Revisá los datos"}
              </h2>

              <div className="space-y-4">
                {/* Basic info */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500">Código de barras</label>
                    <input
                      type="text" value={form.barcode}
                      onChange={(e) => updateField("barcode", e.target.value)}
                      disabled={!!editingBarcode}
                      className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-clarito-green focus:ring-2 focus:ring-clarito-green/20 disabled:bg-gray-50"
                      placeholder="7790895000812"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500">Nombre</label>
                    <input
                      type="text" value={form.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-clarito-green focus:ring-2 focus:ring-clarito-green/20"
                      placeholder="Nombre del producto"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500">Marca</label>
                    <input
                      type="text" value={form.brand}
                      onChange={(e) => updateField("brand", e.target.value)}
                      className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-clarito-green focus:ring-2 focus:ring-clarito-green/20"
                      placeholder="Marca"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500">Categoría</label>
                    <select
                      value={form.category}
                      onChange={(e) => updateField("category", e.target.value)}
                      className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-clarito-green focus:ring-2 focus:ring-clarito-green/20"
                    >
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                {/* Product type */}
                <div className="flex gap-4">
                  <label className="flex cursor-pointer items-center gap-2">
                    <input type="radio" name="ptype" checked={!form.isLiquid}
                      onChange={() => updateField("isLiquid", false)} className="accent-clarito-green" />
                    <span className="text-sm text-gray-700">Sólido</span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-2">
                    <input type="radio" name="ptype" checked={form.isLiquid}
                      onChange={() => updateField("isLiquid", true)} className="accent-clarito-green" />
                    <span className="text-sm text-gray-700">Líquido</span>
                  </label>
                </div>

                {/* Nutrition */}
                <div>
                  <h3 className="mb-2 text-xs font-semibold text-gray-500">Nutrición por 100g/ml</h3>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {([
                      ["calories", "Calorías", "kcal"],
                      ["totalFat", "Grasas", "g"],
                      ["saturatedFat", "Grasas sat.", "g"],
                      ["sugars", "Azúcares", "g"],
                      ["sodium", "Sodio", "mg"],
                      ["fiber", "Fibra", "g"],
                      ["protein", "Proteínas", "g"],
                    ] as const).map(([field, label, unit]) => (
                      <div key={field}>
                        <label className="mb-0.5 block text-[10px] text-gray-400">{label} ({unit})</label>
                        <input
                          type="number" step="0.1" min="0"
                          value={form[field]}
                          onChange={(e) => updateField(field, e.target.value)}
                          className="h-9 w-full rounded-lg border border-gray-200 px-2 text-sm outline-none focus:border-clarito-green focus:ring-2 focus:ring-clarito-green/20"
                          placeholder="0"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ingredients */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-500">Ingredientes</label>
                  <textarea
                    value={form.ingredientsText}
                    onChange={(e) => updateField("ingredientsText", e.target.value)}
                    rows={3}
                    className="w-full rounded-lg border border-gray-200 p-3 text-sm outline-none focus:border-clarito-green focus:ring-2 focus:ring-clarito-green/20"
                    placeholder="Agua carbonatada, azúcar, colorante caramelo IV..."
                  />
                </div>
              </div>
            </div>

            {/* Live preview */}
            <ScorePreview form={form} />

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={saving || !form.name || !form.barcode}
                className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-clarito-green text-sm font-semibold text-white transition-colors hover:bg-clarito-green/90 disabled:opacity-50 active:scale-[0.98]"
              >
                {saving ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Guardando...
                  </>
                ) : (
                  editingBarcode ? "✅ Actualizar producto" : "✅ Guardar producto"
                )}
              </button>
              <button
                onClick={resetAll}
                className="h-12 rounded-xl bg-gray-100 px-5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200 active:scale-[0.98]"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* ─── Product List ─── */}
        <ProductList
          products={products}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loadingList}
        />
      </main>
    </div>
  );
}
