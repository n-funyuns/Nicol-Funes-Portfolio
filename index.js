/**
 * Portfolio JavaScript
 * Handles:
 * 1. Background icon parallax
 * 2. Hero reveal animation
 * 3. Stacked experience section scroll driver
 */

// =====================
// 1. PARALLAX ICONS
// =====================
const parallaxIcons = () => {
    const scrolled = window.scrollY;
    document.querySelectorAll('.icon').forEach(icon => {
        const speed = parseFloat(icon.dataset.speed) || 0.1;
        icon.style.transform = `translateY(${scrolled * speed}px)`;
    });
};

// =====================
// 2. HERO REVEAL
// =====================
const heroReveal = () => {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    const experienceTop = document.querySelector('.experience')?.offsetTop || Infinity;
    const scrolled = window.scrollY;
    // Fade hero out as experience section approaches
    const fade = Math.max(0, 1 - (scrolled / (experienceTop * 0.6)));
    hero.style.opacity = fade;
};

// =====================
// 3. EXPERIENCE SECTION - STACKED PARALLAX
// =====================
const panels = Array.from(document.querySelectorAll('.exp-panel'));
const expSection = document.getElementById('experience');
const progressFill = document.getElementById('expProgressFill');

const updateExperience = () => {
    if (!expSection || panels.length === 0) return;

    const sectionTop = expSection.offsetTop;
    const sectionHeight = expSection.offsetHeight;
    const viewportHeight = window.innerHeight;
    const scrolled = window.scrollY;

    // How far we've scrolled INTO the sticky experience area
    const progress = (scrolled - sectionTop) / (sectionHeight - viewportHeight);
    const clampedProgress = Math.max(0, Math.min(1, progress));

    // Each panel takes an equal slice of the progress
    const panelProgress = clampedProgress * panels.length;
    const activeIndex = Math.min(Math.floor(panelProgress), panels.length - 1);

    // Update progress bar
    if (progressFill) {
        progressFill.style.width = `${clampedProgress * 100}%`;
    }

    // Assign states
    panels.forEach((panel, i) => {
        panel.classList.remove('active', 'past', 'upcoming');
        if (i < activeIndex) {
            panel.classList.add('past');
        } else if (i === activeIndex) {
            panel.classList.add('active');
        } else if (i === activeIndex + 1) {
            // The upcoming one peeks from below
            panel.classList.add('upcoming');
        }
        // Others beyond upcoming remain fully hidden (default state)
    });
};

// =====================
// 4. SCROLL LISTENER
// =====================
const onScroll = () => {
    parallaxIcons();
    heroReveal();
    updateExperience();
};

window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('load', () => {
    updateExperience();
    heroReveal();

    // Trigger hero entrance animation
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transition = 'opacity 0.4s ease';
    }
});

// =====================
// 5. SMOOTH SCROLL ANCHORS
// =====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
