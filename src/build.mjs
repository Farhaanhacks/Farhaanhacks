// Static site build for skillupsa.com.au — no dependencies.
// Usage: node src/build.mjs   (writes the finished site to ./dist)
import { mkdirSync, writeFileSync, rmSync, cpSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  courses, categories, acePrograms, contact, award, slogan, descriptions, CRM_ENQUIRE_URL, AWARD_URL, GOV_SUPPORT_URL, awardVideo,
  home, about, team, ourCourses, contactPage,
} from './site.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const SITE_URL = 'https://skillupsa.com.au';
const YEAR = new Date().getFullYear();

// ---------------------------------------------------------------- helpers
const e = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const paras = (list, cls = '') => list.map((p) => `<p${cls ? ` class="${cls}"` : ''}>${e(p)}</p>`).join('\n');
const pad = (n) => String(n).padStart(2, '0');
const firstSentence = (t) => (t.match(/^.*?[.?!](?=\s|$)/) || [t])[0];

function img(name, alt, { sizes = '100vw', cls = '', loading = 'lazy', width, height } = {}) {
  const sm = existsSync(join(root, 'public/img', `${name}-sm.jpg`));
  const srcset = sm ? ` srcset="/img/${name}-sm.jpg 720w, /img/${name}.jpg 1600w" sizes="${sizes}"` : '';
  const dims = width && height ? ` width="${width}" height="${height}"` : '';
  return `<img src="/img/${name}.jpg"${srcset} alt="${e(alt)}"${dims} loading="${loading}" decoding="async"${cls ? ` class="${cls}"` : ''}>`;
}

const icon = {
  arrow: '<svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  chevron: '<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2.5" y="4.5" width="19" height="15" rx="2"/><path d="m3 6 9 7 9-7"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9.5"/><path d="M12 7v5l3 2"/></svg>',
  // Award ribbon drawn as a simple medal
  medal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="9" r="6"/><path d="m9 14.5-2 7 5-2.5 5 2.5-2-7"/><path d="m12 6 .9 1.9 2.1.3-1.5 1.4.4 2.1-1.9-1-1.9 1 .4-2.1L9 8.2l2.1-.3z"/></svg>',
  menu: '<svg class="i-open" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M3 7h18M3 12h18M3 17h18"/></svg><svg class="i-close" style="display:none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  Facebook: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 8.5V6.8c0-.8.5-1 .9-1H17V2.1L14 2c-3.3 0-4 2.4-4 4v2.5H7.5V12H10v10h4V12h2.9l.4-3.5H14z"/></svg>',
  Instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none"/></svg>',
  LinkedIn: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3.5 9h3.8v12H3.5zM5.4 3a2.2 2.2 0 1 1 0 4.4 2.2 2.2 0 0 1 0-4.4zM9.8 9h3.6v1.7h.1c.5-1 1.8-2 3.6-2 3.9 0 4.6 2.5 4.6 5.8V21h-3.8v-5.8c0-1.4 0-3.2-2-3.2s-2.2 1.5-2.2 3.1V21H9.8z"/></svg>',
};
// The open circle from the SkillUp SA logo, used as a quiet graphic motif.
const arc = (cls = '') => `<svg class="arc ${cls}" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="49" pathLength="100" stroke-dasharray="78 22" stroke-dashoffset="-6"/></svg>`;

const govLink = (inner) => (GOV_SUPPORT_URL ? `<a class="gov-link" href="${GOV_SUPPORT_URL}" target="_blank" rel="noopener">${inner}</a>` : inner);
const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(contact.mapQuery)}&t=m&z=15&output=embed`;
const socialLinks = () => `<div class="socials">${contact.social.map(([n, u]) => `<a href="${u}" target="_blank" rel="noopener" aria-label="SkillUp SA on ${n}">${icon[n]}</a>`).join('')}</div>`;

// ---------------------------------------------------------------- layout
function header(path) {
  const cur = (p) => (path === p ? ' aria-current="page"' : '');
  const inCourses = path.startsWith('/our-courses') || courses.some((c) => path === `/${c.slug}`);
  const inAbout = path === '/about-us' || path === '/our-team';
  const inAce = path === '/ace-programs' || acePrograms.some((p) => path === `/${p.slug}`);
  return `
