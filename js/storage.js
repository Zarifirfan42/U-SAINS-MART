import { mockUsers, mockProducts, mockMessages } from "./mock-data.js";

const USERS_KEY = "usm_users";
const PRODUCTS_KEY = "usm_products";
const MESSAGES_KEY = "usm_messages";
const SESSION_KEY = "usm_current_user";

const write = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const read = (key, fallback = []) => {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
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
  clearSession: () => localStorage.removeItem(SESSION_KEY)
};

export function seedMockData() {
  if (!localStorage.getItem(USERS_KEY)) {
    write(USERS_KEY, mockUsers);
  }
  if (!localStorage.getItem(PRODUCTS_KEY)) {
    write(PRODUCTS_KEY, mockProducts);
  }
  if (!localStorage.getItem(MESSAGES_KEY)) {
    write(MESSAGES_KEY, mockMessages);
  }
}

export function uid(prefix) {
  const random =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID().split("-")[0]
      : Math.random().toString(36).slice(2, 8);
  return `${prefix}-${random}`;
}
