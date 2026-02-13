// MAIN.JS - Core functionality for Sensual website - UPDATED VERSION

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Sensual Beauty - Premium Cosmetics Website Loaded');
    
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Initialize all modules
    initDynamicHeader();
    initDropdownMenu();
    initScrollAnimations();
    initProductInteractions();
    initPageTransitions();
    initVideoBackground();
    initCyclingTooltips();
    initCartIconBehavior(); // ДОБАВЛЕНО: обработка иконки корзины
});

// ============================================
// 1. DYNAMIC GLASS HEADER - Hide/Show on scroll
// ============================================
function initDynamicHeader() {
    const header = document.getElementById('main-header');
    if (!header) return;
    
    let lastScrollTop = 0;
    const headerHeight = header.offsetHeight;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
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
        
        // Add animation class
        if (dropdown.classList.contains('active')) {
            dropdown.classList.add('bounce-in');
            setTimeout(() => dropdown.classList.remove('bounce-in'), 800);
        }
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
        
        // Click animation
        item.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = e.clientX - rect.left - size/2 + 'px';
            ripple.style.top = e.clientY - rect.top - size/2 + 'px';
            ripple.classList.add('btn-ripple-effect');
            
            this.appendChild(ripple);
            
            // Remove ripple after animation
            setTimeout(() => {
                ripple.remove();
            }, 600);
            
            // Close dropdown after delay
            setTimeout(() => {
                dropdown.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }, 300);
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
                    
                    // Add staggered animation to children if applicable
                    if (entry.target.classList.contains('stagger-container')) {
                        const children = entry.target.children;
                        Array.from(children).forEach((child, index) => {
                            child.style.animationDelay = `${index * 0.1}s`;
                        });
                    }
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
        // Проверяем, что кнопка находится в видимой области (не в модальном окне, которое скрыто)
        const isVisible = button.offsetParent !== null;
        
        if (!isVisible) return;
        
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation(); // Предотвращаем всплытие
            
            const productId = this.getAttribute('data-product-id');
            if (!productId) return;
            
            // Ищем информацию о продукте в ближайших родительских элементах
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
            
            // Если не нашли в DOM, проверяем глобальные данные продуктов
            if (!productName && window.SensualProducts) {
                const product = window.SensualProducts.products.find(p => p.id === productId);
                if (product) {
                    productName = product.name;
                    productPrice = product.price;
                }
            }
            
            // Create ripple effect
            createRippleEffect(this);
            
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
        
        // Hover effect
        button.addEventListener('mouseenter', function() {
            this.classList.add('floating-element-slow');
        });
        
        button.addEventListener('mouseleave', function() {
            this.classList.remove('floating-element-slow');
        });
    });
}

