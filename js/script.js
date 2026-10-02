const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const body = document.body;
const cursor = document.querySelector('.cursor');
const progressBar = document.querySelector('.scroll-progress');
const fits = document.querySelectorAll('.fallback-image');
const navLinks = document.querySelectorAll('.main-nav a');
const sections = document.querySelectorAll('main section[id]');
const revealItems = document.querySelectorAll('.reveal');
const projectCards = document.querySelectorAll('.project-card');
const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('.main-nav');
const bgWord = document.querySelector('.bg-word');
const langButtons = document.querySelectorAll('.lang-option');

const setFallbackPlaceholder = (img) => {
  const next = img.nextElementSibling;
  if (next && next.classList && next.classList.contains('profile-placeholder')) {
    next.style.display = 'flex';
  }
  if (next && next.classList && next.classList.contains('project-placeholder')) {
    next.style.display = 'flex';
  }
  if (next && next.classList && next.classList.contains('achievement-placeholder')) {
    next.style.display = 'flex';
  }
  if (next && next.classList && next.classList.contains('certificate-placeholder')) {
    next.style.display = 'flex';
  }
};

const handleImageError = (img) => {
    if (img.dataset.fallbackSrc && img.src !== new URL(img.dataset.fallbackSrc, window.location.href).href) {
      img.src = img.dataset.fallbackSrc;
      return;
    }
    setFallbackPlaceholder(img);
};

fits.forEach((img) => {
  img.addEventListener('error', () => handleImageError(img));
  if (img.complete && img.naturalWidth === 0) {
    handleImageError(img);
  }
});

if (!prefersReducedMotion && cursor) {
  const updateCursor = (event) => {
    const { clientX, clientY } = event;
    cursor.style.left = `${clientX}px`;
    cursor.style.top = `${clientY}px`;
  };

  window.addEventListener('pointermove', updateCursor, { passive: true });
  window.addEventListener('pointerenter', () => cursor.classList.add('is-visible'));
  window.addEventListener('pointerleave', () => cursor.classList.remove('is-visible'));

  document.querySelectorAll('a, button, .project-card, .skill-card, .certificate-item').forEach((element) => {
    element.addEventListener('mouseenter', () => cursor.classList.add('is-active'));
    element.addEventListener('mouseleave', () => cursor.classList.remove('is-active'));
  });

  cursor.classList.add('is-visible');
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute('id');
      navLinks.forEach((link) => {
        const isActive = link.getAttribute('href') === `#${id}`;
        link.classList.toggle('is-active', isActive);
      });
    });
  },
  { threshold: 0.5 }
);

sections.forEach((section) => sectionObserver.observe(section));

window.addEventListener('scroll', () => {
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  const scrollProgress = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
  if (progressBar) {
    progressBar.style.width = `${scrollProgress}%`;
  }
});

const words = document.querySelectorAll('.word');
if (words.length > 0 && !prefersReducedMotion) {
  let wordIndex = 0;
  setInterval(() => {
    words.forEach((word, index) => {
      word.classList.toggle('is-visible', index === wordIndex);
    });
    wordIndex = (wordIndex + 1) % words.length;
  }, 1800);
}

const parallaxItems = document.querySelectorAll('.parallax-item');
window.addEventListener('pointermove', (event) => {
  const x = (event.clientX / window.innerWidth - 0.5) * 2;
  const y = (event.clientY / window.innerHeight - 0.5) * 2;

  document.documentElement.style.setProperty('--mouse-x', `${(event.clientX / window.innerWidth) * 100}%`);
  document.documentElement.style.setProperty('--mouse-y', `${(event.clientY / window.innerHeight) * 100}%`);

  if (bgWord) {
    bgWord.style.transform = `translate3d(${x * 18}px, ${y * 20}px, 0) translateX(-50%)`;
  }

  parallaxItems.forEach((item) => {
    const speed = Number(item.dataset.speed || 0.08);
    const offsetX = x * 18 * speed;
    const offsetY = y * 22 * speed;
    item.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
  });
});

window.addEventListener('pointerleave', () => {
  document.documentElement.style.setProperty('--mouse-x', '50%');
  document.documentElement.style.setProperty('--mouse-y', '50%');
  if (bgWord) {
    bgWord.style.transform = 'translate3d(0, 0, 0) translateX(-50%)';
  }
  parallaxItems.forEach((item) => {
    item.style.transform = '';
  });
});

