import {
  addToCart,
  checkout,
  getCartWithDetails,
  removeFromCart
} from "./cart.js";
import { getCurrentUser, login, register, updateProfile } from "./auth.js";
import {
  deleteProduct,
  getCategories,
  getMyProducts,
  getProductById,
  getProducts,
  reportProduct,
  saveProduct,
  updateProduct
} from "./products.js";
import { sendMessage, getInbox } from "./messages.js";
import { storage } from "./storage.js";
import { renderProductCard, showToast } from "./ui.js";

const pageHandlers = {
  home: renderHome,
  login: initLogin,
  register: initRegister,
  products: initProducts,
  addProduct: initAddProduct,
  editProduct: initEditProduct,
  myProducts: initMyProducts,
  productDetails: initProductDetails,
  cart: initCart,
  checkout: initCheckout,
  profile: initProfile,
  admin: initAdmin,
  chat: initChat,
  inbox: initInbox,
  requirements: () => {}
};

export default pageHandlers;

function renderHome() {
  const latestGrid = document.getElementById("latest-products");
  if (latestGrid) {
    const products = getProducts()
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 4);
    latestGrid.innerHTML = products
      .map((product) => renderProductCard(product))
      .join("") || `<p>No products yet. Be the first to <a href="add-product.html">list an item</a>.</p>`;
  }
}

function initLogin() {
  const form = document.getElementById("login-form");
  if (!form) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    try {
      login({ email: data.email, password: data.password });
      showToast("Welcome back!", "success");
      window.location.href = "index.html";
    } catch (err) {
      showToast(err.message, "error");
    }
  });
}

function initRegister() {
  const form = document.getElementById("register-form");
  if (!form) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    try {
      register(data);
      showToast("Account created!", "success");
      window.location.href = "profile.html";
    } catch (err) {
      showToast(err.message, "error");
    }
  });
}

function initProducts() {
  const container = document.getElementById("products-container");
  if (!container) return;
  const categorySelect = document.getElementById("category-filter");
  const priceSelect = document.getElementById("price-filter");
  const sortSelect = document.getElementById("sort-select");
  const searchInput = document.getElementById("search-input");

  populateCategories(categorySelect);

  const render = () => {
    const searchTerm = searchInput.value.toLowerCase();
    const category = categorySelect.value;
    const priceRange = priceSelect.value;
    const sort = sortSelect.value;

    let items = [...getProducts()];
    if (searchTerm) {
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm) ||
          p.description.toLowerCase().includes(searchTerm)
      );
    }
    if (category !== "All") {
      items = items.filter((p) => p.category === category);
    }
    if (priceRange !== "all") {
      const [min, max] = priceRange.split("-").map(Number);
      items = items.filter((p) => {
        if (!max) return p.price >= min;
        return p.price >= min && p.price <= max;
      });
    }
    if (sort === "latest") items.sort((a, b) => b.createdAt - a.createdAt);
    if (sort === "price-low") items.sort((a, b) => a.price - b.price);
    if (sort === "price-high") items.sort((a, b) => b.price - a.price);

    container.innerHTML = items
      .map((p) => renderProductCard(p))
      .join("") || `<p>No products found. Try a different filter.</p>`;
  };

  [categorySelect, priceSelect, sortSelect, searchInput]
    .filter(Boolean)
    .forEach((el) => el.addEventListener("input", render));

  render();
}

function populateCategories(select) {
  if (!select) return;
  select.innerHTML = getCategories()
    .map((cat) => `<option value="${cat}">${cat}</option>`)
    .join("");
}

function initAddProduct() {
  const form = document.getElementById("add-product-form");
  const preview = document.getElementById("image-preview");
  const fileInput = document.getElementById("product-image");
  let uploadedImage = "";

  if (fileInput) {
    fileInput.addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (file) {
        uploadedImage = await toBase64(file);
        if (preview) preview.src = uploadedImage;
      }
    });
  }

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    try {
      saveProduct({ ...data, image: uploadedImage || "assets/placeholder.svg" });
      showToast("Product listed!", "success");
      form.reset();
      if (preview) preview.src = "assets/placeholder.svg";
    } catch (err) {
      showToast(err.message, "error");
    }
  });
}

