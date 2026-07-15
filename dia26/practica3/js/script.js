document.addEventListener('DOMContentLoaded', () => {

    // === BASE DE DATOS DE PRODUCTOS ===
    const PRODUCTS = [
        {
            id: 1,
            name: "Polo Negro",
            category: "Shirts",
            price: 450000,
            image: "res/abrigo1.jpg",
            tag: "Hot"
        },
        {
            id: 2,
            name: "Pantalón Corte Relaxed",
            category: "Pants",
            price: 550000,
            image: "res/pantalon1.jpg",
            tag: "Hot"
        },
        {
            id: 3,
            name: "Sneaker DC Chunky",
            category: "Sneakers",
            price: 670000,
            image: "res/dc.jpg",
            tag: "Hot"
        }
    ];

    // === ESTADO DE LA APLICACIÓN ===
    let cart = [];

    // === ELEMENTOS DEL DOM ===
    const productGrid = document.getElementById('product-grid');
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    // Elementos del Modal Lupa
    const modal = document.getElementById('zoom-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const modalImg = document.getElementById('modal-img');
    const magnifiedImg = document.getElementById('magnified-img');
    const lens = document.getElementById('magnifier-lens');
    const container = document.getElementById('magnifier-container');
    const modalCategory = document.getElementById('modal-category');
    const modalTitle = document.getElementById('modal-title');
    const modalPrice = document.getElementById('modal-price');

    // Elementos del Carrito Sidebar
    const cartDrawer = document.getElementById('cart-drawer');
    const cartBackdrop = document.getElementById('cart-backdrop');
    const cartToggleBtn = document.getElementById('cart-toggle-btn');
    const cartCloseBtn = document.getElementById('cart-close-btn');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartBadge = document.getElementById('cart-badge');
    const cartCountTitle = document.getElementById('cart-count-title');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartTotal = document.getElementById('cart-total');

    const ZOOM_LEVEL = 2.5;

    // === FORMATO DE MONEDA PARAGUAYA (Gs.) ===
    function formatCurrency(amount) {
        return '₲' + amount.toLocaleString('es-PY');
    }

    // === 1. RENDERIZAR CATÁLOGO DE PRODUCTOS ===
    function renderCatalog() {
        productGrid.innerHTML = '';
        PRODUCTS.forEach(product => {
            const productHTML = `
                <article class="group relative flex flex-col bg-zinc-900/50 border border-zinc-850 rounded-lg overflow-hidden transition-all duration-350 hover:border-zinc-700 hover:bg-zinc-900">
                    <div class="aspect-square w-full bg-zinc-800 relative overflow-hidden cursor-pointer open-details" data-id="${product.id}">  
                        <img 
                            src="${product.image}" 
                            alt="${product.name}" 
                            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        ${product.tag ? `<span class="absolute top-4 left-4 bg-orange-500 text-black text-xs font-black tracking-wide uppercase px-2 py-1 rounded-sm">${product.tag}</span>` : ''}
                    </div>
                    <div class="p-5 flex flex-col flex-grow justify-between">
                        <div>
                            <p class="text-xs text-orange-500/80 font-bold uppercase tracking-wider mb-1">${product.category}</p>
                            <h3 class="text-lg font-bold text-white group-hover:text-orange-400 transition-colors cursor-pointer open-details" data-id="${product.id}">
                                ${product.name}
                            </h3>
                        </div>
                        <div class="mt-4 flex items-center justify-between border-t border-zinc-800/60 pt-4">
                            <span class="text-xl font-black text-white">${formatCurrency(product.price)}</span>
                            <button class="add-to-cart-btn relative z-10 bg-zinc-800 hover:bg-orange-500 text-white hover:text-black p-2.5 rounded-md transition-all duration-300 cursor-pointer" data-id="${product.id}" aria-label="Añadir al carrito">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4 pointer-events-none">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </article>
            `;
            productGrid.innerHTML += productHTML;
        });

        // Configurar Eventos para Detalle y Carrito
        document.querySelectorAll('.open-details').forEach(el => {
            el.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.getAttribute('data-id'));
                openProductModal(id);
            });
        });

        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                addToCart(id);
            });
        });
    }

    // === 2. MODAL DE DETALLE Y SISTEMA DE LUPA ===
    function openProductModal(id) {
        const product = PRODUCTS.find(p => p.id === id);
        if (!product) return;

        modalCategory.innerText = product.category;
        modalTitle.innerText = product.name;
        modalPrice.innerText = formatCurrency(product.price);
        modalImg.src = product.image;
        magnifiedImg.src = product.image;

        modal.classList.remove('invisible', 'opacity-0');
        modal.classList.add('visible', 'opacity-100');
    }

    const hideModal = () => {
        modal.classList.remove('visible', 'opacity-100');
        modal.classList.add('invisible', 'opacity-0');
        resetMagnifier();
    };

    closeModalBtn.addEventListener('click', hideModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) hideModal();
    });

    function resetMagnifier() {
        lens.style.display = 'none';
        magnifiedImg.style.display = 'none';
    }

    container.addEventListener('mouseenter', () => {
        lens.style.display = 'block';
        magnifiedImg.style.display = 'block';
        
        const rect = modalImg.getBoundingClientRect();
        magnifiedImg.style.width = (rect.width * ZOOM_LEVEL) + 'px';
        magnifiedImg.style.height = (rect.height * ZOOM_LEVEL) + 'px';
    });

    container.addEventListener('mousemove', (e) => {
        const rect = modalImg.getBoundingClientRect();
        
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;

        if (x < 0) x = 0;
        if (x > rect.width) x = rect.width;
        if (y < 0) y = 0;
        if (y > rect.height) y = rect.height;

        const lensWidth = lens.offsetWidth;
        const lensHeight = lens.offsetHeight;
        let lensX = x - (lensWidth / 2);
        let lensY = y - (lensHeight / 2);

        if (lensX < 0) lensX = 0;
        if (lensX > rect.width - lensWidth) lensX = rect.width - lensWidth;
        if (lensY < 0) lensY = 0;
        if (lensY > rect.height - lensHeight) lensY = rect.height - lensHeight;

        lens.style.left = lensX + 'px';
        lens.style.top = lensY + 'px';

        magnifiedImg.style.left = - (lensX * ZOOM_LEVEL) + 'px';
        magnifiedImg.style.top = - (lensY * ZOOM_LEVEL) + 'px';
    });

    container.addEventListener('mouseleave', resetMagnifier);

    // === 3. GESTIÓN DEL CARRITO DE COMPRAS ===
    function toggleCart(open = true) {
        if (open) {
            cartDrawer.classList.remove('translate-x-full');
            cartBackdrop.classList.remove('hidden');
            setTimeout(() => cartBackdrop.classList.add('opacity-100'), 10);
        } else {
            cartDrawer.classList.add('translate-x-full');
            cartBackdrop.classList.remove('opacity-100');
            setTimeout(() => cartBackdrop.classList.add('hidden'), 300);
        }
    }

    cartToggleBtn.addEventListener('click', () => toggleCart(true));
    cartCloseBtn.addEventListener('click', () => toggleCart(false));
    cartBackdrop.addEventListener('click', () => toggleCart(false));

    function addToCart(productId) {
        const product = PRODUCTS.find(p => p.id === productId);
        const cartItem = cart.find(item => item.id === productId);

        if (cartItem) {
            cartItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        updateCart();
        toggleCart(true); // Abrimos para dar feedback visual de la compra
    }

    function updateCart() {
        cartItemsContainer.innerHTML = '';
        let totalItems = 0;
        let subtotalPrice = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="flex flex-col items-center justify-center h-64 text-center">
                    <p class="text-zinc-500 text-sm uppercase font-bold tracking-wider">Tu carrito está vacío</p>
                    <button id="start-shopping" class="mt-4 text-xs font-black text-orange-500 uppercase border border-orange-500/20 px-4 py-2 rounded bg-orange-500/5 hover:bg-orange-500 hover:text-black transition-colors cursor-pointer">Seguir Explorando</button>
                </div>
            `;
            const startShoppingBtn = document.getElementById('start-shopping');
            if (startShoppingBtn) startShoppingBtn.addEventListener('click', () => toggleCart(false));
        } else {
            cart.forEach(item => {
                totalItems += item.quantity;
                subtotalPrice += item.price * item.quantity;

                const itemHTML = `
                    <div class="flex gap-4 bg-zinc-900 border border-zinc-800 p-3 rounded-lg relative group">
                        <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover bg-zinc-800 rounded border border-zinc-800">
                        <div class="flex-grow flex flex-col justify-between">
                            <div>
                                <span class="text-[10px] text-zinc-500 uppercase font-bold tracking-wider leading-none">${item.category}</span>
                                <h4 class="text-xs font-bold text-white uppercase tracking-tight mt-0.5 leading-tight">${item.name}</h4>
                            </div>
                            <div class="flex items-center justify-between mt-2">
                                <div class="flex items-center bg-zinc-950 border border-zinc-800 rounded">
                                    <button class="quantity-btn px-2 py-0.5 text-zinc-400 hover:text-orange-500 transition-colors cursor-pointer" data-id="${item.id}" data-action="decrease">-</button>
                                    <span class="text-xs font-black text-white px-2">${item.quantity}</span>
                                    <button class="quantity-btn px-2 py-0.5 text-zinc-400 hover:text-orange-500 transition-colors cursor-pointer" data-id="${item.id}" data-action="increase">+</button>
                                </div>
                                <span class="text-xs font-black text-zinc-300">${formatCurrency(item.price * item.quantity)}</span>
                            </div>
                        </div>
                        <button class="remove-item-btn absolute -top-1.5 -right-1.5 bg-zinc-800 text-zinc-400 hover:text-red-500 p-1 rounded-full border border-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer" data-id="${item.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3.5 h-3.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                `;
                cartItemsContainer.innerHTML += itemHTML;
            });

            // Registrar eventos para el gestor interno de cantidad
            document.querySelectorAll('.quantity-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = parseInt(e.target.getAttribute('data-id'));
                    const action = e.target.getAttribute('data-action');
                    changeQuantity(id, action);
                });
            });

            document.querySelectorAll('.remove-item-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = parseInt(e.currentTarget.getAttribute('data-id'));
                    removeFromCart(id);
                });
            });
        }

        // === ACTUALIZACIÓN DE TOTALES ===
        // Indicadores Badge de cabecera
        if (totalItems > 0) {
            cartBadge.innerText = totalItems;
            cartBadge.classList.remove('scale-0', 'opacity-0');
            cartBadge.classList.add('scale-100', 'opacity-100');
        } else {
            cartBadge.classList.remove('scale-100', 'opacity-100');
            cartBadge.classList.add('scale-0', 'opacity-0');
        }

        cartCountTitle.innerText = totalItems;
        cartSubtotal.innerText = formatCurrency(subtotalPrice);
        cartTotal.innerText = formatCurrency(subtotalPrice); // El envío es gratis
    }

    function changeQuantity(id, action) {
        const item = cart.find(item => item.id === id);
        if (!item) return;

        if (action === 'increase') {
            item.quantity += 1;
        } else if (action === 'decrease') {
            item.quantity -= 1;
            if (item.quantity <= 0) {
                removeFromCart(id);
                return;
            }
        }
        updateCart();
    }

    function removeFromCart(id) {
        cart = cart.filter(item => item.id !== id);
        updateCart();
    }

    // === 4. COMPORTAMIENTO MENÚ MOBILE ===
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // === CARGA INICIAL ===
    renderCatalog();
    updateCart();
});