<a class="skip" href="#main">Skip to content</a>
<a class="award" href="${AWARD_URL}" target="_blank" rel="noopener"><span class="wrap">${icon.medal}<span><strong>${e(award)}</strong></span></span></a>
<header class="site-header">
  <div class="wrap">
    <a class="brand" href="/" aria-label="SkillUp SA home"><img src="/img/logo-navy.png" alt="SkillUp SA — Training That Transforms" width="600" height="464"></a>
    <nav class="nav" id="site-nav" aria-label="Main">
      <ul>
        <li><a href="/"${cur('/')}>Home</a></li>
        <li class="has-menu has-menu--mega${inCourses ? ' is-current' : ''}" data-open="false">
          <button class="nav-trigger" type="button" aria-expanded="false" aria-controls="menu-courses">Our Courses ${icon.chevron}</button>
          <div class="menu menu--mega" id="menu-courses">
            ${categories.map((c) => `<div><h3>${e(c.name)}</h3><ul>${c.courses.map((x) => `<li><a href="/${x.slug}"${cur('/' + x.slug)}>${e(x.name)}</a></li>`).join('')}</ul></div>`).join('')}
            <div class="menu-foot"><a href="/our-courses">View all courses ${icon.arrow}</a><a href="/ace-programs">ACE Programs ${icon.arrow}</a></div>
          </div>
        </li>
        <li${inAce ? ' class="is-current"' : ''}><a href="/ace-programs"${inAce ? ' aria-current="page"' : ''}>ACE Programs</a></li>
        <li class="has-menu${inAbout ? ' is-current' : ''}" data-open="false">
          <button class="nav-trigger" type="button" aria-expanded="false" aria-controls="menu-about">About Us ${icon.chevron}</button>
          <div class="menu" id="menu-about"><ul>
            <li><a href="/about-us"${cur('/about-us')}>About Us</a></li>
            <li><a href="/our-team"${cur('/our-team')}>Our Team</a></li>
          </ul></div>
        </li>
        <li><a href="/contact"${cur('/contact')}>Contact</a></li>
      </ul>
      <div class="nav-mobile-extra">
        <a class="btn" href="#enquire">Enquire ${icon.arrow}</a>
        <a class="btn btn--ghost" href="${contact.phoneHref}">${icon.phone} ${e(contact.phone)}</a>
      </div>
    </nav>
    <div class="header-cta">
      <a class="header-phone" href="${contact.phoneHref}">${icon.phone}${e(contact.phone)}</a>
      <a class="btn" href="#enquire">Enquire</a>
    </div>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="Menu">${icon.menu}</button>
  </div>
</header>`;
}

function enquire({ title = 'Get in Touch', intro = '' } = {}) {
  // The enquiry form (same fields as the old Hostinger form). It sends to the CRM, which saves it as a lead.
  const field = (name, label, input) => `
        <label class="ef">
          <span class="ef-label">${label}</span>
          ${input}
          <small class="ef-error" data-error-for="${name}" hidden></small>
        </label>`;
  const slot = `<form class="enquiry-form" action="${e(CRM_ENQUIRE_URL)}" method="post" data-enquiry>
        <input type="hidden" name="started" value="">
        <div class="ef-hp" aria-hidden="true"><label>Website <input name="website" tabindex="-1" autocomplete="off"></label></div>
        <p class="ef-alert" role="alert" hidden></p>
        ${field('first_name', 'Name*', '<input name="first_name" placeholder="Your name" autocomplete="given-name" required>')}
        ${field('last_name', 'Last name', '<input name="last_name" placeholder="Your last name" autocomplete="family-name">')}
        ${field('email', 'Your email*', '<input name="email" type="email" placeholder="Your email address" autocomplete="email" required>')}
        ${field('phone', 'Contact Number*', '<input name="phone" type="tel" inputmode="tel" placeholder="Phone/ Mobile" autocomplete="tel" required>')}
        ${field('course_interest', 'Name of the Course*', '<input name="course_interest" placeholder="Short answer" required>')}
        ${field('message', 'Message*', '<textarea name="message" rows="4" maxlength="1000" placeholder="Enter your message" required></textarea>')}
        <button class="ef-submit" type="submit">Submit</button>
      </form>
      <div class="ef-done" role="status" hidden>
        <strong>Thanks, we've got your enquiry</strong>
        <span>Someone from SkillUp SA will be in touch soon.</span>
      </div>`;
  return `
