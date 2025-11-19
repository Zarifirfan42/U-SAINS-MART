import { storage, uid } from "./storage.js";
import { getCurrentUser } from "./auth.js";

export function getProducts() {
  try {
    return storage.getProducts();
  } catch (err) {
    console.error("Failed to get products", err);
    return [];
  }
}

export function getProductById(id) {
  try {
    return getProducts().find((p) => p.id === id) || null;
  } catch (err) {
    console.error("Failed to get product", err);
    return null;
  }
}

export function saveProduct(input) {
  try {
    if (!input.name || !input.price || !input.description || !input.category) {
      throw new Error("All fields required");
    }
    const user = getCurrentUser();
    if (!user) throw new Error("Please login first");
    const products = getProducts();
    const newProduct = {
      id: uid("p"),
      ownerId: user.id,
      name: input.name,
      price: Number(input.price) || 0,
      description: input.description,
      category: input.category,
      image: input.image || "assets/placeholder.svg",
      createdAt: Date.now(),
      status: "active",
      reports: []
    };
    storage.saveProducts([newProduct, ...products]);
    return newProduct;
  } catch (err) {
    throw err;
  }
}

export function updateProduct(id, updates) {
  try {
    const products = getProducts();
    const updated = products.map((p) => (p.id === id ? { ...p, ...updates } : p));
    storage.saveProducts(updated);
  } catch (err) {
    throw err;
  }
}

export function deleteProduct(id) {
  try {
    const products = getProducts().filter((p) => p.id !== id);
    storage.saveProducts(products);
  } catch (err) {
    throw err;
  }
}

export function getMyProducts() {
  try {
    const user = getCurrentUser();
    if (!user) return [];
    return getProducts().filter((p) => p.ownerId === user.id);
  } catch (err) {
    console.error("Failed to get my products", err);
    return [];
  }
}

export function reportProduct(id, reason) {
  try {
    if (!reason) throw new Error("Report reason required");
    const products = getProducts().map((p) => {
      if (p.id !== id) return p;
      const reports = [...(p.reports || []), { reason, date: Date.now() }];
      return { ...p, reports, status: reports.length >= 3 ? "reported" : p.status };
    });
    storage.saveProducts(products);
  } catch (err) {
    throw err;
  }
}

export function getCategories() {
  try {
    const products = getProducts();
    return ["All", ...new Set(products.map((p) => p.category))];
  } catch (err) {
    console.error("Failed to get categories", err);
    return ["All"];
  }
}
