# the WHYKINGS — Website Redesign

Dark, editorial one-page redesign of [thewhykings.com](https://thewhykings.com) — leadership coaching by Dominik Haselbauer. Content is taken 1:1 from the live site; design direction came from a Claude Design handoff (premium-coaching aesthetic, gold accent, serif-italic accent words).

**Live:** https://phil-lange.github.io/whykings/

## Stack

Static HTML + CSS + vanilla JS. No build step, no framework, no dependencies.

```
index.html                 page markup (German, pre-rendered)
assets/styles.css          all styles
assets/content.js          DE/EN content dictionary
assets/app.js              language toggle, counters, FAQ accordion, scroll reveals
assets/img/                hero, portrait, service photos, 18 client logos
```

- **DE/EN toggle** — elements carry `data-i18n="path.into.dictionary"` attributes; `app.js` swaps `textContent` from `content.js` and persists the choice in `localStorage`. German is the default and is fully rendered in the HTML, so the page works without JavaScript.
- **Animations** — logo marquee (CSS), stat counters and section reveals (IntersectionObserver). All respect `prefers-reduced-motion`.
- The page is marked `noindex` while this is a redesign preview of content owned by thewhykings.com.

## Local development

```sh
python3 -m http.server 8000
# → http://localhost:8000
```

## Deployment

GitHub Pages serves the repo root from `main` — every push to `main` deploys automatically.
