import { SEO } from './seo.mjs';
import { readJSON, collection } from './content.mjs';
export const img = (id) => (String(id).startsWith('/') || /^https?:/.test(id) ? id : `/assets/img/n${id.replace(':', '-')}.webp`);
export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export const arr = '<span class="arr" aria-hidden="true">→</span>';
export const withArr = (s) => esc(s.replace(/\s*→\s*$/, '')) + ' ' + arr;

const S = readJSON('settings/site.json');
export const SITE = { name: S.name, url: S.url, phoneUK: S.phoneUK, telUK: S.telUK, phoneIN: S.phoneIN, telIN: S.telIN, tagline: S.tagline, domainLabel: S.domainLabel };

export const SERVICES = [
  ['digital-marketing', 'Digital Marketing'], ['paid-media', 'Ads (Paid Media)'], ['video-creation', 'Video Creation'],
  ['ux-design', 'Web Design & UX'], ['web-development', 'Web Development'], ['corporate-films', 'Corporate Films'],
  ['consulting', 'Consulting'], ['software-development', 'Software Development'],
];
export const VERTICALS = [
  ['e-commerce', 'E-commerce'], ['b2b-saas', 'B2B & SaaS'], ['healthcare', 'Healthcare'], ['education', 'Education'], ['fintech', 'Fintech'],
];

export const CTA = S.cta;
export const CTA_SUB = S.ctaSub;
// slug, name, card image, headline, question, typical pause, what we change (from each industry's "card" fields)
export const IND = collection('industries').map(v => [v.slug, v.name.replace('&', 'and'), v.card.image, v.card.headline, v.card.question, v.card.pause, v.card.change]);
const IND_DD = IND.map(([s, n, , d]) => [s, n, d]);
const SYS = [['growth', 'GROWTH'], ['experience', 'EXPERIENCE'], ['transformation', 'TRANSFORMATION']];
const SVC_DD = SYS.map(([k, g]) => [g, collection('services').filter(x => x.sys === k).map(x => [x.slug, x.nav?.label || x.name, x.nav?.tagline || ''])]);
const chev = '<svg class="chev" width="9" height="5" viewBox="0 0 9 5" fill="none" aria-hidden="true"><path d="M.5.5l4 4 4-4" stroke="currentColor"/></svg>';

function header(active) {
  const cur = (k) => (k === active ? ' aria-current="page"' : '');
  const indPanel = `<div class="ddp" id="dd-ind" role="region" aria-label="Industries"><div class="wrap ddp-in">
      <div class="ddp-intro"><p class="mono c-muted">Industries</p><p class="ddp-h">Five industries, one method.</p><p class="ddp-s">Each industry decides in its own way. Start with yours.</p><a class="link" href="/industries/">See all industries ${arr}</a><a class="ddp-chk" href="/check/">Not sure which fits? Take the 2-minute hesitation check ${arr}</a></div>
      <div class="ddp-ind">${IND.map(([s, n, im, d, , pause]) => `<a class="ddi" href="/industries/${s}/"><span class="th"><img src="${img(im)}" alt="" loading="lazy"></span><b>${n}</b><span class="d">${d}</span><span class="pz"><em>Typical pause</em>${pause}</span></a>`).join('')}</div>
    </div></div>`;
  const svcPanel = `<div class="ddp" id="dd-svc" role="region" aria-label="Services"><div class="wrap ddp-in">
      <div class="ddp-intro"><p class="mono c-muted">Services</p><p class="ddp-h">Eight disciplines, three systems.</p><p class="ddp-s">Strategy, design, technology and film, each shaped by how people actually decide.</p><a class="link" href="/services/">See all services ${arr}</a><a class="ddp-chk" href="/check/">Not sure what you need? Take the 2-minute hesitation check ${arr}</a></div>
      <div class="ddp-svc">${SVC_DD.map(([g, items], gi) => `<div class="ddg"><p class="ddg-h mono-s">0${gi + 1}&nbsp;&nbsp;/&nbsp;&nbsp;${g}</p>${items.map(([s, n, d]) => `<a class="dds" href="/services/${s}/"><b>${n}</b><span>${d}</span></a>`).join('')}</div>`).join('')}</div>
    </div></div>`;
  const mrow = (label, href, k, sub) => sub
    ? `<div class="mrow" data-acc><button class="mrow-h" aria-expanded="false"><span>${label}</span>${chev}</button><div class="mrow-sub"><a class="all" href="${href}">See all ${label.toLowerCase()} ${arr}</a>${sub}</div></div>`
    : `<div class="mrow"><a class="mrow-h" href="${href}"${cur(k)}><span>${label}</span></a></div>`;
  return `<a class="skip" href="#main">Skip to content</a>
<div class="progress" aria-hidden="true"></div>
<header class="hdr">
  <div class="wrap hdr-in">
    <a class="logo" href="/" aria-label="Cognexa — home"><img src="${img('28:32')}" alt="Cognexa" width="276" height="62"></a>
    <nav class="nav" aria-label="Primary">
      <div class="ddw" data-dd><a href="/industries/" class="ddt"${cur('industries')} aria-haspopup="true" aria-expanded="false" aria-controls="dd-ind">Industries ${chev}</a>${indPanel}</div>
      <div class="ddw" data-dd><a href="/services/" class="ddt"${cur('services')} aria-haspopup="true" aria-expanded="false" aria-controls="dd-svc">Services ${chev}</a>${svcPanel}</div>
      <a href="/about/"${cur('about')}>About us</a>
      <a href="/approach/"${cur('approach')}>Behavioural principles</a>
      <a href="/contact/"${cur('contact')}>Contact</a>
      <a href="/thinking/"${cur('thinking')}>Thinking</a>
    </nav>
    <a class="btn btn-ink hdr-cta" href="/contact/">${CTA} ${arr}</a>
    <button class="burger" aria-label="Menu" aria-expanded="false" aria-controls="mmenu"><span></span><span></span><span></span></button>
  </div>
  <div class="dd-dim" aria-hidden="true"></div>
</header>
<div class="mmenu" id="mmenu">
  ${mrow('Industries', '/industries/', 'industries', IND_DD.map(([s, n], i) => `<a href="/industries/${s}/"><small>${String(i + 1).padStart(2, '0')}</small>${n}</a>`).join(''))}
  ${mrow('Services', '/services/', 'services', SVC_DD.flatMap(([, items]) => items).map(([s, n], i) => `<a href="/services/${s}/"><small>${String(i + 1).padStart(2, '0')}</small>${n}</a>`).join(''))}
  ${mrow('About us', '/about/', 'about')}
  ${mrow('Behavioural principles', '/approach/', 'approach')}
  ${mrow('Contact', '/contact/', 'contact')}
  ${mrow('Thinking', '/thinking/', 'thinking')}
  <div class="mm-act"><a class="btn" href="/contact/">${CTA} ${arr}</a><a class="mm-chk" href="/check/">Take the 2-minute hesitation check ${arr}</a><p class="mono-s c-grey2">London, UK&nbsp;&nbsp; Bangalore, India</p><a class="mm-priv" href="/privacy/">Privacy policy</a></div>
</div>`;
}

