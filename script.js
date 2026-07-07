// ===== ENCHANTED FOREST: FIREFLIES + BUTTERFLIES =====
class FireflyCanvas {
    constructor() {
        this.canvas = document.getElementById('firefly-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.fireflies = [];
        this.butterflies = [];
        this.scrollY = 0;
        this.resize();
        this.initFireflies();
        this.initButterflies();
        this.animate();
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('scroll', () => { this.scrollY = window.scrollY; });
    }
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    initFireflies() {
        // Fewer on small screens — balanced, not overwhelming
        const width = window.innerWidth;
        let count;
        if (width <= 480) count = 12;
        else if (width <= 768) count = 18;
        else if (width <= 1024) count = 28;
        else count = Math.min(45, Math.floor(width / 40));
        for (let i = 0; i < count; i++) this.fireflies.push(this.createFirefly());
    }
    createFirefly() {
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            size: Math.random() * 2.5 + 1.2,
            speedX: (Math.random() - 0.5) * 0.3,
            speedY: (Math.random() - 0.5) * 0.25,
            opacity: Math.random(),
            opacityDir: (Math.random() > 0.5 ? 1 : -1) * (0.004 + Math.random() * 0.008),
            pulse: Math.random() * Math.PI * 2,
            pulseSpeed: 0.015 + Math.random() * 0.015
        };
    }
    initButterflies() {
        // Only 1-2 on mobile, more on desktop
        const width = window.innerWidth;
        let count;
        if (width <= 480) count = 1;
        else if (width <= 768) count = 2;
        else count = Math.min(5, Math.floor(width / 300));
        for (let i = 0; i < count; i++) this.butterflies.push(this.createButterfly());
    }
    createButterfly() {
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height * 0.8,
            size: Math.random() * 14 + 10,
            speedX: (Math.random() - 0.2) * 0.6,
            speedY: 0,
            wingPhase: Math.random() * Math.PI * 2,
            wingSpeed: 0.06 + Math.random() * 0.04,
            drift: Math.random() * Math.PI * 2,
            driftSpeed: 0.003 + Math.random() * 0.004,
            opacity: 0.12 + Math.random() * 0.12,
            hue: Math.random() > 0.5 ? 'gold' : 'green'
        };
    }
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // --- FIREFLIES ---
        this.fireflies.forEach(f => {
            f.pulse += f.pulseSpeed;
            f.opacity += f.opacityDir;
            if (f.opacity >= 1) { f.opacity = 1; f.opacityDir = -Math.abs(f.opacityDir); }
            if (f.opacity <= 0.05) { f.opacity = 0.05; f.opacityDir = Math.abs(f.opacityDir); }
            f.x += f.speedX + Math.sin(f.pulse) * 0.3;
            f.y += f.speedY + Math.cos(f.pulse * 0.7) * 0.2;
            if (f.x < -20) f.x = this.canvas.width + 20;
            if (f.x > this.canvas.width + 20) f.x = -20;
            if (f.y < -20) f.y = this.canvas.height + 20;
            if (f.y > this.canvas.height + 20) f.y = -20;

            // Outer glow — BRIGHT GOLDEN YELLOW
            const glowSize = f.size * 5 * f.opacity;
            const gradient = this.ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, glowSize);
            gradient.addColorStop(0, `rgba(255, 230, 50, ${f.opacity * 0.6})`);
            gradient.addColorStop(0.4, `rgba(255, 200, 0, ${f.opacity * 0.3})`);
            gradient.addColorStop(1, 'rgba(255, 200, 0, 0)');
            this.ctx.beginPath();
            this.ctx.arc(f.x, f.y, glowSize, 0, Math.PI * 2);
            this.ctx.fillStyle = gradient;
            this.ctx.fill();

            // Core — white-gold center
            this.ctx.beginPath();
            this.ctx.arc(f.x, f.y, f.size * 0.8, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 250, 200, ${f.opacity})`;
            this.ctx.fill();
        });

        // --- BUTTERFLIES ---
        this.butterflies.forEach(b => {
            b.wingPhase += b.wingSpeed;
            b.drift += b.driftSpeed;
            b.x += b.speedX + Math.sin(b.drift) * 0.5;
            b.y += Math.sin(b.drift * 1.3) * 0.4;
            if (b.x > this.canvas.width + 40) { b.x = -40; b.y = Math.random() * this.canvas.height * 0.7; }
            if (b.x < -40) b.x = this.canvas.width + 40;

            const wingFlap = Math.sin(b.wingPhase);
            const wingColor = b.hue === 'gold'
                ? `rgba(255, 215, 0, ${b.opacity})`
                : `rgba(120, 200, 120, ${b.opacity})`;
            const wingColor2 = b.hue === 'gold'
                ? `rgba(255, 240, 150, ${b.opacity * 0.7})`
                : `rgba(180, 230, 160, ${b.opacity * 0.7})`;

            this.ctx.save();
            this.ctx.translate(b.x, b.y);
            this.ctx.rotate(Math.sin(b.drift) * 0.1);

            // Left wing
            this.ctx.save();
            this.ctx.scale(wingFlap * 0.9, 1);
            this.ctx.beginPath();
            this.ctx.ellipse(-b.size * 0.55, -b.size * 0.1, b.size * 0.65, b.size * 0.4, -0.2, 0, Math.PI * 2);
            this.ctx.fillStyle = wingColor;
            this.ctx.fill();
            // Inner pattern
            this.ctx.beginPath();
            this.ctx.ellipse(-b.size * 0.45, -b.size * 0.05, b.size * 0.3, b.size * 0.2, -0.2, 0, Math.PI * 2);
            this.ctx.fillStyle = wingColor2;
            this.ctx.fill();
            this.ctx.restore();

            // Right wing
            this.ctx.save();
            this.ctx.scale(wingFlap * 0.9, 1);
            this.ctx.beginPath();
            this.ctx.ellipse(b.size * 0.55, -b.size * 0.1, b.size * 0.65, b.size * 0.4, 0.2, 0, Math.PI * 2);
            this.ctx.fillStyle = wingColor;
            this.ctx.fill();
            this.ctx.beginPath();
            this.ctx.ellipse(b.size * 0.45, -b.size * 0.05, b.size * 0.3, b.size * 0.2, 0.2, 0, Math.PI * 2);
            this.ctx.fillStyle = wingColor2;
            this.ctx.fill();
            this.ctx.restore();

            // Body
            this.ctx.beginPath();
            this.ctx.ellipse(0, 0, 1.5, b.size * 0.25, 0, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(80, 60, 20, ${b.opacity})`;
            this.ctx.fill();

            this.ctx.restore();
        });

        requestAnimationFrame(() => this.animate());
    }
}

