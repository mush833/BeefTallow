/*
  SHOPIFY PAGE MAPPING: assets/theme.js
  Shared JavaScript for ALL pages in the Vallore Shopify theme.
  Referenced in layout/theme.liquid — applies globally.

  Features:
  - Mobile nav drawer open/close
  - FAQ accordion
  - Reviews carousel with auto-play
  - Bundle tier selector (product page)
  - Sticky ATC bar (product page)
  - Countdown timer (optional)
  - Thumbnail gallery switcher (product page)
*/

(function () {
  'use strict';

  // ============================================
  // MOBILE NAV DRAWER
  // ============================================
  function initNavDrawer() {
    const toggle = document.querySelector('.nav-toggle');
    const drawer = document.querySelector('.nav-drawer');
    const closeBtn = document.querySelector('.nav-drawer__close');

    if (!toggle || !drawer) return;

    toggle.addEventListener('click', () => {
      drawer.classList.add('open');
      document.body.style.overflow = 'hidden';
    });

    function closeDrawer() {
      drawer.classList.remove('open');
      document.body.style.overflow = '';
    }

    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

    drawer.addEventListener('click', (e) => {
      if (e.target === drawer) closeDrawer();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeDrawer();
    });
  }

  // ============================================
  // FAQ ACCORDION
  // ============================================
  function initFAQ() {
    const items = document.querySelectorAll('.faq-item');
    if (!items.length) return;

    items.forEach(item => {
      const trigger = item.querySelector('.faq-trigger');
      if (!trigger) return;

      trigger.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        // Close all
        items.forEach(i => i.classList.remove('open'));
        // Open clicked if it was closed
        if (!isOpen) item.classList.add('open');
      });
    });
  }

  // ============================================
  // REVIEWS CAROUSEL
  // ============================================
  function initReviewsCarousel() {
    const car = document.querySelector('.revcar');
    const track = document.querySelector('.revtrack');
    const dots = document.querySelectorAll('.revdot');

    if (!car || !track) return;

    const cards = track.querySelectorAll('.review-card');
    if (!cards.length) return;

    let current = 0;
    let autoTimer = null;

    function getCardWidth() {
      const card = cards[0];
      const style = window.getComputedStyle(track);
      const gap = parseFloat(style.gap) || 20;
      return card.offsetWidth + gap;
    }

    function goTo(idx) {
      const max = cards.length - 1;
      current = Math.max(0, Math.min(idx, max));
      track.style.transform = `translateX(-${current * getCardWidth()}px)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        goTo(i);
        resetAuto();
      });
    });

    function next() {
      goTo(current < cards.length - 1 ? current + 1 : 0);
    }

    function resetAuto() {
      clearInterval(autoTimer);
      autoTimer = setInterval(next, 3500);
    }

    // Touch swipe
    let touchStartX = 0;
    track.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? next() : goTo(current - 1);
        resetAuto();
      }
    }, { passive: true });

    goTo(0);
    resetAuto();
  }

  // ============================================
  // BUNDLE TIER SELECTOR (Product Page)
  // ============================================
  function initBundleTiers() {
    const tiers = document.querySelectorAll('.bundle-tier');
    const addBtn = document.querySelector('.btn-add-to-cart');

    if (!tiers.length) return;

    tiers.forEach(tier => {
      tier.addEventListener('click', () => {
        tiers.forEach(t => t.classList.remove('active'));
        tier.classList.add('active');

        // Update add-to-cart price display
        const price = tier.dataset.price;
        const originalPrice = tier.dataset.originalPrice;
        if (addBtn && price) {
          const priceEl = addBtn.querySelector('.atc-price');
          if (priceEl) priceEl.textContent = `$${price}`;
        }

        // Update Shopify variant ID for form submission
        const variantId = tier.dataset.variantId;
        const variantInput = document.querySelector('input[name="id"]');
        if (variantInput && variantId) {
          variantInput.value = variantId;
        }
      });
    });

    // Activate first tier by default
    if (tiers[0]) tiers[0].click();
  }

  // ============================================
  // STICKY ATC BAR (Product Page)
  // ============================================
  function initStickyATC() {
    const stickyBar = document.querySelector('.sticky-atc');
    const buyBox = document.querySelector('.pdp-buy');

    if (!stickyBar || !buyBox) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        stickyBar.classList.toggle('visible', !entry.isIntersecting);
      },
      { threshold: 0.1, rootMargin: '0px 0px -20px 0px' }
    );

    observer.observe(buyBox);
  }

  // ============================================
  // THUMBNAIL GALLERY (Product Page)
  // ============================================
  function initGallery() {
    const thumbs = document.querySelectorAll('.pdp-gallery__thumb');
    const mainImg = document.querySelector('.pdp-gallery__main img');

    if (!thumbs.length || !mainImg) return;

    thumbs.forEach(thumb => {
      thumb.addEventListener('click', () => {
        thumbs.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        const src = thumb.dataset.src || thumb.querySelector('img')?.src;
        if (src) mainImg.src = src;
      });
    });
  }

  // ============================================
  // QUANTITY SELECTOR
  // ============================================
  function initQtySelector() {
    document.querySelectorAll('.qty-selector').forEach(selector => {
      const display = selector.querySelector('.qty-num');
      const minus = selector.querySelector('.qty-btn--minus');
      const plus = selector.querySelector('.qty-btn--plus');
      const input = selector.querySelector('input[name="quantity"]');

      if (!display) return;

      let qty = parseInt(display.textContent) || 1;

      function update(val) {
        qty = Math.max(1, val);
        display.textContent = qty;
        if (input) input.value = qty;
      }

      if (minus) minus.addEventListener('click', () => update(qty - 1));
      if (plus) plus.addEventListener('click', () => update(qty + 1));
    });
  }

  // ============================================
  // COUNTDOWN TIMER (optional urgency)
  // ============================================
  function initCountdown() {
    const els = document.querySelectorAll('.countdown');
    if (!els.length) return;

    // Set end time 24 hours from page load (resets on reload — urgency only)
    const end = Date.now() + 24 * 60 * 60 * 1000;

    setInterval(() => {
      const remaining = Math.max(0, end - Date.now());
      const h = Math.floor(remaining / 3600000);
      const m = Math.floor((remaining % 3600000) / 60000);
      const s = Math.floor((remaining % 60000) / 1000);
      const str = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
      els.forEach(el => { el.textContent = str; });
    }, 1000);
  }

  // ============================================
  // CART ITEM QUANTITY UPDATE (Cart Page)
  // ============================================
  function initCartPage() {
    // Shopify cart form handling
    const cartForm = document.querySelector('form[action="/cart"]');
    if (!cartForm) return;

    // Allow native Shopify form submit with updated quantities
  }

  // ============================================
  // HERO CTA SMOOTH SCROLL (Homepage)
  // ============================================
  function initHeroCTA() {
    const ctaBtn = document.querySelector('.hero-cta-scroll');
    if (!ctaBtn) return;
    ctaBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector('.agitation') || document.querySelector('#product-section');
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // ============================================
  // BEFORE/AFTER IMAGE HOVER (Product Page)
  // ============================================
  function initBeforeAfter() {
    // Handled via CSS hover states
  }

  // ============================================
  // INIT ALL
  // ============================================
  document.addEventListener('DOMContentLoaded', () => {
    initNavDrawer();
    initFAQ();
    initReviewsCarousel();
    initBundleTiers();
    initStickyATC();
    initGallery();
    initQtySelector();
    initCountdown();
    initCartPage();
    initHeroCTA();
    initBeforeAfter();
  });

})();
