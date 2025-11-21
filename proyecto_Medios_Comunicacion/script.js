document.addEventListener('DOMContentLoaded', () => {
    console.log('> System.init(urban_gear_v2.0)');

    // Mobile Menu Toggle
    const menuToggle = document.getElementById('mobile-menu');
    const terminalMenu = document.getElementById('terminal-menu');
    const closeMenu = document.getElementById('close-menu');
    const menuLinks = document.querySelectorAll('.terminal-links a');

    function toggleMenu() {
        terminalMenu.classList.toggle('active');
        document.body.style.overflow = terminalMenu.classList.contains('active') ? 'hidden' : 'auto';
    }

    menuToggle.addEventListener('click', toggleMenu);
    closeMenu.addEventListener('click', toggleMenu);

    menuLinks.forEach(link => {
        link.addEventListener('click', toggleMenu);
    });

    // Scroll Reveal Animation
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Add typing effect here if needed
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.scroll-reveal').forEach(el => {
        observer.observe(el);
    });

    // Random Glitch Text Effect on Hover for Hero Title
    const glitchTitles = document.querySelectorAll('.glitch-title');
    const originalTexts = Array.from(glitchTitles).map(t => t.getAttribute('data-text'));
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*';

    glitchTitles.forEach((title, index) => {
        title.addEventListener('mouseover', () => {
            let iterations = 0;
            const interval = setInterval(() => {
                title.innerText = title.innerText.split('')
                    .map((letter, i) => {
                        if(i < iterations) {
                            return originalTexts[index][i];
                        }
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join('');
                
                if(iterations >= originalTexts[index].length) {
                    clearInterval(interval);
                }
                
                iterations += 1/3;
            }, 30);
        });
    });
});
