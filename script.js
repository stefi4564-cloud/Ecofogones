/* Ecofogones - carrito simple (localStorage) */

/* Productos: edítalos si quieres (precios en COP) */
const products = [
  {
    id: "eco-100",
    name: "Fogón Eco 100",
    price: 420000,
    desc: "Modelo pequeño — ideal para familias pequeñas. Ahorro de leña hasta 40%.",
    img: "https://picsum.photos/seed/stove1/600/400"
  },
  {
    id: "eco-200",
    name: "Fogón Eco 200",
    price: 680000,
    desc: "Modelo medio — buen equilibrio entre tamaño y eficiencia.",
    img: "https://picsum.photos/seed/stove2/600/400"
  },
  {
    id: "eco-300",
    name: "Fogón Eco 300",
    price: 980000,
    desc: "Modelo grande — para uso intensivo o instituciones.",
    img: "https://picsum.photos/seed/stove3/600/400"
  }
];

const currency = (n) => n.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits:0 });

/* UI elements */
const productsGrid = document.getElementById('products-grid');
const cartBtn = document.getElementById('cart-btn');
const cartCount = document.getElementById('cart-count');
const cartModal = document.getElementById('cart-modal');
const cartBackdrop = document.getElementById('cart-backdrop');
const closeCart = document.getElementById('close-cart');
const cartItemsEl = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const yearEl = document.getElementById('year');

yearEl.textContent = new Date().getFullYear();

/* Render productos */
function renderProducts(){
  productsGrid.innerHTML = '';
  products.forEach(p => {
    const div = document.createElement('div');
    div.className = 'product-card';
    div.innerHTML = `
      <img src="${p.img}" alt="${p.name}" />
      <div class="product-body">
        <div class="product-title">${p.name}</div>
        <div class="product-desc">${p.desc}</div>
        <div class="product-footer">
          <div class="price">${currency(p.price)}</div>
          <button class="btn-add" data-id="${p.id}">Agregar</button>
        </div>
      </div>
    `;
    productsGrid.appendChild(div);
  });

  document.querySelectorAll('.btn-add').forEach(btn=>{
    btn.addEventListener('click', ()=> addToCart(btn.dataset.id));
  });
}

/* Carrito (localStorage) */
let cart = JSON.parse(localStorage.getItem('ecofogones_cart') || '[]');
function saveCart(){ localStorage.setItem('ecofogones_cart', JSON.stringify(cart)); updateCartCount(); renderCart(); }

function updateCartCount(){
  const count = cart.reduce((s,i)=>s + i.qty, 0);
  cartCount.textContent = count;
}

/* Añadir al carrito */
function addToCart(id){
  const p = products.find(x=>x.id===id);
  if(!p) return;
  const existing = cart.find(it=>it.id===id);
  if(existing){ existing.qty += 1; }
  else{ cart.push({id: p.id, name: p.name, price: p.price, qty:1}); }
  saveCart();
  alert(`${p.name} agregado al carrito`);
}

