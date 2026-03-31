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

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  const popup = document.getElementById('form-popup');
  const closeBtn = document.getElementById('form-popup-close');
  const submitButton = document.getElementById('contact-form-submit');
  if (!form || !popup || !closeBtn || !submitButton) return;

  const closePopup = () => {
    popup.hidden = true;
  };

  const submitForm = async () => {
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

      form.reset();
      popup.hidden = false;
    } catch (error) {
      window.alert('There was a problem submitting the form. Please call or email us directly.');
    } finally {
      submitButton.disabled = false;
    }
  };

  closeBtn.addEventListener('click', closePopup);
  popup.addEventListener('click', (event) => {
    if (event.target === popup) closePopup();
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    submitForm();
  });

  submitButton.addEventListener('click', submitForm);
});
