/* =========================================================
   FRUTALES DEL NORTE
   JAVASCRIPT
========================================================= */


/* =========================================================
   CONFIGURACIÓN
========================================================= */


const WHATSAPP_NUMBER = "5493513851728";


/* =========================================================
   VARIABLES
========================================================= */

let cart = [];


/* =========================================================
   ELEMENTOS
========================================================= */

const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");

const openCartButton = document.getElementById("openCart");
const openCartNav = document.getElementById("openCartNav");
const openCartHero = document.getElementById("openCartHero");

const closeCartButton = document.getElementById("closeCart");

const checkoutButton = document.getElementById("checkoutButton");

const orderModal = document.getElementById("orderModal");
const closeModalButton = document.getElementById("closeModal");

const orderForm = document.getElementById("orderForm");

const orderSummaryItems =
  document.getElementById("orderSummaryItems");

const orderSummaryTotal =
  document.getElementById("orderSummaryTotal");

const formError =
  document.getElementById("formError");

const navToggle =
  document.getElementById("navToggle");

const mainNav =
  document.getElementById("mainNav");


/* =========================================================
   INICIALIZACIÓN
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  loadCart();

  updateCart();

  setupProducts();

  setupCategories();

  setupNavigation();

  setupCart();

  setupOrderForm();

  updateYear();

});


/* =========================================================
   PRODUCTOS
========================================================= */

function setupProducts() {

  const products =
    document.querySelectorAll(".product-card");


  products.forEach(product => {

    const plusButton =
      product.querySelector(".qty-plus");

    const minusButton =
      product.querySelector(".qty-minus");

    const quantityElement =
      product.querySelector(".qty-value");

    const addButton =
      product.querySelector(".btn--add");


    let quantity = 1;


    /* SUMAR */

    plusButton.addEventListener("click", () => {

      quantity++;

      quantityElement.textContent = quantity;

    });


    /* RESTAR */

    minusButton.addEventListener("click", () => {

      if (quantity > 1) {

        quantity--;

        quantityElement.textContent = quantity;

      }

    });


    /* AGREGAR AL CARRITO */

    addButton.addEventListener("click", () => {

      const name =
        product.dataset.name;

      const price =
        Number(product.dataset.price);


      addToCart(
        name,
        price,
        quantity
      );


      // Volvemos la cantidad a 1
      quantity = 1;

      quantityElement.textContent = 1;

    });

  });

}


/* =========================================================
   AGREGAR PRODUCTO
========================================================= */

function addToCart(name, price, quantity) {

  const existingProduct =
    cart.find(item => item.name === name);


  if (existingProduct) {

    existingProduct.quantity += quantity;

  } else {

    cart.push({

      name: name,

      price: price,

      quantity: quantity

    });

  }


  saveCart();

  updateCart();

  openCart();


  showAddMessage();

}


/* =========================================================
   ACTUALIZAR CARRITO
========================================================= */

function updateCart() {

  renderCart();

  updateCartCounters();

  updateCartTotal();

}


/* =========================================================
   MOSTRAR CARRITO
========================================================= */

function renderCart() {

  if (cart.length === 0) {

    cartItems.innerHTML = `

      <div class="cart-empty">

        <i class="fa-solid fa-basket-shopping"></i>

        <h3>Tu carrito está vacío</h3>

        <p>
          Agregá algunos productos para comenzar tu pedido.
        </p>

      </div>

    `;

    return;

  }


  cartItems.innerHTML = "";


  cart.forEach((item, index) => {

    const itemTotal =
      item.price * item.quantity;


    const element =
      document.createElement("div");

    element.className = "cart-item";


    element.innerHTML = `

      <div class="cart-item__image">
        🍎
      </div>

      <div>

        <h4>
          ${item.name}
        </h4>

        <div class="cart-item__price">
          ${formatPrice(itemTotal)}
        </div>

        <div class="cart-item__controls">

          <button
            data-action="minus"
            data-index="${index}">
            −
          </button>

          <span>
            ${item.quantity}
          </span>

          <button
            data-action="plus"
            data-index="${index}">
            +
          </button>

        </div>

        <button
          class="cart-item__remove"
          data-action="remove"
          data-index="${index}">

          Eliminar

        </button>

      </div>

      <strong>
        ${formatPrice(item.price)}
      </strong>

    `;


    cartItems.appendChild(element);

  });


  setupCartItemButtons();

}


/* =========================================================
   CONTROLES DEL CARRITO
========================================================= */

