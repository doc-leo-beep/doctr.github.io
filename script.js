/**
 * SUMAIR MUSTAFA — PORTFOLIO
 * script.js — Vanilla JavaScript, no dependencies
 */

'use strict';

/* ══════════════════════════════════════════════════════
   UTILITY
   ══════════════════════════════════════════════════════ */

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];


/* ══════════════════════════════════════════════════════
   LOADER
   ══════════════════════════════════════════════════════ */

(function initLoader() {
  const loader = $('#loader');
  if (!loader) return;
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 300);
  });
})();


/* ══════════════════════════════════════════════════════
   CURRENT YEAR IN FOOTER
   ══════════════════════════════════════════════════════ */

(function setYear() {
  const el = $('#year');
  if (el) el.textContent = new Date().getFullYear();
})();


/* ══════════════════════════════════════════════════════
   CUSTOM CURSOR
   ══════════════════════════════════════════════════════ */

(function initCursor() {
  const cursor = $('#cursor');
  const trail  = $('#cursor-trail');
  if (!cursor || !trail) return;

  let mx = 0, my = 0;
  let tx = 0, ty = 0;
  let raf;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  function animateTrail() {
    tx += (mx - tx) * 0.15;
    ty += (my - ty) * 0.15;
    trail.style.left = tx + 'px';
    trail.style.top  = ty + 'px';
    raf = requestAnimationFrame(animateTrail);
  }
  raf = requestAnimationFrame(animateTrail);

  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    trail.style.opacity  = '0.5';
  });
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    trail.style.opacity  = '0';
  });

  /* Scale on interactive elements */
  const interactive = 'a, button, input, textarea, .skill-card, .project-card, .contact-item';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(interactive)) {
      cursor.style.transform = 'translate(-50%,-50%) scale(2)';
      cursor.style.background = 'rgba(94,234,212,0.6)';
      trail.style.transform = 'translate(-50%,-50%) scale(1.4)';
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(interactive)) {
      cursor.style.transform = 'translate(-50%,-50%) scale(1)';
      cursor.style.background = '';
      trail.style.transform = 'translate(-50%,-50%) scale(1)';
    }
  });
})();


/* ══════════════════════════════════════════════════════
   HEADER — scroll behaviour + active nav
   ══════════════════════════════════════════════════════ */

