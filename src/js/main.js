// signed: srinivas018
/*
    File: main.js
    Purpose: handles boot screen, observers and UI interactions
    Signed by: srinivas018
*/
// Boot Screen Animation
document.addEventListener('DOMContentLoaded', () => {
    const bootScreen = document.getElementById('bootScreen');
    
    // Hide boot screen after animation completes
    setTimeout(() => {
        bootScreen.classList.add('fade-out');
        setTimeout(() => {
            bootScreen.style.display = 'none';
        }, 500);
    }, 6000); // 6 seconds total boot time
    
    // Allow skipping with any key press or click
    const skipBoot = () => {
        bootScreen.classList.add('fade-out');
        setTimeout(() => {
            bootScreen.style.display = 'none';
        }, 500);
    };
    
    document.addEventListener('keydown', skipBoot, { once: true });
    bootScreen.addEventListener('click', skipBoot, { once: true });
});

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.6s ease-out';
    observer.observe(el);
});

const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progressBars = entry.target.querySelectorAll('.skill-progress');
            progressBars.forEach(bar => {
                const width = bar.getAttribute('data-width');
                setTimeout(() => {
                    bar.style.width = width;
                }, 100);
            });
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.skill-category').forEach(category => {
    skillObserver.observe(category);
});

function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.toggle('active');
}

function closeMenu() {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.remove('active');
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offset = 80;
                    const targetPosition = target.offsetTop - offset;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    const lazyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                lazyObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('section').forEach(section => {
        section.classList.add('lazy-section');
        lazyObserver.observe(section);
    });
});

let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) {
        clearTimeout(scrollTimeout);
    }
    scrollTimeout = setTimeout(() => {
        document.body.style.overflowY = 'auto';
    }, 150);
}, { passive: true });

const matrixCanvas = document.getElementById('matrixCanvas');
if (matrixCanvas) {
    const context = matrixCanvas.getContext('2d');
    const alphabet = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%*+-<>';
    const fontSize = 16;
    let columns = 0;
    let drops = [];
    let animationFrameId;
    let reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resizeCanvas = () => {
        const ratio = window.devicePixelRatio || 1;
        const width = window.innerWidth;
        const height = window.innerHeight;

        matrixCanvas.width = Math.floor(width * ratio);
        matrixCanvas.height = Math.floor(height * ratio);
        matrixCanvas.style.width = `${width}px`;
        matrixCanvas.style.height = `${height}px`;
        context.setTransform(ratio, 0, 0, ratio, 0, 0);

        columns = Math.ceil(width / fontSize);
        drops = Array.from({ length: columns }, () => Math.random() * height / fontSize);
    };

    const draw = () => {
        if (reducedMotion) {
            context.clearRect(0, 0, matrixCanvas.width, matrixCanvas.height);
            context.fillStyle = 'rgba(0, 0, 0, 0.12)';
            context.fillRect(0, 0, window.innerWidth, window.innerHeight);
            context.fillStyle = '#00FF8C';
            context.font = `${fontSize}px Courier New, monospace`;
            for (let i = 0; i < drops.length; i += 8) {
                const character = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
                context.fillText(character, i * fontSize, drops[i] * fontSize);
            }
            return;
        }

        context.fillStyle = 'rgba(0, 0, 0, 0.08)';
        context.fillRect(0, 0, window.innerWidth, window.innerHeight);
        context.fillStyle = '#00FF8C';
        context.font = `${fontSize}px Courier New, monospace`;

        for (let i = 0; i < drops.length; i++) {
            const character = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
            const x = i * fontSize;
            const y = drops[i] * fontSize;
            context.fillText(character, x, y);

            if (y > window.innerHeight && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i] += 1;
        }
    };

    const animate = () => {
        draw();
        animationFrameId = window.requestAnimationFrame(animate);
    };

    resizeCanvas();
    animate();

    window.addEventListener('resize', resizeCanvas);
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (event) => {
        reducedMotion = event.matches;
    });

    window.addEventListener('beforeunload', () => {
        if (animationFrameId) {
            window.cancelAnimationFrame(animationFrameId);
        }
    });
}

// End of file - signed: srinivas018
