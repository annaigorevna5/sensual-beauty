// SHOP.JS - Complete shop functionality for Sensual Beauty - FIXED VERSION
// FIX: Удалена вставка стилей (они теперь в HTML)

class ShopManager {
    constructor() {
        this.products = window.SensualProducts?.products || [];
        this.categories = window.SensualProducts?.productCategories || [];
        this.filteredProducts = [...this.products];
        this.currentFilters = {
            category: 'all',
            priceRange: [0, 500],
            tags: [],
            search: ''
        };
        this.sortBy = 'featured';
        this.visibleCount = 9;
        this.currentModal = null;
        
        this.init();
    }

    // Initialize shop
    init() {
        this.renderCategoryTabs();
        this.renderCategoryFilters();
        this.renderTagFilters();
        this.renderProducts();
        this.renderFeaturedProducts();
        this.setupEventListeners();
        this.setupFilterSidebar();
    }

    // Render category tabs
    renderCategoryTabs() {
        const container = document.getElementById('category-tabs');
        if (!container) return;
        
        let html = `
            <button class="category-tab active" data-category="all">
                <i class="fas fa-star"></i> All Products
            </button>
        `;
        
        this.categories.forEach(category => {
            const productCount = this.products.filter(p => p.category === category.id).length;
            html += `
                <button class="category-tab" data-category="${category.id}">
                    <i class="${category.icon}"></i> 
                    ${category.name}
                    <span class="product-count">${productCount}</span>
                </button>
            `;
        });
        
        container.innerHTML = html;
    }

    // Render category filters
    renderCategoryFilters() {
        const container = document.getElementById('category-filters');
        if (!container) return;
        
        let html = `
            <label class="filter-checkbox">
                <input type="checkbox" value="all" checked>
                <span class="checkmark"></span>
                <span class="filter-label">All Categories</span>
            </label>
        `;
        
        this.categories.forEach(category => {
            const productCount = this.products.filter(p => p.category === category.id).length;
            html += `
                <label class="filter-checkbox">
                    <input type="checkbox" value="${category.id}">
                    <span class="checkmark"></span>
                    <span class="filter-label">
                        ${category.name}
                        <span class="filter-count">${productCount}</span>
                    </span>
                </label>
            `;
        });
        
        container.innerHTML = html;
    }

    // Render tag filters
    renderTagFilters() {
        const container = document.getElementById('tag-filters');
        if (!container) return;
        
        // Get all unique tags
        const allTags = new Set();
        this.products.forEach(product => {
            if (product.tags) {
                product.tags.forEach(tag => allTags.add(tag));
            }
        });
        
        let html = '';
        Array.from(allTags).forEach(tag => {
            const tagCount = this.products.filter(p => p.tags?.includes(tag)).length;
            html += `
                <label class="tag-filter">
                    <input type="checkbox" value="${tag}">
                    <span class="tag-label">${this.capitalizeFirst(tag)}</span>
                    <span class="tag-count">${tagCount}</span>
                </label>
            `;
        });
        
        container.innerHTML = html || '<p style="color: var(--text-gray);">No tags available</p>';
    }

