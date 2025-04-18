// Данные товаров (имитация базы данных)
const products = [
    { 
        id: 1, 
        name: "A2 Постер CSM Elite 2023", 
        price: 500, 
        image: "img/csmA2.jpg",
        rating: 4.8,
        reviews: 1254,
        category: "Интерьер и декор",
    },
    { 
        id: 2, 
        name: "A3 Постер CSM Elite 2023", 
        price: 350, 
        image: "img/csmA3.jpg",
        rating: 4.9,
        reviews: 3567,
        category: "Интерьер и декор",
    },
    { 
        id: 3, 
        name: "Наклейка CSM Виниловая", 
        price: 60, 
        image: "img/csmsk.jpg",
        rating: 4.7,
        reviews: 8923,
        category: "Интерьер и декор",
    },

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
document.addEventListener('DOMContentLoaded', function() {
    const applyBtn = document.getElementById('apply-filters');
    
    applyBtn.addEventListener('click', function() {
        // Получаем выбранные категории
        const selectedCategories = Array.from(
            document.querySelectorAll('input[name="category"]:checked')
        ).map(checkbox => checkbox.value);
        
        // Получаем диапазон цен
        const minPrice = parseFloat(document.getElementById('min-price').value) || 0;
        const maxPrice = parseFloat(document.getElementById('max-price').value) || Infinity;
        
        // Фильтруем товары
        filterProducts(selectedCategories, minPrice, maxPrice);
    });
    
    function filterProducts(categories, minPrice, maxPrice) {
        const products = document.querySelectorAll('.product-card');
        
        products.forEach(product => {
            const productCategory = product.dataset.category;
            const productPrice = parseFloat(product.dataset.price);
            
            // Проверяем соответствие фильтрам
            const categoryMatch = categories.length === 0 || categories.includes(productCategory);
            const priceMatch = productPrice >= minPrice && productPrice <= maxPrice;
            
            if (categoryMatch && priceMatch) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });
    }
});

document.querySelector('.menu-toggle').addEventListener('click', () => {
    document.querySelector('.categories').classList.toggle('active');
});
console.log('Ширина экрана:', window.innerWidth, 'px');
console.log('Плотность пикселей:', window.devicePixelRatio);
console.log('User Agent:', navigator.userAgent);