<section class="section section--paper" id="enquire" aria-labelledby="enquire-title">
  <div class="wrap enquire">
    <div>
      <p class="eyebrow">Enquire</p>
      <h2 id="enquire-title">${e(title)}</h2>
      ${intro ? `<p>${e(intro)}</p>` : ''}
      <ul class="details">
        <li><span class="ico">${icon.phone}</span><div><strong>Call</strong><a href="${contact.phoneHref}">${e(contact.phone)}</a></div></li>
        <li><span class="ico">${icon.mail}</span><div><strong>Email</strong><a href="mailto:${contact.email}">${e(contact.email)}</a></div></li>
        <li><span class="ico">${icon.pin}</span><div><strong>Visit</strong>${e(contact.street)}<br>${e(contact.suburb)}</div></li>
      </ul>
      ${socialLinks()}
    </div>
    <div class="embed-slot" data-crm-embed>
      <!-- Enquiry form: sends to the CRM (CRM_ENQUIRE_URL in src/site.mjs), which saves each enquiry as a lead -->
      ${slot}
    </div>
  </div>
</section>`;
}

function footer() {
  return `
<footer class="site-footer">
  <div class="wrap">
    <div class="footer-top">
      <div class="footer-brand">
        <img src="/img/logo-white.png" alt="SkillUp SA — Training That Transforms" width="600" height="464" loading="lazy">
        <address>${e(contact.street)}<br>${e(contact.suburb)}<br>T: <a href="${contact.phoneHref}">${e(contact.phone)}</a><br>E: <a href="mailto:${contact.email}">${e(contact.email)}</a></address>
        ${socialLinks()}
      </div>
      <div>
        <h2>Our Courses</h2>
        <ul>${categories.map((c) => `<li><a href="/our-courses#${c.id}">${e(c.name)}</a></li>`).join('')}</ul>
      </div>
      <div>
        <h2>ACE Programs</h2>
        <ul>${acePrograms.map((p) => `<li><a href="/${p.slug}">${e(p.name)}</a></li>`).join('')}</ul>
      </div>
      <div>
        <h2>SkillUp SA</h2>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/about-us">About Us</a></li>
          <li><a href="/our-team">Our Team</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-map">
      <div><h2>Opening hours</h2><dl>${contact.hours.map(([d, h]) => `<dt>${e(d)}</dt><dd>${e(h)}</dd>`).join('')}</dl></div>
      <iframe src="${mapSrc}" title="Map: ${e(contact.mapQuery)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
    </div>
    <div class="footer-base"><span>© ${YEAR} SkillUp SA</span><a href="${AWARD_URL}" target="_blank" rel="noopener">${e(award)}</a></div>
  </div>
</footer>`;
}

function layout({ path, title, description = '', og = 'og-logo', body, enquireOpts = {}, noEnquire = false }) {
  const fullTitle = title ? `${title} | SkillUp SA` : 'SkillUp SA — Digital and Business Training Courses';
  return `<!doctype html>
