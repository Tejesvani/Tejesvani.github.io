'use strict';

// ==================== HEADER SCROLL ====================
const header    = document.getElementById('header');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY >= 20;
  header.classList.toggle('scrolled', scrolled);
  backToTop.classList.toggle('visible', scrolled);
});

// ==================== BACK TO TOP ====================
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ==================== MOBILE NAV ====================
const navToggle = document.getElementById('navToggle');
const navbar    = document.getElementById('navbar');
const menuIcon  = navToggle.querySelector('.menu-icon');
const closeIcon = navToggle.querySelector('.close-icon');

navToggle.addEventListener('click', () => {
  const isOpen = navbar.classList.toggle('open');
  menuIcon.style.display  = isOpen ? 'none'  : 'block';
  closeIcon.style.display = isOpen ? 'block' : 'none';
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

navbar.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navbar.classList.remove('open');
    menuIcon.style.display  = 'block';
    closeIcon.style.display = 'none';
    document.body.style.overflow = '';
  });
});

// ==================== ACTIVE NAV ON SCROLL ====================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle(
          'active',
          link.getAttribute('href') === `#${entry.target.id}`
        );
      });
    }
  });
}, { rootMargin: '-40% 0px -40% 0px', threshold: 0 })
  .observe && sections.forEach(s =>
    new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.classList.toggle(
              'active',
              link.getAttribute('href') === `#${entry.target.id}`
            );
          });
        }
      });
    }, { rootMargin: '-40% 0px -40% 0px', threshold: 0 }).observe(s)
  );

// ==================== HERO PARTICLES & DANGLING NODES ====================
(function initHeroFX() {
  const heroSection = document.querySelector('.hero-section');
  if (!heroSection) return;

  // ── Floating particles ──
  const particleContainer = document.createElement('div');
  particleContainer.className = 'hero-particles';
  particleContainer.setAttribute('aria-hidden', 'true');
  heroSection.appendChild(particleContainer);

  const variants   = ['dot', 'ring', 'diamond'];
  const PARTICLE_COUNT = 28;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const p = document.createElement('div');
    const variant = variants[Math.floor(Math.random() * variants.length)];
    p.className = `particle particle--${variant}`;

    const left     = Math.random() * 100;           // % across
    const delay    = Math.random() * 12;            // s delay
    const duration = 8 + Math.random() * 10;        // 8–18s
    const drift    = (Math.random() - 0.5) * 60;   // px horizontal drift
    const startY   = 20 + Math.random() * 80;       // % down the section

    p.style.cssText = `
      left: ${left}%;
      top: ${startY}%;
      --drift: ${drift}px;
      animation-duration: ${duration}s;
      animation-delay: -${delay}s;
    `;
    particleContainer.appendChild(p);
  }

})();

// ==================== SCROLL REVEAL ====================
const revealTargets = [
  '.section-header',
  '.about-body',
  '.timeline-item',
  '.skills-grid',
  '.project-card',
  '.education-card',
  '.contact-info',
  '.contact-form',
  '.hero-badge',
  '.hero-stats',
];

revealTargets.forEach(selector => {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.classList.add('reveal');
    if (selector === '.timeline-item' || selector === '.project-card' || selector === '.education-card') {
      el.style.transitionDelay = `${i * 0.1}s`;
    }
  });
});

// Skills grid: use reveal-group for staggered children
document.querySelectorAll('.skills-grid').forEach(grid => {
  grid.classList.remove('reveal');
  grid.classList.add('reveal-group');
});

// IntersectionObserver for .reveal
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { rootMargin: '0px 0px -60px 0px', threshold: 0.08 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// IntersectionObserver for .reveal-group
const groupObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      groupObserver.unobserve(entry.target);
    }
  });
}, { rootMargin: '0px 0px -40px 0px', threshold: 0.05 });

document.querySelectorAll('.reveal-group').forEach(el => groupObserver.observe(el));

// IntersectionObserver for section headers (animated underline)
const headerObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      headerObserver.unobserve(entry.target);
    }
  });
}, { rootMargin: '0px 0px -40px 0px', threshold: 0.3 });

document.querySelectorAll('.section-header').forEach(el => headerObserver.observe(el));

// ==================== PROJECT TABS ====================
(function initProjectTabs() {
  const tabBtns     = document.querySelectorAll('.tab-btn');
  const projectCards = document.querySelectorAll('#projectsGrid [data-tabs]');

  function switchTab(tab) {
    tabBtns.forEach(b => b.classList.toggle('active', b.dataset.tab === tab));

    projectCards.forEach(card => {
      const cardTabs = card.dataset.tabs.split(' ');
      const show = tab === 'all' || cardTabs.includes(tab);
      card.style.display = show ? '' : 'none';
      if (show) {
        requestAnimationFrame(() => card.classList.add('visible'));
      }
      // Apply per-tab visual order via CSS order property
      const orderKey = 'order' + tab.charAt(0).toUpperCase() + tab.slice(1);
      const orderVal = card.dataset[orderKey];
      card.style.order = orderVal !== undefined ? orderVal : '';
    });

    document.querySelectorAll('#projectsGrid .tab-variant').forEach(variant => {
      const forTabs = variant.dataset.for.split(' ');
      variant.style.display = forTabs.includes(tab) ? '' : 'none';
    });
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  // Initialize order for the default active tab
  switchTab('all');
})();
