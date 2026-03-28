import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Error handler middleware
app.onError((err, c) => {
  console.error("Server error:", err);
  return c.json({ error: "Internal server error", message: err.message }, 500);
});

// Health check endpoint
app.get("/make-server-33476114/health", (c) => {
  return c.json({ status: "ok" });
});

// Get all items
app.get("/make-server-33476114/items", async (c) => {
  try {
    const items = await kv.getByPrefix("item:");
    return c.json({ items });
  } catch (error) {
    console.log("Error fetching items:", error);
    return c.json({ error: "Failed to fetch items" }, 500);
  }
});

// Get single item
app.get("/make-server-33476114/items/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const item = await kv.get(`item:${id}`);
    
    if (!item) {
      return c.json({ error: "Item not found" }, 404);
    }
    
    return c.json({ item });
  } catch (error) {
    console.log("Error fetching item:", error);
    return c.json({ error: "Failed to fetch item" }, 500);
  }
});

// Create new item
app.post("/make-server-33476114/items", async (c) => {
  try {
    const body = await c.req.json();
    const itemId = `item:${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const item = {
      id: itemId.replace("item:", ""),
      ...body,
      createdAt: new Date().toISOString(),
    };
    
    await kv.set(itemId, item);
    console.log("Item created successfully:", itemId);
    
    return c.json({ item }, 201);
  } catch (error) {
    console.log("Error creating item:", error);
    return c.json({ error: "Failed to create item" }, 500);
  }
});

// Update item
app.put("/make-server-33476114/items/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const itemKey = `item:${id}`;
    
    const existingItem = await kv.get(itemKey);
    if (!existingItem) {
      return c.json({ error: "Item not found" }, 404);
    }
    
    const updatedItem = {
      ...existingItem,
      ...body,
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(itemKey, updatedItem);
    console.log("Item updated successfully:", itemKey);
    
    return c.json({ item: updatedItem });
  } catch (error) {
    console.log("Error updating item:", error);
    return c.json({ error: "Failed to update item" }, 500);
  }
});

// Delete item
app.delete("/make-server-33476114/items/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const itemKey = `item:${id}`;
    
    await kv.del(itemKey);
    console.log("Item deleted successfully:", itemKey);
    
    return c.json({ success: true });
  } catch (error) {
    console.log("Error deleting item:", error);
    return c.json({ error: "Failed to delete item" }, 500);
  }
});

// Create order
app.post("/make-server-33476114/orders", async (c) => {
  try {
    const body = await c.req.json();
    const orderId = `order:${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const order = {
      id: orderId.replace("order:", ""),
      ...body,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    
    await kv.set(orderId, order);
    console.log("Order created successfully:", orderId);
    
    return c.json({ order }, 201);
  } catch (error) {
    console.log("Error creating order:", error);
    return c.json({ error: "Failed to create order" }, 500);
  }
});

// Get all orders
app.get("/make-server-33476114/orders", async (c) => {
  try {
    const orders = await kv.getByPrefix("order:");
    return c.json({ orders });
  } catch (error) {
    console.log("Error fetching orders:", error);
    return c.json({ error: "Failed to fetch orders" }, 500);
  }
});

// Update order status
app.put("/make-server-33476114/orders/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const orderKey = `order:${id}`;
    
    const existingOrder = await kv.get(orderKey);
    if (!existingOrder) {
      return c.json({ error: "Order not found" }, 404);
    }
    
    const updatedOrder = {
      ...existingOrder,
      ...body,
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(orderKey, updatedOrder);
    console.log("Order updated successfully:", orderKey);
    
    return c.json({ order: updatedOrder });
  } catch (error) {
    console.log("Error updating order:", error);
    return c.json({ error: "Failed to update order" }, 500);
  }
});

// Get user's favorites
app.get("/make-server-33476114/favorites/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const favorites = await kv.get(`favorites:${userId}`);
    
    return c.json({ favorites: favorites || [] });
  } catch (error) {
    console.log("Error fetching favorites:", error);
    return c.json({ error: "Failed to fetch favorites" }, 500);
  }
});

// Add to favorites
app.post("/make-server-33476114/favorites/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const body = await c.req.json();
    const itemId = body.itemId;
    
    const favKey = `favorites:${userId}`;
    const favorites = (await kv.get(favKey)) || [];
    
    if (!favorites.includes(itemId)) {
      favorites.push(itemId);
      await kv.set(favKey, favorites);
      console.log("Added to favorites:", itemId);
    }
    
    return c.json({ favorites });
  } catch (error) {
    console.log("Error adding to favorites:", error);
    return c.json({ error: "Failed to add to favorites" }, 500);
  }
});

// Remove from favorites
app.delete("/make-server-33476114/favorites/:userId/:itemId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const itemId = c.req.param("itemId");
    
    const favKey = `favorites:${userId}`;
    const favorites = (await kv.get(favKey)) || [];
    
    const updatedFavorites = favorites.filter((id: string) => id !== itemId);
    await kv.set(favKey, updatedFavorites);
    console.log("Removed from favorites:", itemId);
    
    return c.json({ favorites: updatedFavorites });
  } catch (error) {
    console.log("Error removing from favorites:", error);
    return c.json({ error: "Failed to remove from favorites" }, 500);
  }
});

// Get user revenue
app.get("/make-server-33476114/revenue/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const orders = await kv.getByPrefix("order:");
    
    // Calculate revenue from completed orders
    let totalRevenue = 0;
    orders.forEach((order: any) => {
      // Check if this order is for items owned by this user
      // In a real app, you'd fetch the item and check the owner
      if (order.status === "delivered" || order.status === "completed") {
        totalRevenue += order.totalAmount || 0;
      }
    });
    
    return c.json({ revenue: totalRevenue });
  } catch (error) {
    console.log("Error calculating revenue:", error);
    return c.json({ error: "Failed to calculate revenue" }, 500);
  }
});

Deno.serve(app.fetch);