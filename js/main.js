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
                let matchedOption = Array.from(productInterestInput.options).find(opt => 
                    opt.value.toLowerCase().includes(productName.toLowerCase()) || 
                    productName.toLowerCase().includes(opt.value.toLowerCase())
                );
                if (matchedOption) {
                    productInterestInput.value = matchedOption.value;
                } else {
                    productInterestInput.value = productName;
                }
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

    // Close modal on Escape key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalBackdrop && modalBackdrop.classList.contains('active')) {
            closeEnquiryModal();
        }
    });


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
    // Main Contact Form on contact.html & index.html
    const contactForm = document.querySelector('#jvsContactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn ? submitBtn.textContent : 'Submit';

            // Collect fields
            const nameEl = contactForm.querySelector('#name');
            const emailEl = contactForm.querySelector('#email');
            const phoneEl = contactForm.querySelector('#phone');
            const interestEl = contactForm.querySelector('#interest');
            const messageEl = contactForm.querySelector('#message');

            const name = nameEl ? nameEl.value.trim() : '';
            const email = emailEl ? emailEl.value.trim() : '';
            const phone = phoneEl ? phoneEl.value.trim() : '';
            const interest = interestEl ? interestEl.value : '';
            const message = messageEl ? messageEl.value.trim() : '';
            
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

            // Phone validation (10 digits, supporting +91 and spaces/dashes)
            const cleanedPhone = phone.replace(/[\s\-()]/g, '').replace(/^\+91/, '').replace(/^\+/, '');
            if (!/^\d{10}$/.test(cleanedPhone)) {
                showToast('Please enter a valid 10-digit mobile number.', 'error');
                return;
            }

            // Button feedback
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending...';
            }

            setTimeout(() => {
                showToast('Thank you! Your message has been sent successfully. We will contact you soon.');
                contactForm.reset();
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;
                }
            }, 600);
        });
    }

    // Modal Inquiry Form
    const modalForm = document.querySelector('#modalEnquiryForm');
    if (modalForm) {
        modalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = modalForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn ? submitBtn.textContent : 'Submit Enquiry';

            const nameEl = modalForm.querySelector('#modalName');
            const emailEl = modalForm.querySelector('#modalEmail');
            const phoneEl = modalForm.querySelector('#modalPhone');
            const productEl = modalForm.querySelector('#productInterest');
            const messageEl = modalForm.querySelector('#modalMessage');

            const name = nameEl ? nameEl.value.trim() : '';
            const email = emailEl ? emailEl.value.trim() : '';
            const phone = phoneEl ? phoneEl.value.trim() : '';
            const product = productEl ? productEl.value : 'Product Inquiry';
            const message = messageEl ? messageEl.value.trim() : '';

            if (!name || !email || !phone) {
                showToast('Please fill in Name, Email, and Mobile number.', 'error');
                return;
            }

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                showToast('Please enter a valid email address.', 'error');
                return;
            }

            const cleanedPhone = phone.replace(/[\s\-()]/g, '').replace(/^\+91/, '').replace(/^\+/, '');
            if (!/^\d{10}$/.test(cleanedPhone)) {
                showToast('Please enter a valid 10-digit mobile number.', 'error');
                return;
            }

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Submitting...';
            }

            setTimeout(() => {
                closeEnquiryModal();
                showToast(`Inquiry for "${product}" submitted successfully! Our representative will contact you.`);
                modalForm.reset();
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;
                }
            }, 600);
        });
    }
});
