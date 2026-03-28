import { projectId, publicAnonKey } from "/utils/supabase/info";

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-33476114`;

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${publicAnonKey}`,
};

export const api = {
  // Items
  async getAllItems() {
    const response = await fetch(`${API_BASE_URL}/items`, { headers });
    if (!response.ok) throw new Error("Failed to fetch items");
    return response.json();
  },

  async getItem(id: string) {
    const response = await fetch(`${API_BASE_URL}/items/${id}`, { headers });
    if (!response.ok) throw new Error("Failed to fetch item");
    return response.json();
  },

  async createItem(item: any) {
    const response = await fetch(`${API_BASE_URL}/items`, {
      method: "POST",
      headers,
      body: JSON.stringify(item),
    });
    if (!response.ok) throw new Error("Failed to create item");
    return response.json();
  },

  async updateItem(id: string, updates: any) {
    const response = await fetch(`${API_BASE_URL}/items/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error("Failed to update item");
    return response.json();
  },

  async deleteItem(id: string) {
    const response = await fetch(`${API_BASE_URL}/items/${id}`, {
      method: "DELETE",
      headers,
    });
    if (!response.ok) throw new Error("Failed to delete item");
    return response.json();
  },

  // Orders
  async createOrder(order: any) {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      headers,
      body: JSON.stringify(order),
    });
    if (!response.ok) throw new Error("Failed to create order");
    return response.json();
  },

  async getAllOrders() {
    const response = await fetch(`${API_BASE_URL}/orders`, { headers });
    if (!response.ok) throw new Error("Failed to fetch orders");
    return response.json();
  },

  async updateOrder(id: string, updates: any) {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error("Failed to update order");
    return response.json();
  },

  // Favorites
  async getFavorites(userId: string) {
    const response = await fetch(`${API_BASE_URL}/favorites/${userId}`, { headers });
    if (!response.ok) throw new Error("Failed to fetch favorites");
    return response.json();
  },

  async addToFavorites(userId: string, itemId: string) {
    const response = await fetch(`${API_BASE_URL}/favorites/${userId}`, {
      method: "POST",
      headers,
      body: JSON.stringify({ itemId }),
    });
    if (!response.ok) throw new Error("Failed to add to favorites");
    return response.json();
  },

  async removeFromFavorites(userId: string, itemId: string) {
    const response = await fetch(`${API_BASE_URL}/favorites/${userId}/${itemId}`, {
      method: "DELETE",
      headers,
    });
    if (!response.ok) throw new Error("Failed to remove from favorites");
    return response.json();
  },

  // Revenue
  async getRevenue(userId: string) {
    const response = await fetch(`${API_BASE_URL}/revenue/${userId}`, { headers });
    if (!response.ok) throw new Error("Failed to fetch revenue");
    return response.json();
  },
};