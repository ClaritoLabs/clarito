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
  const { images } = body as {
    images: { front?: string; nutrition?: string; ingredients?: string };
  };

  if (!images?.front && !images?.nutrition && !images?.ingredients) {
    return NextResponse.json(
      { error: "Se necesita al menos una imagen" },
      { status: 400 }
    );
  }

  const content: Anthropic.Messages.ContentBlockParam[] = [];

  if (images.front) {
    content.push({
      type: "text",
      text: "FOTO DEL FRENTE DEL PRODUCTO:",
    });
    content.push({
      type: "image",
      source: {
        type: "base64",
        media_type: getMediaType(images.front),
        data: stripBase64Prefix(images.front),
      },
    });
  }

  if (images.nutrition) {
    content.push({
      type: "text",
      text: "FOTO DE LA TABLA NUTRICIONAL:",
    });
    content.push({
      type: "image",
      source: {
        type: "base64",
        media_type: getMediaType(images.nutrition),
        data: stripBase64Prefix(images.nutrition),
      },
    });
  }

  if (images.ingredients) {
    content.push({
      type: "text",
      text: "FOTO DE LA LISTA DE INGREDIENTES:",
    });
    content.push({
      type: "image",
      source: {
        type: "base64",
        media_type: getMediaType(images.ingredients),
        data: stripBase64Prefix(images.ingredients),
      },
    });
  }

  content.push({
    type: "text",
    text: `Analizá estas imágenes de un producto alimenticio argentino.
Extraé y devolvé SOLO un JSON válido (sin markdown, sin backticks) con esta estructura exacta:
{
  "barcode": string o null (si es visible en alguna foto),
  "name": string (nombre del producto),
  "brand": string (marca),
  "category": string (una de: "Bebidas"|"Lácteos"|"Galletitas"|"Snacks"|"Golosinas"|"Panificados"|"Carnes"|"Almacén"|"Congelados"|"Otros"),
  "productType": "solid" o "liquid",
  "nutrition": {
    "calories": number (kcal por 100g/ml),
    "fat": number (grasas totales en g por 100g/ml),
    "saturatedFat": number (grasas saturadas en g por 100g/ml),
    "sugar": number (azúcares en g por 100g/ml),
    "sodium": number (sodio en mg por 100g/ml),
    "fiber": number (fibra en g por 100g/ml),
    "protein": number (proteínas en g por 100g/ml)
  },
  "ingredients": string[] (lista de ingredientes separados, tal como aparecen),
  "imageDescription": string (descripción breve del producto para referencia)
}

IMPORTANTE:
- Si la tabla nutricional muestra valores por porción, convertí a por 100g/ml.
- Si el sodio está en g, convertilo a mg (multiplicar por 1000).
- Si algún dato no es legible, poné null.
- Interpretá los datos de la tabla nutricional argentina.
- Devolvé SOLO el JSON, sin texto adicional.`,
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
