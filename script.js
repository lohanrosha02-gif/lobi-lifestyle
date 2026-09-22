/* =========================================================
   LOBI LIFESTYLE
   CATÁLOGO CONECTADO AO SUPABASE
   ========================================================= */

const WHATSAPP_NUMBER = "5583993149486";
const sb = window.lobiSupabase;

let products = [];
let cart = JSON.parse(localStorage.getItem("lobiCart")) || [];
let selectedProduct = null;
let selectedSize = null;
let activeFilter = "todos";

const productsGrid = document.querySelector("#productsGrid");
const filtersContainer = document.querySelector(".filters");

const productModal = document.querySelector("#productModal");
const closeProductModal = document.querySelector("#closeProductModal");
const modalImage = document.querySelector("#modalImage");
const modalName = document.querySelector("#modalName");
const modalPrice = document.querySelector("#modalPrice");
const modalDescription = document.querySelector("#modalDescription");
const sizesContainer = document.querySelector("#sizes");
const addCartButton = document.querySelector("#addCart");

const cartElement = document.querySelector("#cart");
const cartOverlay = document.querySelector("#cartOverlay");
const cartItems = document.querySelector("#cartItems");
const cartCount = document.querySelector("#cartCount");
const cartTotal = document.querySelector("#cartTotal");
const cartEmpty = document.querySelector("#cartEmpty");
const cartFooter = document.querySelector("#cartFooter");
const cartButton = document.querySelector("#cartButton");
const closeCartButton = document.querySelector("#closeCart");
const checkoutButton = document.querySelector("#checkoutButton");

const searchOverlay = document.querySelector("#searchOverlay");
const searchInput = document.querySelector("#searchInput");
const searchResults = document.querySelector("#searchResults");
const searchButton = document.querySelector("#searchButton");
const closeSearchButton = document.querySelector("#closeSearch");

const menuButton = document.querySelector("#menuButton");
const nav = document.querySelector("#nav");

function formatMoney(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function loadProducts() {
  if (!productsGrid) return;

  productsGrid.innerHTML = `
    <div class="no-products">
      <p>Carregando produtos...</p>
    </div>
  `;

  const { data, error } = await sb
    .from("products")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao carregar produtos:", error);
    productsGrid.innerHTML = `
      <div class="no-products">
        <p>Não foi possível carregar os produtos.</p>
      </div>
    `;
    return;
  }

  products = (data || []).map((product) => ({
    ...product,
    image: product.image_url || "",
    sizes: Array.isArray(product.sizes) ? product.sizes : []
  }));

  renderFilters();
  renderProducts(products);
}

function renderFilters() {
  if (!filtersContainer) return;

  const categories = [...new Set(
    products
      .map((product) => product.category?.trim())
      .filter(Boolean)
  )].sort((a, b) => a.localeCompare(b, "pt-BR"));

  filtersContainer.innerHTML = `
    <button class="filter ${activeFilter === "todos" ? "active" : ""}" data-filter="todos">
      Todos
    </button>
  `;

  categories.forEach((category) => {
    const button = document.createElement("button");
    button.className = `filter ${activeFilter === category ? "active" : ""}`;
    button.dataset.filter = category;
    button.textContent = category;
    filtersContainer.appendChild(button);
  });
}

