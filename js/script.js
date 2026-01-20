// ===== PAGE LOAD & SMOOTH SCROLL =====
document.addEventListener('DOMContentLoaded', function() {
    // Hide loader after 2 seconds
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.classList.add('hidden');
    }, 1000);

    // Initialize all interactive features
    initMobileMenu();
    initSmoothScroll();
    initProductInteractions();
    initNewsletterForm();
    initContactForm();
});

// ===== MOBILE MENU TOGGLE =====
function initMobileMenu() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const iconOpen = document.querySelector('.nav-icon-open');
    const iconClose = document.querySelector('.nav-icon-close');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            
            // Toggle icon visibility
            if (navMenu.classList.contains('active')) {
                iconOpen.style.opacity = '0';
                iconOpen.style.visibility = 'hidden';
                iconClose.style.opacity = '1';
                iconClose.style.visibility = 'visible';
            } else {
                iconOpen.style.opacity = '1';
                iconOpen.style.visibility = 'visible';
                iconClose.style.opacity = '0';
                iconClose.style.visibility = 'hidden';
            }
        });
    }

    // Close menu when nav link is clicked
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            
            // Reset icon visibility
            iconOpen.style.opacity = '1';
            iconOpen.style.visibility = 'visible';
            iconClose.style.opacity = '0';
            iconClose.style.visibility = 'hidden';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-container')) {
            navMenu.classList.remove('active');
            
            // Reset icon visibility
            iconOpen.style.opacity = '1';
            iconOpen.style.visibility = 'visible';
            iconClose.style.opacity = '0';
            iconClose.style.visibility = 'hidden';
        }
    });
}

function animateMenuIcon(toggle) {
    const spans = toggle.querySelectorAll('span');
    spans[0].style.transform = 'rotate(45deg) translate(10px, 10px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(7px, -7px)';
}

function resetMenuIcon(toggle) {
    const spans = toggle.querySelectorAll('span');
    spans[0].style.transform = 'none';
    spans[1].style.opacity = '1';
    spans[2].style.transform = 'none';
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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
}

// ===== PRODUCT INTERACTIONS =====
function initProductInteractions() {
    const addButtons = document.querySelectorAll('.add-btn');
    
    addButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get product info
            const card = this.closest('.product-card');
            const productName = card.querySelector('h3').textContent;
            const price = card.querySelector('.price').textContent;
            
            // Ripple effect
            addRippleEffect(this, e);
            
            // Show toast notification
            showToast(`${productName} added to cart! ${price}`);
            
            // Animate button
            this.textContent = '✓ Added';
            this.style.background = '#4a235a';
            setTimeout(() => {
                this.textContent = 'Add to Cart';
            }, 2000);
        });
    });
}

function addRippleEffect(button, event) {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    button.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
}

