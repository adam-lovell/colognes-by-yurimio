// ================================
// Colognes by Yurimio — Shared JS
// ================================

// --- Cart (localStorage) ---
window.YurimioCart = {
  get() {
    return JSON.parse(localStorage.getItem('yurimio_cart') || '[]');
  },
  save(cart) {
    localStorage.setItem('yurimio_cart', JSON.stringify(cart));
  },
  add(product, qty = 1) {
    const cart = this.get();
    const existing = cart.find(i => i.id === product.id);
    if (existing) {
      existing.quantity += qty;
    } else {
      cart.push({ ...product, quantity: qty });
    }
    this.save(cart);
  },
  updateAllCounts() {
    const cart = this.get();
    const total = cart.reduce((s, i) => s + i.quantity, 0);
    document.querySelectorAll('.cart-count').forEach(el => {
      el.textContent = total;
    });
  }
};

// --- Auth (localStorage demo — replace with Firebase Auth in production) ---
window.YurimioAuth = {
  getUser() {
    return JSON.parse(localStorage.getItem('yurimio_user') || 'null');
  },
  setUser(user) {
    localStorage.setItem('yurimio_user', JSON.stringify(user));
  },
  logout() {
    localStorage.removeItem('yurimio_user');
  },
  updateNav() {
    const user = this.getUser();
    document.querySelectorAll('.nav-auth-link').forEach(el => {
      if (user) {
        el.textContent = user.name || 'Account';
        el.classList.add('text-gold');
        el.classList.remove('text-neutral-400', 'text-neutral-300');
      } else {
        el.textContent = 'Sign In';
        el.classList.remove('text-gold');
      }
    });
  }
};

// --- Mobile Menu Toggle ---
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
if (mobileMenuBtn && mobileMenu) {
  mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });
  // Close menu on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
  });
}

// --- Video Player (index.html) ---
const video = document.getElementById('showcase-video');
const playBtn = document.getElementById('video-play-btn');
const muteBtn = document.getElementById('video-mute-btn');
const muteIcon = document.getElementById('mute-icon');
const unmuteIcon = document.getElementById('unmute-icon');

if (video && playBtn) {
  playBtn.addEventListener('click', () => {
    video.muted = false;
    video.play();
    playBtn.style.opacity = '0';
    playBtn.style.pointerEvents = 'none';
    if (muteBtn) {
      muteBtn.classList.remove('hidden');
      muteBtn.classList.add('flex');
      // Show unmute icon (audio is on)
      if (muteIcon) muteIcon.classList.add('hidden');
      if (unmuteIcon) unmuteIcon.classList.remove('hidden');
    }
  });

  // Click video to pause/play
  video.addEventListener('click', () => {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  });
}

if (muteBtn && video) {
  muteBtn.addEventListener('click', () => {
    video.muted = !video.muted;
    if (video.muted) {
      if (muteIcon) { muteIcon.classList.remove('hidden'); }
      if (unmuteIcon) { unmuteIcon.classList.add('hidden'); }
    } else {
      if (muteIcon) { muteIcon.classList.add('hidden'); }
      if (unmuteIcon) { unmuteIcon.classList.remove('hidden'); }
    }
  });
}

// --- Notify Me (index.html) ---
const notifyBtn = document.getElementById('notify-btn');
const emailInput = document.getElementById('email-input');
if (notifyBtn && emailInput) {
  notifyBtn.addEventListener('click', () => {
    const email = emailInput.value.trim();
    if (!email || !email.includes('@')) {
      emailInput.classList.add('border-red-500');
      emailInput.focus();
      setTimeout(() => emailInput.classList.remove('border-red-500'), 2000);
      return;
    }
    notifyBtn.textContent = 'SUBSCRIBED ✓';
    notifyBtn.classList.remove('border-white/30', 'text-white');
    notifyBtn.classList.add('border-gold', 'text-gold');
    notifyBtn.disabled = true;
    emailInput.value = '';
    emailInput.disabled = true;
  });
}

// --- Smooth scroll for anchor links ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// --- Init on every page ---
document.addEventListener('DOMContentLoaded', () => {
  window.YurimioCart.updateAllCounts();
  window.YurimioAuth.updateNav();
});
