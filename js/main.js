/**
 * JVS AGRO MILLS - MAIN JAVASCRIPT
 * Handles navigation, animations, modals, and forms.
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. Sticky Header
    // ==========================================
    const header = document.querySelector('.main-header');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initially


    // ==========================================
    // 2. Mobile Menu Navigation
    // ==========================================
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }


    // ==========================================
    // 3. Scroll Reveal Animations (Intersection Observer)
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal');
    
    if ('IntersectionObserver' in window && revealElements.length > 0) {
        const observerOptions = {
            root: null, // viewport
            rootMargin: '0px',
            threshold: 0.15 // trigger when 15% of element is visible
        };
        
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target); // Animation runs once
                }
            });
        }, observerOptions);
        
        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        revealElements.forEach(el => el.classList.add('active'));
    }


    // ==========================================
    // 4. Products Quick Enquiry Modal
    // ==========================================
    const modalBackdrop = document.querySelector('#enquiryModal');
    const closeBtn = document.querySelector('.modal-close');
    const enquiryButtons = document.querySelectorAll('.trigger-enquiry');
    const productInterestInput = document.querySelector('#productInterest');

    const openEnquiryModal = (productName = '') => {
        if (modalBackdrop) {
            if (productInterestInput && productName) {
                productInterestInput.value = productName;
            }
            modalBackdrop.classList.add('active');
            document.body.style.overflow = 'hidden'; // Lock background scrolling
        }
    };

    const closeEnquiryModal = () => {
        if (modalBackdrop) {
            modalBackdrop.classList.remove('active');
            document.body.style.overflow = ''; // Unlock scrolling
        }
    };

    if (enquiryButtons.length > 0) {
        enquiryButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const product = btn.getAttribute('data-product') || '';
                openEnquiryModal(product);
            });
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeEnquiryModal);
    }

    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', (e) => {
            // Close modal if user clicks the backdrop itself
            if (e.target === modalBackdrop) {
                closeEnquiryModal();
            }
        });
    }


    // ==========================================
    // 5. Toast Notifications
    // ==========================================
    const showToast = (message, type = 'success') => {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        // Custom SVG checkmark icon
        const iconSvg = `
            <div class="toast-icon">
                <svg viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                </svg>
            </div>
        `;
        
        toast.innerHTML = `
            ${iconSvg}
            <div class="toast-text">${message}</div>
        `;
        
        container.appendChild(toast);
        
        // Trigger reflow for transition
        setTimeout(() => toast.classList.add('show'), 10);
        
        // Auto remove toast after 4s
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 4000);
    };


    // ==========================================
    // 6. Interactive Contact Forms
    // ==========================================
    // Main Contact Form on contact.html
    const contactForm = document.querySelector('#jvsContactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Collect fields
            const name = document.querySelector('#name').value.trim();
            const email = document.querySelector('#email').value.trim();
            const phone = document.querySelector('#phone').value.trim();
            const interest = document.querySelector('#interest').value;
            const message = document.querySelector('#message').value.trim();
            
            // Simple validation
            if (!name || !email || !phone || !message) {
                showToast('Please fill in all required fields.', 'error');
                return;
            }

            // Simple email validation pattern
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                showToast('Please enter a valid email address.', 'error');
                return;
            }

            // Simple phone validation (10 digits)
            const phonePattern = /^[0-9]{10}$/;
            if (!phonePattern.test(phone.replace(/[\s\-()]/g, ''))) {
                showToast('Please enter a valid 10-digit mobile number.', 'error');
                return;
            }

            // Mock submission success (since it's a static site)
            showToast('Thank you! Your message has been sent successfully. We will contact you soon.');
            contactForm.reset();
        });
    }

    // Modal Inquiry Form
    const modalForm = document.querySelector('#modalEnquiryForm');
    if (modalForm) {
        modalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.querySelector('#modalName').value.trim();
            const email = document.querySelector('#modalEmail').value.trim();
            const phone = document.querySelector('#modalPhone').value.trim();
            const product = document.querySelector('#productInterest').value;
            const message = document.querySelector('#modalMessage').value.trim();

            if (!name || !email || !phone) {
                showToast('Please fill in Name, Email, and Phone number.', 'error');
                return;
            }

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                showToast('Please enter a valid email address.', 'error');
                return;
            }

            // Submit logic
            closeEnquiryModal();
            showToast(`Inquiry for ${product} submitted successfully! Our representative will call you.`);
            modalForm.reset();
        });
    }
});
