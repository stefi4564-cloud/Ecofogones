// =================================================================
// Archivo: script.js
// Descripción: Lógica para el carrito de compras y efectos dinámicos
// =================================================================

// Productos: edátalos si quieres (precios en COP)
productos constantes = [
    {
        identificación: "eco-100",
        nombre: "Fogón Tradicional",
        precio: 450000,
        img: "fogontradicional1.png",
        descripción: "Perfecto para el hogar, eficiente y económico. Ideal para familias de 3-5 personas. Construcción robusta en acero inoxidable.",
        Insignia: "Más Popular",
        características: "Acero Inoxidable", "Familiar", "Garantía 2 años",
        Precio original: 500000
    },
    {
        identificación: "eco-200",
        nombre: "Fogón de 2 boquillas",
        precio: 650000,
        img: "fogonde2boquillas.png",
        descripción: "Mayor capacidad para familias grandes de 6-10 personas. Diseño robusto y duradero con tecnología de combustión mejorada.",
        Insignia: "Recomendado",
        características: "Gran Capacidad", "Eco-friendly", "Garantía 3 años",
        Precio original: 750000
    },
    {
        identificación: "eco-300",
        nombre: "Fogón de 3 boquillas",
        precio: 1200000,
        img: "fogonde3boquillas.png",
        descripción: "Para restaurantes y cocinas comerciales. Máxima eficiencia y durabilidad. Construcción industrial con materiales de primera calidad.",
        insignia: "Premium",
        características: "Uso Comercial", "Alta Durabilidad", "Garantía 5 años",
        Precio original: 1400000
    },
    {
        identificación: "eco-400",
        nombre: "Platón para arado",
        precio: 120000,
        img: "platoaradofogon.png",
        descripción: "Accesorio ideal para usar con nuestros fogones, perfecto para preparar comidas en plancha. Compatible con todos los modelos.",
        insignia: "Nuevo",
        características: "Acero al Carbono", "Versátil", "Fácil de Limpiar",
        Precio original: 140000
    }
];

// Códigos de descuento disponibles
const códigosdedescuento = {
    'ECOFOGON10': { tipo: 'porcentaje', valor: 0.10, descripción: '10% de descuento en tu compra.' },
    'AHORRO50000': { tipo: 'fixed', valor: 50000, descripción: '$50.000 de descuento en tu compra.' }
};

deje que el descuento aplicado sea 0;
deje que isDiscountApplied = falso;

// Función para formato de moneda (COP)
const formatCurrency = (n) => n.toLocaleString('es-CO', { estilo: 'moneda', moneda: 'COP', maximumFractionDigits: 0 });

// =================================================================
// Variables y elementos del DOM
// =================================================================
deje que el carrito sea JSON.parse(localStorage.getItem('ecofogones_cart') || '[]');
deje que elCodigoDescuentoAplicado = localStorage.getItem('ecofogones_discount_code') || '';
deje que el valorDescuentoAplicado = parseFloat(localStorage.getItem('ecofogones_discount_value')) || 0;
deje que se aplique el descuento = localStorage.getItem('ecofogones_se_aplica_el_descuento') === 'true';

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
const aplicarCuponBtn = document.getElementById('aplicar-cupón-btn');
const productosGrid = document.querySelector('.productos-grid');
const contactForm = document.getElementById('formulario-de-contacto');
const faqItems = document.querySelectorAll('.faq-item');


si (isDiscountAppliedFlag && códigoDescuentoAplicado) {
    DescuentoAplicado = ValorDescuentoAplicado;
    isDescuentoAplicado = verdadero;
    si (cuponInput) cuponInput.valor = codigoDescuentoAplicado;
}


// =================================================================
// Lógica para el carrito de compras
// =================================================================
función saveCart() {
    localStorage.setItem('ecofogones_cart', JSON.stringify(carrito));
    localStorage.setItem('ecofogones_discount_code', isDiscountApplied ? cuponInput.value : '');
    localStorage.setItem('ecofogones_discount_value', descuentoAplicado);
    localStorage.setItem('ecofogones_tiene_descuento_aplicado', tieneDescuentoAplicado);
    actualizarCartDisplay();
}

