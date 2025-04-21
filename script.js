// Данные товаров
const products = [
    {
        id: 1,
        name: "A2 Постер CSM Elite 2023",
        price: 500,
        image: "img/csmA2.jpg",
        rating: 4.5,
        reviews: 1254,
        category: "posters",
        dateAdded: "2023-05-15"
    },
    {
        id: 2,
        name: "A3 Постер CSM Elite 2023",
        price: 350,
        image: "img/csmA3.jpg",
        rating: 4.8,
        reviews: 876,
        category: "posters",
        dateAdded: "2023-06-20"
    },
    {
        id: 3,
        name: "Наклейка CSM Виниловая",
        price: 60,
        image: "img/csmsk.jpg",
        rating: 4.9,
        reviews: 345,
        category: "merch",
        dateAdded: "2023-07-10"
    },
    {
        id: 4,
        name: "Кружка CSM",
        price: 600,
        image: "img/mug.jpg",
        rating: 4.3,
        reviews: 432,
        category: "merch",
        dateAdded: "2023-04-05"
    },
    {
        id: 5,
        name: "A3 Постер CSM Legends",
        price: 700,
        image: "img/posterA3.jpg",
        rating: 4.7,
        reviews: 765,
        category: "posters",
        dateAdded: "2023-08-12"
    },
    {
        id: 6,
        name: "Кепка CSM",
        price: 900,
        image: "img/cap.jpg",
        rating: 4.4,
        reviews: 321,
        category: "merch",
        dateAdded: "2023-03-18"
    },
    {
        id: 7,
        name: "A1 Постер CSM Champions",
        price: 1000,
        image: "img/posterA1.jpg",
        rating: 4.9,
        reviews: 654,
        category: "posters",
        dateAdded: "2023-10-05"
    }
];

// Корзина
let cart = [];

// DOM элементы
const productGrid = document.getElementById('product-grid');
const cartCount = document.getElementById('cart-count');
const cartItems = document.getElementById('cart-items');
const totalPrice = document.getElementById('total-price');
const cartDropdown = document.getElementById('cart-dropdown');
const cartIcon = document.getElementById('cart-icon');
const applyFiltersBtn = document.getElementById('apply-filters');
const resetFiltersBtn = document.getElementById('reset-filters');
const sortSelect = document.getElementById('sort-select');

// Отображение товаров
function displayProducts(productsToDisplay = products) {
    productGrid.innerHTML = productsToDisplay.map(product => `
        <div class="product-card" data-id="${product.id}" data-category="${product.category}" data-price="${product.price}" data-rating="${product.rating}" data-date="${product.dateAdded}">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-rating">
                    ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}
                    <span>(${product.reviews.toLocaleString()})</span>
                </div>
                <div class="product-price">${product.price} ₽</div>
                <button class="add-to-cart" data-id="${product.id}">В корзину</button>
            </div>
        </div>
    `).join('');

    // Добавляем обработчики событий
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCartHandler);
    });
}

// Обработчик добавления в корзину
function addToCartHandler(event) {
    const productId = parseInt(event.target.dataset.id);
    const product = products.find(p => p.id === productId);
    
    if (product) {
        addToCart(product);
        event.target.textContent = '✓ Добавлено';
        event.target.classList.add('added-to-cart');
        setTimeout(() => {
            event.target.textContent = 'В корзину';
            event.target.classList.remove('added-to-cart');
        }, 1000);
    }
}

// Добавление товара в корзину
function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    updateCart();
}

// Обновление корзины
function updateCart() {
    // Обновляем счетчик
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Обновляем список товаров
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">${item.quantity} × ${item.price} ₽</div>
            </div>
            <button class="remove-item" data-id="${item.id}">×</button>
        </div>
    `).join('');
    
    // Обновляем общую сумму
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalPrice.textContent = total;
    
    // Сохраняем в localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Добавляем обработчики для кнопок удаления
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', removeFromCart);
    });
}

// Удаление из корзины
function removeFromCart(event) {
    const productId = parseInt(event.target.dataset.id);
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Показ/скрытие корзины
cartIcon.addEventListener('click', () => {
    cartDropdown.classList.toggle('show');
});

// Закрытие корзины при клике вне ее
document.addEventListener('click', (event) => {
    if (!cartIcon.contains(event.target)) {
        cartDropdown.classList.remove('show');
    }
});

// Оформление заказа
document.getElementById('checkout-btn').addEventListener('click', () => {
    if (cart.length > 0) {
        alert(`Заказ оформлен! Сумма: ${totalPrice.textContent} ₽`);
        cart = [];
        updateCart();
        cartDropdown.classList.remove('show');
    } else {
        alert('Корзина пуста!');
    }
});

// Фильтрация товаров
function filterProducts() {
    // Получаем минимальную и максимальную цену
    const minPrice = parseInt(document.getElementById('min-price').value) || 0;
    const maxPrice = parseInt(document.getElementById('max-price').value) || Infinity;
    
    // Получаем выбранные категории
    const selectedCategories = Array.from(
        document.querySelectorAll('input[name="category"]:checked')
    ).map(checkbox => checkbox.value);
    
    // Фильтруем товары
    let filteredProducts = products.filter(product => 
        product.price >= minPrice && product.price <= maxPrice
    );
    
    // Если выбраны категории, применяем фильтр по категориям
    if (selectedCategories.length > 0) {
        filteredProducts = filteredProducts.filter(product => 
            selectedCategories.includes(product.category)
        );
    }
    
    // Сортируем товары
    sortProducts(filteredProducts);
}

// Сортировка товаров
function sortProducts(productsToSort) {
    const sortOption = sortSelect.value;
    let sortedProducts = [...productsToSort];
    
    switch(sortOption) {
        case 'price-asc':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            sortedProducts.sort((a, b) => b.rating - a.rating);
            break;
        case 'newest':
            sortedProducts.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
            break;
        case 'popular':
        default:
            // По умолчанию сортируем по количеству отзывов (популярность)
            sortedProducts.sort((a, b) => b.reviews - a.reviews);
    }
    
    displayProducts(sortedProducts);
}

// Сброс фильтров
function resetFilters() {
    document.getElementById('min-price').value = '';
    document.getElementById('max-price').value = '';
    document.querySelectorAll('input[name="category"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    sortSelect.value = 'popular';
    filterProducts();
}

// Переключение темы
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Приоритет: сохраненная тема > системная > светлая
    const theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    html.setAttribute('data-theme', theme);
    if (themeToggle) themeToggle.checked = (theme === 'dark');
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    // Загружаем товары
    displayProducts();
    
    // Восстанавливаем корзину из localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }
    
    // Настройка фильтров
    applyFiltersBtn.addEventListener('click', filterProducts);
    resetFiltersBtn.addEventListener('click', resetFilters);
    sortSelect.addEventListener('change', () => filterProducts());
    
    // Настройка темы
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    
    if (themeToggle) {
        themeToggle.addEventListener('change', function() {
            const newTheme = this.checked ? 'dark' : 'light';
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }
    
    // Слушатель системных изменений темы
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
            html.setAttribute('data-theme', e.matches ? 'dark' : 'light');
        }
    });
    
    initTheme();
});
// Закрытие мобильного меню при клике вне его
document.addEventListener('click', function(e) {
    const menu = document.querySelector('.categories');
    const toggle = document.getElementById('menu-toggle');
    
    if (!menu.contains(e.target) && e.target !== toggle) {
        menu.classList.remove('active');
    }
});
