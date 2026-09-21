/* =========================================================
   LOBI LIFESTYLE
   SCRIPT.JS COMPLETO
   ========================================================= */


/* =========================================================
   1. CONFIGURAÇÕES DA LOJA
   ========================================================= */

// Troque pelo WhatsApp real da LOBI.
// Formato: 55 + DDD + número
// Exemplo: 5583999999999

const WHATSAPP_NUMBER = "5583999999999";


/* =========================================================
   2. PRODUTOS
   Produtos temporários para teste do catálogo
   ========================================================= */

const products = [

    {
        id: 1,

        name: "Nike Sportswear Club",

        price: 129.90,

        category: "camisetas",

        image: "assets/produtos/nike-camiseta-teste.webp",

        description:
            "Camiseta masculina Nike Sportswear. Produto utilizado temporariamente para demonstração do catálogo da LOBI.",

        sizes: [
            "P",
            "M",
            "G",
            "GG"
        ],

        tag: "NOVO"
    },


    {
        id: 2,

        name: "Adidas Essentials",

        price: 299.90,

        category: "moletons",

        image: "assets/produtos/adidas-moletom-teste.webp",

        description:
            "Moletom masculino Adidas Essentials. Produto utilizado temporariamente para demonstração do catálogo da LOBI.",

        sizes: [
            "P",
            "M",
            "G",
            "GG"
        ],

        tag: "DESTAQUE"
    },


    {
        id: 3,

        name: "Nike Air Force 1 '07",

        price: 699.90,

        category: "tenis",

        image: "assets/produtos/nike-air-force-teste.webp",

        description:
            "Tênis Nike Air Force 1 '07. Produto utilizado temporariamente para demonstração do catálogo da LOBI.",

        sizes: [
            "38",
            "39",
            "40",
            "41",
            "42",
            "43"
        ],

        tag: "NOVO"
    }

];


/* =========================================================
   3. ESTADO DA LOJA
   ========================================================= */

let cart =
    JSON.parse(
        localStorage.getItem("lobiCart")
    ) || [];


let selectedProduct = null;

let selectedSize = null;


/* =========================================================
   4. ELEMENTOS
   ========================================================= */

const productsGrid =
    document.querySelector("#productsGrid");


/* PRODUTO */

const productModal =
    document.querySelector("#productModal");

const closeProductModal =
    document.querySelector("#closeProductModal");

const modalImage =
    document.querySelector("#modalImage");

const modalName =
    document.querySelector("#modalName");

const modalPrice =
    document.querySelector("#modalPrice");

const modalDescription =
    document.querySelector("#modalDescription");

const sizesContainer =
    document.querySelector("#sizes");

const addCartButton =
    document.querySelector("#addCart");


/* CARRINHO */

const cartElement =
    document.querySelector("#cart");

const cartOverlay =
    document.querySelector("#cartOverlay");

const cartItems =
    document.querySelector("#cartItems");

const cartCount =
    document.querySelector("#cartCount");

const cartTotal =
    document.querySelector("#cartTotal");

const cartEmpty =
    document.querySelector("#cartEmpty");

const cartFooter =
    document.querySelector("#cartFooter");

const cartButton =
    document.querySelector("#cartButton");

const closeCartButton =
    document.querySelector("#closeCart");

const checkoutButton =
    document.querySelector("#checkoutButton");


/* PESQUISA */

const searchOverlay =
    document.querySelector("#searchOverlay");

const searchInput =
    document.querySelector("#searchInput");

const searchResults =
    document.querySelector("#searchResults");

const searchButton =
    document.querySelector("#searchButton");

const closeSearchButton =
    document.querySelector("#closeSearch");


/* MENU */

const menuButton =
    document.querySelector("#menuButton");

const nav =
    document.querySelector("#nav");


/* =========================================================
   5. FORMATAR PREÇO
   ========================================================= */

function formatMoney(value) {

    return value.toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}


/* =========================================================
   6. RENDERIZAR PRODUTOS
   ========================================================= */

function renderProducts(list = products) {

    if (!productsGrid) return;


    productsGrid.innerHTML = "";


    if (list.length === 0) {

        productsGrid.innerHTML = `

            <div class="no-products">

                <p>
                    Nenhum produto encontrado.
                </p>

            </div>

        `;

        return;
    }


    list.forEach(product => {

        const card =
            document.createElement("article");


        card.classList.add(
            "product-card"
        );


        card.innerHTML = `

            <div class="product-image">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                    loading="lazy"
                >

                ${
                    product.tag
                    ?
                    `
                        <span class="product-tag">
                            ${product.tag}
                        </span>
                    `
                    :
                    ""
                }

            </div>


            <div class="product-info">

                <h3>
                    ${product.name}
                </h3>

                <p>
                    ${formatMoney(product.price)}
                </p>

            </div>

        `;


        card.addEventListener(
            "click",
            () => {

                openProduct(
                    product.id
                );

            }
        );


        productsGrid.appendChild(
            card
        );

    });

}


