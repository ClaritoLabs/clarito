import { NextRequest, NextResponse } from "next/server";
import {
  OFF_PRODUCT_URL,
  OFF_FIELDS,
  OFF_USER_AGENT,
  mapOFFToProduct,
  type OFFProductResponse,
} from "@/lib/openfoodfacts";

export async function GET(request: NextRequest) {
  const barcode = request.nextUrl.searchParams.get("barcode");
  if (!barcode) {
    return NextResponse.json(null, { status: 400 });
  }

  const url = `${OFF_PRODUCT_URL}/${barcode}?fields=${OFF_FIELDS}`;
  console.log("[OFF Product] URL:", url);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": OFF_USER_AGENT },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      console.log("[OFF Product] HTTP error:", res.status, res.statusText);
      if (res.status === 404) return NextResponse.json(null, { status: 404 });
      return NextResponse.json(null, { status: 502 });
    }

    const data: OFFProductResponse = await res.json();
    console.log("[OFF Product] Status:", data.status_verbose);

    if (data.status === 0 || !data.product) {
      return NextResponse.json(null, { status: 404 });
    }

    const product = mapOFFToProduct(data.product);
    return NextResponse.json(product);
  } catch (err) {
    clearTimeout(timeout);
    const isTimeout = err instanceof DOMException && err.name === "AbortError";
    console.log("[OFF Product] Error:", isTimeout ? "TIMEOUT (5s)" : err);
    return NextResponse.json(null, { status: isTimeout ? 504 : 502 });
  }
}
