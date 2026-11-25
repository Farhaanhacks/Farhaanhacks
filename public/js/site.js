// Header behaviour: dropdown menus, mobile menu, scrolled state. No dependencies.
(function () {
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.menu-toggle');
  var menus = document.querySelectorAll('.has-menu');
  var desktop = window.matchMedia('(min-width: 1021px)');

  function closeAll(except) {
    menus.forEach(function (m) {
      if (m !== except) {
        m.dataset.open = 'false';
        m.querySelector('.nav-trigger').setAttribute('aria-expanded', 'false');
      }
    });
  }

  menus.forEach(function (m) {
    var btn = m.querySelector('.nav-trigger');
    var timer;
    btn.addEventListener('click', function () {
      var open = m.dataset.open === 'true';
      closeAll(m);
      m.dataset.open = open ? 'false' : 'true';
      btn.setAttribute('aria-expanded', open ? 'false' : 'true');
    });
    // Hover opens on desktop pointers only
    m.addEventListener('mouseenter', function () {
      if (!desktop.matches) return;
      clearTimeout(timer); closeAll(m);
      m.dataset.open = 'true'; btn.setAttribute('aria-expanded', 'true');
    });
    m.addEventListener('mouseleave', function () {
      if (!desktop.matches) return;
      timer = setTimeout(function () { m.dataset.open = 'false'; btn.setAttribute('aria-expanded', 'false'); }, 160);
    });
  });

  document.addEventListener('click', function (e) {
    if (desktop.matches && !e.target.closest('.has-menu')) closeAll();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeAll();
      if (document.body.classList.contains('nav-open')) setNav(false);
    }
  });

  function setNav(open) {
    document.body.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.querySelector('.i-open').style.display = open ? 'none' : '';
    toggle.querySelector('.i-close').style.display = open ? '' : 'none';
  }
  if (toggle) toggle.addEventListener('click', function () { setNav(!document.body.classList.contains('nav-open')); });
  document.querySelectorAll('.nav a').forEach(function (a) {
    a.addEventListener('click', function () { if (!desktop.matches) setNav(false); });
  });
  desktop.addEventListener('change', function () { setNav(false); closeAll(); });

  // Video: the photo shows first; clicking plays the Vimeo video in place (nothing loads from Vimeo until then)
  document.querySelectorAll('.video[data-vimeo]').forEach(function (box) {
    var poster = box.querySelector('.video-poster');
    poster.addEventListener('click', function (e) {
      e.preventDefault();
      var f = document.createElement('iframe');
      f.src = 'https://player.vimeo.com/video/' + box.dataset.vimeo + '?autoplay=1&dnt=1&title=0&byline=0&portrait=0';
      f.title = box.dataset.title || 'Video';
      f.allow = 'autoplay; fullscreen; picture-in-picture';
      f.setAttribute('allowfullscreen', '');
      box.classList.add('is-playing');
      box.replaceChild(f, poster);
      f.focus();
    });
  });

  // Capability list: as the list moves up the screen, its points appear one at a time; the paragraphs follow once all points are in
  document.querySelectorAll('[data-reveal]').forEach(function (box) {
    var items = Array.prototype.slice.call(box.querySelectorAll('.cap-list li'));
    var paras = Array.prototype.slice.call(box.querySelectorAll(':scope > p'));
    var list = box.querySelector('.cap-list');
    if (!list || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      items.concat(paras).forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    function update() {
      var vh = window.innerHeight;
      var r = list.getBoundingClientRect();
      // 0 when the top of the list is 85% down the screen, 1 when it reaches 30% (mobile lists are longer, so use the list's height)
      var start = vh * 0.85, end = Math.min(vh * 0.30, start - r.height * 0.6);
      var p = (start - r.top) / (start - end);
      var shown = Math.max(0, Math.min(items.length, Math.floor(p * items.length + 0.5)));
      items.forEach(function (li, i) { li.classList.toggle('is-in', i < shown); });
      var all = shown === items.length;
      paras.forEach(function (el, i) {
        var top = el.getBoundingClientRect().top;
        el.classList.toggle('is-in', all && top < vh * 0.92);
        if (all && top < vh * 0.92) el.style.transitionDelay = (0.12 * (i + 1)) + 's'; else el.style.transitionDelay = '';
      });
    }
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  });

  function onScroll() { header.classList.toggle('is-scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
