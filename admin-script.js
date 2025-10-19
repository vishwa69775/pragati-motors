// Admin Panel JavaScript for PRAGATI MOTORS

// Global variables
let products = [];
let currentEditingId = null;
let uploadedPhotos = [];
let currentCoverPhoto = null;

// Initialize the admin panel
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    updateDashboardStats();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    document.getElementById('searchProducts').addEventListener('input', filterProducts);
    
    // Form submission
    document.getElementById('productForm').addEventListener('submit', handleFormSubmit);
    
    // Event delegation for dynamically created buttons
    document.addEventListener('click', function(event) {
        // Handle edit button clicks
        if (event.target.closest('.btn-warning') && event.target.closest('[data-product-id]')) {
            const productId = event.target.closest('[data-product-id]').getAttribute('data-product-id');
            console.log('Edit button clicked via delegation for product ID:', productId);
            showEditProductForm(productId);
        }
        
        // Handle delete button clicks
        if (event.target.closest('.btn-danger') && event.target.closest('[data-product-id]')) {
            const productId = event.target.closest('[data-product-id]').getAttribute('data-product-id');
            console.log('Delete button clicked via delegation for product ID:', productId);
            showDeleteModal(productId);
        }
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        const productModal = document.getElementById('productModal');
        const deleteModal = document.getElementById('deleteModal');
        const imageModal = document.getElementById('imageModal');
        
        if (event.target === productModal) {
            closeModal();
        }
        if (event.target === deleteModal) {
            closeDeleteModal();
        }
        if (event.target === imageModal) {
            closeImageModal();
        }
    });
}

