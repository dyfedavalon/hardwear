# HARDWEAR — five-page site

A static site. No build step, no dependencies. Open `index.html` in a browser.

```
index.html      Home — hero, audience, fabric, colourways, featured reviews, trade teaser
cap.html        The Core Cap — construction, fabric, colourway picker, tech specs, FAQ
founder.html    Our story — Ashley Roberts, how it's made, timeline, values
reviews.html    18 reviews with a working England / Scotland / Wales filter
trade.html      Trade & bulk — pricing tiers, branding, enquiry form, trade FAQ
assets/site.css Design system — all tokens and components live here
assets/site.js  Scroll reveal, colourway picker, review filter, form handler
fetch-assets.sh One-shot script to download imagery locally (see below)
```

## Before you go live

**1. Localise the images.** Every image is currently hot-linked to the CDN it was
generated on. Those URLs are not yours and the founder headshot URL in particular
will expire. From this folder:

```bash
chmod +x fetch-assets.sh && ./fetch-assets.sh
```

That downloads all 18 images into `assets/img/` and rewrites the `<img src>` values
to local paths. Safe to re-run; if any download fails it leaves the HTML alone.

**2. Wire up the two forms.** Both are front-end only right now:

- The **Add to bag** buttons on `cap.html` are anchors, not a cart. Point them at
  your checkout, or drop the page into Shopify/Stripe.
- The **trade enquiry form** on `trade.html` intercepts submit and shows a notice.
  Give the `<form id="tradeForm">` an `action` and remove the handler in
  `assets/site.js`, or point it at Formspree/Basin/your own endpoint.

**3. Replace the placeholder details.** The phone number on `trade.html`
(`01978 000 000`), the footer legal links, and the review count (2,317) are all
invented. So are the reviews themselves — they're realistic filler, not real
customers, so swap them before publishing anything that claims otherwise.

**4. Check the provenance claims against reality.** The site deliberately makes no
claim to manufacture anything. It says the cap is designed, specified and tested in
Wrexham and built to that specification by a manufacturing partner, and the founder
page says outright that there is no HARDWEAR factory. Keep it that way unless it
stops being true — "made in Wales" and similar claims carry real legal weight under
UK consumer protection rules, and the honesty is doing useful work for the brand
anyway. The specifics that would need to be true before publishing: the two-page
spec, the batch sampling, the PFAS-free finish, and the fabric composition in the
spec table.

## The product

One cap, the **Core Cap**, £42. A structured six-panel workwear silhouette with a
technical build: a washed cotton-nylon ripstop canvas face bonded to a wicking
polyester mesh backer, a curved peak, a 34 mm moulded tonal rubber badge (no
embroidery, no woven label), a flat webbing adjuster with a retained tail, and
reflective piping on the rear seam. 82 g, UPF 50+.

Five colourways — Hamilton Brown, Moss, Black, Bone, Hi-Vis Amber. The swatch
hexes live in `assets/site.css` as `--sw-brown`, `--sw-moss`, `--sw-black`,
`--sw-bone`, `--sw-amber`; the picker on cap.html keys off matching
`data-cw` attributes, so if you add a colourway you need a swatch button, a
stage image, and a CSS variable with the same key.

## Design system

Near-monochrome, oversized display type, generous whitespace, **zero shadows**.
Everything is driven by custom properties at the top of `assets/site.css`:

| Token | Value | Used for |
|---|---|---|
| `--ink` | `#1d1d1f` | Headlines, body, dark sections |
| `--canvas` | `#f5f5f7` | Alternating section bands |
| `--blue` | `#0071e3` | Filled CTA buttons only |
| `--ember` | `#b64400` | Eyebrows, stars, tier ticks |
| `--r-card` | `28px` | Cards, figures, picker stage |
| `--r-pill` | `980px` | Buttons |

Type scale is a minor third (1.2) off a 20px base with negative tracking on the
display sizes. The font stack resolves to SF Pro on Apple devices and falls back to
Inter / system UI elsewhere — no webfont request, so nothing to self-host.

Section backgrounds alternate `--paper` / `--canvas` with no dividers or borders.
If you add a section, keep that rhythm going and never let two identical
backgrounds touch.

## Accessibility notes

Colourway swatches and review filters are real `<button>`s with `aria-pressed`, and
the swatches support left/right arrow keys. All images carry alt text. Scroll
reveal animation is disabled under `prefers-reduced-motion`. Every page has exactly
one `<h1>`.

## The founder headshot — check this before publishing

`founder.html` uses a **generative restaging** of Ashley's own photo: the original
phone snap was cut out onto white and colour-corrected, then re-rendered as a studio
headshot. That last step is an AI generation, not a retouch, so **the face is an
approximation of his and needs his sign-off**. Look at it next to the original and
decide whether it still reads as him — models of this kind routinely drift on
bone structure, beard shape and eye spacing, and it is his call, not ours.

If it doesn't hold up, the honest fallback is fifteen minutes with a phone against a
white wall by a window. Drop the file in at `assets/img/ashley-roberts.jpg` and it
takes the same slot. A real photograph of the actual founder beats a generated one
on a page whose entire argument is that this brand doesn't overclaim.
