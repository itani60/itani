// Global variables
let compareProducts = []; // Array to store products for comparison (max 2)
let allProducts = []; // Array to store all products fetched from API

// DOM elements - will be initialized later
let compareBtn;
let compareModal;
let compareModalClose;
let compareProductsContainer;
let compareSpecsTable;
let comparePricesTable;
let addProductBtn;
let productSearchInput;
let productSearchResults;

/**
 * Initialize comparison functionality
 */
function initCompare() {
    console.log('initCompare function called');
    
    // Initialize DOM elements
    compareBtn = document.getElementById('compare-btn');
    compareModal = document.getElementById('compare-modal');
    compareModalClose = document.getElementById('compare-modal-close');
    compareProductsContainer = document.getElementById('compare-products-container');
    compareSpecsTable = document.getElementById('compare-specs-table');
    comparePricesTable = document.getElementById('compare-prices-table');
    productSearchInput = document.getElementById('product-search-input');
    productSearchResults = document.getElementById('product-search-results');
    
    console.log('DOM elements initialized:');
    console.log('- Compare button:', compareBtn);
    console.log('- Compare modal:', compareModal);
    console.log('- Compare modal close button:', compareModalClose);
    console.log('- Compare products container:', compareProductsContainer);
    
    // Fetch all products for comparison
    fetchAllProducts();
    
    // Add event listeners
    if (compareBtn) {
        compareBtn.addEventListener('click', function() {
            console.log('Compare button clicked');
            showCompareModal();
        });
    } else {
        console.error('Compare button not found');
    }
    
    if (compareModalClose) {
        console.log('Adding click event listener to close button:', compareModalClose);
        compareModalClose.addEventListener('click', function() {
            console.log('Close button clicked');
            hideCompareModal();
        });
    } else {
        console.error('Compare modal close button not found');
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === compareModal) {
            hideCompareModal();
        }
    });
    
    // Add current product to comparison if available
    if (currentProduct) {
        addToCompare(currentProduct);
    }
}

/**
 * Fetch all products from API
 */
async function fetchAllProducts() {
    try {
        console.log('Fetching all products from API:', API_URL);
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        allProducts = await response.json();
        console.log(`Fetched ${allProducts.length} products for comparison`);
        return allProducts;
    } catch (error) {
        console.error('Error fetching products for comparison:', error);
        
        // If we're running locally and it's likely a CORS error, use sample data
        const isLocalFile = window.location.protocol === 'file:';
        if (isLocalFile) {
            console.log('Running locally, using sample data for search');
            // Add a few sample products for testing
            allProducts = [
                {
                    "product_id": "apple-iphone-16-128gb-teal",
                    "category": "smartphones",
                    "brand": "Apple",
                    "color": "Teal",
                    "model": "iPhone 16 Teal",
                    "imageUrl": "https://comparehub-smartphone-images.s3.af-south-1.amazonaws.com/phones/apple/iphone-16/teal-v1.png"
                },
                {
                    "product_id": "samsung-galaxy-s24-ultra-256gb-titanium-black",
                    "category": "smartphones",
                    "brand": "Samsung",
                    "color": "Titanium Black",
                    "model": "Galaxy S24 Ultra",
                    "imageUrl": "https://comparehub-smartphone-images.s3.af-south-1.amazonaws.com/phones/samsung/s24-ultra/titanium-black.png"
                },
                {
                    "product_id": "google-pixel-8-pro-256gb-obsidian",
                    "category": "smartphones",
                    "brand": "Google",
                    "color": "Obsidian",
                    "model": "Pixel 8 Pro",
                    "imageUrl": "https://comparehub-smartphone-images.s3.af-south-1.amazonaws.com/phones/google/pixel-8-pro/obsidian.png"
                }
            ];
            console.log('Using sample data with', allProducts.length, 'products');
            return allProducts;
        }
    }
}

/**
 * Show the comparison modal
 */
function showCompareModal() {
    console.log('showCompareModal function called');
    console.log('compareModal element:', compareModal);
    
    if (compareModal) {
        console.log('Setting compareModal display to flex');
        compareModal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        
        // Make sure we have at least the current product in the comparison
        if (currentProduct && compareProducts.length === 0) {
            console.log('Adding current product to comparison:', currentProduct.model);
            addToCompare(currentProduct);
        } else {
            updateCompareView();
        }
    } else {
        console.error('compareModal element not found');
    }
}

/**
 * Hide the comparison modal
 */
