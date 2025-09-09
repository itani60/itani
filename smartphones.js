// Smartphones API Configuration
const SMARTPHONES_API_CONFIG = {
    endpoint: 'https://xf9zlapr5e.execute-api.af-south-1.amazonaws.com/smartphones',
    category: 'smartphones'
};

// For backward compatibility
const API_URL = SMARTPHONES_API_CONFIG.endpoint;

let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
const productsPerPage = 15;

const productsGrid = document.getElementById('products-grid');
const paginationContainer = document.getElementById('pagination');
const sortBySelect = document.getElementById('sort-by');
const brandCheckboxes = document.querySelectorAll('input[name="brand"]');
const osCheckboxes = document.querySelectorAll('input[name="os"]');
const priceCheckboxes = document.querySelectorAll('input[name="price"]');
const clearFiltersButton = document.getElementById('clear-filters');
const applyFiltersButtons = document.querySelectorAll('.apply-filters');
const cancelFiltersButtons = document.querySelectorAll('.cancel-filters');


// Helper: get wishlist product ids via wishlist.js
function getWishlistIdsForDisplay() {
    // Check if wishlistItems exists globally (from wishlist.js)
    if (typeof wishlistItems !== 'undefined' && Array.isArray(wishlistItems)) {
        // If backend returns array of IDs, use directly
        if (wishlistItems.length > 0 && typeof wishlistItems[0] === 'string') {
            return wishlistItems;
        }
        // If array of objects, extract IDs
        return wishlistItems.map(item => item.id);
    }
    // Fallback: try to load from localStorage (as array of objects)
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
        try {
            const arr = JSON.parse(savedWishlist);
            if (arr.length > 0 && typeof arr[0] === 'string') {
                return arr;
            }
            return arr.map(item => item.id);
        } catch (e) {
            return [];
        }
    }
    return [];
}

// Mock data for testing when API is unavailable
const mockProducts = [
    {
        product_id: "mock1",
        brand: "Samsung",
        model: "Galaxy S23 Ultra",
        category: "smartphones",
        imageUrl: "https://images.samsung.com/is/image/samsung/p6pim/za/2302/gallery/za-galaxy-s23-s918-sm-s918bzgcafa-534863667",
        offers: [
            { price: 22999, originalPrice: 25999 },
            { price: 23499, originalPrice: 25999 }
        ],
        specs: {
            Performance: {
                Ram: "12GB",
                Storage: "256GB"
            },
            Os: {
                "Operating System": "Android 13"
            }
        }
    },
    {
        product_id: "mock2",
        brand: "Apple",
        model: "iPhone 15 Pro",
        category: "smartphones",
        imageUrl: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-naturaltitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1692845702708",
        offers: [
            { price: 24999, originalPrice: 27999 },
            { price: 25499, originalPrice: 27999 }
        ],
        specs: {
            Performance: {
                Ram: "8GB",
                Storage: "256GB"
            },
            Os: {
                "Operating System": "iOS 17"
            }
        }
    },
    {
        product_id: "mock3",
        brand: "Xiaomi",
        model: "Redmi Note 12 Pro",
        category: "smartphones",
        imageUrl: "https://i01.appmifile.com/v1/MI_18455B3E4DA706226CF7535A58E875F0267/pms_1677750229.64975621!800x800!85.png",
        offers: [
            { price: 6999, originalPrice: 8999 },
            { price: 7499, originalPrice: 8999 }
        ],
        specs: {
            Performance: {
                Ram: "8GB",
                Storage: "128GB"
            },
            Os: {
                "Operating System": "Android 12"
            }
        }
    }
];

/**
 * Fetch smartphones products from API
 * @returns {Promise<Array>} - Promise that resolves to array of smartphones products
 */
async function fetchProducts() {
    try {
        showLoading();
        const response = await fetch(SMARTPHONES_API_CONFIG.endpoint);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        
        // Normalize products to ensure category is set
        allProducts = Array.isArray(data) ? data : (data.products || []);
        allProducts = allProducts.map(product => ({
            ...product,
            category: product.category || SMARTPHONES_API_CONFIG.category
        }));
        
        filteredProducts = [...allProducts];
        sortProducts(sortBySelect.value);
        displayProducts();
        setupPagination();
        hideLoading();
    } catch (error) {
        console.error('Error fetching products:', error);
        console.log('Using mock data for testing');
        
        // Use mock data instead - ensure category is set
        allProducts = mockProducts.map(product => ({
            ...product,
            category: product.category || SMARTPHONES_API_CONFIG.category
        }));
        filteredProducts = [...allProducts];
        sortProducts(sortBySelect.value);
        displayProducts();
        setupPagination();
        hideLoading();
    }
}

