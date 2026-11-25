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

  // Capability wheel: the list pins while you scroll, turning like a wheel past a fixed tick; the paragraphs follow
  document.querySelectorAll('[data-wheel]').forEach(function (box) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return; // plain list
    var track = box.querySelector('.cap-track');
    var stage = box.querySelector('.cap-stage');
    var items = Array.prototype.slice.call(box.querySelectorAll('.cap-list li'));
    var paras = Array.prototype.slice.call(box.querySelectorAll(':scope > p'));
    var STEP = 0.24;          // screen heights of scrolling per point
    var GAP = 18;             // px between points
    var centres = [];
    box.classList.add('is-wheel');

    function measure() {
      // Lay the points out in a column (as measured at full size) to get each one's centre
      var y = 0;
      centres = items.map(function (li) {
        li.style.transform = 'none';
        var h = li.offsetHeight, c = y + h / 2;
        y += h + GAP;
        return c;
      });
      track.style.height = (stage.offsetHeight + window.innerHeight * STEP * (items.length - 1)) + 'px';
      update();
    }

    function update() {
      var vh = window.innerHeight;
      var scrollable = track.offsetHeight - stage.offsetHeight;
      var top = track.getBoundingClientRect().top - parseFloat(getComputedStyle(stage).top);
      var t = scrollable > 0 ? Math.max(0, Math.min(1, -top / scrollable)) : 0;
      var p = t * (items.length - 1);                 // which point is under the tick (fractional)
      var i0 = Math.floor(p), f = p - i0;
      var c = i0 >= items.length - 1 ? centres[items.length - 1] : centres[i0] + f * (centres[i0 + 1] - centres[i0]);
      items.forEach(function (li, i) {
        var d = i - p, ad = Math.abs(d);
        var y = centres[i] - c;
        var x = 34 * (1 - Math.cos(Math.min(ad, 4) * 0.55));   // curve away to the right
        var s = 1 - Math.min(ad, 3) * 0.07;
        var o = Math.max(0, 1 - ad * 0.32);
        li.style.transform = 'translate(' + x.toFixed(1) + 'px,' + (y - li.offsetHeight / 2).toFixed(1) + 'px) scale(' + s.toFixed(3) + ')';
        li.style.opacity = o.toFixed(3);
        li.classList.toggle('is-current', ad < 0.5);
      });
      paras.forEach(function (el, i) {
        var show = t >= 1 && el.getBoundingClientRect().top < vh * 0.92;
        el.style.transitionDelay = show ? (0.12 * i) + 's' : '';
        el.classList.toggle('is-in', show);
      });
    }

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', measure);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
    measure();
  });

  // Intro: remove it when it finishes, or straight away on a click or key press
  var intro = document.querySelector('.intro');
  if (intro && document.documentElement.classList.contains('has-intro')) {
    var endIntro = function () {
      document.documentElement.classList.remove('has-intro');
      if (intro.parentNode) intro.parentNode.removeChild(intro);
      document.removeEventListener('keydown', endIntro);
    };
    setTimeout(endIntro, 2200);
    intro.addEventListener('click', endIntro);
    document.addEventListener('keydown', endIntro);
  } else if (intro) {
    intro.parentNode.removeChild(intro);
  }

  function onScroll() { header.classList.toggle('is-scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