function setupCartItemButtons() {

  const buttons =
    cartItems.querySelectorAll("[data-action]");


  buttons.forEach(button => {

    button.addEventListener("click", () => {

      const action =
        button.dataset.action;

      const index =
        Number(button.dataset.index);


      if (action === "plus") {

        cart[index].quantity++;

      }


      if (action === "minus") {

        cart[index].quantity--;

        if (cart[index].quantity <= 0) {

          cart.splice(index, 1);

        }

      }


      if (action === "remove") {

        cart.splice(index, 1);

      }


      saveCart();

      updateCart();

    });

  });

}


/* =========================================================
   TOTAL
========================================================= */

function calculateTotal() {

  return cart.reduce(
    (total, item) => {

      return total +
        item.price * item.quantity;

    },
    0
  );

}


function updateCartTotal() {

  const total =
    calculateTotal();

  cartTotal.textContent =
    formatPrice(total);

}


/* =========================================================
   CONTADORES
========================================================= */

function updateCartCounters() {

  const counters =
    document.querySelectorAll(".cart-count");


  const quantity =
    cart.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );


  counters.forEach(counter => {

    counter.textContent = quantity;

  });

}


/* =========================================================
   ABRIR / CERRAR CARRITO
========================================================= */

function openCart() {

  cartDrawer.classList.add("active");

  cartOverlay.classList.add("active");

  document.body.style.overflow = "hidden";

}


function closeCart() {

  cartDrawer.classList.remove("active");

  cartOverlay.classList.remove("active");

  document.body.style.overflow = "";

}


function setupCart() {

  openCartButton.addEventListener(
    "click",
    openCart
  );


  openCartNav.addEventListener(
    "click",
    openCart
  );


  openCartHero.addEventListener(
    "click",
    openCart
  );


  closeCartButton.addEventListener(
    "click",
    closeCart
  );


  cartOverlay.addEventListener(
    "click",
    closeCart
  );

}


/* =========================================================
   CHECKOUT
========================================================= */

checkoutButton.addEventListener("click", () => {

  if (cart.length === 0) {

    alert(
      "Primero agregá al menos un producto al carrito."
    );

    return;

  }


  renderOrderSummary();

  orderModal.classList.add("active");

});


/* =========================================================
   RESUMEN DEL PEDIDO
========================================================= */

function renderOrderSummary() {

  orderSummaryItems.innerHTML = "";


  cart.forEach(item => {

    const element =
      document.createElement("div");

    element.className =
      "order-summary__item";


    element.innerHTML = `

      <span>
        ${item.quantity} × ${item.name}
      </span>

      <strong>
        ${formatPrice(
          item.price * item.quantity
        )}
      </strong>

    `;


    orderSummaryItems.appendChild(element);

  });


  orderSummaryTotal.textContent =
    formatPrice(calculateTotal());

}


/* =========================================================
   CERRAR MODAL
========================================================= */

closeModalButton.addEventListener(
  "click",
  closeOrderModal
);


orderModal.addEventListener(
  "click",
  event => {

    if (event.target === orderModal) {

      closeOrderModal();

    }

  }
);


function closeOrderModal() {

  orderModal.classList.remove("active");

}


/* =========================================================
   FORMULARIO
========================================================= */