function showLoading() {
    productsGrid.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner"></div>
            <p>Loading products...</p>
        </div>
    `;
}

function hideLoading() {
    const loadingSpinner = document.querySelector('.loading-spinner');
    if (loadingSpinner) {
        loadingSpinner.remove();
    }
}

function displayProducts() {
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <p>No products match your filters.</p>
                <button class="reset-filters-btn" onclick="resetFilters()">Reset Filters</button>
            </div>
        `;
        paginationContainer.style.display = 'none';
        return;
    }
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = Math.min(startIndex + productsPerPage, filteredProducts.length);
    const currentProducts = filteredProducts.slice(startIndex, endIndex);

    productsGrid.innerHTML = '';

    // Get wishlist product ids from wishlist.js
    const wishlistIds = getWishlistIdsForDisplay();

    currentProducts.forEach(product => {
        const productCard = createProductCard(product, wishlistIds);
        productsGrid.appendChild(productCard);
    });

    paginationContainer.style.display = filteredProducts.length > productsPerPage ? 'flex' : 'none';
}

function createProductCard(product, wishlistIds) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-product-id', product.product_id);

    // Get the lowest price from offers
    let lowestPrice = Infinity;
    let highestOriginalPrice = 0;

    if (product.offers && product.offers.length > 0) {
        product.offers.forEach(offer => {
            if (offer.price && offer.price < lowestPrice) {
                lowestPrice = offer.price;
            }
            if (offer.originalPrice && offer.originalPrice > highestOriginalPrice) {
                highestOriginalPrice = offer.originalPrice;
            }
        });
    }

    // If no valid price was found, set to null
    if (lowestPrice === Infinity) {
        lowestPrice = null;
    }

    // Format price with commas
    const formattedPrice = lowestPrice ? lowestPrice.toLocaleString('en-ZA', {
        style: 'currency',
        currency: 'ZAR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }) : 'Price not available';

    // Extract RAM and storage from specs if available
    let ramText = '';
    let storageText = '';
    let osText = '';

    if (product.specs) {
        if (product.specs.Performance) {
            if (product.specs.Performance.Ram) {
                ramText = product.specs.Performance.Ram;
            }
            if (product.specs.Performance.Storage) {
                storageText = product.specs.Performance.Storage;
            }
        }
        if (product.specs.Os && product.specs.Os['Operating System']) {
            osText = product.specs.Os['Operating System'];
        }
    }

    // Check if product is in wishlist
    const isInWishlist = wishlistIds.includes(product.product_id);
    
    // Check if product has price alerts set
    const priceAlerts = getPriceAlerts();
    const hasPriceAlert = priceAlerts.some(alert => alert.productId === product.product_id);

    card.innerHTML = `
        <div class="product-link">
            <div class="product-image-container">
                <img src="${product.imageUrl}" alt="${product.model}" class="product-image" loading="lazy">
            </div>
            <div class="product-details">
                <div class="product-brand">${product.brand || 'Unknown Brand'}</div>
                <h3 class="product-name">${product.model || product.product_id}</h3>
                <div class="product-specs">
                    <span>${ramText} ${storageText}</span>
                    <span>${osText}</span>
                </div>
                <div class="product-price">
                    <span class="current-price">${formattedPrice}</span>
                    ${highestOriginalPrice > lowestPrice ? `<span class="original-price">R${highestOriginalPrice.toLocaleString()}</span>` : ''}
                </div>
                <div class="product-retailers">
                    <span>${product.offers ? product.offers.length : 0} retailers</span>
                </div>
            </div>
        </div>
        <div class="price-alert-bell ${hasPriceAlert ? 'active' : ''}" data-product-id="${product.product_id}" data-product-price="${lowestPrice || 0}" style="position: absolute; top: 10px; left: 10px; z-index: 100; color: #ff3a3a; background: white; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; font-size: 18px; box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2); cursor: pointer; border: 2px solid #ff3a3a;">
            <i class="fas fa-bell"></i>
        </div>
        <div class="product-buttons">
            <button class="compare-button" data-product-id="${product.product_id}">Compare</button>
            <button class="wishlist-button" data-product-id="${product.product_id}">Add to Wishlist</button>
        </div>
    `;

    // Add event listener for price alert bell
    const priceAlertBell = card.querySelector('.price-alert-bell');
    priceAlertBell.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const productId = this.getAttribute('data-product-id');
        const currentPrice = parseFloat(this.getAttribute('data-product-price'));
        
        togglePriceAlert(productId, currentPrice, product.model || product.brand + ' ' + product.product_id);
        
        // Debug log to check if the event listener is working
        console.log('Price alert bell clicked for product:', productId);
    });

    // Add event listener for compare button - navigates to smartphone-info.html
    const compareButton = card.querySelector('.compare-button');
    compareButton.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        // Navigate to smartphone info page
        window.location.href = `smartphones-info.html?id=${product.product_id}`;
    });

    // Add event listener for wishlist button
    const wishlistButton = card.querySelector('.wishlist-button');
    wishlistButton.addEventListener('click', async function (e) {
        e.preventDefault();
        e.stopPropagation();

        // Only call wishlist.js functions if loaded
        if (typeof addToWishlist === 'function' && typeof removeFromWishlist === 'function') {
            const productId = this.getAttribute('data-product-id');
            // Check if product is in wishlist by comparing with wishlistIds
            const isCurrentlyInWishlist = wishlistIds.includes(productId);

            // Show loading indicator
            this.classList.add('wishlist-loading');
            const originalText = this.innerHTML;
            this.innerHTML = '<div class="wishlist-spinner"></div>';

            try {
                if (isCurrentlyInWishlist) {
                    await removeFromWishlist(productId);
                } else {
                    const wishlistItem = {
                        id: productId,
                        name: `${product.brand} ${product.model || product.product_id}`,
                        price: getLowestPrice(product),
                        image: product.imageUrl,
                        url: `smartphones-product.html?id=${product.product_id}`
                    };

                    const result = await addToWishlist(wishlistItem);
                }
            } catch (error) {
                console.error('Error updating wishlist:', error);
                // Use a notification function from your main app if available
                if (typeof showNotification === 'function') {
                    showNotification('Wishlist Error', 'There was a problem updating your wishlist. Please try again.', 'error');
                }
            } finally {
                // Hide loading indicator
                this.classList.remove('wishlist-loading');
                this.innerHTML = originalText;
            }
        }
    });

    return card;
}