<html lang="en-AU">
<head>
<script>(function(){var d=document.documentElement;d.classList.add('js');try{if(location.pathname==='/'&&!matchMedia('(prefers-reduced-motion: reduce)').matches&&(location.search.indexOf('intro')>-1||!sessionStorage.getItem('su-intro'))){d.classList.add('has-intro');sessionStorage.setItem('su-intro','1')}}catch(e){}})()</script>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${e(fullTitle)}</title>
${description ? `<meta name="description" content="${e(description)}">` : ''}
<link rel="canonical" href="${SITE_URL}${path === '/' ? '' : path}">
<meta property="og:type" content="website">
<meta property="og:title" content="${e(fullTitle)}">
${description ? `<meta property="og:description" content="${e(description)}">` : ''}
<meta property="og:image" content="${SITE_URL}/img/${og}.jpg">
<meta name="theme-color" content="#010c80">
<link rel="icon" type="image/png" href="/img/favicon.png">
<link rel="apple-touch-icon" href="/img/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Lexend:wght@300..700&family=Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,300..700,0..100,0..1;1,9..144,300..700,0..100,0..1&family=Libre+Franklin:wght@800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/css/site.css">
</head>
<body>
${path === '/' ? `<div class="intro" aria-hidden="true"><div class="intro-logo"><div class="intro-mark"><svg class="intro-ring" viewBox="0 0 600 464"><path d="M444 141A230 230 0 1 0 444 323" fill="none" stroke="#0080ff" stroke-width="4" stroke-linecap="round"/></svg><img class="intro-text" src="/img/logo-white-text.png" alt="" width="600" height="464"></div></div><p class="intro-award">${icon.medal}<span><span class="intro-award-kicker">Proud Winner · 2026 SA Training Awards</span>Adult Community Education Provider of the Year</span></p></div>` : ''}
${header(path)}
<main id="main">
${body}
${noEnquire ? '' : enquire(enquireOpts)}
</main>
${footer()}
<script src="/js/site.js" defer></script>
</body>
</html>
`;
}

// ---------------------------------------------------------------- pages
const pages = [];
const page = (path, html) => pages.push([path, html]);

// Home -----------------------------------------------------------------------
page('/', layout({
  path: '/',
  title: '',
  description: descriptions.home,
  body: `
<section class="hero">
  <div class="wrap">
    <div class="hero-copy">
      <p class="eyebrow">${e(home.heroEyebrow)}</p>
      <h1>${e(home.heroTitle)}</h1>
      <div class="hero-actions">
        <a class="btn" href="/our-courses">Our Courses ${icon.arrow}</a>
        <a class="btn btn--ghost" href="#enquire">Get in Touch</a>
      </div>
    </div>
    <div class="hero-media">
      ${arc()}
      <span class="block" aria-hidden="true"></span>
      <div class="frame">${img('hero-group', 'A group of adult learners laughing together', { sizes: '(max-width: 1020px) 100vw, 45vw', loading: 'eager' })}</div>
    </div>
  </div>
</section>

<section class="section section--stage on-dark" aria-labelledby="awards-title">
  <div class="wrap stage">
    <div class="stage-copy">
      <p class="eyebrow">SA Training Awards 2026</p>
      <h2 id="awards-title">Adult Community Education Provider of the Year</h2>
      <p class="stage-statement">${e(award)}</p>
      <a class="text-link" href="${AWARD_URL}" target="_blank" rel="noopener">View on the SA Skills Commission website ${icon.arrow}</a>
    </div>
    <div class="video" data-vimeo="${awardVideo.vimeoId}" data-title="${e(awardVideo.title)}">
      <a class="video-poster" href="https://vimeo.com/${awardVideo.vimeoId}" target="_blank" rel="noopener" aria-label="Play video: ${e(awardVideo.title)} (${awardVideo.length})">
        ${img(awardVideo.poster, awardVideo.posterAlt, { sizes: '(max-width: 1020px) 100vw, 60vw' })}
        <span class="video-play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg></span>
        <span class="video-cap">${e(awardVideo.title)} · ${awardVideo.length}</span>
      </a>
    </div>
  </div>
</section>

