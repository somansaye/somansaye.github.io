// Mobile menu toggle
document.addEventListener('DOMContentLoaded', () => {
  const btn  = document.querySelector('.hamburger');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;

  const openMenu = (open) => {
    document.body.classList.toggle('menu-open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  };

  btn.addEventListener('click', () => {
    const isOpen = !document.body.classList.contains('menu-open');
    openMenu(isOpen);
  });

  // Close when a nav link is clicked
  menu.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') openMenu(false);
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') openMenu(false);
  });

  // Close if you click outside the menu
  document.addEventListener('click', (e) => {
    if (!document.body.classList.contains('menu-open')) return;
    const inside = e.target.closest('.nav') || e.target.closest('.hamburger');
    if (!inside) openMenu(false);
  });
});
// No JS required; FAQ uses <details> for native toggle.