function renderProducts(list = products) {
  if (!productsGrid) return;

  productsGrid.innerHTML = "";

  if (!list.length) {
    productsGrid.innerHTML = `
      <div class="no-products">
        <p>Nenhum produto encontrado.</p>
      </div>
    `;
    return;
  }

  list.forEach((product) => {
    const card = document.createElement("article");
    card.classList.add("product-card");

    const image = product.image || "";
    const tag = product.tag ? escapeHtml(product.tag) : "";
    const soldOut = Number(product.stock || 0) <= 0;

    card.innerHTML = `
      <div class="product-image">
        ${image
          ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(product.name)}" loading="lazy">`
          : `<div class="no-products"><p>Sem imagem</p></div>`}

        ${tag ? `<span class="product-tag">${tag}</span>` : ""}
        ${soldOut ? `<span class="product-tag" style="top:48px;background:#ef2b20;color:#fff">ESGOTADO</span>` : ""}
      </div>

      <div class="product-info">
        <h3>${escapeHtml(product.name)}</h3>
        <p>${formatMoney(product.price)}</p>
      </div>
    `;

    card.addEventListener("click", () => openProduct(product.id));
    productsGrid.appendChild(card);
  });
}

function openProduct(id) {
  selectedProduct = products.find((product) => product.id === id);
  if (!selectedProduct) return;

  selectedSize = null;
  modalImage.src = selectedProduct.image || "";
  modalImage.alt = selectedProduct.name || "Produto";
  modalName.textContent = selectedProduct.name || "";
  modalPrice.textContent = formatMoney(selectedProduct.price);
  modalDescription.textContent = selectedProduct.description || "";

  renderSizes();

  if (Number(selectedProduct.stock || 0) <= 0) {
    addCartButton.disabled = true;
    addCartButton.textContent = "PRODUTO ESGOTADO";
  } else {
    addCartButton.disabled = false;
    addCartButton.textContent = "ADICIONAR À SACOLA";
  }

  productModal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeProduct() {
  if (!productModal) return;
  productModal.classList.remove("active");
  selectedProduct = null;
  selectedSize = null;
  document.body.style.overflow = "";
}

function renderSizes() {
  if (!sizesContainer || !selectedProduct) return;

  sizesContainer.innerHTML = "";
  const sizes = selectedProduct.sizes?.length ? selectedProduct.sizes : ["Único"];

  sizes.forEach((size) => {
    const button = document.createElement("button");
    button.classList.add("size");
    button.type = "button";
    button.textContent = size;

    button.addEventListener("click", () => {
      selectedSize = size;
      document.querySelectorAll(".size").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
    });

    sizesContainer.appendChild(button);
  });
}

function addToCart() {
  if (!selectedProduct) return;

  if (Number(selectedProduct.stock || 0) <= 0) {
    alert("Este produto está esgotado.");
    return;
  }

  if (!selectedSize) {
    alert("Escolha um tamanho antes de adicionar à sacola.");
    return;
  }

  const existingItem = cart.find(
    (item) => item.id === selectedProduct.id && item.size === selectedSize
  );

  if (existingItem) {
    if (existingItem.quantity >= Number(selectedProduct.stock || 0)) {
      alert("Você atingiu a quantidade disponível em estoque.");
      return;
    }
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: selectedProduct.id,
      name: selectedProduct.name,
      price: Number(selectedProduct.price),
      image: selectedProduct.image,
      size: selectedSize,
      quantity: 1
    });
  }

  saveCart();
  closeProduct();
  openCart();
}

function saveCart() {
  localStorage.setItem("lobiCart", JSON.stringify(cart));
  renderCart();
}

function calculateCartTotal() {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

function renderCart() {
  if (!cartItems) return;

  cartItems.innerHTML = "";
  const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);

  if (cartCount) cartCount.textContent = totalQuantity;

  if (!cart.length) {
    if (cartEmpty) cartEmpty.style.display = "flex";
    if (cartFooter) cartFooter.style.display = "none";
    return;
  }

  if (cartEmpty) cartEmpty.style.display = "none";
  if (cartFooter) cartFooter.style.display = "block";

  cart.forEach((item, index) => {
    const element = document.createElement("div");
    element.classList.add("cart-item");

    element.innerHTML = `
      ${item.image
        ? `<img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}">`
        : `<div class="product-thumb-placeholder">▧</div>`}

      <div class="cart-item-info">
        <h4>${escapeHtml(item.name)}</h4>
        <p>Tamanho: ${escapeHtml(item.size)}</p>

        <div class="quantity-control">
          <button class="quantity-minus" data-index="${index}" type="button">−</button>
          <span>${item.quantity}</span>
          <button class="quantity-plus" data-index="${index}" type="button">+</button>
        </div>

        <p>${formatMoney(item.price * item.quantity)}</p>
      </div>

      <button class="remove-item" data-index="${index}" type="button">×</button>
    `;

    cartItems.appendChild(element);
  });

  document.querySelectorAll(".remove-item").forEach((button) => {
    button.addEventListener("click", () => removeCartItem(Number(button.dataset.index)));
  });

  document.querySelectorAll(".quantity-plus").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.index);
      if (!cart[index]) return;
      cart[index].quantity += 1;
      saveCart();
    });
  });

  document.querySelectorAll(".quantity-minus").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.index);
      if (!cart[index]) return;

      cart[index].quantity -= 1;
      if (cart[index].quantity <= 0) cart.splice(index, 1);
      saveCart();
    });
  });

  if (cartTotal) cartTotal.textContent = formatMoney(calculateCartTotal());
}

function removeCartItem(index) {
  if (!cart[index]) return;
  cart.splice(index, 1);
  saveCart();
}

function openCart() {
  if (!cartElement || !cartOverlay) return;
  cartElement.classList.add("active");
  cartOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  if (!cartElement || !cartOverlay) return;
  cartElement.classList.remove("active");
  cartOverlay.classList.remove("active");
  document.body.style.overflow = "";
}

if (filtersContainer) {
  filtersContainer.addEventListener("click", (event) => {
    const button = event.target.closest(".filter");
    if (!button) return;

    activeFilter = button.dataset.filter;
    renderFilters();

    const filtered = activeFilter === "todos"
      ? products
      : products.filter((product) => product.category === activeFilter);

    renderProducts(filtered);
  });
}

function openSearch() {
  if (!searchOverlay) return;
  searchOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
  setTimeout(() => searchInput?.focus(), 100);
}

function closeSearch() {
  if (!searchOverlay) return;
  searchOverlay.classList.remove("active");
  if (searchInput) searchInput.value = "";
  if (searchResults) searchResults.innerHTML = "";
  document.body.style.overflow = "";
}

function searchProducts(term) {
  if (!searchResults) return;

  const normalizedTerm = term.toLowerCase().trim();
  searchResults.innerHTML = "";
  if (!normalizedTerm) return;

  const results = products.filter((product) =>
    (product.name || "").toLowerCase().includes(normalizedTerm) ||
    (product.category || "").toLowerCase().includes(normalizedTerm) ||
    (product.description || "").toLowerCase().includes(normalizedTerm)
  );

  if (!results.length) {
    searchResults.innerHTML = `<div class="search-result">Nenhum produto encontrado.</div>`;
    return;
  }

  results.forEach((product) => {
    const result = document.createElement("div");
    result.classList.add("search-result");
    result.innerHTML = `
      <strong>${escapeHtml(product.name)}</strong>
      <span>${formatMoney(product.price)}</span>
    `;

    result.addEventListener("click", () => {
      closeSearch();
      openProduct(product.id);
    });

    searchResults.appendChild(result);
  });
}

function checkoutWhatsApp() {
  if (!cart.length) {
    alert("Sua sacola está vazia.");
    return;
  }

  let message = "Olá! Quero fazer um pedido na LOBI 🖤\n\nMEU PEDIDO:\n\n";

  cart.forEach((item) => {
    message += `• ${item.name}\n`;
    message += `Tamanho: ${item.size}\n`;
    message += `Quantidade: ${item.quantity}\n`;
    message += `Valor: ${formatMoney(item.price * item.quantity)}\n\n`;
  });

  message += `TOTAL: ${formatMoney(calculateCartTotal())}\n\n`;
  message += "Gostaria de finalizar meu pedido.";

  window.open(
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
    "_blank"
  );
}

function toggleMenu() {
  nav?.classList.toggle("active");
}

document.querySelectorAll("#nav a").forEach((link) => {
  link.addEventListener("click", () => nav?.classList.remove("active"));
});

addCartButton?.addEventListener("click", addToCart);
closeProductModal?.addEventListener("click", closeProduct);
cartButton?.addEventListener("click", openCart);
closeCartButton?.addEventListener("click", closeCart);
cartOverlay?.addEventListener("click", closeCart);
checkoutButton?.addEventListener("click", checkoutWhatsApp);
searchButton?.addEventListener("click", openSearch);
closeSearchButton?.addEventListener("click", closeSearch);
menuButton?.addEventListener("click", toggleMenu);

searchInput?.addEventListener("input", (event) => searchProducts(event.target.value));

productModal?.addEventListener("click", (event) => {
  if (event.target === productModal) closeProduct();
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  closeProduct();
  closeCart();
  closeSearch();
  nav?.classList.remove("active");
});

document.addEventListener("error", (event) => {
  if (event.target.tagName === "IMG") {
    event.target.style.opacity = "0.25";
    event.target.alt = "Imagem indisponível";
  }
}, true);

async function init() {
  renderCart();
  await loadProducts();
}

init();
