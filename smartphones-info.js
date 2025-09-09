// API URL for fetching smartphone data
const API_URL = 'https://xf9zlapr5e.execute-api.af-south-1.amazonaws.com/smartphones';

// DOM elements
const productImage = document.getElementById('product-image');
const productTitle = document.getElementById('product-title');
const productDescription = document.getElementById('product-description');
const retailersGrid = document.getElementById('retailers-grid');
const specsTableBody = document.getElementById('specs-table-body');
const currentProductBreadcrumb = document.getElementById('current-product-breadcrumb');
const priceHighlight = document.getElementById('price-highlight');
const productBadge = document.getElementById('product-badge');
const productThumbnails = document.getElementById('product-thumbnails');

// Current product data
let currentProduct = null;


// Color data for iPhone 16 Pro and Pro Max
const IPHONE_COLORS = {
    'iPhone 16 Pro': [
        { name: 'Black Titanium', hex: '#1a1a1a', productIdSuffix: 'black-titanium' },
        { name: 'White Titanium', hex: '#f5f5f0', productIdSuffix: 'white-titanium' },
        { name: 'Natural Titanium', hex: '#8b7355', productIdSuffix: 'natural-titanium' },
        { name: 'Desert Titanium', hex: '#d2b48c', productIdSuffix: 'desert-titanium' }
    ],
    'iPhone 16 Pro Max': [
        { name: 'Black Titanium', hex: '#1a1a1a', productIdSuffix: 'black-titanium' },
        { name: 'White Titanium', hex: '#f5f5f0', productIdSuffix: 'white-titanium' },
        { name: 'Natural Titanium', hex: '#8b7355', productIdSuffix: 'natural-titanium' },
        { name: 'Desert Titanium', hex: '#d2b48c', productIdSuffix: 'desert-titanium' }
    ],
    'iPhone 16': [
        { name: 'Black', hex: '#1a1a1a', productIdSuffix: 'black' },
        { name: 'White', hex: '#f8f8f8', productIdSuffix: 'white' },
        { name: 'Pink', hex: '#ff69b4', productIdSuffix: 'pink' },
        { name: 'Teal', hex: '#008080', productIdSuffix: 'teal' },
        { name: 'Ultramarine', hex: '#4169e1', productIdSuffix: 'ultramarine' }
    ],
    'iPhone 16 Plus': [
        { name: 'Black', hex: '#1a1a1a', productIdSuffix: 'black' },
        { name: 'White', hex: '#f8f8f8', productIdSuffix: 'white' },
        { name: 'Pink', hex: '#ff69b4', productIdSuffix: 'pink' },
        { name: 'Teal', hex: '#008080', productIdSuffix: 'teal' },
        { name: 'Ultramarine', hex: '#4169e1', productIdSuffix: 'ultramarine' }
    ],
    'iPhone 15': [
        { name: 'Black', hex: '#1a1a1a', productIdSuffix: 'black' },
        { name: 'White', hex: '#f8f8f8', productIdSuffix: 'white' },
        { name: 'Pink', hex: '#ff69b4', productIdSuffix: 'pink' },
        { name: 'Yellow', hex: '#ffd700', productIdSuffix: 'yellow' },
        { name: 'Green', hex: '#228b22', productIdSuffix: 'green' },
        { name: 'Blue', hex: '#4169e1', productIdSuffix: 'blue' }
    ],
    'iPhone 15 Plus': [
        { name: 'Black', hex: '#1a1a1a', productIdSuffix: 'black' },
        { name: 'White', hex: '#f8f8f8', productIdSuffix: 'white' },
        { name: 'Pink', hex: '#ff69b4', productIdSuffix: 'pink' },
        { name: 'Yellow', hex: '#ffd700', productIdSuffix: 'yellow' },
        { name: 'Green', hex: '#228b22', productIdSuffix: 'green' },
        { name: 'Blue', hex: '#4169e1', productIdSuffix: 'blue' }
    ],
    'Huawei Pura 80 Pro': [
        { name: 'Glazed Red', hex: '#dc143c', productIdSuffix: 'glazed-red' },
        { name: 'Glazed Black', hex: '#1a1a1a', productIdSuffix: 'glazed-black' }
    ],
    'Huawei Pura 80 Ultra': [
        { name: 'Golden Black', hex: '#2f2f2f', productIdSuffix: 'golden-black' },
        { name: 'Prestige Gold', hex: '#ffd700', productIdSuffix: 'prestige-gold' }
    ],
    'Huawei Nova 13i': [
        { name: 'Crystal Blue', hex: '#4169e1', productIdSuffix: 'crystal-blue' },
        { name: 'Pearl White', hex: '#f8f8f8', productIdSuffix: 'pearl-white' }
    ],
    'Huawei Nova Y62 Blue': [
        { name: 'Midnight Black', hex: '#1a1a1a', productIdSuffix: 'midnight-black' },
        { name: 'Crystal Blue', hex: '#4169e1', productIdSuffix: 'crystal-blue' }
    ],
    'Huawei Nova 13': [
        { name: 'Loden Green', hex: '#556b2f', productIdSuffix: 'loden-green' },
        { name: 'Midnight Black', hex: '#1a1a1a', productIdSuffix: 'midnight-black' }
    ],
    'Huawei Nova Y62 Plus': [
        { name: 'Midnight Black', hex: '#1a1a1a', productIdSuffix: 'midnight-black' },
        { name: 'Crystal Blue', hex: '#4169e1', productIdSuffix: 'crystal-blue' }
    ],
    'Huawei Nova 13 Pro': [
        { name: 'Loden Green', hex: '#556b2f', productIdSuffix: 'loden-green' },
        { name: 'Midnight Black', hex: '#1a1a1a', productIdSuffix: 'midnight-black' }
    ],
    'Huawei Nova Y72s': [
        { name: 'Crystal Blue', hex: '#4169e1', productIdSuffix: 'crystal-blue' },
        { name: 'Black', hex: '#1a1a1a', productIdSuffix: 'black' }
    ],
    'Huawei Pura 70 Pro': [
        { name: 'Pearl White', hex: '#f8f8f8', productIdSuffix: 'pearl-white' },
        { name: 'Midnight Black', hex: '#1a1a1a', productIdSuffix: 'midnight-black' }
    ],
    'Huawei Nova Y73': [
        { name: 'Midnight Black', hex: '#1a1a1a', productIdSuffix: 'midnight-black' },
        { name: 'Blue', hex: '#4169e1', productIdSuffix: 'blue' }
    ],
    'Galaxy Z Fold7': [
        { name: 'Silver Shadow', hex: '#c0c0c0', productIdSuffix: 'silver-shadow' },
        { name: 'Blue Shadow', hex: '#4169e1', productIdSuffix: 'blue-shadow' },
        { name: 'Jet Black', hex: '#0a0a0a', productIdSuffix: 'jet-black' }
    ],
    'Galaxy Z Flip7': [
        { name: 'Jet Black', hex: '#0a0a0a', productIdSuffix: 'jet-black' },
        { name: 'Blue Shadow', hex: '#4169e1', productIdSuffix: 'blue-shadow' }
    ],
    'Galaxy Z Flip7 FE': [
        { name: 'Black', hex: '#1a1a1a', productIdSuffix: 'black' },
        { name: 'White', hex: '#f8f8f8', productIdSuffix: 'white' }
    ],
    'Galaxy S25 Ultra': [
        { name: 'Titanium Silverblue', hex: '#87ceeb', productIdSuffix: 'titanium-silverblue' },
        { name: 'Titanium Black', hex: '#1a1a1a', productIdSuffix: 'titanium-black' },
        { name: 'Titanium Gray', hex: '#808080', productIdSuffix: 'titanium-gray' },
        { name: 'Titanium Whitesilver', hex: '#f5f5f5', productIdSuffix: 'titanium-whitesilver' }
    ],
    'Galaxy S25+': [
        { name: 'Navy', hex: '#000080', productIdSuffix: 'navy' },
        { name: 'IcyBlue', hex: '#87ceeb', productIdSuffix: 'icyblue' },
        { name: 'Mint', hex: '#98fb98', productIdSuffix: 'mint' },
        { name: 'Silver Shadow', hex: '#c0c0c0', productIdSuffix: 'silvershadow' }
    ],
    'Galaxy S25': [
        { name: 'Navy', hex: '#000080', productIdSuffix: 'navy' },
        { name: 'IcyBlue', hex: '#87ceeb', productIdSuffix: 'icyblue' },
        { name: 'Mint', hex: '#98fb98', productIdSuffix: 'mint' },
        { name: 'Silver Shadow', hex: '#c0c0c0', productIdSuffix: 'silvershadow' }
    ]
};

// Storage data for iPhone 16 Pro and Pro Max
const IPHONE_STORAGE = {
    'iPhone 16 Pro': [
        { size: '128GB', suffix: '128gb' },
        { size: '256GB', suffix: '256gb' },
        { size: '512GB', suffix: '512gb' },
        { size: '1TB', suffix: '1tb' }
    ],
    'iPhone 16 Pro Max': [
        { size: '256GB', suffix: '256gb' },
        { size: '512GB', suffix: '512gb' },
        { size: '1TB', suffix: '1tb' }
    ],
    'Galaxy Z Fold7': [
        { size: '256GB', suffix: '256gb' },
        { size: '512GB', suffix: '512gb' },
        { size: '1TB', suffix: '1tb' }
    ],
    'Galaxy Z Flip7': [
        { size: '256GB', suffix: '256gb' },
        { size: '512GB', suffix: '512gb' }
    ],
    'Galaxy Z Flip7 FE': [
        { size: '128GB', suffix: '128gb' },
        { size: '256GB', suffix: '256gb' }
    ],
    'Galaxy S25 Ultra': [
        { size: '256GB', suffix: '256gb' },
        { size: '512GB', suffix: '512gb' },
        { size: '1TB', suffix: '1tb' }
    ],
    'Galaxy S25+': [
        { size: '256GB', suffix: '256gb' }
    ],
    'Galaxy S25': [
        { size: '256GB', suffix: '256gb' }
    ],
    'iPhone 16': [
        { size: '128GB', suffix: '128gb' },
        { size: '256GB', suffix: '256gb' },
        { size: '512GB', suffix: '512gb' }
    ],
    'iPhone 16 Plus': [
        { size: '128GB', suffix: '128gb' },
        { size: '256GB', suffix: '256gb' },
        { size: '512GB', suffix: '512gb' }
    ],
    'iPhone 15': [
        { size: '128GB', suffix: '128gb' },
        { size: '256GB', suffix: '256gb' },
        { size: '512GB', suffix: '512gb' }
    ],
    'iPhone 15 Plus': [
        { size: '128GB', suffix: '128gb' },
        { size: '256GB', suffix: '256gb' },
        { size: '512GB', suffix: '512gb' }
    ],
    'iPhone 16e': [
        { size: '128GB', suffix: '128gb' },
        { size: '256GB', suffix: '256gb' },
        { size: '512GB', suffix: '512gb' }
    ]
};

/**
 * Initialize the page
 */
async function initPage() {
    try {
        // Get product ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        
        if (!productId) {
            showError('No product ID specified');
            return;
        }
        
        // Show loading state
        showLoading();
        
        // Fetch product data
        await fetchProductData(productId);
        
    } catch (error) {
        console.error('Error initializing page:', error);
        showError('Failed to load product information', error);
    }
}

/**
 * Show loading state
 */
function showLoading() {
    // Add loading class to main container
    const container = document.querySelector('.product-details-container');
    if (container) {
        container.innerHTML = `
            <div class="loading-container">
                <div class="loading-spinner"></div>
                <p>Loading product information...</p>
            </div>
        `;
    }
}

/**
 * Show error message
 */
