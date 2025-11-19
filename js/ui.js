import { getCurrentUser, logout } from "./auth.js";
import { getCart } from "./cart.js";

export function renderShell() {
  renderHeader();
  renderFooter();
  setActiveNavLink();
}

function renderHeader() {
  const header = document.getElementById("app-header");
  if (!header) return;
  const user = getCurrentUser();
  const cartCount = getCart().length;

  header.innerHTML = `
    <div class="top-bar">
      <a class="brand" href="index.html">
        <span>U</span>
        USM Marketplace
      </a>
      <nav class="nav-links">
        <a href="products.html">Marketplace</a>
        <a href="add-product.html">Sell Item</a>
        <a href="my-products.html">My Listings</a>
        <a href="cart.html" class="nav-item-wrapper">
          Cart
          ${cartCount > 0 ? `<span class="cart-badge">${cartCount}</span>` : ''}
        </a>
        <a href="chat.html">Chat</a>
        <a href="inbox.html">Inbox</a>
        ${user?.role === "admin" ? `<a href="admin-dashboard.html">Admin</a>` : ""}
      </nav>
      <div class="auth-actions">
        ${user ? headerUser(user) : guestActions()}
      </div>
    </div>`;

  const logoutBtn = header.querySelector("#logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      logout();
      window.location.href = "login.html";
    });
  }
}

function headerUser(user) {
  return `
    <a class="btn btn-muted" href="profile.html">${user.username}</a>
    <button class="btn btn-outline" id="logout-btn">Logout</button>
  `;
}

function guestActions() {
  return `
    <a class="btn btn-outline" href="login.html">Login</a>
    <a class="btn btn-primary" href="register.html">Register</a>
  `;
}

function renderFooter() {
  const footer = document.getElementById("app-footer");
  if (!footer) return;
  const year = new Date().getFullYear();
  footer.innerHTML = `
    <footer>
      <p>&copy; ${year} USM Marketplace &mdash; Built for Universiti Sains Malaysia students.</p>
      <p><a href="requirements.html">Project Requirements</a> &middot; <a href="https://github.com/" target="_blank">GitHub</a></p>
    </footer>`;
}

function setActiveNavLink() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".nav-links a");

  navLinks.forEach(link => {
    const href = link.getAttribute("href");
    if (href === currentPage || (currentPage === "" && href === "index.html")) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

export function showToast(message, type = "info") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;

  const icons = {
    success: "✓",
    error: "✕",
    warning: "⚠",
    info: "ℹ"
  };

  toast.innerHTML = `<span style="margin-right: 0.5rem; font-weight: 700;">${icons[type] || "ℹ"}</span> ${message}`;
  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), 3200);
}

export function renderProductCard(product, actions = []) {
  const chip = product.status === "reported" ? `<span class="status-badge status-reported">Reported</span>` : "";
  return `
    <article class="card product-card">
      <img src="${product.image}" alt="${product.name}" />
      <div class="flex-between">
        <h3>${product.name}</h3>
        ${chip}
      </div>
      <p class="price">RM ${product.price.toFixed(2)}</p>
      <span class="chip">${product.category}</span>
      <p>${product.description.slice(0, 80)}...</p>
      <div class="flex" style="flex-wrap:wrap;">
        <a class="btn btn-outline" href="product-details.html?id=${product.id}">View</a>
        ${actions.join(" ")}
      </div>
    </article>`;
}