<section class="section section--paper" aria-labelledby="why-title">
  <div class="wrap split split--wide-text">
    <div class="split-media">
      <span class="tab" aria-hidden="true"></span>
      ${img('why-trainer', 'A trainer presenting to a class at a whiteboard', { sizes: '(max-width: 1020px) 100vw, 42vw' })}
    </div>
    <div class="split-body">
      <p class="eyebrow">About SkillUp SA</p>
      <h2 id="why-title">${e(home.why.title)}</h2>
      <p class="lede">${e(home.why.paras[0])}</p>
      ${paras(home.why.paras.slice(1))}
      <a class="text-link" href="/about-us">About Us ${icon.arrow}</a>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="ace-title">
  <div class="wrap">
    <div class="mission">
      <div class="mission-aside">
        <p class="eyebrow">ACE Programs</p>
        <h2 id="ace-title">${e(home.ace.title)}</h2>
        <blockquote class="pull"><p>${e(home.ace.quote)}</p></blockquote>
        ${govLink('<img class="gov-logo" src="/img/gov-sa-supported.jpg" alt="Supported by Government of South Australia" width="160" height="137" loading="lazy">')}
      </div>
      <div class="mission-body">
        <p class="lede">${e(home.ace.lede)}</p>
        ${paras(home.ace.paras)}
      </div>
    </div>
    <div class="programs">
      ${acePrograms.map((p) => `
      <a class="program" href="/${p.slug}">
        <div class="program-img">${img(p.image, p.alt, { sizes: '(max-width: 640px) 100vw, 25vw' })}</div>
        <div class="program-body">
          <h3>${e(p.name)}</h3>
          <p>${e(p.blurb)}</p>
          <span class="text-link">Learn More ${icon.arrow}</span>
        </div>
      </a>`).join('')}
    </div>
    <div class="programs-foot">
      <a class="text-link" href="/ace-programs">ACE Programs ${icon.arrow}</a>
    </div>
  </div>
</section>

<section class="section section--paper" aria-labelledby="skilled-title">
  <div class="wrap">
    <div class="section-head">
      <div class="split-body">
        <p class="eyebrow">Our Courses</p>
        <h2 id="skilled-title">${e(home.skilled.title)}</h2>
        <p class="lede">${e(home.skilled.paras[0])}</p>
        ${paras(home.skilled.paras.slice(1))}
      </div>
      <div class="section-head-media">${img('skilled-professional', 'A small team meeting around a table with a presentation on screen', { sizes: '(max-width: 1020px) 100vw, 40vw' })}</div>
    </div>
    <div class="index">
      ${categories.map((c) => `
      <div class="index-row">
        <h3><a href="/our-courses#${c.id}">${e(c.name)}</a></h3>
        <ul>${c.courses.map((x) => `<li><a href="/${x.slug}">${e(x.name)}</a></li>`).join('')}</ul>
      </div>`).join('')}
    </div>
  </div>
</section>

<section class="section section--navy on-dark" aria-labelledby="capability-title">
  <div class="wrap cap">
    <div class="cap-head">
      <p class="eyebrow">${e(home.capability.eyebrow)}</p>
      <h2 id="capability-title">${e(home.capability.title)}</h2>
      <p>${e(home.capability.intro)}</p>
      <div class="hero-actions" style="margin-top:28px">
        <a class="btn btn--sky" href="#enquire">Get in Touch ${icon.arrow}</a>
        <a class="btn btn--ghost-light" href="/our-courses">Our Courses</a>
      </div>
    </div>
    <div class="cap-body" data-wheel>
      <div class="cap-track">
        <div class="cap-stage">
          <h3 class="cap-list-title">${e(home.capability.listTitle)}</h3>
          <div class="cap-window">
            <span class="cap-pointer" aria-hidden="true"></span>
            <ul class="cap-list">${home.capability.list.map((x) => `<li>${e(x)}</li>`).join('')}</ul>
          </div>
        </div>
      </div>
      ${paras(home.capability.paras)}
    </div>
  </div>
</section>

