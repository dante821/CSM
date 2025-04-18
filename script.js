// Данные товаров (имитация базы данных)
const products = [
    { 
        id: 1, 
        name: "Смартфон Xiaomi Redmi Note 10 Pro 8/128GB", 
        price: 24990, 
        oldPrice: 27990, 
        image: "img/phone1.jpg",
        rating: 4.8,
        reviews: 1254,
        category: "Электроника",
        brand: "Xiaomi"
    },
    { 
        id: 2, 
        name: "Наушники Apple AirPods Pro", 
        price: 17990, 
        oldPrice: 19990, 
        image: "img/airpods.jpg",
        rating: 4.9,
        reviews: 3567,
        category: "Электроника",
        brand: "Apple"
    },
    { 
        id: 3, 
        name: "Фитнес-браслет Xiaomi Mi Band 6", 
        price: 3490, 
        oldPrice: 3990, 
        image: "img/miband.jpg",
        rating: 4.7,
        reviews: 8923,
        category: "Электроника",
        brand: "Xiaomi"
    },
    { 
        id: 4, 
        name: "Кроссовки мужские Nike Air Max", 
        price: 8990, 
        oldPrice: 10990, 
        image: "img/nike.jpg",
        rating: 4.6,
        reviews: 567,
        category: "Обувь",
        brand: "Nike"
    },
    { 
        id: 5, 
        name: "Футболка мужская Adidas", 
        price: 2490, 
        oldPrice: 2990, 
        image: "img/tshirt.jpg",
        rating: 4.5,
        reviews: 234,
        category: "Одежда",
        brand: "Adidas"
    },
    { 
        id: 6, 
        name: "Чехол для iPhone 13 Pro", 
        price: 990, 
        oldPrice: 1290, 
        image: "img/iphone-case.jpg",
        rating: 4.3,
        reviews: 456,
        category: "Аксессуары",
        brand: "Apple"
    },
    { 
        id: 7, 
        name: "Ноутбук ASUS VivoBook 15", 
        price: 54990, 
        oldPrice: 59990, 
        image: "img/laptop.jpg",
        rating: 4.7,
        reviews: 789,
        category: "Электроника",
        brand: "ASUS"
    },
    { 
        id: 8, 
        name: "Умные часы Samsung Galaxy Watch 4", 
        price: 19990, 
        oldPrice: 22990, 
        image: "img/galaxy-watch.jpg",
        rating: 4.8,
        reviews: 1234,
        category: "Электроника",
        brand: "Samsung"
    }
];

// Корзина
let cart = [];
// hueta 


// DOM элементы
const productsContainer = document.getElementById('products');
const cartCount = document.getElementById('cart-count');

// Отображение товаров
function displayProducts(productsToShow = products) {
    productsContainer.innerHTML = '';
    productsToShow.forEach(product => {
        const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;
        
        const productElement = document.createElement('div');
        productElement.className = 'product-card';
        productElement.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <div class="product-price">
                    <span class="current-price">${product.price.toLocaleString()} ₽</span>
                    ${product.oldPrice ? `<span class="old-price">${product.oldPrice.toLocaleString()} ₽</span>` : ''}
                    ${discount > 0 ? `<span class="discount">-${discount}%</span>` : ''}
                </div>
                <div class="product-title">${product.name}</div>
                <div class="product-rating">
                    ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))} 
                    <span class="reviews-count">(${product.reviews.toLocaleString()})</span>
                </div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">В корзину</button>
            </div>
        `;
        productsContainer.appendChild(productElement);
    });
}

// Добавление в корзину
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCart();
    showAddedToCart(product.name);
}

// Обновление корзины
function updateCart() {
    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
}

// Показ уведомления о добавлении в корзину
function showAddedToCart(productName) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${productName} добавлен в корзину</span>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
    
    // Фильтрация по цене
    document.querySelector('.apply-filters').addEventListener('click', () => {
        const minPrice = parseInt(document.getElementById('min-price').value) || 0;
        const maxPrice = parseInt(document.getElementById('max-price').value) || Infinity;
        
        const filteredProducts = products.filter(product => 
            product.price >= minPrice && product.price <= maxPrice
        );
        
        displayProducts(filteredProducts);
    });


    
    // Сортировка
    document.querySelector('.sort-options select').addEventListener('change', (e) => {
        const sortedProducts = [...products];
        
        switch(e.target.value) {
            case 'По цене (сначала дешевые)':
                sortedProducts.sort((a, b) => a.price - b.price);
                break;
            case 'По цене (сначала дорогие)':
                sortedProducts.sort((a, b) => b.price - a.price);
                break;
            case 'По рейтингу':
                sortedProducts.sort((a, b) => b.rating - a.rating);
                break;
            case 'По новизне':
                // Здесь можно добавить дату добавления товара и сортировать по ней
                break;
        }
        
        displayProducts(sortedProducts);
    });
});
const themeButton = document.getElementById('theme-button');

document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;

    // Инициализация темы
    function initTheme() {
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        // Приоритет: сохраненная тема > системная > светлая
        const theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
        html.setAttribute('data-theme', theme);
        if (themeToggle) themeToggle.checked = (theme === 'dark');
    }

    // Переключение темы
    if (themeToggle) {
        themeToggle.addEventListener('change', function() {
            const newTheme = this.checked ? 'dark' : 'light';
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // Слушатель системных изменений
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
            html.setAttribute('data-theme', e.matches ? 'dark' : 'light');
        }
    });

    initTheme();
});