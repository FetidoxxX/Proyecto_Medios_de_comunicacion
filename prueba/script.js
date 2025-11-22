document.addEventListener('DOMContentLoaded', () => {
    console.log('> System.init(urban_gear_v2.0)');

    // --- MATRIX RAIN EFFECT (UPDATED) ---
    const canvas = document.getElementById("matrix-canvas");
    const context = canvas.getContext("2d");

    // Configuration
    const fontSize = 14;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let columns = 0;
    const drops = [];
    const text = [];

    // Characters (Katakana + Latin + Numbers)
    const chars = "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        columns = width / fontSize;
        
        // Reset drops
        for (let i = 0; i < columns; i++) {
            drops[i] = Math.random() * 43 - 43;
            text[i] = chars[Math.floor(Math.random() * chars.length)];
        }
        
        // Apply transformations from user request (Mirrored & Stretched)
        // Note: We need to reset transform before applying again on resize to avoid compounding
        context.setTransform(1, 0, 0, 1, 0, 0); 
        context.translate(width, 0);
        context.scale(-1, 1); // Removed vertical stretch 1.2 as it might distort layout too much, kept horizontal flip
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function drawMatrix() {
        // Background with opacity for trail effect
        context.fillStyle = "rgba(10, 10, 10, 0.1)"; // Dark background with fade
        context.fillRect(0, 0, width, height);

        // Set the previous line (Trail) to Terminal Green
        context.fillStyle = "#00ff00"; 
        context.font = fontSize + "px 'Fira Code', monospace";

        for (let i = 0; i < drops.length; i++) {
            // Draw the character from the previous frame (the trail)
            if (text[i]) {
                context.fillText(text[i], i * fontSize, drops[i] * fontSize);
            }
        }

        // Generate new characters (Head of the drop)
        context.fillStyle = "#00ffff"; // Cyan Accent for the leading character
        for (let i = 0; i < drops.length; i++) {
            drops[i]++;

            // Random character to print
            text[i] = chars[Math.floor(Math.random() * chars.length)];

            // Draw new character
            context.fillText(text[i], i * fontSize, drops[i] * fontSize);

            // Sending the drop to the top randomly, after it has crossed the screen
            if (drops[i] * fontSize > height && Math.random() > 0.975) {
                drops[i] = Math.random() * 43 - 43;
            }
        }
    }

    setInterval(drawMatrix, 50);


    // --- EXISTING INTERACTIONS ---

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
    const glitchChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*';

    glitchTitles.forEach((title, index) => {
        title.addEventListener('mouseover', () => {
            let iterations = 0;
            const interval = setInterval(() => {
                title.innerText = title.innerText.split('')
                    .map((letter, i) => {
                        if(i < iterations) {
                            return originalTexts[index][i];
                        }
                        return glitchChars[Math.floor(Math.random() * glitchChars.length)];
                    })
                    .join('');
                
                if(iterations >= originalTexts[index].length) {
                    clearInterval(interval);
                }
                
                iterations += 1/3;
            }, 30);
        });
    });

    // --- AUTO-SCROLL CAROUSELS (SMOOTH) ---
    const carousels = document.querySelectorAll('.carousel-container');
    
    carousels.forEach(carousel => {
        let scrollAmount = 0;
        let direction = 1; 
        const speed = 50; // Pixels per second
        const delay = 2000; 
        let isPaused = false;
        let lastTime = 0;

        function autoScroll(timestamp) {
            if (!lastTime) lastTime = timestamp;
            const deltaTime = (timestamp - lastTime) / 1000; // Seconds
            lastTime = timestamp;

            if (isPaused) {
                requestAnimationFrame(autoScroll);
                return;
            }

            // Move based on time to be framerate independent
            const move = speed * deltaTime * direction;
            scrollAmount += move;
            carousel.scrollLeft = scrollAmount;

            // Check boundaries
            // Use a small buffer (1px) to avoid getting stuck due to sub-pixel rounding
            if (direction === 1 && carousel.scrollLeft >= (carousel.scrollWidth - carousel.clientWidth - 1)) {
                direction = -1;
                isPaused = true;
                setTimeout(() => { isPaused = false; }, delay);
            } else if (direction === -1 && carousel.scrollLeft <= 0) {
                direction = 1;
                isPaused = true;
                setTimeout(() => { isPaused = false; }, delay);
            }

            requestAnimationFrame(autoScroll);
        }

        // Initialize
        scrollAmount = carousel.scrollLeft;
        requestAnimationFrame(autoScroll);

        // Interactions
        carousel.addEventListener('mouseenter', () => { isPaused = true; });
        carousel.addEventListener('mouseleave', () => { 
            isPaused = false; 
            lastTime = 0; // Reset time to avoid huge jump
            isDown = false; // Stop dragging if left window
            carousel.classList.remove('active');
        });
        
        carousel.addEventListener('scroll', () => {
            if (!isPaused) return;
            scrollAmount = carousel.scrollLeft;
        });

        // Drag to Scroll Logic
        let isDown = false;
        let startX;
        let scrollLeft;

        carousel.addEventListener('mousedown', (e) => {
            isDown = true;
            carousel.classList.add('active');
            startX = e.pageX - carousel.offsetLeft;
            scrollLeft = carousel.scrollLeft;
            // Disable default image drag
            e.preventDefault(); 
        });

        carousel.addEventListener('mouseup', () => {
            isDown = false;
            carousel.classList.remove('active');
        });

        carousel.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - carousel.offsetLeft;
            const walk = (x - startX) * 2; // Scroll speed multiplier
            carousel.scrollLeft = scrollLeft - walk;
            scrollAmount = carousel.scrollLeft; // Sync for auto-scroll
        });
    });
});