function initEditProduct() {
  const form = document.getElementById("edit-product-form");
  if (!form) return;
  const id = new URLSearchParams(window.location.search).get("id");
  const product = getProductById(id);
  const preview = document.getElementById("edit-image-preview");
  const fileInput = document.getElementById("edit-product-image");
  let imageValue = product?.image || "assets/placeholder.svg";

  if (!product) {
    showToast("Product not found", "error");
    window.location.href = "my-products.html";
    return;
  }

  form.name.value = product.name;
  form.price.value = product.price;
  form.description.value = product.description;
  form.category.value = product.category;
  if (preview) preview.src = product.image;

  fileInput?.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (file) {
      imageValue = await toBase64(file);
      if (preview) preview.src = imageValue;
    }
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    updateProduct(product.id, { ...data, price: Number(data.price), image: imageValue });
    showToast("Product updated", "success");
    window.location.href = "my-products.html";
  });
}

function initMyProducts() {
  const container = document.getElementById("my-products");
  if (!container) return;
  const items = getMyProducts();
  container.innerHTML =
    items
      .map((product) =>
        renderProductCard(product, [
          `<a class="btn btn-outline" href="edit-product.html?id=${product.id}">Edit</a>`,
          `<button type="button" class="btn btn-muted" data-delete="${product.id}">Delete</button>`
        ])
      )
      .join("") || `<p>You have not posted anything yet. <a href="add-product.html">Sell now</a>.</p>`;

  container.querySelectorAll("[data-delete]").forEach((btn) => {
    btn.addEventListener("click", () => {
      deleteProduct(btn.dataset.delete);
      showToast("Listing removed", "success");
      initMyProducts();
    });
  });
}

function initProductDetails() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const product = getProductById(id);
  if (!product) return;
  const wrapper = document.getElementById("product-detail");
  if (!wrapper) return;
  const owner = getCurrentUser();
  wrapper.innerHTML = `
    <div class="flex" style="flex-wrap:wrap;align-items:flex-start;">
      <img src="${product.image}" alt="${product.name}" style="flex:1;min-width:280px;border-radius:1rem;" />
      <div style="flex:1;min-width:260px;">
        <h1>${product.name}</h1>
        <p class="price">RM ${product.price.toFixed(2)}</p>
        <p>${product.description}</p>
        <p><strong>Category:</strong> ${product.category}</p>
        <div class="flex" style="flex-wrap:wrap;">
        <button type="button" class="btn btn-primary" id="contact-seller">Contact Seller</button>
        <button type="button" class="btn btn-outline" id="add-to-cart">Add to Cart</button>
        <button type="button" class="btn btn-muted" id="report-product">Report Listing</button>
        ${owner?.role === "admin" ? `<button type="button" class="btn btn-muted" id="force-delete">Force Delete</button>` : ""}
        </div>
      </div>
    </div>`;

  document.getElementById("contact-seller")?.addEventListener("click", () => {
    window.location.href = `chat.html?productId=${product.id}`;
  });
  document.getElementById("add-to-cart")?.addEventListener("click", () => {
    try {
      addToCart(product.id);
      showToast("Added to cart", "success");
    } catch (err) {
      showToast(err.message, "error");
    }
  });
  document.getElementById("report-product")?.addEventListener("click", () => {
    const reason = prompt("Reason for report");
    if (!reason) return;
    reportProduct(product.id, reason);
    showToast("Report submitted", "success");
  });
  document.getElementById("force-delete")?.addEventListener("click", () => {
    deleteProduct(product.id);
    showToast("Product removed", "success");
    window.location.href = "products.html";
  });
}