función updateCartDisplay() {
    si (!listaCarrito) retorna;
    listaCarrito.innerHTML = '';
    sea subtotal = 0;
    deje que totalItems = 0;

    si (carrito.longitud === 0) {
        if (carritoVacio) carritoVacio.style.display = 'bloque';
        if (vaciarCarritoBtn) vaciarCarritoBtn.style.display = 'none';
        si (finalizarPedidoBtn) finalizarPedidoBtn.style.display = 'none';
    } demás {
        if (carritoVacio) carritoVacio.style.display = 'none';
        if (vaciarCarritoBtn) vaciarCarritoBtn.style.display = 'bloquear';
        si (finalizarPedidoBtn) finalizarPedidoBtn.style.display = 'block';

        carrito.paraCada((artículo) => {
            const producto = productos.find(p => p.id === item.id);
            si (!producto) retorna;

            const subtotalItem = producto.precio * articulo.cantidad;
            subtotal += subtotalItem;
            totalItems += articulo.cantidad;

            const itemEl = document.createElement('div');
            itemEl.className = 'carrito-item';
            itemEl.innerHTML = `
                <img src="${producto.img}" alt="${producto.nombre}">
                <div class="carrito-item-info">
                    <div class="carrito-item-nombre">${producto.nombre}</div>
                    <div class="carrito-item-precio">${formatCurrency(producto.precio)}</div>
                    <div class="carrito-item-cantidad">
                        <button class="cantidad-btn" onclick="cambiarCantidad('${item.id}', -1)">-</button>
                        <span class="cantidad-numero">${item.qty}</span>
                        <button class="cantidad-btn" onclick="cambiarCantidad('${item.id}', 1)">+</button>
                    </div>
                </div>
                <button class="eliminar-item" onclick="removeItem('${item.id}')">
                    <i class="fas fa-trash"></i>
                </botón>
            `;
            listaCarrito.appendChild(itemEl);
        });
    }

    const finalTotal = subtotal - descuento aplicado;
    si (subtotalCarritoEl) subtotalCarritoEl.textContent = formatCurrency(subtotal);
    if (descuentoValorEl) descuentoValorEl.textContent = formatCurrency(appliedDiscount);
    if (descuentoPorcentajeEl) descuentoPorcentajeEl.textContent = subtotal > 0 ? `${(appliedDiscount / subtotal * 100).toFixed(0)}%` : '0%';
    si (totalCarritoEl) totalCarritoEl.textContent = formatCurrency(finalTotal < 0 ? 0 : finalTotal);
    si (contadorCarrito) {
        contadorCarrito.textContent = totalItems;
        contadorCarrito.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

función addToCart(id) {
    const producto = productos.find(p => p.id === id);
    si (!producto) retorna;

    const elementoexistente = carrito.find(elemento => elemento.id === id);
    si (elemento existente) {
        elementoexistente.cantidad += 1;
    } demás {
        carrito.push({ id: producto.id, cantidad: 1 });
    }
    guardarCarrito();
    
    const cartButton = document.getElementById('btn-carrito');
    si (botoncarrito) {
        cartButton.classList.add('producto-agregado');
        setTimeout(() => cartButton.classList.remove('producto-agregado'), 600);
    }
}

función changeQuantity(id, cambio) {
    const item = carrito.find(i => i.id === id);
    si (!item) retorna;

    artículo.cantidad += cambio;
    si (cantidad_artículo <= 0) {
        carrito = carrito.filtro(i => i.id !== id);
    }
    guardarCarrito();
}

función removeItem(id) {
    carrito = carrito.filtro(i => i.id !== id);
    guardarCarrito();
}

función openCart() {
    if (carritoElement) carritoElement.classList.add('carrito-visible');
    si (carritoOverlay) carritoOverlay.classList.add('activo');
    document.body.classList.add('no-scroll');
}

función closeCart() {
    if (carritoElement) carritoElement.classList.remove('carrito-visible');
    si (carritoOverlay) carritoOverlay.classList.remove('activo');
    document.body.classList.remove('no-scroll');
}

función emptyCart() {
    si (carrito.length === 0) retorna;
    if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
        carrito = [];
        descuento aplicado = 0;
        isDiscountApplied = falso;
        si (cuponInput) cuponInput.valor = '';
        guardarCarrito();
    }
}

función aplicarDescuento(código) {
    si (seAplicaDescuento) {
        alert('Ya se ha aplicado un cupón de descuento.');
        devolver;
    }

    const cupon = codigosdescuento[code.toUpperCase()];
    si (!cupón) {
        alert('El cupón ingresado no es válido.');
        devolver;
    }

    const subtotal = cart.reduce((total, artículo) => {
        const producto = productos.find(p => p.id === item.id);
        devolver total + (producto ? producto.precio * articulo.cantidad : 0);
    }, 0);

    si (cupón.tipo === 'porcentaje') {
        descuentoAplicado = subtotal * valorCupón;
    } de lo contrario si (cupón.tipo === 'fijo') {
        descuentoAplicado = cupón.valor;
    }
    
    isDescuentoAplicado = verdadero;
    guardarCarrito();
    alert(`Â¡CupÃ³n "${code.toUpperCase()}" aplicado! Descuento de ${formatCurrency(appliedDiscount)}`);
}

función checkout() {
    si (carrito.longitud === 0) {
        alert('Tu carrito está vacío. Agrega productos para continuar.');
        devolver;
    }

    let mensaje = '¡Hola! Me interesa hacer el siguiente pedido de Ecofogones:\n\n';
    sea subtotal = 0;

    carrito.paraCada(artículo => {
        const producto = productos.find(p => p.id === item.id);
        si (producto) {
            const subtotalItem = producto.precio * articulo.cantidad;
            subtotal += subtotalItem;
            mensaje += `• *${product.name}*\n`;
            mensaje += ` - Cantidad: ${item.qty}\n`;
            mensaje += ` - Subtotal: ${formatCurrency(subtotalItem)}\n\n`;
        }
    });

    const finalTotal = subtotal - descuento aplicado;
    mensaje += `ðŸ›' *Resumen del Pedido*\n`;
    mensaje += `---------------------------\n`;
    mensaje += `Subtotal: ${formatCurrency(subtotal)}\n`;
    si (seAplicaDescuento) {
        mensaje += `Descuento: -${formatCurrency(appliedDiscount)}\n`;
    }
    mensaje += `*TOTAL: ${formatCurrency(finalTotal < 0 ? 0 : finalTotal)}*\n\n`;
    message += 'Â¿PodrÃan confirmarme la disponibilidad y los tiempos de entrega? ¡Gracias!';

    const urlWhatsApp = `https://wa.me/573148673011?text=${encodeURIComponent(mensaje)}`;
    ventana.open(urlWhatsApp, '_blank');
}


función sendContactForm(evento) {
    evento.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    constante asunto = documento.getElementById('asunto').valor;
    const mensaje = document.getElementById('mensaje').value;

    const whatsappMessage = `¡Hola! He llenado un formulario de contacto en tu sitio web. Aquí está la información:\n\n` +
                                `*Nombre:* ${name}\n` +
                                `*Correo:* ${email}\n` +
                                `*Asunto:* ${asunto}\n` +
                                `*Mensaje:* ${message}\n\n`;

    constante urlWhatsApp = `https://wa.me/573148673011?text=${encodeURIComponent(whatsappMessage)}`;
    ventana.open(urlWhatsApp, '_blank');

    formularioContacto.reset();
}


// =================================================================
// Lógica para la UI y la página
// =================================================================

// Renderizar productos dinámicamente
función renderProducts() {
    si (!productosGrid) {
        console.error("El contenedor de productos no se encontró. Asegúrese de que el HTML esté cargado antes.");
        devolver;
    }

    productosGrid.innerHTML = '';
    productos.paraCada(producto => {
        const productoEl = document.createElement('div');
        productEl.className = 'producto fundido';
        productoEl.innerHTML = `
            <div class="producto-imagen">
                <img src="${producto.img}" alt="${producto.nombre}" cargando="perezoso" />
                ${producto.insignia ? `<div class="producto-insignia">${producto.insignia}</div>` : ''}
            </div>
            <div class="información del producto">
                <h3>${producto.nombre}</h3>
                <p class="producto-descripcion">${producto.descripcion}</p>
                <div class="producto-caracteristicas">
                    ${producto.características.mapa(característica => `<span class="caracteristica">${característica}</span>`).join('')}
                </div>
                <div class="producto-precio-contenedor">
                    <div>
                        <div class="producto-precio">${formatCurrency(producto.precio)}</div>
                        <div class="precio-original">${formatCurrency(producto.precio-original)}</div>
                    </div>
                </div>
                <button class="agregar-carrito" data-id="${product.id}">
                    <i class="fas fa-cart-plus"></i> Agregar al Carrito
                </botón>
            </div>
        `;
        productosGrid.appendChild(productoEl);
    });
}

// Observador para animaciones de scroll
const fadeInElements = document.querySelectorAll('.fade-in');
const observerOptions = {
    raíz: nula,
    rootMargin: '0px',
    umbral: 0,1
};
const observerCallback = (entradas, observador) => {
    entradas.paraCada(entrada => {
        si (entrada.isIntersecting) {
            entrada.target.classList.add('visible');
            observador.unobserve(entrada.objetivo);
        }
    });
};
const fadeObserver = new IntersectionObserver(observerCallback, observerOptions);

// Observador para carga diferida de imágenes
const lazyImages = document.querySelectorAll('img[loading="lazy"]');
const lazyLoadObserver = new IntersectionObserver((entradas, observador) => {
    entradas.paraCada(entrada => {
        si (entrada.isIntersecting) {
            const img = entrada.objetivo;
            img.classList.add('cargado');
            observador.unobserve(img);
        }
    });
});

// =================================================================
// Eventos e Inicialización
// =================================================================
// Eventos del carrito
si (btnCarrito) btnCarrito.addEventListener('click', openCart);
if (cerrarCarrito) cerrarCarrito.addEventListener('click', closeCart);
si (carritoOverlay) carritoOverlay.addEventListener('click', closeCart);
if (vaciarCarritoBtn) vaciarCarritoBtn.addEventListener('click', vaciarCarrito);
if (finalizarPedidoBtn) finalizarPedidoBtn.addEventListener('click', checkout);
if (aplicarCuponBtn) aplicarCuponBtn.addEventListener('click', () => {
    aplicarDescuento(cuponInput.valor);
});

// Evento para el formulario de contacto
si (contactForm) {
    contactForm.addEventListener('enviar', sendContactForm);
}

// Evento para añadir productos al carrito (delegado)
document.addEventListener('clic', (evento) => {
    const botonAgregar = event.target.closest('.agregar-carrito');
    si (botonAgregar) {
        const id = botonAgregar.dataset.id;
        añadirAlCarrito(id);
    }
});

// Lógica para el acordeón de las Preguntas Frecuentes
faqItems.forEach(elemento => {
    constante pregunta = item.querySelector('.faq-pregunta');
    si (pregunta) {
        pregunta.addEventListener('clic', () => {
            item.classList.toggle('activo');
        });
    }
});

// Inicialización de funciones
documento.addEventListener('DOMContentLoaded', () => {
    renderProductos();
    actualizarCartDisplay();
    
    fadeInElements.forEach(el => fadeObserver.observe(el));
    lazyImages.forEach(img => lazyLoadObserver.observe(img));
});
