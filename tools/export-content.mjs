// One-time seed: dump the hard-coded data modules into /content as named-field JSON.
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { toJSON, ROOT } from '../src/content.mjs';
import { VERTS } from '../src/data-verticals.mjs';
import { SVCS } from '../src/data-services.mjs';
import { ARTICLES } from '../src/articles.mjs';
import { CASES } from '../src/inner.mjs';
import { SITE, IND, CTA, CTA_SUB } from '../src/lib.mjs';
import { SEO } from '../src/seo.mjs';
const C = join(ROOT, 'content');
const w = (rel, o) => { const f = join(C, rel); mkdirSync(join(f, '..'), { recursive: true }); writeFileSync(f, JSON.stringify(o, null, 2) + '\n'); };
const P = (id) => `/assets/img/n${id.replace(':', '-')}.webp`;
VERTS.forEach((v, i) => { const c = IND.find(x => x[0] === v.slug); w(`industries/${v.slug}.json`, { order: i + 1, ...toJSON('industry', v), card: { image: P(c[2]), headline: c[3], question: c[4], pause: c[5], change: c[6] } }); });
SVCS.forEach((s, i) => w(`services/${s.slug}.json`, { order: i + 1, ...toJSON('service', s) }));
ARTICLES.forEach((a, i) => w(`articles/${a.slug}.json`, { order: i + 1, date: '2026-10-0' + (i + 1), author: 'Cognexa team', draft: false, ...toJSON('article', a), image: `/assets/img/${a.ig}.webp`, ig: undefined }));
const story = [['THE BRIEF', 'Steady traffic, flat checkout', 'A fashion and D2C brand had steady traffic and a healthy basket, yet checkout completion stayed flat. The team assumed the payment form was too long.'], ['WHAT WE SAW', 'Doubt sat at three points', 'Observation and shopper interviews showed people pausing at the total, the return terms and the payment step. Each pause came from a quiet question about what happens if something goes wrong.'], ['WHAT WE CHANGED', 'Three small, tested changes', 'We showed the total earlier, placed the return terms beside the button and kept the payment step familiar. Each change was tested against one agreed behaviour.'], ['WHAT MOVED', 'Completion rose, questions fell', 'Checkout completion rose by 23% over the test period and support questions about returns fell. The team kept the changes and applied the same method to the product page.']];
CASES.forEach((c, i) => {
  const slug = c.slug || c.h.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const base = { order: i + 1, slug, published: !!c.full, industry: c.ind, kicker: c.k, title: c.h, measure: c.m, lever: c.lv, chart: { before: c.b, after: c.a } };
  if (c.full) Object.assign(base, {
    image: P('191:39'), imageAlt: 'A shopper reviewing an order on a laptop at home',
    summary: 'A fashion and D2C brand saw shoppers reach checkout and stop. We found the doubt and made the last step feel safe.',
    services: 'Consulting, Web Design and UX', timeline: '8 weeks (sample)',
    results: [{ value: '23', prefix: '+', suffix: '%', label: 'checkout conversion' }, { value: '17', prefix: '', suffix: '%', label: 'fewer returns questions to support' }, { value: '8', prefix: '', suffix: ' weeks', label: 'to first measurable result' }],
    story: story.map(([label, title, text]) => ({ label, title, text })),
    figure: { title: 'CHECKOUT COMPLETION', before: '2.6%', after: '3.2%', caption: 'Figure 1. Checkout completion before and after the changes (illustrative).' },
    note: 'Illustrative figures. Replace with approved client results before publishing.',
  });
  w(`cases/${slug}.json`, base);
});
w('settings/site.json', { name: SITE.name, url: SITE.url, phoneUK: SITE.phoneUK, telUK: SITE.telUK, phoneIN: SITE.phoneIN, telIN: SITE.telIN, cta: CTA, ctaSub: CTA_SUB, tagline: 'Behavioural Science × AI × Digital Transformation', domainLabel: 'cognexadigital.com' });
w('settings/seo.json', { pages: Object.entries(SEO).map(([path, [title, description]]) => ({ path, title, description })) });
