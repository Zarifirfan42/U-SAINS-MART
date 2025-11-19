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
  getUsers: () => {
    try {
      return read(USERS_KEY, []);
    } catch (err) {
      console.error("Failed to read users", err);
      return [];
    }
  },
  saveUsers: (users) => {
    try {
      write(USERS_KEY, users);
    } catch (err) {
      console.error("Failed to save users", err);
    }
  },
  getProducts: () => {
    try {
      return read(PRODUCTS_KEY, []);
    } catch (err) {
      console.error("Failed to read products", err);
      return [];
    }
  },
  saveProducts: (products) => {
    try {
      write(PRODUCTS_KEY, products);
    } catch (err) {
      console.error("Failed to save products", err);
    }
  },
  getMessages: () => {
    try {
      return read(MESSAGES_KEY, []);
    } catch (err) {
      console.error("Failed to read messages", err);
      return [];
    }
  },
  saveMessages: (messages) => {
    try {
      write(MESSAGES_KEY, messages);
    } catch (err) {
      console.error("Failed to save messages", err);
    }
  },
  getSession: () => {
    try {
      return read(SESSION_KEY, null);
    } catch (err) {
      console.error("Failed to read session", err);
      return null;
    }
  },
  saveSession: (userId) => {
    try {
      write(SESSION_KEY, userId);
    } catch (err) {
      console.error("Failed to save session", err);
    }
  },
  clearSession: () => {
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch (err) {
      console.error("Failed to clear session", err);
    }
  }
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
