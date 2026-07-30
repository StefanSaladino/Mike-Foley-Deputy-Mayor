# Mike Foley for Deputy Mayor

Static, dependency-free campaign website prepared for GitHub Pages preview and later Netlify deployment.

## Current features

- Campaign homepage with Mike Foley's experience, priorities and community record
- Eleven-slide accessible community-record carousel
- Dedicated Wavelength Technologies business feature
- Dedicated life-saving newspaper feature
- Privacy policy and first-visit privacy notice
- Netlify-ready free lawn-sign request form with personal-information consent
- Open Graph and social-card metadata
- Versioned CSS/images and production cache/security headers

## Local preview

```bash
python -m http.server 8000
```

Open `http://localhost:8000/`.

## Validation

```bash
node --check assets/js/script.v3.js
node --check assets/js/effects.v1.js
node --check assets/js/sign-request.v1.js
node --check assets/js/gallery.v2.js
node --check assets/js/record-carousel.v3.js
node --check assets/js/privacy-consent.v1.js
```

The sign form uses the Netlify form name `lawn-sign-request` and submits to `thank-you.html`.
