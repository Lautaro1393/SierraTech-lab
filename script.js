(() => {
  'use strict';

  const STORAGE_KEY = 'sierratech-theme';
  const root = document.documentElement;

  // ============================================================
  // 1. THEME TOGGLE
  // ============================================================
  function updateToggleLabel(theme) {
    const btn = document.querySelector('[data-theme-toggle]');
    if (!btn) return;
    const next = theme === 'dark' ? 'claro' : 'oscuro';
    btn.setAttribute('aria-label', `Cambiar a modo ${next}`);
  }

  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem(STORAGE_KEY, theme); } catch (_) {}
    updateToggleLabel(theme);
  }

  function bindThemeToggle() {
    const btn = document.querySelector('[data-theme-toggle]');
    if (!btn) return;
    updateToggleLabel(root.getAttribute('data-theme') || 'dark');
    btn.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') || 'dark';
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  // ============================================================
  // 2. STICKY HEADER (is-scrolled)
  // ============================================================
  function bindStickyHeader() {
    const header = document.querySelector('[data-site-header]');
    if (!header) return;
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ============================================================
  // 3. MOBILE MENU
  // ============================================================
  function focusableIn(el) {
    return Array.from(el.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    ));
  }

  function bindMobileMenu() {
    const sheet = document.querySelector('[data-mobile-menu]');
    const trigger = document.querySelector('[data-menu-trigger]');
    if (!sheet || !trigger) return;

    let lastFocus = null;

    function open() {
      lastFocus = document.activeElement;
      sheet.hidden = false;
      trigger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      const first = focusableIn(sheet)[0];
      if (first) first.focus();
      document.addEventListener('keydown', onKey);
    }

    function close() {
      sheet.hidden = true;
      trigger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
      if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
    }

    function onKey(e) {
      if (e.key === 'Escape') { e.preventDefault(); close(); return; }
      if (e.key !== 'Tab') return;
      const items = focusableIn(sheet);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    }

    trigger.addEventListener('click', () => (sheet.hidden ? open() : close()));
    sheet.querySelectorAll('[data-menu-close], [data-menu-link]').forEach(el => {
      el.addEventListener('click', close);
    });
  }

  // ============================================================
  // 4. SMOOTH SCROLL FALLBACK
  // ============================================================
  function bindSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        if (!id || id === '#' || id.length < 2) return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.replaceState(null, '', id);
      });
    });
  }

  // ============================================================
  // 5. HERO CTAs → activate portfolio tab
  // ============================================================
  function bindHeroCtas() {
    document.querySelectorAll('[data-cta]').forEach(a => {
      a.addEventListener('click', () => {
        const target = a.dataset.cta;
        if (target === 'hardware' || target === 'software') {
          // Wait for scroll to portafolio, then set tab
          setTimeout(() => setActiveTab(target), 350);
        }
      });
    });
  }

  // ============================================================
  // 6. PORTAFOLIO: FETCH + RENDER
  // ============================================================
  const gridHw = document.querySelector('[data-grid="hardware"]');
  const gridSw = document.querySelector('[data-grid="software"]');
  const tabs = Array.from(document.querySelectorAll('[data-tab]'));
  const panels = {
    hardware: document.querySelector('[data-panel="hardware"]'),
    software: document.querySelector('[data-panel="software"]'),
  };
  let portfolio = null;

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => (
      { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    ));
  }

  function formatDate(iso) {
    try {
      return new Intl.DateTimeFormat('es-AR', { year: 'numeric', month: 'short' })
        .format(new Date(iso));
    } catch (_) { return iso; }
  }

  function renderHardwareCard(item) {
    const cover = item.fotos[0];
    const titleId = `pc-title-${escapeHtml(item.id)}`;
    return `
      <article class="portfolio-card" tabindex="0" role="button"
        aria-labelledby="${titleId}"
        data-item-id="${escapeHtml(item.id)}">
        <div class="portfolio-card__cover">
          <img src="${escapeHtml(cover.src)}" alt="${escapeHtml(cover.alt)}"
            loading="lazy" decoding="async" width="400" height="300">
        </div>
        <div class="portfolio-card__body">
          <h3 id="${titleId}" class="portfolio-card__title">${escapeHtml(item.titulo)}</h3>
          <div class="portfolio-card__meta">
            <span class="dot dot--accent"></span>
            <span>${escapeHtml(item.categoria)}</span>
            <span aria-hidden="true">·</span>
            <time datetime="${escapeHtml(item.fecha)}">${formatDate(item.fecha)}</time>
          </div>
        </div>
      </article>`;
  }

  function renderSoftwareCard(item) {
    const titleId = `pc-title-${escapeHtml(item.id)}`;
    return `
      <article class="portfolio-card" tabindex="0" role="button"
        aria-labelledby="${titleId}"
        data-item-id="${escapeHtml(item.id)}">
        <div class="portfolio-card__cover">
          <img src="${escapeHtml(item.cover)}" alt="${escapeHtml(item.titulo)}"
            loading="lazy" decoding="async" width="400" height="300">
        </div>
        <div class="portfolio-card__body">
          <h3 id="${titleId}" class="portfolio-card__title">${escapeHtml(item.titulo)}</h3>
          <div class="portfolio-card__stack">
            ${item.stack.map(s => `<span class="chip">${escapeHtml(s)}</span>`).join('')}
          </div>
          <div class="portfolio-card__meta">
            <span class="dot dot--accent"></span>
            <span>${escapeHtml(item.categoria)}</span>
            <span aria-hidden="true">·</span>
            <time datetime="${escapeHtml(item.fecha)}">${formatDate(item.fecha)}</time>
          </div>
        </div>
      </article>`;
  }

  function renderError(target, msg) {
    target.innerHTML = `<p class="portfolio-empty">${escapeHtml(msg)}</p>`;
    target.setAttribute('aria-busy', 'false');
  }

  function renderPortfolio() {
    if (!portfolio || !portfolio.items) return;
    const hardware = portfolio.items.filter(i => i.tipo === 'hardware');
    const software = portfolio.items.filter(i => i.tipo === 'software');

    gridHw.innerHTML = hardware.length
      ? hardware.map(renderHardwareCard).join('')
      : '<p class="portfolio-empty">No hay reparaciones para mostrar.</p>';
    gridSw.innerHTML = software.length
      ? software.map(renderSoftwareCard).join('')
      : '<p class="portfolio-empty">No hay proyectos para mostrar.</p>';

    gridHw.setAttribute('aria-busy', 'false');
    gridSw.setAttribute('aria-busy', 'false');

    // Tab counters
    const counterHw = document.querySelector('[data-tab="hardware"] [data-tab-count]');
    const counterSw = document.querySelector('[data-tab="software"] [data-tab-count]');
    if (counterHw) counterHw.textContent = hardware.length;
    if (counterSw) counterSw.textContent = software.length;

    // Bind card click + keyboard
    document.querySelectorAll('.portfolio-card').forEach(card => {
      const id = card.dataset.itemId;
      card.addEventListener('click', () => openLightbox(id));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(id);
        }
      });
    });
  }

  async function loadPortfolio() {
    try {
      const res = await fetch('./data/portfolio.json', { cache: 'no-cache' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      portfolio = await res.json();
      renderPortfolio();
    } catch (err) {
      console.error('Error cargando portafolio:', err);
      if (gridHw) renderError(gridHw, 'No se pudieron cargar las reparaciones.');
      if (gridSw) renderError(gridSw, 'No se pudieron cargar los proyectos.');
    }
  }

  // ============================================================
  // 7. TABS
  // ============================================================
  function setActiveTab(name) {
    if (!panels[name]) return;
    const isHw = name === 'hardware';
    tabs.forEach((t, i) => {
      const active = t.dataset.tab === name;
      t.setAttribute('aria-selected', String(active));
      t.tabIndex = active ? 0 : -1;
    });
    panels.hardware.hidden = !isHw;
    panels.software.hidden = isHw;
    const newHash = isHw ? '#portafolio' : '#portafolio/software';
    if (location.hash !== newHash) history.replaceState(null, '', newHash);
  }

  function bindTabs() {
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => setActiveTab(tab.dataset.tab));
      tab.addEventListener('keydown', (e) => {
        let target;
        if (e.key === 'ArrowRight') target = tabs[(i + 1) % tabs.length];
        if (e.key === 'ArrowLeft') target = tabs[(i - 1 + tabs.length) % tabs.length];
        if (e.key === 'Home') target = tabs[0];
        if (e.key === 'End') target = tabs[tabs.length - 1];
        if (target) {
          e.preventDefault();
          target.focus();
          setActiveTab(target.dataset.tab);
        }
      });
    });
    // Init from URL
    if (location.hash === '#portafolio/software') setActiveTab('software');
  }

  // ============================================================
  // 8. LIGHTBOX
  // ============================================================
  const lightbox = document.getElementById('lightbox');
  const lbImage = lightbox && lightbox.querySelector('[data-lb-image]');
  const lbTitle = lightbox && lightbox.querySelector('[data-lb-title]');
  const lbCategory = lightbox && lightbox.querySelector('[data-lb-category]');
  const lbMeta = lightbox && lightbox.querySelector('[data-lb-meta]');
  const lbDesc = lightbox && lightbox.querySelector('[data-lb-desc]');
  const lbCounter = lightbox && lightbox.querySelector('[data-lb-counter]');
  const lbLinks = lightbox && lightbox.querySelector('[data-lb-links]');
  const lbPrev = lightbox && lightbox.querySelector('[data-lightbox-prev]');
  const lbNext = lightbox && lightbox.querySelector('[data-lightbox-next]');

  let currentItem = null;
  let currentIndex = 0;
  let lastFocusedTrigger = null;
  let touchStartX = 0;

  function mediaOf(item) {
    if (item.tipo === 'hardware') return item.fotos.map(f => ({ src: f.src, alt: f.alt }));
    return [{ src: item.cover, alt: item.titulo }];
  }

  function renderLightbox() {
    if (!currentItem) return;
    const media = mediaOf(currentItem);
    const current = media[currentIndex];

    lbImage.src = current.src;
    lbImage.alt = current.alt;
    lbTitle.textContent = currentItem.titulo;
    lbCategory.textContent = currentItem.categoria;
    lbMeta.innerHTML = `
      <span class="dot dot--accent"></span>
      <span>${escapeHtml(currentItem.categoria)}</span>
      <span aria-hidden="true">·</span>
      <time datetime="${escapeHtml(currentItem.fecha)}">${formatDate(currentItem.fecha)}</time>`;
    lbDesc.innerHTML = (currentItem.descripcionLarga || '')
      .split(/\n\s*\n/)
      .map(p => `<p>${escapeHtml(p)}</p>`)
      .join('');

    const hasMultiple = media.length > 1;
    lbCounter.textContent = `${currentIndex + 1} / ${media.length}`;
    lbCounter.hidden = !hasMultiple;
    lbPrev.hidden = !hasMultiple;
    lbNext.hidden = !hasMultiple;

    if (currentItem.tipo === 'software' && currentItem.links) {
      lbLinks.innerHTML = `
        <a href="${escapeHtml(currentItem.links.deploy)}" target="_blank" rel="noopener noreferrer" class="btn btn--primary">
          Ver deploy
          <svg class="icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17L17 7M7 7h10v10"/></svg>
        </a>
        <a href="${escapeHtml(currentItem.links.repo)}" target="_blank" rel="noopener noreferrer" class="btn btn--secondary">
          Ver repo
          <svg class="icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17L17 7M7 7h10v10"/></svg>
        </a>`;
      lbLinks.hidden = false;
    } else {
      lbLinks.hidden = true;
      lbLinks.innerHTML = '';
    }
  }

  function openLightbox(itemId) {
    if (!portfolio) return;
    currentItem = portfolio.items.find(i => i.id === itemId);
    if (!currentItem) return;
    currentIndex = 0;
    lastFocusedTrigger = document.activeElement;

    renderLightbox();
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';

    const firstBtn = lightbox.querySelector('.lightbox__close');
    if (firstBtn) firstBtn.focus();

    document.addEventListener('keydown', onLightboxKey);
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.hidden = true;
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onLightboxKey);
    if (lastFocusedTrigger && typeof lastFocusedTrigger.focus === 'function') {
      lastFocusedTrigger.focus();
    }
  }

  function navigateLightbox(delta) {
    if (!currentItem) return;
    const media = mediaOf(currentItem);
    currentIndex = (currentIndex + delta + media.length) % media.length;
    renderLightbox();
  }

  function onLightboxKey(e) {
    if (e.key === 'Escape') { e.preventDefault(); closeLightbox(); return; }
    if (e.key === 'ArrowLeft') { e.preventDefault(); navigateLightbox(-1); return; }
    if (e.key === 'ArrowRight') { e.preventDefault(); navigateLightbox(1); return; }
    if (e.key === 'Tab') {
      const items = focusableIn(lightbox);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    }
  }

  function bindLightbox() {
    if (!lightbox) return;
    lightbox.querySelectorAll('[data-lightbox-close]').forEach(el => {
      el.addEventListener('click', closeLightbox);
    });
    if (lbPrev) lbPrev.addEventListener('click', () => navigateLightbox(-1));
    if (lbNext) lbNext.addEventListener('click', () => navigateLightbox(1));

    // Swipe
    lightbox.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });
    lightbox.addEventListener('touchend', (e) => {
      const deltaX = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(deltaX) > 50) navigateLightbox(deltaX > 0 ? -1 : 1);
    }, { passive: true });
  }

  // ============================================================
  // 9. INIT
  // ============================================================
  document.addEventListener('DOMContentLoaded', () => {
    bindThemeToggle();
    bindStickyHeader();
    bindMobileMenu();
    bindSmoothScroll();
    bindHeroCtas();
    bindTabs();
    bindLightbox();
    loadPortfolio();
  });
})();