// Setup pagination
function setupPagination() {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const pagesContainer = document.querySelector('.pages');

    if (!pagesContainer) return;

    pagesContainer.innerHTML = '';

    // Function to get pages to show with ellipsis
    function getPagesToShow(currentPage, totalPages, maxPages = 5) {
        if (totalPages <= maxPages) {
            return Array.from({length: totalPages}, (_, i) => i + 1);
        }

        const pages = [];
        pages.push(1);

        const start = Math.max(2, currentPage - 2);
        const end = Math.min(totalPages - 1, currentPage + 3);

        if (start > 2) pages.push('...');

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (end < totalPages - 1) pages.push('...');

        if (totalPages > 1) pages.push(totalPages);

        return pages;
    }

    const pagesToShow = getPagesToShow(currentPage, totalPages);

    // Add page buttons or ellipsis
    pagesToShow.forEach(page => {
        if (page === '...') {
            const ellipsis = document.createElement('span');
            ellipsis.className = 'pagination-ellipsis';
            ellipsis.textContent = '...';
            pagesContainer.appendChild(ellipsis);
        } else {
            const pageButton = document.createElement('button');
            pageButton.className = `page-number ${page === currentPage ? 'active' : ''}`;
            pageButton.textContent = page;
            pageButton.setAttribute('data-page', page);
            pageButton.addEventListener('click', () => {
                currentPage = page;
                displayProducts();
                updatePaginationActive();
            });
            pagesContainer.appendChild(pageButton);
        }
    });

    // Add event listeners to prev/next buttons
    const prevButton = document.querySelector('.page-nav[data-page="prev"]');
    const nextButton = document.querySelector('.page-nav[data-page="next"]');

    if (prevButton) {
        prevButton.disabled = currentPage === 1;
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                displayProducts();
                updatePaginationActive();
            }
        });
    }

    if (nextButton) {
        nextButton.disabled = currentPage === totalPages;
        nextButton.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                displayProducts();
                updatePaginationActive();
            }
        });
    }
}

