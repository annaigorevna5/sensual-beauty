// PRODUCT-DATA.JS - Complete product catalog for Sensual Beauty

const productCategories = [
    {
        id: 'scrubs',
        name: 'Scrubs & Exfoliants',
        description: 'Gentle yet effective exfoliation for radiant skin',
        icon: 'fas fa-spa'
    },
    {
        id: 'creams',
        name: 'Body Creams & Lotions',
        description: 'Luxurious hydration and nourishment',
        icon: 'fas fa-hand-holding-water'
    },
    {
        id: 'shower-gels',
        name: 'Shower Gels',
        description: 'Cleansing rituals with aromatic blends',
        icon: 'fas fa-shower'
    },
    {
        id: 'soaps',
        name: 'Artisan Soaps',
        description: 'Handcrafted, nourishing soap bars',
        icon: 'fas fa-pump-soap'
    },
    {
        id: 'for-men',
        name: 'For Men',
        description: 'Masculine scents and formulations',
        icon: 'fas fa-user'
    },
    {
        id: 'for-women',
        name: 'For Women',
        description: 'Feminine elegance and care',
        icon: 'fas fa-user-female'
    },
    {
        id: 'gift-sets',
        name: 'Gift Sets',
        description: 'Curated collections for special occasions',
        icon: 'fas fa-gift'
    }
];

