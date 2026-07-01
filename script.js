// FASE 3: stub mínimo. La interactividad completa entra en FASE 4.
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('[data-site-header]');
  if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
});