// Update active state in pagination
function updatePaginationActive() {
    const pageButtons = document.querySelectorAll('.page-number');
    pageButtons.forEach(button => {
        button.classList.toggle('active', parseInt(button.getAttribute('data-page')) === currentPage);
    });

    const prevButton = document.querySelector('.page-nav[data-page="prev"]');
    const nextButton = document.querySelector('.page-nav[data-page="next"]');

    if (prevButton) {
        prevButton.disabled = currentPage === 1;
    }

    if (nextButton) {
        const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
        nextButton.disabled = currentPage === totalPages;
    }

    // Scroll to top of products section
    document.querySelector('.deals-section').scrollIntoView({ behavior: 'smooth' });
}

// Helper function to get lowest price from offers
function getLowestPrice(product) {
    let lowestPrice = Infinity;
    if (product.offers && product.offers.length > 0) {
        product.offers.forEach(offer => {
            if (offer.price && offer.price < lowestPrice) {
                lowestPrice = offer.price;
            }
        });
    }
    return lowestPrice === Infinity ? 0 : lowestPrice;
}


// Sort products
function sortProducts(sortOption) {
    switch (sortOption) {
        case 'price-asc':
            filteredProducts.sort((a, b) => getLowestPrice(a) - getLowestPrice(b));
            break;
        case 'price-desc':
            filteredProducts.sort((a, b) => getLowestPrice(b) - getLowestPrice(a));
            break;
        case 'brand-asc':
            filteredProducts.sort((a, b) => (a.brand || '').localeCompare(b.brand || ''));
            break;
        case 'brand-desc':
            filteredProducts.sort((a, b) => (b.brand || '').localeCompare(a.brand || ''));
            break;
        case 'relevance':
        default:
            filteredProducts = [...filteredProducts];
            break;
    }
    currentPage = 1;
    displayProducts();
    setupPagination();
}

// Check if any filters are currently applied
function areFiltersApplied() {
    const selectedBrands = Array.from(brandCheckboxes).filter(cb => cb.checked && cb.value !== 'all').length > 0;
    const selectedOS = Array.from(osCheckboxes).filter(cb => cb.checked).length > 0;
    const selectedPriceRanges = Array.from(priceCheckboxes).filter(cb => cb.checked).length > 0;
    const sortChanged = sortBySelect && sortBySelect.value !== 'relevance';

    return selectedBrands || selectedOS || selectedPriceRanges || sortChanged;
}

// Update clear filters button visibility
function updateClearButtonVisibility() {
    if (clearFiltersButton) {
        if (areFiltersApplied()) {
            clearFiltersButton.style.display = 'inline-block';
        } else {
            clearFiltersButton.style.display = 'none';
        }
    }
}

// Save filter state to localStorage
function saveFilterState() {
    const filterState = {
        selectedBrands: Array.from(brandCheckboxes).filter(cb => cb.checked && cb.value !== 'all').map(cb => cb.value),
        selectedOS: Array.from(osCheckboxes).filter(cb => cb.checked).map(cb => cb.value),
        selectedPriceRanges: Array.from(priceCheckboxes).filter(cb => cb.checked).map(cb => cb.value),
        sortOption: sortBySelect.value
    };
    localStorage.setItem('smartphoneFilters', JSON.stringify(filterState));
}

// Load filter state from localStorage
function loadFilterState() {
    const savedFilters = localStorage.getItem('smartphoneFilters');
    if (savedFilters) {
        try {
            const filterState = JSON.parse(savedFilters);

            // Restore brand checkboxes
            if (filterState.selectedBrands && filterState.selectedBrands.length > 0) {
                brandCheckboxes.forEach(checkbox => {
                    if (checkbox.value !== 'all') {
                        checkbox.checked = filterState.selectedBrands.includes(checkbox.value);
                    }
                });
                // Uncheck "all brands" if specific brands are selected
                const allBrandsCheckbox = document.querySelector('input[name="brand"][value="all"]');
                if (allBrandsCheckbox) {
                    allBrandsCheckbox.checked = filterState.selectedBrands.length === 0;
                }
            }

            // Restore OS checkboxes
            if (filterState.selectedOS && filterState.selectedOS.length > 0) {
                osCheckboxes.forEach(checkbox => {
                    checkbox.checked = filterState.selectedOS.includes(checkbox.value);
                });
            }

            // Restore price range checkboxes
            if (filterState.selectedPriceRanges && filterState.selectedPriceRanges.length > 0) {
                priceCheckboxes.forEach(checkbox => {
                    checkbox.checked = filterState.selectedPriceRanges.includes(checkbox.value);
                });
            }

            // Restore sort option
            if (filterState.sortOption && sortBySelect) {
                sortBySelect.value = filterState.sortOption;
            }

            return filterState;
        } catch (e) {
            console.error('Error loading filter state:', e);
            return null;
        }
    }
    return null;
}