const products = [
    // Scrubs & Exfoliants
    {
        id: 'scrub-1',
        name: 'Diamond & Pearl Exfoliant',
        category: 'scrubs',
        price: 78.00,
        description: 'Micro-fine diamond powder and pearl extracts for luminous skin',
        details: 'Contains real diamond powder, Tahitian pearl extracts, and jojoba beads. Gently buffs away dead skin cells without irritation. Suitable for all skin types.',
        size: '150ml',
        ingredients: 'Diamond Powder, Pearl Extract, Jojoba Beads, Shea Butter, Vitamin E',
        featured: true,
        image: 'images/2 Shop Diamond & Pearl Exfoliant.jpeg',
        rating: 4.9,
        reviews: 127,
        tags: ['bestseller', 'luxury', 'new']
    },
    {
        id: 'scrub-2',
        name: 'Coffee & Cinnamon Wake-Up Scrub',
        category: 'scrubs',
        price: 65.00,
        description: 'Energizing blend with antioxidant-rich coffee grounds',
        details: 'Organic coffee grounds, cinnamon, and coconut oil combine for an invigorating morning ritual. Stimulates circulation and reduces appearance of cellulite.',
        size: '200ml',
        ingredients: 'Organic Coffee, Cinnamon, Coconut Oil, Brown Sugar, Essential Oils',
        featured: false,
        image: 'images/11 Shop Coffee & Cinnamon Wake-Up Scrub.jpeg',
        rating: 4.7,
        reviews: 89,
        tags: ['organic', 'energizing']
    },
    {
        id: 'scrub-3',
        name: 'Rose Quartz & Himalayan Salt',
        category: 'scrubs',
        price: 72.00,
        description: 'Detoxifying mineral-rich formula with rose quartz powder',
        details: 'Himalayan pink salt and crushed rose quartz detoxify while nourishing minerals restore skin balance. Perfect for weekly deep cleansing.',
        size: '180ml',
        ingredients: 'Himalayan Salt, Rose Quartz Powder, Rosehip Oil, Almond Oil',
        featured: false,
        image: 'images/8 Shop Rose Quartz & Himalayan Salt.jpeg',
        rating: 4.8,
        reviews: 64,
        tags: ['detox', 'mineral-rich']
    },

    // Body Creams & Lotions
    {
        id: 'cream-1',
        name: 'Silk & Saffron Body Elixir',
        category: 'creams',
        price: 84.00,
        description: 'Luxurious blend for silky, fragrant skin',
        details: 'Infused with precious saffron threads and silk proteins. This rich elixir absorbs quickly, leaving skin velvety smooth with a warm, exotic fragrance.',
        size: '200ml',
        ingredients: 'Saffron Extract, Silk Proteins, Shea Butter, Jojoba Oil, Vitamin E',
        featured: true,
        image: 'images/3 Shop Silk & Saffron Body Elixir.jpeg',
        rating: 4.9,
        reviews: 156,
        tags: ['bestseller', 'luxury', 'featured']
    },
    {
        id: 'cream-2',
        name: 'Almond Milk Cream',
        category: 'creams',
        price: 120.00,
        description: 'Ultimate anti-aging nourishment',
        details: 'Almond milk and caviar proteins provide intensive hydration and firming benefits. Visibly reduces fine lines and improves elasticity.',
        size: '150ml',
        ingredients: 'Almond Milk, Hyaluronic Acid, Ceramides',
        featured: false,
        image: 'images/5 Shop Body Creams & Lotions Almond Milk Cream.jpeg',
        rating: 5.0,
        reviews: 42,
        tags: ['anti-aging', 'premium', 'luxury']
    },
    {
        id: 'cream-3',
        name: 'Moonlight Jasmine Lotion',
        category: 'creams',
        price: 68.00,
        description: 'Lightweight hydration with night-blooming jasmine',
        details: 'A feather-light lotion that absorbs instantly. Night-harvested jasmine soothes skin and promotes relaxation for bedtime rituals.',
        size: '250ml',
        ingredients: 'Jasmine Absolute, Aloe Vera, Coconut Water, Glycerin',
        featured: false,
        image: 'images/14 Shop Moonlight Jasmine Lotion.jpeg',
        rating: 4.6,
        reviews: 93,
        tags: ['lightweight', 'relaxing']
    },

    // Shower Gels
    {
        id: 'gel-1',
        name: 'Black Orchid & Oud Shower Gel',
        category: 'shower-gels',
        price: 58.00,
        description: 'Exotic, long-lasting fragrance experience',
        details: 'A unisex fragrance blend of rare black orchids and aged oud wood. Creates a luxurious lather that cleanses without stripping natural oils.',
        size: '300ml',
        ingredients: 'Black Orchid Extract, Oud Essence, Coconut Surfactants, Aloe',
        featured: true,
        image: 'images/9 Shop Black Orchid & Oud Shower Gel.jpeg',
        rating: 4.8,
        reviews: 112,
        tags: ['unisex', 'luxury', 'fragrant']
    },
    {
        id: 'gel-2',
        name: 'Citrus & Ginger Energizing Gel',
        category: 'shower-gels',
        price: 52.00,
        description: 'Morning wake-up call with zesty citrus',
        details: 'Revitalizing blend of grapefruit, orange, and ginger essential oils. Invigorates senses and prepares you for the day ahead.',
        size: '300ml',
        ingredients: 'Grapefruit Oil, Orange Oil, Ginger Extract, Vitamin C',
        featured: false,
        image: 'images/12 Shop Citrus and ginger.jpeg',
        rating: 4.7,
        reviews: 78,
        tags: ['energizing', 'morning', 'vitamin-c']
    },

    // Artisan Soaps
    {
        id: 'soap-1',
        name: '24K Gold Leaf Luxury Soap',
        category: 'soaps',
        price: 45.00,
        description: 'Hand-poured with real gold leaf accents',
        details: 'Cold-process soap with shea butter base, embedded with genuine 24K gold leaf. Creates a creamy, moisturizing lather with subtle shimmer.',
        size: '150g',
        ingredients: 'Shea Butter, Coconut Oil, Olive Oil, 24K Gold Leaf, Essential Oils',
        featured: true,
        image: 'images/6 Shop 24K Gold Leaf Luxury Soap.jpeg',
        rating: 4.9,
        reviews: 89,
        tags: ['luxury', 'handmade', 'gold']
    },
    {
        id: 'soap-2',
        name: 'Charcoal & Tea Tree Detox Bar',
        category: 'soaps',
        price: 38.00,
        description: 'Deep cleansing for problematic skin',
        details: 'Activated charcoal draws out impurities while tea tree oil provides antibacterial benefits. Perfect for acne-prone or oily skin.',
        size: '120g',
        ingredients: 'Activated Charcoal, Tea Tree Oil, Hemp Seed Oil, Eucalyptus',
        featured: false,
        image: 'images/16 Shop Charcoal & Tea Tree Detox Bar.jpeg',
        rating: 4.5,
        reviews: 67,
        tags: ['detox', 'cleansing', 'acne-prone']
    },

    // For Men
    {
        id: 'men-1',
        name: 'Tobacco & Leather Body Wash',
        category: 'for-men',
        price: 62.00,
        description: 'Masculine, sophisticated scent profile',
        details: 'A bold blend of tobacco flower, aged leather, and sandalwood. Creates a rich lather that cleanses while leaving a distinctive, masculine scent.',
        size: '250ml',
        ingredients: 'Tobacco Flower, Leather Accord, Sandalwood, Cedarwood',
        featured: true,
        image: 'images/4 Shop For Men Tobacco & Leather Body Wash Masculine.jpeg',
        rating: 4.8,
        reviews: 94,
        tags: ['masculine', 'woody', 'featured']
    },
    {
        id: 'men-2',
        name: 'Marine Collagen & Kelp Cream',
        category: 'for-men',
        price: 75.00,
        description: 'Hydration without greasy residue',
        details: 'Marine collagen and kelp extracts provide deep hydration that absorbs instantly. Matte finish perfect for daily use.',
        size: '150ml',
        ingredients: 'Marine Collagen, Kelp Extract, Seaweed, Hyaluronic Acid',
        featured: false,
        image: 'images/15 Shop Marine Collagen & Kelp Cream.jpeg',
        rating: 4.6,
        reviews: 56,
        tags: ['matte', 'hydrating', 'fast-absorbing']
    },

    // For Women
    {
        id: 'women-1',
        name: 'Sea Breeze & Silk Body Butter',
        category: 'for-women',
        price: 79.00,
        description: 'Ultra-rich butter with sea breeze, sea salt',
        details: 'Intensely nourishing butter that melts into skin. Sea salt and silk proteins provide 24-hour hydration with a delicate breeze scent.',
        size: '200ml',
        ingredients: 'Sea Breeze Extract, Silk Proteins, Cocoa Butter, Mango Butter',
        featured: true,
        image: 'images/7 Shop Sea Breez.jpeg',
        rating: 4.9,
        reviews: 132,
        tags: ['rich', 'floral', '24h-hydration']
    },

    // Gift Sets
    {
        id: 'gift-1',
        name: 'Sensual Awakening Gift Set',
        category: 'gift-sets',
        price: 165.00,
        description: 'Complete ritual: scrub, gel, cream, and candle',
        details: 'Our signature collection featuring best-selling products in luxurious packaging. Perfect for gifting or indulging yourself.',
        includes: ['Diamond & Pearl Exfoliant (100ml)', 'Black Orchid Shower Gel (200ml)', 'Silk & Saffron Body Elixir (100ml)', 'Sandalwood Candle (120g)'],
        featured: true,
        image: 'images/1 Shop  Sensual Awakening Gift Set.jpeg',
        rating: 5.0,
        reviews: 45,
        tags: ['bestseller', 'complete', 'luxury-packaging']
    },
    {
        id: 'gift-2',
        name: 'Men\'s Resilience Kit',
        category: 'gift-sets',
        price: 120.00,
        description: 'Fortifying scrub, energizing gel, and post-shave balm',
        details: 'Curated for the modern man. Everything needed for a complete grooming routine in sophisticated black packaging.',
        includes: ['Coffee & Cinnamon Scrub (150ml)', 'Citrus & Ginger Gel (200ml)', 'Post-Shave Balm (75ml)', 'Travel Bag'],
        featured: true,
        image: 'images/10 Shop Men Resilience Kit.jpeg',
        rating: 4.8,
        reviews: 37,
        tags: ['masculine', 'grooming', 'travel']
    },
    {
        id: 'gift-3',
        name: 'Nightfall Relaxation Bundle',
        category: 'gift-sets',
        price: 98.00,
        description: 'Lavender-infused soap, body lotion, and pillow mist',
        details: 'Wind down with this calming evening collection. Promotes relaxation and prepares you for restful sleep.',
        includes: ['Lavender & Honey Soap (120g)', 'Moonlight Jasmine Lotion (150ml)', 'Lavender Pillow Mist (100ml)', 'Sleep Mask'],
        featured: true,
        image: 'images/13 Shop Nightfall Relaxation Bundle.jpeg',
        rating: 4.7,
        reviews: 28,
        tags: ['relaxation', 'bedtime', 'lavender']
    }
];

// Product availability and stock
const productStock = {
    'scrub-1': 42,
    'scrub-2': 67,
    'scrub-3': 23,
    'cream-1': 89,
    'cream-2': 15,
    'cream-3': 54,
    'gel-1': 76,
    'gel-2': 48,
    'soap-1': 32,
    'soap-2': 61,
    'men-1': 44,
    'men-2': 29,
    'women-1': 73,
    'gift-1': 25,
    'gift-2': 18,
    'gift-3': 36
};

// Export data for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { productCategories, products, productStock };
} else {
    window.SensualProducts = { productCategories, products, productStock };
}