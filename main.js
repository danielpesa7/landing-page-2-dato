/* ===================================================================
   2Dato Landing Page — Main JavaScript
   Smooth-scroll offset and anchor navigation.
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initSmoothScroll();
});

/* --- Smooth Scroll Offset + Anchor Navigation --- */
function initSmoothScroll() {
    const nav = document.querySelector('nav.nav');

    if (nav) {
        const update = () =>
            document.documentElement.style.setProperty('--nav-h', nav.offsetHeight + 'px');
        update();
        window.addEventListener('resize', update, { passive: true });
    }

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const navHeight = nav ? nav.offsetHeight : 0;
                const y = target.getBoundingClientRect().top + window.scrollY - navHeight;
                const prefersReduced = window.matchMedia(
                    '(prefers-reduced-motion: reduce)'
                ).matches;
                window.scrollTo({ top: y, behavior: prefersReduced ? 'instant' : 'smooth' });
            }
        });
    });
}