// Apply filters
function applyFilters() {
    filteredProducts = [...allProducts];
    const selectedBrands = Array.from(brandCheckboxes).filter(cb => cb.checked && cb.value !== 'all').map(cb => cb.value);
    const selectedOS = Array.from(osCheckboxes).filter(cb => cb.checked).map(cb => cb.value);
    const selectedPriceRanges = Array.from(priceCheckboxes).filter(cb => cb.checked).map(cb => cb.value);

    if (selectedBrands.length > 0) {
        filteredProducts = filteredProducts.filter(product => {
            const productBrand = product.brand?.toLowerCase() || '';
            return selectedBrands.some(brand => productBrand.includes(brand));
        });
    }
    if (selectedOS.length > 0) {
        filteredProducts = filteredProducts.filter(product => {
            let productOS = '';
            if (product.specs && product.specs.Os && product.specs.Os['Operating System']) {
                productOS = product.specs.Os['Operating System'].toLowerCase();
            }
            return selectedOS.some(os => productOS.includes(os));
        });
    }
    if (selectedPriceRanges.length > 0) {
        filteredProducts = filteredProducts.filter(product => {
            let lowestPrice = Infinity;
            if (product.offers && product.offers.length > 0) {
                product.offers.forEach(offer => {
                    if (offer.price && offer.price < lowestPrice) {
                        lowestPrice = offer.price;
                    }
                });
            }
            if (lowestPrice === Infinity) lowestPrice = 0;
            return selectedPriceRanges.some(range => {
                if (range === '0-3000') return lowestPrice < 3000;
                if (range === '3000-8000') return lowestPrice >= 3000 && lowestPrice < 8000;
                if (range === '8000-15000') return lowestPrice >= 8000 && lowestPrice < 15000;
                if (range === '15000-25000') return lowestPrice >= 15000 && lowestPrice < 25000;
                if (range === '25000+') return lowestPrice >= 25000;
                return false;
            });
        });
    }

    // Save filter state before applying
    saveFilterState();

    sortProducts(sortBySelect.value);
    currentPage = 1;
    displayProducts();
    setupPagination();
    closeAllFilterPanels();

    // Update clear button visibility
    updateClearButtonVisibility();
}

// Reset all filters
function resetFilters() {
    brandCheckboxes.forEach(checkbox => {
        checkbox.checked = checkbox.value === 'all';
    });
    osCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    priceCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    });

    // Clear saved filter state from localStorage
    localStorage.removeItem('smartphoneFilters');

    filteredProducts = [...allProducts];
    sortProducts(sortBySelect.value);
    currentPage = 1;
    displayProducts();
    setupPagination();
    closeAllFilterPanels();

    // Update clear button visibility
    updateClearButtonVisibility();
}

// Close all filter panels
function closeAllFilterPanels() {
    const filterPanels = document.querySelectorAll('.filter-panel');
    filterPanels.forEach(panel => {
        panel.classList.remove('active');
    });
}

// Toggle filter panel
function toggleFilterPanel(panelId) {
    const panel = document.getElementById(panelId);
    const filterPanels = document.querySelectorAll('.filter-panel');
    filterPanels.forEach(p => {
        if (p.id !== panelId) {
            p.classList.remove('active');
        }
    });
    panel.classList.toggle('active');
}

// Price Alert Functions
function getPriceAlerts() {
    const savedAlerts = localStorage.getItem('priceAlerts');
    if (savedAlerts) {
        try {
            return JSON.parse(savedAlerts);
        } catch (e) {
            console.error('Error parsing price alerts:', e);
            return [];
        }
    }
    return [];
}

function savePriceAlerts(alerts) {
    localStorage.setItem('priceAlerts', JSON.stringify(alerts));
}

function togglePriceAlert(productId, currentPrice, productName) {
    const alerts = getPriceAlerts();
    const existingAlertIndex = alerts.findIndex(alert => alert.productId === productId);
    
    if (existingAlertIndex >= 0) {
        // Remove existing alert
        alerts.splice(existingAlertIndex, 1);
        showNotification('Price Alert Removed', `Price alert for ${productName} has been removed.`, 'info');
        
        // Update UI
        const bellIcon = document.querySelector(`.price-alert-bell[data-product-id="${productId}"]`);
        if (bellIcon) {
            bellIcon.classList.remove('active');
        }
    } else {
        // Show price alert modal
        showPriceAlertModal(productId, currentPrice, productName);
    }
    
    savePriceAlerts(alerts);
}