function hideCompareModal() {
    console.log('hideCompareModal function called');
    if (compareModal) {
        console.log('Setting compareModal display to none');
        compareModal.style.display = 'none';
        document.body.style.overflow = ''; // Restore scrolling
        console.log('Modal hidden, scrolling restored');
    } else {
        console.error('compareModal element not found in hideCompareModal');
    }
}

/**
 * Add a product to the comparison
 */
function addToCompare(product) {
    // Check if product is already in comparison
    const existingIndex = compareProducts.findIndex(p => p.product_id === product.product_id);
    
    if (existingIndex !== -1) {
        // Product already in comparison, do nothing
        return;
    }
    
    // If we already have 2 products, replace the second one
    if (compareProducts.length >= 2) {
        compareProducts[1] = product;
    } else {
        // Otherwise add to the array
        compareProducts.push(product);
    }
    
    // Update the comparison view
    updateCompareView();
}

/**
 * Remove a product from comparison
 */
function removeFromCompare(productId) {
    compareProducts = compareProducts.filter(product => product.product_id !== productId);
    updateCompareView();
}

/**
 * Update the comparison view
 */
function updateCompareView() {
    console.log('updateCompareView called');
    console.log('compareProductsContainer:', compareProductsContainer);
    console.log('compareProducts:', compareProducts);
    
    if (!compareProductsContainer) {
        console.error('compareProductsContainer not found');
        return;
    }
    
    // Get unified category order from all products
    const unifiedCategoryOrder = getUnifiedCategoryOrder();
    console.log('Unified category order:', unifiedCategoryOrder);
    
    // Clear the container
    compareProductsContainer.innerHTML = '';
    
    // Add product cards for comparison
    compareProducts.forEach(product => {
        console.log('Adding product to comparison:', product.model);
        const productCard = createCompareProductCard(product, unifiedCategoryOrder);
        compareProductsContainer.appendChild(productCard);
    });
    
    // Add empty slot if needed
    if (compareProducts.length < 2) {
        console.log('Adding empty slot for second product');
        const emptySlot = document.createElement('div');
        emptySlot.className = 'compare-product-card empty';
        emptySlot.innerHTML = `
            <div class="add-product-placeholder">
                <i class="fas fa-plus-circle"></i>
                <p>Add a product to compare</p>
                <button id="add-product-btn" class="add-product-btn">Select Product</button>
            </div>
        `;
        compareProductsContainer.appendChild(emptySlot);
        
        // Add event listener to the add product button
        const addBtn = emptySlot.querySelector('#add-product-btn');
        if (addBtn) {
            addBtn.addEventListener('click', showProductSearch);
        }
        
        // If we have no products in the comparison yet, fetch all products for search
        if (allProducts.length === 0) {
            fetchAllProducts();
        }
    }
}

/**
 * Get a unified category order from all products
 */
