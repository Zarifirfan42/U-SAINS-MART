import { getCurrentUser } from "./auth.js";
import { storage } from "./storage.js";
import { getProductById, updateProduct } from "./products.js";

function cartKey(userId) {
  return `usm_cart_${userId}`;
}

function readCart(userId) {
  const raw = localStorage.getItem(cartKey(userId));
  return raw ? JSON.parse(raw) : [];
}

function saveCart(userId, cart) {
  localStorage.setItem(cartKey(userId), JSON.stringify(cart));
}

export function getCart() {
  const user = getCurrentUser();
  if (!user) return [];
  return readCart(user.id);
}

export function addToCart(productId) {
  const user = getCurrentUser();
  if (!user) throw new Error("Please login to add to cart");
  const cart = readCart(user.id);
  const existing = cart.find((item) => item.productId === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ productId, quantity: 1 });
  }
  saveCart(user.id, cart);
}

export function removeFromCart(productId) {
  const user = getCurrentUser();
  if (!user) return;
  const cart = readCart(user.id).filter((item) => item.productId !== productId);
  saveCart(user.id, cart);
}

export function clearCart() {
  const user = getCurrentUser();
  if (!user) return;
  saveCart(user.id, []);
}

export function getCartWithDetails() {
  const cart = getCart();
  return cart
    .map((item) => {
      const product = getProductById(item.productId);
      if (!product) return null;
      return { ...item, product };
    })
    .filter(Boolean);
}

export function checkout(paymentMethod) {
  const user = getCurrentUser();
  if (!user) throw new Error("Please login");
  const detailedItems = getCartWithDetails();
  if (!detailedItems.length) throw new Error("Your cart is empty");
  detailedItems.forEach((entry) => {
    updateProduct(entry.productId, { status: "sold" }, { force: true });
  });
  const message = `Payment via ${paymentMethod} initiated for ${detailedItems.length} item(s).`;
  clearCart();
  return message;
}