export function footer({ fit = false } = {}) {
  return `<footer class="ftr">
  <div class="wrap">
    ${fit ? `<div class="fit">
      <p class="mono c-grey2 rv">Fit call</p>
      <h2 class="rv" style="--d:1">Not sure where to start?<br><span class="c-grey2">Book a 15-min fit call.</span></h2>
      <p class="rv" style="--d:2">Bring us the brief as you see it. In 15 minutes we will tell you whether behavioural work is the right next step.</p>
      <a class="btn btn-pill rv" style="--d:3" href="/contact/">Book a 15-min fit call ${arr}</a>
    </div>
    <div class="ftr-rule"></div>` : ''}
    <nav class="ftr-map" aria-label="Site map">
      <div><p class="mono-s">Industries</p>${IND.map(([s, n]) => `<a href="/industries/${s}/">${n}</a>`).join('')}<a href="/industries/">All industries</a></div>
      <div><p class="mono-s">Services</p>${SVC_DD.flatMap(([, items]) => items).map(([s, n]) => `<a href="/services/${s}/">${n}</a>`).join('')}</div>
      <div><p class="mono-s">Company</p><a href="/about/">About us</a><a href="/approach/">Behavioural principles</a><a href="/case-studies/">Case studies</a><a href="/thinking/">Thinking</a><a href="/contact/">Contact</a></div>
      <div><p class="mono-s">Start here</p><a href="/contact/">${CTA}</a><a href="/check/">2-minute hesitation check</a><a href="/thinking/why-shoppers-hesitate/">Read: Why shoppers hesitate</a><p class="ftr-note">${CTA_SUB}</p></div>
    </nav>
    <div class="ftr-base">
      <p class="tl">${SITE.tagline}</p>
      <p class="of"><span>London, UK&nbsp; <a href="tel:${SITE.telUK}">${SITE.phoneUK}</a></span><span>Bangalore, India&nbsp; <a href="tel:${SITE.telIN}">${SITE.phoneIN}</a></span><span><a href="/">${SITE.domainLabel}</a></span><span><a href="/privacy/">Privacy policy</a></span></p>
    </div>
  </div>
</footer>`;
}

export function page({ title, desc, path, active = '', body, fitFooter = false, schema = [], crumbs = null }) {
  const seo = SEO[path];
  const full = seo ? seo[0] : (title === 'Cognexa' ? 'Cognexa: Behavioural Consumer Insights Agency' : `${title} - Cognexa`);
  if (seo) desc = seo[1];
  const ld = [...schema];
  if (path === '/') ld.push({ '@type': 'Organization', name: 'Cognexa', url: SITE.url, logo: SITE.url + img('28:32'), telephone: [SITE.telUK, SITE.telIN] },
    { '@type': 'WebSite', name: 'Cognexa', url: SITE.url },
    { '@type': 'ProfessionalService', name: 'Cognexa London', telephone: SITE.telUK, address: { '@type': 'PostalAddress', addressLocality: 'London', addressCountry: 'GB' } },
    { '@type': 'ProfessionalService', name: 'Cognexa Bangalore', telephone: SITE.telIN, address: { '@type': 'PostalAddress', addressLocality: 'Bangalore', addressCountry: 'IN' } });
  if (crumbs) ld.push({ '@type': 'BreadcrumbList', itemListElement: [['Home', '/'], ...crumbs].map(([n, u], i) => ({ '@type': 'ListItem', position: i + 1, name: n, item: SITE.url + u })) });
  const ldTag = ld.length ? `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': ld }).replace(/</g, '\\u003c')}</script>\n` : '';
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(full)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${SITE.url}${path}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(full)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${SITE.url}${img('22:17')}">
${ldTag}<meta name="theme-color" content="#f3eee6">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500&family=Instrument+Serif:ital@0;1&family=Outfit:wght@300;400&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/css/site.css">
<script defer src="/assets/js/site.js"></script>
</head>
<body>
${header(active)}
<main id="main">
${body}
</main>
${footer({ fit: fitFooter })}
</body>
</html>
`;
}
