# Mike Foley for Deputy Mayor

Static, dependency-free campaign website prepared for production deployment.

## Local preview

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000` in a browser.

## Validation

```bash
node --check assets/js/script.v3.js
node --check assets/js/effects.v1.js
node --check assets/js/volunteer-modal.v3.js
node --check assets/js/gallery.v2.js
node --check assets/js/record-carousel.v3.js
```

The volunteer and lawn-sign form is configured for Netlify Forms and submits to `thank-you.html`.