// Load products from localStorage
function loadProducts() {
    const savedProducts = localStorage.getItem('pragatiMotorsProducts');
    if (savedProducts) {
        products = JSON.parse(savedProducts);
    } else {
        // Add some sample products for demonstration
        products = [
            {
                id: 'sample1',
                name: 'John Deere 3025E',
                price: 18500.00,
                horsepower: '25 HP',
                description: 'Perfect for small farms and landscaping. Features hydrostatic transmission and 4WD capability.',
                photos: [],
                coverPhoto: null,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 'sample2',
                name: 'Massey Ferguson 4707',
                price: 32000.00,
                horsepower: '75 HP',
                description: 'Versatile tractor for medium-scale farming operations. Heavy-duty construction with advanced hydraulics.',
                photos: [],
                coverPhoto: null,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ];
        saveProducts();
    }
    renderProducts();
}

// Save products to localStorage
function saveProducts() {
    localStorage.setItem('pragatiMotorsProducts', JSON.stringify(products));
    updateDashboardStats();
}

// Update dashboard statistics
function updateDashboardStats() {
    const totalProducts = products.length;
    const avgPrice = totalProducts > 0 ? 
        products.reduce((sum, product) => sum + parseFloat(product.price), 0) / totalProducts : 0;
    const totalImages = products.reduce((sum, product) => sum + (product.photos ? product.photos.length : 0), 0);
    
    document.getElementById('totalProducts').textContent = totalProducts;
    document.getElementById('avgPrice').textContent = `₹${avgPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    document.getElementById('totalImages').textContent = totalImages;
}

// Show add product form
function showAddProductForm() {
    currentEditingId = null;
    document.getElementById('modalTitle').textContent = 'Add New Product';
    document.getElementById('submitBtn').textContent = 'Add Product';
    document.getElementById('productForm').reset();
    uploadedPhotos = [];
    currentCoverPhoto = null;
    updatePhotoDisplay();
    document.getElementById('productModal').style.display = 'block';
}

// Show edit product form
function showEditProductForm(productId) {
    console.log('Edit button clicked for product ID:', productId);
    console.log('Available products:', products.map(p => ({ id: p.id, name: p.name })));
    
    // Try to find product by string comparison
    const product = products.find(p => String(p.id) === String(productId));
    console.log('Found product:', product);
    
    if (!product) {
        console.error('Product not found with ID:', productId);
        showNotification('Product not found!', 'error');
        return;
    }
    
    currentEditingId = productId;
    document.getElementById('modalTitle').textContent = 'Edit Product';
    document.getElementById('submitBtn').textContent = 'Update Product';
    
    // Fill form with product data
    document.getElementById('productName').value = product.name || '';
    document.getElementById('productPrice').value = product.price || '';
    document.getElementById('productHorsepower').value = product.horsepower || '';
    document.getElementById('productDescription').value = product.description || '';
    
    // Load photos
    uploadedPhotos = product.photos || [];
    currentCoverPhoto = product.coverPhoto || (uploadedPhotos.length > 0 ? uploadedPhotos[0].id : null);
    updatePhotoDisplay();
    
    document.getElementById('productModal').style.display = 'block';
}

// Handle photo upload
function handlePhotoUpload(event) {
    const files = Array.from(event.target.files);
    
    files.forEach(file => {
        if (file.type.startsWith('image/')) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                showNotification('File size must be less than 5MB', 'error');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(e) {
                const photoData = {
                    id: Date.now() + Math.random(),
                    data: e.target.result,
                    name: file.name
                };
                uploadedPhotos.push(photoData);
                updatePhotoDisplay();
            };
            reader.readAsDataURL(file);
        } else {
            showNotification('Please select only image files', 'error');
        }
    });
    
    // Reset file input
    event.target.value = '';
}

// Update photo display
function updatePhotoDisplay() {
    const container = document.getElementById('uploadedPhotos');
    const coverSection = document.getElementById('coverPhotoSection');
    const coverSelection = document.getElementById('coverPhotoSelection');
    
    // Clear existing photos
    container.innerHTML = '';
    coverSelection.innerHTML = '';
    
    if (uploadedPhotos.length === 0) {
        coverSection.style.display = 'none';
        return;
    }
    
    // Show cover photo selection
    coverSection.style.display = 'block';
    
    uploadedPhotos.forEach(photo => {
        // Main photo display
        const photoItem = document.createElement('div');
        photoItem.className = 'photo-item';
        photoItem.innerHTML = `
            <img src="${photo.data}" alt="${photo.name}" onclick="previewImage('${photo.data}')">
            <div class="photo-actions">
                <button class="photo-btn cover ${currentCoverPhoto === photo.id ? 'selected' : ''}" 
                        onclick="setCoverPhoto('${photo.id}')" title="Set as cover">
                    <i class="fas fa-star"></i>
                </button>
                <button class="photo-btn delete" onclick="removePhoto('${photo.id}')" title="Remove photo">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        container.appendChild(photoItem);
        
        // Cover photo selection
        const coverOption = document.createElement('div');
        coverOption.className = `cover-option ${currentCoverPhoto === photo.id ? 'selected' : ''}`;
        coverOption.onclick = () => setCoverPhoto(photo.id);
        coverOption.innerHTML = `
            <img src="${photo.data}" alt="${photo.name}">
            ${currentCoverPhoto === photo.id ? '<div class="cover-badge">Cover</div>' : ''}
        `;
        coverSelection.appendChild(coverOption);
    });
}

// Set cover photo
function setCoverPhoto(photoId) {
    currentCoverPhoto = photoId;
    updatePhotoDisplay();
}

// Remove photo
function removePhoto(photoId) {
    uploadedPhotos = uploadedPhotos.filter(photo => photo.id !== photoId);
    if (currentCoverPhoto === photoId) {
        currentCoverPhoto = uploadedPhotos.length > 0 ? uploadedPhotos[0].id : null;
    }
    updatePhotoDisplay();
}

// Preview image
function previewImage(imageSrc) {
    document.getElementById('previewImage').src = imageSrc;
    document.getElementById('imageModal').style.display = 'block';
}

