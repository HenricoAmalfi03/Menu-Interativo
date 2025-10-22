import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCategorySchema, insertProductSchema, insertWaiterSchema, insertOrderSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Categories Routes
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  app.get("/api/categories/:id", async (req, res) => {
    try {
      const category = await storage.getCategory(req.params.id);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      console.error("Error fetching category:", error);
      res.status(500).json({ error: "Failed to fetch category" });
    }
  });

  app.post("/api/categories", async (req, res) => {
    try {
      const validated = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(validated);
      res.status(201).json(category);
    } catch (error: any) {
      console.error("Error creating category:", error);
      res.status(400).json({ error: error.message || "Failed to create category" });
    }
  });

  app.put("/api/categories/:id", async (req, res) => {
    try {
      const validated = insertCategorySchema.parse(req.body);
      const category = await storage.updateCategory(req.params.id, validated);
      res.json(category);
    } catch (error: any) {
      console.error("Error updating category:", error);
      res.status(400).json({ error: error.message || "Failed to update category" });
    }
  });

  app.delete("/api/categories/:id", async (req, res) => {
    try {
      await storage.deleteCategory(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).json({ error: "Failed to delete category" });
    }
  });

  // Products Routes
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const validated = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validated);
      res.status(201).json(product);
    } catch (error: any) {
      console.error("Error creating product:", error);
      res.status(400).json({ error: error.message || "Failed to create product" });
    }
  });

  app.put("/api/products/:id", async (req, res) => {
    try {
      const validated = insertProductSchema.parse(req.body);
      const product = await storage.updateProduct(req.params.id, validated);
      res.json(product);
    } catch (error: any) {
      console.error("Error updating product:", error);
      res.status(400).json({ error: error.message || "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      await storage.deleteProduct(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  // Waiters Routes
  app.get("/api/waiters", async (req, res) => {
    try {
      const waiters = await storage.getAllWaiters();
      res.json(waiters);
    } catch (error) {
      console.error("Error fetching waiters:", error);
      res.status(500).json({ error: "Failed to fetch waiters" });
    }
  });

  app.get("/api/waiters/:id", async (req, res) => {
    try {
      const waiter = await storage.getWaiter(req.params.id);
      if (!waiter) {
        return res.status(404).json({ error: "Waiter not found" });
      }
      res.json(waiter);
    } catch (error) {
      console.error("Error fetching waiter:", error);
      res.status(500).json({ error: "Failed to fetch waiter" });
    }
  });

  app.post("/api/waiters", async (req, res) => {
    try {
      const validated = insertWaiterSchema.parse(req.body);
      const waiter = await storage.createWaiter(validated);
      res.status(201).json(waiter);
    } catch (error: any) {
      console.error("Error creating waiter:", error);
      res.status(400).json({ error: error.message || "Failed to create waiter" });
    }
  });

  app.put("/api/waiters/:id", async (req, res) => {
    try {
      const validated = insertWaiterSchema.parse(req.body);
      const waiter = await storage.updateWaiter(req.params.id, validated);
      res.json(waiter);
    } catch (error: any) {
      console.error("Error updating waiter:", error);
      res.status(400).json({ error: error.message || "Failed to update waiter" });
    }
  });

  app.delete("/api/waiters/:id", async (req, res) => {
    try {
      await storage.deleteWaiter(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting waiter:", error);
      res.status(500).json({ error: "Failed to delete waiter" });
    }
  });

  // Orders Routes
  app.get("/api/orders", async (req, res) => {
    try {
      const orders = await storage.getAllOrders();
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const order = await storage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ error: "Failed to fetch order" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const validated = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(validated);
      res.status(201).json(order);
    } catch (error: any) {
      console.error("Error creating order:", error);
      res.status(400).json({ error: error.message || "Failed to create order" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
