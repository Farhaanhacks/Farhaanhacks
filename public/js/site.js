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

  // Capability wheel: the list pins while you scroll, turning like a wheel past a fixed tick. Then the paragraphs fade in
  // under the last point and the section stays pinned a little longer so they can be read (if they fit on screen).
  document.querySelectorAll('[data-wheel]').forEach(function (box) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return; // plain list
    var track = box.querySelector('.cap-track');
    var stage = box.querySelector('.cap-stage');
    var items = Array.prototype.slice.call(box.querySelectorAll('.cap-list li'));
    var paras = Array.prototype.slice.call(box.querySelectorAll(':scope > p'));
    var parasBox = document.createElement('div');
    parasBox.className = 'cap-paras';
    paras.forEach(function (el) { parasBox.appendChild(el); });
    box.appendChild(parasBox);
    var READ = 0.9;           // screen heights of extra scrolling while the paragraphs are held in place
    var pinned = false, wheelDist = 1;
    var STEP = 0.24;          // screen heights of scrolling per point
    var GAP = 18;             // px between points
    var FOCAL = 46;           // px from the top of the window to the line the points roll past (set in measure)
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
      // The roll-past line sits just low enough for the tallest point to fit above it
      FOCAL = Math.ceil(Math.max.apply(null, items.map(function (li) { return li.offsetHeight; })) / 2) + 10;
      box.querySelector('.cap-pointer').style.top = FOCAL + 'px';
      // Put the paragraphs just under the last point: inside the pinned area if they fit, otherwise right after it
      var win = box.querySelector('.cap-window');
      var last = items[items.length - 1];
      var pull = Math.max(0, win.offsetHeight - (FOCAL + last.offsetHeight / 2) - 32);
      parasBox.style.marginTop = -pull + 'px';
      stage.appendChild(parasBox);
      pinned = stage.scrollHeight <= stage.clientHeight + 1;
      if (!pinned) {
        // Too tall to hold on screen (phones): they follow straight after the pinned area, starting just under the last point
        box.appendChild(parasBox);
        parasBox.style.marginTop = -Math.max(0, stage.offsetHeight - (win.offsetTop + FOCAL + last.offsetHeight / 2) - 32) + 'px';
      }
      wheelDist = window.innerHeight * STEP * (items.length - 1);
      track.style.height = (stage.offsetHeight + wheelDist + (pinned ? window.innerHeight * READ : 0)) + 'px';
      update();
    }

    function update() {
      var vh = window.innerHeight;
      var top = track.getBoundingClientRect().top - parseFloat(getComputedStyle(stage).top);
      var t = Math.max(0, Math.min(1, -top / wheelDist));
      var p = t * (items.length - 1);                 // which point is under the tick (fractional)
      var i0 = Math.floor(p), f = p - i0;
      var c = i0 >= items.length - 1 ? centres[items.length - 1] : centres[i0] + f * (centres[i0 + 1] - centres[i0]);
      items.forEach(function (li, i) {
        var d = i - p, ad = Math.abs(d);
        var y = centres[i] - c;
        var x = d > 0 ? 34 * (1 - Math.cos(Math.min(d, 4) * 0.55)) : 0;   // upcoming points curve away to the right
        var s = 1 - Math.min(ad, 3) * 0.07;
        var o = d < 0 ? Math.max(0, 1 + d * 2.4) : Math.max(0, 1 - d * 0.3);   // passed points fade out quickly
        li.style.transform = 'translate(' + x.toFixed(1) + 'px,' + (FOCAL + y - li.offsetHeight / 2).toFixed(1) + 'px) scale(' + s.toFixed(3) + ')';
        li.style.opacity = o.toFixed(3);
        li.classList.toggle('is-current', ad < 0.5);
      });
      paras.forEach(function (el, i) {
        var show = t >= 1 && (pinned || el.getBoundingClientRect().top < vh * 0.92);
        el.style.transitionDelay = show ? (0.12 * i) + 's' : '';
        el.classList.toggle('is-in', show);
      });
    }

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', measure);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
    measure();
  });

  // Intro: remove it when it finishes, or straight away on a click, key press, scroll or swipe
  var intro = document.querySelector('.intro');
  if (intro && document.documentElement.classList.contains('has-intro')) {
    var endIntro = function () {
      document.documentElement.classList.remove('has-intro');
      if (intro.parentNode) intro.parentNode.removeChild(intro);
      document.removeEventListener('keydown', endIntro);
      window.removeEventListener('wheel', endIntro);
      window.removeEventListener('touchmove', endIntro);
    };
    setTimeout(endIntro, 3250);
    intro.addEventListener('click', endIntro);
    document.addEventListener('keydown', endIntro);
    window.addEventListener('wheel', endIntro, { passive: true });
    window.addEventListener('touchmove', endIntro, { passive: true });
  } else if (intro) {
    intro.parentNode.removeChild(intro);
  }

  function onScroll() { header.classList.toggle('is-scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
