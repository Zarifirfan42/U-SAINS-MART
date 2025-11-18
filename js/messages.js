import { storage, uid } from "./storage.js";
import { getCurrentUser } from "./auth.js";

export function getInbox() {
  const user = getCurrentUser();
  if (!user) return [];
  return storage
    .getMessages()
    .filter((msg) => msg.to === user.id || msg.from === user.id)
    .sort((a, b) => b.createdAt - a.createdAt);
}

export function sendMessage(to, body) {
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
}
