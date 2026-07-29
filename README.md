# Mike Foley Campaign Website — V9 Image and Copy Update

This package contains the repaired campaign website with a complete responsive image-sizing system, revised campaign copy, and a verified accessible community-record carousel.

## What changed

- Uses the approved campaign hero image with separate desktop, tablet, and mobile crops.
- Sizes photographs, portraits, architectural renderings, and document scans according to their content type.
- Makes portrait images prominent without stretching or forcing them into wide empty frames.
- Keeps newspaper and document images uncropped and legible.
- Rebuilds the school gallery around the renderings' natural wide proportions.
- Uses a balanced desktop community-photo mosaic and full-width mobile cards.
- Revises the local-business, public-access, and taxpayer-accountability platform copy.
- Consolidates the overlapping taxation and transparency material into one stronger accountability section without removing any substantive commitment.
- Retains a manual carousel with previous/next buttons, dots, keyboard controls, touch swiping, status announcements, and synchronized ARIA state.
- Uses newly versioned CSS and carousel JavaScript so immutable deployment caching cannot preserve earlier files.

## Original repair notes

The uploaded copy contained several WebP photographs saved under `.js` filenames. The browser therefore tried to parse binary image data as JavaScript, disabling the navigation, carousel, gallery, volunteer dialog, reveal effects, and other interactions. Those corrupt assets were replaced with real JavaScript, and the missing favicon and carousel file were restored.

## Main files

```text
index.html
thank-you.html
_headers
robots.txt
sitemap.xml
assets/css/styles.v9.css
assets/js/script.v3.js
assets/js/effects.v1.js
assets/js/volunteer-modal.v2.js
assets/js/gallery.v2.js
assets/js/record-carousel.v3.js
assets/photos/mike-foley-hero.v1.png
```

## Local validation

```powershell
npx serve .
node --check .\assets\js\script.v3.js
node --check .\assets\js\effects.v1.js
node --check .\assets\js\volunteer-modal.v2.js
node --check .\assets\js\gallery.v2.js
node --check .\assets\js\record-carousel.v3.js
```

## Before launch

Replace or confirm:

- `campaign-domain.example`
- `campaign@example.com`
- the campaign's legally approved authorization statement
- the final privacy wording
- every campaign claim, external link, photograph permission, and legal disclosure

The copyright ownership line is included. It is separate from the campaign authorization wording that must be supplied and approved before publication.
