import { seedMockData } from "./storage.js";
import pageHandlers from "./page-handlers.js";
import { renderShell } from "./ui.js";

export function initApp(pageName) {
  seedMockData();
  renderShell();
  const handler = pageHandlers[pageName];
  if (handler) handler();
}

window.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;
  initApp(page);
});
