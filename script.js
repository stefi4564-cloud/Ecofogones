// ============================================
// PRODUCTOS Y CARRITO DE COMPRAS COMPLETO
// ============================================

// Base de datos de productos
const products = [
    {
        id: "eco-100",
        name: "Fogón Tradicional",
        price: 450000,
        img: "fogontradicional1.png",
        description: "Perfecto para el hogar, eficiente y económico. Ideal para familias de 3-5 personas. Construcción robusta en acero inoxidable.",
        badge: "Más Popular",
        features: ["Acero Inoxidable", "Familiar", "Garantía 2 años"],
        originalPrice: 500000
    },
    {
        id: "eco-200",
        name: "Fogón de 2 boquillas",
        price: 650000,
        img: "fogonde2boquillas.png",
        description: "Mayor capacidad para familias grandes de 6-10 personas. Diseño robusto y duradero con tecnología de combustión mejorada.",
        badge: "Recomendado",
        features: ["Gran Capacidad", "Eco-friendly", "Garantía 3 años"],
        originalPrice: 750000
    },
    {
        id: "eco-300",
        name: "Fogón de 3 boquillas",
        price: 1200000,
        img: "fogonde3boquillas.png",
        description: "Para restaurantes y cocinas comerciales. Máxima eficiencia y durabilidad. Construcción industrial con materiales de primera calidad.",
        badge: "Premium",
        features: ["Uso Comercial", "Alta Durabilidad", "Garantía 5 años"],
        originalPrice: 1400000
    },
    {
        id: "eco-400",
        name: "Plato para arado",
        price: 120000,
        img: "platoaradofogon.png",
        description: "Accesorio ideal para usar con nuestros fogones, perfecto para preparar comidas en plancha. Compatible con todos los modelos.",
        badge: "Nuevo",
        features: ["Acero al Carbono", "Versátil", "Fácil de Limpiar"],
        originalPrice: 140000
    }
];

// Códigos de descuento disponibles
const discountCodes = {
    'ECOFOGON10': { type: 'percentage', value: 0.10, description: '10% de descuento en tu compra.' },
    'AHORRO50000': { type: 'fixed', value: 50000, description: '$50.000 de descuento en tu compra.' }
};

let appliedDiscount = 0;
let isDiscountApplied = false;

// Función para formato de moneda (COP)
const formatCurrency = (n) => n.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });

// Variables del carrito
let cart = JSON.parse(localStorage.getItem('ecofogones_cart') || '[]');
let appliedDiscountCode = localStorage.getItem('ecofogones_discount_code') || '';
let appliedDiscountValue = parseFloat(localStorage.getItem('ecofogones_discount_value')) || 0;
let isDiscountAppliedFlag = localStorage.getItem('ecofogones_is_discount_applied') === 'true';

// Elementos DOM
const btnCarrito = document.getElementById('btn-carrito');
const carritoElement = document.getElementById('carrito');
const cerrarCarrito = document.getElementById('cerrar-carrito');
const carritoOverlay = document.getElementById('carrito-overlay');
const listaCarrito = document.getElementById('lista-carrito');
const totalCarritoEl = document.getElementById('total-carrito');
const subtotalCarritoEl = document.getElementById('subtotal-carrito');
const descuentoValorEl = document.getElementById('descuento-valor');
const descuentoPorcentajeEl = document.getElementById('descuento-porcentaje');
const contadorCarrito = document.getElementById('contador-carrito');
const carritoVacio = document.getElementById('carrito-vacio');
const vaciarCarritoBtn = document.getElementById('vaciar-carrito');
const finalizarPedidoBtn = document.getElementById('finalizar-pedido');
const cuponInput = document.getElementById('cupon-input');
const aplicarCuponBtn = document.getElementById('aplicar-cupon-btn');
const contactForm = document.getElementById('contact-form');
const faqQuestions = document.querySelectorAll('.faq-question');

if (isDiscountAppliedFlag && appliedDiscountCode) {
    appliedDiscount = appliedDiscountValue;
    isDiscountApplied = true;
    if (cuponInput) cuponInput.value = appliedDiscountCode;
}

// ============================================
// FUNCIONES DEL CARRITO
// ============================================

function saveCart() {
    localStorage.setItem('ecofogones_cart', JSON.stringify(cart));
    localStorage.setItem('ecofogones_discount_code', isDiscountApplied ? cuponInput.value : '');
    localStorage.setItem('ecofogones_discount_value', appliedDiscount);
    localStorage.setItem('ecofogones_is_discount_applied', isDiscountApplied);
    updateCartDisplay();
}