/* =========================================================
   7. ABRIR PRODUTO
   ========================================================= */

function openProduct(id) {

    selectedProduct =
        products.find(
            product =>
                product.id === id
        );


    if (!selectedProduct) {
        return;
    }


    selectedSize = null;


    modalImage.src =
        selectedProduct.image;


    modalImage.alt =
        selectedProduct.name;


    modalName.textContent =
        selectedProduct.name;


    modalPrice.textContent =
        formatMoney(
            selectedProduct.price
        );


    modalDescription.textContent =
        selectedProduct.description;


    renderSizes();


    productModal.classList.add(
        "active"
    );


    document.body.style.overflow =
        "hidden";

}


/* =========================================================
   8. FECHAR PRODUTO
   ========================================================= */

function closeProduct() {

    if (!productModal) return;


    productModal.classList.remove(
        "active"
    );


    selectedProduct = null;

    selectedSize = null;


    document.body.style.overflow =
        "";

}


/* =========================================================
   9. TAMANHOS
   ========================================================= */

function renderSizes() {

    if (
        !sizesContainer ||
        !selectedProduct
    ) {
        return;
    }


    sizesContainer.innerHTML = "";


    selectedProduct.sizes.forEach(
        size => {

            const button =
                document.createElement(
                    "button"
                );


            button.classList.add(
                "size"
            );


            button.type =
                "button";


            button.textContent =
                size;


            button.addEventListener(
                "click",
                () => {

                    selectedSize =
                        size;


                    document
                        .querySelectorAll(
                            ".size"
                        )
                        .forEach(
                            item => {

                                item.classList.remove(
                                    "active"
                                );

                            }
                        );


                    button.classList.add(
                        "active"
                    );

                }
            );


            sizesContainer.appendChild(
                button
            );

        }
    );

}


/* =========================================================
   10. ADICIONAR AO CARRINHO
   ========================================================= */

function addToCart() {

    if (!selectedProduct) {
        return;
    }


    if (!selectedSize) {

        alert(
            "Escolha um tamanho antes de adicionar à sacola."
        );

        return;
    }


    const existingItem =
        cart.find(
            item =>

                item.id ===
                    selectedProduct.id &&

                item.size ===
                    selectedSize

        );


    if (existingItem) {

        existingItem.quantity += 1;

    }

    else {

        cart.push({

            id:
                selectedProduct.id,

            name:
                selectedProduct.name,

            price:
                selectedProduct.price,

            image:
                selectedProduct.image,

            size:
                selectedSize,

            quantity: 1

        });

    }


    saveCart();

    closeProduct();

    openCart();

}


/* =========================================================
   11. SALVAR CARRINHO
   ========================================================= */

function saveCart() {

    localStorage.setItem(
        "lobiCart",
        JSON.stringify(cart)
    );


    renderCart();

}


/* =========================================================
   12. CALCULAR TOTAL
   ========================================================= */

function calculateCartTotal() {

    return cart.reduce(
        (total, item) => {

            return (
                total +
                item.price *
                item.quantity
            );

        },
        0
    );

}


/* =========================================================
   13. RENDERIZAR CARRINHO
   ========================================================= */