<section class="section" aria-labelledby="corp-title">
  <div class="wrap">
    <div class="corporate-media">${img('corporate-team', 'A trainer leading a workshop with a group of adults around a table', { sizes: '100vw' })}</div>
    <div class="corporate">
      <div>
        <p class="eyebrow">For employers</p>
        <h2 id="corp-title">${e(home.corporate.title)}</h2>
      </div>
      <div class="corporate-body">${paras(home.corporate.paras)}</div>
    </div>
  </div>
</section>

<section class="slogan" aria-label="${e(slogan)}">
  ${img('sky-dome', '', { sizes: '100vw' })}
  <div class="wrap"><p>Be future-proof and <em>future-ready</em></p></div>
</section>`,
}));

// Inner-page header ------------------------------------------------------------
function pageHead({ crumbs = [], eyebrow = '', title, lede = '', after = '' }) {
  const trail = crumbs.length
    ? `<nav aria-label="Breadcrumb"><ol class="crumbs"><li><a href="/">Home</a></li>${crumbs.map(([t, h]) => (h ? `<li><a href="${h}">${e(t)}</a></li>` : `<li aria-current="page">${e(t)}</li>`)).join('')}</ol></nav>`
    : '';
  return `
<section class="page-head">
  ${arc()}
  <div class="wrap">
    ${trail}
    ${eyebrow ? `<p class="eyebrow">${e(eyebrow)}</p>` : ''}
    <h1>${e(title)}</h1>
    ${lede ? `<p class="lede">${e(lede)}</p>` : ''}
    ${after}
  </div>
</section>`;
}

// Our Courses ------------------------------------------------------------------
page('/our-courses', layout({
  path: '/our-courses',
  title: 'Our Courses',
  description: descriptions['our-courses'],
  body: `
${pageHead({
  crumbs: [['Our Courses']],
  title: 'Our Courses',
  lede: ourCourses.lede,
  after: `<nav class="cat-nav" aria-label="Course categories">${categories.map((c) => `<a href="#${c.id}">${e(c.name)}</a>`).join('')}</nav>`,
})}
<section class="section" style="padding-top:clamp(40px,5vw,72px)">
  <div class="wrap">
    <div class="intro-cols">${paras(ourCourses.paras)}</div>
    ${categories.map((c) => `
    <section class="cat" id="${c.id}" aria-labelledby="cat-${c.id}">
      <div class="cat-media">
        ${img(c.image, c.alt, { sizes: '(max-width: 1020px) 100vw, 30vw' })}
        <h2 id="cat-${c.id}">${e(c.name)}</h2>
      </div>
      <ul class="course-list">
        ${c.courses.map((x) => `
        <li><a href="/${x.slug}">
          <h3>${e(x.name)}</h3>
          <p>${e(firstSentence(x.intro[0]))}</p>
          <span class="go" aria-hidden="true">${icon.arrow}</span>
        </a></li>`).join('')}
      </ul>
    </section>`).join('')}
  </div>
</section>`,
}));

// Course pages -----------------------------------------------------------------
for (const c of courses) {
  const cat = categories.find((k) => k.id === c.category);
  const others = cat.courses.filter((x) => x.slug !== c.slug);
  let summary;
  if (c.kind === 'units') {
    summary = `<ol class="summary summary--units">${c.items.map((u) => `
      <li><span class="unit-n" aria-hidden="true">${e(u.n)}</span><div><h3><span class="visually-hidden">${e(u.n)} – </span>${e(u.h)}</h3><ul>${u.p.map((p) => `<li>${e(p)}</li>`).join('')}</ul></div></li>`).join('')}</ol>`;
  } else if (c.kind === 'pairs') {
    summary = `<ol class="summary">${c.items.map((u) => `<li><div><h3>${e(u.h)}</h3>${paras(u.p)}</div></li>`).join('')}</ol>`;
  } else {
    summary = `<ol class="summary">${c.items.map((t) => `<li><p>${e(t)}</p></li>`).join('')}</ol>`;
  }
  page(`/${c.slug}`, layout({
    path: `/${c.slug}`,
    title: c.name,
    description: descriptions[c.slug],
    og: c.og || c.image,
    body: `
