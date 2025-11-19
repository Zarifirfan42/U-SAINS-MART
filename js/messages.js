import { storage, uid } from "./storage.js";
import { getCurrentUser } from "./auth.js";

export function getInbox() {
  try {
    const user = getCurrentUser();
    if (!user) return [];
    return storage
      .getMessages()
      .filter((msg) => msg.to === user.id || msg.from === user.id)
      .sort((a, b) => b.createdAt - a.createdAt);
  } catch (err) {
    console.error("Failed to get inbox", err);
    return [];
  }
}

export function sendMessage(to, body) {
  try {
    if (!body || !body.trim()) throw new Error("Message cannot be empty");
    if (!to) throw new Error("Recipient required");
    const user = getCurrentUser();
    if (!user) throw new Error("Login required");
    const newMessage = {
      id: uid("m"),
      from: user.id,
      to,
      body,
      createdAt: Date.now()
    };
    storage.saveMessages([newMessage, ...storage.getMessages()]);
    return newMessage;
  } catch (err) {
    throw err;
  }
}