(function initHeader() {
  const header = $('#header');
  const navLinks = $$('.nav-link');
  const sections = $$('section[id]');
  const btt = $('#back-to-top');

  function onScroll() {
    const y = window.scrollY;

    /* Scrolled style */
    header.classList.toggle('scrolled', y > 40);

    /* Back-to-top visibility */
    if (btt) btt.classList.toggle('visible', y > 500);

    /* Active nav highlight */
    let current = '';
    sections.forEach(sec => {
      if (y >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach(a => {
      const matches = a.getAttribute('href') === '#' + current;
      a.classList.toggle('active', matches);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (btt) {
    btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }
})();


/* ══════════════════════════════════════════════════════
   HAMBURGER MENU
   ══════════════════════════════════════════════════════ */

(function initHamburger() {
  const btn  = $('#hamburger');
  const menu = $('#mobile-menu');
  const links = $$('.mobile-link');
  if (!btn || !menu) return;

  function close() {
    btn.classList.remove('open');
    menu.classList.remove('open');
    document.body.classList.remove('menu-open');
    btn.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
  }

  btn.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    btn.classList.toggle('open', isOpen);
    document.body.classList.toggle('menu-open', isOpen);
    btn.setAttribute('aria-expanded', String(isOpen));
    menu.setAttribute('aria-hidden', String(!isOpen));
  });

  links.forEach(l => l.addEventListener('click', close));

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') close();
  });
})();


/* ══════════════════════════════════════════════════════
   REVEAL ON SCROLL  (IntersectionObserver)
   ══════════════════════════════════════════════════════ */

(function initReveal() {
  const els = $$('.reveal, .reveal-right');
  if (!els.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;
      /* Stagger sibling cards */
      const siblings = entry.target.parentElement
        ? [...entry.target.parentElement.children].filter(c => c.classList.contains('reveal') || c.classList.contains('reveal-right'))
        : [];
      const idx = siblings.indexOf(entry.target);
      const delay = idx * 80;
      entry.target.style.transitionDelay = delay + 'ms';
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  els.forEach(el => observer.observe(el));
})();


/* ══════════════════════════════════════════════════════
   TYPED ROLES ANIMATION
   ══════════════════════════════════════════════════════ */

(function initTyped() {
  const el = $('#typed-role');
  if (!el) return;

  const roles = [
    'BDS Student at LUMHS',
    'Oral Surgery Enthusiast',
    'Dental Researcher',
    'Community Health Advocate',
    'Peer Educator',
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let deleting = false;
  let timer;

  const TYPING_SPEED   = 70;
  const DELETING_SPEED = 40;
  const PAUSE_AFTER    = 1800;
  const PAUSE_BEFORE   = 350;

  function tick() {
    const current = roles[roleIdx];

    if (!deleting) {
      el.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        deleting = true;
        timer = setTimeout(tick, PAUSE_AFTER);
        return;
      }
      timer = setTimeout(tick, TYPING_SPEED);
    } else {
      el.textContent = current.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        timer = setTimeout(tick, PAUSE_BEFORE);
        return;
      }
      timer = setTimeout(tick, DELETING_SPEED);
    }
  }

  tick();
})();


/* ══════════════════════════════════════════════════════
   COUNTER ANIMATION
   ══════════════════════════════════════════════════════ */

(function initCounters() {
  const counters = $$('[data-target]');
  if (!counters.length) return;

  const DURATION = 1600;

  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const start  = performance.now();

    function update(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / DURATION, 1);
      el.textContent = Math.round(easeOutCubic(progress) * target);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();


/* ══════════════════════════════════════════════════════
   PARTICLE CANVAS
   ══════════════════════════════════════════════════════ */

(function initParticles() {
  const canvas = $('#particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles, raf;

  const COUNT  = 55;
  const RADIUS = 1.4;
  const SPEED  = 0.35;
  const CONNECT_DIST = 130;

  class Particle {
    constructor() { this.reset(true); }

    reset(init) {
      this.x  = Math.random() * W;
      this.y  = init ? Math.random() * H : H + 4;
      this.vx = (Math.random() - 0.5) * SPEED;
      this.vy = -(Math.random() * SPEED + 0.1);
      this.a  = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.y < -4 || this.x < -4 || this.x > W + 4) this.reset(false);
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(13,148,136,${this.a})`;
      ctx.fill();
    }
  }

  function resize() {
    W = canvas.offsetWidth;
    H = canvas.offsetHeight;
    canvas.width  = W;
    canvas.height = H;
  }

  function build() {
    particles = Array.from({ length: COUNT }, () => new Particle());
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT_DIST) {
          const alpha = (1 - dist / CONNECT_DIST) * 0.12;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(13,148,136,${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    raf = requestAnimationFrame(loop);
  }

  function init() {
    resize();
    build();
    loop();
  }

  const ro = new ResizeObserver(() => {
    resize();
    build();
  });
  ro.observe(canvas.parentElement);

  /* Pause when tab hidden */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(raf); }
    else { loop(); }
  });

  init();
})();


/* ══════════════════════════════════════════════════════
   CONTACT FORM — client-side validation + mock submit
   ══════════════════════════════════════════════════════ */

   const EMAILJS_PUBLIC_KEY = 'WHCalI8tHtZMxfRGq';
   const EMAILJS_SERVICE_ID = 'rajputsumair32@gmail.com';
   const EMAILJS_TEMPLATE_ID = 'template_ehlkx1x'; 
   (function loadEmailJS() { 
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
    script.onload = () => emailjs.init(EMAILJS_PUBLIC_KEY);
    document.head.appendChild(script);
  })();

(function initContactForm() {
  const form   = $('#contact-form');
  if (!form) return;

  const fields = {
    name:    { el: $('#name'),    err: $('#name-error'),    msg: 'Please enter your name.' },
    email:   { el: $('#email'),   err: $('#email-error'),   msg: 'Please enter a valid email address.' },
    subject: { el: $('#subject'), err: $('#subject-error'), msg: 'Please enter a subject.' },
    message: { el: $('#message'), err: $('#message-error'), msg: 'Please enter a message.' },
  };

  const submitBtn  = $('#submit-btn');
  const btnText    = $('#btn-text');
  const formNote   = $('#form-note');

  function validateEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  }

  function validate(key) {
    const { el, err, msg } = fields[key];
    let ok = true;

    if (!el.value.trim()) {
      ok = false;
    } else if (key === 'email' && !validateEmail(el.value)) {
      ok = false;
    }

    el.classList.toggle('error', !ok);
    err.textContent = ok ? '' : msg;
    return ok;
  }

  /* Live validation on blur */
  Object.keys(fields).forEach(key => {
    fields[key].el.addEventListener('blur', () => validate(key));
    fields[key].el.addEventListener('input', () => {
      if (fields[key].el.classList.contains('error')) validate(key);
    });
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const allValid = Object.keys(fields).map(k => validate(k)).every(Boolean);
    if (!allValid) return;

    submitBtn.disabled = true;
    btnText.textContent = 'Sending…';
    formNote.textContent = '';
    formNote.className = 'form-note';

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      from_name:  fields.name.el.value.trim(),
      from_email: fields.email.el.value.trim(),
      subject:    fields.subject.el.value.trim(),
      message:    fields.message.el.value.trim(),
    })
    .then(() => {
      btnText.textContent = 'Send Message';
      submitBtn.disabled = false;
      formNote.textContent = '✓ Message sent! I\'ll get back to you soon.';
      formNote.className = 'form-note success';
      form.reset();
      Object.keys(fields).forEach(k => {
        fields[k].el.classList.remove('error');
        fields[k].err.textContent = '';
      });
      setTimeout(() => {
        formNote.textContent = '';
        formNote.className = 'form-note';
      }, 6000);
    })
    .catch(() => {
      btnText.textContent = 'Send Message';
      submitBtn.disabled = false;
      formNote.textContent = '✗ Something went wrong. Email me directly.';
      formNote.className = 'form-note fail';
    });
  });
})();


/* ══════════════════════════════════════════════════════
   SMOOTH SCROLL for anchor links
   ══════════════════════════════════════════════════════ */

(function initSmoothScroll() {
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href').slice(1);
    if (!id) { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
})();


/* ══════════════════════════════════════════════════════
   TILT EFFECT on project & skill cards
   ══════════════════════════════════════════════════════ */

(function initTilt() {
  /* Skip on touch devices */
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const cards = $$('.project-card, .skill-card');
  const MAX = 6;

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const rx = ((e.clientY - cy) / (rect.height / 2)) * MAX;
      const ry = -((e.clientX - cx) / (rect.width  / 2)) * MAX;
      card.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();
