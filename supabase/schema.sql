-- Clarito: Supabase schema for products table
-- Run this in the Supabase SQL Editor to set up the database

CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  barcode TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  category TEXT NOT NULL,
  emoji TEXT NOT NULL DEFAULT '📦',
  score INT NOT NULL DEFAULT 0,
  rating TEXT NOT NULL DEFAULT 'Malo',
  nova_group INT NOT NULL DEFAULT 4,
  is_liquid BOOLEAN NOT NULL DEFAULT false,
  excess_sugar BOOLEAN NOT NULL DEFAULT false,
  excess_sodium BOOLEAN NOT NULL DEFAULT false,
  excess_fat BOOLEAN NOT NULL DEFAULT false,
  excess_saturated_fat BOOLEAN NOT NULL DEFAULT false,
  excess_calories BOOLEAN NOT NULL DEFAULT false,
  summary TEXT NOT NULL DEFAULT '',
  nutrition JSONB NOT NULL DEFAULT '{}'::jsonb,
  ingredients JSONB NOT NULL DEFAULT '[]'::jsonb,
  image_url TEXT,
  alternatives JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for search
CREATE INDEX IF NOT EXISTS idx_products_name ON products USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products USING gin (brand gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_products_category ON products (category);

-- Enable trigram extension for fuzzy search (run once)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- RLS: allow public read, require auth for write
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read products
CREATE POLICY "Products are publicly readable"
  ON products FOR SELECT
  USING (true);

-- Allow authenticated users (or anon with service role) to insert/update/delete
-- For the simple admin password approach, we use the anon key and handle auth in the API
CREATE POLICY "Allow all operations for anon"
  ON products FOR ALL
  USING (true)
  WITH CHECK (true);