// ===== TOAST NOTIFICATION =====
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Add ripple styles dynamically
const style = document.createElement('style');
style.textContent = `
    .add-btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===== NEWSLETTER FORM =====
function initNewsletterForm() {
    const form = document.getElementById('newsletterForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[type="email"]').value;
            
            // Simple email validation
            if (isValidEmail(email)) {
                showToast('✓ Successfully subscribed! Check your email.');
                this.reset();
            } else {
                showToast('Please enter a valid email address.');
            }
        });
    }
}

// ===== INPUT SANITIZATION & VALIDATION =====
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function containsAttackStrings(input) {
    // Check for common XSS and SQL injection patterns
    const attackPatterns = [
        /<script/gi,
        /javascript:/gi,
        /onerror\s*=/gi,
        /onclick\s*=/gi,
        /onload\s*=/gi,
        /<iframe/gi,
        /<img[^>]*onerror/gi,
        /DROP\s+TABLE/gi,
        /INSERT\s+INTO/gi,
        /DELETE\s+FROM/gi,
        /UPDATE\s+/gi,
        /SELECT\s+\*\s+FROM/gi,
        /--\s*$/gi,
        /;\s*DROP/gi,
        /'\s+OR\s+'1'\s*=\s*'1/gi,
        /eval\s*\(/gi
    ];
    
    return attackPatterns.some(pattern => pattern.test(input));
}

function sanitizeInput(input) {
    return input.trim().replace(/[<>\"']/g, '');
}

// ===== SCROLL ANIMATIONS =====
function observeElements() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('.section, .product-card, .stat-item').forEach(el => {
        observer.observe(el);
    });
}

// Initialize scroll animations when DOM is loaded
window.addEventListener('load', observeElements);

// ===== CURSOR EFFECTS (Optional Enhancement) =====
document.addEventListener('mousemove', function(e) {
    updateMousePosition(e.clientX, e.clientY);
});

function updateMousePosition(x, y) {
    // This can be used for cursor tracking effects if needed
    // Currently just tracking for potential future enhancements
}

// ===== PERFORMANCE: Lazy Loading Images (for future image optimization) =====
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===== KEYBOARD ACCESSIBILITY =====
document.addEventListener('keydown', function(e) {
    // Close mobile menu on Escape key
    if (e.key === 'Escape') {
        const navMenu = document.getElementById('navMenu');
        const navToggle = document.getElementById('navToggle');
        navMenu.classList.remove('active');
        resetMenuIcon(navToggle);
    }
});

// ===== FORM VALIDATION & ENHANCEMENT =====
document.addEventListener('input', function(e) {
    if (e.target.type === 'email') {
        const isValid = isValidEmail(e.target.value);
        if (isValid) {
            e.target.style.borderColor = '#d4af37';
        } else if (e.target.value.length > 0) {
            e.target.style.borderColor = '#ff6b6b';
        } else {
            e.target.style.borderColor = '';
        }
    }
});

// ===== SCROLL POSITION MEMORY =====
window.addEventListener('beforeunload', function() {
    sessionStorage.setItem('scrollPos', window.scrollY);
});

window.addEventListener('load', function() {
    const scrollPos = sessionStorage.getItem('scrollPos');
    if (scrollPos) {
        window.scrollTo(0, parseInt(scrollPos));
        sessionStorage.removeItem('scrollPos');
    }
});

// ===== CONTACT FORM =====
function initContactForm() {
    const form = document.getElementById('contactForm');
    const modal = document.getElementById('emailModal');
    const closeModalBtn = document.getElementById('closeModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = this.querySelector('#name').value.trim();
            const email = this.querySelector('#email').value.trim();
            const subject = this.querySelector('#subject').value.trim();
            const message = this.querySelector('#message').value.trim();
            
            // Validate required fields
            if (!name || !email || !subject || !message) {
                showToast('❌ Please fill in all required fields');
                return;
            }
            
            // Check for attack strings in all fields
            if (containsAttackStrings(name) || containsAttackStrings(subject) || containsAttackStrings(message)) {
                showToast('❌ Invalid characters detected. Please review your input.');
                return;
            }
            
            // Validate email format
            if (!isValidEmail(email)) {
                showToast('❌ Please enter a valid email address');
                return;
            }
            
            // Sanitize inputs
            const sanitizedData = {
                name: sanitizeInput(name),
                email: email.toLowerCase(),
                subject: sanitizeInput(subject),
                message: sanitizeInput(message)
            };
            
            // Create mailto URL
            const mailtoUrl = `mailto:abonyichimobi119@gmail.com?subject=${encodeURIComponent(`Contact from ${sanitizedData.name}: ${sanitizedData.subject}`)}&body=${encodeURIComponent(`Name: ${sanitizedData.name}\nEmail: ${sanitizedData.email}\n\nMessage:\n${sanitizedData.message}`)}`;
            
            // Show success modal and open mailto
            showEmailModal(sanitizedData.name);
            
            // Open default email client
            setTimeout(() => {
                window.location.href = mailtoUrl;
            }, 500);
            
            // Reset form
            form.reset();
        });
    }
    
    // Modal close handlers
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }
    
    // Close modal when clicking outside
    if (modal) {
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeModal();
            }
        });
    }
}

function showEmailModal(name) {
    const modal = document.getElementById('emailModal');
    const message = document.getElementById('modalMessage');
    
    if (modal) {
        message.textContent = `Thank you ${name}! Your message has been sent to our team.`;
        modal.classList.add('show');
    }
}

function closeModal() {
    const modal = document.getElementById('emailModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

// ===== DARK MODE TOGGLE (Optional Feature) =====
function initDarkModeToggle() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
        // Could implement dark mode here if needed
        // document.body.classList.add('dark-mode');
    }
}

// Call on page load
initDarkModeToggle();

console.log('✨ Lumière Cosmetics Site Loaded Successfully! ✨');
