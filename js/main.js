/* =============================================
   Yurimio — Shared JavaScript
   ============================================= */

/* ---------- Cart (localStorage) ---------- */
window.YurimioCart = {
  _key: 'yurimio_cart',
  get() {
    try { return JSON.parse(localStorage.getItem(this._key)) || []; }
    catch { return []; }
  },
  save(items) {
    localStorage.setItem(this._key, JSON.stringify(items));
  },
  add(item) {
    const items = this.get();
    const existing = items.find(i => i.id === item.id);
    if (existing) {
      existing.qty = Math.min(10, existing.qty + item.qty);
    } else {
      items.push({ id: item.id, name: item.name, price: item.price, image: item.image, qty: item.qty });
    }
    this.save(items);
  },
  updateAllCounts() {
    const items = this.get();
    const total = items.reduce((sum, i) => sum + i.qty, 0);
    document.querySelectorAll('.cart-count').forEach(el => { el.textContent = total; });
  }
};

/* ---------- Auth (localStorage demo) ---------- */
window.YurimioAuth = {
  _userKey: 'yurimio_user',
  _accountsKey: 'yurimio_accounts',

  getUser() {
    try { return JSON.parse(localStorage.getItem(this._userKey)); }
    catch { return null; }
  },

  _getAccounts() {
    try { return JSON.parse(localStorage.getItem(this._accountsKey)) || []; }
    catch { return []; }
  },

  createAccount(name, email, password) {
    const accounts = this._getAccounts();
    if (accounts.find(a => a.email === email)) {
      return { error: 'An account with this email already exists.' };
    }
    const user = { name, email, password };
    accounts.push(user);
    localStorage.setItem(this._accountsKey, JSON.stringify(accounts));
    const safeUser = { name, email };
    localStorage.setItem(this._userKey, JSON.stringify(safeUser));
    return { user: safeUser };
  },

  signIn(email, password) {
    const accounts = this._getAccounts();
    const account = accounts.find(a => a.email === email && a.password === password);
    if (!account) return { error: 'Invalid email or password.' };
    const safeUser = { name: account.name, email: account.email };
    localStorage.setItem(this._userKey, JSON.stringify(safeUser));
    return { user: safeUser };
  },

  signOut() {
    localStorage.removeItem(this._userKey);
  },

  updateNavLinks() {
    const user = this.getUser();
    document.querySelectorAll('.nav-auth-link').forEach(link => {
      if (user) {
        link.textContent = user.name.split(' ')[0];
        link.href = 'login.html';
      } else {
        link.textContent = 'Sign In';
        link.href = 'login.html';
      }
    });
  }
};

/* ---------- DOM Ready ---------- */
document.addEventListener('DOMContentLoaded', () => {

  /* --- Cart badge --- */
  window.YurimioCart.updateAllCounts();

  /* --- Auth nav update --- */
  window.YurimioAuth.updateNavLinks();

  /* --- Mobile menu --- */
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  /* --- Navbar scroll effect --- */
  const nav = document.getElementById('main-nav');
  if (nav) {
    const onScroll = () => {
      if (window.scrollY > 40) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* --- Scroll reveal animations --- */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealEls.forEach(el => revealObserver.observe(el));
  }

  /* --- Video autoplay on scroll --- */
  const video = document.getElementById('showcase-video');
  if (video) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    }, { threshold: 0.25 });

    videoObserver.observe(video);
  }

  /* --- Email notify button --- */
  const notifyBtn = document.getElementById('notify-btn');
  const emailInput = document.getElementById('email-input');
  if (notifyBtn && emailInput) {
    notifyBtn.addEventListener('click', () => {
      const email = emailInput.value.trim();
      if (!email || !email.includes('@')) {
        notifyBtn.textContent = 'ENTER A VALID EMAIL';
        notifyBtn.classList.add('text-red-400', 'border-red-400/50');
        setTimeout(() => {
          notifyBtn.textContent = 'NOTIFY ME';
          notifyBtn.classList.remove('text-red-400', 'border-red-400/50');
        }, 2000);
        return;
      }
      notifyBtn.textContent = 'YOU\'RE ON THE LIST';
      notifyBtn.classList.remove('hover:border-gold', 'hover:text-gold');
      notifyBtn.classList.add('border-gold', 'text-gold');
      emailInput.value = '';
      emailInput.disabled = true;
      notifyBtn.disabled = true;
    });
  }
});
