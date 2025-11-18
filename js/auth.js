import { storage, uid } from "./storage.js";

export function getCurrentUser() {
  const sessionId = storage.getSession();
  if (!sessionId) return null;
  return storage.getUsers().find((user) => user.id === sessionId) || null;
}

export function login({ email, password }) {
  const users = storage.getUsers();
  const found = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  if (!found) throw new Error("Invalid credentials");
  storage.saveSession(found.id);
  return found;
}

export function logout() {
  storage.clearSession();
}

export function register({ email, username, password, role = "student" }) {
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
}

export function updateProfile(partial) {
  const users = storage.getUsers();
  const current = getCurrentUser();
  if (!current) throw new Error("Not authenticated");
  const updated = users.map((u) => (u.id === current.id ? { ...u, ...partial } : u));
  storage.saveUsers(updated);
  return updated.find((u) => u.id === current.id);
}
