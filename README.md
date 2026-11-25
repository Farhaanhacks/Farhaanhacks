# SkillUp SA website (redesign)

A static rebuild of https://skillupsa.com.au with a new layout and visual design. The copy, photos and flyers are the same as on the current Hostinger site.

Nothing here is live. The current site and its DNS haven't been touched.

## Run it locally

```bash
node src/build.mjs                       # writes the finished site to ./dist
python3 -m http.server 4321 -d dist      # then open http://localhost:4321
```

## Put it online (GitHub + Vercel)

1. Unzip, then in GitHub Desktop: **File → New repository**. Name it (e.g. `skillup-sa-website`), create it, copy these files into the new folder, commit, then **Publish repository**. Keep it private if you like; Vercel works with private repos.
2. In Vercel: **Add New → Project**, then import the repo. Leave the settings as they are; `vercel.json` already sets the build command (`node src/build.mjs`) and output folder (`dist`).
3. Deploy. Vercel gives you a `*.vercel.app` link you can send to the client.
4. Optional: to show the real enquiry form, add an environment variable `CRM_ENQUIRE_URL` (e.g. `https://crm.skillupsa.com.au/enquire`) in Vercel → Project → Settings → Environment Variables, then redeploy. Without it, a placeholder box shows where the form will go.

Pointing skillupsa.com.au at this site is a separate step, done later in the domain's DNS at Hostinger.

## Where things are

| Path | What |
|---|---|
| `src/site.mjs` | All page copy, contact details, nav, ACE programmes, and `CRM_ENQUIRE_URL` |
| `src/courses.json` | The 17 course pages (copy extracted word-for-word from the live site) |
| `src/descriptions.json` | Meta descriptions copied from the live site |
| `src/build.mjs` | Page templates and the build (no dependencies) |
| `public/css/site.css` | All styles. Brand colours are tokens at the top |
| `public/js/site.js` | Menus and mobile nav, the awards video, and the capability scroll effect |
| `public/img/` | Every image from the live site, downloaded, renamed and compressed (11 MB, down from 37 MB) |
| `vercel.json` | Ready for Vercel: build command, output folder, clean URLs, `/contact-zUntuk` → `/contact` redirect |

## Embedding the CRM enquiry form

Every page ends with a "Get in Touch" section. Its right-hand panel is the embed slot (`data-crm-embed`). To switch it on, set the URL and rebuild:

```js
// src/site.mjs
export const CRM_ENQUIRE_URL = 'https://crm.skillupsa.com.au/enquire';
```

(or run `CRM_ENQUIRE_URL=https://… node src/build.mjs`). Until then, a placeholder shows.

## Design

- **Colours:** navy `#010c80`, bright blue `#0080ff`, sky `#77d4fc`, brand blue `#176be0`, white.
- **Type:** Fraunces for headings (replaces Mallanna). Lexend for body text; it was designed to improve reading fluency, which suits an LLND provider. Body text is 17px. The home headline ("Acquire the Skills You Need to Succeed") is set in Libre Franklin ExtraBold.
- **Motif:** the open circle from the SkillUp SA logo, used as a thin arc in a few places.
- **Logo:** the white-text logo from the live site is used on navy. A navy-text version (`img/logo-navy.png`) was made from the same file for the white header.

## What changed, and what was dropped

