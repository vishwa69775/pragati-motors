// Load products from admin panel
function loadProductsFromAdmin() {
    const savedProducts = localStorage.getItem('pragatiMotorsProducts');
    const productsGrid = document.getElementById('productsGrid');
    
    console.log('loadProductsFromAdmin called');
    console.log('savedProducts:', savedProducts);
    console.log('productsGrid:', productsGrid);
    
    if (!savedProducts || !productsGrid) {
        console.log('No saved products or productsGrid not found');
        return;
    }
    
    const products = JSON.parse(savedProducts);
    console.log('Loaded products:', products);
    
    if (products.length === 0) {
        console.log('No products available');
        productsGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-tractor"></i>
                <h3>No Products Available</h3>
                <p>Please check back later for our latest tractor models.</p>
            </div>
        `;
        return;
    }
    
    productsGrid.innerHTML = products.map(product => {
        const coverPhoto = product.photos && product.photos.find(p => p.id === product.coverPhoto);
        const coverImageSrc = coverPhoto ? coverPhoto.data : 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23f8f9fa"/><text x="50" y="50" text-anchor="middle" dy=".3em" fill="%23ccc" font-size="2rem">🚜</text></svg>';
        
        // Ensure product ID is properly escaped for onclick handlers
        const productId = String(product.id).replace(/'/g, "\\'");
        
        return `
            <div class="product-card" onclick="showProductDetail('${productId}')" data-product-id="${productId}">
                <div class="product-image">
                    <img src="${coverImageSrc}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <div class="product-price">₹${product.price.toLocaleString()}</div>
                    <p>${product.description}</p>
                    <div class="product-click-hint">Click to view details</div>
                </div>
            </div>
        `;
    }).join('');
}

// Preview product image
function previewProductImage(imageSrc) {
    // Create modal for image preview
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        cursor: pointer;
    `;
    
    modal.innerHTML = `
        <img src="${imageSrc}" alt="Product Preview" style="max-width: 90%; max-height: 90%; border-radius: 10px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);">
    `;
    
    document.body.appendChild(modal);
    
    modal.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
}

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Header background change on scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.product-card, .service-card, .about-text, .about-image, .contact-item, .contact-form');
    animatedElements.forEach(el => observer.observe(el));
});

