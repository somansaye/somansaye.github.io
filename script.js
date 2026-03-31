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
  if (!form || !submitButton || form.dataset.enhanced === 'true') return;
  form.dataset.enhanced = 'true';
  const defaultButtonText = submitButton.textContent;

  const resetForm = () => {
    form.classList.remove('is-success');
    form.reset();
    submitButton.disabled = false;
    submitButton.classList.remove('is-success');
    submitButton.classList.remove('is-flip');
    submitButton.textContent = defaultButtonText;
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

      window.setTimeout(() => {
        form.classList.add('is-success');
        submitButton.classList.remove('is-flip');
        void submitButton.offsetWidth;
        submitButton.classList.add('is-flip');
        submitButton.classList.add('is-success');
        submitButton.textContent = 'Thanks! Form submitted successfully.';
      }, 50);
      window.setTimeout(resetForm, 3600);
    } catch (error) {
      window.alert('There was a problem submitting the form. Please call or email us directly.');
      submitButton.disabled = false;
    }
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
  });

  submitButton.addEventListener('click', submitForm);
}

function initMobileCallBar() {
  const callBar = document.querySelector('.call-bar');
  const floatingButton = document.querySelector('.call-button');
  const hero = document.querySelector('.hero');
  const contact = document.querySelector('.contact-section');
  if (!callBar || !hero || !contact) return;

  const mobileQuery = window.matchMedia('(max-width: 720px)');

  const updateBar = () => {
    const contactTop = contact.offsetTop - 140;
    const contactReached = window.scrollY >= contactTop;
    const heroRect = hero.getBoundingClientRect();
    const triggerPoint = heroRect.height * 0.45;
    const pastHero = heroRect.bottom <= triggerPoint;

    if (!mobileQuery.matches) {
      callBar.classList.remove('is-visible', 'is-hidden');
      if (floatingButton) {
        floatingButton.classList.toggle('is-hidden', contactReached);
      }
      return;
    }

    if (floatingButton) {
      floatingButton.classList.add('is-hidden');
    }

    if (contactReached) {
      callBar.classList.remove('is-visible');
      callBar.classList.add('is-hidden');
    } else if (pastHero) {
      callBar.classList.remove('is-hidden');
      callBar.classList.add('is-visible');
    } else {
      callBar.classList.remove('is-visible');
      callBar.classList.remove('is-hidden');
    }
  };

  updateBar();
  window.addEventListener('scroll', updateBar, { passive: true });
  window.addEventListener('resize', updateBar);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initContactForm();
    initMobileCallBar();
  });
} else {
  initMobileMenu();
  initContactForm();
  initMobileCallBar();
}
