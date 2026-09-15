// Initialize Slick Slider (Dots Disabled)
$(document).ready(function () {
  $('.hero-slider').slick({
    dots: false, // Turned off slider dots
    infinite: true,
    speed: 600,
    fade: true,
    cssEase: 'linear',
    autoplay: true,
    autoplaySpeed: 3500,
    arrows: true,
    pauseOnHover: false
  });
});

// Mobile Navigation Toggle
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

// Scroll Intersection Observer for Bento Animations
document.addEventListener('DOMContentLoaded', () => {
  const animatedElements = document.querySelectorAll('[data-animate]');

  const bentoObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.getAttribute('data-delay') || 0;

        setTimeout(() => {
          el.classList.add('in-view');

          // Number Counter Rollup
          const counters = el.querySelectorAll('.counter');
          counters.forEach(counter => runCounter(counter));

          // Battery Bar Animation
          const batteryLevel = el.querySelector('.battery-level');
          if (batteryLevel) batteryLevel.style.width = '95%';

          // Activate micro-indicator inside this card
          const micro = el.querySelector('.micro-indicator');
          if (micro) micro.classList.add('active');

          // Highlight hero micro button
          if (el.id) {
            document.querySelectorAll('.hero-micro-grid .micro-action').forEach(b => b.classList.remove('active'));
            const btn = document.querySelector('.hero-micro-grid .micro-action[data-target="' + el.id + '"]');
            if (btn) btn.classList.add('active');
          }
        }, delay);

        observer.unobserve(el);
      }
    });
  }, { threshold: 0.15 });

  animatedElements.forEach(el => bentoObserver.observe(el));

  function runCounter(counterEl) {
    const target = parseInt(counterEl.getAttribute('data-target'), 10);
    const prefix = counterEl.getAttribute('data-prefix') || '';
    const duration = 1500;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        counterEl.textContent = prefix + target;
        clearInterval(timer);
      } else {
        counterEl.textContent = prefix + Math.floor(current);
      }
    }, stepTime);
  }
});

// Gallery Lightbox Modal
const galleryLightbox = document.getElementById('galleryLightbox');
const lightboxImage = document.querySelector('.lightbox-image');
const lightboxCaption = document.querySelector('.lightbox-caption');
const lightboxClose = document.querySelector('.lightbox-close');

document.querySelectorAll('.gallery-expand').forEach(button => {
  button.addEventListener('click', () => {
    const src = button.getAttribute('data-src');
    if (lightboxImage && galleryLightbox) {
      lightboxImage.src = src;
      lightboxCaption.textContent = lightboxImage.alt || '';
      galleryLightbox.setAttribute('aria-hidden', 'false');
    }
  });
});

if (lightboxClose) {
  lightboxClose.addEventListener('click', () => {
    galleryLightbox.setAttribute('aria-hidden', 'true');
  });
}

// Hero Spec Modal
const specModal = document.getElementById('specModal');
const specModalTitle = document.querySelector('.spec-modal-title');
const specModalBody = document.querySelector('.spec-modal-body');
const specModalClose = document.querySelector('.spec-modal-close');

function openSpecModal(title, body) {
  if (!specModal) return;
  specModalTitle.textContent = title || '';
  specModalBody.textContent = body || '';
  specModal.setAttribute('aria-hidden', 'false');
  if (specModalClose) specModalClose.focus();
}

function closeSpecModal() {
  if (!specModal) return;
  specModal.setAttribute('aria-hidden', 'true');
}

document.querySelectorAll('.hero-micro-grid .micro-action').forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.getAttribute('data-target');
    const title = btn.getAttribute('data-title') || '';
    const body = btn.getAttribute('data-body') || '';

    document.querySelectorAll('.hero-micro-grid .micro-action').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    document.querySelectorAll('.micro-indicator').forEach(m => m.classList.remove('active'));
    const card = document.getElementById(targetId);
    if (card) {
      const micro = card.querySelector('.micro-indicator');
      if (micro) micro.classList.add('active');
    }

    openSpecModal(title, body);
  });
});

if (specModalClose) specModalClose.addEventListener('click', closeSpecModal);
if (specModal) {
  specModal.addEventListener('click', (ev) => {
    if (ev.target === specModal) closeSpecModal();
  });
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') closeSpecModal();
  });
}

const specCards = document.querySelectorAll('#specs .bento-card');
const specObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      if (id) {
        document.querySelectorAll('.hero-micro-grid .micro-action').forEach(b => b.classList.remove('active'));
        const btn = document.querySelector('.hero-micro-grid .micro-action[data-target="' + id + '"]');
        if (btn) btn.classList.add('active');
        
        document.querySelectorAll('.micro-indicator').forEach(m => m.classList.remove('active'));
        const micro = entry.target.querySelector('.micro-indicator');
        if (micro) micro.classList.add('active');
      }
    }
  });
}, { threshold: 0.45 });

specCards.forEach(c => specObserver.observe(c));