/* Render carrito */
function renderCart(){
  if(!cartItemsEl) return;
  cartItemsEl.innerHTML = '';
  if(cart.length === 0){
    cartItemsEl.innerHTML = '<p>El carrito está vacío.</p>';
    cartTotalEl.textContent = currency(0);
    return;
  }
  let total=0;
  cart.forEach(item=>{
    total += item.price * item.qty;
    const div = document.createElement('div');
    div.className = 'cart-row';
    div.style.marginBottom = '10px';
    div.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <strong>${item.name}</strong>
          <div style="color:var(--muted); font-size:0.95rem">${currency(item.price)} x ${item.qty}</div>
        </div>
        <div style="display:flex; gap:8px; align-items:center;">
          <input type="number" min="1" value="${item.qty}" data-id="${item.id}" style="width:60px" />
          <button data-remove="${item.id}">Eliminar</button>
        </div>
      </div>
    `;
    cartItemsEl.appendChild(div);
  });

  /* listeners quantity & remove */
  cartItemsEl.querySelectorAll('input[type="number"]').forEach(inp=>{
    inp.addEventListener('change', (e)=>{
      const id = inp.dataset.id;
      const nv = parseInt(inp.value) || 1;
      const it = cart.find(x=>x.id===id);
      if(it){ it.qty = nv; saveCart(); }
    });
  });
  cartItemsEl.querySelectorAll('button[data-remove]').forEach(b=>{
    b.addEventListener('click', ()=>{
      const id = b.dataset.remove;
      cart = cart.filter(x=>x.id!==id);
      saveCart();
    });
  });

  cartTotalEl.textContent = currency(total);
}

/* Checkout -> WhatsApp message */
function checkout(){
  if(cart.length === 0){ alert('Tu carrito está vacío'); return; }
  const lines = cart.map(i=>`${i.qty} x ${i.name} (${currency(i.price)})`).join('%0A');
  const total = cart.reduce((s,i)=>s + i.price * i.qty, 0);
  const message = encodeURIComponent(`Hola, quiero hacer un pedido de Ecofogones (La Plata, Huila):%0A${lines}%0A%0ATotal: ${currency(total)}%0A%0A¿Cómo coordinamos envío y pago?`);
  // Cambia este número por tu número real (sin +). Ejemplo: 573001234567
  const phone = '573148673011';
  window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
}

/* UI: abrir/cerrar modal */
function openCart(){ cartModal.classList.add('open'); cartModal.classList.remove('hidden'); }
function closeCartFn(){ cartModal.classList.remove('open'); }

cartBtn.addEventListener('click', openCart);
closeCart.addEventListener('click', closeCartFn);
cartBackdrop.addEventListener('click', closeCartFn);
checkoutBtn.addEventListener('click', checkout);

// Carrito de Compras con despliegue lateral

const carrito = [];
const btnAbrirCarrito = document.getElementById('btn-carrito');
const carritoAside = document.getElementById('carrito');
const btnCerrarCarrito = document.getElementById('cerrar-carrito');
const listaCarrito = document.getElementById('lista-carrito');
const totalCarrito = document.getElementById('total-carrito');

function actualizarCarrito() {
  listaCarrito.innerHTML = '';

  let total = 0;
  carrito.forEach((producto, index) => {
    total += producto.precio;
    const li = document.createElement('li');
    li.innerHTML = `
      <span><strong>${producto.nombre}</strong></span>
      <span>Precio: $${producto.precio.toLocaleString()}</span>
      <button class="eliminar-producto" data-index="${index}">Eliminar</button>
    `;
    listaCarrito.appendChild(li);
  });

  totalCarrito.textContent = `Total: $${total.toLocaleString()}`;

  // Agregar eventos para eliminar productos
  document.querySelectorAll('.eliminar-producto').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.target.dataset.index);
      carrito.splice(idx, 1);
      actualizarCarrito();
    });
  });
}

btnAbrirCarrito.addEventListener('click', () => {
  carritoAside.classList.add('visible');
});

btnCerrarCarrito.addEventListener('click', () => {
  carritoAside.classList.remove('visible');
});

document.querySelectorAll('.agregar-carrito').forEach(button => {
  button.addEventListener('click', () => {
    const productoDiv = button.parentElement;
    const nombre = productoDiv.querySelector('h3').innerText;
    const precioTexto = productoDiv.querySelector('p').innerText;
    const precio = parseInt(precioTexto.replace(/[^0-9]/g, ''), 10);

    carrito.push({ nombre, precio });
    actualizarCarrito();
  });
});


/* Inicializar */
renderProducts();
renderCart();
updateCartCount();
// Carrito de Compras con despliegue lateral

const carrito = [];
const btnAbrirCarrito = document.getElementById('btn-carrito');
const carritoAside = document.getElementById('carrito');
const btnCerrarCarrito = document.getElementById('cerrar-carrito');
const listaCarrito = document.getElementById('lista-carrito');
const totalCarrito = document.getElementById('total-carrito');
const cantidadProductos = document.getElementById('cantidad-productos');

function actualizarCarrito() {
  listaCarrito.innerHTML = '';

  let total = 0;
  let cantidad = 0;
  carrito.forEach((producto, index) => {
    total += producto.precio;
    cantidad += 1;
    const li = document.createElement('li');
    li.innerHTML = `
      <span><strong>${producto.nombre}</strong></span>
      <span>Precio: $${producto.precio.toLocaleString()}</span>
      <button class="eliminar-producto" data-index="${index}">Eliminar</button>
    `;
    listaCarrito.appendChild(li);
  });

  totalCarrito.textContent = `Subtotal: $${total.toLocaleString()}`;
  cantidadProductos.textContent = `Cantidad: ${cantidad}`;

  // Agregar eventos para eliminar productos
  document.querySelectorAll('.eliminar-producto').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.target.dataset.index);
      carrito.splice(idx, 1);
      actualizarCarrito();
    });
  });
}

btnAbrirCarrito.addEventListener('click', () => {
  carritoAside.classList.add('visible');
});

btnCerrarCarrito.addEventListener('click', () => {
  carritoAside.classList.remove('visible');
});

document.querySelectorAll('.agregar-carrito').forEach(button => {
  button.addEventListener('click', () => {
    const productoDiv = button.parentElement;
    const nombre = productoDiv.querySelector('h3').innerText;
    const precioTexto = productoDiv.querySelector('p').innerText;
    const precio = parseInt(precioTexto.replace(/[^0-9]/g, ''), 10);

    carrito.push({ nombre, precio });
    actualizarCarrito();
  });
});