function showPriceAlertModal(productId, currentPrice, productName) {
    // Create modal HTML
    const modalHTML = `
        <div class="price-alert-modal" id="priceAlertModal">
            <div class="price-alert-container">
                <div class="price-alert-header">
                    <h2 class="price-alert-title">Set Price Alert</h2>
                    <button class="price-alert-close" id="priceAlertModalClose">&times;</button>
                </div>
                <div class="price-alert-content">
                    <div class="price-alert-product">
                        <div class="price-alert-product-image">
                            <img src="${document.querySelector(`.product-card[data-product-id="${productId}"] .product-image`).src}" alt="${productName}">
                        </div>
                        <div class="price-alert-product-info">
                            <h3 class="price-alert-product-title">${productName}</h3>
                            <div class="price-alert-product-price">R${currentPrice.toLocaleString()}</div>
                        </div>
                    </div>
                    
                    <form id="priceAlertForm">
                        <div class="price-alert-form-group">
                            <label for="alertPrice">Alert me when price drops below:</label>
                            <div class="price-alert-input-container">
                                <span class="price-alert-currency">R</span>
                                <input type="number" id="alertPrice" class="price-alert-input" value="${Math.floor(currentPrice * 0.9)}" min="1" max="${currentPrice - 1}">
                            </div>
                        </div>
                        
                        <div class="price-alert-form-group">
                            <label for="alertEmail">Email for notifications (optional):</label>
                            <input type="email" id="alertEmail" class="price-alert-input" placeholder="Enter your email address">
                        </div>
                        
                        <div class="price-alert-actions">
                            <button type="button" class="price-alert-btn secondary" id="cancelPriceAlert">Cancel</button>
                            <button type="button" id="savePriceAlert" class="price-alert-btn primary">Set Alert</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to body
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer.firstElementChild);
    
    // Add event listeners
    document.getElementById('priceAlertModalClose').addEventListener('click', () => {
        document.getElementById('priceAlertModal').classList.remove('active');
        setTimeout(() => {
            document.getElementById('priceAlertModal').remove();
        }, 300);
    });
    
    document.getElementById('cancelPriceAlert').addEventListener('click', () => {
        document.getElementById('priceAlertModal').classList.remove('active');
        setTimeout(() => {
            document.getElementById('priceAlertModal').remove();
        }, 300);
    });
    
    document.getElementById('savePriceAlert').addEventListener('click', () => {
        const alertPrice = parseFloat(document.getElementById('alertPrice').value);
        const alertEmail = document.getElementById('alertEmail').value;
        
        if (isNaN(alertPrice) || alertPrice >= currentPrice || alertPrice <= 0) {
            showNotification('Invalid Price', 'Please enter a valid price below the current price.', 'error');
            return;
        }
        
        // Save the alert
        const alerts = getPriceAlerts();
        alerts.push({
            productId,
            productName,
            currentPrice,
            alertPrice,
            email: alertEmail,
            dateCreated: new Date().toISOString()
        });
        savePriceAlerts(alerts);
        
        // Update UI
        const bellIcon = document.querySelector(`.price-alert-bell[data-product-id="${productId}"]`);
        if (bellIcon) {
            bellIcon.classList.add('active');
        }
        
        // Show confirmation
        showNotification('Price Alert Set', `We'll notify you when ${productName} drops below R${alertPrice.toLocaleString()}.`, 'success');
        
        // Close modal with animation
        document.getElementById('priceAlertModal').classList.remove('active');
        setTimeout(() => {
            document.getElementById('priceAlertModal').remove();
        }, 300);
    });
    
    // Show modal with animation
    setTimeout(() => {
        document.getElementById('priceAlertModal').classList.add('active');
    }, 10);
}

