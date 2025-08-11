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
        img: "https://images.unsplash.com/photo-1606787364410-8e4b3d87aa94?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "Perfecto para el hogar, eficiente y económico. Ideal para familias de 3-5 personas. Construcción robusta en acero inoxidable.",
        badge: "Más Popular",
        features: ["Acero Inoxidable", "Familiar", "Garantía 2 años"],
        originalPrice: 500000
    },
    {
        id: "eco-200",
        name: "Fogón Familiar",
        price: 650000,
        img: "https://images.unsplash.com/photo-1586201375761-83865001e31b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "Mayor capacidad para familias grandes de 6-10 personas. Diseño robusto y duradero con tecnología de combustión mejorada.",
        badge: "Recomendado",
        features: ["Gran Capacidad", "Eco-friendly", "Garantía 3 años"],
        originalPrice: 750000
    },
    {
        id: "eco-300",
        name: "Fogón Industrial",
        price: 1200000,
        img: "https://images.unsplash.com/photo-1603422553494-3f0e8e3dabe4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "Para restaurantes y cocinas comerciales. Máxima eficiencia y durabilidad. Construcción industrial con materiales de primera calidad.",
        badge: "Premium",
        features: ["Uso Comercial", "Alta Durabilidad", "Garantía 5 años"],
        originalPrice: 1400000
    }
];

// Códigos de descuento disponibles
const discountCodes = {
    'ECOFOGON10': { type: 'percentage', value: 0.10, description: '10% de descuento en tu compra.' },
    'AHORRO50000': { type: 'fixed', value: 50000, description: '$50.000 de descuento en tu compra.' }
};

let appliedDiscount = 0;
let discountPercentage = 0;
let isDiscountApplied = false;

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
const subtotalCarritoEl = document.getElementById('subtotal-carrito');
const descuentoValorEl = document.getElementById('descuento-valor');
const descuentoPorcentajeEl = document.getElementById('descuento-porcentaje');
const contadorCarrito = document.getElementById('contador-carrito');
const carritoVacio = document.getElementById('carrito-vacio');
const vaciarCarritoBtn = document.getElementById('vaciar-carrito');
const finalizarPedidoBtn = document.getElementById('finalizar-pedido');
const cuponInput = document.getElementById('cupon-input');
const aplicarCuponBtn = document.getElementById('aplicar-cupon-btn');
const productosGrid = document.querySelector('.productos-grid');

// =================================================================
// Lógica para el carrito de compras
// =================================================================
function saveCart() {
    localStorage.setItem('ecofogones_cart', JSON.stringify(cart));
    updateCartDisplay();
}

function updateCartDisplay() {
    listaCarrito.innerHTML = '';
    let subtotal = 0;
    let totalItems = 0;

    if (cart.length === 0) {
        carritoVacio.style.display = 'block';
    } else {
        carritoVacio.style.display = 'none';

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

    const finalTotal = subtotal - appliedDiscount;
    subtotalCarritoEl.textContent = formatCurrency(subtotal);
    descuentoValorEl.textContent = formatCurrency(appliedDiscount);
    descuentoPorcentajeEl.textContent = `${(appliedDiscount / subtotal * 100).toFixed(0) || 0}%`;
    totalCarritoEl.textContent = formatCurrency(finalTotal < 0 ? 0 : finalTotal);
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
    
    // Animación de "añadido al carrito"
    const cartButton = document.getElementById('btn-carrito');
    cartButton.classList.add('producto-agregado');
    setTimeout(() => cartButton.classList.remove('producto-agregado'), 600);
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
        appliedDiscount = 0;
        isDiscountApplied = false;
        cuponInput.value = '';
        saveCart();
    }
}

