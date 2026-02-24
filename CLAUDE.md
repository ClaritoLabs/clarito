# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev       # Start dev server at localhost:3000
npm run build     # Production build
npm run start     # Start production server
npm run lint      # ESLint (no flags needed)
```

No test framework is configured.

## Environment Variables

Required in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase connection (app falls back to hardcoded products in `src/data/products.ts` if missing)
- `ANTHROPIC_API_KEY` — Claude API for product image analysis

## Architecture

**Clarito** is a Next.js 16 App Router application (TypeScript, Tailwind CSS 4) that scores Argentine food products on a 0-100 scale based on nutritional quality. It implements Argentina's Ley 27.642 (Etiquetado Frontal) for octagon warning detection.

### Core Scoring Pipeline (`src/lib/scoring.ts`)

This is the heart of the app. When a product is created/updated, the API route computes everything server-side:

1. `parseIngredients()` — parses comma-separated ingredient text, handling nested parentheses
2. `estimateNovaGroup()` — classifies processing level (1-4) by matching ingredient names against marker lists (`ULTRA_PROCESSED_MARKERS`, `PROCESSED_MARKERS`)
3. `detectOctogonos()` — checks nutrition values against Ley 27.642 thresholds (different for solid vs liquid)
4. `estimateNutriscoreGrade()` — estimates Nutri-Score (a-e) from nutrition data
5. `calculateScore()` — composite score: Nutri-Score (40%) + NOVA group (30%) + octógonos (30%)
6. `scoreToRating()` — maps score to rating: Excelente (≥76), Bueno (≥51), Mediocre (≥26), Malo (<26)

All scoring is computed in the POST/PUT API routes (`src/app/api/products/route.ts`), not on the client.

### Data Layer

- **Supabase** (PostgreSQL) is the primary database, accessed via `@supabase/supabase-js` (not Prisma at runtime)
- Prisma schema in `prisma/schema.prisma` defines the data model but the app queries Supabase directly
- Database uses **snake_case** columns; the API maps to **camelCase** TypeScript types via `mapFromSupabase()`
- If Supabase is not configured, the app gracefully falls back to `src/data/products.ts`

### Key Routes

| Route | Purpose |
|-------|---------|
| `/` | Landing page (server component) |
| `/explorar` | Product search with debounce — client component |
| `/producto/[barcode]` | Product detail page (server component) |
| `/admin` | Admin panel: add products via photo analysis or manual form |
| `/api/products` | GET (search), POST (create with scoring pipeline) |
| `/api/products/[barcode]` | GET, PUT, DELETE single product |
| `/api/analyze` | POST: sends product photos to Claude Sonnet, returns structured JSON |

### Admin Flow

Admin routes are protected by `x-admin-password` header (hardcoded as `clarito2026`). The `/admin` page lets users upload 1-5 product photos → `/api/analyze` sends them to Claude for extraction → admin reviews/edits → POST to `/api/products` triggers the scoring pipeline.

## Conventions

- **Language**: All UI text, comments, and variable-adjacent strings are in Spanish
- **Path alias**: `@/*` maps to `src/*`
- Product categories: Bebidas, Lácteos, Galletitas, Snacks, Golosinas, Panificados, Carnes, Almacén, Congelados, Otros
- Nutrition values are always per 100g (solid) or 100ml (liquid); sodium in mg
- The app is a PWA (`public/manifest.json`, `InstallBanner` component)
- Theme colors defined as CSS variables in `globals.css`: `--color-clarito-green`, `--color-clarito-orange`, `--color-clarito-red`