// Add CSS for price alert modal
const priceAlertStyle = document.createElement('style');
priceAlertStyle.textContent = `
    .price-alert-modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease;
        overflow-y: auto;
    }
    
    .price-alert-modal.active {
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 1;
    }
    
    .price-alert-container {
        position: relative;
        background-color: #fff;
        margin: 30px auto;
        width: 90%;
        max-width: 500px;
        border-radius: 12px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
        transform: translateY(0);
        transition: transform 0.3s ease;
        overflow: hidden;
        animation: modalFadeIn 0.3s ease;
    }
    
    @keyframes modalFadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .price-alert-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 25px;
        background: linear-gradient(135deg, #ff3a3a 0%, #ff5252 100%);
        color: white;
        position: relative;
    }
    
    .price-alert-title {
        margin: 0;
        font-size: 20px;
        font-weight: 600;
        color: white;
    }
    
    .price-alert-close {
        position: absolute;
        top: 15px;
        right: 15px;
        background: rgba(255, 255, 255, 0.2);
        border: none;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 16px;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    .price-alert-close:hover {
        background: rgba(255, 255, 255, 0.3);
        transform: rotate(90deg);
    }
    
    .price-alert-content {
        padding: 25px;
    }
    
    .price-alert-product {
        display: flex;
        align-items: center;
        gap: 15px;
        margin-bottom: 20px;
        padding-bottom: 20px;
        border-bottom: 1px solid #eee;
    }
    
    .price-alert-product-image {
        width: 80px;
        height: 80px;
        border-radius: 8px;
        overflow: hidden;
        background: #f9f9f9;
        padding: 5px;
    }
    
    .price-alert-product-image img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
    
    .price-alert-product-info {
        flex: 1;
    }
    
    .price-alert-product-title {
        font-size: 16px;
        font-weight: 600;
        color: #333;
        margin: 0 0 5px 0;
    }
    
    .price-alert-product-price {
        font-size: 18px;
        font-weight: 700;
        color: #ff3a3a;
    }
    
    .price-alert-form-group {
        margin-bottom: 20px;
    }
    
    .price-alert-form-group label {
        display: block;
        margin-bottom: 8px;
        color: #333;
        font-weight: 500;
        font-size: 15px;
    }
    
    .price-alert-input-container {
        position: relative;
        margin: 20px 0;
    }
    
    .price-alert-currency {
        position: absolute;
        left: 10px;
        top: 50%;
        transform: translateY(-50%);
        font-weight: bold;
        color: #333;
    }
    
    .price-alert-input {
        width: 100%;
        padding: 14px 14px 14px 30px;
        border: 2px solid #e1e5e9;
        border-radius: 10px;
        font-size: 15px;
        transition: all 0.3s ease;
        background-color: #f9f9f9;
    }
    
    .price-alert-input:focus {
        outline: none;
        border-color: #ff3a3a;
        background-color: #fff;
        box-shadow: 0 0 0 3px rgba(255, 58, 58, 0.1);
    }
    
    .price-alert-actions {
        display: flex;
        gap: 15px;
    }
    
    .price-alert-btn {
        flex: 1;
        padding: 14px;
        border-radius: 10px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        text-align: center;
    }
    
    .price-alert-btn.primary {
        background: linear-gradient(135deg, #ff3a3a 0%, #ff5252 100%);
        color: white;
        border: none;
        box-shadow: 0 4px 15px rgba(255, 58, 58, 0.3);
    }
    
    .price-alert-btn.primary:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 20px rgba(255, 58, 58, 0.4);
    }
    
    .price-alert-btn.secondary {
        background: white;
        color: #666;
        border: 2px solid #e1e5e9;
    }
    
    .price-alert-btn.secondary:hover {
        background: #f9f9f9;
        border-color: #ccc;
    }
    
    /* Responsive Adjustments */
    @media (max-width: 768px) {
        .price-alert-actions {
            flex-direction: column;
        }
    }
`;
document.head.appendChild(priceAlertStyle);

