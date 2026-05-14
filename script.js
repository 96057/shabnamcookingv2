document.addEventListener('DOMContentLoaded', () => {
    const title = document.getElementById('title-layer');
    const nav = document.getElementById('nav-layer');
    const starfield = document.getElementById('starfield');
    const body = document.body;
    const sections = document.querySelectorAll('section');
    const enterBtn = document.getElementById('enter-btn');
    const emailBtn = document.getElementById('copy-email');

    // Scale stars based on screen width for performance
    function createStars() {
        if (!starfield) return;
        const count = window.innerWidth < 768 ? 60 : 130;
        starfield.innerHTML = ''; // Clear existing
        for (let i = 0; i < count; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            const size = Math.random() * 2 + 0.5;
            star.style.cssText = `
                width: ${size}px; height: ${size}px;
                top: ${Math.random() * 100}%; left: ${Math.random() * 100}%;
                --duration: ${Math.random() * 3 + 2}s;
            `;
            starfield.appendChild(star);
        }
    }

    function scrollToStart() {
        const target = document.getElementById('start');
        if (!target) return;
        const targetPos = target.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
    }

    if (enterBtn) enterBtn.addEventListener('click', scrollToStart);

    if (emailBtn) {
        emailBtn.addEventListener('click', () => {
            const email = emailBtn.getAttribute('data-copy');
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(email).then(() => {
                    emailBtn.classList.add('copied');
                    setTimeout(() => emailBtn.classList.remove('copied'), 2200);
                });
            } else {
                // Fallback for non-secure contexts
                const textArea = document.createElement("textarea");
                textArea.value = email;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                emailBtn.classList.add('copied');
                setTimeout(() => emailBtn.classList.remove('copied'), 2200);
            }
        });
    }

    function updateElements() {
        const scrollY = window.scrollY;
        const vh = window.innerHeight;
        let progress = Math.max(0, Math.min(1, scrollY / (vh * 1.6)));

        if (title) {
            title.style.transform = `translate3d(0, 0, ${progress * 1600}px)`;
            title.style.opacity = 1 - (progress * 2.8);
            title.style.filter = `blur(${progress * 15}px)`;
        }
        if (nav) {
            nav.style.transform = `translate3d(0, 0, ${progress * 2200}px)`;
            nav.style.opacity = 1 - (progress * 4);
        }

        // Color Transitions
        if (progress > 0.8) body.style.background = "var(--bg-cream)";
        else if (progress > 0.3) body.style.background = "var(--dark-green)";
        else body.style.background = "var(--deep-forest)";

        sections.forEach(sec => {
            if (sec.getBoundingClientRect().top < vh * 0.85) sec.classList.add('visible');
        });
    }

    window.addEventListener('scroll', updateElements, { passive: true });
    window.addEventListener('resize', createStars, { passive: true });

    // Ensure the page fades in correctly even if font event is missed
    const revealPage = () => {
        body.classList.remove('fonts-loading');
        createStars();
        updateElements();
        setTimeout(() => body.classList.add('ready'), 150);
    };

    if (document.fonts) {
        document.fonts.ready.then(revealPage);
    } else {
        revealPage();
    }
});