function renderCart() {

    if (!cartItems) return;


    cartItems.innerHTML = "";


    const totalQuantity =
        cart.reduce(
            (total, item) => {

                return (
                    total +
                    item.quantity
                );

            },
            0
        );


    if (cartCount) {

        cartCount.textContent =
            totalQuantity;

    }


    /* SACOLA VAZIA */

    if (cart.length === 0) {

        if (cartEmpty) {

            cartEmpty.style.display =
                "flex";

        }


        if (cartFooter) {

            cartFooter.style.display =
                "none";

        }


        return;
    }


    if (cartEmpty) {

        cartEmpty.style.display =
            "none";

    }


    if (cartFooter) {

        cartFooter.style.display =
            "block";

    }


    /* ITENS */

    cart.forEach(
        (item, index) => {

            const element =
                document.createElement(
                    "div"
                );


            element.classList.add(
                "cart-item"
            );


            element.innerHTML = `

                <img
                    src="${item.image}"
                    alt="${item.name}"
                >


                <div class="cart-item-info">

                    <h4>
                        ${item.name}
                    </h4>


                    <p>
                        Tamanho:
                        ${item.size}
                    </p>


                    <div class="quantity-control">

                        <button
                            class="quantity-minus"
                            data-index="${index}"
                            type="button"
                            aria-label="Diminuir quantidade"
                        >
                            −
                        </button>


                        <span>
                            ${item.quantity}
                        </span>


                        <button
                            class="quantity-plus"
                            data-index="${index}"
                            type="button"
                            aria-label="Aumentar quantidade"
                        >
                            +
                        </button>

                    </div>


                    <p>
                        ${formatMoney(
                            item.price *
                            item.quantity
                        )}
                    </p>

                </div>


                <button
                    class="remove-item"
                    data-index="${index}"
                    type="button"
                    aria-label="Remover produto"
                >
                    ×
                </button>

            `;


            cartItems.appendChild(
                element
            );

        }
    );


    /* REMOVER */

    document
        .querySelectorAll(
            ".remove-item"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const index =
                            Number(
                                button.dataset.index
                            );


                        removeCartItem(
                            index
                        );

                    }
                );

            }
        );


    /* AUMENTAR */

    document
        .querySelectorAll(
            ".quantity-plus"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const index =
                            Number(
                                button.dataset.index
                            );


                        if (!cart[index]) {
                            return;
                        }


                        cart[index]
                            .quantity += 1;


                        saveCart();

                    }
                );

            }
        );


    /* DIMINUIR */

    document
        .querySelectorAll(
            ".quantity-minus"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const index =
                            Number(
                                button.dataset.index
                            );


                        if (!cart[index]) {
                            return;
                        }


                        cart[index]
                            .quantity -= 1;


                        if (
                            cart[index]
                                .quantity <= 0
                        ) {

                            cart.splice(
                                index,
                                1
                            );

                        }


                        saveCart();

                    }
                );

            }
        );


    /* TOTAL */

    if (cartTotal) {

        cartTotal.textContent =
            formatMoney(
                calculateCartTotal()
            );

    }

}


/* =========================================================
   14. REMOVER ITEM
   ========================================================= */

function removeCartItem(index) {

    if (!cart[index]) {
        return;
    }


    cart.splice(
        index,
        1
    );


    saveCart();

}


/* =========================================================
   15. ABRIR CARRINHO
   ========================================================= */

function openCart() {

    if (
        !cartElement ||
        !cartOverlay
    ) {
        return;
    }


    cartElement.classList.add(
        "active"
    );


    cartOverlay.classList.add(
        "active"
    );


    document.body.style.overflow =
        "hidden";

}


/* =========================================================
   16. FECHAR CARRINHO
   ========================================================= */

function closeCart() {

    if (
        !cartElement ||
        !cartOverlay
    ) {
        return;
    }


    cartElement.classList.remove(
        "active"
    );


    cartOverlay.classList.remove(
        "active"
    );


    document.body.style.overflow =
        "";

}


/* =========================================================
   17. FILTROS
   ========================================================= */

const filterButtons =
    document.querySelectorAll(
        ".filter"
    );


filterButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                filterButtons.forEach(
                    item => {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                const filter =
                    button.dataset.filter;


                if (
                    filter === "todos"
                ) {

                    renderProducts(
                        products
                    );

                    return;

                }


                const filtered =
                    products.filter(
                        product =>

                            product.category ===
                            filter
                    );


                renderProducts(
                    filtered
                );

            }
        );

    }
);


/* =========================================================
   18. ABRIR PESQUISA
   ========================================================= */

function openSearch() {

    if (!searchOverlay) {
        return;
    }


    searchOverlay.classList.add(
        "active"
    );


    document.body.style.overflow =
        "hidden";


    setTimeout(
        () => {

            if (searchInput) {

                searchInput.focus();

            }

        },
        100
    );

}


/* =========================================================
   19. FECHAR PESQUISA
   ========================================================= */

function closeSearch() {

    if (!searchOverlay) {
        return;
    }


    searchOverlay.classList.remove(
        "active"
    );


    if (searchInput) {

        searchInput.value = "";

    }


    if (searchResults) {

        searchResults.innerHTML = "";

    }


    document.body.style.overflow =
        "";

}


/* =========================================================
   20. PESQUISAR PRODUTOS
   ========================================================= */

function searchProducts(term) {

    if (!searchResults) {
        return;
    }


    const normalizedTerm =
        term
            .toLowerCase()
            .trim();


    searchResults.innerHTML =
        "";


    if (!normalizedTerm) {
        return;
    }


    const results =
        products.filter(
            product => {

                const name =
                    product.name
                        .toLowerCase();


                const category =
                    product.category
                        .toLowerCase();


                const description =
                    product.description
                        .toLowerCase();


                return (

                    name.includes(
                        normalizedTerm
                    )

                    ||

                    category.includes(
                        normalizedTerm
                    )

                    ||

                    description.includes(
                        normalizedTerm
                    )

                );

            }
        );


    if (results.length === 0) {

        searchResults.innerHTML = `

            <div class="search-result">

                Nenhum produto encontrado.

            </div>

        `;

        return;
    }


    results.forEach(
        product => {

            const result =
                document.createElement(
                    "div"
                );


            result.classList.add(
                "search-result"
            );


            result.innerHTML = `

                <strong>
                    ${product.name}
                </strong>

                <span>
                    ${formatMoney(
                        product.price
                    )}
                </span>

            `;


            result.addEventListener(
                "click",
                () => {

                    closeSearch();

                    openProduct(
                        product.id
                    );

                }
            );


            searchResults.appendChild(
                result
            );

        }
    );

}


