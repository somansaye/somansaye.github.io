// Mobile menu toggle
function initMobileMenu() {
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
}

function initContactForm() {
  const form = document.getElementById('contact-form');
  const submitButton = document.getElementById('contact-form-submit');
  const status = document.getElementById('form-status');
  if (!form || !submitButton || !status || form.dataset.enhanced === 'true') return;
  form.dataset.enhanced = 'true';
  const fields = form.querySelector('.form-fields');
  const firstInput = form.querySelector('input, textarea');
  let resetTimer = null;

  const resetFormState = () => {
    if (resetTimer) {
      window.clearTimeout(resetTimer);
      resetTimer = null;
    }
    form.classList.remove('is-submitted');
    status.classList.remove('is-fading');
    status.hidden = true;
    submitButton.disabled = false;
    if (firstInput) firstInput.focus();
  };

  resetFormState();

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    submitButton.disabled = true;

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Submission failed');
      }

      form.classList.add('is-submitted');
      status.classList.remove('is-fading');
      status.hidden = false;
      form.reset();
      window.setTimeout(() => {
        status.classList.add('is-fading');
      }, 1800);
      resetTimer = window.setTimeout(() => {
        resetFormState();
      }, 2600);
    } catch (error) {
      window.alert('There was a problem submitting the form. Please call or email us directly.');
    } finally {
      if (!form.classList.contains('is-submitted')) {
        submitButton.disabled = false;
      }
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initContactForm();
  });
} else {
  initMobileMenu();
  initContactForm();
}