// Ripple effect for buttons
function createRippleEffect(button) {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size/2;
    const y = event.clientY - rect.top - size/2;
    
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
    // Проверяем наличие глобальной корзины
    if (window.SensualCart && typeof window.SensualCart.addItem === 'function') {
        // Используем глобальную корзину
        const productData = window.SensualProducts?.products.find(p => p.id === product.id);
        if (productData) {
            window.SensualCart.addItem(productData, product.quantity);
        }
    } else {
        // Fallback: сохраняем в sessionStorage
        console.log('Added to cart (fallback):', product);
        
        let cart = JSON.parse(sessionStorage.getItem('sensual-cart')) || [];
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += product.quantity;
        } else {
            cart.push(product);
        }
        
        sessionStorage.setItem('sensual-cart', JSON.stringify(cart));
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
// 6. VIDEO BACKGROUND - SIMPLE VERSION
// ============================================
function initVideoBackground() {
    const video = document.getElementById('hero-video');
    if (!video) return;
    
    // Simple video setup - autoplay muted loop
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    
    // Try to play the video
    const playPromise = video.play();
    
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            console.log('Video autoplay failed:', error);
            // If autoplay fails, show a play button
            showVideoPlayButton(video);
        });
    }
    
    // Handle video errors
    video.addEventListener('error', function() {
        console.log('Video failed to load, using fallback background');
        // Create fallback gradient background
        const videoContainer = document.querySelector('.video-container');
        if (videoContainer) {
            const fallback = document.createElement('div');
            fallback.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, 
                    var(--color-primary) 0%, 
                    var(--color-primary-dark) 50%, 
                    var(--color-primary) 100%);
                z-index: -2;
            `;
            videoContainer.appendChild(fallback);
        }
    });
    
    // Video loaded successfully
    video.addEventListener('loadeddata', function() {
        console.log('Video loaded and playing');
    });
}

// Show play button if autoplay is blocked
function showVideoPlayButton(video) {
    const videoContainer = document.querySelector('.video-container');
    if (!videoContainer) return;
    
    // Remove any existing play button
    const existingBtn = videoContainer.querySelector('.video-play-btn');
    if (existingBtn) existingBtn.remove();
    
    const playButton = document.createElement('button');
    playButton.className = 'video-play-btn glass-btn';
    playButton.innerHTML = '<i class="fas fa-play"></i> Play Video';
    playButton.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 3;
        padding: 15px 30px;
        font-size: 1.1rem;
        background: rgba(212, 175, 55, 0.2);
        border: 1px solid rgba(212, 175, 55, 0.4);
    `;
    
    playButton.addEventListener('click', function() {
        video.play()
            .then(() => {
                playButton.style.opacity = '0';
                playButton.style.visibility = 'hidden';
                setTimeout(() => playButton.remove(), 500);
            })
            .catch(error => {
                console.log('Manual play failed:', error);
            });
    });
    
    videoContainer.appendChild(playButton);
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
        }, 800); // Задержка соответствует длительности анимации fade-out
    }
    
    // Запустить автоматическое переключение
    function startTooltipCycle() {
        tooltipInterval = setInterval(nextTooltip, 4000); // Менять каждые 4 секунды
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
    
    // Добавить обработчики для индикаторов (ручное переключение)
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function() {
            stopTooltipCycle();
            showTooltip(index);
            
            // Перезапустить цикл через 10 секунд
            setTimeout(startTooltipCycle, 10000);
        });
    });
    
    // Остановить цикл при наведении на тултип
    tooltips.forEach(tooltip => {
        tooltip.addEventListener('mouseenter', stopTooltipCycle);
        tooltip.addEventListener('mouseleave', startTooltipCycle);
    });
    
    // Остановить цикл при наведении на индикаторы
    const indicatorsContainer = document.querySelector('.tooltip-indicators');
    if (indicatorsContainer) {
        indicatorsContainer.addEventListener('mouseenter', stopTooltipCycle);
        indicatorsContainer.addEventListener('mouseleave', startTooltipCycle);
    }
}

// ============================================
// 8. CART ICON BEHAVIOR - НОВЫЙ МОДУЛЬ
// ============================================
function initCartIconBehavior() {
    // Проверяем, находимся ли мы на странице корзины
    const isCartPage = window.location.pathname.includes('cart.html') || 
                       window.location.href.includes('cart.html');
    
    if (isCartPage) {
        // Находим все иконки корзины
        const cartIcons = document.querySelectorAll('.cart-icon');
        
        cartIcons.forEach(icon => {
            // Сохраняем оригинальный href (если есть)
            const originalHref = icon.getAttribute('href');
            if (originalHref) {
                icon.setAttribute('data-original-href', originalHref);
            }
            
            // Меняем ссылку на магазин
            icon.setAttribute('href', 'shop.html');
            icon.setAttribute('title', 'Continue Shopping');
            
            // Добавляем специальный класс для стилизации
            icon.classList.add('cart-icon-close');
            
            // Добавляем атрибут для подсказки
            icon.setAttribute('data-tooltip', 'Click to continue shopping');
            
            // Добавляем обработчик для анимации
            icon.addEventListener('click', function(e) {
                // Показываем анимацию закрытия
                this.classList.add('cart-bounce-gold');
                setTimeout(() => {
                    this.classList.remove('cart-bounce-gold');
                }, 800);
            });
        });
        
        // Добавляем CSS стили для иконки корзины на странице корзины
        addCartIconStyles();
    }
}

// Добавляем стили для иконки корзины
function addCartIconStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Стили для иконки корзины на странице корзины */
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
        
        /* Анимация для иконки корзины при клике */
        @keyframes cartBackToShop {
            0% {
                transform: scale(1) rotate(0deg);
                color: var(--text-gray);
            }
            25% {
                transform: scale(1.2) rotate(-15deg);
                color: var(--color-gold);
            }
            50% {
                transform: scale(1.1) rotate(0deg);
                color: var(--color-gold);
            }
            75% {
                transform: scale(1.2) rotate(15deg);
                color: var(--color-gold);
            }
            100% {
                transform: scale(1) rotate(0deg);
                color: var(--text-gray);
            }
        }
        
        .cart-bounce-gold {
            animation: cartBackToShop 0.6s ease;
        }
        
        /* Уведомление о добавлении в корзину */
        .cart-notification-temp {
            animation: fadeInRight 0.5s ease forwards !important;
        }
        
        @keyframes fadeInRight {
            from {
                opacity: 0;
                transform: translateX(100px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes fadeOutRight {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(100px);
            }
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