function showError(message, error) {
    const container = document.querySelector('.product-details-container');
    if (container) {
        // Always show CORS error info when testing locally with file:// protocol
        const isLocalFile = window.location.protocol === 'file:';
        const isCorsError = isLocalFile || (error && error.message && (
            error.message.includes('CORS') ||
            error.message.includes('Cross-Origin') ||
            error.message.includes('Access-Control-Allow-Origin')
        ));
        
        let errorDetails = '';
        if (isCorsError) {
            errorDetails = `
                <div class="error-details">
                    <p>This appears to be a CORS issue. When testing locally, try:</p>
                    <ul>
                        <li>Using a local development server instead of file:// protocol</li>
                        <li>Using a browser extension to disable CORS for testing</li>
                        <li>In production, ensure the API has proper CORS headers</li>
                    </ul>
                </div>
            `;
        }
        
        container.innerHTML = `
            <div class="error-container">
                <i class="fas fa-exclamation-circle"></i>
                <h2>Error</h2>
                <p>${message}</p>
                ${errorDetails}
                <a href="smartphones.html" class="back-button">
                    <i class="fas fa-arrow-left"></i> Back to Smartphones
                </a>
            </div>
        `;
    }
}

/**
 * Fetch product data from API
 */
async function fetchProductData(productId) {
    try {
        // Check if we're running from a file:// URL (local file)
        const isLocalFile = window.location.protocol === 'file:';
        
        // For local testing, try to fetch from API first, then fall back to sample data if needed
        if (isLocalFile) {
            console.log('Running locally - attempting to fetch from API first');

            try {
                // Try to fetch from API first
                const apiResponse = await fetch(API_URL);
                if (apiResponse.ok) {
                    const apiProducts = await apiResponse.json();
                    const apiProduct = apiProducts.find(product => product.product_id === productId);

                    if (apiProduct) {
                        console.log('Found product in API:', apiProduct.product_id);
                        currentProduct = apiProduct;
                        displayProductInfo();
                        return;
                    }
                }
            } catch (apiError) {
                console.log('API fetch failed, will use sample data:', apiError.message);
            }

            // Fall back to sample data if API fails or product not found
            console.log('Using sample data for local testing');
            currentProduct = {
                  "product_id": "apple-iphone-16-pro-max-256gb-white-titanium",
                  "category": "smartphones",
                  "brand": "Apple",
                  "color": "White Titanium",
                  "description": "The iPhone 16 Pro Max in White Titanium offers a pristine, elegant finish on Apple's largest and most advanced iPhone. Featuring a stunning 6.9-inch Super Retina XDR display with ProMotion technology, the powerful A18 Pro chip, and a professional camera system with 5x Telephoto, it delivers an unparalleled user experience. With all-day battery life, advanced photography capabilities, and the sophistication of titanium construction, it's the ultimate device for professionals and content creators.",
                  "imageUrl": "https://comparehub-smartphone-images.s3.af-south-1.amazonaws.com/phones/APPlE+phones/iphone+16/iphone+16+pro/iPhone+16+Pro%2C+128Gb+-+White+Titanium.jpg",
                  "model": "iPhone 16 Pro Max",
                 "offers": [
                     {
                         "logoUrl": "https://comparehub-retailer-logos.s3.af-south-1.amazonaws.com/store-a.svg",
                         "originalPrice": 21499,
                         "price": 20999,
                         "retailer": "Store A",
                         "saleEnds": "31 October 2025",
                         "url": "https://www.store-a.co.za/shopping/product-details/apple-iphone-16-128gb-teal/824012"
                     },
                     {
                         "logoUrl": "https://comparehub-retailer-logos.s3.af-south-1.amazonaws.com/store-b.svg",
                         "originalPrice": 20999,
                         "price": 20999,
                         "retailer": "Store B",
                         "saleEnds": null,
                         "url": "https://shop.store-b.co.za/products/smartphones/apple/iphone-16-128gb-teal"
                     },
                     {
                         "logoUrl": "https://comparehub-retailer-logos.s3.af-south-1.amazonaws.com/store-c.svg",
                         "originalPrice": 21999,
                         "price": 21499,
                         "retailer": "Store C",
                         "saleEnds": "31 October 2025",
                         "url": "https://www.store-c.co.za/iphone-16/buy/128gb-teal"
                     }
                 ],
                 "specs": {
                     "AdditionalFeatures": [
                         "Action button",
                         "Capture Button",
                         "Dynamic Island"
                     ],
                     "Audio": {
                         "Microphones": "Stereo microphones with Voice Isolation",
                         "Speakers": "Stereo speakers with Spatial Audio playback"
                     },
                     "Battery": {
                         "Capacity": "3561mAh (Typical)",
                         "Fast Charging": "Supports 20W adapter (50% in 30 mins)",
                         "PowerShare": "No",
                         "Wireless Charging": "MagSafe and Qi2 wireless charging up to 15W"
                     },
                     "Camera": {
                         "Features": [
                             "48MP Main with 2x optical-quality Telephoto",
                             "Spatial Video Capture",
                             "Smart HDR 5",
                             "Photonic Engine",
                             "Night mode"
                         ],
                         "Front_Camera": "12MP TrueDepth (f/1.9, Autofocus)",
                         "Rear_Main": "48MP (f/1.6, sensor-shift OIS)",
                         "Rear_Ultra_Wide": "12MP (f/2.4, 120° FoV)"
                     },
                     "Connectivity": {
                         "5g": "Sub-6GHz",
                         "Bluetooth": "5.3",
                         "Nfc": "Yes",
                         "Usb": "USB-C with USB 2.0 speeds",
                         "UWB": "Second-generation Ultra Wideband chip",
                         "Wifi": "Wi-Fi 6 (802.11ax)"
                     },
                     "Dimensions": {
                         "Full": "147.6 x 71.6 x 7.8mm",
                         "Weight": "171g"
                     },
                     "Display": {
                         "Main": {
                             "Brightness": "1000 nits (HBM), 1600 nits (peak for HDR)",
                             "Refresh Rate": "60Hz",
                             "Resolution": "2556 x 1179 pixels",
                             "Size": "6.1-inch",
                             "Type": "Super Retina XDR OLED"
                         }
                     },
                     "Durability": {
                         "Material": "Ceramic Shield front, Colour-infused glass back, Aluminum frame",
                         "Water Resistance": "IP68 (up to 6 meters for 30 minutes)"
                     },
                     "Os": {
                         "Features": [
                             "Apple Intelligence",
                             "Redesigned Photos app",
                             "Customizable Home Screen"
                         ],
                         "Operating System": "iOS 18"
                     },
                     "Performance": {
                         "Processor": "A18 (5-core GPU)",
                         "Ram": "8GB",
                         "Storage": "128GB "
                     },
                     "Security": {
                         "Biometrics": "Face ID"
                     }
                 }
            };

            // Display product information using the sample data
            displayProductInfo();
            return;
        }
        
        // If not using sample data, proceed with API call
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const products = await response.json();
        
        // Find the specific product
        currentProduct = products.find(product => product.product_id === productId);
        
        if (!currentProduct) {
            throw new Error('Product not found');
        }
        
        // Display product information
        displayProductInfo();
        
    } catch (error) {
        console.error('Error fetching product data:', error);
        
        // If we're running locally and it's likely a CORS error, try to use sample data
        const isLocalFile = window.location.protocol === 'file:';
        const isCorsError = error.message && (
            error.message.includes('CORS') ||
            error.message.includes('Cross-Origin') ||
            error.message.includes('Failed to fetch')
        );
        
        if (isLocalFile && isCorsError && productId === 'apple-iphone-16-pro-max-256gb-white-titanium') {
            console.log('CORS error detected, falling back to sample data');
            // Retry with sample data
            fetchProductData(productId);
        } else {
            // Show error message
            showError('Failed to load product information', error);
        }
    }
}

/**
 * Display product information
 */
