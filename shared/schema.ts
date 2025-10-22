import { z } from "zod";

// Category Schema
export const categorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  display_order: z.number().int().default(0),
  active: z.boolean().default(true),
  created_at: z.string().optional(),
});

export const insertCategorySchema = categorySchema.omit({ 
  id: true, 
  created_at: true 
});

export type Category = z.infer<typeof categorySchema>;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

// Product Schema
export const productSchema = z.object({
  id: z.string().uuid(),
  category_id: z.string().uuid(),
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  price: z.number().positive("Preço deve ser positivo"),
  image_url: z.string().url("URL inválida").optional(),
  is_promotion: z.boolean().default(false),
  promotion_price: z.number().positive().optional(),
  promotion_start: z.string().optional(),
  promotion_end: z.string().optional(),
  active: z.boolean().default(true),
  created_at: z.string().optional(),
});

export const insertProductSchema = productSchema.omit({ 
  id: true, 
  created_at: true 
});

export type Product = z.infer<typeof productSchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;

// Waiter Schema
export const waiterSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Nome é obrigatório"),
  photo_url: z.string().url("URL inválida").optional(),
  phone: z.string().optional(),
  active: z.boolean().default(true),
  created_at: z.string().optional(),
});

export const insertWaiterSchema = waiterSchema.omit({ 
  id: true, 
  created_at: true 
});

export type Waiter = z.infer<typeof waiterSchema>;
export type InsertWaiter = z.infer<typeof insertWaiterSchema>;

// Order Item Schema
export const orderItemSchema = z.object({
  product_id: z.string().uuid(),
  product_name: z.string(),
  quantity: z.number().int().positive(),
  unit_price: z.number().positive(),
  total_price: z.number().positive(),
});

export type OrderItem = z.infer<typeof orderItemSchema>;

// Order Schema
export const orderSchema = z.object({
  id: z.string().uuid(),
  customer_name: z.string().min(1, "Nome do cliente é obrigatório"),
  table_number: z.string().min(1, "Número da mesa é obrigatório"),
  waiter_id: z.string().uuid(),
  waiter_name: z.string(),
  items: z.array(orderItemSchema),
  payment_method: z.enum(["debito", "credito", "pix", "dinheiro"]),
  observation: z.string().optional(),
  total_amount: z.number().positive(),
  status: z.enum(["pending", "confirmed", "completed", "cancelled"]).default("pending"),
  created_at: z.string().optional(),
});

export const insertOrderSchema = orderSchema.omit({ 
  id: true, 
  created_at: true,
  status: true,
});

export type Order = z.infer<typeof orderSchema>;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

// Cart Item (frontend only)
export interface CartItem {
  product: Product;
  quantity: number;
}

// Keep existing user schema for admin auth
export const users = {
  id: z.string().uuid(),
  username: z.string(),
  password: z.string(),
};

export const insertUserSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = {
  id: string;
  username: string;
  password: string;
};
