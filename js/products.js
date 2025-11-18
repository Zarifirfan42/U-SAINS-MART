import { storage, uid } from "./storage.js";
import { getCurrentUser } from "./auth.js";

export function getProducts() {
  return storage.getProducts();
}

export function getProductById(id) {
  return getProducts().find((p) => p.id === id) || null;
}

export function saveProduct(input) {
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
}

export function updateProduct(id, updates) {
  const products = getProducts();
  const updated = products.map((p) => (p.id === id ? { ...p, ...updates } : p));
  storage.saveProducts(updated);
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
  const products = getProducts();
  return ["All", ...new Set(products.map((p) => p.category))];
}
