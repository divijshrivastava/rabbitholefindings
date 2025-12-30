// Smooth scroll and navigation enhancements
document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll for navigation links
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const navHeight = 80; // Account for sticky nav height (reduced)
                const offsetTop = targetElement.offsetTop - navHeight;
                window.scrollTo({
                    top: Math.max(0, offsetTop),
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add active state to navigation based on scroll position
    const sections = document.querySelectorAll('.rabbit-hole-chat-wrapper');
    const updateActiveNav = () => {
        let current = '';
        const scrollPos = window.scrollY + 120; // Account for nav height (reduced)
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionBottom = sectionTop + sectionHeight;
            
            if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${current}`) {
                link.classList.add('active');
            }
        });
    };

    // Shrink nav on scroll
    const nav = document.querySelector('nav');
    const shrinkNav = () => {
        if (window.scrollY > 100) {
            nav.classList.add('nav-scrolled');
        } else {
            nav.classList.remove('nav-scrolled');
        }
    };

    // Throttle scroll events for better performance
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateActiveNav();
                shrinkNav();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    updateActiveNav();
    shrinkNav();

    console.log("Rabbit Hole Findings loaded! 🐰");
});