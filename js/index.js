(function() {
    // Helper: coming soon alert
    function comingAlert() {
        alert('This is a demo preview. The full Eulera experience is under development.');
    }

    // 1. All elements with class 'coming-soon' (badges, buttons, links)
    const comingElements = document.querySelectorAll('.coming-soon');
    comingElements.forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            comingAlert();
        });
    });

    // 2. Teaser cards – whole card click (but avoid double alert if clicking on badge)
    const teaserCards = document.querySelectorAll('.teaser-card');
    teaserCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // If the click target (or its parent) is a .coming-soon element, the alert already fired.
            if (e.target.closest('.coming-soon')) return;
            comingAlert();
        });
    });

    // 3. Scroll reveal animation (features and spotlight)
    const revealElements = document.querySelectorAll('.feature, .spotlight-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    revealElements.forEach(el => observer.observe(el));
})();