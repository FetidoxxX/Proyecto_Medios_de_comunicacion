document.addEventListener('DOMContentLoaded', () => {
    console.log('> System.init(urban_gear_v2.0)');

    // --- MATRIX RAIN EFFECT ---
    const canvas = document.getElementById("matrix-canvas");
    const context = canvas.getContext("2d");

    // Set canvas size to window size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Configuration
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = [];
    
    // Initialize drops
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * -100; // Start above screen randomly
    }

    // Characters (Katakana + Latin + Numbers)
    const chars = "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const charArray = chars.split("");

    function drawMatrix() {
        // Background with opacity for trail effect
        context.fillStyle = "rgba(10, 10, 10, 0.05)"; // Using brand bg color #0a0a0a
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.font = fontSize + "px 'Fira Code', monospace";
        
        for (let i = 0; i < drops.length; i++) {
            // Random character
            const text = charArray[Math.floor(Math.random() * charArray.length)];
            
            // Color logic: Randomly switch between Green and Cyan for that "glitchy" cyberpunk look
            // Mostly Green (#00ff00), sometimes Cyan (#00ffff)
            if (Math.random() > 0.95) {
                context.fillStyle = "#00ffff"; // Cyan Accent
            } else {
                context.fillStyle = "#0f0"; // Terminal Green
            }

            context.fillText(text, i * fontSize, drops[i] * fontSize);

            // Reset drop if it goes off screen (randomly)
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }

            // Move drop down
            drops[i]++;
        }
    }

    // Run animation
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
});