${pageHead({ crumbs: [['Our Courses', '/our-courses'], [cat.name, `/our-courses#${cat.id}`], [c.name]], eyebrow: cat.name, title: c.title })}
<section class="section" style="padding-top:clamp(40px,5vw,72px)">
  <div class="wrap course">
    <article class="course-main">
      <p class="lede">${e(c.intro[0])}</p>
      ${paras(c.intro.slice(1))}
      <h2>${e(c.label)}</h2>
      ${summary}
      ${c.outro.length ? `<div class="outro">${paras(c.outro)}</div>` : ''}
    </article>
    <aside class="course-aside" aria-label="Course details">
      <div class="photo">${img(c.image, c.imageAlt || '', { sizes: '(max-width: 1020px) 100vw, 30vw', loading: 'eager' })}</div>
      <div class="aside-card aside-card--navy on-dark">
        <h2>${e(c.cta || 'Get in Touch')}</h2>
        <a class="btn btn--sky" href="#enquire">Enquire ${icon.arrow}</a>
        <a class="phone" href="${contact.phoneHref}">T: ${e(contact.phone)}</a>
      </div>
      ${others.length ? `<div class="aside-card"><p class="label">${e(cat.name)}</p><ul>${others.map((x) => `<li><a href="/${x.slug}">${e(x.name)}</a></li>`).join('')}</ul></div>` : ''}
    </aside>
  </div>
</section>`,
  }));
}

// ACE Programs -----------------------------------------------------------------
page('/ace-programs', layout({
  path: '/ace-programs',
  title: 'ACE Programs',
  description: home.ace.lede,
  body: `
${pageHead({
  crumbs: [['ACE Programs']],
  eyebrow: 'ACE Programs',
  title: 'Adult Community Education (ACE) Programs',
  after: govLink(`<span class="gov" style="margin-top:12px"><img src="/img/gov-sa-supported.jpg" alt="" width="70" height="60">Supported by Government of South Australia</span>`),
})}
<section class="section" style="padding-top:clamp(40px,5vw,72px)">
  <div class="wrap">
    <div class="ace-list">
      ${acePrograms.map((p, i) => `
      <article class="ace-item">
        <div class="ace-item-media">${img(p.image, p.alt, { sizes: '(max-width: 1020px) 100vw, 40vw', loading: i < 2 ? 'eager' : 'lazy' })}</div>
        <div>
          <span class="num">${pad(i + 1)} / ${pad(acePrograms.length)}</span>
          <h2>${e(p.name)}</h2>
          <p>${e(p.blurb)}</p>
          <a class="btn" href="/${p.slug}">Learn More ${icon.arrow}</a>
        </div>
      </article>`).join('')}
    </div>
  </div>
</section>`,
}));

for (const p of acePrograms) {
  page(`/${p.slug}`, layout({
    path: `/${p.slug}`,
    title: p.name,
    description: p.blurb,
    og: p.image,
    body: `
${pageHead({
  crumbs: [['ACE Programs', '/ace-programs'], [p.name]],
  eyebrow: 'ACE Programs',
  title: p.name,
  lede: p.blurb,
  after: `<div class="hero-actions" style="margin-top:28px"><a class="btn" href="#enquire">Enquire ${icon.arrow}</a><a class="btn btn--ghost" href="${contact.phoneHref}">${icon.phone} ${e(contact.phone)}</a></div>`,
})}
<section class="section" style="padding-top:clamp(40px,5vw,72px)">
  <div class="wrap">
    <div class="flyers${p.flyers.length === 1 ? ' flyers--single' : ''}">
      ${p.flyers.map(([f, alt], i) => `
      <a class="flyer" href="/img/${f}.jpg" target="_blank" rel="noopener">
        ${img(f, alt, { sizes: '(max-width: 820px) 100vw, 520px', loading: 'eager' })}
        <span class="flyer-cap"><span>${p.flyers.length > 1 ? `Page ${i + 1} of ${p.flyers.length}` : 'Flyer'}</span><span>Open full size ${icon.arrow}</span></span>
      </a>`).join('')}
    </div>
  </div>
