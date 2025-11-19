import { getCurrentUser, logout } from "./auth.js";
import { getCart } from "./cart.js";

// Public API
export function renderShell() {
  renderHeader();
  renderFooter();
  setActiveNavLink();
  updateCartBadge();
}

function renderHeader() {
  const header = document.getElementById("app-header");
  if (!header) return;
  const user = getCurrentUser();
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  const isActive = (href) => currentPath === href ? "active" : "";

  header.innerHTML = `
    <div class="top-bar">
      <a class="brand" href="index.html">
        <span>U</span>
        USM Marketplace
      </a>
      <nav class="nav-links">
        <a href="products.html" class="${isActive("products.html")}" data-nav>Marketplace</a>
        <a href="add-product.html" class="${isActive("add-product.html")}" data-nav>Sell Item</a>
        <a href="my-products.html" class="${isActive("my-products.html")}" data-nav>My Listings</a>
        <a href="cart.html" class="${isActive("cart.html")}" data-nav>Cart <span id="cart-badge" class="badge">0</span></a>
        <a href="chat.html" class="${isActive("chat.html")}" data-nav>Chat</a>
        <a href="inbox.html" class="${isActive("inbox.html")}" data-nav>Inbox</a>
        <a href="admin-dashboard.html" class="${isActive("admin-dashboard.html")}" data-nav>Admin</a>
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

  // react to cart updates via event (dispatched by cart module)
  try {
    window.removeEventListener('cart:updated', updateCartBadge);
  } catch (e) {}
  window.addEventListener('cart:updated', updateCartBadge);
  // initial badge update
  updateCartBadge();
}

function headerUser(user) {
  return `
    <a class="btn btn-muted" href="profile.html">${escapeHtml(user.username)}</a>
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
  const navLinks = document.querySelectorAll(".nav-links [data-nav]");

  navLinks.forEach(link => {
    const href = link.getAttribute("href");
    if (href === currentPage || (currentPage === "" && href === "index.html")) {
      link.classList.add("active");
      link.setAttribute('aria-current','page');
    } else {
      link.classList.remove("active");
      link.removeAttribute('aria-current');
    }
  });
}

export function updateCartBadge() {
  try {
    const badge = document.getElementById('cart-badge');
    if (!badge) return;
    const cart = getCart() || [];
    const count = cart.reduce((s, item) => s + (item.quantity || 1), 0);
    badge.textContent = count;
    badge.style.display = count > 0 ? 'inline-block' : 'none';
  } catch (e) {
    // ignore
  }
}

// Toast notifications with icons and auto-dismiss
export function showToast(message, type = "info", opts = {}) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.setAttribute('aria-live', 'polite');
    document.body.appendChild(container);
  }

  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<span class="toast-icon">${icons[type] || icons.info}</span><div class="toast-body">${escapeHtml(message)}</div>`;

  // entry animation
  el.style.opacity = '0';
  container.appendChild(el);
  requestAnimationFrame(() => {
    el.style.transition = 'opacity 250ms ease, transform 250ms ease';
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
  });

  const timeout = opts.timeout || 3500;
  const timer = setTimeout(() => dismiss(), timeout);
  el.addEventListener('click', () => dismiss());

  function dismiss() {
    clearTimeout(timer);
    el.style.opacity = '0';
    el.style.transform = 'translateY(-8px)';
    setTimeout(() => el.remove(), 300);
  }
}

// Helper to build responsive <picture> markup. Detects optimized webp variants if present.
function buildImageMarkup(imagePath, alt = '', classes = '') {
  if (!imagePath) return '';
  const isSvg = imagePath.endsWith('.svg');
  const optimizedPrefix = 'assets/optimized/';

  if (isSvg) {
    return `<img class="${classes}" src="${imagePath}" alt="${escapeHtml(alt)}" loading="lazy"/>`;
  }

  // If path already points to optimized 800.webp, derive 400/1600
  if (imagePath.includes(optimizedPrefix) && imagePath.endsWith('-800.webp')) {
    const base = imagePath.replace('-800.webp', '');
    const srcset = `${base}-400.webp 400w, ${base}-800.webp 800w, ${base}-1600.webp 1600w`;
    return `
      <picture>
        <source type="image/webp" srcset="${srcset}" sizes="(max-width:600px) 100vw, 600px">
        <img class="${classes}" src="${base}-800.webp" alt="${escapeHtml(alt)}" loading="lazy">
      </picture>`;
  }

  // If original raster in assets/ and optimized variants likely exist, map to optimized
  const filename = imagePath.split('/').pop();
  const nameNoExt = filename.replace(/\.(png|jpe?g)$/i, '');
  const optBase = `${optimizedPrefix}${nameNoExt}`;
  const webp400 = `${optBase}-400.webp`;
  const webp800 = `${optBase}-800.webp`;
  const webp1600 = `${optBase}-1600.webp`;

  const srcset = `${webp400} 400w, ${webp800} 800w, ${webp1600} 1600w`;
  return `
    <picture>
      <source type="image/webp" srcset="${srcset}" sizes="(max-width:600px) 100vw, 600px">
      <img class="${classes}" src="${escapeHtml(imagePath)}" alt="${escapeHtml(alt)}" loading="lazy">
    </picture>`;
}

export function renderProductCard(product, actions = []) {
  const chip = product.status === 'reported' ? `<span class="status-badge status-reported">Reported</span>` : '';
  const imgMarkup = buildImageMarkup(product.image, product.name, 'product-image');
  return `
    <article class="card product-card">
      <div class="product-media">${imgMarkup}</div>
      <div class="card-body">
        <div class="flex-between">
          <h3>${escapeHtml(product.name)}</h3>
          ${chip}
        </div>
        <p class="price">RM ${Number(product.price).toFixed(2)}</p>
        <span class="chip">${escapeHtml(product.category)}</span>
        <p class="muted">${escapeHtml(truncate(product.description, 120))}</p>
        <div class="flex" style="flex-wrap:wrap; gap:8px;">
          <a class="btn btn-outline" href="product-details.html?id=${encodeURIComponent(product.id)}">View</a>
          ${actions.join(' ')}
        </div>
      </div>
    </article>`;
}

// Small helpers
function truncate(str = '', n = 100) {
  if (!str) return '';
  return str.length > n ? str.slice(0, n).trim() + '...' : str;
}

function escapeHtml(unsafe = '') {
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Loading spinner utilities
export function showLoading(target = document.body) {
  let loader = document.getElementById('global-loader');
  if (!loader) {
    loader = document.createElement('div');
    loader.id = 'global-loader';
    loader.className = 'loader';
    loader.innerHTML = '<div class="spinner"></div>';
    target.appendChild(loader);
  }
  loader.style.display = 'flex';
}

export function hideLoading() {
  const loader = document.getElementById('global-loader');
  if (loader) loader.style.display = 'none';
}

// Time formatting
export function formatTimeAgo(ts) {
  const d = typeof ts === 'number' ? new Date(ts) : new Date(ts);
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

