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



// TryHackMe Radar Chart & Room Filtering Logic
document.addEventListener('DOMContentLoaded', () => {
    // 0. Dynamic Profile and Rooms Loading
    if (typeof thmData !== 'undefined') {
        // Populate profile card elements
        const usernameEl = document.getElementById('thm-username');
        const levelEl = document.getElementById('thm-level');
        const rankEl = document.getElementById('thm-rank');
        const badgesEl = document.getElementById('thm-badges');
        const roomsEl = document.getElementById('thm-rooms');
        const profileLinkEl = document.getElementById('thm-profile-link');

        if (usernameEl) usernameEl.textContent = thmData.profile.username;
        if (levelEl) levelEl.textContent = thmData.profile.level;
        if (rankEl) rankEl.textContent = thmData.profile.rank;
        if (badgesEl) badgesEl.textContent = thmData.profile.totalBadges;
        if (roomsEl) roomsEl.textContent = thmData.profile.totalRooms + '+';
        if (profileLinkEl) profileLinkEl.href = `https://tryhackme.com/p/${thmData.profile.username}`;

        // Populate rooms grid
        const roomsGrid = document.getElementById('roomsGrid');
        if (roomsGrid) {
            roomsGrid.innerHTML = ''; // Clear fallback/placeholders
            thmData.rooms.forEach(room => {
                const card = document.createElement('div');
                card.className = 'room-card';
                card.setAttribute('data-category', room.category);
                
                const statusHtml = room.completed ? '<div class="room-status">COMPLETED</div>' : '<div class="room-status" style="background: rgba(0, 217, 255, 0.1); color: #00D9FF; border-color: rgba(0, 217, 255, 0.3);">IN PROGRESS</div>';
                const progressWidth = room.completed ? '100%' : '50%';
                
                card.innerHTML = `
                    ${statusHtml}
                    <div class="room-badge ${room.category}">${room.categoryName}</div>
                    <h4>${room.title}</h4>
                    <p>${room.description}</p>
                    <div class="room-progress-container">
                        <div class="room-progress-bar" style="width: ${progressWidth}"></div>
                    </div>
                    <div class="room-footer">
                        <span>XP: ${room.xp}</span>
                        <a href="${room.url}" target="_blank">Room &rarr;</a>
                    </div>
                `;
                roomsGrid.appendChild(card);
            });
        }
    }

    // 1. Radar Chart Implementation
    const canvas = document.getElementById('thmSkillChart');
    if (canvas && typeof thmData !== 'undefined') {
        const ctx = canvas.getContext('2d');
        
        // Load target values from thmData.skills
        const skills = [
            { label: 'Network Monitoring', value: thmData.skills.networkMonitoring || 80 },
            { label: 'SIEM & Log Analysis', value: thmData.skills.siemLogAnalysis || 80 },
            { label: 'Endpoint Security', value: thmData.skills.endpointSecurity || 80 },
            { label: 'Incident Response', value: thmData.skills.incidentResponse || 80 },
            { label: 'Digital Forensics', value: thmData.skills.digitalForensics || 80 },
            { label: 'Threat Intelligence', value: thmData.skills.threatIntelligence || 80 }
        ];
        
        const numAxes = skills.length;
        let animationProgress = 0;
        let hasAnimated = false;
        
        const setCanvasSize = () => {
            const rect = canvas.parentElement.getBoundingClientRect();
            const size = Math.min(rect.width, 320);
            canvas.width = size * window.devicePixelRatio;
            canvas.height = size * window.devicePixelRatio;
            canvas.style.width = `${size}px`;
            canvas.style.height = `${size}px`;
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        };
        
        const drawRadar = (progress) => {
            const size = canvas.width / window.devicePixelRatio;
            const center = size / 2;
            const maxRadius = (size / 2) * 0.72;
            
            ctx.clearRect(0, 0, size, size);
            
            // Draw background concentric polygons (Grid)
            const numLevels = 5;
            ctx.strokeStyle = 'rgba(0, 255, 140, 0.12)';
            ctx.lineWidth = 1;
            
            for (let level = 1; level <= numLevels; level++) {
                const radius = (maxRadius / numLevels) * level;
                ctx.beginPath();
                for (let i = 0; i < numAxes; i++) {
                    const angle = (i * 2 * Math.PI) / numAxes - Math.PI / 2;
                    const x = center + radius * Math.cos(angle);
                    const y = center + radius * Math.sin(angle);
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.closePath();
                ctx.stroke();
                
                // Draw grid level values
                ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
                ctx.font = '8px Courier New, monospace';
                const angle = -Math.PI / 2;
                ctx.fillText(`${(100 / numLevels) * level}%`, center + 6, center - radius + 3);
            }
            
            // Draw radial grid axes lines
            ctx.strokeStyle = 'rgba(0, 255, 140, 0.12)';
            for (let i = 0; i < numAxes; i++) {
                const angle = (i * 2 * Math.PI) / numAxes - Math.PI / 2;
                const x = center + maxRadius * Math.cos(angle);
                const y = center + maxRadius * Math.sin(angle);
                ctx.beginPath();
                ctx.moveTo(center, center);
                ctx.lineTo(x, y);
                ctx.stroke();
            }
            
            // Draw skill labels
            ctx.fillStyle = '#ffffff';
            ctx.font = '9px Courier New, monospace';
            ctx.textBaseline = 'middle';
            
            for (let i = 0; i < numAxes; i++) {
                const angle = (i * 2 * Math.PI) / numAxes - Math.PI / 2;
                const labelRadius = maxRadius + 18;
                const x = center + labelRadius * Math.cos(angle);
                const y = center + labelRadius * Math.sin(angle);
                
                let align = 'center';
                if (Math.cos(angle) > 0.1) align = 'left';
                else if (Math.cos(angle) < -0.1) align = 'right';
                ctx.textAlign = align;
                
                ctx.fillText(skills[i].label, x, y);
            }
            
            // Draw User Skill Data Polygon
            ctx.beginPath();
            for (let i = 0; i < numAxes; i++) {
                const angle = (i * 2 * Math.PI) / numAxes - Math.PI / 2;
                const valuePercent = (skills[i].value / 100) * progress;
                const radius = maxRadius * valuePercent;
                const x = center + radius * Math.cos(angle);
                const y = center + radius * Math.sin(angle);
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            
            // Fill polygon with glowing cyber-blue gradient
            const grad = ctx.createRadialGradient(center, center, 10, center, center, maxRadius);
            grad.addColorStop(0, 'rgba(0, 217, 255, 0.05)');
            grad.addColorStop(1, 'rgba(0, 217, 255, 0.35)');
            ctx.fillStyle = grad;
            ctx.fill();
            
            // Draw polygon border
            ctx.strokeStyle = '#00D9FF';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Draw points on the vertices
            for (let i = 0; i < numAxes; i++) {
                const angle = (i * 2 * Math.PI) / numAxes - Math.PI / 2;
                const valuePercent = (skills[i].value / 100) * progress;
                const radius = maxRadius * valuePercent;
                const x = center + radius * Math.cos(angle);
                const y = center + radius * Math.sin(angle);
                
                ctx.beginPath();
                ctx.arc(x, y, 4, 0, 2 * Math.PI);
                ctx.fillStyle = '#00FF8C';
                ctx.fill();
                ctx.strokeStyle = '#fff';
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        };
        
        const animate = () => {
            if (animationProgress < 1) {
                animationProgress += 0.03;
                if (animationProgress > 1) animationProgress = 1;
                drawRadar(animationProgress);
                requestAnimationFrame(animate);
            }
        };
        
        setCanvasSize();
        drawRadar(0);
        
        const radarObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasAnimated) {
                    hasAnimated = true;
                    setTimeout(animate, 250);
                    radarObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        
        radarObserver.observe(canvas);
        
        window.addEventListener('resize', () => {
            setCanvasSize();
            drawRadar(hasAnimated ? 1 : 0);
        });
    }
    
    // 2. Room Directory Search and Category Filter
    const roomSearch = document.getElementById('roomSearch');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    const filterRooms = () => {
        const roomCards = document.querySelectorAll('.room-card');
        const activeFilterBtn = document.querySelector('.filter-btn.active');
        const currentFilter = activeFilterBtn ? activeFilterBtn.getAttribute('data-filter') : 'all';
        const searchQuery = roomSearch ? roomSearch.value.toLowerCase().trim() : '';

        roomCards.forEach(card => {
            const category = card.getAttribute('data-category');
            const title = card.querySelector('h4').textContent.toLowerCase();
            const desc = card.querySelector('p').textContent.toLowerCase();
            
            const matchesCategory = currentFilter === 'all' || category === currentFilter;
            const matchesSearch = title.includes(searchQuery) || desc.includes(searchQuery);
            
            if (matchesCategory && matchesSearch) {
                card.style.display = 'flex';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 10);
            } else {
                card.style.display = 'none';
                card.style.opacity = '0';
                card.style.transform = 'translateY(15px)';
            }
        });
    };
    
    if (roomSearch) {
        roomSearch.addEventListener('input', filterRooms);
    }
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterRooms();
        });
    });
});

// Certificate Modal Zoom Functions
window.openCertModal = function(element) {
    const img = element.querySelector('.cert-img');
    const modal = document.getElementById('certModal');
    const modalImg = document.getElementById('certModalImg');
    if (img && modal && modalImg) {
        modal.style.display = "flex";
        modalImg.src = img.src;
    }
};

window.closeCertModal = function() {
    const modal = document.getElementById('certModal');
    if (modal) {
        modal.style.display = "none";
    }
};

// End of file - signed: srinivas018
