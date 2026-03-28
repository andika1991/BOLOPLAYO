// ===========================
// Preloader
// ===========================
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('preloader').classList.add('hidden');
    }, 1200);
});

// ===========================
// Theme Toggle (Light Default)
// ===========================
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

function initTheme() {
    const savedTheme = localStorage.getItem('boloplayon-theme') || 'light';
    html.setAttribute('data-theme', savedTheme);
}

initTheme();

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.classList.add('theme-transition');
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('boloplayon-theme', newTheme);
    setTimeout(() => html.classList.remove('theme-transition'), 500);
});

// ===========================
// Navbar Scroll Effect
// ===========================
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===========================
// Mobile Navigation
// ===========================
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ===========================
// Active Nav Link on Scroll
// ===========================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveLink() {
    const scrollPos = window.scrollY + 100;
    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        if (scrollPos >= top && scrollPos < top + height) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) link.classList.add('active');
            });
        }
    });
}

window.addEventListener('scroll', updateActiveLink);

// ===========================
// Hero Particles
// ===========================
function createParticles() {
    const container = document.getElementById('particles');
    const count = 40;
    for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.classList.add('particle');
        p.style.left = `${Math.random() * 100}%`;
        p.style.top = `${Math.random() * 100}%`;
        p.style.animationDelay = `${Math.random() * 6}s`;
        p.style.animationDuration = `${4 + Math.random() * 4}s`;
        const size = 2 + Math.random() * 4;
        p.style.width = `${size}px`;
        p.style.height = `${size}px`;
        container.appendChild(p);
    }
}
createParticles();

// ===========================
// Counter Animation
// ===========================
let counterAnimated = false;

function animateCounters() {
    if (counterAnimated) return;
    counterAnimated = true;
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const startTime = performance.now();
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            counter.textContent = Math.round(eased * target).toLocaleString();
            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    });
}

// ===========================
// Scroll Animations
// ===========================
const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = entry.target.getAttribute('data-delay') || 0;
            setTimeout(() => entry.target.classList.add('aos-animate'), parseInt(delay));
            if (entry.target.closest('#stats')) animateCounters();
        }
    });
}, observerOptions);

document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));
const statsSection = document.getElementById('stats');
if (statsSection) observer.observe(statsSection);

// ===========================
// Training Tabs
// ===========================
const trainingTabs = document.querySelectorAll('.training-tab');
const trainingSchedules = document.querySelectorAll('.training-schedule');

trainingTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const target = tab.getAttribute('data-tab');
        trainingTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        trainingSchedules.forEach(schedule => {
            schedule.classList.remove('active');
            if (schedule.id === target) schedule.classList.add('active');
        });
    });
});

// ===========================
// Pace Calculator
// ===========================
const calculateBtn = document.getElementById('calculatePace');

if (calculateBtn) {
    calculateBtn.addEventListener('click', () => {
        const distance = parseFloat(document.getElementById('pace-distance').value) || 0;
        const hours = parseInt(document.getElementById('pace-hours').value) || 0;
        const minutes = parseInt(document.getElementById('pace-minutes').value) || 0;
        const seconds = parseInt(document.getElementById('pace-seconds').value) || 0;

        if (distance <= 0) return;

        const totalSeconds = hours * 3600 + minutes * 60 + seconds;
        const paceSeconds = totalSeconds / distance;
        const paceMin = Math.floor(paceSeconds / 60);
        const paceSec = Math.round(paceSeconds % 60);
        const speed = (distance / (totalSeconds / 3600)).toFixed(1);

        // Estimates (based on Riegel formula)
        const est10k = totalSeconds * (10 / distance) ** 1.06;
        const estHM = totalSeconds * (21.0975 / distance) ** 1.06;
        const estFM = totalSeconds * (42.195 / distance) ** 1.06;

        function formatTime(s, full) {
            const h = Math.floor(s / 3600);
            const m = Math.floor((s % 3600) / 60);
            const sec = Math.round(s % 60);
            if (full) return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
            return `${m}:${String(sec).padStart(2, '0')}`;
        }

        document.getElementById('paceResult').textContent = `${paceMin}:${String(paceSec).padStart(2, '0')}`;
        document.getElementById('speedResult').textContent = speed;
        document.getElementById('est10k').textContent = formatTime(est10k);
        document.getElementById('estHM').textContent = formatTime(estHM, true);
        document.getElementById('estFM').textContent = formatTime(estFM, true);

        // Animate result cards
        document.querySelectorAll('.pace-result-card').forEach(card => {
            card.style.animation = 'none';
            card.offsetHeight;
            card.style.animation = 'fadeInUp 0.5s ease forwards';
        });
    });

    // Auto-calculate on input change
    document.querySelectorAll('.pace-input-group input').forEach(input => {
        input.addEventListener('input', () => calculateBtn.click());
    });

    // Calculate on load
    calculateBtn.click();
}

// ===========================
// Smooth Scroll
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80;
            const position = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top: position, behavior: 'smooth' });
        }
    });
});

// ===========================
// Form Submission
// ===========================
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const btn = this.querySelector('button[type="submit"]');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<span>Mengirim...</span>';
        btn.disabled = true;
        setTimeout(() => {
            btn.innerHTML = '<span>✓ Terkirim!</span>';
            btn.style.background = 'linear-gradient(135deg, #00D4AA, #00B894)';
            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.style.background = '';
                btn.disabled = false;
                contactForm.reset();
            }, 2000);
        }, 1500);
    });
}

// ===========================
// Hero Parallax
// ===========================
const heroContent = document.querySelector('.hero-content');
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
        heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
        heroContent.style.opacity = 1 - (scrolled / window.innerHeight) * 0.8;
    }
});