// Close image modal
function closeImageModal() {
    document.getElementById('imageModal').style.display = 'none';
}

// Handle form submission
function handleFormSubmit(event) {
    event.preventDefault();
    
    // Validate required fields
    const name = document.getElementById('productName').value.trim();
    const price = document.getElementById('productPrice').value;
    const description = document.getElementById('productDescription').value.trim();
    
    if (!name || !price || !description) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    if (uploadedPhotos.length === 0) {
        showNotification('Please upload at least one photo', 'error');
        return;
    }
    
    if (!currentCoverPhoto) {
        showNotification('Please select a cover photo', 'error');
        return;
    }
    
    // Get form data
    const productData = {
        id: currentEditingId || Date.now(),
        name: name,
        price: parseFloat(price),
        horsepower: document.getElementById('productHorsepower').value.trim(),
        description: description,
        photos: uploadedPhotos,
        coverPhoto: currentCoverPhoto,
        createdAt: currentEditingId ? 
            products.find(p => p.id === currentEditingId).createdAt : 
            new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    if (currentEditingId) {
        // Update existing product
        const index = products.findIndex(p => String(p.id) === String(currentEditingId));
        console.log('Updating product at index:', index, 'for ID:', currentEditingId);
        if (index !== -1) {
            products[index] = productData;
            showNotification('Product updated successfully!', 'success');
        } else {
            console.error('Product not found for update with ID:', currentEditingId);
            showNotification('Product not found for update!', 'error');
            return;
        }
    } else {
        // Add new product
        products.push(productData);
        showNotification('Product added successfully!', 'success');
    }
    
    saveProducts();
    renderProducts();
    closeModal();
}

// Render products
function renderProducts() {
    const container = document.getElementById('productsGrid');
    const searchTerm = document.getElementById('searchProducts').value.toLowerCase();
    
    let filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
                            product.description.toLowerCase().includes(searchTerm);
        return matchesSearch;
    });
    
    if (filteredProducts.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-tractor"></i>
                <h3>No products found</h3>
                <p>${products.length === 0 ? 'Add your first product to get started!' : 'Try adjusting your search or filter criteria.'}</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filteredProducts.map(product => {
        const coverPhoto = product.photos && product.photos.find(p => p.id === product.coverPhoto);
        const coverImageSrc = coverPhoto ? coverPhoto.data : 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23f8f9fa"/><text x="50" y="50" text-anchor="middle" dy=".3em" fill="%23ccc" font-size="2rem">🚜</text></svg>';
        
        // Ensure product ID is properly escaped for onclick handlers
        const productId = String(product.id).replace(/'/g, "\\'");
        
        return `
            <div class="product-card">
                <div class="product-image">
                    <img src="${coverImageSrc}" alt="${product.name}" onclick="previewImage('${coverImageSrc}')">
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-price">₹${product.price.toLocaleString()}</div>
                    <p class="product-description">${product.description}</p>
                    <div class="product-actions">
                        <button class="btn btn-warning btn-sm" onclick="showEditProductForm('${productId}')" data-product-id="${productId}">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="showDeleteModal('${productId}')" data-product-id="${productId}">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Get category label (now just returns the category as entered by admin)
function getCategoryLabel(category) {
    return category;
}

// Filter products
function filterProducts() {
    renderProducts();
}

// Show delete confirmation modal
function showDeleteModal(productId) {
    console.log('Delete button clicked for product ID:', productId);
    console.log('Available products:', products.map(p => ({ id: p.id, name: p.name })));
    
    // Try to find product by string comparison
    const product = products.find(p => String(p.id) === String(productId));
    console.log('Found product for deletion:', product);
    
    if (!product) {
        console.error('Product not found with ID:', productId);
        showNotification('Product not found!', 'error');
        return;
    }
    
    const coverPhoto = product.photos && product.photos.find(p => p.id === product.coverPhoto);
    const coverImageSrc = coverPhoto ? coverPhoto.data : 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23f8f9fa"/><text x="50" y="50" text-anchor="middle" dy=".3em" fill="%23ccc" font-size="2rem">🚜</text></svg>';
    
    document.getElementById('deletePreview').innerHTML = `
        <img src="${coverImageSrc}" alt="${product.name}" class="preview-image">
        <div class="preview-info">
            <h4>${product.name}</h4>
            <p>₹${product.price.toLocaleString()}</p>
        </div>
    `;
    
    document.getElementById('deleteModal').style.display = 'block';
    document.getElementById('deleteModal').dataset.productId = productId;
}

// Confirm delete
function confirmDelete() {
    const productId = document.getElementById('deleteModal').dataset.productId;
    console.log('Confirming deletion of product ID:', productId);
    
    if (!productId) {
        console.error('No product ID found for deletion');
        showNotification('No product selected for deletion!', 'error');
        return;
    }
    
    const initialLength = products.length;
    products = products.filter(p => String(p.id) !== String(productId));
    
    if (products.length < initialLength) {
        saveProducts();
        renderProducts();
        closeDeleteModal();
        showNotification('Product deleted successfully!', 'success');
    } else {
        console.error('Product not found for deletion');
        showNotification('Product not found for deletion!', 'error');
    }
}

// Close modals
function closeModal() {
    document.getElementById('productModal').style.display = 'none';
    uploadedPhotos = [];
    currentCoverPhoto = null;
}

function closeDeleteModal() {
    document.getElementById('deleteModal').style.display = 'none';
    delete document.getElementById('deleteModal').dataset.productId;
}

// Show notification
function showNotification(message, type = 'info') {
    const container = document.getElementById('notificationContainer');
    
    // Remove existing notifications
    container.innerHTML = '';
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    container.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Add slide out animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Export products (for backup)
function exportProducts() {
    const dataStr = JSON.stringify(products, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'pragati-motors-products.json';
    link.click();
    URL.revokeObjectURL(url);
}

// Import products (for restore)
function importProducts(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedProducts = JSON.parse(e.target.result);
            if (Array.isArray(importedProducts)) {
                products = importedProducts;
                saveProducts();
                renderProducts();
                showNotification('Products imported successfully!', 'success');
            } else {
                showNotification('Invalid file format', 'error');
            }
        } catch (error) {
            showNotification('Error importing products: ' + error.message, 'error');
        }
    };
    reader.readAsText(file);
    
    // Reset file input
    event.target.value = '';
}

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Escape key to close modals
    if (event.key === 'Escape') {
        closeModal();
        closeDeleteModal();
        closeImageModal();
    }
    
    // Ctrl+N to add new product
    if (event.ctrlKey && event.key === 'n') {
        event.preventDefault();
        showAddProductForm();
    }
});

// Add export/import buttons to admin actions
document.addEventListener('DOMContentLoaded', function() {
    const adminActions = document.querySelector('.admin-actions');
    if (adminActions) {
        adminActions.innerHTML += `
            <button class="btn btn-secondary" onclick="exportProducts()" title="Export Products">
                <i class="fas fa-download"></i> Export
            </button>
            <label class="btn btn-secondary" title="Import Products">
                <i class="fas fa-upload"></i> Import
                <input type="file" accept=".json" onchange="importProducts(event)" style="display: none;">
            </label>
        `;
    }
});

// Test function to verify buttons are working
function testButtons() {
    console.log('Testing admin panel functionality...');
    console.log('Total products:', products.length);
    console.log('Products:', products.map(p => ({ id: p.id, name: p.name })));
    
    // Test if functions exist
    console.log('showEditProductForm exists:', typeof showEditProductForm === 'function');
    console.log('showDeleteModal exists:', typeof showDeleteModal === 'function');
}

// Run test on load
setTimeout(testButtons, 1000);

console.log('PRAGATI MOTORS Admin Panel loaded successfully! 🚜');