**Client changes (24 Nov 2026)**
- Home: the hero photo now shows the whole picture (nobody is cropped out).
- Home: the Government of SA logo and the "Adult Community Education Programs" link moved out of the hero and into the ACE section.
- "ACE Programs Whyalla" is now "ACE Programs" everywhere, because programs run across South Australia. The page moved from `/ace-programs-whyalla` to `/ace-programs`, and `vercel.json` redirects the old address.
- Home: "Why Choose SkillUp SA" (About) now comes before the ACE section.
- Home: the "Boost your Computer Skills" section is removed.
- Bigger logo in the header.
- The "Be future-proof and future-ready" band is shorter.
- Opening hours are Monday - Friday 9:00 - 17:00 only (Saturday and Sunday removed), in the footer and on the Contact page.
- The award banner (and the award line in the footer) links to the SA Training Awards ACE Provider of the Year page. The Government of SA logo opens the same page (change `GOV_SUPPORT_URL` in `src/site.mjs` to point it elsewhere). Both open in a new tab.
- The header logo no longer touches the award banner.
- Home: the About section now uses the client's "Building Workforce Capability for Regional South Australia" copy (replacing "Why Choose SkillUp SA"). The About Us page itself is unchanged.
- Home: new "Capability Statement" band (navy, text only: heading and intro on the left, capabilities on the right), in the spot where "Boost your Computer Skills" used to be.
- Home: new SA Training Awards 2026 section straight after the top (hero) section, before About. It has the award statement, a link to the SA Skills Commission page, and the "2026 SA Training Awards Highlights" video (SA Skills Commission, Vimeo). The video shows the awards photo first and plays in place when clicked, with Vimeo's own fullscreen button. Nothing loads from Vimeo until someone presses play.
- Home: the Government of SA logo is centred under the ACE quote.
- Home: in the Capability Statement band, the list pins in place as you scroll and turns like a wheel past a sky-blue tick just under "Our capability includes:": the current point is bright, upcoming points fade along a curve below it, and passed points fade out. After the last point the band carries on and the two paragraphs fade in. "Our capability includes:" and the two paragraphs are larger and bold. Visitors who turn off animations in their device settings, or have JavaScript off, see everything straight away.

- Home: an intro plays once per visit. The screen is navy with the logo, then it zooms into the logo's circle, which opens up to show the site (about 2 seconds; a click or key press skips it). It doesn't play for visitors who have turned off animations. Add `?intro` to the address to replay it.

**Structure and layout (copy unchanged)**
- The two hero blocks on the home page ("Adult Community Education Programs" and "Acquire the Skills You Need to Succeed") are merged into one hero.
- The home page now shows the four ACE programmes as cards, using their blurbs and images from the ACE page.
- The home page's "Become a Skilled Professional" section now includes an index of all courses, grouped as on the Our Courses page.
- Navigation: "ACE Programs Whyalla" is now a top-level item. "Our Courses" opens a menu grouped by category. A phone number and an "Enquire" button sit in the header.
- Our Team: the strengths, which were jumbled by Hostinger's layout, are now a numbered list. "Flexible Availability" was merged into "Assessment Expertise" on the live page and is now its own item.
- Courses page: each course shows the first sentence of its own page intro as a summary.
- Course pages get a sidebar with the photo, an Enquire button and the other courses in the same category.
- The opening hours (from the Contact page) are shown in the footer on every page, next to the map.

**Small additions**
- Breadcrumbs, "Learn More" buttons, a "Get in Touch" button, and "Page 1 of 2 / Open full size" captions on flyers.
- Alt text for images that had none. ACE flyer alt text summarises what each flyer says.
- "© 2026 SkillUp SA" in the footer.
- Page `<title>`s are now "Page name | SkillUp SA". Many live titles were duplicated or pointed at the wrong course; for example, Business Fundamentals was titled "Workplace Communications Basic Course". Meta descriptions are kept as they were.

**URLs**
- All URLs are the same, except `/contact-zUntuk`, which becomes `/contact` (redirect set up in `vercel.json`).

**Dropped**
- The Hostinger contact form. The CRM embed replaces it.
- The cookie-consent banner. The new site sets no cookies (the Google Map embed may).
- The decorative angled stripe graphics in the header.
- The "Why Choose" photo is cropped to remove white bands that were part of the image file.

## Things in the live content worth fixing (not changed here)

These were kept word-for-word. Ask the client before changing them:

1. **Workforce Readiness** and **Workplace Communication Basics** appear to have swapped page content. Each page's text describes the other course.
2. "Workplace Numeracy **Essentails** Course" is misspelled in the page heading.
3. Problem-Solving page: "…enhance their related to problem-solving and career planning skills" has a word missing.
4. The address in the footer is "39 - 44 Patterson Street" but the map pin is "40-44 Patterson Street".
5. The Contact page lists a postal address in Walkerville, Adelaide, while the footer address is in Whyalla. Both are kept.
6. Several course pages refer to the course by another name. Examples: "Mastery Catalyst: Strategic Leadership Accelerator" on Impact, and "Leadership Prodigy" on Leadership and Management.
7. The ACE programme pages are flyer images only, so their text isn't readable by search engines or screen readers. The flyer text could be written into the pages.