function applyDiscount(code) {
    if (isDiscountApplied) {
        alert('Ya se ha aplicado un cupón de descuento.');
        return;
    }

    const coupon = discountCodes[code.toUpperCase()];
    if (!coupon) {
        alert('El cupón ingresado no es válido.');
        return;
    }

    let subtotal = cart.reduce((total, item) => {
        const product = products.find(p => p.id === item.id);
        return total + (product ? product.price * item.qty : 0);
    }, 0);

    if (coupon.type === 'percentage') {
        appliedDiscount = subtotal * coupon.value;
    } else if (coupon.type === 'fixed') {
        appliedDiscount = coupon.value;
    }
    
    isDiscountApplied = true;
    saveCart();
    alert(`¡Cupón "${code.toUpperCase()}" aplicado! Descuento de ${formatCurrency(appliedDiscount)}`);
}

function checkout() {
    if (cart.length === 0) {
        alert('Tu carrito está vacío. Agrega productos para continuar.');
        return;
    }

    let message = '¡Hola! Me interesa hacer el siguiente pedido de Ecofogones:%0A%0A';
    let subtotal = 0;

    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (product) {
            const subtotalItem = product.price * item.qty;
            subtotal += subtotalItem;
            message += `• ${product.name}%0A`;
            message += `  Cantidad: ${item.qty}%0A`;
            message += `  Subtotal: ${formatCurrency(subtotalItem)}%0A%0A`;
        }
    });

    const finalTotal = subtotal - appliedDiscount;
    message += `🛒 *Resumen del Pedido*%0A`;
    message += `---------------------------%0A`;
    message += `Subtotal: ${formatCurrency(subtotal)}%0A`;
    if (isDiscountApplied) {
        message += `Descuento: -${formatCurrency(appliedDiscount)}%0A`;
    }
    message += `*TOTAL: ${formatCurrency(finalTotal < 0 ? 0 : finalTotal)}*%0A%0A`;
    message += '¿Podrían confirmarme la disponibilidad y los tiempos de entrega?%0A%0A¡Gracias!';

    const urlWhatsApp = `https://wa.me/573148673011?text=${encodeURIComponent(message)}`;
    window.open(urlWhatsApp, '_blank');
}

// =================================================================
// Lógica para la UI y la página
// =================================================================

// Renderizar productos dinámicamente
function renderProducts() {
    products.forEach(product => {
        const productEl = document.createElement('div');
        productEl.className = 'producto fade-in';
        productEl.innerHTML = `
            <div class="producto-imagen">
                <img src="${product.img}" alt="${product.name}" loading="lazy" />
                ${product.badge ? `<div class="producto-badge">${product.badge}</div>` : ''}
            </div>
            <div class="producto-info">
                <h3>${product.name}</h3>
                <p class="producto-descripcion">${product.description}</p>
                <div class="producto-caracteristicas">
                    ${product.features.map(feature => `<span class="caracteristica">${feature}</span>`).join('')}
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
        productosGrid.appendChild(productEl);
    });
}

// Observador para animaciones de scroll
const fadeInElements = document.querySelectorAll('.fade-in');

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
};

const fadeObserver = new IntersectionObserver(observerCallback, observerOptions);

// Observador para lazy loading de imágenes
const lazyImages = document.querySelectorAll('img[loading="lazy"]');
const lazyLoadObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            // img.src = img.dataset.src; // Esto sería necesario si no usáramos "loading='lazy'"
            img.classList.add('loaded');
            observer.unobserve(img);
        }
    });
});

// =================================================================
// Eventos y Inicialización
// =================================================================

// Eventos del carrito
btnCarrito.addEventListener('click', openCart);
cerrarCarrito.addEventListener('click', closeCart);
carritoOverlay.addEventListener('click', closeCart);
vaciarCarritoBtn.addEventListener('click', emptyCart);
finalizarPedidoBtn.addEventListener('click', checkout);
aplicarCuponBtn.addEventListener('click', () => {
    applyDiscount(cuponInput.value);
});

// Evento para añadir productos al carrito (delegado)
document.addEventListener('click', (event) => {
    if (event.target.matches('.agregar-carrito')) {
        const id = event.target.dataset.id;
        addToCart(id);
    }
});

// Inicialización de funciones
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartDisplay();
    
    // Iniciar el observador para las animaciones
    fadeInElements.forEach(el => fadeObserver.observe(el));
    
    // Iniciar el observador para lazy loading
    lazyImages.forEach(img => lazyLoadObserver.observe(img));
});
