// MAIN.JS - Core functionality for Sensual website - UPDATED VERSION

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Sensual Beauty - Premium Cosmetics Website Loaded');
    
    // Set current year in footer
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
    // Initialize all modules (ВИДЕО ТЕПЕРЬ УПРАВЛЯЕТСЯ ИЗ INDEX.HTML)
    initDynamicHeader();
    initDropdownMenu();
    initScrollAnimations();
    initProductInteractions();
    initPageTransitions();
    // initVideoBackground(); // ОТКЛЮЧЕНО - видео управляется из index.html
    initCyclingTooltips();
    initCartIconBehavior();
});

// ============================================
// 1. DYNAMIC GLASS HEADER - Hide/Show on scroll
// ============================================
function initDynamicHeader() {
    const header = document.getElementById('main-header');
    if (!header) return;
    
    let lastScrollTop = 0;
    const headerHeight = header.offsetHeight;
    let ticking = false;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (!ticking) {
            window.requestAnimationFrame(function() {
                // Add scrolled class for background intensity
                if (scrollTop > 50) {
                    header.classList.add('header-scrolled');
                } else {
                    header.classList.remove('header-scrolled');
                }
                
                // Hide/show header based on scroll direction
                if (scrollTop > lastScrollTop && scrollTop > headerHeight) {
                    // Scrolling down
                    header.classList.add('header-hidden');
                } else {
                    // Scrolling up
                    header.classList.remove('header-hidden');
                }
                
                lastScrollTop = scrollTop;
                ticking = false;
            });
            
            ticking = true;
        }
    });
}

// ============================================
// 2. DROPDOWN CATEGORIES MENU
// ============================================
function initDropdownMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const dropdown = document.getElementById('categories-dropdown');
    
    if (!menuToggle || !dropdown) return;
    
    // Toggle dropdown on click
    menuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        dropdown.classList.toggle('active');
        menuToggle.setAttribute('aria-expanded', 
            dropdown.classList.contains('active') ? 'true' : 'false'
        );
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!dropdown.contains(e.target) && !menuToggle.contains(e.target)) {
            dropdown.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });
    
    // Add hover effects to dropdown items
    const dropdownItems = dropdown.querySelectorAll('.dropdown-link');
    dropdownItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.classList.add('glass-shine');
        });
        
        item.addEventListener('mouseleave', function() {
            this.classList.remove('glass-shine');
        });
    });
}

// ============================================
// 3. SCROLL TRIGGERED ANIMATIONS
// ============================================
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.scroll-animate');
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        animatedElements.forEach(el => observer.observe(el));
    } else {
        // Fallback for older browsers
        animatedElements.forEach(el => el.classList.add('animated'));
    }
}

// ============================================
// 4. PRODUCT INTERACTIONS - Add to Cart
// ============================================
function initProductInteractions() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    
    addToCartButtons.forEach(button => {
        // Проверяем, что кнопка не обработана ранее
        if (button.hasAttribute('data-initialized')) return;
        button.setAttribute('data-initialized', 'true');
        
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const productId = this.getAttribute('data-product-id');
            if (!productId) return;
            
            // Ищем информацию о продукте
            const productCard = this.closest('.product-card, .featured-product, .set-card, .product-preview');
            let productName = '';
            let productPrice = 0;
            
            if (productCard) {
                const nameElement = productCard.querySelector('.product-name, .set-name, h3, h4');
                const priceElement = productCard.querySelector('.product-price, .set-price, .price');
                
                if (nameElement) productName = nameElement.textContent.trim();
                if (priceElement) {
                    const priceText = priceElement.textContent.trim();
                    productPrice = parseFloat(priceText.replace('$', '')) || 0;
                }
            }
            
            // Create ripple effect
            createRippleEffect(this, e);
            
            // Add bounce animation to cart icon
            const cartIcon = document.querySelector('.cart-icon');
            if (cartIcon) {
                cartIcon.classList.add('cart-bounce');
                setTimeout(() => cartIcon.classList.remove('cart-bounce'), 600);
            }
            
            // Update cart count
            updateCartCount(1);
            
            // Add to cart logic
            addToCart({
                id: productId,
                name: productName,
                price: productPrice,
                quantity: 1
            });
            
            // Show feedback
            showAddToCartFeedback(this, productName);
        });
    });
}

