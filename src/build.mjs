import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { home } from './home.mjs';
import { vertical, service, VERTS, SVCS, industriesLanding, caseStudies, caseStudy, privacy, CASES } from './inner.mjs';
import { ARTICLES, articlePage } from './articles.mjs';
import { hub, about, contact, thinking, article, thanks, notFound } from './pages.mjs';
import { SITE } from './lib.mjs';
import { check } from './check.mjs';
import { markItalics, unmatched } from './italics.mjs';
import { sizeImages } from './imgsize.mjs';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');
const routes = {};
routes['/'] = home();
routes['/services/'] = hub();
for (const s of SVCS) routes[`/services/${s.slug}/`] = service(s);
for (const v of VERTS) routes[`/industries/${v.slug}/`] = vertical(v);
routes['/industries/'] = industriesLanding();
routes['/case-studies/'] = caseStudies();
for (const c of CASES.filter(x => x.full)) routes[`/case-studies/${c.slug}/`] = caseStudy(c);
routes['/privacy/'] = privacy();
for (const a of ARTICLES) routes[`/thinking/${a.slug}/`] = articlePage(a);
routes['/about/'] = about();
routes['/contact/'] = contact();
routes['/thinking/'] = thinking();
routes['/thinking/why-shoppers-hesitate/'] = article();
routes['/check/'] = check();
routes['/thanks/'] = thanks();

for (const [r, html] of Object.entries(routes)) {
  const f = join(OUT, r, 'index.html');
  mkdirSync(dirname(f), { recursive: true });
  writeFileSync(f, sizeImages(markItalics(html)));
}
writeFileSync(join(OUT, '404.html'), sizeImages(markItalics(notFound())));
writeFileSync(join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /admin/\nSitemap: ${SITE.url}/sitemap.xml\n`);
writeFileSync(join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${Object.keys(routes).filter(r => r !== '/thanks/').map(r => `  <url><loc>${SITE.url}${r}</loc></url>`).join('\n')}\n</urlset>\n`);
writeFileSync(join(OUT, 'favicon.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#14161a"/><text x="32" y="45" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-size="40" fill="#f4a024">c</text></svg>`);
if (process.env.ITDEBUG) console.log('unmatched italics:', unmatched());
console.log(`Built ${Object.keys(routes).length + 1} pages`);