// Form submission handling
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = contactForm.querySelector('input[type="text"]').value;
        const email = contactForm.querySelector('input[type="email"]').value;
        const phone = contactForm.querySelector('input[type="tel"]').value;
        const tractorType = contactForm.querySelector('select').value;
        const message = contactForm.querySelector('textarea').value;
        
        // Simple validation
        if (!name || !email || !tractorType) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }
        
        // Simulate form submission
        showNotification('Thank you for your inquiry! We will contact you soon.', 'success');
        contactForm.reset();
    });
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
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
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        margin-left: auto;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
`;
document.head.appendChild(notificationStyles);

// Product card hover effects
document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Service card hover effects
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-5px) scale(1.05)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Counter animation for stats
function animateCounters() {
    const counters = document.querySelectorAll('.stat h3');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/\D/g, ''));
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current) + (counter.textContent.includes('+') ? '+' : '');
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + (counter.textContent.includes('+') ? '+' : '');
            }
        };
        
        updateCounter();
    });
}

// Trigger counter animation when stats section is visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Load products from admin panel
    loadProductsFromAdmin();
    
    // Add loaded class styles
    const loadedStyles = document.createElement('style');
    loadedStyles.textContent = `
        body {
            opacity: 0;
            transition: opacity 0.5s ease-in;
        }
        
        body.loaded {
            opacity: 1;
        }
    `;
    document.head.appendChild(loadedStyles);
});

// Add smooth reveal animation for sections
const revealElements = document.querySelectorAll('.products, .services, .about, .contact');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(50px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    revealObserver.observe(el);
});

// Add click-to-call functionality for phone numbers
document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const phoneNumber = link.getAttribute('href').replace('tel:', '');
        if (confirm(`Call ${phoneNumber}?`)) {
            window.location.href = link.getAttribute('href');
        }
    });
});

// Add email functionality
document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const email = link.getAttribute('href').replace('mailto:', '');
        if (confirm(`Send email to ${email}?`)) {
            window.location.href = link.getAttribute('href');
        }
    });
});

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close mobile menu
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        
        // Close notifications
        const notification = document.querySelector('.notification');
        if (notification) {
            notification.remove();
        }
    }
});

// Add focus management for accessibility
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('focus', () => {
        link.style.outline = '2px solid #ffd700';
        link.style.outlineOffset = '2px';
    });
    
    link.addEventListener('blur', () => {
        link.style.outline = 'none';
    });
});

// Add ARIA labels for better accessibility
document.querySelectorAll('.btn').forEach(btn => {
    if (!btn.getAttribute('aria-label')) {
        btn.setAttribute('aria-label', btn.textContent.trim());
    }
});

// Performance optimization: Lazy load images when they're added
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        }
    });
});

document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
});

// Admin Login System
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'pragati123'
};

// Show admin login modal
function showAdminLogin() {
    document.getElementById('adminLoginModal').style.display = 'block';
}

// Close admin login modal
function closeAdminLogin() {
    document.getElementById('adminLoginModal').style.display = 'none';
    document.getElementById('adminLoginForm').reset();
}

// Handle admin login form submission
document.addEventListener('DOMContentLoaded', function() {
    const adminLoginForm = document.getElementById('adminLoginForm');
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('adminUsername').value;
            const password = document.getElementById('adminPassword').value;
            
            if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
                showNotification('Login successful! Redirecting to admin panel...', 'success');
                setTimeout(() => {
                    window.location.href = 'admin.html';
                }, 1500);
            } else {
                showNotification('Invalid username or password!', 'error');
            }
        });
    }
});

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const adminLoginModal = document.getElementById('adminLoginModal');
    const productDetailModal = document.getElementById('productDetailModal');
    
    if (event.target === adminLoginModal) {
        closeAdminLogin();
    }
    if (event.target === productDetailModal) {
        closeProductDetail();
    }
});

// Event delegation for product clicks (backup method)
document.addEventListener('click', function(event) {
    // Check if clicked element is a product card or inside one
    const productCard = event.target.closest('.product-card[data-product-id]');
    if (productCard) {
        const productId = productCard.getAttribute('data-product-id');
        console.log('Product card clicked via delegation, productId:', productId);
        event.preventDefault();
        showProductDetail(productId);
    }
});

// Product Detail Modal Functions
let currentProduct = null;
let currentImageIndex = 0;

function showProductDetail(productId) {
    console.log('showProductDetail called with productId:', productId);
    
    const savedProducts = localStorage.getItem('pragatiMotorsProducts');
    console.log('savedProducts from localStorage:', savedProducts);
    
    if (!savedProducts) {
        console.error('No products found in localStorage');
        showNotification('No products available!', 'error');
        return;
    }
    
    const products = JSON.parse(savedProducts);
    console.log('Parsed products:', products);
    console.log('Looking for product with ID:', productId);
    
    // Try to find product by string comparison
    currentProduct = products.find(p => String(p.id) === String(productId));
    console.log('Found product:', currentProduct);
    
    if (!currentProduct) {
        console.error('Product not found with ID:', productId);
        console.log('Available product IDs:', products.map(p => ({ id: p.id, name: p.name })));
        showNotification('Product not found!', 'error');
        return;
    }
    
    // Populate product information
    document.getElementById('productDetailTitle').textContent = currentProduct.name;
    document.getElementById('productDetailName').textContent = currentProduct.name;
    document.getElementById('productDetailPrice').textContent = `₹${currentProduct.price.toLocaleString()}`;
    document.getElementById('productDetailHorsepower').textContent = currentProduct.horsepower || '';
    document.getElementById('productDetailDescription').textContent = currentProduct.description;
    
    // Setup image gallery
    setupImageGallery();
    
    // Show modal
    document.getElementById('productDetailModal').style.display = 'block';
}

function setupImageGallery() {
    const thumbnailContainer = document.getElementById('thumbnailContainer');
    const mainImage = document.getElementById('mainProductImage');
    
    if (!currentProduct.photos || currentProduct.photos.length === 0) {
        // No photos available
        mainImage.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23f8f9fa"/><text x="50" y="50" text-anchor="middle" dy=".3em" fill="%23ccc" font-size="2rem">🚜</text></svg>';
        thumbnailContainer.innerHTML = '<p>No images available</p>';
        return;
    }
    
    // Set first image as main image
    currentImageIndex = 0;
    mainImage.src = currentProduct.photos[0].data;
    
    // Create thumbnails
    thumbnailContainer.innerHTML = currentProduct.photos.map((photo, index) => `
        <div class="thumbnail ${index === 0 ? 'active' : ''}" onclick="selectImage(${index})">
            <img src="${photo.data}" alt="Thumbnail ${index + 1}">
        </div>
    `).join('');
}

function selectImage(index) {
    if (!currentProduct.photos || !currentProduct.photos[index]) return;
    
    currentImageIndex = index;
    document.getElementById('mainProductImage').src = currentProduct.photos[index].data;
    
    // Update active thumbnail
    document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });
}

function previousImage() {
    if (!currentProduct.photos || currentProduct.photos.length <= 1) return;
    
    currentImageIndex = (currentImageIndex - 1 + currentProduct.photos.length) % currentProduct.photos.length;
    selectImage(currentImageIndex);
}

function nextImage() {
    if (!currentProduct.photos || currentProduct.photos.length <= 1) return;
    
    currentImageIndex = (currentImageIndex + 1) % currentProduct.photos.length;
    selectImage(currentImageIndex);
}

function closeProductDetail() {
    document.getElementById('productDetailModal').style.display = 'none';
    currentProduct = null;
    currentImageIndex = 0;
}

// Show notification function
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Add slide out animation
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
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
document.head.appendChild(notificationStyle);

// Test function to verify products are loaded
function testProductLoading() {
    console.log('=== Testing Product Loading ===');
    const savedProducts = localStorage.getItem('pragatiMotorsProducts');
    console.log('localStorage has products:', !!savedProducts);
    
    if (savedProducts) {
        const products = JSON.parse(savedProducts);
        console.log('Number of products:', products.length);
        console.log('Product IDs:', products.map(p => p.id));
        console.log('Product names:', products.map(p => p.name));
    }
    
    const productsGrid = document.getElementById('productsGrid');
    console.log('Products grid element:', productsGrid);
    console.log('Products grid innerHTML length:', productsGrid ? productsGrid.innerHTML.length : 'N/A');
}

// Run test after page loads
setTimeout(testProductLoading, 2000);

console.log('PRAGATI MOTORS website loaded successfully! 🚜');