// Ripple effect for buttons
function createRippleEffect(button, event) {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = (event?.clientX || rect.left + rect.width/2) - rect.left - size/2;
    const y = (event?.clientY || rect.top + rect.height/2) - rect.top - size/2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('btn-ripple-effect');
    
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Update cart count in header
function updateCartCount(increment = 0) {
    const cartCount = document.querySelector('.cart-count');
    if (!cartCount) return;
    
    let currentCount = parseInt(cartCount.textContent) || 0;
    currentCount += increment;
    cartCount.textContent = currentCount;
    
    // Show/hide badge based on count
    if (currentCount > 0) {
        cartCount.style.display = 'flex';
    } else {
        cartCount.style.display = 'none';
    }
    
    // Pulse animation
    cartCount.classList.add('gold-pulse');
    setTimeout(() => cartCount.classList.remove('gold-pulse'), 2000);
}

// Add item to cart
function addToCart(product) {
    console.log('Added to cart:', product);
    
    let cart = [];
    try {
        cart = JSON.parse(sessionStorage.getItem('sensual-cart')) || [];
    } catch (e) {
        console.log('Error reading cart:', e);
    }
    
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += product.quantity;
    } else {
        cart.push(product);
    }
    
    try {
        sessionStorage.setItem('sensual-cart', JSON.stringify(cart));
    } catch (e) {
        console.log('Error saving cart:', e);
    }
}

