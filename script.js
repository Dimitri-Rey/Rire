// ========================================
// SMOOTH SCROLLING FOR NAVIGATION LINKS
// ========================================

document.addEventListener('DOMContentLoaded', function() {

    // Get all navigation links
    const navLinks = document.querySelectorAll('.main-nav a');

    // Add click event listener to each link
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            // Get the target section
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                // Calculate offset for fixed header with extra spacing
                const headerHeight = document.getElementById('header').offsetHeight;
                const extraSpace = 20; // Extra spacing for better visibility
                const targetPosition = targetSection.offsetTop - headerHeight - extraSpace;

                // Smooth scroll to target
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                const mainNav = document.querySelector('.main-nav');
                if (mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    toggleMenuIcon(false);
                }
            }
        });
    });

    // ========================================
    // MOBILE MENU TOGGLE
    // ========================================

    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            const isActive = mainNav.classList.contains('active');
            toggleMenuIcon(isActive);
        });
    }

    function toggleMenuIcon(isActive) {
        const spans = mobileMenuToggle.querySelectorAll('span');
        if (isActive) {
            spans[0].style.transform = 'rotate(45deg) translateY(8px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
        } else {
            spans[0].style.transform = 'rotate(0) translateY(0)';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'rotate(0) translateY(0)';
        }
    }

    // ========================================
    // HEADER BACKGROUND ON SCROLL
    // ========================================

    const header = document.getElementById('header');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        // Add shadow when scrolled
        if (currentScroll > 50) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.2)';
        } else {
            header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        }

        lastScroll = currentScroll;
    });

    // ========================================
    // INTERSECTION OBSERVER FOR ANIMATIONS
    // ========================================

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe benefit cards, yoga list items, etc.
    const animatedElements = document.querySelectorAll(
        '.benefit-card, .yoga-list li, .reference-box, .contact-info, .contact-cta'
    );

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // ========================================
    // CLOSE MOBILE MENU ON OUTSIDE CLICK
    // ========================================

    document.addEventListener('click', function(e) {
        const isClickInsideNav = mainNav.contains(e.target);
        const isClickOnToggle = mobileMenuToggle.contains(e.target);

        if (!isClickInsideNav && !isClickOnToggle && mainNav.classList.contains('active')) {
            mainNav.classList.remove('active');
            toggleMenuIcon(false);
        }
    });

    // ========================================
    // ADD ACTIVE STATE TO CURRENT SECTION
    // ========================================

    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', function() {
        let current = '';
        const headerHeight = document.getElementById('header').offsetHeight;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 100;
            const sectionHeight = section.clientHeight;

            if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    // ========================================
    // LAZY LOADING IMAGES
    // ========================================

    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    } else {
        // Fallback for browsers that don't support lazy loading
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
        document.body.appendChild(script);
    }

    // ========================================
    // PREVENT FOUC (Flash of Unstyled Content)
    // ========================================

    document.body.style.opacity = '1';

});

// ========================================
// PAGE LOAD OPTIMIZATION
// ========================================

window.addEventListener('load', function() {
    // Remove any loading states
    document.body.classList.add('loaded');
});

// ========================================
// ANIMATED COUNTERS
// ========================================

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;

    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };

    updateCounter();
}

// Intersection Observer for counters
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            entry.target.classList.add('counted');
            animateCounter(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(counter => {
    counterObserver.observe(counter);
});

// ========================================
// FAQ ACCORDION
// ========================================

const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(question => {
    question.addEventListener('click', function() {
        const faqItem = this.parentElement;
        const isActive = faqItem.classList.contains('active');

        // Close all other FAQs
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
        });

        // Toggle current FAQ
        if (!isActive) {
            faqItem.classList.add('active');
        }
    });
});

// ========================================
// CONTACT FORM
// ========================================

const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            sessionType: document.getElementById('session-type').value,
            message: document.getElementById('message').value
        };

        // Create mailto link
        const subject = encodeURIComponent(`Demande de ${formData.sessionType} - ${formData.name}`);
        const body = encodeURIComponent(
            `Nom: ${formData.name}\n` +
            `Email: ${formData.email}\n` +
            `Téléphone: ${formData.phone || 'Non renseigné'}\n` +
            `Type de séance: ${formData.sessionType}\n\n` +
            `Message:\n${formData.message}`
        );

        // Open mailto
        window.location.href = `mailto:follederire@yahoo.com?subject=${subject}&body=${body}`;

        // Show confirmation
        alert('Votre messagerie va s\'ouvrir pour envoyer le message. Merci !');
    });
}

// ========================================
// SHARE MENU
// ========================================

const shareButton = document.getElementById('shareButton');
const shareMenu = document.getElementById('shareMenu');
const shareClose = document.getElementById('shareClose');
const copyLinkButton = document.getElementById('copyLink');

if (shareButton && shareMenu) {
    shareButton.addEventListener('click', function() {
        shareMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    shareClose.addEventListener('click', function() {
        shareMenu.classList.remove('active');
        document.body.style.overflow = '';
    });

    // Close on clicking outside
    shareMenu.addEventListener('click', function(e) {
        if (e.target === shareMenu) {
            shareMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Copy link functionality
    if (copyLinkButton) {
        copyLinkButton.addEventListener('click', async function() {
            try {
                await navigator.clipboard.writeText(window.location.href);
                const originalText = this.querySelector('span:last-child').textContent;
                this.querySelector('span:last-child').textContent = 'Lien copié !';
                setTimeout(() => {
                    this.querySelector('span:last-child').textContent = originalText;
                }, 2000);
            } catch (err) {
                alert('Impossible de copier le lien. Veuillez le copier manuellement : ' + window.location.href);
            }
        });
    }
}

// ========================================
// ENHANCED SCROLL ANIMATIONS
// ========================================

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// Observe all animated elements
const animatedElements = document.querySelectorAll(
    '.benefit-card, .yoga-list li, .reference-box, .contact-info, .faq-item, .stat-card, .contact-form-container'
);

animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(40px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    scrollObserver.observe(el);
});

// ========================================
// BACK TO TOP BUTTON
// ========================================

const backToTopButton = document.getElementById('backToTop');

window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
        backToTopButton.classList.add('visible');
    } else {
        backToTopButton.classList.remove('visible');
    }
});

backToTopButton.addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});
