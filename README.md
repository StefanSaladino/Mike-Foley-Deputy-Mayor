# Mike Foley for Deputy Mayor

Static campaign website prepared for Netlify production hosting.

## Current build

- 9-slide community record carousel
- Dedicated `*.carousel.v1.webp` carousel assets
- Smile Cookie and spring shoreline clean-up visuals replace the removed Beach Booster clippings
- Privacy policy and consent notice
- Lawn-sign / volunteer request form prepared for Netlify Forms
- Open Graph and social-card metadata
- Production cache and security headers

## Asset versioning

Production static assets use filename versioning (`*.v1.*`, `*.v2.*`, etc.). Query-string cache versions are not used. When an asset changes, increment its filename version and update references before deployment.

## Local preview

```powershell
python -m http.server 8000
```

Open `http://localhost:8000/`.


## Netlify deployment

This package is ready for Netlify drag-and-drop deployment. The deploy ZIP should contain the site files at the ZIP root (not nested inside another folder).


## Production domain

`https://mike4wasagabeach.ca`
