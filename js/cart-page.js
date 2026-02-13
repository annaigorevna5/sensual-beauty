// CART-PAGE.JS - Cart page specific functionality

class CartPage {
    constructor() {
        this.cart = window.SensualCart;
        this.products = window.SensualProducts?.products || [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderRecommendedProducts();
        this.updateCartSummary();
        
        // Listen for cart updates
        window.addEventListener('cartUpdated', () => {
            this.updateCartSummary();
        });
    }

    setupEventListeners() {
        // Continue shopping button
        const continueBtn = document.querySelector('.continue-shopping');
        if (continueBtn) {
            continueBtn.addEventListener('click', () => {
                window.location.href = 'shop.html';
            });
        }
        
        // Proceed to checkout button
        const checkoutBtn = document.getElementById('proceed-checkout');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                this.handleCheckout();
            });
        }
    }

    updateCartSummary() {
        if (!this.cart) return;
        
        const cartData = this.cart.exportCartData();
        const subtotal = cartData.total;
        const tax = subtotal * 0.08; // 8% tax
        const total = subtotal + tax;
        
        // Update item count
        const itemCount = document.querySelector('.item-count');
        if (itemCount) {
            itemCount.textContent = `${cartData.itemCount} ${cartData.itemCount === 1 ? 'item' : 'items'}`;
        }
        
        // Update summary amounts
        const subtotalEl = document.querySelector('.subtotal-amount');
        const taxEl = document.querySelector('.tax-amount');
        const totalEl = document.querySelector('.grand-total-amount');
        
        if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
        if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
        
        // Update shipping info if needed
        const shippingEl = document.querySelector('.shipping-amount');
        if (shippingEl) {
            if (subtotal >= 100) {
                shippingEl.textContent = 'FREE';
                shippingEl.style.color = 'var(--color-gold)';
            } else {
                shippingEl.textContent = '$15.00';
                shippingEl.style.color = 'var(--text-light)';
            }
        }
    }

    renderRecommendedProducts() {
        const container = document.getElementById('recommended-products');
        if (!container) return;
        
        // Get 4 random products (excluding those already in cart)
        const cartProductIds = this.cart?.cart?.map(item => item.id) || [];
        const availableProducts = this.products.filter(p => !cartProductIds.includes(p.id));
        
        if (availableProducts.length === 0) {
            container.style.display = 'none';
            return;
        }
        
        // Shuffle and get first 4
        const shuffled = [...availableProducts].sort(() => 0.5 - Math.random());
        const recommended = shuffled.slice(0, 4);
        
        let html = '';
        recommended.forEach(product => {
            const category = window.SensualProducts?.productCategories.find(c => c.id === product.category);
            
            html += `
                <div class="recommended-product glass-panel animate-card">
                    <div class="recommended-image" style="height: 180px; overflow: hidden; border-radius: 12px; position: relative;">
                        <img src="${product.image || 'images/products/default.jpg'}" 
                             alt="${product.name}"
                             style="width: 100%; height: 100%; object-fit: cover;"
                             onerror="this.onerror=null; this.src='images/products/default.jpg';">
                        <div class="image-overlay" style="
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            background: linear-gradient(to bottom, transparent 50%, rgba(10, 35, 34, 0.7) 100%);
                        "></div>
                    </div>
                    
                    <div style="padding: 20px;">
                        <div style="color: var(--color-gold); font-size: 0.85rem; margin-bottom: 5px;">
                            ${category?.name || ''}
                        </div>
                        <h4 style="margin: 0 0 10px 0; color: var(--text-light); font-size: 1.1rem;">
                            ${product.name}
                        </h4>
                        <div style="color: var(--color-gold); font-weight: 700; font-size: 1.2rem; margin-bottom: 15px;">
                            $${product.price.toFixed(2)}
                        </div>
                        <button class="add-to-cart-btn glass-btn" 
                                style="width: 100%; padding: 12px;"
                                data-product-id="${product.id}">
                            <i class="fas fa-shopping-bag"></i> Add to Cart
                        </button>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
        container.className = 'recommended-grid';
    }

    handleCheckout() {
        if (!this.cart || this.cart.getItemCount() === 0) {
            this.showNotification('Your cart is empty', 'error');
            return;
        }
        
        // Show checkout modal
        this.cart.handleCheckout();
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.cart-page-notification');
        existingNotifications.forEach(notification => notification.remove());
        
        // Create new notification
        const notification = document.createElement('div');
        notification.className = `cart-page-notification glass-panel ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 15px 25px;
            z-index: 9999;
            animation: fadeInRight 0.5s ease;
            color: var(--text-light);
            background: ${type === 'error' ? 'rgba(179, 57, 57, 0.9)' : 'rgba(10, 92, 90, 0.9)'};
            backdrop-filter: blur(20px);
            border: 1px solid ${type === 'error' ? 'rgba(255, 100, 100, 0.3)' : 'rgba(136, 211, 206, 0.3)'};
            min-width: 250px;
        `;
        
        const icon = type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <i class="fas ${icon}" style="font-size: 1.2rem;"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'fadeOutRight 0.5s ease forwards';
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }
}

// Initialize cart page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Initialize cart page
    window.CartPage = new CartPage();
});

// Add cart page specific styles
const cartPageStyles = `
    .cart-page {
        padding-top: var(--header-height);
    }
    
    .cart-hero {
        padding: 60px 0 40px;
        position: relative;
    }
    
    .cart-hero::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, 
            rgba(10, 35, 34, 0.9) 0%, 
            rgba(10, 92, 90, 0.7) 100%);
        z-index: -1;
    }
    
    .cart-title {
        font-size: 3rem;
        margin-bottom: 15px;
        text-align: center;
        background: linear-gradient(135deg, #fff 0%, var(--color-gold) 100%);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
    }
    
    .cart-subtitle {
        text-align: center;
        max-width: 500px;
        margin: 0 auto;
        color: var(--text-gray);
        font-size: 1.1rem;
    }
    
    .cart-content {
        padding: 40px 0 80px;
    }
    
    .cart-layout {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 40px;
    }
    
    .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
        padding-bottom: 20px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .section-header h2 {
        color: var(--text-light);
        display: flex;
        align-items: center;
        gap: 10px;
        margin: 0;
    }
    
    .cart-stats {
        display: flex;
        align-items: center;
        gap: 20px;
    }
    
    .item-count {
        color: var(--text-gray);
        font-size: 0.9rem;
    }
    
    .cart-items-container {
        min-height: 300px;
    }
    
    .cart-loading {
        text-align: center;
        padding: 60px 0;
    }
    
    .summary-sticky {
        position: sticky;
        top: calc(var(--header-height) + 20px);
    }
    
    .summary-header {
        padding: 25px;
        margin-bottom: 20px;
    }
    
    .summary-header h3 {
        color: var(--text-light);
        display: flex;
        align-items: center;
        gap: 10px;
        margin: 0 0 25px 0;
    }
    
    .summary-totals {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }
    
    .total-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 15px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }
    
    .total-row:last-child {
        border-bottom: none;
    }
    
    .total-row span:first-child {
        color: var(--text-gray);
    }
    
    .total-row span:last-child {
        color: var(--text-light);
        font-weight: 500;
    }
    
    .total-row.grand-total {
        padding-top: 15px;
        margin-top: 5px;
        border-top: 2px solid rgba(212, 175, 55, 0.3);
    }
    
    .grand-total span:first-child {
        color: var(--text-light);
        font-size: 1.1rem;
        font-weight: 600;
    }
    
    .grand-total span:last-child {
        color: var(--color-gold);
        font-size: 1.3rem;
        font-weight: 700;
    }
    
    .checkout-actions {
        display: flex;
        flex-direction: column;
        gap: 15px;
        margin-bottom: 25px;
    }
    
    .checkout-btn {
        padding: 18px;
        font-size: 1.1rem;
        font-weight: 600;
        background: rgba(212, 175, 55, 0.2);
    }
    
    .checkout-btn:hover {
        background: rgba(212, 175, 55, 0.3);
    }
    
    .payment-methods {
        background: rgba(255, 255, 255, 0.03);
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 25px;
        text-align: center;
    }
    
    .payment-icons {
        display: flex;
        justify-content: center;
        gap: 15px;
        font-size: 1.8rem;
        color: var(--text-gray);
    }
    
    .payment-icons i {
        transition: var(--transition-smooth);
    }
    
    .payment-icons i:hover {
        color: var(--color-gold);
        transform: translateY(-3px);
    }
    
    .shipping-info {
        padding: 20px;
    }
    
    .shipping-info h4 {
        color: var(--text-light);
        display: flex;
        align-items: center;
        gap: 10px;
        margin: 0 0 15px 0;
    }
    
    .shipping-list {
        list-style: none;
        padding: 0;
        margin: 0;
    }
    
    .shipping-list li {
        color: var(--text-gray);
        padding: 8px 0;
        padding-left: 25px;
        position: relative;
    }
    
    .shipping-list li::before {
        content: '✓';
        position: absolute;
        left: 0;
        color: var(--color-gold);
        font-weight: bold;
    }
    
    .recommended-section {
        padding: 60px 0 80px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .recommended-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 25px;
        margin-top: 40px;
    }
    
    .trust-section {
        padding: 60px 0 80px;
    }
    
    .trust-badges {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 30px;
        padding: 40px;
    }
    
    .trust-badge {
        text-align: center;
        padding: 20px;
    }
    
    .trust-badge i {
        font-size: 2.5rem;
        color: var(--color-gold);
        margin-bottom: 15px;
    }
    
    .trust-badge h4 {
        color: var(--text-light);
        margin: 0 0 8px 0;
        font-size: 1.1rem;
    }
    
    .trust-badge p {
        color: var(--text-gray);
        margin: 0;
        font-size: 0.9rem;
    }
    
    @media (max-width: 992px) {
        .cart-layout {
            grid-template-columns: 1fr;
        }
        
        .summary-sticky {
            position: static;
        }
    }
    
    @media (max-width: 768px) {
        .cart-title {
            font-size: 2.5rem;
        }
        
        .section-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
        }
        
        .cart-stats {
            width: 100%;
            justify-content: space-between;
        }
        
        .trust-badges {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            padding: 30px;
        }
    }
    
    @media (max-width: 480px) {
        .trust-badges {
            grid-template-columns: 1fr;
        }
    }
`;

// Add styles to document
const cartStyleSheet = document.createElement('style');
cartStyleSheet.textContent = cartPageStyles;
document.head.appendChild(cartStyleSheet);