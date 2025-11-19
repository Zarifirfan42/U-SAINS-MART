import { getCurrentUser } from "./auth.js";
import { storage } from "./storage.js";
import { getProductById } from "./products.js";

function cartKey(userId) {
  return `usm_cart_${userId}`;
}

function readCart(userId) {
  try {
    const raw = localStorage.getItem(cartKey(userId));
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("Failed to read cart", err);
    return [];
  }
}

function saveCart(userId, cart) {
  try {
    localStorage.setItem(cartKey(userId), JSON.stringify(cart));
  } catch (err) {
    console.error("Failed to save cart", err);
  }
}

export function getCart() {
  try {
    const user = getCurrentUser();
    if (!user) return [];
    return readCart(user.id);
  } catch (err) {
    console.error("Failed to get cart", err);
    return [];
  }
}

export function addToCart(productId) {
  try {
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
  } catch (err) {
    throw err;
  }
}

export function removeFromCart(productId) {
  try {
    const user = getCurrentUser();
    if (!user) return;
    const cart = readCart(user.id).filter((item) => item.productId !== productId);
    saveCart(user.id, cart);
  } catch (err) {
    console.error("Failed to remove from cart", err);
  }
}

export function clearCart() {
  try {
    const user = getCurrentUser();
    if (!user) return;
    saveCart(user.id, []);
  } catch (err) {
    console.error("Failed to clear cart", err);
  }
}

export function getCartWithDetails() {
  try {
    const cart = getCart();
    return cart
      .map((item) => {
        const product = getProductById(item.productId);
        if (!product) return null;
        return { ...item, product };
      })
      .filter(Boolean);
  } catch (err) {
    console.error("Failed to get cart with details", err);
    return [];
  }
}

export function checkout(paymentMethod) {
  try {
    const user = getCurrentUser();
    if (!user) throw new Error("Please login");
    const message = `Payment via ${paymentMethod} initiated for ${getCartWithDetails().length} item(s).`;
    clearCart();
    return message;
  } catch (err) {
    throw err;
  }
}