function getUnifiedCategoryOrder() {
    // Predefined order of specifications (for consistent display)
    const specOrder = [
        'Performance', 'Display', 'Camera', 'Battery', 'Connectivity',
        'Dimensions', 'Os', 'Security', 'Durability', 'Audio', 'AdditionalFeatures'
    ];
    
    // Get all categories from all products
    const allCategories = new Set();
    
    compareProducts.forEach(product => {
        if (product.specs) {
            Object.keys(product.specs).forEach(category => {
                allCategories.add(category);
            });
        }
    });
    
    // Create a sorted list of all categories
    const sortedCategories = Array.from(allCategories).sort((a, b) => {
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
    
    return sortedCategories;
}

/**
 * Create a product card for the comparison view
 */
function createCompareProductCard(product, unifiedCategoryOrder) {
    const card = document.createElement('div');
    card.className = 'compare-product-card';
    
    // Create the main card content
    card.innerHTML = `
        <div class="compare-product-header">
            <div class="product-overlay-buttons">
               
                <button class="remove-compare-btn" data-product-id="${product.product_id}" title="Remove from Comparison">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="compare-product-image">
                <img src="${product.imageUrl}" alt="${product.model}">
            </div>
            <h3 class="compare-product-title">${product.model}</h3>
            <div class="toggle-buttons-container">
                <button class="toggle-prices-btn" data-product-id="${product.product_id}">
                    <i class="fas fa-chevron-down"></i> Toggle Prices
                </button>
                <button class="toggle-specs-btn" data-product-id="${product.product_id}">
                    <i class="fas fa-chevron-down"></i> Toggle Specifications
                </button>
            </div>
        </div>
        <div class="product-prices-container" id="prices-${product.product_id}" style="display: none;">
            <!-- Prices will be added here -->
        </div>
        <div class="product-specs-container" id="specs-${product.product_id}" style="display: none;">
            <!-- Specs will be added here -->
        </div>
    `;
    
    // Add event listener to remove button
    const removeBtn = card.querySelector('.remove-compare-btn');
    if (removeBtn) {
        removeBtn.addEventListener('click', () => {
            removeFromCompare(product.product_id);
        });
    }
    
    // Add event listener to toggle specs button
    const toggleSpecsBtn = card.querySelector('.toggle-specs-btn');
    if (toggleSpecsBtn) {
        toggleSpecsBtn.addEventListener('click', () => {
            const specsContainer = card.querySelector(`#specs-${product.product_id}`);
            if (specsContainer) {
                if (specsContainer.style.display === 'none') {
                    specsContainer.style.display = 'block';
                    toggleSpecsBtn.innerHTML = '<i class="fas fa-times-circle"></i> Hide Specifications';
                } else {
                    specsContainer.style.display = 'none';
                    toggleSpecsBtn.innerHTML = '<i class="fas fa-chevron-down"></i> Toggle Specifications';
                }
            }
        });
    }
    
    // Add event listener to toggle prices button
    const togglePricesBtn = card.querySelector('.toggle-prices-btn');
    if (togglePricesBtn) {
        togglePricesBtn.addEventListener('click', () => {
            const pricesContainer = card.querySelector(`#prices-${product.product_id}`);
            if (pricesContainer) {
                if (pricesContainer.style.display === 'none') {
                    pricesContainer.style.display = 'block';
                    togglePricesBtn.innerHTML = '<i class="fas fa-times-circle"></i> Hide Prices';
                } else {
                    pricesContainer.style.display = 'none';
                    togglePricesBtn.innerHTML = '<i class="fas fa-chevron-down"></i> Toggle Prices';
                }
            }
        });
    }
    
    // Add specs to the container if product has specs
    if (product.specs) {
        const specsContainer = card.querySelector(`#specs-${product.product_id}`);
        if (specsContainer) {
            addSpecsToContainer(product, specsContainer, unifiedCategoryOrder);
        }
    }
    
    // Add prices to the container if product has offers
    if (product.offers) {
        const pricesContainer = card.querySelector(`#prices-${product.product_id}`);
        if (pricesContainer) {
            addPricesToContainer(product, pricesContainer);
        }
    }
    
    return card;
}

/**
 * Add prices to a container
 */
function addPricesToContainer(product, container) {
    // Create prices HTML
    let pricesHTML = '<div class="product-prices">';
    
    if (product.offers && product.offers.length > 0) {
        pricesHTML += `
            <h4 class="prices-title">Available at ${product.offers.length} retailer${product.offers.length > 1 ? 's' : ''}</h4>
            <div class="prices-list">
        `;
        
        // Sort retailers alphabetically
        const sortedOffers = [...product.offers].sort((a, b) =>
            a.retailer.localeCompare(b.retailer)
        );
        
        sortedOffers.forEach(offer => {
            const currentPrice = offer.price
                ? offer.price.toLocaleString('en-ZA', {
                    style: 'currency',
                    currency: 'ZAR',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                  })
                : 'Price not available';
                
            const originalPrice = offer.originalPrice && offer.originalPrice !== offer.price
                ? offer.originalPrice.toLocaleString('en-ZA', {
                    style: 'currency',
                    currency: 'ZAR',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                  })
                : null;
            
            pricesHTML += `
                <div class="price-item">
                    <div class="price-retailer">${offer.retailer}</div>
                    <div class="price-details">
                        ${originalPrice ? `<span class="price-original">${originalPrice}</span>` : ''}
                        <span class="price-current">${currentPrice}</span>
                        ${offer.saleEnds ? `<span class="price-sale-ends">Sale ends: ${offer.saleEnds}</span>` : ''}
                    </div>
                    <a href="${offer.url}" class="price-link" target="_blank" rel="noopener">
                        <i class="fas fa-external-link-alt"></i> Visit
                    </a>
                </div>
            `;
        });
        
        pricesHTML += `
            </div>
        `;
    } else {
        pricesHTML += `
            <div class="no-prices">No price information available</div>
        `;
    }
    
    pricesHTML += '</div>';
    container.innerHTML = pricesHTML;
}

/**
 * Add specifications to a container
 */
function addSpecsToContainer(product, container, unifiedCategoryOrder) {
    // Create specs HTML
    let specsHTML = '<div class="product-specs">';
    
    // Use the unified category order for all products
    unifiedCategoryOrder.forEach(category => {
        // Check if this product has this category
        const hasCategory = product.specs && product.specs[category];
        
        // Always add the category header for consistency
        specsHTML += `
            <div class="specs-category">
                <h4 class="specs-category-title">${formatCategoryName(category)}</h4>
                <div class="specs-category-content">
        `;
        
        if (hasCategory) {
            if (Array.isArray(product.specs[category])) {
                // For array specs like AdditionalFeatures
                specsHTML += `
                    <ul class="specs-list">
                        ${product.specs[category].map(item => `<li>${item}</li>`).join('')}
                    </ul>
                `;
            } else if (typeof product.specs[category] === 'object') {
                // For object specs
                Object.entries(product.specs[category]).forEach(([key, value]) => {
                    if (Array.isArray(value)) {
                        // For array values within objects
                        specsHTML += `
                            <div class="spec-item">
                                <span class="spec-name">${formatSpecName(key)}</span>
                                <ul class="specs-list">
                                    ${value.map(item => `<li>${item}</li>`).join('')}
                                </ul>
                            </div>
                        `;
                    } else if (typeof value === 'object' && value !== null) {
                        // For nested objects (like Display.Main)
                        specsHTML += `
                            <div class="spec-item">
                                <span class="spec-name">${formatSpecName(key)}</span>
                                <div class="nested-specs">
                                    ${Object.entries(value).map(([nestedKey, nestedValue]) => `
                                        <div class="nested-spec-item">
                                            <span class="nested-spec-name">${formatSpecName(nestedKey)}</span>
                                            <span class="nested-spec-value">${nestedValue}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        `;
                    } else {
                        // For simple values
                        specsHTML += `
                            <div class="spec-item">
                                <span class="spec-name">${formatSpecName(key)}</span>
                                <span class="spec-value">${value}</span>
                            </div>
                        `;
                    }
                });
            }
        } else {
            // If this product doesn't have this category, show "Not available"
            specsHTML += `<div class="spec-item"><span class="spec-value">Not available</span></div>`;
        }
        
        specsHTML += `
                </div>
            </div>
        `;
    });
    
    specsHTML += '</div>';
    container.innerHTML = specsHTML;
}

/**
 * Show product search interface
 */
function showProductSearch() {
    console.log('showProductSearch called');
    
    // Re-initialize search elements
    productSearchInput = document.getElementById('product-search-input');
    productSearchResults = document.getElementById('product-search-results');
    
    if (!productSearchInput || !productSearchResults) {
        console.error('Search elements not found');
        return;
    }
    
    // Show search interface
    productSearchInput.style.display = 'block';
    productSearchResults.style.display = 'block';
    
    // Focus on input
    productSearchInput.focus();
    
    // Add event listener for search input
    productSearchInput.addEventListener('input', searchProducts);
    
    // If we have no products yet, fetch them
    if (allProducts.length === 0) {
        console.log('No products available for search, fetching...');
        fetchAllProducts().then(() => {
            // Show initial results after fetching
            searchProducts();
        });
    } else {
        // Initial search results
        searchProducts();
    }
}

/**
 * Search products based on input
 */
function searchProducts() {
    console.log('searchProducts called');
    
    if (!productSearchInput || !productSearchResults) {
        console.error('Search elements not found in searchProducts');
        return;
    }
    
    const searchTerm = productSearchInput.value.toLowerCase();
    console.log('Searching for:', searchTerm);
    
    // Filter products based on search term
    const filteredProducts = allProducts.filter(product => {
        const model = product.model?.toLowerCase() || '';
        const brand = product.brand?.toLowerCase() || '';
        const productId = product.product_id?.toLowerCase() || '';
        return model.includes(searchTerm) ||
               brand.includes(searchTerm) ||
               productId.includes(searchTerm);
    }).slice(0, 5); // Limit to 5 results
    
    console.log(`Found ${filteredProducts.length} matching products`);
    
    // Display search results
    productSearchResults.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        productSearchResults.innerHTML = '<p class="no-search-results">No products found</p>';
        return;
    }
    
    filteredProducts.forEach(product => {
        // Skip the current product if it's already in comparison
        if (compareProducts.some(p => p.product_id === product.product_id)) {
            console.log('Skipping already compared product:', product.model);
            return;
        }
        
        const resultItem = document.createElement('div');
        resultItem.className = 'search-result-item';
        resultItem.innerHTML = `
            <img src="${product.imageUrl}" alt="${product.model}" class="search-result-image">
            <div class="search-result-info">
                <h4>${product.model}</h4>
                <p>${product.brand}</p>
            </div>
        `;
        
        // Add event listener to select this product
        resultItem.addEventListener('click', () => {
            console.log('Selected product for comparison:', product.model);
            
            // If this is a product ID we don't have full details for, fetch them
            if (!product.specs || !product.offers) {
                console.log('Fetching full details for product:', product.product_id);
                fetchProductDetails(product.product_id)
                    .then(fullProduct => {
                        if (fullProduct) {
                            addToCompare(fullProduct);
                        } else {
                            // If we couldn't get full details, use what we have
                            addToCompare(product);
                        }
                        hideProductSearch();
                    });
            } else {
                // We already have full details
                addToCompare(product);
                hideProductSearch();
            }
        });
        
        productSearchResults.appendChild(resultItem);
    });
}

/**
 * Fetch full product details by ID
 */
async function fetchProductDetails(productId) {
    try {
        console.log('Fetching product details for:', productId);
        
        // Check if we're running from a file:// URL (local file)
        const isLocalFile = window.location.protocol === 'file:';
        
        if (isLocalFile && productId === 'samsung-galaxy-s24-ultra-256gb-titanium-black') {
            // Use sample data for this specific product when testing locally
            console.log('Using sample data for Samsung Galaxy S24 Ultra');
            return {
                "product_id": "samsung-galaxy-s24-ultra-256gb-titanium-black",
                "category": "smartphones",
                "brand": "Samsung",
                "color": "Titanium Black",
                "description": "Experience the ultimate in smartphone technology with the Galaxy S24 Ultra. Featuring a stunning 6.8-inch Dynamic AMOLED 2X display, powerful Snapdragon 8 Gen 3 processor, and an advanced quad camera system with a 200MP main sensor. The built-in S Pen and Galaxy AI features take productivity and creativity to new heights.",
                "imageUrl": "https://comparehub-smartphone-images.s3.af-south-1.amazonaws.com/phones/samsung/s24-ultra/titanium-black.png",
                "model": "Galaxy S24 Ultra",
                "offers": [
                    {
                        "logoUrl": "https://comparehub-retailer-logos.s3.af-south-1.amazonaws.com/store-a.svg",
                        "originalPrice": 29999,
                        "price": 27999,
                        "retailer": "Store A",
                        "saleEnds": "31 October 2025",
                        "url": "https://www.store-a.co.za/shopping/product-details/samsung-galaxy-s24-ultra-256gb-titanium-black/824013"
                    },
                    {
                        "logoUrl": "https://comparehub-retailer-logos.s3.af-south-1.amazonaws.com/store-b.svg",
                        "originalPrice": 29999,
                        "price": 28999,
                        "retailer": "Store B",
                        "saleEnds": null,
                        "url": "https://shop.store-b.co.za/products/smartphones/samsung/galaxy-s24-ultra-256gb-titanium-black"
                    }
                ],
                "specs": {
                    "Performance": {
                        "Processor": "Snapdragon 8 Gen 3",
                        "Ram": "12GB",
                        "Storage": "256GB"
                    },
                    "Display": {
                        "Main": {
                            "Size": "6.8-inch",
                            "Type": "Dynamic AMOLED 2X",
                            "Resolution": "3120 x 1440 pixels",
                            "Refresh Rate": "120Hz adaptive",
                            "Brightness": "2600 nits (peak)"
                        }
                    },
                    "Camera": {
                        "Rear_Main": "200MP (f/1.7, OIS)",
                        "Rear_Ultra_Wide": "12MP (f/2.2, 120° FoV)",
                        "Rear_Telephoto": "10MP (f/2.4, 3x optical zoom)",
                        "Rear_Telephoto2": "50MP (f/3.4, 5x optical zoom)",
                        "Front_Camera": "12MP (f/2.2)",
                        "Features": [
                            "8K video recording",
                            "Nightography",
                            "ProVisual Engine",
                            "AI Photo Assist"
                        ]
                    },
                    "Battery": {
                        "Capacity": "5000mAh",
                        "Fast Charging": "45W wired",
                        "Wireless Charging": "15W",
                        "PowerShare": "Yes (Wireless PowerShare)"
                    },
                    "Connectivity": {
                        "5g": "Yes",
                        "Wifi": "Wi-Fi 7",
                        "Bluetooth": "5.3",
                        "Nfc": "Yes",
                        "Usb": "USB-C 3.2"
                    },
                    "Dimensions": {
                        "Full": "162.3 x 79.0 x 8.6mm",
                        "Weight": "232g"
                    },
                    "Os": {
                        "Operating System": "Android 14 with One UI 6.1",
                        "Features": [
                            "Galaxy AI",
                            "7 years of OS updates"
                        ]
                    },
                    "Security": {
                        "Biometrics": "Ultrasonic Fingerprint, Face Recognition"
                    },
                    "Durability": {
                        "Material": "Armor Aluminum frame, Gorilla Glass Victus 2",
                        "Water Resistance": "IP68"
                    },
                    "AdditionalFeatures": [
                        "S Pen included",
                        "Samsung DeX",
                        "UWB support",
                        "Satellite connectivity"
                    ]
                }
            };
        }
        
        // If not using sample data, proceed with API call
        // For a real implementation, you would fetch the specific product
        // Here we're just getting all products and finding the one we want
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const products = await response.json();
        
        // Find the specific product
        const product = products.find(p => p.product_id === productId);
        
        if (!product) {
            throw new Error('Product not found');
        }
        
        return product;
        
    } catch (error) {
        console.error('Error fetching product details:', error);
        return null;
    }
}

/**
 * Hide product search interface
 */
function hideProductSearch() {
    if (!productSearchInput || !productSearchResults) return;
    
    productSearchInput.style.display = 'none';
    productSearchResults.style.display = 'none';
}

/**
 * Update the specifications comparison table
 */
function updateSpecsComparison() {
    console.log('updateSpecsComparison called');
    compareSpecsTable = document.getElementById('compare-specs-table');
    
    if (!compareSpecsTable) {
        console.error('compareSpecsTable not found');
        return;
    }
    
    // Clear the table
    compareSpecsTable.innerHTML = '';
    
    // If no products to compare, show message
    if (compareProducts.length === 0) {
        console.log('No products to compare');
        compareSpecsTable.innerHTML = '<tr><td colspan="3" class="no-compare-data">Add products to compare specifications</td></tr>';
        return;
    }
    
    console.log('Updating specs comparison with', compareProducts.length, 'products');
    
    // Create header row
    const headerRow = document.createElement('tr');
    headerRow.className = 'compare-header-row';
    
    headerRow.innerHTML = `
        <th class="compare-spec-name">Specification</th>
        ${compareProducts.map(product => `
            <th class="compare-spec-value">${product.model}</th>
        `).join('')}
        ${compareProducts.length === 1 ? '<th class="compare-spec-value empty">Add a product</th>' : ''}
    `;
    
    compareSpecsTable.appendChild(headerRow);
    
    // Get all spec categories from both products
    const allCategories = new Set();
    
    compareProducts.forEach(product => {
        if (product.specs) {
            Object.keys(product.specs).forEach(category => {
                allCategories.add(category);
            });
        }
    });
    
    // Order of specifications (for consistent display)
    const specOrder = [
        'Performance', 'Display', 'Camera', 'Battery', 'Connectivity', 
        'Dimensions', 'Os', 'Security', 'Durability', 'Audio', 'AdditionalFeatures'
    ];
    
    // Create a sorted list of spec categories
    const sortedCategories = Array.from(allCategories).sort((a, b) => {
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
        // Create category header
        const categoryRow = document.createElement('tr');
        categoryRow.className = 'compare-category-row';
        
        categoryRow.innerHTML = `
            <td colspan="${compareProducts.length + 1}" class="compare-category-name">
                ${formatCategoryName(category)}
            </td>
        `;
        
        compareSpecsTable.appendChild(categoryRow);
        
        // Get all spec keys for this category across all products
        const specKeys = new Set();
        
        compareProducts.forEach(product => {
            if (product.specs && product.specs[category]) {
                if (Array.isArray(product.specs[category])) {
                    // For array specs like AdditionalFeatures, add a single key
                    specKeys.add('features');
                } else if (typeof product.specs[category] === 'object') {
                    // For object specs, add all keys
                    Object.keys(product.specs[category]).forEach(key => {
                        specKeys.add(key);
                    });
                }
            }
        });
        
        // Add rows for each spec
        specKeys.forEach(key => {
            const specRow = document.createElement('tr');
            specRow.className = 'compare-spec-row';
            
            // Start with spec name
            let rowHTML = `<td class="compare-spec-name">${formatSpecName(key)}</td>`;
            
            // Add values for each product
            compareProducts.forEach(product => {
                let specValue = '';
                
                if (product.specs && product.specs[category]) {
                    if (key === 'features' && Array.isArray(product.specs[category])) {
                        // Handle array values (like AdditionalFeatures)
                        specValue = `
                            <ul class="compare-spec-list">
                                ${product.specs[category].map(item => `<li>${item}</li>`).join('')}
                            </ul>
                        `;
                    } else if (typeof product.specs[category] === 'object' && product.specs[category][key]) {
                        // Handle object values
                        if (Array.isArray(product.specs[category][key])) {
                            // Handle array values within objects
                            specValue = `
                                <ul class="compare-spec-list">
                                    ${product.specs[category][key].map(item => `<li>${item}</li>`).join('')}
                                </ul>
                            `;
                        } else if (typeof product.specs[category][key] === 'object' && product.specs[category][key] !== null) {
                            // Handle nested objects (like Display.Main)
                            specValue = `
                                <table class="nested-compare-specs">
                                    ${Object.entries(product.specs[category][key]).map(([nestedKey, nestedValue]) => `
                                        <tr>
                                            <td class="nested-compare-spec-name">${formatSpecName(nestedKey)}</td>
                                            <td class="nested-compare-spec-value">${nestedValue}</td>
                                        </tr>
                                    `).join('')}
                                </table>
                            `;
                        } else {
                            // Handle simple values
                            specValue = product.specs[category][key];
                        }
                    }
                }
                
                rowHTML += `<td class="compare-spec-value">${specValue}</td>`;
            });
            
            // Add empty cell if only one product
            if (compareProducts.length === 1) {
                rowHTML += '<td class="compare-spec-value empty"></td>';
            }
            
            specRow.innerHTML = rowHTML;
            compareSpecsTable.appendChild(specRow);
        });
    });
}

/**
 * Update the prices comparison table
 */
function updatePricesComparison() {
    console.log('updatePricesComparison called');
    comparePricesTable = document.getElementById('compare-prices-table');
    
    if (!comparePricesTable) {
        console.error('comparePricesTable not found');
        return;
    }
    
    // Clear the table
    comparePricesTable.innerHTML = '';
    
    // If no products to compare, show message
    if (compareProducts.length === 0) {
        console.log('No products to compare prices');
        comparePricesTable.innerHTML = '<tr><td colspan="3" class="no-compare-data">Add products to compare prices</td></tr>';
        return;
    }
    
    console.log('Updating price comparison with', compareProducts.length, 'products');
    
    // Add a heading for the Price Comparison section
    const priceComparisonHeading = document.createElement('tr');
    priceComparisonHeading.innerHTML = `
        <td colspan="${compareProducts.length + 1}" class="compare-category-name" style="background-color: #f0f8ff; color: #0066cc; font-size: 18px; padding: 15px;">
            <i class="fas fa-tags"></i> Price Comparison
        </td>
    `;
    comparePricesTable.appendChild(priceComparisonHeading);
    
    // Create header row
    const headerRow = document.createElement('tr');
    headerRow.className = 'compare-header-row';
    
    headerRow.innerHTML = `
        <th class="compare-retailer-name">Retailer</th>
        ${compareProducts.map(product => `
            <th class="compare-price-value">${product.model}</th>
        `).join('')}
        ${compareProducts.length === 1 ? '<th class="compare-price-value empty">Add a product</th>' : ''}
    `;
    
    comparePricesTable.appendChild(headerRow);
    
    // Get all retailers from both products
    const allRetailers = new Set();
    
    compareProducts.forEach(product => {
        if (product.offers) {
            product.offers.forEach(offer => {
                allRetailers.add(offer.retailer);
            });
        }
    });
    
    // Convert to array and sort alphabetically
    const sortedRetailers = Array.from(allRetailers).sort();
    
    // Add rows for each retailer
    sortedRetailers.forEach(retailer => {
        const retailerRow = document.createElement('tr');
        retailerRow.className = 'compare-price-row';
        
        // Start with retailer name
        let rowHTML = `<td class="compare-retailer-name">${retailer}</td>`;
        
        // Add prices for each product
        compareProducts.forEach(product => {
            let priceHTML = 'Not available';
            
            if (product.offers) {
                const retailerOffer = product.offers.find(offer => offer.retailer === retailer);
                
                if (retailerOffer) {
                    const currentPrice = retailerOffer.price
                        ? retailerOffer.price.toLocaleString('en-ZA', {
                            style: 'currency',
                            currency: 'ZAR',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                          })
                        : 'Price not available';
                        
                    const originalPrice = retailerOffer.originalPrice && retailerOffer.originalPrice !== retailerOffer.price
                        ? retailerOffer.originalPrice.toLocaleString('en-ZA', {
                            style: 'currency',
                            currency: 'ZAR',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                          })
                        : null;
                    
                    priceHTML = `
                        <div class="compare-price-container">
                            ${originalPrice ? `<span class="compare-original-price">${originalPrice}</span>` : ''}
                            <span class="compare-current-price">${currentPrice}</span>
                            ${retailerOffer.saleEnds ? `<span class="compare-sale-ends">Sale ends: ${retailerOffer.saleEnds}</span>` : ''}
                            <a href="${retailerOffer.url}" class="compare-retailer-link" target="_blank" rel="noopener">
                                <i class="fas fa-external-link-alt"></i> Visit
                            </a>
                        </div>
                    `;
                }
            }
            
            rowHTML += `<td class="compare-price-value">${priceHTML}</td>`;
        });
        
        // Add empty cell if only one product
        if (compareProducts.length === 1) {
            rowHTML += '<td class="compare-price-value empty"></td>';
        }
        
        retailerRow.innerHTML = rowHTML;
        comparePricesTable.appendChild(retailerRow);
    });
}

// Initialize comparison functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded event fired');
    
    // Wait for the product info to be loaded
    if (typeof initPage === 'function') {
        console.log('initPage function exists, overriding it');
        
        // Original initPage function exists, we need to wait for it to complete
        const originalInitPage = initPage;
        
        initPage = async function() {
            console.log('Modified initPage function called');
            await originalInitPage();
            console.log('Original initPage completed, calling initCompare');
            initCompare();
        };
    } else {
        console.log('initPage function does not exist, calling initCompare directly');
        // No initPage function, initialize comparison directly
        initCompare();
    }
});

// Add a direct event listener to the compare button
window.addEventListener('load', () => {
    console.log('Window load event fired');
    
    setTimeout(() => {
        console.log('Checking for compare button after timeout');
        const compareBtn = document.getElementById('compare-btn');
        
        if (compareBtn) {
            console.log('Found compare button after timeout, adding click listener');
            compareBtn.addEventListener('click', () => {
                console.log('Compare button clicked (from window.load listener)');
                
                // Re-initialize all DOM elements to ensure they're found
                compareModal = document.getElementById('compare-modal');
                compareModalClose = document.getElementById('compare-modal-close');
                compareProductsContainer = document.getElementById('compare-products-container');
                compareSpecsTable = document.getElementById('compare-specs-table');
                comparePricesTable = document.getElementById('compare-prices-table');
                productSearchInput = document.getElementById('product-search-input');
                productSearchResults = document.getElementById('product-search-results');
                
                // Add event listener to close button again
                if (compareModalClose) {
                    console.log('Re-adding click event listener to close button:', compareModalClose);
                    // Remove any existing event listeners first
                    compareModalClose.replaceWith(compareModalClose.cloneNode(true));
                    // Get the new element reference
                    compareModalClose = document.getElementById('compare-modal-close');
                    // Add the event listener
                    compareModalClose.addEventListener('click', function() {
                        console.log('Close button clicked (from re-added listener)');
                        hideCompareModal();
                    });
                } else {
                    console.error('Compare modal close button not found during re-initialization');
                }
                
                console.log('Re-initialized DOM elements:');
                console.log('- Compare modal:', compareModal);
                console.log('- Compare products container:', compareProductsContainer);
                
                if (compareModal) {
                    console.log('Showing compare modal directly');
                    compareModal.style.display = 'flex';
                    document.body.style.overflow = 'hidden';
                    
                    // Make sure we have at least the current product in the comparison
                    if (currentProduct && compareProducts.length === 0) {
                        console.log('Adding current product to comparison:', currentProduct.model);
                        addToCompare(currentProduct);
                    } else {
                        updateCompareView();
                    }
                } else {
                    console.error('Compare modal not found');
                }
            });
        } else {
            console.error('Compare button not found after timeout');
        }
    }, 1000); // Wait 1 second for dynamic content to load
});

// Add a sample product for testing if needed
function addSampleProduct() {
    if (compareProducts.length < 2 && allProducts.length > 0) {
        // Find a different product than the current one
        const differentProduct = allProducts.find(p =>
            p.product_id !== currentProduct.product_id
        );
        
        if (differentProduct) {
            addToCompare(differentProduct);
        }
    }
}