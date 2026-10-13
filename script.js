(function () {
  'use strict';

  var yearEl = document.querySelector('[data-year]');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  var nav = document.querySelector('.nav');
  var navToggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');

  function closeNav() {
    if (!nav) return;
    nav.classList.remove('is-open');
    if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
  }

  if (nav && navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.addEventListener('click', function (event) {
      if (event.target.closest('a')) closeNav();
    });

    document.addEventListener('click', function (event) {
      if (!nav.classList.contains('is-open')) return;
      if (nav.contains(event.target)) return;
      closeNav();
    });

    document.addEventListener('keydown', function (event) {
      if (event.key !== 'Escape') return;
      if (!nav.classList.contains('is-open')) return;
      closeNav();
      navToggle.focus();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 860) closeNav();
    });
  }

  var header = document.querySelector('.site-header');
  var toTop = document.querySelector('.to-top');

  function onScroll() {
    var y = window.scrollY || window.pageYOffset || 0;
    if (header) header.classList.toggle('is-stuck', y > 8);
    if (toTop) toTop.classList.toggle('is-visible', y > 600);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener('click', function () {
      var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    });
  }

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));

  if (!('IntersectionObserver' in window) || reduceMotion) {
    revealEls.forEach(function (el) {
      el.classList.add('is-visible');
    });
  } else {
    var groupCounts = new Map();

    revealEls.forEach(function (el) {
      var parent = el.parentElement;
      var index = groupCounts.get(parent) || 0;
      groupCounts.set(parent, index + 1);
      el.style.transitionDelay = Math.min(index * 70, 350) + 'ms';
    });

    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
    );

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));
  var spyLinks = Array.prototype.slice.call(
    document.querySelectorAll('.nav-links a[href^="#"]')
  );

  if (sections.length && spyLinks.length && 'IntersectionObserver' in window) {
    var spyObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var id = '#' + entry.target.id;

          spyLinks.forEach(function (link) {
            var matches = link.getAttribute('href') === id;
            link.classList.toggle('is-active', matches);

            if (matches) {
              link.setAttribute('aria-current', 'true');
            } else {
              link.removeAttribute('aria-current');
            }
          });
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );

    sections.forEach(function (section) {
      spyObserver.observe(section);
    });
  }
})();