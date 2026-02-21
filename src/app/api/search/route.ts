import { NextRequest, NextResponse } from "next/server";
import {
  OFF_BASE_URL,
  OFF_FIELDS,
  OFF_USER_AGENT,
  mapOFFToProduct,
  type OFFSearchResponse,
} from "@/lib/openfoodfacts";
import type { Product } from "@/lib/types";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q");
  if (!q || q.trim().length < 2) {
    return NextResponse.json([]);
  }

  const url = `${OFF_BASE_URL}?search_terms=${encodeURIComponent(q)}&search_simple=1&action=process&json=1&page_size=10&fields=${OFF_FIELDS}&countries_tags_contains=en:argentina`;

  console.log("[OFF Search] URL:", url);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": OFF_USER_AGENT },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      console.log("[OFF Search] HTTP error:", res.status, res.statusText);
      return NextResponse.json([], { status: 502 });
    }

    const data: OFFSearchResponse = await res.json();
    console.log("[OFF Search] Results:", data.count, "products found,", data.products?.length, "returned");

    const products: Product[] = (data.products || [])
      .map(mapOFFToProduct)
      .filter((p): p is Product => p !== null && p.barcode !== "");

    return NextResponse.json(products);
  } catch (err) {
    clearTimeout(timeout);
    const isTimeout = err instanceof DOMException && err.name === "AbortError";
    console.log("[OFF Search] Error:", isTimeout ? "TIMEOUT (5s)" : err);
    return NextResponse.json([], { status: isTimeout ? 504 : 502 });
  }
}