if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const modal = document.querySelector('.certificate-modal');
const modalImage = document.querySelector('.modal-image');
const closeModalBtn = document.querySelector('.modal-close');
const modalBackdrop = document.querySelector('.modal-backdrop');

const openModal = (imageSrc, title) => {
  if (!modal || !modalImage) return;
  modalImage.src = imageSrc;
  modalImage.alt = title;
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  body.style.overflow = 'hidden';
};

const closeModal = () => {
  if (!modal) return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  body.style.overflow = '';
};

const bindCertificateItem = (item) => {
  const image = item.querySelector('img');
  const viewButton = item.querySelector('.certificate-view');
  if (viewButton) {
    viewButton.hidden = !image?.naturalWidth;
    image?.addEventListener('load', () => {
      viewButton.hidden = false;
    });
  }

  const openCertificate = () => {
    if (!image?.naturalWidth) return;
    const src = image.currentSrc || image.src;
    openModal(src, item.dataset.title || 'Certificate');
  };

  item.addEventListener('click', openCertificate);
};

document.querySelectorAll('.certificate-item').forEach(bindCertificateItem);

const certificatesMore = document.querySelector('.certificates-more');
const certificatesAll = document.querySelector('.certificates-all');

if (certificatesMore && certificatesAll) {
  certificatesMore.addEventListener('click', () => {
    const isOpen = certificatesMore.getAttribute('aria-expanded') === 'true';
    certificatesMore.setAttribute('aria-expanded', String(!isOpen));
    certificatesAll.hidden = isOpen;
    certificatesAll.classList.toggle('is-visible', !isOpen);
  });
}

closeModalBtn?.addEventListener('click', closeModal);
modalBackdrop?.addEventListener('click', closeModal);

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modal?.classList.contains('is-open')) {
    closeModal();
  }
});

projectCards.forEach((card) => {
  card.addEventListener('pointermove', (event) => {
    if (prefersReducedMotion) return;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 7;
    const rotateX = (0.5 - (y / rect.height)) * 7;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
  });

  card.addEventListener('pointerleave', () => {
    card.style.transform = '';
  });
});

document.querySelectorAll('[data-project-link]').forEach((link) => {
  const projectKey = link.dataset.projectLink;
  const projectUrl = window.projectLinks?.[projectKey];
  if (projectUrl) {
    link.href = projectUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    return;
  }

  link.classList.add('is-placeholder');
  link.addEventListener('click', (event) => event.preventDefault());
});

const setActiveLinkOnLoad = () => {
  const currentHash = window.location.hash || '#home';
  navLinks.forEach((link) => {
    const active = link.getAttribute('href') === currentHash;
    link.classList.toggle('is-active', active);
  });
};

const applyTranslations = (lang) => {
  const dictionary = window.translations?.[lang] || window.translations?.ru;
  if (!dictionary) return;

  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach((node) => {
    const path = node.dataset.i18n.split('.');
    let value = dictionary;
    for (const key of path) {
      value = value?.[key];
      if (value === undefined) break;
    }
    if (typeof value === 'string') {
      node.textContent = value;
    }
  });

  langButtons.forEach((button) => {
    const isCurrent = button.dataset.lang === lang;
    button.classList.toggle('is-active', isCurrent);
    button.setAttribute('aria-pressed', String(isCurrent));
  });

  const heading = document.querySelector('.contact-copy .eyebrow');
  if (heading) heading.textContent = dictionary.contact.heading;
  const contactTitle = document.querySelector('.contact-copy h2');
  if (contactTitle) contactTitle.textContent = dictionary.contact.heading;
  const contactText = document.querySelector('.contact-text');
  if (contactText) contactText.textContent = dictionary.contact.subheading;

  const footerTech = document.querySelector('.footer-tech');
  if (footerTech) footerTech.textContent = dictionary.footer.built;

  const githubCard = document.querySelector('.contact-card-github small');
  if (githubCard) githubCard.textContent = dictionary.contact.githubLater;
};

const savedLang = window.translations?.[localStorage.getItem('portfolio-lang')] ? localStorage.getItem('portfolio-lang') : 'ru';
applyTranslations(savedLang);

langButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const selected = button.dataset.lang;
    if (!selected) return;
    localStorage.setItem('portfolio-lang', selected);
    applyTranslations(selected);
  });
});

setActiveLinkOnLoad();
