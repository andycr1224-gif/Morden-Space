/* ============================================================
   MODERN SPACE — main.js
   Motor de animaciones e interacciones premium
   Incluye toda la lógica de index.html + nuevas funciones
============================================================ */
'use strict';

/* ─── 1. AÑO DINÁMICO ─────────────────────────────────── */
const yearEl = document.getElementById('currentYear');
if (yearEl) yearEl.textContent = new Date().getFullYear();


/* ─── 2. NAVBAR SCROLL ──────────────────────────────────
   Añade .scrolled cuando el usuario baja más de 60px.
   Oculta la barra al bajar, la recupera al subir.        */
const navbar = document.getElementById('navbar');
let lastScrollY = 0;

function handleNavbarScroll() {
  if (!navbar) return;
  const currentY = window.scrollY;
  navbar.classList.toggle('scrolled', currentY > 60);
  lastScrollY = currentY;
}
window.addEventListener('scroll', handleNavbarScroll, { passive: true });
handleNavbarScroll();


/* ─── 3. HAMBURGER MENU ─────────────────────────────────
   Abre/cierra el menú overlay en pantallas pequeñas.     */
const burgerBtn  = document.getElementById('burgerBtn');
const mobileMenu = document.getElementById('mobileMenu');

if (burgerBtn && mobileMenu) {
  burgerBtn.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    burgerBtn.classList.toggle('open', isOpen);
    burgerBtn.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      mobileMenu.classList.remove('open');
      burgerBtn.classList.remove('open');
      burgerBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      burgerBtn.classList.remove('open');
      burgerBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}


/* ─── 4. SCROLL REVEAL (.reveal system) ─────────────────
   IntersectionObserver para clases reveal / reveal-left /
   reveal-right / reveal-scale.                           */
const revealEls = document.querySelectorAll(
  '.reveal, .reveal-left, .reveal-right, .reveal-scale'
);

if (revealEls.length) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  revealEls.forEach((el) => revealObserver.observe(el));
}


/* ─── 5. DATA-ANIMATE SYSTEM ────────────────────────────
   Observer para los atributos [data-animate] usados
   en páginas de servicio y nuevas secciones.            */
const animateEls = document.querySelectorAll('[data-animate]');

if (animateEls.length) {
  const animateObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          animateObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );
  animateEls.forEach((el) => animateObserver.observe(el));
}


/* ─── 6. LINE REVEAL ─────────────────────────────────── */
const lineRevealEls = document.querySelectorAll('.line-reveal');

if (lineRevealEls.length) {
  const lineObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          lineObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  lineRevealEls.forEach((el) => lineObserver.observe(el));
}


/* ─── 7. COUNTER ANIMATION ──────────────────────────────
   Anima los números desde 0 hasta data-target.          */
function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const suffix   = el.dataset.suffix || '';
  const duration = 1800;
  const start    = performance.now();

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased    = 1 - (1 - progress) * (1 - progress);
    el.textContent = Math.round(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const counterEls = document.querySelectorAll('.stat-item__number[data-target], .count-up[data-target]');
if (counterEls.length) {
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  counterEls.forEach((el) => counterObserver.observe(el));
}


/* ─── 8. HERO CAROUSEL ──────────────────────────────────
   Avanza entre slides cada 5s con crossfade.            */
const heroCarousel  = document.getElementById('heroCarousel');
const carouselSlides = document.querySelectorAll('.hero__carousel-slide');
let currentSlide = 0;

function advanceSlide() {
  carouselSlides[currentSlide].classList.remove('active');
  currentSlide = (currentSlide + 1) % carouselSlides.length;
  carouselSlides[currentSlide].classList.add('active');
}

if (carouselSlides.length > 1) setInterval(advanceSlide, 5000);


/* ─── 9. PARALLAX HERO ──────────────────────────────────
   Desplaza el carrusel al 35% de la velocidad de scroll.
   Desactivado en móvil y en dispositivos de baja potencia. */
function handleParallax() {
  if (window.innerWidth < 768 || !heroCarousel) return;
  heroCarousel.style.transform = `translateY(${Math.min(window.scrollY * 0.35, 60)}px)`;
}
window.addEventListener('scroll', handleParallax, { passive: true });


/* ─── 10. SCROLL TO TOP ─────────────────────────────────
   Aparece al pasar 500px de scroll.                     */
const scrollTopBtn = document.getElementById('scrollTopBtn');
if (scrollTopBtn) {
  window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


/* ─── 11. FORMULARIO + FORMSPREE ───────────────────────
   Valida campos y envía via fetch sin redirigir.        */
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function setFieldError(groupId, hasError) {
    const group = document.getElementById('group-' + groupId);
    if (group) group.classList.toggle('error', hasError);
  }

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre  = document.getElementById('nombre')?.value.trim() || '';
    const email   = document.getElementById('email')?.value.trim() || '';
    const mensaje = document.getElementById('mensaje')?.value.trim() || '';
    let valid = true;

    setFieldError('nombre',  !nombre);
    setFieldError('email',   !email || !validateEmail(email));
    setFieldError('mensaje', !mensaje);

    if (!nombre || !email || !validateEmail(email) || !mensaje) valid = false;

    if (valid) {
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Enviando…'; }

      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: new FormData(contactForm),
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          contactForm.reset();
          if (formSuccess) {
            formSuccess.classList.add('visible');
            formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        } else {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Error al enviar — intentar de nuevo'; }
        }
      } catch {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Error de red — intentar de nuevo'; }
      }
    }
  });

  contactForm.querySelectorAll('input, textarea').forEach((field) => {
    field.addEventListener('input', () => {
      field.closest('.form-group')?.classList.remove('error');
    });
  });
}


/* ─── 12. WHATSAPP FLOAT ───────────────────────────────
   Aparece 3s después de cargar la página.              */
const waFloat = document.querySelector('.whatsapp-float');
if (waFloat) {
  setTimeout(() => { waFloat.classList.add('visible'); }, 3000);
}


/* ─── 13. CURSOR PERSONALIZADO ─────────────────────────
   Cursor dorado pequeño + círculo follower en desktop. */
const cursor       = document.querySelector('.cursor');
const cursorFollow = document.querySelector('.cursor-follow');

if (cursor && cursorFollow && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  let mouseX = 0, mouseY = 0, followX = 0, followY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX - 4 + 'px';
    cursor.style.top  = mouseY - 4 + 'px';
  });

  function animateCursor() {
    followX += (mouseX - followX) * 0.12;
    followY += (mouseY - followY) * 0.12;
    cursorFollow.style.left = followX - 18 + 'px';
    cursorFollow.style.top  = followY - 18 + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.querySelectorAll('a, button, .proyecto-card, .servicio-card, .feature-card, .pillar').forEach(el => {
    el.addEventListener('mouseenter', () => cursorFollow.classList.add('hovered'));
    el.addEventListener('mouseleave', () => cursorFollow.classList.remove('hovered'));
  });

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    cursorFollow.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    cursorFollow.style.opacity = '1';
  });
}


/* ─── 14. MAGNETIC BUTTONS ─────────────────────────────
   Botones con clase .btn-magnetic siguen el cursor.    */
document.querySelectorAll('.btn-magnetic').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width  / 2;
    const y = e.clientY - rect.top  - rect.height / 2;
    btn.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px)`;
  });
  btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
});


/* ─── 15. SMOOTH ANCHOR SCROLL ─────────────────────────
   Scroll suave para todos los links # internos.       */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