function initCart() {
  const container = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");
  if (!container) return;
  const items = getCartWithDetails();
  if (!items.length) {
    container.innerHTML = `<p>Your cart is empty. <a href="products.html">Continue shopping</a>.</p>`;
    if (totalEl) totalEl.textContent = "RM 0.00";
    return;
  }
  let total = 0;
  container.innerHTML = items
    .map((entry) => {
      const subtotal = entry.product.price * entry.quantity;
      total += subtotal;
      return `
        <div class="card flex-between" data-id="${entry.productId}">
          <div>
            <h3>${entry.product.name}</h3>
            <p class="chip">Qty ${entry.quantity}</p>
            <p>Subtotal: RM ${subtotal.toFixed(2)}</p>
          </div>
          <button class="btn btn-muted" data-remove="${entry.productId}">Remove</button>
        </div>`;
    })
    .join("");
  if (totalEl) totalEl.textContent = `RM ${total.toFixed(2)}`;
  container.querySelectorAll("[data-remove]").forEach((btn) => {
    btn.addEventListener("click", () => {
      removeFromCart(btn.dataset.remove);
      initCart();
    });
  });
}

function initCheckout() {
  const form = document.getElementById("checkout-form");
  if (!form) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const paymentMethod = form.payment.value;
    try {
      const message = checkout(paymentMethod);
      showToast(message, "success");
      const rating = prompt("Rate this transaction 1-5 stars");
      if (rating) {
        showToast(`Thanks for rating us ${rating}⭐`, "info");
      }
      form.reset();
    } catch (err) {
      showToast(err.message, "error");
    }
  });
}

function initProfile() {
  const form = document.getElementById("profile-form");
  const user = getCurrentUser();
  if (!form || !user) return;
  form.username.value = user.username;
  form.email.value = user.email;
  form.campus.value = user.campus || "";
  form.bio.value = user.bio || "";
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    updateProfile(data);
    showToast("Profile updated", "success");
  });
}

function initAdmin() {
  const container = document.getElementById("reported-products");
  if (!container) return;
  const reported = getProducts().filter((p) => (p.reports?.length || 0) > 0);
  container.innerHTML = reported
    .map(
      (p) => `
        <div class="card">
          <h3>${p.name}</h3>
          <p>${p.reports.length} report(s)</p>
          <button class="btn btn-muted" data-delete="${p.id}">Remove Listing</button>
        </div>`
    )
    .join("") || `<p>No reports yet.</p>`;
  container.querySelectorAll("[data-delete]").forEach((btn) => {
    btn.addEventListener("click", () => {
      deleteProduct(btn.dataset.delete);
      showToast("Listing removed", "success");
      initAdmin();
    });
  });
}

function initChat() {
  const form = document.getElementById("chat-form");
  const list = document.getElementById("chat-messages");
  if (!form || !list) return;
  const inbox = getInbox();
  renderMessages(inbox, list);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const body = form.message.value.trim();
    if (!body) return;
    try {
      const to = new URLSearchParams(window.location.search).get("to") || "u-admin";
      sendMessage(to, body);
      form.reset();
      renderMessages(getInbox(), list);
    } catch (err) {
      showToast(err.message, "error");
    }
  });
}

function initInbox() {
  const container = document.getElementById("inbox-list");
  if (!container) return;
  const messages = getInbox();
  const usersMap = Object.fromEntries(storage.getUsers().map((u) => [u.id, u.username]));
  container.innerHTML = messages
    .map(
      (msg) => `
        <div class="card">
          <p><strong>${usersMap[msg.from] || msg.from}</strong> &rarr; <strong>${
        usersMap[msg.to] || msg.to
      }</strong></p>
          <p>${msg.body}</p>
        </div>`
    )
    .join("") || `<p>No messages yet.</p>`;
}

function renderMessages(messages, list) {
  list.innerHTML = messages
    .slice(0, 20)
    .map((msg) => {
      const user = getCurrentUser();
      const alignment = msg.from === user?.id ? "me" : "them";
      return `<div class="message ${alignment}">${msg.body}</div>`;
    })
    .join("");
  list.scrollTop = list.scrollHeight;
}

async function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