function updateCartDisplay() {
    if (!listaCarrito) return;
    listaCarrito.innerHTML = '';
    let subtotal = 0;
    let totalItems = 0;

    if (cart.length === 0) {
        if (carritoVacio) carritoVacio.style.display = 'block';
        if (vaciarCarritoBtn) vaciarCarritoBtn.style.display = 'none';
        if (finalizarPedidoBtn) finalizarPedidoBtn.style.display = 'none';
    } else {
        if (carritoVacio) carritoVacio.style.display = 'none';
        if (vaciarCarritoBtn) vaciarCarritoBtn.style.display = 'block';
        if (finalizarPedidoBtn) finalizarPedidoBtn.style.display = 'block';

        cart.forEach((item) => {
            const product = products.find(p => p.id === item.id);
            if (!product) return;

            const subtotalItem = product.price * item.qty;
            subtotal += subtotalItem;
            totalItems += item.qty;

            const itemEl = document.createElement('div');
            itemEl.className = 'carrito-item';
            itemEl.innerHTML = `
                <img src="${product.img}" alt="${product.name}">
                <div class="carrito-item-info">
                    <div class="carrito-item-nombre">${product.name}</div>
                    <div class="carrito-item-precio">${formatCurrency(product.price)}</div>
                    <div class="carrito-item-cantidad">
                        <button class="cantidad-btn" data-id="${item.id}" data-change="-1">-</button>
                        <span class="cantidad-numero">${item.qty}</span>
                        <button class="cantidad-btn" data-id="${item.id}" data-change="1">+</button>
                    </div>
                </div>
                <button class="eliminar-item" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            listaCarrito.appendChild(itemEl);
        });
    }

    let finalTotal = subtotal;
    if (isDiscountApplied) {
        if (discountCodes[appliedDiscountCode].type === 'percentage') {
            appliedDiscount = subtotal * discountCodes[appliedDiscountCode].value;
        }
        finalTotal = subtotal - appliedDiscount;
    }

    if (subtotalCarritoEl) subtotalCarritoEl.textContent = formatCurrency(subtotal);
    if (descuentoValorEl) descuentoValorEl.textContent = formatCurrency(appliedDiscount);
    if (descuentoPorcentajeEl) {
        if (isDiscountApplied && discountCodes[appliedDiscountCode].type === 'percentage') {
            descuentoPorcentajeEl.textContent = `${discountCodes[appliedDiscountCode].value * 100}%`;
        } else {
            descuentoPorcentajeEl.textContent = '0%';
        }
    }
    if (totalCarritoEl) totalCarritoEl.textContent = formatCurrency(finalTotal < 0 ? 0 : finalTotal);
    if (contadorCarrito) {
        contadorCarrito.textContent = totalItems;
        contadorCarrito.style.display = totalItems > 0 ? 'flex' : 'none';
    }
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

    const cartButton = document.getElementById('btn-carrito');
    if (cartButton) {
        cartButton.classList.add('producto-agregado');
        setTimeout(() => cartButton.classList.remove('producto-agregado'), 600);
    }
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

function applyDiscountCode() {
    const code = cuponInput.value.toUpperCase();
    if (discountCodes[code]) {
        const subtotal = cart.reduce((sum, item) => sum + products.find(p => p.id === item.id).price * item.qty, 0);
        if (discountCodes[code].type === 'percentage') {
            appliedDiscount = subtotal * discountCodes[code].value;
        } else {
            appliedDiscount = discountCodes[code].value;
        }
        isDiscountApplied = true;
        alert(`Cupón "${code}" aplicado correctamente: ${discountCodes[code].description}`);
        cuponInput.disabled = true;
        aplicarCuponBtn.disabled = true;
    } else {
        appliedDiscount = 0;
        isDiscountApplied = false;
        alert('Cupón no válido. Por favor, revisa el código.');
        cuponInput.disabled = false;
        aplicarCuponBtn.disabled = false;
    }
    saveCart();
}

function openCart() {
    if (carritoElement) carritoElement.classList.add('carrito-visible');
    if (carritoOverlay) carritoOverlay.classList.add('active');
    document.body.classList.add('no-scroll');
}

function closeCart() {
    if (carritoElement) carritoElement.classList.remove('carrito-visible');
    if (carritoOverlay) carritoOverlay.classList.remove('active');
    document.body.classList.remove('no-scroll');
}

function emptyCart() {
    if (cart.length === 0) return;
    if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
        cart = [];
        appliedDiscount = 0;
        isDiscountApplied = false;
        if (cuponInput) {
            cuponInput.value = '';
            cuponInput.disabled = false;
        }
        if (aplicarCuponBtn) aplicarCuponBtn.disabled = false;
        saveCart();
    }
}

function finalizeOrder() {
    if (cart.length === 0) {
        alert('El carrito está vacío. Agrega productos para finalizar tu pedido.');
        return;
    }
    let message = "Hola, me gustaría hacer un pedido de los siguientes productos:\n\n";
    let subtotal = 0;
    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (product) {
            message += `- ${item.qty}x ${product.name} (${formatCurrency(product.price * item.qty)})\n`;
            subtotal += product.price * item.qty;
        }
    });
    message += `\nSubtotal: ${formatCurrency(subtotal)}`;
    if (isDiscountApplied) {
        message += `\nDescuento: -${formatCurrency(appliedDiscount)}`;
        message += `\nTotal Final: ${formatCurrency(subtotal - appliedDiscount)}`;
    }
    message += `\n\n¿Podrían ayudarme a coordinar el envío?`;

    const whatsappUrl = `https://wa.me/573148673011?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// ============================================
// FUNCIONALIDADES ADICIONALES
// ============================================

// Función para renderizar los productos en la página
function renderProducts() {
    const productGrid = document.querySelector('.productos-grid');
    if (!productGrid) return;

    productGrid.innerHTML = ''; // Limpiar el contenedor antes de renderizar

    products.forEach(product => {
        const featuresHtml = product.features.map(feature => `<span class="caracteristica">${feature}</span>`).join('');
        const productCard = document.createElement('div');
        productCard.className = 'producto fade-in';
        productCard.innerHTML = `
            <div class="producto-imagen">
                <img src="${product.img}" alt="${product.name}" />
                <div class="producto-badge">${product.badge}</div>
            </div>
            <div class="producto-info">
                <h3>${product.name}</h3>
                <p class="producto-descripcion">${product.description}</p>
                <div class="producto-caracteristicas">
                    ${featuresHtml}
                </div>
                <div class="producto-precio-container">
                    <div>
                        <div class="producto-precio">${formatCurrency(product.price)}</div>
                        <div class="precio-original">${formatCurrency(product.originalPrice)}</div>
                    </div>
                </div>
                <button class="agregar-carrito" data-id="${product.id}">
                    <i class="fas fa-cart-plus"></i> Agregar al Carrito
                </button>
            </div>
        `;
        productGrid.appendChild(productCard);
    });
}

// FAQ Toggle
function toggleFaq(element) {
    const answer = element.nextElementSibling;
    const icon = element.querySelector('i');
    element.classList.toggle('active');
    answer.style.maxHeight = element.classList.contains('active') ? answer.scrollHeight + 'px' : '0';
    icon.classList.toggle('fa-chevron-up');
    icon.classList.toggle('fa-chevron-down');
}

// Event Listeners
document.addEventListener('click', (e) => {
    if (e.target.closest('.agregar-carrito')) {
        const id = e.target.closest('.agregar-carrito').dataset.id;
        addToCart(id);
    }
    if (e.target.closest('.cantidad-btn')) {
        const id = e.target.closest('.cantidad-btn').dataset.id;
        const change = parseInt(e.target.closest('.cantidad-btn').dataset.change);
        changeQuantity(id, change);
    }
    if (e.target.closest('.eliminar-item')) {
        const id = e.target.closest('.eliminar-item').dataset.id;
        removeItem(id);
    }
});

if (btnCarrito) btnCarrito.addEventListener('click', openCart);
if (cerrarCarrito) cerrarCarrito.addEventListener('click', closeCart);
if (carritoOverlay) carritoOverlay.addEventListener('click', closeCart);
if (vaciarCarritoBtn) vaciarCarritoBtn.addEventListener('click', emptyCart);
if (finalizarPedidoBtn) finalizarPedidoBtn.addEventListener('click', finalizeOrder);
if (aplicarCuponBtn) aplicarCuponBtn.addEventListener('click', applyDiscountCode);
if (contactForm) {
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        alert('Mensaje enviado. Te contactaremos pronto.');
        contactForm.reset();
    });
}
if (faqQuestions) {
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => toggleFaq(question));
    });
}

// Cargar carrito y renderizar productos al inicio
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartDisplay();
});
