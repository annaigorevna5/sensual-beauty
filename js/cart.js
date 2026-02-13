// CART.JS - Complete shopping cart functionality for Sensual Beauty

class ShoppingCart {
    constructor() {
        this.cart = this.loadCart();
        this.init();
    }

    // Initialize cart functionality
    init() {
        this.updateCartDisplay();
        this.setupEventListeners();
        this.setupCartIconBehavior(); // Добавляем обработку иконки корзины
    }

    // Setup cart icon behavior
    setupCartIconBehavior() {
        // Находим все иконки корзины
        const cartIcons = document.querySelectorAll('.cart-icon');
        
        cartIcons.forEach(icon => {
            // Проверяем, находимся ли мы на странице корзины
            if (window.location.pathname.includes('cart.html')) {
                // На странице корзины - меняем поведение иконки
                const originalHref = icon.getAttribute('href');
                icon.setAttribute('data-original-href', originalHref);
                icon.setAttribute('href', 'shop.html');
                icon.setAttribute('title', 'Continue Shopping');
                
                // Добавляем специальный класс для стилизации
                icon.classList.add('cart-icon-close');
            }
        });
    }

    // Load cart from localStorage
    loadCart() {
        try {
            const cartData = localStorage.getItem('sensual-cart');
            return cartData ? JSON.parse(cartData) : [];
        } catch (error) {
            console.error('Error loading cart:', error);
            return [];
        }
    }

    // Save cart to localStorage
    saveCart() {
        try {
            localStorage.setItem('sensual-cart', JSON.stringify(this.cart));
        } catch (error) {
            console.error('Error saving cart:', error);
        }
    }

