// =================================================================
// Archivo: script.js
// Descripción: Lógica para el carrito de compras y efectos dinámicos
// =================================================================

// Productos: edítalos si quieres (precios en COP)
const products = [
  {
    id: "eco-100",
    name: "Fogón Tradicional",
    price: 450000,
    img: "https://images.unsplash.com/photo-1606787364410-8e4b3d87aa94"
  },
  {
    id: "eco-200",
    name: "Fogón Familiar",
    price: 650000,
    img: "https://images.unsplash.com/photo-1586201375761-83865001e31b"
  },
  {
    id: "eco-300",
    name: "Fogón Industrial",
    price: 1200000,
    img: "https://images.unsplash.com/photo-1603422553494-3f0e8e3dabe4"
  }
];

// Función para formato de moneda (COP)
const formatCurrency = (n) => n.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });

// =================================================================
// Variables y Elementos del DOM
// =================================================================
let cart = JSON.parse(localStorage.getItem('ecofogones_cart') || '[]');

const btnCarrito = document.getElementById('btn-carrito');
const carritoElement = document.getElementById('carrito');
const cerrarCarrito = document.getElementById('cerrar-carrito');
const carritoOverlay = document.getElementById('carrito-overlay');
const listaCarrito = document.getElementById('lista-carrito');
const totalCarritoEl = document.getElementById('total-carrito');
const cantidadProductosEl = document.getElementById('cantidad-productos');
const contadorCarrito = document.getElementById('contador-carrito');
const carritoVacio = document.getElementById('carrito-vacio');
const vaciarCarritoBtn = document.getElementById('vaciar-carrito');
const finalizarPedidoBtn = document.getElementById('finalizar-pedido');

// =================================================================
// Funciones de Carrito
// =================================================================
function saveCart() {
  localStorage.setItem('ecofogones_cart', JSON.stringify(cart));
  updateCartDisplay();
}

function updateCartDisplay() {
  listaCarrito.innerHTML = '';

  let total = 0;
  let totalItems = 0;

  if (cart.length === 0) {
    carritoVacio.style.display = 'block';
  } else {
    carritoVacio.style.display = 'none';

    cart.forEach((item, index) => {
      const product = products.find(p => p.id === item.id);
      if (!product) return;

      const subtotalItem = product.price * item.qty;
      total += subtotalItem;
      totalItems += item.qty;

      const itemEl = document.createElement('div');
      itemEl.className = 'carrito-item';
      itemEl.innerHTML = `
        <img src="${product.img}" alt="${product.name}">
        <div class="carrito-item-info">
          <div class="carrito-item-nombre">${product.name}</div>
          <div class="carrito-item-precio">${formatCurrency(product.price)}</div>
          <div class="carrito-item-cantidad">
            <button class="cantidad-btn" onclick="changeQuantity('${item.id}', -1)">-</button>
            <span class="cantidad-numero">${item.qty}</span>
            <button class="cantidad-btn" onclick="changeQuantity('${item.id}', 1)">+</button>
          </div>
        </div>
        <button class="eliminar-item" onclick="removeItem('${item.id}')">
          <i class="fas fa-trash"></i>
        </button>
      `;
      listaCarrito.appendChild(itemEl);
    });
  }

  totalCarritoEl.textContent = formatCurrency(total);
  cantidadProductosEl.textContent = totalItems;
  contadorCarrito.textContent = totalItems;
  contadorCarrito.style.display = totalItems > 0 ? 'flex' : 'none';
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  const existingItem = cart.find(item => item.id === id);
  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({ id: product.id, qty: 1 });
  }

  saveCart();
}

function changeQuantity(id, change) {
  const item = cart.find(i => i.id === id);
  if (!item) return;

  item.qty += change;
  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== id);
  }

  saveCart();
}

function removeItem(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
}

function openCart() {
  carritoElement.classList.add('carrito-visible');
  carritoOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  carritoElement.classList.remove('carrito-visible');
  carritoOverlay.classList.remove('active');
  document.body.style.overflow = 'auto';
}

function emptyCart() {
  if (cart.length === 0) return;
  if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
    cart = [];
    saveCart();
  }
}

function checkout() {
  if (cart.length === 0) {
    alert('Tu carrito está vacío. Agrega productos para continuar.');
    return;
  }

  let message = '¡Hola! Me interesa hacer el siguiente pedido de Ecofogones:%0A%0A';
  let total = 0;

  cart.forEach(item => {
    const product = products.find(p => p.id === item.id);
    if (product) {
      const subtotalItem = product.price * item.qty;
      total += subtotalItem;
      message += `• ${product.name}%0A`;
      message += `  Cantidad: ${item.qty}%0A`;
      message += `  Subtotal: ${formatCurrency(subtotalItem)}%0A%0A`;
    }
  });

  message += `💰 *TOTAL: ${formatCurrency(total)}*%0A%0A`;
  message += '¿Podrían confirmarme la disponibilidad y los tiempos de entrega?%0A%0A¡Gracias!';

  const urlWhatsApp = `https://wa.me/573148673011?text=${encodeURIComponent(message)}`;
  window.open(urlWhatsApp, '_blank');
}

// =================================================================
// Eventos y Inicialización
// =================================================================
btnCarrito.addEventListener('click', openCart);
cerrarCarrito.addEventListener('click', closeCart);
carritoOverlay.addEventListener('click', closeCart);
vaciarCarritoBtn.addEventListener('click', emptyCart);
finalizarPedidoBtn.addEventListener('click', checkout);

// Añadir productos al carrito
document.querySelectorAll('.agregar-carrito').forEach(button => {
  button.addEventListener('click', () => {
    const id = button.dataset.id;
    addToCart(id);
  });
});

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  updateCartDisplay();
});
