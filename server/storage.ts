import { createClient } from '@supabase/supabase-js';
import type { Category, InsertCategory, Product, InsertProduct, Waiter, InsertWaiter, Order, InsertOrder } from "@shared/schema";

// Supabase configuration from environment variables
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    'Supabase credentials not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.'
  );
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface IStorage {
  // Categories
  getAllCategories(): Promise<Category[]>;
  getCategory(id: string): Promise<Category | null>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, category: InsertCategory): Promise<Category>;
  deleteCategory(id: string): Promise<void>;

  // Products
  getAllProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | null>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: InsertProduct): Promise<Product>;
  deleteProduct(id: string): Promise<void>;

  // Waiters
  getAllWaiters(): Promise<Waiter[]>;
  getWaiter(id: string): Promise<Waiter | null>;
  createWaiter(waiter: InsertWaiter): Promise<Waiter>;
  updateWaiter(id: string, waiter: InsertWaiter): Promise<Waiter>;
  deleteWaiter(id: string): Promise<void>;

  // Orders
  getAllOrders(): Promise<Order[]>;
  getOrder(id: string): Promise<Order | null>;
  createOrder(order: InsertOrder): Promise<Order>;
}

export class SupabaseStorage implements IStorage {
  // Categories
  async getAllCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (error) throw new Error(error.message);
    return data as Category[];
  }

  async getCategory(id: string): Promise<Category | null> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return null;
    return data as Category;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .insert(category)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data as Category;
  }

  async updateCategory(id: string, category: InsertCategory): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .update(category)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data as Category;
  }

  async deleteCategory(id: string): Promise<void> {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (error) throw new Error(error.message);
  }

  // Products
  async getAllProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*');
    
    if (error) throw new Error(error.message);
    return data as Product[];
  }

  async getProduct(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return null;
    return data as Product;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data as Product;
  }

  async updateProduct(id: string, product: InsertProduct): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .update(product)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data as Product;
  }

  async deleteProduct(id: string): Promise<void> {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) throw new Error(error.message);
  }

  // Waiters
  async getAllWaiters(): Promise<Waiter[]> {
    const { data, error } = await supabase
      .from('waiters')
      .select('*');
    
    if (error) throw new Error(error.message);
    return data as Waiter[];
  }

  async getWaiter(id: string): Promise<Waiter | null> {
    const { data, error } = await supabase
      .from('waiters')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return null;
    return data as Waiter;
  }

  async createWaiter(waiter: InsertWaiter): Promise<Waiter> {
    const { data, error } = await supabase
      .from('waiters')
      .insert(waiter)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data as Waiter;
  }

  async updateWaiter(id: string, waiter: InsertWaiter): Promise<Waiter> {
    const { data, error } = await supabase
      .from('waiters')
      .update(waiter)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data as Waiter;
  }

  async deleteWaiter(id: string): Promise<void> {
    const { error } = await supabase
      .from('waiters')
      .delete()
      .eq('id', id);
    
    if (error) throw new Error(error.message);
  }

  // Orders
  async getAllOrders(): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw new Error(error.message);
    return data as Order[];
  }

  async getOrder(id: string): Promise<Order | null> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return null;
    return data as Order;
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const { data, error } = await supabase
      .from('orders')
      .insert(order)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data as Order;
  }
}

export const storage = new SupabaseStorage();
