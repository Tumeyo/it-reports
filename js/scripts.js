document.addEventListener('DOMContentLoaded', () => {
  /* === SMOOTH SCROLL WITH OFFSET === */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#' || href.length < 2) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = 90;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* === MOBILE MENU === */
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => navLinks.classList.toggle('active'));
    // close when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => navLinks.classList.remove('active'));
    });
  }

  /* === LOADER === */
  const loader = document.getElementById('loader');
  if (loader) {
    window.addEventListener('load', () => {
      loader.classList.add('hidden');
      setTimeout(() => loader.remove(), 800);
    });
  }

  /* === COUNTERS === */
  const counters = document.querySelectorAll('.stat-number');
  if (counters.length) {
    const animated = new WeakSet();
    const animate = (el, target, prefix) => {
      let start = null;
      const duration = 1200;
      const step = ts => {
        if (!start) start = ts;
        const progress = Math.min((ts - start) / duration, 1);
        el.textContent = prefix + Math.floor(target * progress);
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated.has(entry.target)) {
          const raw = entry.target.dataset.target || '0';
          const prefix = raw.startsWith('+') ? '+' : '';
          const value = parseInt(raw.replace(/[^\d]/g, ''), 10);
          animate(entry.target, value, prefix);
          animated.add(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => {
      if (c.dataset.target.startsWith('+')) c.textContent = '+0';
      observer.observe(c);
    });
  }

  /* === LERP PARALLAX + MOUSE (base, grid, accents) === */
  const base = document.querySelector('.tech-bg-base');
  const grid = document.querySelector('.tech-grid');
  const accents = document.querySelector('.tech-accents');

  if (base || grid || accents) {
    let targetY = 0;
    let current = { base: 0, grid: 0, accents: 0 };
    const speed = { base: 0.05, grid: 0.12, accents: 0.22 };
    let pointer = { x: 0.5, y: 0.5 };

    const lerp = (a, b, t) => a + (b - a) * t;

    window.addEventListener('scroll', () => targetY = window.scrollY, { passive: true });
    window.addEventListener('mousemove', e => {
      pointer.x = e.clientX / window.innerWidth;
      pointer.y = e.clientY / window.innerHeight;
    }, { passive: true });

    const update = () => {
      const mouseOffset = (pointer.y - 0.5) * 30;

      current.base = lerp(current.base, targetY * speed.base + mouseOffset * 0.3, 0.1);
      current.grid = lerp(current.grid, targetY * speed.grid + mouseOffset * 0.5, 0.1);
      current.accents = lerp(current.accents, targetY * speed.accents + mouseOffset * 0.7, 0.1);

      if (base) base.style.transform = `translateY(${current.base}px)`;
      if (grid) grid.style.transform = `translateY(${current.grid}px)`;
      if (accents) accents.style.transform = `translateY(${current.accents}px)`;

      requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }
});