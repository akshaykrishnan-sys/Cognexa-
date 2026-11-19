# Hosting on AWS Amplify

- Repo branch: `main` · Node 20+ · build `npm run build` · output folder `public` · no env vars.
- Domain: `cognexadigital.com` (www → apex).
- Redirects (301): `/services/ads-paid-media/<*>` → `/services/paid-media/<*>`, `/services/web-design-ux/<*>` → `/services/ux-design/<*>`, `/industries/ecommerce/<*>` → `/industries/e-commerce/<*>`, `/principles/<*>` and `/approach/<*>` → `/about/`. 404 page: `/404.html`.
- Cache 7 days: `/assets/img/*`, `/assets/video/*`, `/assets/svg/*`. HTML/CSS/JS: no long cache.

## Forms endpoint (to build on AWS)
The fit-call, about-contact and newsletter forms send
`POST /api/form` with `Content-Type: application/x-www-form-urlencoded`.
Fields always include `form-name` (`fit-call`, `about-contact`, `newsletter`) and `bot-field` (honeypot: if filled, return 200 and drop).
Return any 2xx on success; anything else shows the visitor an error with the phone numbers.

## Netlify-only parts (not active on AWS)
`/admin` (Decap CMS), `netlify/functions/*` (leads dashboard, `/api/check` quiz logging). The quiz works without them.