function setupOrderForm() {

  orderForm.addEventListener(
    "submit",
    event => {

      event.preventDefault();


      const nombre =
        document.getElementById("nombre").value.trim();

      const telefono =
        document.getElementById("telefono").value.trim();

      const direccion =
        document.getElementById("direccion").value.trim();

      const metodoPago =
        document.getElementById("metodoPago").value;

      const notas =
       document.getElementById("notas").value.trim();


      formError.textContent = "";


      /* VALIDACIÓN */

      if (!nombre || !telefono || !direccion || !metodoPago) {

        formError.textContent =
          "Completá todos los campos obligatorios.";

        return;

      }


      /* CREAR MENSAJE */

      let message =
        "🍊 *NUEVO PEDIDO - FRUTALES DEL NORTE*%0A";

      message +=
        "--------------------------------%0A%0A";


      message +=
        "👤 *Cliente:* " +
        encodeURIComponent(nombre) +
        "%0A";


      message +=
        "📱 *Teléfono:* " +
        encodeURIComponent(telefono) +
        "%0A";


      message +=
      "📍 *Dirección:* " +
        encodeURIComponent(direccion) +
        "%0A";

      message +=
      "💳 *Método de pago:* " +
        encodeURIComponent(metodoPago) +
       "%0A%0A";


      message +=
        "🛒 *PRODUCTOS:*%0A";


      cart.forEach(item => {

        const subtotal =
          item.price * item.quantity;


        message +=
          "• " +
          encodeURIComponent(item.name) +
          " x" +
          item.quantity +
          " — " +
          encodeURIComponent(
            formatPrice(subtotal)
          ) +
          "%0A";

      });


      message +=
        "%0A💰 *TOTAL ESTIMADO:* " +
        encodeURIComponent(
          formatPrice(calculateTotal())
        );


      if (notas) {

        message +=
          "%0A%0A📝 *NOTAS:*%0A" +
          encodeURIComponent(notas);

      }


      message +=
        "%0A%0A¡Gracias! 🍊";


      /* ABRIR WHATSAPP */

      const whatsappURL =
        `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;


      window.open(
        whatsappURL,
        "_blank"
      );


      /* LIMPIAR */

      cart = [];

      saveCart();

      updateCart();

      orderForm.reset();

      closeOrderModal();

      closeCart();

    }
  );

}


/* =========================================================
   CATEGORÍAS
========================================================= */

function setupCategories() {

  const buttons =
    document.querySelectorAll(".tab-btn");


  const grids = {

    frutas:
      document.getElementById("grid-frutas"),

    verduras:
      document.getElementById("grid-verduras"),

    saludables:
      document.getElementById("grid-saludables")

  };


  buttons.forEach(button => {

    button.addEventListener("click", () => {

      const category =
        button.dataset.category;


      buttons.forEach(btn => {

        btn.classList.remove("active");

      });


      button.classList.add("active");


      Object.values(grids).forEach(grid => {

        grid.classList.add("hidden-grid");

      });


      grids[category]
        .classList.remove("hidden-grid");

    });

  });

}


/* =========================================================
   MENÚ MOBILE
========================================================= */

function setupNavigation() {

  navToggle.addEventListener(
    "click",
    () => {

      mainNav.classList.toggle("active");

    }
  );


  const links =
    mainNav.querySelectorAll("a");


  links.forEach(link => {

    link.addEventListener(
      "click",
      () => {

        mainNav.classList.remove("active");

      }
    );

  });

}


/* =========================================================
   GUARDAR CARRITO
========================================================= */

function saveCart() {

  localStorage.setItem(
    "frutalesDelNorteCart",
    JSON.stringify(cart)
  );

}


/* =========================================================
   CARGAR CARRITO
========================================================= */

function loadCart() {

  const savedCart =
    localStorage.getItem(
      "frutalesDelNorteCart"
    );


  if (savedCart) {

    try {

      cart =
        JSON.parse(savedCart);

    } catch {

      cart = [];

    }

  }

}


/* =========================================================
   FORMATO DE PRECIO
========================================================= */

function formatPrice(price) {

  return new Intl.NumberFormat(
    "es-AR",
    {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0
    }
  ).format(price);

}


/* =========================================================
   MENSAJE AL AGREGAR
========================================================= */

function showAddMessage() {

  const message =
    document.createElement("div");


  message.textContent =
    "✓ Producto agregado al carrito";


  message.style.position =
    "fixed";

  message.style.bottom =
    "100px";

  message.style.left =
    "50%";

  message.style.transform =
    "translateX(-50%)";

  message.style.background =
    "#3d8b45";

  message.style.color =
    "white";

  message.style.padding =
    "12px 20px";

  message.style.borderRadius =
    "50px";

  message.style.fontWeight =
    "700";

  message.style.zIndex =
    "3000";

  message.style.boxShadow =
    "0 10px 30px rgba(0,0,0,.15)";


  document.body.appendChild(message);


  setTimeout(() => {

    message.remove();

  }, 1800);

}


/* =========================================================
   AÑO AUTOMÁTICO
========================================================= */

function updateYear() {

  const year =
    document.getElementById("year");


  if (year) {

    year.textContent =
      new Date().getFullYear();

  }

}

/* =========================
   ANIMACIÓN DE BENEFICIOS
========================= */

const featureCards = document.querySelectorAll(".feature-card");

const featureObserver = new IntersectionObserver(
  (entries) => {

    entries.forEach((entry) => {

      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }

    });

  },
  {
    threshold: 0.2
  }
);


featureCards.forEach((card) => {
  featureObserver.observe(card);
});