</section>`,
  }));
}

// About Us ---------------------------------------------------------------------
page('/about-us', layout({
  path: '/about-us',
  title: 'About Us',
  description: descriptions['about-us'],
  body: `
${pageHead({ crumbs: [['About Us']], title: 'About Us' })}
<section class="section" style="padding-top:0">
  <div class="wrap">
    <div class="about-banner" style="margin-top:0">${img('about-banner', 'SkillUp SA - Digital and Business Courses', { sizes: '100vw', loading: 'eager' })}</div>
    <div class="split split--wide-text" style="margin-top:clamp(48px,6vw,88px)">
      <div><p class="eyebrow">SkillUp SA</p><blockquote class="pull"><p>${e(about.paras[4])}</p></blockquote></div>
      <div class="split-body">
        <p class="lede">${e(about.paras[0])}</p>
        ${paras(about.paras.slice(1, 4))}
        <a class="text-link" href="/our-team">Our Team ${icon.arrow}</a>
      </div>
    </div>
  </div>
</section>`,
}));

// Our Team ---------------------------------------------------------------------
page('/our-team', layout({
  path: '/our-team',
  title: 'Our Team',
  description: descriptions['our-team'],
  body: `
${pageHead({ crumbs: [['About Us', '/about-us'], ['Our Team']], title: 'Our Team', lede: team.intro[0] })}
<section class="section" style="padding-top:clamp(40px,5vw,72px)">
  <div class="wrap">
    <div class="split split--wide-text" style="margin-bottom:clamp(56px,7vw,96px); align-items:center">
      <div class="split-media" style="position:static">${img('our-team', 'Four smiling SkillUp SA team members standing together', { sizes: '(max-width: 1020px) 100vw, 45vw', loading: 'eager' })}</div>
      <div class="split-body"><p class="lede">${e(team.intro[1])}</p></div>
    </div>
    <div class="strengths">
      ${team.strengths.map(([h, p], i) => `<div class="strength"><span class="n" aria-hidden="true">${pad(i + 1)}</span><div><h3>${e(h)}</h3><p>${e(p)}</p></div></div>`).join('')}
    </div>
    <div class="outro" style="max-width:860px"><p>${e(team.closing)}</p></div>
  </div>
</section>`,
}));

// Contact ----------------------------------------------------------------------
page('/contact', layout({
  path: '/contact',
  title: 'Contact us',
  description: descriptions['contact-zUntuk'],
  enquireOpts: { title: 'Get in Touch' },
  body: `
${pageHead({ crumbs: [['Contact']], title: 'Contact us', lede: contactPage.intro })}
<section class="section" style="padding:clamp(40px,5vw,72px) 0">
  <div class="wrap">
    <div class="contact-cards">
      <div class="contact-card"><h2>Contacts</h2><p><a href="mailto:${contact.email}">${e(contact.email)}</a><br><a href="${contact.phoneHref}">${e(contact.phone)}</a></p></div>
      <div class="contact-card"><h2>Address</h2><p>${contact.postal.map(e).join('<br>')}</p></div>
      <div class="contact-card"><h2>Opening hours</h2><dl>${contact.hours.map(([d, h]) => `<dt>${e(d)}</dt><dd>${e(h)}</dd>`).join('')}</dl></div>
    </div>
  </div>
</section>`,
}));

// ---------------------------------------------------------------- write
rmSync(dist, { recursive: true, force: true });
cpSync(join(root, 'public'), dist, { recursive: true });
for (const [path, html] of pages) {
  const file = path === '/' ? join(dist, 'index.html') : join(dist, path.slice(1), 'index.html');
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
}
console.log(`Built ${pages.length} pages into dist/`);