    // Add item to cart
    addItem(product, quantity = 1) {
        const existingItemIndex = this.cart.findIndex(item => item.id === product.id);
        
        if (existingItemIndex > -1) {
            // Update quantity if item already exists
            this.cart[existingItemIndex].quantity += quantity;
        } else {
            // Add new item
            this.cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: quantity,
                image: product.image,
                category: product.category
            });
        }
        
        this.saveCart();
        this.updateCartDisplay();
        this.showNotification(`${product.name} added to cart`);
        
        // Dispatch custom event for other components
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: this.cart }));
        
        return this.cart;
    }

    // Remove item from cart
    removeItem(productId) {
        const initialLength = this.cart.length;
        this.cart = this.cart.filter(item => item.id !== productId);
        
        if (this.cart.length < initialLength) {
            this.saveCart();
            this.updateCartDisplay();
            this.showNotification('Item removed from cart');
            
            window.dispatchEvent(new CustomEvent('cartUpdated', { detail: this.cart }));
        }
        
        return this.cart;
    }

    // Update item quantity
    updateQuantity(productId, quantity) {
        const itemIndex = this.cart.findIndex(item => item.id === productId);
        
        if (itemIndex > -1) {
            if (quantity <= 0) {
                this.removeItem(productId);
            } else {
                this.cart[itemIndex].quantity = quantity;
                this.saveCart();
                this.updateCartDisplay();
                
                window.dispatchEvent(new CustomEvent('cartUpdated', { detail: this.cart }));
            }
        }
        
        return this.cart;
    }

    // Clear entire cart
    clearCart() {
        this.cart = [];
        this.saveCart();
        this.updateCartDisplay();
        
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: this.cart }));
        this.showNotification('Cart cleared');
        
        return this.cart;
    }

    // Get cart total
    getTotal() {
        return this.cart.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    }

    // Get item count
    getItemCount() {
        return this.cart.reduce((count, item) => count + item.quantity, 0);
    }

    // Update cart display in header
    updateCartDisplay() {
        const cartCountElements = document.querySelectorAll('.cart-count');
        const cartTotalElements = document.querySelectorAll('.cart-total');
        const itemCount = this.getItemCount();
        
        // Update count badge
        cartCountElements.forEach(element => {
            element.textContent = itemCount;
            element.style.display = itemCount > 0 ? 'flex' : 'none';
        });
        
        // Update total if elements exist
        if (cartTotalElements.length > 0) {
            const total = this.getTotal();
            cartTotalElements.forEach(element => {
                element.textContent = `$${total.toFixed(2)}`;
            });
        }
    }

    // Show notification
    showNotification(message) {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.cart-notification');
        existingNotifications.forEach(notification => notification.remove());
        
        // Create new notification
        const notification = document.createElement('div');
        notification.className = 'cart-notification glass-panel';
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 15px 25px;
            z-index: 9999;
            animation: fadeInRight 0.5s ease;
            color: var(--text-light);
            background: rgba(10, 35, 34, 0.95);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(212, 175, 55, 0.3);
            min-width: 250px;
            max-width: 350px;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <i class="fas fa-check-circle" style="color: var(--color-gold); font-size: 1.2rem;"></i>
                <div>
                    <p style="margin: 0; font-weight: 500;">${message}</p>
                    <p style="margin: 5px 0 0 0; font-size: 0.9rem; opacity: 0.8;">
                        ${this.getItemCount()} items • $${this.getTotal().toFixed(2)}
                    </p>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'fadeOutRight 0.5s ease forwards';
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }

    // Setup event listeners
    setupEventListeners() {
        // Listen for add to cart events
        document.addEventListener('click', (e) => {
            const addToCartBtn = e.target.closest('.add-to-cart-btn');
            if (addToCartBtn && addToCartBtn.dataset.productId) {
                e.preventDefault();
                this.handleAddToCart(addToCartBtn);
            }
        });
        
        // Listen for cart update events from other components
        window.addEventListener('cartUpdated', (e) => {
            this.cart = e.detail;
            this.updateCartDisplay();
        });
    }

    // Handle add to cart button click
    handleAddToCart(button) {
        const productId = button.dataset.productId;
        const product = window.SensualProducts?.products.find(p => 
            p.id === productId || `product-${p.id}` === productId
        );
        
        if (product) {
            // Add animation to button
            const originalHTML = button.innerHTML;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';
            button.disabled = true;
            
            // Simulate API delay
            setTimeout(() => {
                this.addItem(product);
                
                // Restore button
                button.innerHTML = originalHTML;
                button.disabled = false;
                
                // Add success animation
                button.classList.add('gold-pulse');
                setTimeout(() => button.classList.remove('gold-pulse'), 2000);
            }, 500);
        } else {
            console.error('Product not found:', productId);
            this.showNotification('Product not available');
        }
    }

    // Render cart items (for cart page)
    renderCartItems(container) {
        if (!container) return;
        
        if (this.cart.length === 0) {
            container.innerHTML = `
                <div class="empty-cart glass-panel" style="text-align: center; padding: 60px 30px;">
                    <i class="fas fa-shopping-bag" style="font-size: 3rem; color: var(--color-gold); opacity: 0.5; margin-bottom: 20px;"></i>
                    <h3 style="margin-bottom: 15px; color: var(--text-light);">Your cart is empty</h3>
                    <p style="color: var(--text-gray); margin-bottom: 30px;">Add some luxurious products to your cart</p>
                    <a href="shop.html" class="glass-btn">
                        <i class="fas fa-store"></i> Continue Shopping
                    </a>
                </div>
            `;
            return;
        }
        
        let html = `
            <div class="cart-items">
                <div class="cart-header" style="display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; padding: 20px; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                    <div style="font-weight: 600;">Product</div>
                    <div style="font-weight: 600; text-align: center;">Price</div>
                    <div style="font-weight: 600; text-align: center;">Quantity</div>
                    <div style="font-weight: 600; text-align: right;">Total</div>
                </div>
        `;
        
        this.cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            html += `
                <div class="cart-item glass-panel" data-product-id="${item.id}" 
                     style="display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; 
                            align-items: center; padding: 25px 20px; margin: 15px 0;
                            animation: fadeInScale 0.5s ease;">
                    
                    <div class="cart-item-info" style="display: flex; align-items: center; gap: 20px;">
                        <button class="remove-item-btn" data-product-id="${item.id}"
                                style="background: none; border: none; color: var(--text-gray); cursor: pointer; 
                                       width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;
                                       border-radius: 50%; transition: all 0.3s ease;">
                            <i class="fas fa-times"></i>
                        </button>
                        
                        <div style="width: 60px; height: 60px; border-radius: 8px; overflow: hidden; flex-shrink: 0;">
                            <img src="${item.image || 'images/products/default.jpg'}" 
                                 alt="${item.name}"
                                 style="width: 100%; height: 100%; object-fit: cover;"
                                 onerror="this.onerror=null; this.src='images/products/default.jpg';">
                        </div>
                        
                        <div class="cart-item-details">
                            <h4 style="margin: 0 0 5px 0; color: var(--text-light);">${item.name}</h4>
                            <p style="margin: 0; font-size: 0.9rem; color: var(--text-gray);">
                                ${item.category ? window.SensualProducts?.productCategories.find(c => c.id === item.category)?.name || '' : ''}
                            </p>
                        </div>
                    </div>
                    
                    <div class="cart-item-price" style="text-align: center; color: var(--text-light);">
                        $${item.price.toFixed(2)}
                    </div>
                    
                    <div class="cart-item-quantity" style="text-align: center;">
                        <div class="quantity-controls" style="display: inline-flex; align-items: center; gap: 10px;">
                            <button class="quantity-decrease glass-btn" data-product-id="${item.id}"
                                    style="padding: 5px 12px; font-size: 1rem;">-</button>
                            <span class="quantity-display" style="min-width: 40px; text-align: center; font-weight: 600;">${item.quantity}</span>
                            <button class="quantity-increase glass-btn" data-product-id="${item.id}"
                                    style="padding: 5px 12px; font-size: 1rem;">+</button>
                        </div>
                    </div>
                    
                    <div class="cart-item-total" style="text-align: right; color: var(--color-gold); font-weight: 600;">
                        $${itemTotal.toFixed(2)}
                    </div>
                </div>
            `;
        });
        
        // Cart summary
        const subtotal = this.getTotal();
        const shipping = subtotal > 100 ? 0 : 15;
        const tax = subtotal * 0.08; // 8% tax
        const total = subtotal + shipping + tax;
        
        html += `
            </div>
            
            <div class="cart-summary glass-panel" style="margin-top: 30px; padding: 30px;">
                <h3 style="margin-bottom: 25px; color: var(--text-light);">Order Summary</h3>
                
                <div class="summary-row" style="display: flex; justify-content: space-between; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                    <span style="color: var(--text-gray);">Subtotal</span>
                    <span style="color: var(--text-light); font-weight: 600;">$${subtotal.toFixed(2)}</span>
                </div>
                
                <div class="summary-row" style="display: flex; justify-content: space-between; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                    <span style="color: var(--text-gray);">Shipping</span>
                    <span style="color: ${shipping === 0 ? 'var(--color-gold)' : 'var(--text-light)'}; font-weight: 600;">
                        ${shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                    </span>
                </div>
                
                <div class="summary-row" style="display: flex; justify-content: space-between; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                    <span style="color: var(--text-gray);">Tax</span>
                    <span style="color: var(--text-light); font-weight: 600;">$${tax.toFixed(2)}</span>
                </div>
                
                <div class="summary-row" style="display: flex; justify-content: space-between; margin: 25px 0; padding-top: 20px; border-top: 2px solid rgba(212, 175, 55, 0.3);">
                    <span style="color: var(--text-light); font-size: 1.2rem; font-weight: 600;">Total</span>
                    <span style="color: var(--color-gold); font-size: 1.5rem; font-weight: 700;">$${total.toFixed(2)}</span>
                </div>
                
                <div class="summary-actions" style="display: flex; gap: 15px; margin-top: 30px;">
                    <button class="clear-cart-btn glass-btn" style="background: rgba(255, 255, 255, 0.05);">
                        <i class="fas fa-trash"></i> Clear Cart
                    </button>
                    <button class="checkout-btn glass-btn" style="flex-grow: 1; background: rgba(212, 175, 55, 0.2);">
                        <i class="fas fa-lock"></i> Proceed to Checkout
                    </button>
                </div>
                
                ${subtotal < 100 ? `
                    <div class="shipping-note" style="margin-top: 20px; padding: 15px; background: rgba(212, 175, 55, 0.1); border-radius: 8px; text-align: center;">
                        <i class="fas fa-shipping-fast" style="color: var(--color-gold); margin-right: 8px;"></i>
                        Add $${(100 - subtotal).toFixed(2)} more for FREE shipping!
                    </div>
                ` : ''}
            </div>
        `;
        
        container.innerHTML = html;
        
        // Add event listeners to cart controls
        this.addCartItemEventListeners(container);
    }

    // Add event listeners to cart items
    addCartItemEventListeners(container) {
        // Remove item buttons
        container.querySelectorAll('.remove-item-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.currentTarget.dataset.productId;
                this.removeItem(productId);
                this.renderCartItems(container);
            });
        });
        
        // Quantity decrease buttons
        container.querySelectorAll('.quantity-decrease').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.currentTarget.dataset.productId;
                const item = this.cart.find(item => item.id === productId);
                if (item) {
                    this.updateQuantity(productId, item.quantity - 1);
                    this.renderCartItems(container);
                }
            });
        });
        
        // Quantity increase buttons
        container.querySelectorAll('.quantity-increase').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.currentTarget.dataset.productId;
                const item = this.cart.find(item => item.id === productId);
                if (item) {
                    this.updateQuantity(productId, item.quantity + 1);
                    this.renderCartItems(container);
                }
            });
        });
        
        // Clear cart button
        const clearCartBtn = container.querySelector('.clear-cart-btn');
        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to clear your cart?')) {
                    this.clearCart();
                    this.renderCartItems(container);
                }
            });
        }
        
        // Checkout button
        const checkoutBtn = container.querySelector('.checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                this.handleCheckout();
            });
        }
    }

    // Handle checkout process
    handleCheckout() {
        if (this.cart.length === 0) {
            this.showNotification('Your cart is empty');
            return;
        }
        
        // In a real app, this would redirect to payment gateway
        // For demo, we'll show a success modal
        this.showCheckoutModal();
    }

    // Show checkout success modal
    showCheckoutModal() {
        const modal = document.createElement('div');
        modal.className = 'checkout-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(10, 35, 34, 0.95);
            backdrop-filter: blur(20px);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeInScale 0.5s ease;
        `;
        
        const orderId = 'SEN-' + Date.now().toString().slice(-8);
        
        modal.innerHTML = `
            <div class="checkout-content glass-panel" 
                 style="max-width: 500px; width: 90%; padding: 40px; text-align: center;">
                
                <div class="checkout-icon" style="margin-bottom: 25px;">
                    <div style="width: 80px; height: 80px; background: var(--color-gold); 
                                border-radius: 50%; display: inline-flex; align-items: center; 
                                justify-content: center; animation: bounceInLuxury 0.8s ease;">
                        <i class="fas fa-check" style="font-size: 2rem; color: var(--color-primary-dark);"></i>
                    </div>
                </div>
                
                <h2 style="margin-bottom: 15px; color: var(--text-light);">Order Confirmed!</h2>
                <p style="color: var(--text-gray); margin-bottom: 25px;">
                    Thank you for your purchase. Your order has been confirmed and will be processed shortly.
                </p>
                
                <div class="order-details glass-panel" 
                     style="background: rgba(255, 255, 255, 0.05); padding: 20px; border-radius: 12px; margin-bottom: 30px;">
                    <p style="margin: 0 0 10px 0; color: var(--text-gray);">Order Number</p>
                    <p style="margin: 0; font-size: 1.5rem; color: var(--color-gold); font-weight: 600;">${orderId}</p>
                    <p style="margin: 15px 0 0 0; color: var(--text-gray);">Total Amount</p>
                    <p style="margin: 0; font-size: 1.8rem; color: var(--text-light); font-weight: 700;">$${this.getTotal().toFixed(2)}</p>
                </div>
                
                <p style="color: var(--text-gray); font-size: 0.9rem; margin-bottom: 30px;">
                    A confirmation email has been sent to your email address.
                </p>
                
                <div class="modal-actions" style="display: flex; gap: 15px;">
                    <button class="modal-continue glass-btn" style="flex-grow: 1;">
                        <i class="fas fa-store"></i> Continue Shopping
                    </button>
                    <button class="modal-close glass-btn" 
                            style="background: rgba(255, 255, 255, 0.05);">
                        <i class="fas fa-times"></i> Close
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners to modal buttons
        modal.querySelector('.modal-continue').addEventListener('click', () => {
            this.clearCart();
            modal.remove();
            window.location.href = 'shop.html';
        });
        
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.remove();
        });
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    // Export cart data
    exportCartData() {
        return {
            items: this.cart,
            total: this.getTotal(),
            itemCount: this.getItemCount()
        };
    }
}

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.SensualCart = new ShoppingCart();
    
    // If on cart page, render cart items
    const cartContainer = document.getElementById('cart-items-container');
    if (cartContainer) {
        window.SensualCart.renderCartItems(cartContainer);
    }
});

// Make cart available globally
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ShoppingCart;
}