// ===== GOLDEN SPARKLE CURSOR — MAGIC WAND EFFECT =====
class CursorTrail {
    constructor() {
        // Skip on touch-only devices
        if ('ontouchstart' in window && !window.matchMedia('(pointer: fine)').matches) return;
        this.canvas = document.createElement('canvas');
        this.canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:99999;';
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouseX = -100;
        this.mouseY = -100;
        this.lastSpawn = 0;
        this.resize();
        window.addEventListener('resize', () => this.resize());
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            // Throttle spawning to every 30ms so it's not overwhelming
            const now = Date.now();
            if (now - this.lastSpawn > 30) {
                this.burst(e.clientX, e.clientY);
                this.lastSpawn = now;
            }
        });
        this.animate();
    }
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    burst(x, y) {
        // Spawn 2-3 sparkle particles per move event
        const count = 2 + Math.floor(Math.random() * 2);
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: x + (Math.random() - 0.5) * 8,
                y: y + (Math.random() - 0.5) * 8,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2 + 0.5,
                size: Math.random() * 4 + 2,
                life: 1,
                decay: 0.015 + Math.random() * 0.015,
                rotation: Math.random() * Math.PI * 2,
                rotSpeed: (Math.random() - 0.5) * 0.2,
                type: Math.random() > 0.4 ? 'sparkle' : 'dot'
            });
        }
        // Cap particles
        if (this.particles.length > 80) this.particles.splice(0, 10);
    }
    drawSparkle(x, y, size, opacity, rotation) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(rotation);
        this.ctx.globalAlpha = opacity;
        // 4-point star sparkle
        this.ctx.beginPath();
        for (let i = 0; i < 4; i++) {
            const angle = (i * Math.PI) / 2;
            const outerX = Math.cos(angle) * size;
            const outerY = Math.sin(angle) * size;
            const innerAngle = angle + Math.PI / 4;
            const innerX = Math.cos(innerAngle) * size * 0.3;
            const innerY = Math.sin(innerAngle) * size * 0.3;
            if (i === 0) this.ctx.moveTo(outerX, outerY);
            else this.ctx.lineTo(outerX, outerY);
            this.ctx.lineTo(innerX, innerY);
        }
        this.ctx.closePath();
        this.ctx.fillStyle = `rgba(255, 230, 50, ${opacity})`;
        this.ctx.fill();
        // Center glow
        this.ctx.beginPath();
        this.ctx.arc(0, 0, size * 0.4, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(255, 255, 220, ${opacity})`;
        this.ctx.fill();
        this.ctx.restore();
    }
    drawDot(x, y, size, opacity) {
        // Golden glowing dot
        const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, size * 2);
        gradient.addColorStop(0, `rgba(255, 245, 150, ${opacity})`);
        gradient.addColorStop(0.5, `rgba(255, 215, 0, ${opacity * 0.5})`);
        gradient.addColorStop(1, 'rgba(255, 200, 0, 0)');
        this.ctx.beginPath();
        this.ctx.arc(x, y, size * 2, 0, Math.PI * 2);
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
    }
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.particles = this.particles.filter(p => {
            p.life -= p.decay;
            if (p.life <= 0) return false;
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.03; // gentle gravity
            p.rotation += p.rotSpeed;
            p.size *= 0.98;
            if (p.type === 'sparkle') {
                this.drawSparkle(p.x, p.y, p.size, p.life, p.rotation);
            } else {
                this.drawDot(p.x, p.y, p.size, p.life);
            }
            return true;
        });
        requestAnimationFrame(() => this.animate());
    }
}

// ===== TESTIMONIAL AUTO-CAROUSEL =====
class Carousel {
    constructor() {
        this.track = document.getElementById('carousel-track');
        this.dotsContainer = document.getElementById('carousel-dots');
        this.prevBtn = document.getElementById('carousel-prev');
        this.nextBtn = document.getElementById('carousel-next');
        if (!this.track) return;
        this.slides = this.track.querySelectorAll('.testimonial-slide');
        this.current = 0;
        this.total = this.slides.length;
        this.autoInterval = null;
        this.buildDots();
        this.goTo(0);
        this.startAuto();
        // Pause on hover
        this.track.parentElement.addEventListener('mouseenter', () => this.stopAuto());
        this.track.parentElement.addEventListener('mouseleave', () => this.startAuto());
        // Arrow controls
        if (this.prevBtn) this.prevBtn.addEventListener('click', () => { this.prev(); this.restartAuto(); });
        if (this.nextBtn) this.nextBtn.addEventListener('click', () => { this.next(); this.restartAuto(); });
        // Touch support
        let startX = 0;
        this.track.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; });
        this.track.addEventListener('touchend', (e) => {
            const diff = startX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) { diff > 0 ? this.next() : this.prev(); }
        });
    }
    buildDots() {
        for (let i = 0; i < this.total; i++) {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            dot.setAttribute('aria-label', `Slide ${i + 1}`);
            dot.addEventListener('click', () => { this.goTo(i); this.restartAuto(); });
            this.dotsContainer.appendChild(dot);
        }
    }
    goTo(index) {
        this.current = index;
        this.track.style.transform = `translateX(-${index * 100}%)`;
        this.dotsContainer.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === index));
    }
    next() { this.goTo((this.current + 1) % this.total); }
    prev() { this.goTo((this.current - 1 + this.total) % this.total); }
    startAuto() { this.autoInterval = setInterval(() => this.next(), 3000); }
    stopAuto() { clearInterval(this.autoInterval); }
    restartAuto() { this.stopAuto(); this.startAuto(); }
}

// ===== SCROLL REVEAL =====
class ScrollReveal {
    constructor() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
        }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
        document.querySelectorAll('.reveal').forEach(el => this.observer.observe(el));
    }
}

// ===== COUNTER ANIMATION =====
class CounterAnimation {
    constructor() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting && !e.target.dataset.animated) {
                    this.animate(e.target);
                    e.target.dataset.animated = 'true';
                }
            });
        }, { threshold: 0.5 });
        document.querySelectorAll('[data-count]').forEach(el => this.observer.observe(el));
    }
    animate(el) {
        const target = parseInt(el.dataset.count);
        const duration = 2000;
        const start = performance.now();
        const update = (now) => {
            const p = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - p, 4);
            el.textContent = Math.floor(ease * target).toLocaleString();
            if (p < 1) requestAnimationFrame(update);
            else el.textContent = target.toLocaleString() + '+';
        };
        requestAnimationFrame(update);
    }
}

// ===== EXPANDABLE CASE STUDIES =====
class CaseStudyExpand {
    constructor() {
        document.querySelectorAll('.case-card').forEach(card => {
            // Click anywhere on card to toggle (not just button)
            card.addEventListener('click', (e) => {
                // Don't toggle if clicking a link
                if (e.target.tagName === 'A') return;
                const isExpanded = card.dataset.expanded === 'true';
                card.dataset.expanded = isExpanded ? 'false' : 'true';
                const btn = card.querySelector('.expand-text');
                if (btn) btn.textContent = isExpanded ? 'Expand: research details' : 'Collapse';
            });
            // Make card look clickable
            card.style.cursor = 'pointer';
        });
    }
}

// ===== NAVIGATION =====
class Navigation {
    constructor() {
        this.nav = document.getElementById('nav');
        this.toggle = document.querySelector('.nav-toggle');
        this.links = document.querySelector('.nav-links');
        window.addEventListener('scroll', () => {
            this.nav.classList.toggle('scrolled', window.scrollY > 50);
        });
        if (this.toggle) {
            this.toggle.addEventListener('click', () => this.links.classList.toggle('open'));
        }
        this.links.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => this.links.classList.remove('open'));
        });
    }
}

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        e.preventDefault();
        const t = document.querySelector(a.getAttribute('href'));
        if (t) window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' });
    });
});

// ===== PASSWORD GATE (legacy, safe to remove) =====
function initGate() {
    // No longer used - password gate removed
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    new FireflyCanvas();
    new CursorTrail();
    new Carousel();
    new ScrollReveal();
    new CounterAnimation();
    new CaseStudyExpand();
    new Navigation();
    initGate();
    initServicesForm();
});

// ===== SERVICES FORM =====
function initServicesForm() {
    const btn = document.getElementById('services-btn');
    const form = document.getElementById('services-form');
    if (btn && form) {
        btn.addEventListener('click', () => {
            form.classList.toggle('hidden');
            if (!form.classList.contains('hidden')) {
                form.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    const form = document.getElementById('contact-form');
    const success = document.getElementById('form-success');
    // In production, this would POST to a service like Formspree
    form.classList.add('hidden');
    success.classList.remove('hidden');
    return false;
}
