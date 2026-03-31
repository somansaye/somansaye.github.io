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

function initAnchorScroll() {
  const header = document.querySelector('.header');
  if (!header) return;

  const getAnchorTarget = (target) => {
    if (!target) return null;
    return target.querySelector('h1, h2, h3, .eyebrow, .container > *') || target;
  };

  const scrollToHash = (hash) => {
    const target = document.querySelector(hash);
    if (!target) return;
    const headerHeight = header.getBoundingClientRect().height;
    const anchorTarget = getAnchorTarget(target);
    const extraOffset = window.matchMedia('(max-width: 720px)').matches ? 20 : 8;
    const top = anchorTarget.getBoundingClientRect().top + window.scrollY - headerHeight - extraOffset;
    window.scrollTo({
      top: Math.max(0, top),
      behavior: 'smooth',
    });
  };

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const hash = link.getAttribute('href');
      if (!hash || hash === '#') return;
      const target = document.querySelector(hash);
      if (!target) return;
      event.preventDefault();
      history.replaceState(null, '', hash);
      scrollToHash(hash);
    });
  });
}

function initTopReset() {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  const resetToTop = () => {
    if (!window.location.hash || window.location.hash === '#top') {
      if (window.location.hash === '#top') {
        history.replaceState(null, '', window.location.pathname + window.location.search);
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }
  };

  window.addEventListener('load', resetToTop);
  window.addEventListener('pageshow', resetToTop);
  window.setTimeout(resetToTop, 0);
  resetToTop();
}

function initMobileCallBar() {
  const callBar = document.querySelector('.call-bar');
  const floatingButton = document.querySelector('.call-button');
  const hero = document.querySelector('.hero');
  const contact = document.querySelector('.contact-section');
  if (!callBar || !hero || !contact) return;

  const mobileQuery = window.matchMedia('(max-width: 720px)');
  let heroPassed = false;

  const render = () => {
    const contactRect = contact.getBoundingClientRect();
    const contactVisible = contactRect.top < window.innerHeight * 0.8 && contactRect.bottom > 0;

    if (!mobileQuery.matches) {
      callBar.classList.remove('is-visible', 'is-hidden');
      if (floatingButton) {
        floatingButton.classList.toggle('is-hidden', contactVisible);
      }
      return;
    }

    if (floatingButton) {
      floatingButton.classList.add('is-hidden');
    }

    if (contactVisible) {
      callBar.classList.remove('is-visible');
      callBar.classList.add('is-hidden');
    } else if (heroPassed) {
      callBar.classList.remove('is-hidden');
      callBar.classList.add('is-visible');
    } else {
      callBar.classList.remove('is-visible', 'is-hidden');
    }
  };

  const heroObserver = new IntersectionObserver(
    ([entry]) => {
      heroPassed = !entry.isIntersecting || entry.intersectionRatio < 0.45;
      render();
    },
    { threshold: [0.45] }
  );

  const contactObserver = new IntersectionObserver(
    ([entry]) => {
      render();
    },
    { threshold: [0.15] }
  );

  heroObserver.observe(hero);
  contactObserver.observe(contact);
  mobileQuery.addEventListener('change', render);
  window.addEventListener('scroll', render, { passive: true });
  window.addEventListener('resize', render);
  render();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initContactForm();
    initAnchorScroll();
    initTopReset();
    initMobileCallBar();
  });
} else {
  initMobileMenu();
  initContactForm();
  initAnchorScroll();
  initTopReset();
  initMobileCallBar();
}
