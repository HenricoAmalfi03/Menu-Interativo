-- Cardápio Digital - Supabase Database Schema
-- Execute this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
display_order INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL CHECK (price > 0),
  image_url TEXT,
  is_promotion BOOLEAN NOT NULL DEFAULT false,
  promotion_price NUMERIC(10, 2) CHECK (promotion_price IS NULL OR promotion_price > 0),
  promotion_start TIMESTAMPTZ,
  promotion_end TIMESTAMPTZ,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Waiters Table
CREATE TABLE IF NOT EXISTS waiters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  photo_url TEXT,
  phone TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT NOT NULL,
  table_number TEXT NOT NULL,
  waiter_id UUID NOT NULL REFERENCES waiters(id),
  waiter_name TEXT NOT NULL,
  items JSONB NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('debito', 'credito', 'pix', 'dinheiro')),
  observation TEXT,
  total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount > 0),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(active);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(active);
CREATE INDEX IF NOT EXISTS idx_waiters_active ON waiters(active);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Sample data (optional)
-- Uncomment these lines to insert sample data

-- INSERT INTO categories (name, description, display_order, active) VALUES
-- ('Entradas', 'Pratos para começar', 1, true),
-- ('Pratos Principais', 'Principais refeições', 2, true),
-- ('Bebidas', 'Bebidas variadas', 3, true),
-- ('Sobremesas', 'Doces e sobremesas', 4, true);

-- INSERT INTO waiters (name, phone, active) VALUES
-- ('João Silva', '5511999999999', true),
-- ('Maria Santos', '5511988888888', true);

-- Note: After creating the tables, make sure to:
-- 1. Go to Authentication > Policies in Supabase
-- 2. Enable Row Level Security (RLS) for each table if needed
-- 3. Create policies to allow public read access for categories, products, and waiters
-- 4. Create policies to allow authenticated users to manage data
-- 5. For development, you can disable RLS temporarily

-- Example: Disable RLS for development (NOT RECOMMENDED FOR PRODUCTION)
-- ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE products DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE waiters DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