    // Render products grid
    renderProducts() {
        const container = document.getElementById('products-grid');
        const noResults = document.getElementById('no-results');
        const loadMoreContainer = document.getElementById('load-more-container');
        
        if (!container) return;
        
        // Apply filters and sort
        this.applyFilters();
        
        if (this.filteredProducts.length === 0) {
            container.style.display = 'none';
            noResults.style.display = 'block';
            loadMoreContainer.style.display = 'none';
            return;
        }
        
        container.style.display = 'grid';
        noResults.style.display = 'none';
        
        // Get products to show
        const productsToShow = this.filteredProducts.slice(0, this.visibleCount);
        
        let html = '';
        productsToShow.forEach(product => {
            const category = this.categories.find(c => c.id === product.category);
            const isFeatured = product.tags?.includes('featured') || product.tags?.includes('bestseller');
            
            html += `
                <div class="product-card glass-panel animate-card scroll-animate" 
                     data-product-id="${product.id}"
                     data-category="${product.category}"
                     data-price="${product.price}"
                     data-tags="${product.tags?.join(',') || ''}">
                    
                    ${isFeatured ? `
                        <div class="product-badge" style="position: absolute; top: 15px; right: 15px; 
                              background: var(--color-gold); color: var(--color-primary-dark); 
                              padding: 5px 12px; border-radius: 20px; font-size: 0.8rem; 
                              font-weight: 600; z-index: 2;">
                            <i class="fas fa-crown"></i> Featured
                        </div>
                    ` : ''}
                    
                    <div class="product-image" style="height: 250px; overflow: hidden; border-radius: 12px 12px 0 0; position: relative;">
                        <img src="${product.image || 'images/products/default.jpg'}" 
                             alt="${product.name}"
                             style="width: 100%; height: 100%; object-fit: cover;"
                             onerror="this.src='images/products/default.jpg'; this.onerror=null;"
                             loading="lazy">
                        <div class="image-overlay" style="
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            background: linear-gradient(to bottom, transparent 70%, rgba(10, 35, 34, 0.8) 100%);
                            pointer-events: none;
                        "></div>
                    </div>
                    
                    <div class="product-info" style="padding: 25px;">
                        <div class="product-category" style="color: var(--color-gold); font-size: 0.9rem; 
                              text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">
                            <i class="${category?.icon || 'fas fa-spa'}"></i> ${category?.name || 'Uncategorized'}
                        </div>
                        
                        <h3 class="product-name" style="margin: 0 0 10px 0; color: var(--text-light); 
                            font-size: 1.3rem; font-weight: 600; min-height: 3rem;">
                            ${product.name}
                        </h3>
                        
                        <p class="product-desc" style="color: var(--text-gray); font-size: 0.95rem; 
                            margin-bottom: 20px; line-height: 1.5; min-height: 4.5rem;">
                            ${product.description}
                        </p>
                        
                        <div class="product-rating" style="display: flex; align-items: center; gap: 5px; 
                              margin-bottom: 15px; color: var(--color-gold);">
                            ${this.generateStarRating(product.rating)}
                            <span style="color: var(--text-gray); font-size: 0.9rem; margin-left: 5px;">
                                (${product.reviews})
                            </span>
                        </div>
                        
                        <div class="product-footer" style="display: flex; justify-content: space-between; 
                              align-items: center; margin-top: 20px;">
                            <div class="product-price" style="font-size: 1.5rem; font-weight: 700; 
                                  color: var(--color-gold);">
                                $${product.price.toFixed(2)}
                            </div>
                            
                            <div class="product-actions" style="display: flex; gap: 10px;">
                                <button class="quick-view-btn glass-btn" 
                                        style="padding: 8px 12px; font-size: 0.9rem;"
                                        data-product-id="${product.id}">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button class="add-to-cart-btn glass-btn" 
                                        style="padding: 8px 20px;"
                                        data-product-id="${product.id}">
                                    <i class="fas fa-shopping-bag"></i> Add
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
        container.className = 'products-grid';
        
        // Show/hide load more button
        if (this.filteredProducts.length > this.visibleCount) {
            loadMoreContainer.style.display = 'block';
        } else {
            loadMoreContainer.style.display = 'none';
        }
        
        // Trigger scroll animations
        setTimeout(() => {
            const animatedElements = container.querySelectorAll('.scroll-animate');
            animatedElements.forEach(el => el.classList.add('animated'));
        }, 100);
    }

    // Render featured products
    renderFeaturedProducts() {
        const container = document.getElementById('featured-products');
        if (!container) return;
        
        const featuredProducts = this.products
            .filter(p => p.featured)
            .slice(0, 4);
        
        if (featuredProducts.length === 0) return;
        
        let html = '';
        featuredProducts.forEach(product => {
            const category = this.categories.find(c => c.id === product.category);
            
            html += `
                <div class="featured-product glass-panel animate-card">
                    <div class="featured-image" style="height: 180px; overflow: hidden; border-radius: 12px; position: relative;">
                        <img src="${product.image || 'images/products/default.jpg'}" 
                             alt="${product.name}"
                             style="width: 100%; height: 100%; object-fit: cover;"
                             onerror="this.src='images/products/default.jpg'; this.onerror=null;">
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
                        <h4 style="margin: 0 0 10px 0; color: var(--text-light);">${product.name}</h4>
                        <div style="color: var(--color-gold); font-weight: 700; font-size: 1.2rem;">
                            $${product.price.toFixed(2)}
                        </div>
                        <button class="add-to-cart-btn glass-btn" 
                                style="margin-top: 15px; width: 100%;"
                                data-product-id="${product.id}">
                            <i class="fas fa-shopping-bag"></i> Add to Cart
                        </button>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
        container.className = 'featured-grid';
    }

    // Apply filters to products
    applyFilters() {
        this.filteredProducts = [...this.products];
        
        // Apply category filter
        if (this.currentFilters.category !== 'all') {
            this.filteredProducts = this.filteredProducts.filter(
                product => product.category === this.currentFilters.category
            );
        }
        
        // Apply price range filter
        this.filteredProducts = this.filteredProducts.filter(
            product => product.price >= this.currentFilters.priceRange[0] && 
                      product.price <= this.currentFilters.priceRange[1]
        );
        
        // Apply tag filter
        if (this.currentFilters.tags.length > 0) {
            this.filteredProducts = this.filteredProducts.filter(product => {
                if (!product.tags) return false;
                return this.currentFilters.tags.some(tag => product.tags.includes(tag));
            });
        }
        
        // Apply search filter
        if (this.currentFilters.search) {
            const searchTerm = this.currentFilters.search.toLowerCase();
            this.filteredProducts = this.filteredProducts.filter(product =>
                product.name.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm) ||
                (product.tags && product.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
            );
        }
        
        // Apply sorting
        this.sortProducts();
    }

    // Sort products based on selected option
    sortProducts() {
        switch (this.sortBy) {
            case 'price-low':
                this.filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                this.filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'rating':
                this.filteredProducts.sort((a, b) => b.rating - a.rating);
                break;
            case 'featured':
            default:
                // Featured products first, then by rating
                this.filteredProducts.sort((a, b) => {
                    const aFeatured = a.tags?.includes('featured') || a.tags?.includes('bestseller') ? 1 : 0;
                    const bFeatured = b.tags?.includes('featured') || b.tags?.includes('bestseller') ? 1 : 0;
                    if (aFeatured !== bFeatured) return bFeatured - aFeatured;
                    return b.rating - a.rating;
                });
                break;
        }
    }

    // Setup event listeners
    setupEventListeners() {
        // Category tabs
        document.querySelectorAll('.category-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const category = e.currentTarget.dataset.category;
                this.setCategoryFilter(category);
            });
        });
        
