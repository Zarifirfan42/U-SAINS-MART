import { storage, uid } from "./storage.js";

export function getCurrentUser() {
  try {
    const sessionId = storage.getSession();
    if (!sessionId) return null;
    return storage.getUsers().find((user) => user.id === sessionId) || null;
  } catch (err) {
    console.error("Failed to get current user", err);
    return null;
  }
}

export function login({ email, password }) {
  try {
    if (!email || !password) throw new Error("Email and password required");
    const users = storage.getUsers();
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) throw new Error("Invalid credentials");
    storage.saveSession(found.id);
    return found;
  } catch (err) {
    throw err;
  }
}

export function logout() {
  try {
    storage.clearSession();
  } catch (err) {
    console.error("Failed to logout", err);
  }
}

export function register({ email, username, password, role = "student" }) {
  try {
    if (!email || !username || !password) throw new Error("All fields required");
    const users = storage.getUsers();
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error("Email already registered");
    }
    const newUser = {
      id: uid("u"),
      email,
      username,
      password,
      role,
      campus: "",
      bio: "",
      avatar: "assets/placeholder.svg"
    };
    const updated = [...users, newUser];
    storage.saveUsers(updated);
    storage.saveSession(newUser.id);
    return newUser;
  } catch (err) {
    throw err;
  }
}

export function updateProfile(partial) {
  try {
    const users = storage.getUsers();
    const current = getCurrentUser();
    if (!current) throw new Error("Not authenticated");
    const updated = users.map((u) => (u.id === current.id ? { ...u, ...partial } : u));
    storage.saveUsers(updated);
    return updated.find((u) => u.id === current.id);
  } catch (err) {
    throw err;
  }
}
