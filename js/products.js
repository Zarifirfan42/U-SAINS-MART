import { storage, uid } from "./storage.js";
import { getCurrentUser } from "./auth.js";

export function getProducts() {
  return storage.getProducts();
}

export function getAvailableProducts() {
  return getProducts().filter((p) => p.status !== "sold");
}

export function getProductById(id) {
  return getProducts().find((p) => p.id === id) || null;
}

export function saveProduct(input) {
  const user = getCurrentUser();
  if (!user) throw new Error("Please login first");
  const products = getProducts();
  const price = Math.max(0, Number(input.price) || 0);
  const newProduct = {
    id: uid("p"),
    ownerId: user.id,
    name: input.name,
    price,
    description: input.description,
    category: input.category,
    image: input.image || "assets/placeholder.svg",
    createdAt: Date.now(),
    status: "active",
    reports: []
  };
  storage.saveProducts([newProduct, ...products]);
  return newProduct;
}

export function updateProduct(id, updates, { force = false } = {}) {
  const products = getProducts();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return;
  const product = products[index];
  if (!force) {
    const user = getCurrentUser();
    if (!user) throw new Error("Please login first");
    const isOwner = product.ownerId === user.id;
    const isAdmin = user.role === "admin";
    if (!isOwner && !isAdmin) {
      throw new Error("You do not have permission to update this product");
    }
  }
  const next = { ...product, ...updates };
  if (typeof next.price !== "undefined") {
    next.price = Math.max(0, Number(next.price) || 0);
  }
  products[index] = next;
  storage.saveProducts(products);
}

export function deleteProduct(id) {
  const products = getProducts().filter((p) => p.id !== id);
  storage.saveProducts(products);
}

export function getMyProducts() {
  const user = getCurrentUser();
  if (!user) return [];
  return getProducts().filter((p) => p.ownerId === user.id);
}

export function reportProduct(id, reason) {
  const products = getProducts().map((p) => {
    if (p.id !== id) return p;
    const reports = [...(p.reports || []), { reason, date: Date.now() }];
    return { ...p, reports, status: reports.length >= 3 ? "reported" : p.status };
  });
  storage.saveProducts(products);
}

export function getCategories() {
  const products = getAvailableProducts();
  return ["All", ...new Set(products.map((p) => p.category))];
}