// Show feedback when product is added
function showAddToCartFeedback(button, productName) {
    const originalText = button.innerHTML;
    const originalBackground = button.style.background;
    const originalBorder = button.style.borderColor;
    
    button.innerHTML = `<i class="fas fa-check"></i> Added!`;
    button.style.background = 'rgba(212, 175, 55, 0.3)';
    button.style.borderColor = 'var(--color-gold)';
    button.disabled = true;
    
    // Create a temporary notification
    const notification = document.createElement('div');
    notification.className = 'glass-panel cart-notification-temp';
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 15px 25px;
        z-index: 9999;
        animation: fadeInRight 0.5s ease;
        color: var(--text-light);
        background: rgba(10, 92, 90, 0.9);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(136, 211, 206, 0.3);
        min-width: 250px;
        max-width: 350px;
    `;
    
    const itemCount = parseInt(document.querySelector('.cart-count')?.textContent || '0');
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
            <i class="fas fa-check-circle" style="color: var(--color-gold); font-size: 1.2rem;"></i>
            <div>
                <p style="margin: 0; font-weight: 500;">${productName || 'Product'} added to cart!</p>
                <p style="margin: 5px 0 0 0; font-size: 0.9rem; opacity: 0.8;">
                    ${itemCount} items in cart
                </p>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification and reset button
    setTimeout(() => {
        button.innerHTML = originalText;
        button.style.background = originalBackground;
        button.style.borderColor = originalBorder;
        button.disabled = false;
        
        notification.style.animation = 'fadeOutRight 0.5s ease forwards';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 500);
    }, 2000);
}

// ============================================
// 5. PAGE TRANSITIONS
// ============================================
function initPageTransitions() {
    // Add page transition class to main content
    const mainContent = document.querySelector('main');
    if (mainContent) {
        mainContent.classList.add('page-transition');
    }
    
    // Smooth internal link handling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// 6. VIDEO BACKGROUND - ОТКЛЮЧЕНО (УПРАВЛЯЕТСЯ ИЗ INDEX.HTML)
// ============================================
function initVideoBackground() {
    // Функция отключена для избежания конфликтов с inline-скриптом
    console.log('Video background handled by inline script');
    return;
}

// ============================================
// 7. CYCLING TOOLTIPS ON HERO SECTION
// ============================================
function initCyclingTooltips() {
    const tooltips = document.querySelectorAll('.tooltip');
    const indicators = document.querySelectorAll('.tooltip-indicator');
    
    if (tooltips.length === 0) return;
    
    let currentTooltip = 0;
    const totalTooltips = tooltips.length;
    let tooltipInterval;
    
    // Функция для показа конкретного тултипа
    function showTooltip(index) {
        // Скрыть все тултипы
        tooltips.forEach(tooltip => {
            tooltip.classList.remove('active', 'fade-in', 'fade-out');
            tooltip.style.opacity = '0';
            tooltip.style.visibility = 'hidden';
        });
        
        // Обновить индикаторы
        indicators.forEach(indicator => {
            indicator.classList.remove('active');
        });
        
        // Показать выбранный тултип
        if (tooltips[index]) {
            tooltips[index].classList.add('active', 'fade-in');
            tooltips[index].style.opacity = '1';
            tooltips[index].style.visibility = 'visible';
        }
        
        // Активировать соответствующий индикатор
        if (indicators[index]) {
            indicators[index].classList.add('active');
        }
        
        currentTooltip = index;
    }
    
    // Функция для переключения на следующий тултип
    function nextTooltip() {
        let nextIndex = currentTooltip + 1;
        if (nextIndex >= totalTooltips) {
            nextIndex = 0;
        }
        
        // Анимация исчезновения текущего
        if (tooltips[currentTooltip]) {
            tooltips[currentTooltip].classList.add('fade-out');
            tooltips[currentTooltip].classList.remove('fade-in');
        }
        
        // Задержка перед появлением следующего
        setTimeout(() => {
            showTooltip(nextIndex);
        }, 800);
    }
    
    // Запустить автоматическое переключение
    function startTooltipCycle() {
        tooltipInterval = setInterval(nextTooltip, 4000);
    }
    
    // Остановить автоматическое переключение
    function stopTooltipCycle() {
        if (tooltipInterval) {
            clearInterval(tooltipInterval);
        }
    }
    
    // Инициализация - показать первый тултип
    showTooltip(0);
    
    // Запустить цикл
    startTooltipCycle();
    
    // Добавить обработчики для индикаторов
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function() {
            stopTooltipCycle();
            showTooltip(index);
            setTimeout(startTooltipCycle, 10000);
        });
    });
    
    // Остановить цикл при наведении
    const container = document.querySelector('.tooltips-container');
    if (container) {
        container.addEventListener('mouseenter', stopTooltipCycle);
        container.addEventListener('mouseleave', startTooltipCycle);
    }
}

// ============================================
// 8. CART ICON BEHAVIOR
// ============================================
function initCartIconBehavior() {
    // Проверяем, находимся ли мы на странице корзины
    const isCartPage = window.location.pathname.includes('cart.html') || 
                       window.location.href.includes('cart.html');
    
    if (isCartPage) {
        // Находим все иконки корзины
        const cartIcons = document.querySelectorAll('.cart-icon');
        
        cartIcons.forEach(icon => {
            // Сохраняем оригинальный href
            const originalHref = icon.getAttribute('href');
            if (originalHref) {
                icon.setAttribute('data-original-href', originalHref);
            }
            
            // Меняем ссылку на магазин
            icon.setAttribute('href', 'shop.html');
            icon.setAttribute('title', 'Continue Shopping');
            
            // Добавляем специальный класс
            icon.classList.add('cart-icon-close');
            
            // Добавляем обработчик для анимации
            icon.addEventListener('click', function() {
                this.classList.add('cart-bounce-gold');
                setTimeout(() => {
                    this.classList.remove('cart-bounce-gold');
                }, 800);
            });
        });
        
        // Добавляем CSS стили
        addCartIconStyles();
    }
}

// Добавляем стили для иконки корзины
function addCartIconStyles() {
    // Проверяем, не добавлены ли уже стили
    if (document.getElementById('cart-icon-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'cart-icon-styles';
    style.textContent = `
        .cart-page .cart-icon,
        .cart-icon-close {
            position: relative;
            transition: all 0.3s ease;
        }
        
        .cart-page .cart-icon:hover,
        .cart-icon-close:hover {
            color: var(--color-gold);
            transform: scale(1.1);
        }
        
        .cart-page .cart-icon::after,
        .cart-icon-close::after {
            content: '← Back to Shop';
            position: absolute;
            bottom: -30px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(10, 35, 34, 0.95);
            backdrop-filter: blur(10px);
            color: var(--color-gold);
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 0.8rem;
            white-space: nowrap;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            pointer-events: none;
            z-index: 1000;
            border: 1px solid rgba(212, 175, 55, 0.3);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }
        
        .cart-page .cart-icon:hover::after,
        .cart-icon-close:hover::after {
            opacity: 1;
            visibility: visible;
            bottom: -35px;
        }
        
        @keyframes cartBackToShop {
            0% { transform: scale(1) rotate(0deg); color: var(--text-gray); }
            25% { transform: scale(1.2) rotate(-15deg); color: var(--color-gold); }
            50% { transform: scale(1.1) rotate(0deg); color: var(--color-gold); }
            75% { transform: scale(1.2) rotate(15deg); color: var(--color-gold); }
            100% { transform: scale(1) rotate(0deg); color: var(--text-gray); }
        }
        
        .cart-bounce-gold {
            animation: cartBackToShop 0.6s ease;
        }
        
        .cart-notification-temp {
            animation: fadeInRight 0.5s ease forwards !important;
        }
        
        @keyframes fadeInRight {
            from { opacity: 0; transform: translateX(100px); }
            to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes fadeOutRight {
            from { opacity: 1; transform: translateX(0); }
            to { opacity: 0; transform: translateX(100px); }
        }
        
        .btn-ripple-effect {
            position: absolute;
            border-radius: 50%;
            background: rgba(212, 175, 55, 0.4);
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
            z-index: 0;
        }
        
        @keyframes ripple {
            to { transform: scale(4); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// Export functions for use in other modules
window.SensualApp = {
    updateCartCount,
    addToCart,
    createRippleEffect,
    showAddToCartFeedback
};