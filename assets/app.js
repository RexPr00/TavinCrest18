(() => {
  const body = document.body;
  const mobileDrawer = document.querySelector('[data-mobile-drawer]');
  const openBtn = document.querySelector('[data-open-drawer]');
  const closeBtn = document.querySelector('[data-close-drawer]');
  const overlay = document.querySelector('[data-drawer-overlay]');
  let lastFocus = null;

  const focusables = () => (mobileDrawer
    ? mobileDrawer.querySelectorAll('a,button,[tabindex]:not([tabindex="-1"])')
    : []);

  function lockScroll(lock) {
    body.classList.toggle('no-scroll', lock);
  }

  function setDrawerA11y(isOpen) {
    openBtn?.setAttribute('aria-expanded', String(isOpen));
    mobileDrawer?.setAttribute('aria-hidden', String(!isOpen));
  }

  function openDrawer() {
    if (!mobileDrawer) return;
    lastFocus = document.activeElement;
    mobileDrawer.classList.add('open');
    lockScroll(true);
    setDrawerA11y(true);
    const first = focusables()[0];
    if (first) first.focus();
  }

  function closeDrawer() {
    if (!mobileDrawer?.classList.contains('open')) return;
    mobileDrawer.classList.remove('open');
    lockScroll(false);
    setDrawerA11y(false);
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
    else openBtn?.focus();
  }

  openBtn?.addEventListener('click', () => {
    if (mobileDrawer?.classList.contains('open')) closeDrawer();
    else openDrawer();
  });
  closeBtn?.addEventListener('click', closeDrawer);
  overlay?.addEventListener('click', closeDrawer);
  mobileDrawer?.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', closeDrawer);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDrawer();
      closePrivacy();
      closeLangMenu();
    }
    if (e.key === 'Tab' && mobileDrawer?.classList.contains('open')) {
      const nodes = Array.from(focusables());
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  const langDropdowns = document.querySelectorAll('.lang-dropdown');
  function closeLangMenu() {
    langDropdowns.forEach((dd) => {
      const menu = dd.querySelector('[data-lang-menu]');
      const toggle = dd.querySelector('[data-lang-toggle]');
      menu?.classList.remove('open');
      toggle?.setAttribute('aria-expanded', 'false');
    });
  }
  langDropdowns.forEach((dd) => {
    const toggle = dd.querySelector('[data-lang-toggle]');
    const menu = dd.querySelector('[data-lang-menu]');
    toggle?.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  });
  document.addEventListener('click', (e) => {
    if (![...langDropdowns].some((dd) => dd.contains(e.target))) closeLangMenu();
  });

  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const btn = item.querySelector('.faq-q');
    if (!btn) return;
    btn.setAttribute('aria-expanded', String(item.classList.contains('open')));
    btn.addEventListener('click', () => {
      faqItems.forEach((other) => {
        const otherBtn = other.querySelector('.faq-q');
        if (other !== item) {
          other.classList.remove('open');
          otherBtn?.setAttribute('aria-expanded', 'false');
        }
      });
      const isOpen = item.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(isOpen));
    });
  });

  const privacy = document.querySelector('[data-privacy-modal]');
  const openPrivacyBtn = document.querySelectorAll('[data-open-privacy]');
  const closePrivacyBtn = document.querySelectorAll('[data-close-privacy]');

  function openPrivacy() {
    privacy?.classList.add('open');
    lockScroll(true);
  }
  function closePrivacy() {
    if (!privacy?.classList.contains('open')) return;
    privacy.classList.remove('open');
    lockScroll(false);
  }

  openPrivacyBtn.forEach((btn) => btn.addEventListener('click', (e) => {
    e.preventDefault();
    openPrivacy();
  }));
  closePrivacyBtn.forEach((btn) => btn.addEventListener('click', closePrivacy));

  const reveals = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('show');
    });
  }, { threshold: 0.16 });
  reveals.forEach((el) => io.observe(el));

  setDrawerA11y(false);
})();
