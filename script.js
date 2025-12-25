// ===== DOM Elements =====
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const backToTop = document.getElementById('backToTop');
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.querySelector('.lightbox-image');
const lightboxClose = document.querySelector('.lightbox-close');
const contactForm = document.getElementById('contactForm');
const registrationForm = document.getElementById('registrationForm');
const demoBanner = document.querySelector('.demo-banner');

// WhatsApp number for EduAce (remove + and spaces for WhatsApp API)
const WHATSAPP_NUMBER = '264815599387';

// ===== Navbar Scroll Effect =====
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Add scrolled class when past demo banner
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Show/hide back to top button
    if (currentScroll > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }

    lastScroll = currentScroll;
});

// ===== Mobile Navigation Toggle =====
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

// Close mobile menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !navToggle.contains(e.target) && navMenu.classList.contains('active')) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// ===== Active Navigation Link =====
const sections = document.querySelectorAll('section[id]');

function setActiveLink() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 150;
        const sectionId = section.getAttribute('id');
        const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (correspondingLink) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                correspondingLink.classList.add('active');
            }
        }
    });
}

window.addEventListener('scroll', setActiveLink);

// ===== Smooth Scrolling =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navHeight = navbar.offsetHeight;
            const targetPosition = target.offsetTop - navHeight - 20;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== Back to Top =====
backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ===== Gallery Lightbox =====
galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        const img = item.querySelector('img');
        if (img) {
            lightboxImage.src = img.src;
            lightboxImage.alt = img.alt;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });
});

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

lightboxClose.addEventListener('click', closeLightbox);

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
    }
});

// ===== Subject Count for Registration Form =====
const subjectCheckboxes = document.querySelectorAll('input[name="subjects"]');
const subjectCountDisplay = document.getElementById('subjectCount');

function updateSubjectCount() {
    const checkedCount = document.querySelectorAll('input[name="subjects"]:checked').length;
    if (subjectCountDisplay) {
        subjectCountDisplay.textContent = checkedCount;
    }
}

subjectCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', updateSubjectCount);
});

// ===== Format Date =====
function formatDate(dateString) {
    if (!dateString) return 'Not provided';
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options);
}

// ===== Registration Form - WhatsApp Submission =====
registrationForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form data
    const fullname = document.getElementById('reg-fullname').value.trim();
    const idNumber = document.getElementById('reg-id').value.trim();
    const dob = document.getElementById('reg-dob').value;
    const phone = document.getElementById('reg-phone').value.trim();
    const email = document.getElementById('reg-email').value.trim() || 'Not provided';
    const school = document.getElementById('reg-school').value.trim();
    const session = document.querySelector('input[name="session"]:checked')?.value || 'Not selected';
    const hostel = document.querySelector('input[name="hostel"]:checked') ? 'Yes' : 'No';
    const additional = document.getElementById('reg-additional').value.trim() || 'None';

    // Get selected subjects
    const selectedSubjects = Array.from(document.querySelectorAll('input[name="subjects"]:checked'))
        .map(cb => cb.value);

    // Validation
    if (!fullname || !idNumber || !dob || !phone || !school) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }

    if (selectedSubjects.length === 0) {
        showNotification('Please select at least one subject.', 'error');
        return;
    }

    // Format subjects list with numbers
    const subjectsList = selectedSubjects
        .map((subject, index) => `${index + 1}. ${subject}`)
        .join('\n');

    // Build WhatsApp message
    const message = `*ONLINE REGISTRATION*
EduAce Tutorial College
==============================

*PERSONAL DETAILS*
Full Name: ${fullname}
ID Number: ${idNumber}
Date of Birth: ${formatDate(dob)}
Phone: ${phone}
Email: ${email}
Previous School: ${school}

*SESSION PREFERENCE*
${session}

*SUBJECTS REGISTERED FOR*
${subjectsList}
Total: ${selectedSubjects.length} subject(s)

*HOSTEL ACCOMMODATION*
Required: ${hostel}

*ADDITIONAL INFORMATION*
${additional}

==============================
Submitted via EduAce Website`;

    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);

    // Open WhatsApp
    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    window.open(whatsappURL, '_blank');

    // Show success notification
    showNotification('Registration form prepared! Please send the message in WhatsApp to complete your registration.', 'success');
});

// ===== Contact Form - WhatsApp Submission =====
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form data
    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim() || 'Not provided';
    const phone = document.getElementById('contact-phone').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    // Get selected subjects
    const selectedSubjects = Array.from(document.querySelectorAll('input[name="contact-subjects"]:checked'))
        .map(cb => cb.value);

    // Validation
    if (!name || !phone || !message) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }

    // Format subjects list
    let subjectsText = 'None selected';
    if (selectedSubjects.length > 0) {
        subjectsText = selectedSubjects
            .map((subject, index) => `${index + 1}. ${subject}`)
            .join('\n');
    }

    // Build WhatsApp message
    const whatsappMessage = `*NEW INQUIRY*
EduAce Tutorial College
==============================

*CONTACT DETAILS*
Name: ${name}
Phone: ${phone}
Email: ${email}

*SUBJECTS OF INTEREST*
${subjectsText}
${selectedSubjects.length > 0 ? `Total: ${selectedSubjects.length} subject(s)` : ''}

*MESSAGE*
${message}

==============================
Sent via EduAce Website`;

    // Encode message for URL
    const encodedMessage = encodeURIComponent(whatsappMessage);

    // Open WhatsApp
    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    window.open(whatsappURL, '_blank');

    // Show success notification
    showNotification('Message prepared! Please send it in WhatsApp to complete your inquiry.', 'success');
});

// ===== Notification System =====
function showNotification(message, type = 'success') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        max-width: 400px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;

    // Add animation keyframes
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            .notification-close {
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                margin-left: auto;
                opacity: 0.8;
                transition: opacity 0.2s;
            }
            .notification-close:hover {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// ===== Intersection Observer for Animations =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.feature-card, .subject-card, .contact-card, .about-feature, .reg-info-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Add animation class styles
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(animationStyles);

// ===== Counter Animation =====
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + (element.dataset.suffix || '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start) + (element.dataset.suffix || '');
        }
    }, 16);
}

// Animate stats when they come into view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const text = stat.textContent;
                const number = parseInt(text);
                if (!isNaN(number) && !stat.dataset.animated) {
                    stat.dataset.animated = 'true';
                    stat.dataset.suffix = text.replace(number, '');
                    animateCounter(stat, number);
                }
            });
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

// ===== Preload Images =====
function preloadImages() {
    const images = document.querySelectorAll('img[src]');
    images.forEach(img => {
        if (img.complete) return;
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s ease';
        img.addEventListener('load', () => {
            img.style.opacity = '1';
        });
    });
}

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    preloadImages();
    setActiveLink();
    updateSubjectCount();

    // Add delay animations to subject cards
    document.querySelectorAll('.subject-card').forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.05}s`;
    });

    // Add delay animations to feature cards
    document.querySelectorAll('.feature-card').forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });

    // Add delay animations to registration info cards
    document.querySelectorAll('.reg-info-card').forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });
});

// ===== Hide demo banner on scroll (optional) =====
let demoBannerHidden = false;
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300 && !demoBannerHidden) {
        // Optionally hide the demo banner after scrolling
        // demoBanner.style.transform = 'translateY(-100%)';
        // demoBannerHidden = true;
    }
});

console.log('EduAce Tutorial College Website Loaded Successfully!');
console.log('WhatsApp integration enabled for registration and contact forms.');
