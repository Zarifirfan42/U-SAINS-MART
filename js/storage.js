// Enhanced storage.js with proper mock data seeding
import { mockUsers, mockProducts, mockMessages } from "./mock-data.js";

const USERS_KEY = "usm_users";
const PRODUCTS_KEY = "usm_products";
const MESSAGES_KEY = "usm_messages";
const SESSION_KEY = "usm_current_user";

const write = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error('Storage write error:', e);
    return false;
  }
};

const read = (key, fallback = []) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to parse", key, err);
    return fallback;
  }
};

export const storage = {
  getUsers: () => read(USERS_KEY, []),
  saveUsers: (users) => write(USERS_KEY, users),
  getProducts: () => read(PRODUCTS_KEY, []),
  saveProducts: (products) => write(PRODUCTS_KEY, products),
  getMessages: () => read(MESSAGES_KEY, []),
  saveMessages: (messages) => write(MESSAGES_KEY, messages),
  getSession: () => read(SESSION_KEY, null),
  saveSession: (userId) => write(SESSION_KEY, userId),
  clearSession: () => localStorage.removeItem(SESSION_KEY),
  
  // Add clear all method for testing
  clearAll: () => {
    localStorage.removeItem(USERS_KEY);
    localStorage.removeItem(PRODUCTS_KEY);
    localStorage.removeItem(MESSAGES_KEY);
    localStorage.removeItem(SESSION_KEY);
    console.log('🗑️ All data cleared');
  }
};

export function seedMockData() {
  // Only seed if data doesn't exist
  if (!localStorage.getItem(USERS_KEY)) {
    write(USERS_KEY, mockUsers);
    console.log('✅ Seeded users:', mockUsers.length);
  }
  if (!localStorage.getItem(PRODUCTS_KEY)) {
    write(PRODUCTS_KEY, mockProducts);
    console.log('✅ Seeded products:', mockProducts.length);
  }
  if (!localStorage.getItem(MESSAGES_KEY)) {
    write(MESSAGES_KEY, mockMessages);
    console.log('✅ Seeded messages:', mockMessages.length);
  }
}

export function uid(prefix = 'id') {
  const random =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID().split("-")[0]
      : Math.random().toString(36).slice(2, 10);
  return `${prefix}-${random}`;
}