function displayProductInfo() {
    // Create the HTML structure for the product view
    const productViewHTML = `
        <div class="breadcrumb">
            <a href="index.html">Home</a>
            <span class="breadcrumb-separator">/</span>
            <a href="smartphones.html">Smartphones</a>
            <span class="breadcrumb-separator">/</span>
            <span id="current-product-breadcrumb"></span>
        </div>

        <!-- Product Header Section -->
        <div class="product-header">
            <img src="" alt="Product Image" class="product-image" id="product-image">
            <div class="product-badge" id="product-badge"></div>
            <!-- Bell Icon in Corner -->
            <div class="bell-icon-corner" id="bellIconCorner" style="position: absolute; top: 10px; left: 10px; z-index: 100; color: #ff3a3a; background: rgba(255, 255, 255, 1); border-radius: 50%; width: 36px; height: 36px; display: flex !important; align-items: center; justify-content: center; font-size: 18px; box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2); cursor: pointer; transition: transform 0.2s ease; pointer-events: auto; border: 2px solid #ff3a3a; opacity: 1 !important; visibility: visible !important;" onmouseover="this.style.transform='scale(1.15)'; this.style.background='rgba(255, 255, 255, 1)'; this.style.boxShadow='0 4px 12px rgba(0, 0, 0, 0.3)';" onmouseout="this.style.transform='scale(1)'; this.style.background='rgba(255, 255, 255, 1)'; this.style.boxShadow='0 3px 8px rgba(0, 0, 0, 0.2)';">
                <i class="fas fa-bell"></i>
            </div>
            <div class="product-thumbnails" id="product-thumbnails">
                <!-- Thumbnails will be populated by JavaScript -->
            </div>
            <div class="product-info">
                <h1 id="product-title"></h1>
                <div class="price-highlight" id="price-highlight"></div>

                <!-- Storage Selection Section -->
                <div class="storage-selection" id="storage-selection" style="display: none;">
                    <h3>Choose Storage</h3>
                    <div class="storage-buttons" id="storage-buttons">
                        <!-- Storage buttons will be populated by JavaScript -->
                    </div>
                </div>

                <!-- Color Selection Section -->
                <div class="color-selection" id="color-selection" style="display: none;">
                    <h3>Choose Color</h3>
                    <div class="color-buttons" id="color-buttons">
                        <!-- Color buttons will be populated by JavaScript -->
                    </div>
                </div>

                <div class="compare-actions">
                    <button class="compare-btn" id="compare-btn">
                        Compare
                    </button>
                    <button class="wishlist-btn" id="wishlist-btn">
                        Add to Wishlist
                    </button>
                </div>
            </div>
        </div>

        <!-- Product Description Section -->
        <div class="product-description" id="product-description">
            <!-- Description will be populated by JavaScript -->
        </div>

        <!-- Price Comparison Section -->
        <div class="price-comparison-section">
            <h2 class="section-title toggle-section" data-target="retailers-grid">
                <i class="fas fa-chevron-right"></i> Price Comparison
            </h2>
            <div class="retailers-grid" id="retailers-grid" style="display: none;">
                <!-- Retailer cards will be populated by JavaScript -->
            </div>
        </div>

        <!-- Full Specifications Section -->
        <div class="specifications-section">
            <h2 class="section-title toggle-section" data-target="specs-container">
                <i class="fas fa-chevron-right"></i> Full Specifications
            </h2>
            <div class="specs-container" id="specs-container" style="display: none;">
                <table class="specs-table">
                    <tbody id="specs-table-body">
                        <!-- Specifications will be populated by JavaScript -->
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Price History Graphs Section -->
        <div class="price-history-section" style="background-color: #fff; border-radius: 12px; padding: 0; margin: 30px 0; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08); overflow: hidden; position: relative; max-width: 100%;">
            <h2 class="section-title toggle-section" data-target="price-history-container" style="margin: 0px; color: rgb(255, 255, 255); font-size: 20px; border-bottom: none; background: linear-gradient(135deg, #d80000, #05182d); padding: 15px 20px; text-shadow: rgba(0, 0, 0, 0.1) 0px 1px 2px; letter-spacing: 0.5px; cursor: pointer;">
                <i class="fas fa-chevron-right" style="color: #fff; margin-right: 10px;"></i> Price History Graphs
            </h2>
            <div class="price-history-container" id="price-history-container" style="padding: 15px; display: none; overflow-x: hidden;">
                <div class="sort-options" style="display: flex; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 15px;">
                    <label for="sort-by" style="font-size: 14px; margin-right: 5px;">Sort by:</label>
                    <select id="sort-by" style="padding: 8px; border-radius: 5px; border: 1px solid #ddd; font-size: 14px; background-color: #f8f8f8;">
                        <option value="relevance">30 days</option>
                        <option value="price-asc">3 months</option>
                        <option value="price-desc">6 months</option>
                        <option value="brand-asc">12 months</option>
                    </select>
                </div>
                <div class="price-history-graph-container" style="position: relative; height: 250px; margin: 15px 0; max-width: 100%; overflow-x: hidden;">
                    <canvas id="price-history-graph"></canvas>
                </div>
            </div>
        </div>
    `;
    
    // Reset the container with the product view HTML
    const container = document.querySelector('.product-details-container');
    if (container) {
        container.innerHTML = productViewHTML;
    }
    
    // Re-get DOM elements after resetting container
    const productImage = document.getElementById('product-image');
    const productTitle = document.getElementById('product-title');
    const productDescription = document.getElementById('product-description');
    const retailersGrid = document.getElementById('retailers-grid');
    const specsTableBody = document.getElementById('specs-table-body');
    const currentProductBreadcrumb = document.getElementById('current-product-breadcrumb');
    const priceHighlight = document.getElementById('price-highlight');
    
    // Set product image with proper loading
    if (productImage) {
        // Set up image loading with fade-in effect
        productImage.onload = function() {
            this.classList.add('product-image-loaded');
        };
        
        // Set alt text first
        productImage.alt = currentProduct.model;
        
        // Then set the source to trigger loading
        productImage.src = currentProduct.imageUrl;
    }
    
    // Set product title
    if (productTitle) {
        productTitle.textContent = currentProduct.model || `${currentProduct.brand} ${currentProduct.product_id}`;
    }
    
    // Set breadcrumb
    if (currentProductBreadcrumb) {
        currentProductBreadcrumb.textContent = currentProduct.model || currentProduct.product_id;
    }
    
    // Set price highlight
    if (priceHighlight) {
        // Find lowest price
        let lowestPrice = Infinity;
        let lowestPriceRetailer = '';
        
        if (currentProduct.offers && currentProduct.offers.length > 0) {
            currentProduct.offers.forEach(offer => {
                if (offer.price && offer.price < lowestPrice) {
                    lowestPrice = offer.price;
                    lowestPriceRetailer = offer.retailer;
                }
            });
        }
        
        if (lowestPrice !== Infinity) {
            const formattedPrice = lowestPrice.toLocaleString('en-ZA', {
                style: 'currency',
                currency: 'ZAR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            });
            
            // Price display removed as requested
            priceHighlight.innerHTML = '';
        } else {
            // Price display removed as requested
            priceHighlight.innerHTML = '';
        }
    }
    
    // Set product description
    if (productDescription) {
        productDescription.innerHTML = `
            <h2 class="section-title">
                Product Description
            </h2>
            <div class="description-content">
                ${currentProduct.description || 'No description available'}
            </div>
        `;
    }
    
    // Display retailers
    displayRetailers();
    
    // Display specifications
    displaySpecifications();
    
    // Add toggle functionality to section titles
    addToggleFunctionality();
    
    // Initialize price history tabs
    initPriceHistoryTabs();

    // Initialize storage selection if applicable
    // Add a small delay to ensure DOM is ready
    setTimeout(async () => {
        console.log('About to call initStorageSelection');
        try {
            await initStorageSelection();
            console.log('initStorageSelection completed successfully');

            // Update color availability based on current storage
            if (currentProduct && currentProduct.product_id) {
                updateColorAvailabilityForStorage(currentProduct.product_id);
            }
        } catch (error) {
            console.error('initStorageSelection failed:', error);
        }

        console.log('About to call initColorSelection');
        try {
            await initColorSelection();
            console.log('initColorSelection completed successfully');

            // Update storage availability based on current color
            if (currentProduct && currentProduct.product_id) {
                updateStorageAvailabilityForColor(currentProduct.product_id);
            }
        } catch (error) {
            console.error('initColorSelection failed:', error);
        }

        // Initialize price alert bells
        initializeProductPriceAlertBells();
    }, 100);
}

/**
 * Display retailers and price comparison
 */
function displayRetailers() {
    const retailersGrid = document.getElementById('retailers-grid');
    
    if (!retailersGrid) return;
    
    if (!currentProduct.offers || currentProduct.offers.length === 0) {
        retailersGrid.innerHTML = `
            <div class="no-retailers">
                <p>No retailer information available for this product.</p>
            </div>
        `;
        return;
    }
    
    // Sort offers by price (lowest first)
    const sortedOffers = [...currentProduct.offers].sort((a, b) => a.price - b.price);
    
    // Create retailer cards
    retailersGrid.innerHTML = '';
    
    sortedOffers.forEach((offer, index) => {
        const isBestPrice = index === 0; // First offer is the lowest price
        
        const originalPrice = offer.originalPrice 
            ? offer.originalPrice.toLocaleString('en-ZA', {
                style: 'currency',
                currency: 'ZAR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              })
            : null;
            
        const currentPrice = offer.price
            ? offer.price.toLocaleString('en-ZA', {
                style: 'currency',
                currency: 'ZAR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              })
            : 'Price not available';
            
        const discount = (offer.originalPrice && offer.price && offer.originalPrice > offer.price)
            ? Math.round(((offer.originalPrice - offer.price) / offer.originalPrice) * 100)
            : null;
            
        const retailerCard = document.createElement('div');
        retailerCard.className = 'retailer-card';
        
        retailerCard.innerHTML = `
            <div class="retailer-header">
                <div class="retailer-logo">
                    <span class="retailer-name">${offer.retailer}</span>
                </div>
            </div>
            <div class="retailer-pricing">
                ${originalPrice && originalPrice !== currentPrice 
                    ? `<span class="original-price">${originalPrice}</span>` 
                    : ''}
                <span class="current-price">${currentPrice}</span>
            </div>
            ${offer.saleEnds 
                ? `<div class="sale-ends">Sale ends: ${offer.saleEnds}</div>` 
                : ''}
            <a href="${offer.url}" class="retailer-link" target="_blank" rel="noopener">
                <i class="fas fa-external-link-alt"></i> Visit ${offer.retailer}
            </a>
        `;
        
        retailersGrid.appendChild(retailerCard);
    });
}

/**
 * Display product specifications
 */
function displaySpecifications() {
    const specsTableBody = document.getElementById('specs-table-body');
    
    if (!specsTableBody) return;
    
    if (!currentProduct.specs || Object.keys(currentProduct.specs).length === 0) {
        specsTableBody.innerHTML = `
            <tr>
                <td colspan="2" class="no-specs">
                    No specifications available for this product.
                </td>
            </tr>
        `;
        return;
    }
    
    // Clear existing specs
    specsTableBody.innerHTML = '';
    
    // Order of specifications (for consistent display)
    const specOrder = [
        'Performance', 'Display', 'Camera', 'Battery', 'Connectivity', 
        'Dimensions', 'Os', 'Security', 'Durability', 'Audio', 'AdditionalFeatures'
    ];
    
    // Create a sorted list of spec categories
    const sortedCategories = Object.keys(currentProduct.specs).sort((a, b) => {
        const indexA = specOrder.indexOf(a);
        const indexB = specOrder.indexOf(b);
        
        // If both categories are in the specOrder array, sort by their index
        if (indexA !== -1 && indexB !== -1) {
            return indexA - indexB;
        }
        
        // If only one category is in the specOrder array, prioritize it
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        
        // If neither category is in the specOrder array, sort alphabetically
        return a.localeCompare(b);
    });
    
    // Add each specification category
    sortedCategories.forEach(category => {
        const specs = currentProduct.specs[category];
        
        // Create category header
        const categoryRow = document.createElement('tr');
        categoryRow.className = 'spec-category';
        categoryRow.innerHTML = `
            <td colspan="2" class="spec-category-name">${formatCategoryName(category)}</td>
        `;
        specsTableBody.appendChild(categoryRow);
        
        // Add specs for this category
        if (Array.isArray(specs)) {
            // Handle array of values (like AdditionalFeatures)
            const specRow = document.createElement('tr');
            specRow.innerHTML = `
                <td class="spec-name"></td>
                <td class="spec-value">
                    <ul class="spec-list">
                        ${specs.map(spec => `<li>${spec}</li>`).join('')}
                    </ul>
                </td>
            `;
            specsTableBody.appendChild(specRow);
        } else if (typeof specs === 'object') {
            // Handle object of key-value pairs
            Object.entries(specs).forEach(([key, value]) => {
                const specRow = document.createElement('tr');
                
                if (Array.isArray(value)) {
                    // Handle array values
                    specRow.innerHTML = `
                        <td class="spec-name">${formatSpecName(key)}</td>
                        <td class="spec-value">
                            <ul class="spec-list">
                                ${value.map(item => `<li>${item}</li>`).join('')}
                            </ul>
                        </td>
                    `;
                } else if (typeof value === 'object' && value !== null) {
                    // Handle nested objects (like Display.Main)
                    specRow.innerHTML = `
                        <td class="spec-name">${formatSpecName(key)}</td>
                        <td class="spec-value">
                            <table class="nested-specs">
                                ${Object.entries(value).map(([nestedKey, nestedValue]) => `
                                    <tr>
                                        <td class="nested-spec-name">${formatSpecName(nestedKey)}</td>
                                        <td class="nested-spec-value">${nestedValue}</td>
                                    </tr>
                                `).join('')}
                            </table>
                        </td>
                    `;
                } else {
                    // Handle simple key-value pairs
                    specRow.innerHTML = `
                        <td class="spec-name">${formatSpecName(key)}</td>
                        <td class="spec-value">${value}</td>
                    `;
                }
                
                specsTableBody.appendChild(specRow);
            });
        } else {
            // Handle simple values
            const specRow = document.createElement('tr');
            specRow.innerHTML = `
                <td class="spec-name"></td>
                <td class="spec-value">${specs}</td>
            `;
            specsTableBody.appendChild(specRow);
        }
    });
}

/**
 * Format category name for display
 */
function formatCategoryName(name) {
    // Handle special cases
    switch (name) {
        case 'Os':
            return 'Operating System';
        case 'AdditionalFeatures':
            return 'Additional Features';
        default:
            // Convert camelCase to Title Case with spaces
            return name
                .replace(/([A-Z])/g, ' $1') // Add space before capital letters
                .replace(/^./, str => str.toUpperCase()); // Capitalize first letter
    }
}

/**
 * Format specification name for display
 */
function formatSpecName(name) {
    // Handle special cases
    switch (name) {
        case 'Ram':
            return 'RAM';
        case 'Nfc':
            return 'NFC';
        case 'Usb':
            return 'USB';
        case 'Wifi':
            return 'Wi-Fi';
        case '5g':
            return '5G';
        case 'UWB':
            return 'Ultra Wideband';
        case 'Front_Camera':
            return 'Front Camera';
        case 'Rear_Main':
            return 'Main Camera';
        case 'Rear_Ultra_Wide':
            return 'Ultra-Wide Camera';
        case 'Rear_Telephoto':
            return 'Telephoto Camera';
        default:
            // Convert snake_case or camelCase to Title Case with spaces
            return name
                .replace(/_/g, ' ') // Replace underscores with spaces
                .replace(/([A-Z])/g, ' $1') // Add space before capital letters
                .replace(/^./, str => str.toUpperCase()); // Capitalize first letter
    }
}

/**
 * Add toggle functionality to section titles
 */
function addToggleFunctionality() {
    // Get all toggle section titles
    const toggleSections = document.querySelectorAll('.toggle-section');
    
    // Add click event listener to each toggle section
    toggleSections.forEach(section => {
        section.style.cursor = 'pointer';
        
        // Get the target content element
        const targetId = section.getAttribute('data-target');
        const targetContent = document.getElementById(targetId);
        
        if (targetContent) {
            // Add click event listener
            section.addEventListener('click', () => {
                // Toggle the display of the target content
                const isVisible = targetContent.style.display !== 'none';
                
                // Toggle display
                if (isVisible) {
                    targetContent.style.display = 'none';
                    // Change icon to chevron-right when closed
                    const icon = section.querySelector('i');
                    if (icon) {
                        icon.className = 'fas fa-chevron-right';
                    }
                } else {
                    targetContent.style.display = 'block';
                    // Change icon back to chevron-down when opened
                    const icon = section.querySelector('i');
                    if (icon) {
                        icon.className = 'fas fa-chevron-down';
                    }
                    
                    // If this is the price history section, redraw the graph for mobile
                    if (targetId === 'price-history-container') {
                        // Small delay to ensure container is visible before drawing
                        setTimeout(() => {
                            const sortDropdown = document.getElementById('sort-by');
                            const currentOption = sortDropdown ? sortDropdown.value : 'relevance';
                            updatePriceHistoryGraph(currentOption);
                        }, 50);
                    }
                }
            });
        }
    });
}

// Add Chart.js to the page
function loadChartJs() {
    if (window.Chart) {
        return Promise.resolve(); // Chart.js already loaded
    }
    
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

/**
 * Initialize price history graph
 */
function initPriceHistoryTabs() {
    // Load Chart.js first
    loadChartJs().then(() => {
        // Initialize with the default option (relevance for 30 days)
        updatePriceHistoryGraph('relevance');
        
        // Add event listener for the sort dropdown
        const sortDropdown = document.getElementById('sort-by');
        if (sortDropdown) {
            sortDropdown.addEventListener('change', (event) => {
                updatePriceHistoryGraph(event.target.value);
            });
        }
    }).catch(error => {
        console.error('Failed to load Chart.js:', error);
        // Fallback if Chart.js fails to load
        const graphContainer = document.getElementById('price-history-graph');
        if (graphContainer) {
            graphContainer.innerHTML = `
                <div style="text-align: center; padding: 20px;">
                    <p>Unable to load price history chart. Please try again later.</p>
                </div>
            `;
        }
    });
}

/**
 * Show sorting options modal
 */
function showTimePeriodModal(currentPeriod) {
    // Remove any existing modal
    const existingModal = document.querySelector('.time-period-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Create modal container
    const modal = document.createElement('div');
    modal.className = 'time-period-modal';
    modal.style.position = 'absolute';
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    modal.style.backgroundColor = '#fff';
    modal.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    modal.style.borderRadius = '8px';
    modal.style.padding = '20px';
    modal.style.zIndex = '1000';
    modal.style.minWidth = '250px';
    
    // Create modal title
    const modalTitle = document.createElement('div');
    modalTitle.textContent = 'Sort By';
    modalTitle.style.fontWeight = 'bold';
    modalTitle.style.fontSize = '16px';
    modalTitle.style.marginBottom = '15px';
    modalTitle.style.borderBottom = '1px solid #eee';
    modalTitle.style.paddingBottom = '10px';
    modal.appendChild(modalTitle);
    
    // Create sorting options
    const sortOptions = [
        { value: 'price_low', label: 'Price: Low to High' },
        { value: 'price_high', label: 'Price: High to Low' },
        { value: 'name_asc', label: 'Name: A to Z' },
        { value: 'name_desc', label: 'Name: Z to A' },
        { value: 'newest', label: 'Newest First' }
    ];
    
    sortOptions.forEach(option => {
        const optionElement = document.createElement('div');
        optionElement.className = 'time-period-option';
        optionElement.textContent = option.label;
        optionElement.setAttribute('data-sort', option.value);
        optionElement.style.padding = '10px';
        optionElement.style.cursor = 'pointer';
        optionElement.style.borderRadius = '4px';
        
        // Highlight the current selection
        if (option.value === currentPeriod) {
            optionElement.style.backgroundColor = '#f0f7ff';
            optionElement.style.color = '#0066cc';
            optionElement.style.fontWeight = 'bold';
        }
        
        // Hover effect
        optionElement.addEventListener('mouseover', () => {
            if (option.value !== currentPeriod) {
                optionElement.style.backgroundColor = '#f5f5f5';
            }
        });
        
        optionElement.addEventListener('mouseout', () => {
            if (option.value !== currentPeriod) {
                optionElement.style.backgroundColor = 'transparent';
            }
        });
        
        // Click event
        optionElement.addEventListener('click', () => {
            // Update the graph with the selected sorting option
            updatePriceHistoryGraph(option.value);
            
            // Update current period
            currentPeriod = option.value;
            
            // Close the modal
            modal.remove();
            
            // Remove overlay
            const overlay = document.querySelector('.modal-overlay');
            if (overlay) {
                overlay.remove();
            }
        });
        
        modal.appendChild(optionElement);
    });
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.zIndex = '999';
    
    // Close modal when clicking outside
    overlay.addEventListener('click', () => {
        modal.remove();
        overlay.remove();
    });
    
    // Add modal and overlay to the document
    document.body.appendChild(overlay);
    document.body.appendChild(modal);
}

/**
 * Generate price data for the specified time period
 * @param {string} sortOption - The selected sort option
 * @returns {Object} - Object with labels and data for the chart
 */
function generatePriceData(sortOption) {
    // Base price around R20,000
    const basePrice = 20000;
    
    let labels = [];
    let data = [];
    
    // Determine if we're on mobile
    const isMobile = window.innerWidth < 480;
    
    // Generate data based on the selected time period
    if (sortOption === 'price-asc') {
        // 3 months - January to March
        labels = ['January', 'February', 'March'];
        data = [20999, 20499, 19999];
    } else if (sortOption === 'price-desc') {
        // 6 months - January to June
        labels = isMobile ?
            ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] :
            ['January', 'February', 'March', 'April', 'May', 'June'];
        data = [20999, 20499, 19999, 19499, 18999, 18499];
    } else if (sortOption === 'brand-asc') {
        // 12 months - January to December
        labels = isMobile ?
            ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] :
            ['January', 'February', 'March', 'April', 'May', 'June',
             'July', 'August', 'September', 'October', 'November', 'December'];
        data = [20999, 20499, 19999, 19499, 18999, 18499,
               18999, 19499, 19999, 19499, 18999, 18499];
    } else {
        // 30 days - For mobile, use fewer data points with fixed values
        if (isMobile) {
            // Use 5 fixed data points for mobile
            labels = ['Day 1', 'Day 8', 'Day 15', 'Day 22', 'Day 30'];
            data = [20999, 20499, 19999, 19499, 19999];
        } else {
            // For desktop, use 10 data points
            for (let i = 1; i <= 10; i++) {
                labels.push(`Day ${i * 3}`);
            }
            
            // Generate a somewhat realistic price trend for 30 days
            let currentPrice = basePrice;
            for (let i = 0; i < 10; i++) {
                // Random price fluctuation
                const variation = Math.random() * 500 - 250; // -250 to +250
                currentPrice = Math.max(basePrice - 2000, Math.min(basePrice + 1000, currentPrice + variation));
                data.push(currentPrice);
            }
        }
    }
    
    return { labels, data };
}

/**
 * Update price history graph based on selected sorting option
 */
function updatePriceHistoryGraph(sortOption) {
    const canvas = document.getElementById('price-history-graph');
    
    if (!canvas || !window.Chart) return;
    
    // Destroy existing chart if it exists
    if (window.priceHistoryChart) {
        window.priceHistoryChart.destroy();
    }
    
    // Generate data for the selected time period
    const { labels, data } = generatePriceData(sortOption);
    
    // Calculate statistics
    const lowestPrice = Math.min(...data);
    const highestPrice = Math.max(...data);
    const averagePrice = Math.round(data.reduce((sum, price) => sum + price, 0) / data.length);
    
    // Format prices for display
    const formatPrice = (price) => {
        return price.toLocaleString('en-ZA', {
            style: 'currency',
            currency: 'ZAR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
    };
    
    // Create a gradient for the line color based on price
    // Calculate the midpoint price for color transition
    const midPrice = (lowestPrice + highestPrice) / 2;
    
    // Create the chart
    const ctx = canvas.getContext('2d');
    
    // Create a custom segment styling function
    const createGradient = (ctx, data) => {
        // Create gradient colors for each segment
        return data.map((value, index) => {
            // Green for lower prices, red for higher prices
            return value < midPrice ? '#2e7d32' : '#c62828';
        });
    };
    
    window.priceHistoryChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: `${currentProduct.model || 'Product'} (128GB)`,
                data: data,
                borderColor: (context) => {
                    const chart = context.chart;
                    const {ctx, chartArea} = chart;
                    
                    // If no chart area, return default color
                    if (!chartArea) {
                        return '#667eea';
                    }
                    
                    // Get the current data point
                    const dataIndex = context.dataIndex;
                    const dataValue = context.dataset.data[dataIndex];
                    
                    // Return green for low prices, red for high prices
                    return dataValue < midPrice ? '#2e7d32' : '#c62828';
                },
                segment: {
                    borderColor: (ctx) => createGradient(ctx, data)
                },
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: (context) => {
                    const dataValue = context.dataset.data[context.dataIndex];
                    return dataValue < midPrice ? '#2e7d32' : '#c62828';
                },
                pointBorderColor: '#ffffff',
                pointBorderWidth: 3,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: '#667eea',
                    borderWidth: 1,
                    cornerRadius: 10,
                    displayColors: true,
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + formatPrice(context.parsed.y);
                        }
                    },
                    // Optimize tooltip padding for mobile
                    padding: window.innerWidth < 768 ? 8 : 12,
                    titleFont: {
                        size: window.innerWidth < 768 ? 12 : 14
                    },
                    bodyFont: {
                        size: window.innerWidth < 768 ? 11 : 13
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)',
                        drawBorder: false,
                        // Reduce grid lines on mobile
                        display: window.innerWidth < 480 ? false : true
                    },
                    ticks: {
                        color: '#666',
                        font: {
                            size: window.innerWidth < 768 ? 10 : 12,
                            weight: '500'
                        },
                        // Show fewer ticks on small screens
                        maxTicksLimit: window.innerWidth < 480 ? 5 : (window.innerWidth < 768 ? 7 : 10),
                        // Auto-skip labels that would overlap
                        autoSkip: true,
                        // Add more padding at the bottom on mobile to avoid overlap with legend
                        padding: window.innerWidth < 480 ? 10 : 0,
                        // Ensure all labels are displayed on mobile
                        autoSkipPadding: window.innerWidth < 480 ? 15 : 0
                    }
                },
                y: {
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)',
                        drawBorder: false,
                        // Reduce grid lines on mobile
                        tickLength: window.innerWidth < 480 ? 5 : 10
                    },
                    ticks: {
                        color: '#666',
                        font: {
                            size: window.innerWidth < 768 ? 10 : 12,
                            weight: '500'
                        },
                        callback: function(value) {
                            // Shorter price format for mobile
                            if (window.innerWidth < 480) {
                                return 'R' + Math.round(value/1000) + 'k';
                            }
                            return formatPrice(value);
                        },
                        // Show fewer ticks on small screens
                        maxTicksLimit: window.innerWidth < 480 ? 4 : 6
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            },
            elements: {
                line: {
                    // Thinner lines on mobile for clarity
                    borderWidth: window.innerWidth < 480 ? 2 : 3
                },
                point: {
                    // Smaller points on mobile
                    radius: window.innerWidth < 480 ? 4 : (window.innerWidth < 768 ? 5 : 6),
                    hoverRadius: window.innerWidth < 480 ? 6 : (window.innerWidth < 768 ? 7 : 8),
                    hoverBorderWidth: window.innerWidth < 480 ? 2 : 4
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeInOutQuart'
            },
            // Optimize for touch devices
            events: ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove']
        }
    });
    
    // Add price statistics below the chart
    const container = canvas.parentElement;
    
    // Create stats container if it doesn't exist
    let statsContainer = container.querySelector('.price-stats');
    if (!statsContainer) {
        statsContainer = document.createElement('div');
        statsContainer.className = 'price-stats';
        statsContainer.style.display = 'flex';
        statsContainer.style.justifyContent = 'space-around';
        statsContainer.style.margin = '20px 0 10px';
        statsContainer.style.textAlign = 'center';
        statsContainer.style.flexWrap = 'wrap';
        
        // Responsive layout for mobile
        if (window.innerWidth < 480) {
            statsContainer.style.flexDirection = 'column';
            statsContainer.style.alignItems = 'center';
            statsContainer.style.gap = '10px';
        }
        container.appendChild(statsContainer);
    } else {
        statsContainer.innerHTML = '';
    }
    
    // Add stats
    const stats = [
        { label: 'Lowest', value: lowestPrice, color: '#2e7d32', bgColor: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)' },
        { label: 'Average', value: averagePrice, color: '#1565c0', bgColor: 'linear-gradient(135deg, #e3f2fd, #bbdefb)' },
        { label: 'Highest', value: highestPrice, color: '#c62828', bgColor: 'linear-gradient(135deg, #ffebee, #ffcdd2)' }
    ];
    
    stats.forEach(stat => {
        const statElement = document.createElement('div');
        statElement.className = 'price-stat';
        statElement.style.padding = window.innerWidth < 480 ? '10px' : '15px';
        statElement.style.background = stat.bgColor;
        statElement.style.borderRadius = '10px';
        statElement.style.minWidth = window.innerWidth < 480 ? '80%' : '120px';
        statElement.style.boxShadow = '0 3px 8px rgba(0, 0, 0, 0.1)';
        statElement.style.margin = '5px';
        
        statElement.innerHTML = `
            <div style="font-size: ${window.innerWidth < 480 ? '14px' : '16px'}; color: ${stat.color}; margin-bottom: 5px;">${stat.label}</div>
            <div style="font-size: ${window.innerWidth < 480 ? '16px' : '18px'}; font-weight: 700; color: ${stat.color};">${window.innerWidth < 480 ? 'R' + Math.round(stat.value/1000) + 'k' : formatPrice(stat.value)}</div>
        `;
        
        statsContainer.appendChild(statElement);
    });
    
    // Add color legend with improved positioning
    const legendContainer = document.createElement('div');
    legendContainer.style.position = 'absolute';
    
    // Position legend differently based on screen size
    if (window.innerWidth < 480) {
        // For mobile, position in the top-right corner of the chart
        legendContainer.style.top = '10px';
        legendContainer.style.right = '10px';
        legendContainer.style.display = 'flex';
        legendContainer.style.flexDirection = 'column';
        legendContainer.style.maxWidth = '80px'; // Limit width to avoid overlap
    } else {
        // For larger screens, position in the top-right corner
        legendContainer.style.top = '10px';
        legendContainer.style.right = '10px';
        legendContainer.style.display = 'flex';
        legendContainer.style.flexDirection = 'column';
    }
    
    legendContainer.style.gap = '5px';
    legendContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    legendContainer.style.padding = window.innerWidth < 480 ? '4px' : '8px';
    legendContainer.style.borderRadius = '5px';
    legendContainer.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
    legendContainer.style.fontSize = window.innerWidth < 480 ? '9px' : '12px';
    legendContainer.style.fontWeight = 'bold';
    legendContainer.style.zIndex = '5';
    
    // Create legend items - consistent across all devices
    const legendItems = [
        { color: '#2e7d32', label: 'Low Price' },
        { color: '#c62828', label: 'High Price' }
    ];
    
    legendItems.forEach(item => {
        const legendItem = document.createElement('div');
        legendItem.style.display = 'flex';
        legendItem.style.alignItems = 'center';
        legendItem.style.gap = '3px';
        
        legendItem.innerHTML = `
            <div style="width: ${window.innerWidth < 480 ? '8px' : '12px'}; height: ${window.innerWidth < 480 ? '8px' : '12px'}; border-radius: 50%; background-color: ${item.color};"></div>
            <span>${item.label}</span>
        `;
        
        legendContainer.appendChild(legendItem);
    });
    
    // Add legend to the chart container
    container.style.position = 'relative';
    container.appendChild(legendContainer);
}

// Add responsive styles for mobile devices
function addResponsiveStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        @media (max-width: 480px) {
            .price-history-section {
                margin: 20px 0 !important;
            }
            .price-history-container {
                padding: 10px !important;
            }
            .price-history-graph-container {
                height: 200px !important;
                margin-top: 10px !important;
            }
            .price-stats {
                flex-direction: column !important;
                align-items: center !important;
                gap: 10px !important;
                margin-top: 15px !important;
            }
            .price-stat {
                width: 90% !important;
                padding: 8px !important;
            }
        }
        
        @media (min-width: 481px) and (max-width: 768px) {
            .price-history-graph-container {
                height: 250px !important;
            }
        }
    `;
    document.head.appendChild(styleElement);
}


// Color selection functions
async function initColorSelection() {
    const colorSelection = document.getElementById('color-selection');
    const colorButtons = document.getElementById('color-buttons');

    if (!colorSelection || !colorButtons || !currentProduct) {
        return;
    }

    try {
        // Fetch all products from API to find available color variants
        console.log('Initializing color selection for product:', currentProduct.product_id);
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const allProducts = await response.json();
        console.log('Fetched', allProducts.length, 'products from API for color selection');

        // Find color variants for the current product
        const currentBaseId = getBaseProductId(currentProduct.product_id);
        console.log('Current product base ID:', currentBaseId);
        console.log('Current product color:', currentProduct.color);
        console.log('Current product full ID:', currentProduct.product_id);

        // More flexible matching strategy for iPhone color variants
        let colorVariants = [];

        // Determine model based on product ID
        let currentModel = '';
        if (currentProduct.product_id.includes('galaxy-z-fold7')) {
            currentModel = 'Galaxy Z Fold7';
        } else if (currentProduct.product_id.includes('galaxy-z-flip7-fe')) {
            currentModel = 'Galaxy Z Flip7 FE';
        } else if (currentProduct.product_id.includes('galaxy-z-flip7')) {
            currentModel = 'Galaxy Z Flip7';
        } else if (currentProduct.product_id.includes('galaxy-s25-ultra')) {
            currentModel = 'Galaxy S25 Ultra';
        } else if (currentProduct.product_id.includes('galaxy-s25-plus')) {
            currentModel = 'Galaxy S25+';
        } else if (currentProduct.product_id.includes('galaxy-s25') &&
                   !currentProduct.product_id.includes('galaxy-s25-plus') &&
                   !currentProduct.product_id.includes('galaxy-s25-ultra')) {
            currentModel = 'Galaxy S25';
        } else {
            // For iPhone models, use the existing parsing logic
            const currentParts = currentProduct.product_id.split('-');
            const brand = currentParts[0]; // apple
            const model = currentParts.slice(1, 3).join('-'); // iphone-16

            // Handle both "pro" and "pro-max" submodels
            let submodel = currentParts[3]; // pro or pro
            if (currentParts[4] && currentParts[4].startsWith('max')) {
                submodel = `${currentParts[3]}-${currentParts[4]}`; // pro-max
            }
            currentModel = `${brand}-${model}-${submodel}`;

            // Store these for the iPhone matching logic below
            var iphoneParts = currentParts;
            var iphoneSubmodel = submodel;
        }

        console.log('Matching strategy for:', {currentModel, currentColor: currentProduct.color});

        // Strategy: Find ALL color variants for this model (any storage size)
        const allModelVariants = allProducts.filter(product => {
            if (currentModel.startsWith('Galaxy')) {
                // For Galaxy models, check if product ID contains the model string
                if (currentModel === 'Galaxy Z Fold7') {
                    return product.product_id.includes('galaxy-z-fold7') && !product.product_id.includes('galaxy-z-flip7');
                } else if (currentModel === 'Galaxy Z Flip7 FE') {
                    return product.product_id.includes('galaxy-z-flip7-fe');
                } else if (currentModel === 'Galaxy Z Flip7') {
                    return product.product_id.includes('galaxy-z-flip7') && !product.product_id.includes('galaxy-z-flip7-fe');
                } else if (currentModel === 'Galaxy S25 Ultra') {
                    return product.product_id.includes('galaxy-s25-ultra');
                } else if (currentModel === 'Galaxy S25+') {
                    return product.product_id.includes('galaxy-s25-plus');
                } else if (currentModel === 'Galaxy S25') {
                    return product.product_id.includes('galaxy-s25') &&
                           !product.product_id.includes('galaxy-s25-plus') &&
                           !product.product_id.includes('galaxy-s25-ultra');
                }
            } else {
                // For iPhone models, use existing logic
                const productParts = product.product_id.split('-');
                const productBrand = productParts[0];
                const productModel = productParts.slice(1, 3).join('-');

                // Handle both "pro" and "pro-max" submodels for comparison
                let productSubmodel = productParts[3];
                if (productParts[4] && productParts[4].startsWith('max')) {
                    productSubmodel = `${productParts[3]}-${productParts[4]}`;
                }

                const isModelMatch = productBrand === iphoneParts[0] &&
                                    productModel === iphoneParts.slice(1, 3).join('-') &&
                                    productSubmodel === iphoneSubmodel;

                return isModelMatch;
            }
        });

        // Group by color and pick one variant per color (preferably same storage size, or any available)
        const colorGroups = {};
        allModelVariants.forEach(product => {
            if (!colorGroups[product.color]) {
                colorGroups[product.color] = [];
            }
            colorGroups[product.color].push(product);
        });

        // For each color, select the best variant (prefer same storage size as current, otherwise any)
        const currentStorageMatch = currentProduct.product_id.match(/-(\d+)(?:gb|tb)/i);
        const currentStorage = currentStorageMatch ? currentStorageMatch[1] + (currentProduct.product_id.includes('tb') ? 'tb' : 'gb') : '';

        colorVariants = [];
        Object.keys(colorGroups).forEach(color => {
            const variants = colorGroups[color];

            // Try to find same storage size first
            let selectedVariant = variants.find(v => v.product_id.toLowerCase().includes(currentStorage.toLowerCase()));

            // If no same storage size, pick the first available
            if (!selectedVariant) {
                selectedVariant = variants[0];
            }

            // Don't include current product
            if (selectedVariant.product_id !== currentProduct.product_id) {
                colorVariants.push(selectedVariant);
            }
        });

        // Add current product back to the list so all colors are shown
        colorVariants.push(currentProduct);

        console.log('Flexible matching found', colorVariants.length, 'variants');

        console.log('Found', colorVariants.length, 'color variants using flexible matching');
        colorVariants.forEach(variant => {
            console.log('Variant:', variant.product_id, 'color:', variant.color);
        });

        // Debug: Show all products with similar names to see what's available
        const similarProducts = allProducts.filter(product => {
            return product.product_id.includes('iphone-16-pro') && product.product_id.includes('titanium');
        });
        console.log('All iPhone 16 Pro titanium products in database:', similarProducts.map(p => ({id: p.product_id, color: p.color})));

        // Debug: Show ALL products to see what's actually in the API
        console.log('ALL products in API (first 10):', allProducts.slice(0, 10).map(p => ({id: p.product_id, color: p.color, model: p.model})));

        // Debug: Check what colors are defined in IPHONE_COLORS
        console.log('Available colors in IPHONE_COLORS:', IPHONE_COLORS);

        // Debug: Check current product details
        console.log('Current product details:', {
            id: currentProduct.product_id,
            model: currentProduct.model,
            color: currentProduct.color,
            brand: currentProduct.brand
        });

        // Debug: Look for any products with natural or desert in the name
        const naturalProducts = allProducts.filter(product =>
            product.product_id.toLowerCase().includes('natural') ||
            product.color.toLowerCase().includes('natural')
        );
        const desertProducts = allProducts.filter(product =>
            product.product_id.toLowerCase().includes('desert') ||
            product.color.toLowerCase().includes('desert')
        );

        console.log('Products with "natural" in name/ID:', naturalProducts.map(p => ({id: p.product_id, color: p.color})));
        console.log('Products with "desert" in name/ID:', desertProducts.map(p => ({id: p.product_id, color: p.color})));

        console.log('Found', colorVariants.length, 'color variants:', colorVariants.map(p => ({id: p.product_id, color: p.color})));

        // Debug: Check if we're missing any expected colors
        const expectedColors = ['Black Titanium', 'White Titanium', 'Natural Titanium', 'Desert Titanium'];
        const foundColors = colorVariants.map(v => v.color);
        const missingColors = expectedColors.filter(color => !foundColors.includes(color));

        if (missingColors.length > 0) {
            console.log('Missing color variants:', missingColors);
            console.log('This might be because the current product storage size doesn\'t have all color variants in the database');
        }

        // Debug: Show what storage sizes exist for each color
        const allColorsByStorage = {};
        allProducts.forEach(product => {
            if (product.product_id.includes('iphone-16-pro') && product.product_id.includes('titanium')) {
                const color = product.color;
                const storageMatch = product.product_id.match(/-(\d+)(?:gb|tb)/i);
                const storage = storageMatch ? storageMatch[1] + (product.product_id.includes('tb') ? 'TB' : 'GB') : 'Unknown';

                if (!allColorsByStorage[color]) {
                    allColorsByStorage[color] = [];
                }
                allColorsByStorage[color].push(storage);
            }
        });

        console.log('Available storage sizes for each color:', allColorsByStorage);

        if (colorVariants.length === 0) {
            console.log('No color variants found for this product - hiding color selection');

            // Debug: Show what products were found with similar base IDs
            const similarProducts = allProducts.filter(product => {
                const productBaseId = getBaseProductId(product.product_id);
                return productBaseId.includes(currentBaseId.split('-')[0]) && productBaseId.includes(currentBaseId.split('-')[1]);
            });
            console.log('Similar products found:', similarProducts.map(p => ({id: p.product_id, color: p.color})));

            colorSelection.style.display = 'none';
            return;
        }

        // Show color selection section
        colorSelection.style.display = 'block';

        // Clear existing buttons
        colorButtons.innerHTML = '';

        // Style the color buttons container for Amazon-style layout
        colorButtons.style.display = 'flex';
        colorButtons.style.flexWrap = 'wrap';
        colorButtons.style.justifyContent = 'flex-start';
        colorButtons.style.gap = '12px';
        colorButtons.style.marginTop = '12px';
        colorButtons.style.padding = '0';

        // Create color buttons for available variants
        colorVariants.forEach((variant) => {
            const button = document.createElement('button');
            button.className = 'color-button';
            button.setAttribute('data-color', variant.color);
            button.setAttribute('data-product-id', variant.product_id);

            // Check if this is the current product's color
            const isSelected = currentProduct.product_id === variant.product_id;
            if (isSelected) {
                button.classList.add('active');
                // Apply its.html-style selection immediately
                const swatch = button.querySelector('.color-swatch');
                if (swatch) {
                    swatch.style.border = '3px solid #ff9900';
                    swatch.style.boxShadow = '0 0 0 1px #ff9900';
                    swatch.style.position = 'relative';
                    // Add red circular indicator
                    const redIndicator = document.createElement('div');
                    redIndicator.className = 'red-indicator';
                    redIndicator.style.position = 'absolute';
                    redIndicator.style.top = '-8px';
                    redIndicator.style.right = '-8px';
                    redIndicator.style.width = '20px';
                    redIndicator.style.height = '20px';
                    redIndicator.style.borderRadius = '50%';
                    redIndicator.style.backgroundColor = '#ff4444';
                    redIndicator.style.border = '2px solid #fff';
                    redIndicator.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
                    redIndicator.style.zIndex = '3';
                    swatch.appendChild(redIndicator);
                }
                // Make color name bold
                const colorName = button.querySelector('.color-name');
                if (colorName) {
                    colorName.style.fontWeight = '600';
                }
            }

            // Get color hex from IPHONE_COLORS or use default
            let colorHex = '#cccccc'; // default gray
            const colorData = findColorData(variant.color);
            if (colorData) {
                colorHex = colorData.hex;
            }

            // Format color name with line break like in its.html
            const formattedColorName = variant.color.replace(' Titanium', '<br>Titanium');

            button.innerHTML = `
                <div class="color-swatch" style="background-color: ${colorHex}; width: 40px; height: 40px; border-radius: 50%; margin: 0 auto 8px auto; border: 2px solid #d5d9d9; transition: all 0.2s ease; position: relative;"></div>
                <span class="color-name" style="font-weight: 400; font-size: 0.875rem; color: #0066c0; text-align: center; line-height: 1.2; max-width: 80px;">${formattedColorName}</span>
            `;

            // Apply its.html-style button styling
            button.style.display = 'flex';
            button.style.flexDirection = 'column';
            button.style.alignItems = 'center';
            button.style.backgroundColor = 'transparent';
            button.style.border = 'none';
            button.style.cursor = 'pointer';
            button.style.transition = 'all 0.2s ease';
            button.style.padding = '8px';
            button.style.margin = '0';

            // Add hover effect like in its.html
            button.addEventListener('mouseenter', () => {
                const swatch = button.querySelector('.color-swatch');
                if (swatch && !button.classList.contains('active')) {
                    swatch.style.transform = 'scale(1.1)';
                }
            });

            button.addEventListener('mouseleave', () => {
                const swatch = button.querySelector('.color-swatch');
                if (swatch && !button.classList.contains('active')) {
                    swatch.style.transform = 'scale(1)';
                }
            });

            // Add click event listener
            button.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();

                // Check if color is available
                if (button.classList.contains('unavailable')) {
                    console.log(`Color ${variant.color} is not available for the current storage`);
                    return; // Don't allow selection of unavailable color
                }

                // Add visual feedback
                button.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    button.style.transform = '';
                }, 150);

                selectColorFromAPI(variant.product_id, variant.color);
            });

            colorButtons.appendChild(button);
        });

        console.log('Color selection initialized with', colorVariants.length, 'variants');

        // Restore selection state if there was a previously selected color
        if (selectedColorId) {
            const selectedButton = document.querySelector(`[data-product-id="${selectedColorId}"]`);
            if (selectedButton) {
                console.log('Restoring selection for:', selectedColorId);
                // Apply selection styling
                selectedButton.classList.add('active');
                const swatch = selectedButton.querySelector('.color-swatch');
                if (swatch) {
                    swatch.style.border = '3px solid #ff0000ff';
                    swatch.style.boxShadow = '0 0 0 1px #ff0000ff';
                    swatch.style.position = 'relative';
                    // Add red circular indicator
                    const redIndicator = document.createElement('div');
                    redIndicator.className = 'red-indicator';
                    redIndicator.style.position = 'absolute';
                    redIndicator.style.top = '-8px';
                    redIndicator.style.right = '-8px';
                    redIndicator.style.width = '20px';
                    redIndicator.style.height = '20px';
                    redIndicator.style.borderRadius = '50%';
                    redIndicator.style.backgroundColor = '#ff4444';
                    redIndicator.style.border = '2px solid #fff';
                    redIndicator.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
                    redIndicator.style.zIndex = '3';
                    swatch.appendChild(redIndicator);
                }
                // Make color name bold
                const colorName = selectedButton.querySelector('.color-name');
                if (colorName) {
                    colorName.style.fontWeight = '600';
                }
            }
        }

    } catch (error) {
        console.error('Error initializing color selection:', error);
        console.error('Error details:', error.message);
        console.error('Stack:', error.stack);

        // Hide color selection on error
        colorSelection.style.display = 'none';

        // Optional: Could add a message to user here
        console.log('Color selection failed - check console for details');
    }
}

// Helper function to extract base product ID (without color)
function getBaseProductId(productId) {
    console.log('Getting base ID for:', productId);
    // Remove color suffixes from product ID
    let baseId = productId;
    baseId = baseId.replace(/-black-titanium$/, '');
    baseId = baseId.replace(/-white-titanium$/, '');
    baseId = baseId.replace(/-natural-titanium$/, '');
    baseId = baseId.replace(/-desert-titanium$/, '');
    baseId = baseId.replace(/-silver-shadow$/, '');
    baseId = baseId.replace(/-blue-shadow$/, '');
    baseId = baseId.replace(/-jet-black$/, '');
    baseId = baseId.replace(/-jetblack$/, '');
    baseId = baseId.replace(/-titanium-silverblue$/, '');
    baseId = baseId.replace(/-titanium-black$/, '');
    baseId = baseId.replace(/-titanium-gray$/, '');
    baseId = baseId.replace(/-titanium-whitesilver$/, '');
    baseId = baseId.replace(/-navy$/, '');
    baseId = baseId.replace(/-icyblue$/, '');
    baseId = baseId.replace(/-icy-blue$/, '');
    baseId = baseId.replace(/-mint$/, '');
    baseId = baseId.replace(/-silvershadow$/, '');
    baseId = baseId.replace(/-black$/, '');
    baseId = baseId.replace(/-white$/, '');
    baseId = baseId.replace(/-pink$/, '');
    baseId = baseId.replace(/-teal$/, '');
    baseId = baseId.replace(/-ultramarine$/, '');
    baseId = baseId.replace(/-green$/, '');
    baseId = baseId.replace(/-yellow$/, '');
    baseId = baseId.replace(/-blue$/, '');
    console.log('Base ID result:', baseId);
    return baseId;
}

// Helper function to find color data from IPHONE_COLORS
function findColorData(colorName) {
    for (const model in IPHONE_COLORS) {
        const colorData = IPHONE_COLORS[model].find(color => color.name === colorName);
        if (colorData) {
            return colorData;
        }
    }
    return null;
}

// Storage selection functions
async function initStorageSelection() {
    const storageSelection = document.getElementById('storage-selection');
    const storageButtons = document.getElementById('storage-buttons');

    if (!storageSelection || !storageButtons || !currentProduct) {
        return;
    }

    try {
        console.log('=== STORAGE SELECTION DEBUG ===');
        console.log('Current product:', currentProduct);
        console.log('Current product model:', currentProduct.model);
        console.log('Current product ID:', currentProduct.product_id);

        // Check if current product supports storage selection
        let availableStorage = null;

        // Try to find storage data using different model name formats
        const possibleModelNames = [
            currentProduct.model,
            currentProduct.model?.replace('Samsung ', ''), // Remove "Samsung " prefix
            currentProduct.model?.replace('Galaxy ', ''), // Remove "Galaxy " prefix
            // Check product ID for model hints
            currentProduct.product_id?.includes('galaxy-s25-ultra') ? 'Galaxy S25 Ultra' : null,
            currentProduct.product_id?.includes('galaxy-s25-plus') ? 'Galaxy S25+' : null,
            currentProduct.product_id?.includes('galaxy-s25') && !currentProduct.product_id?.includes('galaxy-s25-plus') ? 'Galaxy S25' : null,
            currentProduct.product_id?.includes('galaxy-z-fold7') ? 'Galaxy Z Fold7' : null,
            currentProduct.product_id?.includes('galaxy-z-flip7') ? 'Galaxy Z Flip7' : null,
            currentProduct.product_id?.includes('galaxy-z-flip7-fe') ? 'Galaxy Z Flip7 FE' : null
        ].filter(Boolean);

        console.log('Possible model names to try:', possibleModelNames);

        for (const modelName of possibleModelNames) {
            if (IPHONE_STORAGE[modelName]) {
                availableStorage = IPHONE_STORAGE[modelName];
                console.log('✅ Found storage data for model:', modelName, 'with', availableStorage.length, 'options');
                break;
            } else {
                console.log('❌ No storage data found for model:', modelName);
            }
        }

        if (!availableStorage) {
            console.log('❌ No storage data found for any model. Available models in IPHONE_STORAGE:', Object.keys(IPHONE_STORAGE));
            storageSelection.style.display = 'none';
            return;
        }

        console.log('✅ Using storage data:', availableStorage);

        // Show storage selection section
        storageSelection.style.display = 'block';

        // Clear existing buttons
        storageButtons.innerHTML = '';

        // Style the storage buttons container
        storageButtons.style.display = 'flex';
        storageButtons.style.flexWrap = 'wrap';
        storageButtons.style.justifyContent = 'flex-start';
        storageButtons.style.gap = '12px';
        storageButtons.style.marginTop = '12px';
        storageButtons.style.padding = '0';

        // Create storage buttons
        availableStorage.forEach((storage, index) => {
            const button = document.createElement('button');
            button.className = 'storage-button';
            button.setAttribute('data-storage-size', storage.size);
            button.setAttribute('data-storage-suffix', storage.suffix);

            // Check if this is the current product's storage
            const currentStorageMatch = currentProduct.product_id.match(/-(\d+)(?:gb|tb)/i);
            const currentStorage = currentStorageMatch ? currentStorageMatch[1] + (currentProduct.product_id.includes('tb') ? 'tb' : 'gb') : '';
            const isSelected = currentStorage.toLowerCase() === storage.suffix.toLowerCase();

            if (isSelected) {
                button.classList.add('active');
                selectedStorageSize = storage.size;
            }

            button.innerHTML = `
                <span class="storage-size">${storage.size}</span>
            `;

            // Apply button styling
            button.style.display = 'flex';
            button.style.alignItems = 'center';
            button.style.justifyContent = 'center';
            button.style.backgroundColor = isSelected ? '#ff9900' : '#f8f9fa';
            button.style.color = isSelected ? '#fff' : '#333';
            button.style.border = isSelected ? '2px solid #ff9900' : '2px solid #ddd';
            button.style.borderRadius = '8px';
            button.style.cursor = 'pointer';
            button.style.transition = 'all 0.2s ease';
            button.style.padding = '12px 16px';
            button.style.fontSize = '14px';
            button.style.fontWeight = isSelected ? '600' : '500';
            button.style.minWidth = '80px';

            // Add hover effect
            button.addEventListener('mouseenter', () => {
                if (!button.classList.contains('active')) {
                    button.style.backgroundColor = '#e9ecef';
                    button.style.borderColor = '#adb5bd';
                }
            });

            button.addEventListener('mouseleave', () => {
                if (!button.classList.contains('active')) {
                    button.style.backgroundColor = '#f8f9fa';
                    button.style.borderColor = '#ddd';
                }
            });

            // Add click event listener
            button.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();

                // Check if storage is available
                if (button.classList.contains('unavailable')) {
                    console.log(`Storage ${storage.size} is not available for the current color`);
                    return; // Don't allow selection of unavailable storage
                }

                // Add visual feedback
                button.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    button.style.transform = '';
                }, 150);

                selectStorageFromAPI(storage.size, storage.suffix);
            });

            storageButtons.appendChild(button);
        });

        console.log('Storage selection initialized with', availableStorage.length, 'options');

        // Restore selection state if there was a previously selected storage
        if (selectedStorageSize) {
            const selectedButton = document.querySelector(`[data-storage-size="${selectedStorageSize}"]`);
            if (selectedButton) {
                console.log('Restoring storage selection for:', selectedStorageSize);
                // Apply selection styling
                selectedButton.classList.add('active');
                selectedButton.style.backgroundColor = '#ff0000ff';
                selectedButton.style.color = '#fff';
                selectedButton.style.border = '2px solid #ff0000ff';
                selectedButton.style.fontWeight = '600';
            }
        }

    } catch (error) {
        console.error('Error initializing storage selection:', error);
        console.error('Error details:', error.message);
        console.error('Stack:', error.stack);

        // Hide storage selection on error
        storageSelection.style.display = 'none';

        console.log('Storage selection failed - check console for details');
    }
}

async function selectStorageFromAPI(storageSize, storageSuffix) {
    // Update selected button appearance immediately for responsive feedback
    const storageButtons = document.querySelectorAll('.storage-button');

    storageButtons.forEach(button => {
        const buttonStorageSize = button.getAttribute('data-storage-size');

        if (buttonStorageSize === storageSize) {
            // Ensure this button is highlighted - remove any existing active states first
            storageButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.style.backgroundColor = '#f8f9fa';
                btn.style.color = '#333';
                btn.style.border = '2px solid #ddd';
                btn.style.fontWeight = '500';
            });

            // Now apply active state to the selected button
            button.classList.add('active');
            button.style.backgroundColor = '#ff0000ff';
            button.style.color = '#fff';
            button.style.border = '2px solid #ff0000ff';
            button.style.fontWeight = '600';
        }

        // Ensure all buttons remain visible
        button.style.display = 'flex';
        button.style.opacity = '1';
        button.style.visibility = 'visible';
    });

    // Store the selected storage size to preserve selection after displayProductInfo
    selectedStorageSize = storageSize;

    // Generate the new product ID for the selected storage
    let baseProductId = currentProduct.product_id;
    // Remove existing storage suffix
    baseProductId = baseProductId.replace(/-(\d+)(?:gb|tb)/i, '');
    // For Galaxy devices and iPhone 16/16 Plus, storage comes before color
    let newProductId;
    if (baseProductId.includes('galaxy-z-fold7') || baseProductId.includes('galaxy-z-flip7-fe') || baseProductId.includes('galaxy-z-flip7') ||
        baseProductId.includes('galaxy-s25-ultra') ||
        baseProductId.includes('galaxy-s25-plus') ||
        baseProductId.includes('galaxy-s25') ||
        baseProductId.includes('iphone-16-plus') || (baseProductId.includes('iphone-16') && !baseProductId.includes('pro')) ||
        baseProductId.includes('iphone-15-plus') || (baseProductId.includes('iphone-15') && !baseProductId.includes('pro')) ||
        baseProductId.includes('iphone-16e')) {
        // Insert storage before color suffix
        const colorSuffixes = ['-silver-shadow', '-blue-shadow', '-jet-black', '-jetblack', '-titanium-silverblue', '-titanium-black', '-titanium-gray', '-titanium-whitesilver', '-navy', '-icyblue', '-icy-blue', '-mint', '-silvershadow', '-black', '-white', '-pink', '-teal', '-ultramarine', '-green', '-yellow', '-blue'];
        let colorSuffix = '';
        for (const suffix of colorSuffixes) {
            if (baseProductId.includes(suffix)) {
                colorSuffix = suffix;
                baseProductId = baseProductId.replace(suffix, '');
                break;
            }
        }
        newProductId = `${baseProductId}-${storageSuffix}${colorSuffix}`;
    } else {
        // For iPhone Pro models, storage comes at the end
        newProductId = `${baseProductId}-${storageSuffix}`;
    }

    // If it's the same product, no need to do anything
    if (currentProduct.product_id === newProductId) {
        console.log('Same storage selected, no change needed');
        return;
    }

    try {
        // Show loading state
        const container = document.querySelector('.product-details-container');
        if (container) {
            container.style.opacity = '0.7';
            container.style.pointerEvents = 'none';
        }

        console.log('Switching to storage:', storageSize);
        console.log('Current product ID:', currentProduct.product_id);
        console.log('New product ID:', newProductId);

        // Fetch all products from API
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const products = await response.json();
        console.log('API returned', products.length, 'products');

        // Find the exact product match
        const newProduct = products.find(product => product.product_id === newProductId);

        if (!newProduct) {
            console.error('Storage variant not found in API:', newProductId);
            alert(`The ${storageSize} variant could not be found.\n\nPlease refresh the page and try again.`);
            return;
        }

        // Update current product with the API data
        currentProduct = newProduct;

        // Update the page URL without reloading
        const newUrl = `${window.location.pathname}?id=${newProductId}`;
        window.history.pushState({}, '', newUrl);

        // Redisplay all product information with real API data
        displayProductInfo();

        // Update color availability based on the new storage
        updateColorAvailabilityForStorage(newProductId);

        console.log(`Successfully switched to ${storageSize} variant!`);

        // Restore normal state
        if (container) {
            container.style.opacity = '1';
            container.style.pointerEvents = 'auto';
        }

    } catch (error) {
        console.error('Error switching storage:', error);

        // Restore normal state on error
        const container = document.querySelector('.product-details-container');
        if (container) {
            container.style.opacity = '1';
            container.style.pointerEvents = 'auto';
        }

        // Show error message
        alert(`Failed to load ${storageSize} variant.\n\nError: ${error.message}\n\nPlease check your internet connection and try again.`);
    }
}

// Store the currently selected color and storage to preserve selection after displayProductInfo
let selectedColorId = null;
let selectedStorageSize = null;

async function selectColorFromAPI(newProductId, colorName) {
    // Update selected button appearance immediately for responsive feedback
    const colorButtons = document.querySelectorAll('.color-button');

    colorButtons.forEach(button => {
        const buttonColor = button.getAttribute('data-color');
        const buttonProductId = button.getAttribute('data-product-id');
        const indicator = button.querySelector('.selection-indicator');

        if (buttonProductId === newProductId) {
            // Ensure this button is highlighted - remove any existing active states first
            colorButtons.forEach(btn => {
                btn.classList.remove('active');
                const swatch = btn.querySelector('.color-swatch');
                if (swatch) {
                    swatch.style.border = '2px solid #d5d9d9';
                    swatch.style.boxShadow = 'none';
                    const redIndicator = swatch.querySelector('.red-indicator');
                    if (redIndicator) {
                        redIndicator.remove();
                    }
                }
                const colorName = btn.querySelector('.color-name');
                if (colorName) {
                    colorName.style.fontWeight = '400';
                }
            });

            // Now apply active state to the selected button
            button.classList.add('active');
            // its.html-style selection: orange border and shadow
            const swatch = button.querySelector('.color-swatch');
            if (swatch) {
                swatch.style.border = '3px solid #ff0000ff';
                swatch.style.boxShadow = '0 0 0 1px #ff0000ff';
                // Add red circular indicator
                swatch.style.position = 'relative';
                if (!swatch.querySelector('.red-indicator')) {
                    const redIndicator = document.createElement('div');
                    redIndicator.className = 'red-indicator';
                    redIndicator.style.position = 'absolute';
                    redIndicator.style.top = '-8px';
                    redIndicator.style.right = '-8px';
                    redIndicator.style.width = '20px';
                    redIndicator.style.height = '20px';
                    redIndicator.style.borderRadius = '50%';
                    redIndicator.style.backgroundColor = '#ff4444';
                    redIndicator.style.border = '2px solid #fff';
                    redIndicator.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
                    redIndicator.style.zIndex = '3';
                    swatch.appendChild(redIndicator);
                }
            }
            // Make color name bold
            const colorName = button.querySelector('.color-name');
            if (colorName) {
                colorName.style.fontWeight = '600';
            }
        }

        // Ensure all buttons remain visible
        button.style.display = 'flex';
        button.style.opacity = '1';
        button.style.visibility = 'visible';
    });

    // Store the selected color ID to preserve selection after displayProductInfo
    selectedColorId = newProductId;

    // If it's the same product, no need to do anything
    if (currentProduct.product_id === newProductId) {
        console.log('Same product selected, no change needed');
        return;
    }

    try {
        // Show loading state
        const container = document.querySelector('.product-details-container');
        if (container) {
            container.style.opacity = '0.7';
            container.style.pointerEvents = 'none';
        }

        console.log('Switching to product:', newProductId);
        console.log('Current product ID:', currentProduct.product_id);

        // Fetch all products from API
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const products = await response.json();
        console.log('API returned', products.length, 'products');

        // Find the exact product match
        const newProduct = products.find(product => product.product_id === newProductId);

        if (!newProduct) {
            console.error('Product not found in API:', newProductId);
            alert(`The ${colorName} variant could not be found.\n\nPlease refresh the page and try again.`);
            return;
        }

        // Update current product with the API data
        currentProduct = newProduct;

        // Update the page URL without reloading
        const newUrl = `${window.location.pathname}?id=${newProductId}`;
        window.history.pushState({}, '', newUrl);

        // Redisplay all product information with real API data
        displayProductInfo();

        // Update storage availability based on the new color
        updateStorageAvailabilityForColor(newProductId);

        console.log(`Successfully switched to ${colorName} variant!`);

        // Restore normal state
        if (container) {
            container.style.opacity = '1';
            container.style.pointerEvents = 'auto';
        }

    } catch (error) {
        console.error('Error switching color:', error);

        // Restore normal state on error
        const container = document.querySelector('.product-details-container');
        if (container) {
            container.style.opacity = '1';
            container.style.pointerEvents = 'auto';
        }

        // Show error message
        alert(`Failed to load ${colorName} variant.\n\nError: ${error.message}\n\nPlease check your internet connection and try again.`);
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize page
    initPage();
    
    // Add responsive styles
    addResponsiveStyles();
    
    // Add resize event listener for responsive graph
    let resizeTimeout;
    window.addEventListener('resize', function() {
        // Debounce the resize event to prevent excessive redraws
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            // Get the current sort option
            const sortDropdown = document.getElementById('sort-by');
            const currentOption = sortDropdown ? sortDropdown.value : 'relevance';
            
            // Redraw the graph with the current option
            if (document.getElementById('price-history-graph')) {
                updatePriceHistoryGraph(currentOption);
            }
        }, 250); // Wait 250ms after resize ends before redrawing
    });
    
    // Add orientation change listener for mobile devices
    window.addEventListener('orientationchange', function() {
        // Small delay to ensure the orientation change is complete
        setTimeout(function() {
            const sortDropdown = document.getElementById('sort-by');
            const currentOption = sortDropdown ? sortDropdown.value : 'relevance';
            
            // Redraw the graph with the current option
            if (document.getElementById('price-history-graph')) {
                updatePriceHistoryGraph(currentOption);
            }
        }, 300);
    });
});

// Function to update storage availability based on selected color for iPhone Pro Max
async function updateStorageAvailabilityForColor(selectedColorProductId) {
    try {
        console.log('Updating storage availability for color:', selectedColorProductId);

        // Fetch all products from API
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const allProducts = await response.json();

        // Extract color from product ID
        let selectedColor = '';
        if (selectedColorProductId.includes('black-titanium')) {
            selectedColor = 'Black Titanium';
        } else if (selectedColorProductId.includes('white-titanium')) {
            selectedColor = 'White Titanium';
        } else if (selectedColorProductId.includes('natural-titanium')) {
            selectedColor = 'Natural Titanium';
        } else if (selectedColorProductId.includes('desert-titanium')) {
            selectedColor = 'Desert Titanium';
        } else if (selectedColorProductId.includes('silver-shadow')) {
            selectedColor = 'Silver Shadow';
        } else if (selectedColorProductId.includes('blue-shadow')) {
            selectedColor = 'Blue Shadow';
        } else if (selectedColorProductId.includes('jet-black') || selectedColorProductId.includes('jetblack')) {
            selectedColor = 'Jet Black';
        } else if (selectedColorProductId.includes('titanium-silverblue')) {
            selectedColor = 'Titanium Silverblue';
        } else if (selectedColorProductId.includes('titanium-black')) {
            selectedColor = 'Titanium Black';
        } else if (selectedColorProductId.includes('titanium-gray')) {
            selectedColor = 'Titanium Gray';
        } else if (selectedColorProductId.includes('titanium-whitesilver')) {
            selectedColor = 'Titanium Whitesilver';
        } else if (selectedColorProductId.includes('-navy')) {
            selectedColor = 'Navy';
        } else if (selectedColorProductId.includes('icyblue') || selectedColorProductId.includes('icy-blue')) {
            selectedColor = 'IcyBlue';
        } else if (selectedColorProductId.includes('-mint')) {
            selectedColor = 'Mint';
        } else if (selectedColorProductId.includes('silvershadow')) {
            selectedColor = 'Silver Shadow';
        } else if (selectedColorProductId.includes('-black')) {
            selectedColor = 'Black';
        } else if (selectedColorProductId.includes('-white')) {
            selectedColor = 'White';
        } else if (selectedColorProductId.includes('-pink')) {
            selectedColor = 'Pink';
        } else if (selectedColorProductId.includes('-teal')) {
            selectedColor = 'Teal';
        } else if (selectedColorProductId.includes('-ultramarine')) {
            selectedColor = 'Ultramarine';
        } else if (selectedColorProductId.includes('-green')) {
            selectedColor = 'Green';
        } else if (selectedColorProductId.includes('-yellow')) {
            selectedColor = 'Yellow';
        } else if (selectedColorProductId.includes('-blue')) {
            selectedColor = 'Blue';
        }

        console.log('Selected color:', selectedColor);

        // Extract model from product ID to find storage variants
        let selectedModel = '';
        if (selectedColorProductId.includes('galaxy-z-fold7')) {
            selectedModel = 'Galaxy Z Fold7';
        } else if (selectedColorProductId.includes('galaxy-z-flip7-fe')) {
            selectedModel = 'Galaxy Z Flip7 FE';
        } else if (selectedColorProductId.includes('galaxy-z-flip7')) {
            selectedModel = 'Galaxy Z Flip7';
        } else if (selectedColorProductId.includes('galaxy-s25-ultra')) {
            selectedModel = 'Galaxy S25 Ultra';
        } else if (selectedColorProductId.includes('galaxy-s25-plus')) {
            selectedModel = 'Galaxy S25+';
        } else if (selectedColorProductId.includes('galaxy-s25') && !selectedColorProductId.includes('galaxy-s25-plus')) {
            selectedModel = 'Galaxy S25';
        } else if (selectedColorProductId.includes('iphone-16-pro-max')) {
            selectedModel = 'iPhone 16 Pro Max';
        } else if (selectedColorProductId.includes('iphone-16-pro')) {
            selectedModel = 'iPhone 16 Pro';
        } else if (selectedColorProductId.includes('iphone-16-plus')) {
            selectedModel = 'iPhone 16 Plus';
        } else if (selectedColorProductId.includes('iphone-16') && !selectedColorProductId.includes('pro')) {
            selectedModel = 'iPhone 16';
        } else if (selectedColorProductId.includes('iphone-15-plus')) {
            selectedModel = 'iPhone 15 Plus';
        } else if (selectedColorProductId.includes('iphone-15') && !selectedColorProductId.includes('pro')) {
            selectedModel = 'iPhone 15';
        } else if (selectedColorProductId.includes('iphone-16e')) {
            selectedModel = 'iPhone 16e';
        }

        // Find all storage variants for this color
        const colorStorageVariants = allProducts.filter(product =>
            product.color === selectedColor &&
            product.model === selectedModel
        );

        console.log('Found storage variants for', selectedColor, ':', colorStorageVariants.map(p => ({id: p.product_id, storage: p.product_id.match(/-(\d+)(?:gb|tb)/i)?.[1] + (p.product_id.includes('tb') ? 'TB' : 'GB') })));

        // Debug: Show all products for this model to see what colors are actually available
        const allModelProducts = allProducts.filter(product => product.model === selectedModel);
        console.log('All products for model', selectedModel, ':', allModelProducts.map(p => ({id: p.product_id, color: p.color})));
        console.log('Available colors in API for', selectedModel, ':', [...new Set(allModelProducts.map(p => p.color))]);

        // Update storage buttons based on availability
        const storageButtons = document.querySelectorAll('.storage-button');
        storageButtons.forEach(button => {
            const storageSuffix = button.getAttribute('data-storage-suffix');
            const storageSize = button.getAttribute('data-storage-size');

            // Check if this storage variant exists for the selected color
            const storageVariantExists = colorStorageVariants.some(product => {
                return product.product_id.includes(storageSuffix);
            });

            if (storageVariantExists) {
                // Storage is available - show normally
                button.classList.remove('unavailable');
                button.style.opacity = '1';
                button.style.cursor = 'pointer';
                button.style.textDecoration = 'none';
                button.style.pointerEvents = 'auto';
                button.style.backgroundColor = '#f8f9fa';
                button.style.color = '#333';
                button.style.border = '2px solid #ddd';
                console.log(`Storage ${storageSize} is AVAILABLE for ${selectedColor}`);
            } else {
                // Storage is not available - show with line-through and disable
                button.classList.add('unavailable');
                button.style.opacity = '0.4';
                button.style.cursor = 'not-allowed';
                button.style.textDecoration = 'line-through';
                button.style.pointerEvents = 'none';
                button.style.backgroundColor = '#f8f9fa';
                button.style.color = '#999';
                button.style.border = '2px solid #ddd';
                console.log(`Storage ${storageSize} is NOT AVAILABLE for ${selectedColor}`);
            }
        });

    } catch (error) {
        console.error('Error updating storage availability:', error);
    }
}

// Function to update color availability based on selected storage for iPhone Pro Max
async function updateColorAvailabilityForStorage(selectedStorageProductId) {
    try {
        console.log('Updating color availability for storage:', selectedStorageProductId);

        // Fetch all products from API
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const allProducts = await response.json();

        // Extract storage from product ID
        const storageMatch = selectedStorageProductId.match(/-(\d+)(?:gb|tb)/i);
        const selectedStorage = storageMatch ? storageMatch[1] + (selectedStorageProductId.includes('tb') ? 'tb' : 'gb') : '';

        console.log('Selected storage:', selectedStorage);

        // Extract model from product ID to find color variants
        let selectedModel = '';
        if (selectedStorageProductId.includes('galaxy-z-fold7')) {
            selectedModel = 'Galaxy Z Fold7';
        } else if (selectedStorageProductId.includes('galaxy-z-flip7-fe')) {
            selectedModel = 'Galaxy Z Flip7 FE';
        } else if (selectedStorageProductId.includes('galaxy-z-flip7')) {
            selectedModel = 'Galaxy Z Flip7';
        } else if (selectedStorageProductId.includes('galaxy-s25-ultra')) {
            selectedModel = 'Galaxy S25 Ultra';
        } else if (selectedStorageProductId.includes('galaxy-s25-plus')) {
            selectedModel = 'Galaxy S25+';
        } else if (selectedStorageProductId.includes('galaxy-s25') && !selectedStorageProductId.includes('galaxy-s25-plus')) {
            selectedModel = 'Galaxy S25';
        } else if (selectedStorageProductId.includes('iphone-16-pro-max')) {
            selectedModel = 'iPhone 16 Pro Max';
        } else if (selectedStorageProductId.includes('iphone-16-pro')) {
            selectedModel = 'iPhone 16 Pro';
        } else if (selectedStorageProductId.includes('iphone-16-plus')) {
            selectedModel = 'iPhone 16 Plus';
        } else if (selectedStorageProductId.includes('iphone-16') && !selectedStorageProductId.includes('pro')) {
            selectedModel = 'iPhone 16';
        } else if (selectedStorageProductId.includes('iphone-15-plus')) {
            selectedModel = 'iPhone 15 Plus';
        } else if (selectedStorageProductId.includes('iphone-15') && !selectedStorageProductId.includes('pro')) {
            selectedModel = 'iPhone 15';
        } else if (selectedStorageProductId.includes('iphone-16e')) {
            selectedModel = 'iPhone 16e';
        }

        // Find all color variants for this storage
        const storageColorVariants = allProducts.filter(product =>
            product.product_id.includes(selectedStorage) &&
            product.model === selectedModel
        );

        console.log('Found color variants for', selectedStorage, ':', storageColorVariants.map(p => ({id: p.product_id, color: p.color})));

        // Update color buttons based on availability
        const colorButtons = document.querySelectorAll('.color-button');
        colorButtons.forEach(button => {
            const buttonColor = button.getAttribute('data-color');

            // Check if this color variant exists for the selected storage
            const colorVariantExists = storageColorVariants.some(product => {
                return product.color === buttonColor;
            });

            if (colorVariantExists) {
                // Color is available - show normally
                button.classList.remove('unavailable');
                button.style.opacity = '1';
                button.style.cursor = 'pointer';
                button.style.pointerEvents = 'auto';
                console.log(`Color ${buttonColor} is AVAILABLE for ${selectedStorage}`);
            } else {
                // Color is not available - show with reduced opacity and disable
                button.classList.add('unavailable');
                button.style.opacity = '0.4';
                button.style.cursor = 'not-allowed';
                button.style.pointerEvents = 'none';
                console.log(`Color ${buttonColor} is NOT AVAILABLE for ${selectedStorage}`);
            }
        });

    } catch (error) {
        console.error('Error updating color availability:', error);
    }
}

// Initialize price alert bell for product details page (corner bell only)
function initializeProductPriceAlertBells() {
    console.log('Initializing price alert bell for product details page...');

    // Initialize corner bell icon
    const cornerBell = document.getElementById('bellIconCorner');
    if (cornerBell) {
        console.log('Corner bell found, adding click handler');
        cornerBell.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            console.log('Corner bell clicked!');
            handlePriceAlertClick();
        });
    } else {
        console.log('Corner bell not found');
    }
}

// Handle price alert click for both bell icons
function handlePriceAlertClick() {
    if (!currentProduct) {
        console.log('No current product available');
        if (typeof showNotification !== 'undefined') {
            showNotification('Product Not Loaded', 'Please wait for the product information to load.', 'info');
        }
        return;
    }

    const productId = currentProduct.product_id;
    const productName = currentProduct.model || currentProduct.product_id;
    const productImage = currentProduct.imageUrl;

    // Find the lowest price
    let lowestPrice = Infinity;
    if (currentProduct.offers && currentProduct.offers.length > 0) {
        currentProduct.offers.forEach(offer => {
            if (offer.price && offer.price < lowestPrice) {
                lowestPrice = offer.price;
            }
        });
    }

    if (lowestPrice !== Infinity) {
        // Show price alert modal
        if (typeof showPriceAlertModal !== 'undefined') {
            showPriceAlertModal(productId, lowestPrice, productName, productImage);
        } else {
            console.log('showPriceAlertModal function not available');
        }
    } else {
        // Show notification if no price available
        if (typeof showNotification !== 'undefined') {
            showNotification('No Price Available', 'Cannot set price alert without product pricing information.', 'warning');
        }
    }
}


// CSS is already included in the HTML file