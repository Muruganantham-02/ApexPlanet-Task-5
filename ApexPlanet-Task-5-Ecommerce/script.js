/* ShopEase - source JavaScript */
"use strict";

const products = [
  {id:1,name:"Everyday Ceramic Mug",category:"Home",price:499,rating:4.8,tag:"Bestseller",image:"https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=700&q=75"},
  {id:2,name:"Wireless Headphones",category:"Tech",price:2499,rating:4.7,tag:"Popular",image:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=75"},
  {id:3,name:"Minimal Wrist Watch",category:"Accessories",price:1899,rating:4.6,tag:"New",image:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=75"},
  {id:4,name:"Canvas Everyday Bag",category:"Accessories",price:999,rating:4.5,tag:"Everyday pick",image:"https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=700&q=75"},
  {id:5,name:"Desk Table Lamp",category:"Home",price:1499,rating:4.4,tag:"Editor's pick",image:"https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=700&q=75"},
  {id:6,name:"Portable Speaker",category:"Tech",price:2199,rating:4.6,tag:"Popular",image:"https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=700&q=75"},
  {id:7,name:"Soft Cotton Throw",category:"Lifestyle",price:1299,rating:4.3,tag:"Comfort pick",image:"https://images.unsplash.com/photo-1600369671236-e74521d4b6ad?auto=format&fit=crop&w=700&q=75"},
  {id:8,name:"Reusable Water Bottle",category:"Lifestyle",price:699,rating:4.5,tag:"Daily essential",image:"https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=700&q=75"},
  {id:9,name:"Sunglasses Classic",category:"Accessories",price:1199,rating:4.2,tag:"Summer pick",image:"https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=700&q=75"}
];

const $ = (selector) => document.querySelector(selector);
const productGrid = $("#product-grid");
const searchInput = $("#search-input");
const categoryFilter = $("#category-filter");
const maxPrice = $("#max-price");
const priceValue = $("#price-value");
const sortSelect = $("#sort-select");
const resultsLabel = $("#results-label");
const emptyState = $("#empty-state");
const cartDrawer = $("#cart-drawer");
const overlay = $("#overlay");
const cartItems = $("#cart-items");
const cartEmpty = $("#cart-empty");
const cartCount = $("#cart-count");
const cartSubtotal = $("#cart-subtotal");
const toast = $("#toast");

let cart = readCart();
let toastTimeout;

function readCart() {
  try {
    const saved = JSON.parse(localStorage.getItem("shopease-cart") || "[]");
    return Array.isArray(saved) ? saved.filter(item => products.some(p => p.id === item.id) && Number.isInteger(item.quantity) && item.quantity > 0) : [];
  } catch (error) {
    return [];
  }
}

function saveCart() {
  try {
    localStorage.setItem("shopease-cart", JSON.stringify(cart));
  } catch (error) {
    showToast("Cart could not be saved in this browser.");
  }
}

function formatPrice(value) {
  return new Intl.NumberFormat("en-IN", {style:"currency", currency:"INR", maximumFractionDigits:0}).format(value);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => toast.classList.remove("show"), 2400);
}

function getVisibleProducts() {
  const query = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;
  const limit = Number(maxPrice.value);
  const filtered = products.filter(product => {
    const matchesText = (product.name + " " + product.category).toLowerCase().includes(query);
    return matchesText && (category === "all" || product.category === category) && product.price <= limit;
  });

  switch (sortSelect.value) {
    case "price-low": filtered.sort((a,b) => a.price - b.price); break;
    case "price-high": filtered.sort((a,b) => b.price - a.price); break;
    case "rating": filtered.sort((a,b) => b.rating - a.rating); break;
    default: filtered.sort((a,b) => a.id - b.id);
  }
  return filtered;
}

function renderProducts() {
  const visibleProducts = getVisibleProducts();
  productGrid.replaceChildren();
  resultsLabel.textContent = `${visibleProducts.length} product${visibleProducts.length === 1 ? "" : "s"} found`;
  emptyState.hidden = visibleProducts.length !== 0;
  productGrid.hidden = visibleProducts.length === 0;

  visibleProducts.forEach(product => {
    const card = document.createElement("article");
    card.className = "product-card";
    const imageWrap = document.createElement("div");
    imageWrap.className = "product-image-wrap";
    const image = document.createElement("img");
    image.className = "product-image";
    image.src = product.image;
    image.alt = product.name;
    image.loading = "lazy";
    image.decoding = "async";
    image.width = 700;
    image.height = 525;
    imageWrap.append(image);

    const tag = document.createElement("span");
    tag.className = "product-tag";
    tag.textContent = product.tag;
    imageWrap.append(tag);

    const info = document.createElement("div");
    info.className = "product-info";
    const category = document.createElement("p");
    category.className = "product-category";
    category.textContent = product.category;
    const title = document.createElement("h3");
    title.textContent = product.name;
    const meta = document.createElement("div");
    meta.className = "product-meta";
    const price = document.createElement("span");
    price.className = "product-price";
    price.textContent = formatPrice(product.price);
    const rating = document.createElement("span");
    rating.className = "product-rating";
    rating.textContent = `★ ${product.rating.toFixed(1)}`;
    meta.append(price, rating);
    const addButton = document.createElement("button");
    addButton.className = "add-button";
    addButton.type = "button";
    addButton.textContent = "Add to cart +";
    addButton.setAttribute("aria-label", `Add ${product.name} to cart`);
    addButton.addEventListener("click", () => addToCart(product.id));
    info.append(category, title, meta, addButton);
    card.append(imageWrap, info);
    productGrid.append(card);
  });

  renderActiveFilters();
}

function renderActiveFilters() {
  const chips = [];
  if (searchInput.value.trim()) chips.push(`Search: ${searchInput.value.trim()}`);
  if (categoryFilter.value !== "all") chips.push(`Category: ${categoryFilter.value}`);
  if (Number(maxPrice.value) < 5000) chips.push(`Up to ${formatPrice(Number(maxPrice.value))}`);
  $("#active-filters").replaceChildren();
  chips.forEach(text => {
    const chip = document.createElement("span");
    chip.className = "filter-chip";
    chip.textContent = text;
    $("#active-filters").append(chip);
  });
}

function addToCart(id) {
  const existing = cart.find(item => item.id === id);
  if (existing) existing.quantity += 1;
  else cart.push({id, quantity:1});
  saveCart();
  renderCart();
  showToast("Added to your cart.");
}

function updateQuantity(id, amount) {
  const item = cart.find(entry => entry.id === id);
  if (!item) return;
  item.quantity += amount;
  if (item.quantity <= 0) cart = cart.filter(entry => entry.id !== id);
  saveCart();
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  renderCart();
  showToast("Item removed.");
}

function renderCart() {
  cartItems.replaceChildren();
  let count = 0;
  let subtotal = 0;
  cart.forEach(item => {
    const product = products.find(p => p.id === item.id);
    if (!product) return;
    count += item.quantity;
    subtotal += product.price * item.quantity;

    const row = document.createElement("div");
    row.className = "cart-line";
    const image = document.createElement("img");
    image.src = product.image;
    image.alt = "";
    image.loading = "lazy";
    image.width = 70;
    image.height = 70;
    const details = document.createElement("div");
    const name = document.createElement("h3");
    name.textContent = product.name;
    const price = document.createElement("p");
    price.textContent = formatPrice(product.price * item.quantity);
    const controls = document.createElement("div");
    controls.className = "quantity-controls";
    const minus = document.createElement("button");
    minus.type = "button";
    minus.textContent = "−";
    minus.setAttribute("aria-label", `Decrease quantity of ${product.name}`);
    minus.addEventListener("click", () => updateQuantity(product.id, -1));
    const quantity = document.createElement("span");
    quantity.textContent = String(item.quantity);
    const plus = document.createElement("button");
    plus.type = "button";
    plus.textContent = "+";
    plus.setAttribute("aria-label", `Increase quantity of ${product.name}`);
    plus.addEventListener("click", () => updateQuantity(product.id, 1));
    controls.append(minus, quantity, plus);
    details.append(name, price, controls);
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove-button";
    remove.textContent = "Remove";
    remove.setAttribute("aria-label", `Remove ${product.name} from cart`);
    remove.addEventListener("click", () => removeFromCart(product.id));
    const action = document.createElement("div");
    action.append(remove);
    row.append(image, details, action);
    cartItems.append(row);
  });

  cartCount.textContent = String(count);
  cartSubtotal.textContent = formatPrice(subtotal);
  cartEmpty.hidden = count > 0;
  cartItems.hidden = count === 0;
}

function openCart() {
  cartDrawer.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
  overlay.hidden = false;
  document.body.style.overflow = "hidden";
  $("#cart-close").focus();
}
function closeCart() {
  cartDrawer.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
  overlay.hidden = true;
  document.body.style.overflow = "";
  $("#cart-toggle").focus();
}

function resetFilters() {
  searchInput.value = "";
  categoryFilter.value = "all";
  maxPrice.value = "5000";
  priceValue.textContent = formatPrice(5000);
  sortSelect.value = "featured";
  renderProducts();
}

$("#search-form").addEventListener("submit", event => {
  event.preventDefault();
  renderProducts();
  $("#shop").scrollIntoView({behavior:"smooth", block:"start"});
});
searchInput.addEventListener("input", renderProducts);
categoryFilter.addEventListener("change", renderProducts);
maxPrice.addEventListener("input", () => {
  priceValue.textContent = formatPrice(Number(maxPrice.value));
  renderProducts();
});
sortSelect.addEventListener("change", renderProducts);
$("#reset-filters").addEventListener("click", resetFilters);
$("#empty-reset").addEventListener("click", resetFilters);
$("#cart-toggle").addEventListener("click", openCart);
$("#cart-close").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && cartDrawer.classList.contains("open")) closeCart();
});
$("#checkout-button").addEventListener("click", () => {
  if (cart.length === 0) showToast("Your cart is empty.");
  else showToast("Demo only: online checkout is not connected.");
});
$("#year").textContent = String(new Date().getFullYear());

priceValue.textContent = formatPrice(Number(maxPrice.value));
renderProducts();
renderCart();