        // Filter category links in dropdown
        document.querySelectorAll('.filter-category').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const category = e.currentTarget.dataset.category;
                this.setCategoryFilter(category);
                
                // Scroll to products
                document.querySelector('.products-section').scrollIntoView({ 
                    behavior: 'smooth' 
                });
            });
        });
        
        // Search input
        const searchInput = document.getElementById('product-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.currentFilters.search = e.target.value;
                this.visibleCount = 9;
                this.renderProducts();
            });
        }
        
        // Sort select
        const sortSelect = document.getElementById('sort-by');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortBy = e.target.value;
                this.renderProducts();
            });
        }
        
        // Load more button
        const loadMoreBtn = document.getElementById('load-more');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.visibleCount += 6;
                this.renderProducts();
            });
        }
        
        // Reset search button
        const resetSearchBtn = document.getElementById('reset-search');
        if (resetSearchBtn) {
            resetSearchBtn.addEventListener('click', () => {
                this.resetFilters();
            });
        }
        
        // Quick view buttons (delegated)
        document.addEventListener('click', (e) => {
            const quickViewBtn = e.target.closest('.quick-view-btn');
            if (quickViewBtn) {
                e.preventDefault();
                e.stopPropagation();
                const productId = quickViewBtn.dataset.productId;
                this.showQuickView(productId);
            }
        });
        
        // Add to cart buttons (delegated)
        document.addEventListener('click', (e) => {
            const addToCartBtn = e.target.closest('.add-to-cart-btn');
            if (addToCartBtn && !addToCartBtn.closest('.quick-view-modal')) {
                e.preventDefault();
                e.stopPropagation();
                const productId = addToCartBtn.dataset.productId;
                this.addToCart(productId);
            }
        });
        
        // Newsletter form
        const newsletterForm = document.getElementById('newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleNewsletterSubmit(e.target);
            });
        }
    }

       // Setup filter sidebar
    setupFilterSidebar() {
        const filterToggle = document.getElementById('filter-toggle');
        const filterSidebar = document.getElementById('filter-sidebar');
        const closeFilters = document.getElementById('close-filters');
        const applyFilters = document.getElementById('apply-filters');
        const resetFilters = document.getElementById('reset-filters');
        
        if (!filterToggle || !filterSidebar) return;
        
        // Toggle sidebar
        filterToggle.addEventListener('click', () => {
            filterSidebar.classList.toggle('active');
        });
        
        // Close sidebar
        closeFilters.addEventListener('click', () => {
            filterSidebar.classList.remove('active');
        });
        
        // Apply filters from sidebar
        applyFilters.addEventListener('click', () => {
            this.updateFiltersFromSidebar();
            filterSidebar.classList.remove('active');
            this.visibleCount = 9;
            this.renderProducts();
        });
        
        // Reset filters
        resetFilters.addEventListener('click', () => {
            this.resetFilters();
        });
        
        // Price slider - ОБНОВЛЕННЫЙ КОД С ИНДИКАТОРОМ
        const priceSlider = document.getElementById('price-slider');
        const priceMin = document.getElementById('price-min');
        const priceMax = document.getElementById('price-max');
        
        // Создаем индикатор значения
        if (priceSlider) {
            const sliderContainer = priceSlider.parentElement;
            const valueIndicator = document.createElement('div');
            valueIndicator.className = 'slider-value';
            valueIndicator.textContent = `$${priceSlider.value}`;
            sliderContainer.appendChild(valueIndicator);
            
            // Обновляем индикатор при изменении
            priceSlider.addEventListener('input', (e) => {
                const value = e.target.value;
                if (priceMax) priceMax.value = value;
                this.currentFilters.priceRange[1] = parseInt(value);
                
                // Обновляем позицию индикатора
                const percent = (value / priceSlider.max) * 100;
                valueIndicator.style.setProperty('--slider-pos', `${percent}%`);
                valueIndicator.textContent = `$${value}`;
                valueIndicator.style.opacity = '1';
            });
            
            priceSlider.addEventListener('mouseenter', () => {
                valueIndicator.style.opacity = '1';
            });
            
            priceSlider.addEventListener('mouseleave', () => {
                valueIndicator.style.opacity = '0';
            });
        }
        
        if (priceMin) {
            priceMin.addEventListener('change', (e) => {
                const value = Math.min(parseInt(e.target.value) || 0, 500);
                this.currentFilters.priceRange[0] = value;
                e.target.value = value;
            });
        }
        
        if (priceMax) {
            priceMax.addEventListener('change', (e) => {
                const value = Math.min(parseInt(e.target.value) || 500, 500);
                this.currentFilters.priceRange[1] = value;
                e.target.value = value;
                if (priceSlider) {
                    priceSlider.value = value;
                    
                    // Обновляем индикатор
                    const valueIndicator = priceSlider.parentElement.querySelector('.slider-value');
                    if (valueIndicator) {
                        const percent = (value / priceSlider.max) * 100;
                        valueIndicator.style.setProperty('--slider-pos', `${percent}%`);
                        valueIndicator.textContent = `$${value}`;
                    }
                }
            });
        }
    }

    // Update filters from sidebar
    updateFiltersFromSidebar() {
        // Get selected categories
        const categoryCheckboxes = document.querySelectorAll('#category-filters input[type="checkbox"]');
        const selectedCategories = Array.from(categoryCheckboxes)
            .filter(cb => cb.checked && cb.value !== 'all')
            .map(cb => cb.value);
        
        if (selectedCategories.length > 0) {
            // If specific categories selected, use the first one
            this.currentFilters.category = selectedCategories[0];
        } else {
            // If "all" is checked or no categories selected
            this.currentFilters.category = 'all';
        }
        
        // Update active tab
        document.querySelectorAll('.category-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.category === this.currentFilters.category);
        });
        
        // Get selected tags
        const tagCheckboxes = document.querySelectorAll('#tag-filters input[type="checkbox"]');
        this.currentFilters.tags = Array.from(tagCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);
    }

    // Set category filter
    setCategoryFilter(category) {
        this.currentFilters.category = category;
        this.visibleCount = 9;
        
        // Update active tab
        document.querySelectorAll('.category-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.category === category);
        });
        
        // Update category checkboxes in sidebar
        document.querySelectorAll('#category-filters input[type="checkbox"]').forEach(cb => {
            if (category === 'all') {
                cb.checked = cb.value === 'all';
            } else {
                cb.checked = cb.value === category;
            }
        });
        
        this.renderProducts();
    }

    // Reset all filters
    resetFilters() {
        this.currentFilters = {
            category: 'all',
            priceRange: [0, 500],
            tags: [],
            search: ''
        };
        
        this.sortBy = 'featured';
        this.visibleCount = 9;
        
        // Reset UI elements
        const searchInput = document.getElementById('product-search');
        if (searchInput) searchInput.value = '';
        
        const sortSelect = document.getElementById('sort-by');
        if (sortSelect) sortSelect.value = 'featured';
        
        // Reset category tabs
        document.querySelectorAll('.category-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.category === 'all');
        });
        
        // Reset filter sidebar
        document.querySelectorAll('#category-filters input[type="checkbox"]').forEach(cb => {
            cb.checked = cb.value === 'all';
        });
        
        document.querySelectorAll('#tag-filters input[type="checkbox"]').forEach(cb => {
            cb.checked = false;
        });
        
        const priceMin = document.getElementById('price-min');
        const priceMax = document.getElementById('price-max');
        const priceSlider = document.getElementById('price-slider');
        
        if (priceMin) priceMin.value = '';
        if (priceMax) priceMax.value = '';
        if (priceSlider) priceSlider.value = 500;
        
        this.renderProducts();
    }

    // Show quick view modal - FIXED VERSION
    showQuickView(productId) {
        // Close any existing modal first
        this.closeQuickView();
        
        const product = this.products.find(p => p.id === productId);
        if (!product) return;
        
        // Create modal container
        const modal = document.createElement('div');
        modal.className = 'quick-view-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(10, 35, 34, 0.98);
            backdrop-filter: blur(25px);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            opacity: 0;
            animation: fadeIn 0.4s ease forwards;
        `;
        
        const category = this.categories.find(c => c.id === product.category);
        
        modal.innerHTML = `
            <div class="quick-view-content glass-panel" style="
                max-width: 1000px;
                width: 100%;
                max-height: 90vh;
                overflow-y: auto;
                padding: 40px;
                position: relative;
                opacity: 0;
                transform: translateY(30px);
                animation: fadeInUp 0.5s ease 0.1s forwards;
            ">
                <button class="close-quick-view" style="
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 50%;
                    width: 45px;
                    height: 45px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--text-light);
                    font-size: 1.3rem;
                    cursor: pointer;
                    transition: var(--transition-smooth);
                    z-index: 10;
                ">
                    <i class="fas fa-times"></i>
                </button>
                
                <div class="quick-view-body">
                    <div class="quick-view-product" style="display: grid; grid-template-columns: 1fr 1fr; gap: 50px;">
                        <div class="quick-view-image" style="
                            border-radius: 16px;
                            overflow: hidden;
                            background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
                            height: 450px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            position: relative;
                        ">
                            <div style="position: absolute; top: 20px; left: 20px; z-index: 2;">
                                <span style="
                                    background: var(--color-gold);
                                    color: var(--color-primary-dark);
                                    padding: 8px 15px;
                                    border-radius: 20px;
                                    font-size: 0.9rem;
                                    font-weight: 600;
                                ">
                                    <i class="fas fa-crown"></i> Premium
                                </span>
                            </div>
                            <img src="${product.image || 'images/products/default.jpg'}" 
                                 alt="${product.name}"
                                 style="width: 100%; height: 100%; object-fit: cover;"
                                 onerror="this.src='images/products/default.jpg'; this.onerror=null;">
                        </div>
                        
                        <div class="quick-view-details">
                            <div class="product-category" style="
                                color: var(--color-gold);
                                font-size: 0.95rem;
                                text-transform: uppercase;
                                letter-spacing: 1.5px;
                                margin-bottom: 15px;
                            ">
                                <i class="${category?.icon || 'fas fa-spa'}"></i> ${category?.name || 'Uncategorized'}
                            </div>
                            
                            <h2 style="margin: 0 0 20px 0; color: var(--text-light); font-size: 2.2rem; line-height: 1.2;">
                                ${product.name}
                            </h2>
                            
                            <div class="product-rating" style="
                                display: flex;
                                align-items: center;
                                gap: 8px;
                                margin-bottom: 25px;
                                color: var(--color-gold);
                            ">
                                ${this.generateStarRating(product.rating)}
                                <span style="color: var(--text-gray); font-size: 0.95rem; margin-left: 10px;">
                                    ${product.rating}/5 • ${product.reviews} reviews
                                </span>
                            </div>
                            
                            <div class="product-price" style="
                                font-size: 2.5rem;
                                font-weight: 700;
                                color: var(--color-gold);
                                margin-bottom: 30px;
                                text-shadow: 0 0 15px rgba(212, 175, 55, 0.3);
                            ">
                                $${product.price.toFixed(2)}
                            </div>
                            
                            <div class="product-description" style="
                                color: var(--text-gray);
                                margin-bottom: 30px;
                                line-height: 1.7;
                                font-size: 1.05rem;
                            ">
                                ${product.details || product.description}
                            </div>
                            
                            <div class="product-info" style="
                                margin-bottom: 35px;
                                background: rgba(255, 255, 255, 0.03);
                                border-radius: 12px;
                                padding: 20px;
                            ">
                                <div class="info-item" style="
                                    display: flex;
                                    margin-bottom: 15px;
                                    padding-bottom: 15px;
                                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                                ">
                                    <span style="min-width: 120px; color: var(--text-light); font-weight: 500;">Size:</span>
                                    <span style="color: var(--text-gray);">${product.size || 'N/A'}</span>
                                </div>
                                ${product.ingredients ? `
                                    <div class="info-item" style="display: flex; align-items: flex-start;">
                                        <span style="min-width: 120px; color: var(--text-light); font-weight: 500;">Ingredients:</span>
                                        <span style="color: var(--text-gray); line-height: 1.6;">${product.ingredients}</span>
                                    </div>
                                ` : ''}
                            </div>
                            
                            <div class="quick-view-actions" style="display: flex; gap: 15px; margin-top: 30px;">
                                <div class="quantity-selector" style="
                                    display: flex;
                                    align-items: center;
                                    background: rgba(255, 255, 255, 0.05);
                                    border-radius: 50px;
                                    padding: 5px;
                                ">
                                    <button class="qty-decrease" style="
                                        background: none;
                                        border: none;
                                        color: var(--text-gray);
                                        width: 40px;
                                        height: 40px;
                                        font-size: 1.2rem;
                                        cursor: pointer;
                                        border-radius: 50%;
                                        transition: var(--transition-smooth);
                                    ">-</button>
                                    <span class="qty-display" style="
                                        min-width: 40px;
                                        text-align: center;
                                        font-weight: 600;
                                        color: var(--text-light);
                                    ">1</span>
                                    <button class="qty-increase" style="
                                        background: none;
                                        border: none;
                                        color: var(--text-gray);
                                        width: 40px;
                                        height: 40px;
                                        font-size: 1.2rem;
                                        cursor: pointer;
                                        border-radius: 50%;
                                        transition: var(--transition-smooth);
                                    ">+</button>
                                </div>
                                
                                <button class="add-to-cart-btn glass-btn" 
                                        style="flex-grow: 1; padding: 18px 30px; font-size: 1.1rem;"
                                        data-product-id="${product.id}">
                                    <i class="fas fa-shopping-bag"></i> Add to Cart
                                </button>
                                
                                <button class="wishlist-btn glass-btn" 
                                        style="background: rgba(255, 255, 255, 0.05); padding: 18px 20px;">
                                    <i class="far fa-heart"></i>
                                </button>
                            </div>
                            
                            <div class="product-note" style="
                                margin-top: 25px;
                                padding: 15px;
                                background: rgba(212, 175, 55, 0.05);
                                border-radius: 8px;
                                border-left: 3px solid var(--color-gold);
                            ">
                                <p style="margin: 0; color: var(--text-gray); font-size: 0.9rem;">
                                    <i class="fas fa-shipping-fast" style="color: var(--color-gold); margin-right: 8px;"></i>
                                    Free shipping on orders over $100 • 30-day return policy
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add to document
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        this.currentModal = modal;
        
        // Setup event listeners for THIS modal
        const closeModal = () => {
            modal.style.animation = 'fadeOut 0.4s ease forwards';
            modal.querySelector('.quick-view-content').style.animation = 'fadeOutDown 0.4s ease forwards';
            
            setTimeout(() => {
                if (modal.parentNode) {
                    document.body.removeChild(modal);
                }
                document.body.style.overflow = 'auto';
                this.currentModal = null;
            }, 400);
        };
        
        // Close button
        modal.querySelector('.close-quick-view').addEventListener('click', closeModal);
        
        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        // Close with Escape key
        const handleEscape = (e) => {
            if (e.key === 'Escape' && this.currentModal) {
                closeModal();
            }
        };
        document.addEventListener('keydown', handleEscape);
        
        // Store cleanup function
        modal._cleanup = () => {
            document.removeEventListener('keydown', handleEscape);
        };
        
        // Quantity controls
        const qtyDecrease = modal.querySelector('.qty-decrease');
        const qtyIncrease = modal.querySelector('.qty-increase');
        const qtyDisplay = modal.querySelector('.qty-display');
        
        if (qtyDecrease && qtyIncrease && qtyDisplay) {
            let quantity = 1;
            
            qtyDecrease.addEventListener('click', () => {
                if (quantity > 1) {
                    quantity--;
                    qtyDisplay.textContent = quantity;
                }
            });
            
            qtyIncrease.addEventListener('click', () => {
                quantity++;
                qtyDisplay.textContent = quantity;
            });
        }
        
        // Add to cart from quick view
        const addToCartBtn = modal.querySelector('.add-to-cart-btn');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const quantity = parseInt(modal.querySelector('.qty-display')?.textContent || '1');
                this.addToCart(productId, quantity);
                closeModal();
            });
        }
        
        // Wishlist button
        const wishlistBtn = modal.querySelector('.wishlist-btn');
        if (wishlistBtn) {
            wishlistBtn.addEventListener('click', () => {
                wishlistBtn.innerHTML = '<i class="fas fa-heart"></i>';
                wishlistBtn.style.background = 'rgba(212, 175, 55, 0.2)';
                wishlistBtn.style.color = 'var(--color-gold)';
                
                setTimeout(() => {
                    wishlistBtn.innerHTML = '<i class="far fa-heart"></i>';
                    wishlistBtn.style.background = '';
                    wishlistBtn.style.color = '';
                }, 2000);
            });
        }
    }

    // Add to cart function
    addToCart(productId, quantity = 1) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;
        
        if (window.SensualCart) {
            for (let i = 0; i < quantity; i++) {
                window.SensualCart.addItem(product);
            }
        }
        
        // Show success notification
        this.showNotification(`${quantity} × ${product.name} added to cart`, 'success');
    }

    // Close quick view modal
    closeQuickView() {
        if (this.currentModal) {
            if (this.currentModal._cleanup) {
                this.currentModal._cleanup();
            }
            if (this.currentModal.parentNode) {
                document.body.removeChild(this.currentModal);
            }
            document.body.style.overflow = 'auto';
            this.currentModal = null;
        }
    }

    // Handle newsletter submission
    handleNewsletterSubmit(form) {
        const emailInput = form.querySelector('input[type="email"]');
        const email = emailInput.value;
        
        if (!this.validateEmail(email)) {
            this.showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Simulate API call
        emailInput.disabled = true;
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
        
        setTimeout(() => {
            this.showNotification('Thank you for subscribing!', 'success');
            form.reset();
            emailInput.disabled = false;
            submitBtn.innerHTML = originalText;
        }, 1500);
    }

    // Helper: Generate star rating HTML
    generateStarRating(rating) {
        let stars = '';
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        
        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars += '<i class="fas fa-star"></i>';
            } else if (i === fullStars + 1 && hasHalfStar) {
                stars += '<i class="fas fa-star-half-alt"></i>';
            } else {
                stars += '<i class="far fa-star"></i>';
            }
        }
        
        return stars;
    }

    // Helper: Capitalize first letter
    capitalizeFirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Helper: Validate email
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Helper: Show toast notification
    showNotification(message, type = 'info') {
        // Remove existing toasts
        const existingToasts = document.querySelectorAll('.shop-toast');
        existingToasts.forEach(toast => toast.remove());
        
        // Create toast
        const toast = document.createElement('div');
        toast.className = `shop-toast ${type}`;
        
        const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
        toast.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <i class="fas ${icon}" style="font-size: 1.2rem;"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            toast.style.animation = 'fadeOutRight 0.5s ease forwards';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 500);
        }, 3000);
    }
}

// Initialize shop when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Clean up any old modals (just in case)
    const oldModals = document.querySelectorAll('.quick-view-modal');
    oldModals.forEach(modal => {
        if (modal.parentNode) {
            modal.parentNode.removeChild(modal);
        }
    });
    
    // Initialize shop
    window.SensualShop = new ShopManager();
});