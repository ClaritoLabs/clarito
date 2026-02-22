import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const ADMIN_PASSWORD = "clarito2026";

export async function POST(request: NextRequest) {
  const password = request.headers.get("x-admin-password");
  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY no está configurada" },
      { status: 500 }
    );
  }

  const body = await request.json();
  const { images } = body as { images: string[] };

  if (!Array.isArray(images) || images.length === 0) {
    return NextResponse.json(
      { error: "Se necesita al menos una imagen" },
      { status: 400 }
    );
  }

  const content: Anthropic.Messages.ContentBlockParam[] = [];

  for (let i = 0; i < images.length; i++) {
    content.push({
      type: "text",
      text: `FOTO ${i + 1} DE ${images.length}:`,
    });
    content.push({
      type: "image",
      source: {
        type: "base64",
        media_type: getMediaType(images[i]),
        data: stripBase64Prefix(images[i]),
      },
    });
  }

  content.push({
    type: "text",
    text: `Analizá estas fotos de un producto alimenticio argentino.
Pueden ser fotos del frente, tabla nutricional, lista de ingredientes u otras partes del envase.
Extraé toda la información que puedas de TODAS las fotos combinadas.

Devolvé SOLO un JSON válido (sin markdown, sin backticks) con esta estructura exacta:
{
  "barcode": string o null (si es visible en alguna foto),
  "name": string (nombre del producto),
  "brand": string (marca),
  "category": string (una de: "Bebidas"|"Lácteos"|"Galletitas"|"Snacks"|"Golosinas"|"Panificados"|"Carnes"|"Almacén"|"Congelados"|"Otros"),
  "productType": "solid" o "liquid",
  "nutrition": {
    "calories": number | null (kcal por 100g/ml),
    "fat": number | null (grasas totales en g por 100g/ml),
    "saturatedFat": number | null (grasas saturadas en g por 100g/ml),
    "sugar": number | null (azúcares en g por 100g/ml),
    "sodium": number | null (sodio en mg por 100g/ml),
    "fiber": number | null (fibra en g por 100g/ml),
    "protein": number | null (proteínas en g por 100g/ml)
  },
  "ingredients": string[] (lista de ingredientes separados, tal como aparecen),
  "imageDescription": string (descripción breve del producto para referencia)
}

IMPORTANTE:
- Los valores nutricionales deben ser por 100g o 100ml.
- Si la tabla muestra por porción, convertí a por 100g/100ml.
- El sodio debe estar en mg. Si está en g, multiplicar por 1000.
- Si algo no es legible, poné null.
- Devolvé SOLO el JSON, sin texto adicional.
- Extraé los ingredientes EXACTAMENTE como aparecen en el envase, separados individualmente.
  Necesitamos detectar estos marcadores de ultra-procesamiento:
  jarabe de maíz, alta fructosa, aceite/grasa hidrogenado/a, proteína aislada/hidrolizada,
  almidón modificado, dextrosa, maltodextrina, jarabe de glucosa, glutamato monosódico,
  aspartamo, acesulfame, sucralosa, sacarina, ciclamato, carboximetilcelulosa, polisorbato,
  TBHQ, BHA, BHT, nitrito de sodio, nitrato, colorantes (rojo 40, amarillo 5/6, azul 1,
  caramelo IV), saborizante artificial, aroma artificial.
  Si ves alguno de estos en la lista de ingredientes, asegurate de incluirlo textualmente.`,
  });

  try {
    const client = new Anthropic({ apiKey });
    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      messages: [{ role: "user", content }],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return NextResponse.json(
        { error: "No se recibió respuesta de texto" },
        { status: 500 }
      );
    }

    // Parse JSON from response, handling possible markdown wrapping
    let jsonText = textBlock.text.trim();
    if (jsonText.startsWith("```")) {
      jsonText = jsonText.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    const parsed = JSON.parse(jsonText);
    return NextResponse.json(parsed);
  } catch (err) {
    console.error("[Analyze API] Error:", err);
    const message =
      err instanceof SyntaxError
        ? "La IA devolvió un formato inválido. Intentá de nuevo."
        : err instanceof Error
          ? err.message
          : "Error al analizar las imágenes";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function stripBase64Prefix(dataUrl: string): string {
  const idx = dataUrl.indexOf(",");
  return idx >= 0 ? dataUrl.slice(idx + 1) : dataUrl;
}

function getMediaType(
  dataUrl: string
): "image/jpeg" | "image/png" | "image/gif" | "image/webp" {
  if (dataUrl.startsWith("data:image/png")) return "image/png";
  if (dataUrl.startsWith("data:image/gif")) return "image/gif";
  if (dataUrl.startsWith("data:image/webp")) return "image/webp";
  return "image/jpeg";
}