/* =========================================================
   21. CHECKOUT WHATSAPP
   ========================================================= */

function checkoutWhatsApp() {

    if (cart.length === 0) {

        alert(
            "Sua sacola está vazia."
        );

        return;
    }


    let message =
        "Olá! Quero fazer um pedido na LOBI 🖤\n\n";


    message +=
        "MEU PEDIDO:\n\n";


    cart.forEach(
        item => {

            message +=
                `• ${item.name}\n`;


            message +=
                `Tamanho: ${item.size}\n`;


            message +=
                `Quantidade: ${item.quantity}\n`;


            message +=
                `Valor: ${formatMoney(
                    item.price *
                    item.quantity
                )}\n\n`;

        }
    );


    const total =
        calculateCartTotal();


    message +=
        `TOTAL: ${formatMoney(total)}\n\n`;


    message +=
        "Gostaria de finalizar meu pedido.";


    const encodedMessage =
        encodeURIComponent(
            message
        );


    const whatsappURL =
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;


    window.open(
        whatsappURL,
        "_blank"
    );

}


/* =========================================================
   22. MENU MOBILE
   ========================================================= */

function toggleMenu() {

    if (!nav) return;


    nav.classList.toggle(
        "active"
    );

}


/* =========================================================
   23. FECHAR MENU AO CLICAR
   ========================================================= */

document
    .querySelectorAll(
        "#nav a"
    )
    .forEach(
        link => {

            link.addEventListener(
                "click",
                () => {

                    if (nav) {

                        nav.classList.remove(
                            "active"
                        );

                    }

                }
            );

        }
    );


/* =========================================================
   24. EVENTOS DO PRODUTO
   ========================================================= */

if (addCartButton) {

    addCartButton.addEventListener(
        "click",
        addToCart
    );

}


if (closeProductModal) {

    closeProductModal.addEventListener(
        "click",
        closeProduct
    );

}


if (productModal) {

    productModal.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                productModal
            ) {

                closeProduct();

            }

        }
    );

}


/* =========================================================
   25. EVENTOS CARRINHO
   ========================================================= */

if (cartButton) {

    cartButton.addEventListener(
        "click",
        openCart
    );

}


if (closeCartButton) {

    closeCartButton.addEventListener(
        "click",
        closeCart
    );

}


if (cartOverlay) {

    cartOverlay.addEventListener(
        "click",
        closeCart
    );

}


if (checkoutButton) {

    checkoutButton.addEventListener(
        "click",
        checkoutWhatsApp
    );

}


/* =========================================================
   26. EVENTOS PESQUISA
   ========================================================= */

if (searchButton) {

    searchButton.addEventListener(
        "click",
        openSearch
    );

}


if (closeSearchButton) {

    closeSearchButton.addEventListener(
        "click",
        closeSearch
    );

}


if (searchInput) {

    searchInput.addEventListener(
        "input",
        event => {

            searchProducts(
                event.target.value
            );

        }
    );

}


/* =========================================================
   27. MENU MOBILE
   ========================================================= */

if (menuButton) {

    menuButton.addEventListener(
        "click",
        toggleMenu
    );

}


/* =========================================================
   28. ESC
   ========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key !== "Escape"
        ) {
            return;
        }


        if (
            productModal &&
            productModal.classList.contains(
                "active"
            )
        ) {

            closeProduct();

        }


        if (
            cartElement &&
            cartElement.classList.contains(
                "active"
            )
        ) {

            closeCart();

        }


        if (
            searchOverlay &&
            searchOverlay.classList.contains(
                "active"
            )
        ) {

            closeSearch();

        }


        if (nav) {

            nav.classList.remove(
                "active"
            );

        }

    }
);


/* =========================================================
   29. FALLBACK PARA IMAGEM
   ========================================================= */

document.addEventListener(
    "error",

    event => {

        if (
            event.target.tagName ===
            "IMG"
        ) {

            event.target.style.opacity =
                "0.25";


            event.target.alt =
                "Imagem indisponível";

        }

    },

    true
);


/* =========================================================
   30. INICIALIZAÇÃO
   ========================================================= */

function init() {

    renderProducts(
        products
    );


    renderCart();

}


init();