// Helper function to show notifications
function showNotification(title, message, type = 'info') {
    // Check if notification container exists
    let container = document.getElementById('notificationContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notificationContainer';
        container.className = 'notification-container';
        document.body.appendChild(container);
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    // Add icon based on type
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'error') icon = 'exclamation-circle';
    if (type === 'warning') icon = 'exclamation-triangle';
    
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas fa-${icon}"></i>
        </div>
        <div class="notification-content">
            <h4>${title}</h4>
            <p>${message}</p>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    // Add to container
    container.appendChild(notification);
    
    // Add close button functionality
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        notification.classList.add('notification-hiding');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.add('notification-hiding');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

document.addEventListener('DOMContentLoaded', async () => {
    await fetchProducts();


    // Load saved filter state and apply filters if any exist
    const savedFilterState = loadFilterState();
    if (savedFilterState) {
        // Apply the saved filters
        applyFilters();
    } else {
        // No saved filters, update button visibility
        updateClearButtonVisibility();
    }

    // Sort select change event
    if (sortBySelect) {
        sortBySelect.addEventListener('change', () => {
            sortProducts(sortBySelect.value);
            // Update clear button visibility when sort changes
            updateClearButtonVisibility();
        });
    }


    // Filter button click events
    const filterButtons = document.querySelectorAll('.filter-button');
    filterButtons.forEach(button => {
        if (button.id !== 'clear-filters') {
            button.addEventListener('click', () => {
                const panelId = button.getAttribute('data-panel');
                toggleFilterPanel(panelId);
            });
        }
    });
    if (clearFiltersButton) {
        clearFiltersButton.addEventListener('click', resetFilters);
    }
    applyFiltersButtons.forEach(button => {
        button.addEventListener('click', applyFilters);
    });
    cancelFiltersButtons.forEach(button => {
        button.addEventListener('click', closeAllFilterPanels);
    });

    // "All Brands" checkbox logic
    const allBrandsCheckbox = document.querySelector('input[name="brand"][value="all"]');
    if (allBrandsCheckbox) {
        allBrandsCheckbox.addEventListener('change', function () {
            if (this.checked) {
                brandCheckboxes.forEach(cb => {
                    if (cb.value !== 'all') cb.checked = false;
                });
            }
            // Update clear button visibility
            updateClearButtonVisibility();
        });
        brandCheckboxes.forEach(checkbox => {
            if (checkbox.value !== 'all') {
                checkbox.addEventListener('change', function () {
                    if (this.checked) allBrandsCheckbox.checked = false;
                    const anyBrandChecked = Array.from(brandCheckboxes).some(cb => cb.checked && cb.value !== 'all');
                    if (!anyBrandChecked) allBrandsCheckbox.checked = true;
                    // Update clear button visibility
                    updateClearButtonVisibility();
                });
            }
        });
    }

    // Add event listeners to OS and Price checkboxes for real-time button visibility updates
    osCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateClearButtonVisibility);
    });

    priceCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateClearButtonVisibility);
    });
    document.addEventListener('click', function (event) {
        const filterPanels = document.querySelectorAll('.filter-panel');
        const filterButtons = document.querySelectorAll('.filter-button');
        let clickedInsideFilter = false;
        filterPanels.forEach(panel => {
            if (panel.contains(event.target)) clickedInsideFilter = true;
        });
        filterButtons.forEach(button => {
            if (button.contains(event.target)) clickedInsideFilter = true;
        });
        if (!clickedInsideFilter) closeAllFilterPanels();
    });

    // Initialize clear button visibility
    updateClearButtonVisibility();
});

// Add CSS for wishlist button/spinner
const style = document.createElement('style');
style.textContent = `
    /* Wishlist button styles */
    .wishlist-button {
        transition: all 0.3s ease;
    }
    .wishlist-loading {
        position: relative;
    }
    .wishlist-spinner {
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255, 71, 87, 0.3);
        border-radius: 50%;
        border-top-color: #ff4757;
        animation: wishlist-spin 0.8s linear infinite;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    @keyframes wishlist-spin {
        to { transform: translate(-50%, -50%) rotate(360deg); }
    }
    .loading-spinner {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        padding: 40px 0;
    }
    .spinner {
        width: 50px;
        height: 50px;
        border: 5px solid rgba(0, 0, 0, 0.1);
        border-radius: 50%;
        border-top-color: #ff0000ff;
        animation: spin 1s ease-in-out infinite;
        margin-bottom: 15px;
    }
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
    .no-results {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        padding: 40px 0;
        text-align: center;
    }
    .no-results i {
        font-size: 48px;
        color: #ccc;
        margin-bottom: 15px;
    }
    .no-results p {
        font-size: 18px;
        color: #666;
        margin-bottom: 20px;
    }
    .reset-filters-btn {
        padding: 8px 16px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        transition: background-color 0.3s;
    }
    .reset-filters-btn:hover {
        background-color: #0056b3;
    }
    .error-message {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        padding: 40px 0;
        text-align: center;
    }
    .error-message i {
        font-size: 48px;
        color: #dc3545;
        margin-bottom: 15px;
    }
    .error-message p {
        font-size: 18px;
        color: #666;
        margin-bottom: 10px;
    }
    .error-message .error-details {
        font-size: 14px;
        color: #999;
    }
    .pagination-ellipsis {
        padding: 8px 12px;
        color: #666;
        font-weight: bold;
        cursor: default;
        user-select: none;
    }
`;
document.head.appendChild(style);